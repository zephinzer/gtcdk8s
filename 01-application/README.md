# Crafting a container-ready application
A container-ready application is also known as being cloud native and should abide by the guidelines in the [The Twelve-Factor App](https://12factor.net/).

All container-ready applications should minimally contain the following code instrumentations:

1. [Liveness checks](#liveness-checks)
2. [Readiness checks](#readiness-checks)
3. [Application metrics](#application-metrics)
4. [Centralised logging](#centralised-logging)
5. [Distributed tracing](#distributed-tracing)

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

### 2. Spin up the Docker Compose network
Run the following commands to spin up our model application together with support services:

  ```bash
  docker-compose build;
  docker-compose up -d;
  ```

### 3. The following front-end services should now be available on your local machine:

  | Service | URL | Description |
  | --- | --- | --- |
  | Application_1 | [http://localhost:40001](http://localhost:40001) | Example application |
  | Application_2 | [http://localhost:40002](http://localhost:40002) | Example application |
  | Application_3 | [http://localhost:40003](http://localhost:40003) | Example application |
  | Prometheus | [http://localhost:49090](http://localhost:49090) | Prometheus metrics monitor |
  | Zipkin | [http://localhost:49411](http://localhost:49411) | Distributed tracing application |
  | Kibana | [http://localhost:45601](http://localhost:45601) | Logs explorer |
  | FluentD | [http://localhost:44224](http://localhost:44224) | Logs collator |
  | ElasticSearch | [http://localhost:49200](http://localhost:49200) | Collaged logs storage |

## Liveness Checks

## Readiness Checks

## Application Metrics

## Centralised Logging

## Distributed Tracing


# References & Further Reading
1. [The Twelve-Factor App](https://12factor.net/)