# The Cloud Native Application
A container-ready application is also known as being cloud native and should abide by the guidelines in the [The Twelve-Factor App](https://12factor.net/).

All container-ready applications should minimally contain the following code instrumentations:

1. [Liveness checks](#liveness-checks)
2. [Readiness checks](#readiness-checks)
3. [Application metrics](#application-metrics)
4. [Centralised logging](#centralised-logging)
5. [Distributed tracing](#distributed-tracing)

## Section Objectives

1. Understand code instrumentations in a cloud native application
2. Have a big-picture view of what else is around a container
3. Understand what health checks mean
4. Understand why centralised logs are important
5. Understand why distributed tracing is important
6. Be able to discover an errored-out request using alerts, metrics, trace IDs and logs.

## Pre-Requisites
- Docker
- Docker Compose

## Getting It Up
You should have this repository cloned locally before following the instructions below. Start the root of the courseware repository.

### 1. Change to this directory
Run the following to enter this directory:

  ```bash
  cd ./01-application;
  ```

### 2. Set the permissions on volumes correctly
> This step is required only for Linux boxes

We utilise some directories as volumes, and we need to give Docker write permissions to these directories. Run:

  ```bash
  chmod 777 -R ./data
  ```

### 3. Spin up the Docker Compose network
Run the following commands to spin up our model application together with support services:

  ```bash
  docker-compose build;
  docker-compose up -d;
  ```

### 4. The following front-end services should now be available on your local machine:

  | Service | URL | Description |
  | --- | --- | --- |
  | Application_1 | [http://localhost:40001](http://localhost:40001) | Example application |
  | Application_2 | [http://localhost:40002](http://localhost:40002) | Example application |
  | Application_3 | [http://localhost:40003](http://localhost:40003) | Example application |
  | Prometheus | [http://localhost:49090](http://localhost:49090) | Prometheus metrics monitor |
  | Grafana | [http://localhost:43000](http://localhost:43000) | Dashboard |
  | Zipkin | [http://localhost:49411](http://localhost:49411) | Distributed tracing application |
  | Kibana | [http://localhost:45601](http://localhost:45601) | Logs explorer |
  | FluentD | [http://localhost:44224](http://localhost:44224) | Logs collator |
  | ElasticSearch | [http://localhost:49200](http://localhost:49200) | Collaged logs storage |

### Introduction to the Application
The application was designed to demonstrate two situations:

1. A microservices architecture where each `application` (as defined by us) is a service
2. A highly-available application where each `application` is a replicate

The application exposes the following endpoints:

| Method | Path | Description |
| --- | --- | --- |
| GET | `/next-server-1` | Simulates a service calling another - get response from the next server as defined by `NEXT_SERVER_1` |
| GET | `/next-server-2` | Simulates a service calling another - get response from the next server as defined by `NEXT_SERVER_2` |
| GET | `/next-servers-simple-sequential` | Simulates a service retrieving data from two other services in parallel - this happens when the data response of the first service decides the request to the second service (eg. relational data) |
| GET | `/next-servers-simple-parallel` | Simulates a service retrieving data from two other services in parallel - this happens when we need to retrieve various parts of a profile (eg. profile picture from an images hosting service, and email from an accounts service) |
| GET | `/next-servers-complex-sequential` | Simulates a cascade of network calls for no reason at all - simulates a microservices architecture |
| GET | `/next-servers-complex-parallel` | Simulates a cascade of network calls to various services - simulates a highly available application where calls can be routed to any one of its live instances |
| GET | `/error` | Simulates an error - we use this to demonstrate tracing through a crazy set of logs |
| GET | `/complex-error/:iteration` | Simulates a complex error - we use this to simulate a live environment of logs |
| GET | `/` | The happy path (: smile. |

## Cloud Native Applications

### Liveness Checks
Liveness checks tell an orchestrator if the application instance is alive and if it is not, the orchestrator should restart it.

Access this at the `/healthz` endpoint.

> In production setups, you should either obscure the endpoint by changing the endpoint path, or protect it using a token/certificate-based authentication.

### Readiness Checks
Readiness checks tell an orchestrator if the application instance is ready to receive requests and if it is not, the orchestrator should not route traffic to it but keep it alive till is is ready.

Access this at the `/readyz` endpoint.

> In production setups, you should either obscure the endpoint by changing the endpoint path, or protect it using a token/certificate-based authentication.

### Application Metrics
Metrics provide us insights into how an application instance (or cluster) is performing.

Access this at the `/metrics` endpoint.

> In production setups, you should either obscure the endpoint by changing the endpoint path, or protect it using a token/certificate-based authentication.

Access [Prometheus at http://localhost:49090](http://localhost:49090) to check out the available metrics of our applications.

Access [Grafana at http://localhost:43000](http://localhost:43000) to check out visualisations of the application metrics. Username is `user` and password is `password` if you haven't changed the `grafana.ini` file.

### Centralised Logging
Centralised logging helps us to see a time-based series of logs instead of having to manually check each instance. In horizontally scalable setups, this becomes an issue really quick when you have 50 low-powered application instances.

Access [Kibana at http://localhost:45601](http://localhost:45601) to check out the centralised logs in time-series.

### Distributed Tracing
Distributed tracing helps us to see where a request went and to provide each request with a context that can be used to string together a single request that went through multiple services.

Access [Zipkin at http://localhost:49411](http://localhost:49411) to check out the trace visualisations.

Access [Kibana at http://localhost:45601](http://localhost:45601) to check out the trace contexts in the logs.

### Alerting
Alerting helps us to get notified of events and respond to them. Only when alerts are present and we can respond to them can we begin to automate them.

> This section requires you to have a Telegram account. If you don't, it will be demonstrated so no FOMO!

Talk to [The Bot Father](https://telegram.me/BotFather) and create a new bot. You should receive a token.

Create a file at `./`

## Activity: Trace the Error

1. Confirm that everything is up by running: `./_scripts/status.sh`
  a. If it is not, run `docker-compose down`, wait till it completes
  b. Run the cleanup script: `./_scripts/cleanup.sh`
  b. Then run `docker-compose up` again
2. 



# References & Further Reading
1. [The Twelve-Factor App](https://12factor.net/)
2. [Pattern: Microservice chassis](http://microservices.io/patterns/microservice-chassis.html)
