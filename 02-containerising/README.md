# Containerising an application
Containers are similar to VMs, except that while VMs create new kernels, containers typically share kernels and operating level resources with the host system. This results in faster boot times in exchange for lower levels of isolation.

# Section Objectives

1. Concepts in container technologies
2. Introduction of the Dockerfile
3. Understand and use basic Docker commands
4. Build, configure and deploy a container
5. Optimising image specification files

# Concepts and Introduction to Docker

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
| `exec -it` | Executes into a specified container |

# Activity 1: Using an existing Docker Image
[Click here for Activity #1](./ACTIVITY-01.md).

# Activity 2: Crafting a Dockerfile
[Click here for Activity #2](./ACTIVITY-02.md).

# Next Steps
Click here to move onto [Provisioning an Environment](../03-provisioning/README.md).
