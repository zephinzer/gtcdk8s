# Activity 2: Provisioning a Development Environment
In this activity, we see how we can provision an environment for developers to use given a set of Docker Compose files which already work in production.

The example application can be found at `./example-app` relative to this directory.

Your primary task is to create a `docker-compose.yml` located at `./example-app/provisioning/compose/docker-compose.yml` to run the application.

## 2.1 Understanding the Application
From the files in `./example-app`, we are looking at a JavaScript application - we observe a `./package.json` which is the dependency specification file for Node apps.

We also see a `./webpack.config.js`. Webpack is a bundler for JavaScript which is able to bundle together multiple source files, minimise it, as well as convert experimental language features into JavaScript that browsers understand.

We also observe that the `./index.js` file should be a Node file given that it imports supporting services such as MySQL.

### 2.1.1 Mono-Repo Repository Pattern
From the presence of both front-end and back-end components, we can infer that this application follows a mono-repo repository pattern, meaning that there should be two different deployments we should get out of this - one for the UI and one for the API.

Let's take look at the `./package.json` file.

### 2.1.2 Running Locally
Before provisioning a development environment, we often need to run it locally to see its performance and behaviour first. From the `./package.json` file, we notice some commands in the `scripts` property:

- We can build the UI (`build:ui`)
- There is a database involved which requires we are able to:
  - Run a schema migration (`db:migrate`)
  - Run a database seed (`db:seed`)
- We can run the API component with `dev:api`
- We can run the UI component with `dev:ui`

If you have Node installed locally, let's test them out. Run the following to install the dependencies:

```bash
npm install;
```

Let's start the API now:

```bash
npm run dev:api;
```

Access it at [http://localhost:8000](http://localhost:8000) using cURL in another terminal:

```bash
curl -vv http://localhost:8000/healthz;
```

Check on it's readiness status:

```bash
curl -vv http://localhost:8000/readyz;
```

We notice here a failure to connect to the database:

```json
{"database":{"status":false,"data":{"code":"ECONNREFUSED","errno":"ECONNREFUSED","syscall":"connect","address":"127.0.0.1","port":3306,"fatal":true}}}
```

Let's check out the file at `./example-app/knexfile.js`. Knex is a query builder for Node that handles database migrations and seeds, as well as the databsae connections.

We can see that it is expecting there to be a database which it can find at `localhost:3306` with a database schema `blog` and it's trying to access it using the credentials `username:password`.

### 2.1.3 Provisioning Support Services
Let's provision a database for our API so that we can run the migrations and seeds.

Create a file named `docker-compose.yml` at `./provisioning/compose` relative to the `./example-app` directory with the following content:

```yaml
verison: "3"
services:
  database:
    image: mysql:5.7.23
    environment:
      - MYSQL_ROOT_PASSWORD=password
      - MYSQL_DATABASE=blog
      - MYSQL_USER=username
      - MYSQL_PASSWORD=password
    volumes:
      - "../data/mysql:/var/lib/mysql"
    ports:
      - "3306:3306"
```

This sets up a database as what we see in the default configuration of Knex.

Spin up the database using:

```bash
docker-compose -f ./provisioning/compose/docker-compose.yml up
```

Close the previously opened application (`ctrl + c`) and start it again:

```bash
npm run dev:api;
```

In a new terminal window, run the readiness check with cURL again:

```bash
curl -vv http://localhost:8000/readyz;
```

The output should now be:

```json
{"database":{"status":true,"data":null}}
```

### 2.1.4 Confirming how it works locally
Let's run our migrations and seeds now. Close the application with `ctrl + c` and run the following:

```bash
# run the migrations
npm run db:migrate;
# run the seeds
npm run db:seed;
```

You should see the migration yield:

```
Batch 1 run: 1 migrations
...
```

The seeds should then yield:

```
Ran 1 seed files
...
```

Let's now run the API again:

```bash
npm run dev:api;
```

In yet another terminal, let's run the UI:

```bash
npm run dev:ui;
```

Access the UI at [http://localhost:8080](http://localhost:8080).

You'll see our seed posts. Try the user interface - create a new post, delete a post, modify a post, refresh the page to see all posts. We are now saving to our provisioned database via our API.

## 2.2 Provisioning the Development Environment
It should now be obvious this is a service with a database, a UI component, and an API component. We've already got the database running as part of our Compose file. Let's proceed by adding the API component.

### 2.2.1 Creating the Dockerfile
A `Dockerfile` exists `./provisioning/images/` relative to the `./example-app` directory with the following content:

```dockerfile
FROM node:8.11.4-alpine
ARG ENV_FLAG="--production"
WORKDIR /app
COPY ./package.json /app/package.json
COPY ./package-lock.json /app/package-lock.json
RUN npm install ${ENV_FLAG}
COPY . /app
```

This is a pretty basic setup which simply installs the dependencies for us.

### 2.2.2 Provisioning the `dev-api` Service
Add the following service to your earlier created `./provisioning/compose/docker-compose.yml`:

```yaml
  dev-api:
    # build the Dockerfile we created earlier
    build:
      context: ../../
      dockerfile: ./provisioning/images/Dockerfile
      args:
        ENV_FLAG: '--development'
    # its development and live-reload would be nice!
    entrypoint: ["./node_modules/.bin/nodemon", "--exec", "npm", "run", "dev:api"]
    # telling knex where to find the database (optional)
    environment:
      - DB_HOST=database
      - DB_PORT=3306
      - DB_USER=username
      - DB_PASSWORD=password
      - DB_DATABASE=blog
    # the port which the service listens to by default
    ports:
      - "8000:8000" # HOST:CONTAINER
    # map the volumes so that we have live reloading
    volumes:
      - "../../db:/app/db"
      - "../../index.js:/app/index.js"
      - "../../knexfile.js:/app/knexfile.js"
      - "../../webpack.config.js:/app/webpack.config.js"
    # we need the database to be up before the API is of any use
    depends_on:
      - database
```

Shut down the running API service (`ctrl + c`) and restart the `doker-compose` by hitting `ctrl + c` on the Docker output. Then run the following to restart the provisioned services:

```bash
docker-compose -f ./provisioning/compose/docker-compose.yml up dev-api;
```

Notice that we appended the commmand with `dev-api`. Since the `dev-api` service depends on the database, the database will be started too, but the logs will be hidden from us so that the output doesn't get too convoluted.

Access the UI again at [http://localhost:8080](http://localhost:8080). Does it work?

It does, and that's because of the lines:

```yaml
ports:
  - "8000:8000"
```

This maps the port 8000 of the container (the second `8000`) to port `8000` of our local machine (the first `8000`). You could change the first `8000` to `8001` and it would break the service.

### 2.2.3 Provisioning the `dev-ui` Service
Next we come to the UI service. This is a front-end service which in development runs on `webpack-serve` (see `./webpack.config.js` for details). For modern development with JavaScript, this usually involves the running of a WebSocket server which incrementally updates the front-end being viewed, with a back-end HTTP server which serves the files.

Hence, we know that we will need two ports as compared to the `dev-api` service which required just one.

Add the following service definition to the Compose file at `./provisioning/compose/docker-compose.yml`:

```yaml
  dev-ui:
    # use the same Dockerfile - reuse, reduce and recycle!
    build:
      context: ../../
      dockerfile: ./provisioning/images/dev.Dockerfile
      args:
        ENV_FLAG: '--development'
    # different from dev-api
    entrypoint: ["npm", "run", "dev:ui"]
    environment:
      - API_URL="http://localhost:8000"
      - NODE_ENV="development"
    # expose ports required by webpack-serve
    ports:
      - "8080:8080" # project port for the UI
      - "8081:8081" # websocket port for hot reloading
    # map the volumes so that we have hot reloading
    volumes:
      - "../../src:/app/src"
      - "../../webpack.config.js:/app/webpack.config.js"
    depends_on:
      - dev-api
```

> Note that in the environment property we are setting two variables, `API_URL` and `NODE_ENV`. These are some application specific settings which can be found in line 91 of the file `./webpack.config.js` and are unique to this application. These are provided in the interest of time, and in a real-life scenario, one will have to comb through the code to discover these. 

### 2.3 Running the provisioned environment
Now that we've got all the components in place for our simple example application service, let's add a command to the `./package.json` file to make it easy for developers to start working on the code. Under the `scripts` property, add in the following key-value pair so it looks like:

```json
...
"scripts": {
  ...,
  "dev": "docker-compose -f ./provisioning/compose/docker-compose.yml up dev-api dev-ui"
},
...
```

Finally, run:

```bash
npm run dev;
```

Visit [http://localhost:8080](http://localhost:8080) and you should see our example blog in all it's container glory.

### 2.4 Additional challenge
For an additional take-home challenge, try to containerise the database migration and seeding so that we can run them as a job before `npm run dev` starts so that developers can simply start the application and have the migrations and seeds run autoamtically!

#### Objective
Be able to run `npm run dev` from a clean slate and have migrations and seeds in the database before the application starts.

#### General Steps
1. Create a new service which runs the migrations
2. Add a `predev` script into `./package.json`
3. Set the `predev` script to run the database updating service

#### Answers
> A completed working Docker Compose file can be found at [./composes/activity-2.challenge.docker-compose.yml](./composes/activity-2.challenge.docker-compose.yml)

> A completed working `package.json` file can be found at [./.example-app/package.json](./.example-app/package.json)

# Troubleshooting
If you encounter an error as follows:

```
IOError: Can not read file in context: /path/to/gtcdk8s/03-provisioning/example-app/provisioning/data/mysql/ca-key.pem
```

This is an issue that happens because of Docker being run as `root`. To resolve this, run the following from the `./example-app` directory:

```bash
sudo rm -rf ./provisioning/data/mysql/*;
```

Another UNIX-specific trick would be to force MySQL to run as the same user as yourself. This can be achieved by setting a `user` property under the `database` service to the value of your user ID. You can check your user ID by running `id -u` in your terminal.

- - -

# Next Steps

We're done here [back to the main Section on Provisioning Environments](./READNE.md).