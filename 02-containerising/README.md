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
# check out all containers
docker ps;
# check out the stats for the supermario container
docker top supermario;
```

To see a live stream of the container's metrics, run:

```bash
# check out the statistics for all containers
docker stats;
```

### 1.3 What else is available
See what other resources we have:

```bash
docker container ls;
docker images;
docker volume ls;
docker network ls;
```

## Activity 2: Crafting a Dockerfile
We proceed with creating our own Dockerfile.

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

> This indicates we wish to use [Alpine Linux](https://alpinelinux.org/) 3.2 as our base system. 

From the same directory as the `Dockerfile`, run the following to build our first image:

```bash
docker build --tag myimg:a32 .;
```

> This tells Docker to tag the created image with a string, `"myimg"`. This is useful for referring to the image in later stages.

### 2.2 Runtime Installation
Install Node which we will be using by appending the following to the `Dockerfile`:

```dockerfile
RUN apk add --no-cache nodejs
```

> `apk` is the package manager for Alpine.

Run the build command again and observe the difference in output:

```bash
docker build --tag myimg:a32 .;
```

> We can see that with this new `RUN` directive, there was one more step in the build process. Every directive runs in its own step, and this has implications for optimisation which we will cover later.

Test out the Node installation by creating an interactive shell into the container:

```bash
docker run -it myimg:a32;
```

> The `-it` flag tells Docker to create an **I**n**t**eractive shell into the resultant container.

Run `node` and experiment with it.

### 2.3 Dependencies Installation

```dockerfile
WORKDIR /app
COPY ./example-app /app
RUN npm install
```

Attempt to build it again:

```bash
docker build --tag myimg:a32 .;
```

Oops! Looks like we are getting some errors with this `gyp` thingy. Let's install it.

### 2.4 Runtime Dependencies Tweaking
Occassionally, some dependencies may require native build tools like `gyp-node`, which is the compiler for native C++ addons for Node. Let's install this runtime dependency now since we currently understand the application a little better.

Looking at the error message, we'll realise that some `python` is required. No it's not a snake.

After line 2, where we are installing system dependencies via `apk`, add another line to install python:

```dockerfile
RUN apk add --no-cache python
```

Run the build again:

```bash
docker build -t myimg:a32 .;
```

You should now see an error regarding `make`. When will this stop? Add another line after the line installing `python`:

```dockerfile
RUN apk add --no-cache make
```

Run the build again:

```bash
docker build -t myimg:a32 .;
```

And well, yet again we are faced with yet another error, this time requesting for `g++`. Let's give `g++` to it. Add another line below the line installing `make`:

```dockerfile
RUN apk add --no-cache make
```

Run the build again:

```bash
docker build -t myimg:a32 .;
```

At last.

Observant as you may be, you might have said, why not concatenate all the installs into a single line:

```dockerfile
RUN apk add --no-cache nodejs python make g++
```

This is because every layer is cached. Observe your last Docker build output and you'll notice the following line:

```
Step 2/8 : RUN apk add --no-cache nodejs
 ---> Using cache
...
```

We added the runtime dependencies incrementally so that Docker can cache our previous layers, hastening our build. If we had added it onto the initial line, we'd have done a rebuild every single time, wasting precious time.

### 2.5 Entrypoint Configuration
Now that the build succeeds, we need to tell Docker how to run our application. We use the directive `ENTRYPOINT`. Add the following line to your `Dockerfile`:

```dockerfile
ENTRYPOINT ["node", "index.js"]
```

Build your image:

```bash
docker build -t myimg:a32 .;
```

If you couldn't get to this stage and need to catch up, run the following two commands instead:

```bash
cp ./dockerfiles/activity-2.5.Dockerfile ./Dockerfile;
docker build -t myimg:a32 .;
```

Now let's run the application:

```bash
docker run myimg:a32;
```

Note that we remove the `-it` flag now since we no longer need Docker to be interactive.

You should now see that an error has happened! Why is that so?

### 2.6 Debugging & Fine-Tuning
Let's debug Docker, run:

```bash
docker run --entrypoint=/bin/sh -it myimg:a32;
```

Note that we specify the `-it` flag again because we want an interactive shell from `/bin/sh`.

Once in the container, run:

```bash
node -v
```

You'll see that we are at Node `v0.12.10` which doesn't allow the keyword `const` in strict mode.

> **Learning Point**: Base Docker images come with their own sets of repositories, different versions of the system may contain different versions of runtimes, so choose your base image according to your requirements!

Run `exit` in your container to get out of it and let's update Alpine to the latest version, `alpine:3.8`. Change the first line in your `Dockerfile` to use `alpine:3.8` instead.

> **Learning Point**: Note that this time round, no ` ---> using cache` messages can be seen. This is because we changed the base image, hence everything after that step has to be re-run by Docker.

Run the build (note the change from `a32` to `a38`):

```bash
docker build -t myimg:a38 .;
```

You'll see that `npm` is now not installed. This is because Node at `v0.12.x` shipped with `npm`, but at the latest version, `v8.11.4`, NPM is now separate from Node. Go ahead add a line below the line adding the `g++` package:

```dockerfile
RUN apk add --no-cache npm
```

Run the build again:

```bash
docker build -t myimg:a38 .;
```

It should now work. Let's run our image:

```bash
docker run myimg:a38;
```

It should say `HELLO`. Finally.

### 2.7 Optimisation
Now that our image can be built and instantiated into a container successfully, let's see what other optimisations we can make.

If you couldn't catch up, run the following command to get to where we should be:

```bash
cp ./dockerfiles/activity-2.6.Dockerfile ./Dockerfile;
```

#### 2.7.1 Line Concatenations
We observe that the lines 2 to 6 can be concatenated into one. Let's do this so that your line 2 looks like this:

```dockerfile
RUN apk add --no-cache nodejs python make g++ npm
```

This reduces the number of layers and hence download overheads when someone pulls your image.

#### 2.7.2 Dependency Optimisation
When working with Docker, we seem to have to run the `npm install` every single time we make a change to the code since the Docker cache is not activated since the `COPY` directive checks for the integrity of the files since the last `docker build` was run.

> `package.json` is the file for Node which defines the dependencies. If the file did not change, the dependencies will remain the same.

To optimise this, we first `COPY` in the `package.json`, so that if the `package.json` did not change, we can make use of the Docker cache. Modify your `COPY` command so that it looks like this:

```dockerfile
COPY ./example-app/package.json /app/package.json
COPY ./example-app/package-lock.json /app/package-lock.json
```

Next, add another line just before the `ENTRYPOINT` line:

```dockerfile
COPY ./example-app /app
```

Now any changes you make in the code will not cause `npm install` to run.

Run the build:

```bash
docker build -t myimg:a38 .;
```

Now change the file at `./example-app/index.js` (relative to this directory), so that the `"HELLO"` says `"WORLD"` instead.

Run the build:

```bash
docker build -t myimg:a38 .;
```

Notice that the `npm install` did not run. Try reversing the command to before this step and try the same. `npm install` will take a load of time. As always.

#### 2.7.3 Size Reduction
One of the best practices in writing `Dockerfile`s is keeping your image size small. This makes it easy to pull your image from wherever it is stored.

Run the following to see the size of your image:

```bash
docker images | grep myimg | grep a38
```

You'll see that it takes up roughly 250MB. That's huge. Let's reduce that size. This process can be time consuming, involving executing into your Docker container and checking out what's keeping the size up. However, some quick wins can be done.

Recall that we installed `python`, `make`, `g++` and `npm`, however we don't seem to be using any of them in our `ENTRYPOINT` directive.

Let's remove them. Add a line to the `Dockerfile`:

```dockerfile
RUN apk remove python make g++ npm
```

Run the build (note the change from `a38` to `a38.2` so we can see the size difference):

```bash
docker build -t myimg:a38.2 .;
```

Amazingly, nothing has changed.

> **Learning Point** Docker works in layers. Because our `RUN` directive that installs the runtime dependencies are in a separate directive from the `RUN` directive that removes them, no size difference is noticed since they're just layers of differences stacked upon one another.

Let's refactor the `Dockerfile` so that they can be in the same line. This is a complete change in the `Dockerfile` and it should look like this:

```dockerfile
FROM alpine:3.8
WORKDIR /app
COPY ./example-app/package.json /app/package.json
COPY ./example-app/package-lock.json /app/package-lock.json
RUN apk add --no-cache nodejs python make g++ npm \
  && npm install \
  && apk del nodejs python make g++ npm
COPY ./example-app /app
ENTRYPOINT ["node", "index.js"]
```

Notice how we strung together all the `RUN` directives while maintaining the `COPY` optimistaion. Now build your application with a `.3` appended to the image tag:

```bash
docker build -t myimg:a38.3 .;
```

Notice how this takes awhile.

> **Learning Point** At this point we are doing production optimisations, we should be left till when the code base is stable and dependencies don't change as much

Check out the size of the image now:

```bash
docker images | grep myimg | grep a38
```

That's a huge optimisation isn't it?