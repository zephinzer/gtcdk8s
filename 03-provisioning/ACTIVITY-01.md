# Activity 1: A Local WordPress Deployment

## 1.1 Find the Image
Go to [Docker Hub](https://hub.docker.com/) and search for Wordpress in the upper navigation bar.

You will probably see a search listing labelled with *"official"*. This *"official"* indicates that it is released by the Docker team themselves and is probably more reliable than other images you might find externally.

Clicking on the search listing will bring you to the image's page. You [can also click here if you're feeling lazy](https://hub.docker.com/_/wordpress/).

## 1.2 RTFM
The image's page on Docker Hub should tell you everything you need to know on how to pull the image and how to configure the container.

### 1.2.1 Understanding Tags
The first important thing to get out of the image's page is the supported tags. These tags indicate the variant of the image which can come in the form of differences in:

- base system *(eg. `ubuntu`, `alpine`, etc)*
- base system version *(eg. `16.04`, `3.2`, etc)*
- runtime version
- service version

### 1.2.2 Configuring an Image
The next point to note on the image's page is the available environment variables to configure the service's behaviour..

On the [WordPress image page](https://hub.docker.com/_/wordpress/) under the section **How to use this image**, we find a number of available configurations:

- `WORDPRESS_DB_HOST`
- `WORDPRESS_DB_USER`
- `WORDPRESS_DB_PASSWORD`
- `WORDPRESS_DB_NAME`
- *etc.*

These are values which we can use to configure WordPress. In the case of the above highlighted environment variables, this tells WordPress where to find the database.

## 1.3 Using the Image
We begin by creating a file named `docker-compose.yml` in the current directory.

Inside the file, the first thing we have to define is the version of the compose file. Add the following line to the compose file:

```yaml
version: "3"
```

This indicates to the Docker service that we wish to use features available in version 3 of `docker-compose`. The documentation for `docker-compose` is pretty awesome and you can [find a complete list of features here](https://docs.docker.com/compose/compose-file/).

Next we need to specify the service we are intending to deploy. Add the following lines to the compose file:

```yaml
services:
  blog:
    image: wordpress:4.9.8-php7.1-apache
    ports:
      - "8080:80/tcp"
```

The above spins up an arbitrarily named `"blog"` service that uses the image `wordpress` with the tag `4.9.8-php7.1-apache`. We also expose the port 8080 on our machines (host) that routes to port 80 inside the container (guest).

Let's use `docker-compose` to bring this up:

```bash
docker-compose up;
```

Once you see output belonging to a `blog` service, head over to [http://localhost:8080](http://localhost:8080) and marvel at your local WordPress deployment. No PHP or Apache installation needed.

Attempt to set up WordPress and we'll find ourselves blocked by a page requesting for database details. Dang.

Remember the section above on the environment variables that the `wordpress` image is configured with? Here's where they come in useful. But first, we need to spin up an instance of MySQL - or do we?

## 1.4 Adding Support Services

Append the `database` service to your Docker Compose as a key under the `services` property (confirm that the indentiation of the `database` word is the same as `blog`):

```yaml
  database:
    image: mysql:5.7.23
    environment:
      - MYSQL_ROOT_PASSWORD=password
      - MYSQL_DATABASE=blog
      - MYSQL_USER=username
      - MYSQL_PASSWORD=password
```

The environment variables we specified above can be retrieved from [the MySQL image page](https://hub.docker.com/r/library/mysql/).

Let's spin it up and check out what happens:

```bash
docker-compose up;
```

When the logs stop flowing, you should be able to see: `"mysqld: ready for connections"` followed by `"Version: '5.7.23'  socket: '/var/run/mysqld/mysqld.sock'  port: 3306  MySQL Community Server (GPL)"`.

Go over to [http://localhost:8080](http://localhost:8080) and fill up the database details we lacked earlier.

Change the **Database Name** to `"blog"`. This corresponds to the `MYSQL_DATABASE` environment variable we set for the MySQL image.

Change the **Database Host** to `"database"`. This corresponds to the name of the MySQL service which is the key in the key-value mapping under the `services` property.

Run the installation set the administration up and you should reach a page with **Success!** printed on it.

We're done here!

- - -

# Next Steps
Move on to [Activity 2: Provisioning a Development Environment](./ACTIVITY-02.md).

Or go [back to the main Section on Provisioning Environments](./READNE.md).
