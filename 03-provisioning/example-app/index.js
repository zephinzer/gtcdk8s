const {Boilerplate} = require('@usvc/boilerplate');
const mysql = require('mysql2');
const dbConfig = require('./knexfile');
const db = require('knex')(dbConfig);

Boilerplate.init({
  appCorsWhitelist: [
    'http://localhost:8080',
  ],
  appReadinessChecks: {
    database: () => {
      return new Promise((resolve) => {
        mysql.createConnection(dbConfig.connection)
          .query('SELECT 1', (err, results) => {
            resolve({
              status: (!err) && (results[0]['1'] === 1),
              data: err,
            });
          });
      });
    }
  },
});

const {app} = Boilerplate;

app.get('/posts', (req, res) => {
  db
    .select('*')
    .from('posts')
    .orderBy('created_at', 'desc')
    .then((results) => {
      res.json(results);
    });
});

app.get('/post/:id', (req, res) => {
  const {id} = req.params;
  db.select('*')
    .from('posts')
    .where({id})
    .then((results) => {
      res.json(results[0]);
    });
});

app.post('/post', (req, res) => {
  db
    .insert({
      content: req.body.content,
    })
    .returning([
      'id',
      'content',
      'created_at',
      'updated_at',
    ])
    .into('posts')
    .then((results) => {
      res.json(results[0]);
    });
});

app.put('/post/:id', (req, res) => {
  const {id} = req.params;
  const {content} = req.body;
  db('posts')
    .update({content})
    .where({id})
    .then((rowsUpdated) => {
      res.json(rowsUpdated === 1);
    });
});

app.delete('/post/:id', (req, res) => {
  const {id} = req.params;
  db('posts')
    .where({id})
    .delete()
    .then((rowsDeleted) => {
      res.json(rowsDeleted === 1);
    });
});

const port = process.env.SERVER_PORT || 8000;
const interface = process.env.SERVER_INTERFACE || '0.0.0.0';

const server = app.listen(port, interface);
server.on('listening', () => {
  console.info(`listening on http://localhost:${port}`);
});
