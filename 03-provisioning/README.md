# Provisioning a Development Environment

## Activity 1: Adding support services

### 1.1 Pull image
Run the following to pull the official WordPress image

```bash
docker pull wordpress:latest;
```

### 1.2 Run it
Run the following to get up a WordPress installation:

```bash
docker run \
  --publish 8081:80 \
  wordpress:latest;
```

Now visit the site at [http://localhost:8081](http://localhost:8081).

Is everything working?

### 1.3 Add Database

```bash
docker run \
  -e MYSQL_ROOT_PASSWORD=password \
  -e MYSQL_USER=user \
  -e MYSQL_PASSWORD=password \
  -e MYSQL_DATABASE=wordpress \
  --publish 3307:3306 \
  --name mysql \
  -d mysql:5.7.20;

docker run \
  -e WORDPRESS_DB_HOST=mysql \
  -e WORDPRESS_DB_USER=user \
  -e WORDPRESS_DB_PASSWORD=password \
  -e WORDPRESS_DB_NAME=wordpress \
  --publish 8080:80 \
  --link mysql:mysql \
  --name wordpress \
  wordpress:latest;
```

Now visit the site at [http://localhost:8081](http://localhost:8081).

## Activity 2: Using a Compose File
