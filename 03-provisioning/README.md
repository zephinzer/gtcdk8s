# Provisioning an Environment
Now that we've managed to [containerise an application](../02-containerising), the natural progression would be to see how we can deploy multiple of these.

# Section Objectives

1. Concepts in environment provisioning
2. Introduction to the Docker Compose manifest
3. Setting up a service
4. Setting up a development environment

# Why environment provisioning?
## Support services
Lets take the example of WordPress (which we will be deploying later), the world's most popular publishing platform.

WordPress itself contains the core logic of how data should be manipulated and displayed. However, it relies on there being a MySQL database service which it can access to save/load data to/from.

Provisioning an environment for a service means spinning up the supporting services required for a service to do its job.

## An easier development environment
When working on services with a service-oriented architecture (that includes microservices!), each service often depends on at least one other service.

When a new developer is onboarded onto the team, they'd have to necessarily spin up multiple services, learning the build commands for each service. By the time they've gotten it up, it could be a few weeks later.

Additionally, should we have to work on multiple projects, each with their own required database service instance, our solution has traditionally been to share a single local database instance but use different database schemas.

While this is livable with, this isn't optimal because we're running two different services with the same architecture. When things go wrong, it's harder to isolate the error, and while it's possible, it's not trivial to have multiple instances of MySQL running locally.

This is where Docker Compose comes into the picture!

## Docker Compose
The Docker engine provides multiple CLI tools such as the primary `docker` command that allows us to build, run, execute into, and monitor our containers.

When we need to run multiple of these containers within an isolated network, that's where `docker-compose` comes into the picture.

Docker Compose creates an isolated network where the provisional contianers can reside and interact with each other without affecting the system.

## Activity 1: A Local WordPress Deployment
Click here to [start deploying a WordPress service locally](./ACTIVITY-01.md).

## Activity 2: Provisioning a Development Environment
Click here to [start provisioning an environment for developing a custom application](./ACTIVITY-02.md).

# References
- [Compose file version 3 reference](https://docs.docker.com/compose/compose-file/)