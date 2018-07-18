# Effective Containerisation From Development To Production
> Courseware for a Docker & Kubernetes workshop.

## Synopsis
Developer-onboarding taking ages because of required supporting services? Having issues with "*but it works on my machine*"-like complaints? Searching for a way to deploy your application reliably and in an automated manner?

Sounds like you could do with some container technology! Enter the world of containerisation for both the development and production environment with this short workshop which will cover building container-based deployments friendly applications, containerising services effectively, and deploying them - all with good ol' shell scripting automation for good taste.

## Technologies Involved
- Shell Scripting
- Node.js
- Docker
- Kubernetes
- VirtualBox

## Workshop Objectives

| Objective | Details | Technology Used |
| :-------- | :------ | :-------------- |
| Prepare services for container-based deployments | Learn what goes into an application that works well in a container-based deployment model| Node.js |
| Containerise a custom web service with Docker | Learn how to containerise a custom web application using Docker | Docker |
| Provision supporting services with Docker | Learn how to provision and manage a development environment using Docker Compose so that developers can start working on actual code without caring about support services which your application depends on | Docker |
| Simulate a production deployment | Learn how to test-run a Kubernetes deployment without touching production (y'know, just in case) | Kubernetes |
| Automating & optimising container building | Learn how Docker and Kubernetes are used together in a continuous integration/delivery (CI/CD) pipeline to deliver working software | Docker, Shell Scripting |

## Target Audience
This is a hands-on workshop with the most utility for software engineers looking into the art of DevOps.

## Should Haves
### Skills
Participants should:
1. Be comfortable working with the command line
2. Have experience with software engineering
3. Have some experience with deployment and operations

### Machine
It is very highly recommended that you are on MacOS ([get a Mac](https://sg.carousell.com/search/products/?query=macbook%20pro%202015)). All commands have been tested to work for UNIX-based environments, but there are more issues you'll need to fix if you're using a Linux box. Use Windows at your own discretion - using a virtual machine is not encouraged since we will be running a virtual machine as part of this workshop.

### Software
It is highly recommended that the command `minikube start` works on your machine before the workshop as this workshop will be conducted in a constrained period of time.

Follow the instructions at [THIS PAGE](./00-setup/README.md) to get your machine ready for the workshop!
