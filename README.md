# Effective Containerisation From Development To Production
> Courseware for a Docker & Kubernetes workshop.

- [Synopsis](#synopsis)
- [Target Audience](#target-audience)
- [Topics](#topics)
- [Workshop Objectives](#workshop-objectives)
- [Requirements](#requirements)
  - [Required Skills](#required-skills)
  - [Required Machine](#required-machine)
  - [Required Software](#required-software)
  - [Required Resources](#required-resources)
- [About Me](#about-the-facilitator)
- [Get Started](#get-started)

## Synopsis
Developer-onboarding taking ages because of required supporting services? Having issues with "*but it works on my machine*"-like complaints? Searching for a way to deploy your application reliably and in an automated manner? Sounds like you could do with some container technology!

Enter the world of containerisation in both development and production environments with this short workshop which will cover building container-based deployments friendly applications, containerising services effectively, and deploying them - all with good ol' shell scripting automation for good taste.

> You can find the slides for this workshop at [the bit.ly url, http://bit.ly/gtcdk8s](http://bit.ly/gtcdk8s).  
> The canonical workshop material is [here at http://github.com/zephinzer/gtcdk8s](http://github.com/zephinzer/gtcdk8s).  
> A prettified version using Jekyll is [here at http://gtcdk8s.joeir.net](http://gtcdk8s.joeir.net).

## Target Audience
This is a hands-on workshop with the most utility for software engineers looking into the art of DevOps or seeking to learn how container technologies can result in developer happiness.

## Topics
1. [Cloud Native Applications](./01-application/README.md)
2. [Application Containerisation](./02-containerising/README.md)
3. [Environment Provisioning](./03-provisioning/README.md)
4. [Deploying Containers in Production](./04-deploying/README.md)

## Workshop Objectives

| Objective | Details |
| :-------- | :------ |
| Understand what goes into being cloud native | Understanding the need for health checks, centralised logging and distributed tracing |
| Creating a container image with Docker | Understand concepts in container images such as system encapsulation, image layering, and quick-win best practices of writing image files |
| Orchestrating multiple container images with Docker | Understand challenges in orchestrating images and provisioning of an environment |
| Running a local Kubernetes | Learn what is and how to use MiniKube |
| Deploying with Kubernetes | Learn common Kubernetes resources and manifests |

## Requirements
### Required Skills
Workshop participants should:
1. Be comfortable working with the command line
2. Have experience with software engineering
3. Have a little experience with deployment and operations

Other roles are welcome too, but you might not get the most out of this!

### Required Machine
1. Do note that **Windows is strictly not supported** due to limitations in time.
2. This workshop will only support MacOS ([get a Mac on Carousell](https://sg.carousell.com/search/products/?query=macbook%20pro%202015)).
3. Use Linux at your own risk (it works, with enough effort).
4. Virtual machine setups will not work for section 4 of this workshop due to MiniKube itself being run in a VM.

### Required Software
**IMPORTANT** Follow the instructions at [THIS PAGE ON SETTING UP](./00-setup/README.md) to get your machine ready for the workshop. This will take roughly an hour at most.

You will need the following software installed before the workshop starts:

1. [VirtualBox](./00-setup/README.md#virtualbox)
2. [Docker Engine (with Docker Compose)](./00-setup/README.md#docker-with-compose)
3. [kubectl](./00-setup/README.md#kubectl)
4. [MiniKube](./00-setup/README.md#minikube)
5. [Node](./00-setup/README.md#node)

### Required Resources
You should have cloned this repository into your local machine before the workshop begins. The [instructions are in the setup page](./00-setup/README.md#this-repository).

As conference WiFi can be flaky, please also download a copy of all resources being used:

1. [Docker images](./00-setup/README.md#external-docker-images)

## About The Facilitator
Joseph is a DevOps engineer hailing from the Agile Consulting & Engineering tribe at Government Digital Services. He spends his day optimising and maintaining CI/CD pipelines and making the codebase easier to work with for developers.

He enjoys evangelising on Agile and deployment-related affairs in software engineering, and thinks the world would be a better place if more developers understood DevOps and made it a culture instead of a role.

Check out his articles at [https://medium.com/@joeir](https://medium.com/@joeir) and his (wasteland of) projects at [https://github.com/zephinzer](https://github.com/zephinzer).

# [Get Started](./00-setup/README.md)

# Licensing
Code in this repository is licensed under the MIT license as [per the LICENSE file](./LICENSE).

Content in this repository is licensed under the [Creative Commons Attribution-ShareAlike 3.0 Singapore](http://creativecommons.org/licenses/by-sa/3.0/sg/) license.  

<a rel="license" href="http://creativecommons.org/licenses/by-sa/3.0/sg/"><img alt="Creative Commons Licence" style="border-width:0" src="https://i.creativecommons.org/l/by-sa/3.0/sg/88x31.png" /></a>