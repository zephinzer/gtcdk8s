# Activity 1: Using an existing Container Image
This section will introduce Docker and some common commands

## 1.1 Pulling/Running a Container Image
Let's have some fun. Run the following in your terminal to *"pull"* an image - basically retrieving the image from the Internet to your local machine:

```bash
docker pull bharathshetty4/supermario:latest;
```

Next, we run the pulled image, indicating that the resultant container should be named `"supermario"` and should publish itself on the host's (your machine's) port 8080 using its own (the container's) port 8080. The format is `"HOST_PORT":"CONTAINER_PORT"`:

```bash
docker run \
  --publish 8080:8080 \
  --name supermario \
  -d bharathshetty4/supermario;
```

After the above command finishes running, open your browser at [http://localhost:8080](http://localhost:8080).

## 1.2 Monitoring the Container
Run the following to check out what's running and the status of the `"supermario"` container we created earlier:

```bash
# check out all containers
docker ps;
# check out the stats for the supermario container
docker top supermario;
```

To see a live stream of the container's metrics, run:

```bash
# check out the statistics for all containers
docker stats;
```

## 1.3 What else is available
See what other resources we have:

```bash
docker container ls;
docker images;
docker volume ls;
docker network ls;
```

## 1.4 Shut it down
Run the following to shut down the container:

```bash
docker stop supermario;
```

Next, remove the container with:

```bash
docker rm supermario;;
```

# Next Steps
Return to [Application Containerisation](./README.md)
