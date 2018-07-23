# Crafting a container-ready application
Container-ready applications follow the principles of:

## Instructions
> You should have this repository cloned.

1. Change to this directory
  > `cd ./01-application`
2. Spin up the Docker Compose network
  > `docker-compose build`
  > `docker-compose up -d`
3. The following front-end services should now be available on your local machine:
  - Application 1 at [http://localhost:40001](http://localhost:40001)
  - Application 2 at [http://localhost:40002](http://localhost:40002)
  - Application 3 at [http://localhost:40003](http://localhost:40003)
  - Zipkin at [http://localhost:49411](http://localhost:49411)
  - Kibana at [http://localhost:45601](http://localhost:45601)
4. The following back-end services should now be available on your local machine:
  - FluentD at [http://localhost:44224](http://localhost:44224)
  - ElasticSearch at [http://localhost:49200](http://localhost:49200)

# References & Further Reading
1. [The Twelve-Factor App](https://12factor.net/)