# Crafting a container-ready application
Container-ready applications follow the principles of:

## Instructions
> You should have this repository cloned.

1. Change to this directory

  ```bash
  cd ./01-application;
  ```

2. Spin up the Docker Compose network

  ```bash
  docker-compose build;
  docker-compose up -d;
  ```

3. The following front-end services should now be available on your local machine:

  | Service | URL | Description |
  | --- | --- | --- |
  | Application_1 | [http://localhost:40001](http://localhost:40001) | Example application |
  | Application_2 | [http://localhost:40002](http://localhost:40002) | Example application |
  | Application_3 | [http://localhost:40003](http://localhost:40003) | Example application |
  | Zipkin | [http://localhost:49411](http://localhost:49411) | Distributed tracing application |
  | Kibana | [http://localhost:45601](http://localhost:45601) | Logs explorer |
  | FluentD | [http://localhost:44224](http://localhost:44224) | Logs collator |
  | ElasticSearch | [http://localhost:49200](http://localhost:49200) | Collaged logs storage |

# References & Further Reading
1. [The Twelve-Factor App](https://12factor.net/)