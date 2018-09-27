# Cloud Native Applications
A container-ready application is also known as being cloud native and should abide by the guidelines in the [The Twelve-Factor App](https://12factor.net/).

All container-ready applications should minimally contain the following code instrumentations:

1. [Liveness checks](#liveness-checks)
2. [Readiness checks](#readiness-checks)
3. [Application metrics](#application-metrics)
4. [Centralised logging](#centralised-logging)
5. [Distributed tracing](#distributed-tracing)

# Section Objectives
1. Understand code instrumentations in a cloud native application
2. Have a big-picture view of what else is around a container
3. Understand what health checks mean
4. Understand why centralised logs are important
5. Understand why distributed tracing is important
6. Be able to discover an errored-out request using alerts, metrics, trace IDs and logs.

# Pre-Requisites
- Docker
- Docker Compose

# Activity 1: Trace the Error
[Click here to access Activity 1](./ACTIVITY-01.md).

# Next Steps
Click here to [move on to Application Containerisation](../02-containerising/README.md).

# References & Further Reading
1. [The Twelve-Factor App](https://12factor.net/)
2. [Pattern: Microservice chassis](http://microservices.io/patterns/microservice-chassis.html)
