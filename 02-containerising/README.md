# Containerising an application
Containers are similar to VMs, except that while VMs create new kernels, containers typically share kernels and operating level resources with the host system. This results in faster boot times in exchange for lower levels of isolation.

## Section Objectives

1. Concepts in container technologies
2. Introduction of the Dockerfile
3. Understand and use basic Docker commands
4. Build, configure and deploy a container
5. Optimising image specification files

## Model of Container Technologies
There are three main entities in container technologies - the image specification, the image, and the container.

The image specification is a blueprint of what the image will contain. Developers run `docker build` to create the image.

The image is a result of the build process. Think of images as logical classes which can then be instantiated by `docker run` into a container.

Containers are basically instances of images, implying that multiple containers can be generated from an image.

## Introduction to the Dockerfile
The Dockerfile is a directive based image specification file that tells Docker how an image should be built. Thus, the Dockerfile will contain some, all, or more of the following basic directives:

| Directive | Description |
| --- | --- |
| `FROM` | Indicates which operating system we should be using |
| `ARG` | Specifies build-time only arguments |
| `ENV` | Specifies environment variables that persist after build-time |
| `RUN` | Indicates commands to be run when `docker build` is executed |
| `COPY` | Copies files from your local machine into the image |
| `ENTRYPOINT` | Specifies the command to be run when the image is instantiated into a container. |
| `WORKDIR` | Specifies the working directory - where the container should start from |

## Understand Basic Docker Commands
Here are some basic CLI commands to get started. We will cover their practical use cases in the activites of this section. All of the following commands should be prefixed with `docker` when executing in your terminal.

| Command | Description |
| --- | --- |
| `build` | Builds a Dockerfile |
| `container ls` | Lists all running containers |
| `container ls -a` | Lists all containers |
| `network ls` | Lists all networks |
| `image ls` | Lists all images |
| `volume ls` | Lists all volumes |
| `top <CONTAINER_ID>` | Shows statistics on all running containers |
| `run` | Instantiates an image into a container |
| `exec` | Executes into a specified container |

## Activity 1: Using an existing Container Image
This section will introduce Docker and some common commands

### 1.1 Pulling/Running a Container Image
Let's have some fun. Run the following in your terminal to *"pull"* an image - basically retrieving the image from the Internet to your local machine:

```bash
docker pull bharathshetty4/supermario;
```

Next, we run the pulled image, indicating that the resultant container should be named `"supermario"` and should publish itself on the host's (your machine's) port 8080 using its own (the container's) port 8080. The format is `"HOST_PORT":"CONTAINER_PORT"`:

```bash
docker run \
  --publish 8080:8080 \
  --name supermario \
  -d bharathshetty4/supermario;
```

After the above command finishes running, open your browser at [http://localhost:8080](http://localhost:8080).

### 1.2 Monitoring the Container
Run the following to check out what's running and the status of the `"supermario"` container we created earlier:

```bash
docker ps;
docker top supermario;
```

### 1.3 What else is available
See what other resources we have:

```bash
docker container ls;
docker image ls;
docker volume ls;
docker network ls;
```

## Activity 2: Crafting a Dockerfile
When containerising an application, the following are our considerations:

1. Base System
2. Runtime Installation
3. Runtime Dependencies
4. Application Dependencies
5. Entrypoint Configuration
6. Optimisation

Create a new `Dockerfile` file in this directory.

### 2.1 Define Base System
Append the following to the created `Dockerfile` (it should be empty at this point):

```dockerfile
FROM alpine:3.2
```

### 2.2 Runtime Installation
Install Node which we will be using by appending the following to the `Dockerfile`:

```dockerfile
RUN apk add --no-cache nodejs
```

Run `docker build -t mynode:a32 .` (note the trailing period) in this directory.

Test out the Node installation by creating an interactive shell into the container:

```bash
docker run -it mynode:a32;
```

Run `node` and experiment with it.

### 2.3 Runtime Dependencies

```dockerfile
WORKDIR /app
COPY ./example-app /app
```

Build and run it in interactive mode:

```bash
docker build -t mynode:a32 . && docker run -it mynode:a32;
```

Note that we do not yet have a `./node_modules` directory.

### 2.4 Application Dependencies

```dockerfile
RUN npm install
```

Build and run it again:

```bash
docker build -t mynode:a32 . && docker run -it mynode:a32;
```

Note the newly created `./node_modules` directory.

### 2.5 Entrypoint Configuration

```dockerfile
RUN node index.js
```

Build and run it again:

```bash
docker build -t mynode:a32 . && docker run -it mynode:a32;
```

> If you couldn't get to this stage, run: `docker build -f ./dockerfiles/completed-alpine-3.2.Dockerfile -t mynode:a32 . && docker run -it mynode:a32;` instead.

You should now see that an error has happened!

Change the first line in your `Dockerfile` to use `alpine:3.7` instead.

> If you couldn't get to this stage, run: `docker build -f ./dockerfiles/completed-alpine-3.7.Dockerfile -t mynode:a37 . && docker run -it mynode:a37;` instead.

It should now work. Why?

### 2.6 Optimisation

There are three primary considerations when crafting new images. Images should be:

1. Lean
2. Small
3. Extensible

#### Lean
Being lean refers to functionality. Containers should do only one thing. This reduces the attack surface of the container.

#### Small
Small refers to file size. Try running the following to see the size of your image:

```bash
docker image ls -a | grep mynode
```

To demonstrate smallness and leaness, lets build an Ubuntu version (instead of Alpine) of our repository:

```bash
docker build -f ./dockerfiles/completed-ubuntu-16.04.Dockerfile -t mynode:u64 .;
```

Check the available image sizes:

```bash
docker image ls | grep mynode;
```

You'll notice that the images `a32` (Alpine 3.2) and `a37` (Alpine 3.7) are significantly smaller than the `u64` (Ubuntu 16.04) image.

Get into both containers in interactive mode and check out what's available:

```bash
docker run --entrypoint=/bin/sh -it mynode:a37 -l;
docker run --entrypoint=/bin/sh -it mynode:u64 -l;
```

Try to use `gcc`, `g++`, `python`.

Try running `ls -al /usr/bin | wc -l` in both containers to see how many binaries are available in each.

#### Extensible
Being extensible refers to how we can re-configure an application's behaviour without changing the code.

