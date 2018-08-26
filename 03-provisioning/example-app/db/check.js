const mysql = require('mysql2');
const dbConfig = require('../knexfile');

const MAX_RETRIES = 50;

console.info('database details');
console.info(dbConfig.connection);
process.stdout.write('\nwaiting for db..');
(function waitForDatabase(iteration = 0) {
  mysql.createConnection(dbConfig.connection)
    .query('SELECT 1', (err, results) => {
      if (err) {
        if (iteration++ === MAX_RETRIES) {
          console.error(' not found.');
          process.exit(1);
        } else {
          setTimeout(() => {
            process.stdout.write('.');
            waitForDatabase(iteration);
          }, 500);
        }
      } else {
        console.info(' done.');
        process.exit(0);
      }
    });
})();
