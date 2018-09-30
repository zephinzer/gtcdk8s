# Facilitating Effective Containerisation from Development to Production
Workshop duration is 2 hours, we have 4 sections, each split into 30 minute blocks.

Each 30 minute block will consist of 15 minutes introduction to concepts and demonstration, and the other 15 minutes will be walking around and guiding those who can't follow through.

Also note that if participants ask, what is demonstrated may not necessarily be what is in this repository. We will play by ear depending on the time, but the core concepts identified below will be demonstrated.



# Section 0: Setting Up

To check a participant's machine for correctness, run:

- `vboxmanage --version`
- `kubectl version --client`
- `node -v`


# Section 1: Cloud Native Applications
This section covers what goes into a containerised application to demonstrate the qualities a container should have, and we will utilise the following services (linked for your convenience if you don't know what it does):

| Service | Description |
| --- | --- |
| [FluentD](https://www.fluentd.org/) | Logs collator |
| [Kibana](https://www.elastic.co/products/kibana) | Logs visualiser |
| [Grafana](https://grafana.com/) | Metrics dashboard |
| [Prometheus](https://prometheus.io/) | Metrics collector |
| [ElasticSearch](https://www.elastic.co/products/elasticsearch) | Non-relational database for logs |
| [Zipkin](https://zipkin.io/) | Distrubted tracing |

The exposed services will be available at:

| Service | URL |
| --- | --- |
| Kibana | [http://localhost:5601](http://localhost:5601) |
| Grafana | [http://localhost:3000](http://localhost:3000) |
| Prometheus | [http://localhost:9090](http://localhost:9090) |
| Zipkin | [http://localhost:9411](http://localhost:9411) |

Participants will be brought through deploying a simulated cloud environment, triggering an error, and tracing it using the context ID.

- Use Zipkin to identify the failed request, get the traceId and spanId
- Use Kibana and query for the spanId to view the error
- Use Kibana and query for the traceId to view all requests leading up to the error
- Prometheus is to demonstrate the metrics
- Grafana is to demonstrate monitoring and alerting (might not have enough time to go through alerting, so we might skip that)

## Section 1 Activity 1 Checklist
- [ ] Give `777` permission to data directory
- [ ] Run `docker-compose build`
- [ ] Run `docker-compose up`
- [ ] Curl http://localhost:40001
- [ ] Curl http://localhost:40001/healthz
- [ ] Curl http://localhost:40001/readyz
- [ ] Set up Kibana indices
- [ ] Set up Grafana dashboard
- [ ] Curl http://localhost:40001/next-complex/2
- [ ] View error from Zipkin at http://localhost:49411
- [ ] View error logs from Kibana at http://localhost:5601



# Section 2: Containerising an Application
This section will demonstrate writing a Dockerfile in development, optimising the Dockerfile, and debugging a Docker image.

Commands you should be familiar with:
- `docker build .`
- `docker build -t image_name .`
- `docker run image_name`
- `docker run -it image_name`
- `docker run -it --entrypoint=/bin/sh image_name`
- `docker run -it --name container_name --entrypoint=/bin/sh image_name`
- `docker ps`
- `docker ps -a`
- `docker exec -it container_name /bin/sh`
- `docker top container_name`
- `docker stats container_name`
- `docker inspect container_name`
- `docker rm container_name`
- `docker rmi image_name`

Docker directives you should be familiar with:
- `FROM repo:tag`
- `RUN somecommand`
- `WORKDIR /where/we/begin`
- `COPY ./here /there`

The section will proceed with using a Docker image (a Supermario image), followed by writing one for an example application which uses a native NPM module. The native module will add additional dependencies which we will use to demonstrate layer caching during development starting from a blank file.

## Section 2 Activity 1 Checklist

- [ ] Pull the Docker image from Docker Hub
- [ ] `docker images` - show the pulled image
- [ ] `docker ps` - see that there's no contianer
- [ ] Run the Docker image
- [ ] `docker ps` - see that there's a container
- [ ] `docker top supermario` - see the system usage of the container
- [ ] `docker stat supermario` - monitor the system usage of the container
- [ ] `docker kill supermario` - kill the container
- [ ]  `docker ps` - show that container doesn't exist
- [ ] `docker ps -a` - show that we can see all dead containers

## Section 2 Activity 2 Checklist

### Building an Image
- [ ] Navigate into `./02-containerising/example-app` before starting
- [ ] Create new Dockerfile there
- [ ] Add `FROM alpine:3.2`
- [ ] Add `RUN apk update`
- [ ] Add `RUN apk add --no-cache nodejs`
- [ ] Add `WORKDIR /app`
- [ ] Add `COPY . /app`
- [ ] Add `RUN npm install`
- [ ] Add entrypoint as `[ "npm", "start" ]`
- [ ] Witness build failure (no python)
- [ ] Add `RUN apk add python`
- [ ] Witness build failure (no make)
- [ ] Add `RUN apk add make`
- [ ] Witness build failure (no g++)
- [ ] Add `RUN apk add g+++`
- [ ] Witness runtime failure (wrong version of Node)
- [ ] Upgrade version of Alpine to 3.8 (note the lack of layer caching)
- [ ] Witness build failure (no npm)
- [ ] Add `RUN apk add npm`

### Optimising the Image for Development
- [ ] Change the `"BYE"` in the `./index.js` of the example app to `"HI"`
- [ ] Run the build again (note: `npm install` is not cached)
- [ ] Add `COPY ./package.json /app/package.json` before `npm install`, add `COPY ./package-lock.json /app/package-lock.json` before `npm install`, shift `COPY . /app` to after `npm install`
- [ ] Change the `"BYE"` in the `./index.js` of the example app to `"ni hao"`
- [ ] Run the build again (note: `npm install` is cached)

### Optimising the Image for Production
- [ ] `docker images | head -n 5` - check size of image - 243 MB
- [ ] Compress dependency installing steps into `RUN apk add --update --no-cache nodejs python make g++ npm`
- [ ] Run build and checkout image sizes - 240 MB
- [ ] Remove the dependencies at the end of the Dockerfile (add `apk del python make g++`) and checkout image size - 242 MB
- [ ] String together the `RUN`s, build and checkout image size - 57 MB
- [ ] Add `npm` as a dependency to be deleted and change `ENTRYPOINT` to `[ "node", "index.js" ]`. Run build and checkout image size - 39 MB
- [ ] `docker run -it --entrypoint=/bin/sh a2`


# Section 3: Provisioning an Environment
> This section is pretty time consuming and we may have to cut short on this

This section covers Docker Compose and how to provision an environment for Wordpress, followed by provisioning an environment for a bespoke application we've never seen before.

WordPress requires a MySQL database, so it's a simple deployment with 2 services - WordPress and MySQL.

The bespoke application will be tougher. It is a React application which includes a websocket port that participants will have to decipher. We will:

1. run it locally first to demonstrate its working followed 
1. check out what's missing
1. check out the ports it uses
1. provision the support services
1. configure the development environment to work with hot-reloading

You should be familiar with the following Docker Compose commands:
- `docker-compose up`
- `docker-compose -f ./path/to/docker-compose.yml up`
- `docker-compose -f ./path/to/docker-compose.yml build`
- `docker-compose -f ./path/to/docker-compose.yml down`
- `docker-compose -f ./path/to/docker-compose.yml rm`

Since `npm` is also used, you should know:
- `npm run $SCRIPT_NAME`



# Section 4: Deploying Containers in production
> Since we will likely overrun on Section 3, this section will just use the answers instead (if we are behind schedule)

This section covers deploying containers in a Kubernetes cluster. Participants will run MiniKube to create their own single node cluster. This should have been done at the start of the workshop so it should be up.

The application we are deploying is called Whack-A-Pod and it's something like Whack-A-Mole, except we are destroying pods to demonstrate how Kubernetes automatically restarts pods that are down. The performance ain't great, so you can explain it to participants that the lag we will be seeing won't happen in a production grade setup.

You should be familiar with the following `kubectl` commands:
- `kubectl apply -f ./manifest.yml`
- `kubectl get pods`
- `kubectl describe pods`
- `kubectl get pod $POD_NAME`
- `kubectl top pod $POD_NAME`
- `kubectl delete pods`
- `kubectl get deployments`
- `kubectl describe deployments`
- `kubectl delete deployments`
- `kubectl get services`
- `kubectl describe services`
- `kubectl delete services`
- `kubectl get ingress`
- `kubectl describe ingress`
- `kubectl delete ingress`

You should also understand:
- `minikube up`
- `minikube status`
- `minikube service $SERVICE_NAME`
- `minikube service list`
- `minikube addons list`
- `minikube addons enable $ADDON_ID`
- `minikube down`
