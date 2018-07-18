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

## Topics
1. [A containerisable application](./01-application/README.md)
2. [Containerising an application](./02-containerising/README.md)
3. [Provisioning an environment](./03-provisioning/README.md)
4. [Deploying an application](./04-deploying/README.md)
5. [Continuous integration/delivery](./05-cicd/README.md)

## Workshop Objectives

| Objective | Details | Technology Used |
| :-------- | :------ | :-------------- |
| Prepare services for container-based deployments | Learn what goes into an application that works well in a container-based deployment model| Node.js |
| Containerise a custom web service with Docker | Learn how to containerise a custom web application using Docker | Docker |
| Provision supporting services with Docker | Learn how to provision and manage a development environment using Docker Compose so that developers can start working on actual code without caring about support services which your application depends on | Docker |
| Deploying with Kubernetes | Learn what is Kubernetes and experience a deployment on it | Kubernetes |
| Simulate a production deployment | Learn how to test-run a Kubernetes deployment without touching production (y'know, just in case) | Kubernetes |
| Automating & optimising container building | Learn how Docker and Kubernetes are used together in a continuous integration/delivery (CI/CD) pipeline to deliver working software | Docker, Shell Scripting |

## Target Audience
This is a hands-on workshop with the most utility for software engineers looking into the art of DevOps or seeking to learn how container technologies can result in developer happiness.

## Should Haves
### Skills
Workshop participants should:
1. Be comfortable working with the command line
2. Have experience with software engineering
3. Have some experience with deployment and operations

### Machine
It is very highly recommended that you are on MacOS ([get a Mac on Carousell](https://sg.carousell.com/search/products/?query=macbook%20pro%202015)). All commands have been tested to work for UNIX-based environments, but there are some issues you'll need to fix if you're using a Linux box and you need to be very comfortable with system internals for it to work out.

> Use Windows at your own discretion - using a virtual machine is not encouraged since we will be running a virtual machine as part of this workshop.

### Software
It is highly recommended that the command `minikube start` works on your machine before the workshop as this workshop will be conducted in a constrained period of time.

Follow the instructions at [THIS PAGE](./00-setup/README.md) to get your machine ready for the workshop!

## About The Workshop Facilitator
Joseph is a DevOps engineer hailing from the Agile Consulting & Engineering tribe at Government Digital Services. He spends his day optimising and maintaining CI/CD pipelines and making the codebase easier to work with for developers. By night he writes (mostly useless) software in an attempt to gain further englightenment in the art of architecture evolution in software. He enjoys evangelising on deployment-related affairs in software engineering and thinks the world would be a better place if more developers understood DevOps and made it a culture instead of a role.

Check out his articles at [https://medium.com/@joeir](https://medium.com/@joeir) and his (wasteland of) projects at [https://github.com/zephinzer](https://github.com/zephinzer).

- - -

## Cheers
It's weird writing about myself as a third party ^. See you there!
