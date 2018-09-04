# Activity 1: Trace the Error
In this activity, we'll be seeing how we can trace an error in a simulated microservices environment in order to understand the complexity of a container-based deployment.


# 1.1 Getting Up The Example Application
You should have this repository cloned locally before following the instructions below. Start the root of the courseware repository.

## 1.1.1 Change to this directory
Run the following from the root of this repository to enter this directory:

```bash
cd ./01-application;
```

## 1.1.2 Set the permissions on volumes correctly
> This step is required only for Linux boxes

We utilise some directories as volumes, and we need to give Docker write permissions to these directories. Run:

```bash
sudo chmod 777 -R ./data
```

## 1.1.3 Spin up the Docker Compose network
Run the following commands to spin up our model application together with support services:

  ```bash
  docker-compose build;
  docker-compose up -d;
  ```

## 1.1.4 The following front-end services should now be available on your local machine:

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

From the `./01-application` directory, you can also run `./_scripts/status.sh` to verify everything is up.

## 1.1.5 Setup Kibana indices
Before we can use Kibana, we need to direct it to the correct index. However, in order to do this, we need a few sample calls. Run the following in your terminal to create a few calls to our applications so that we can get some logs to reference the schema.

```bash
curl http://localhost:40001 & \
  curl http://localhost:40002 & \
  curl http://localhost:40003 & \
  wait;
```

Next, visit [Kibana at localhost:45601](http://localhost:45601).

On the left navigation menu, click on **Management** which should be bottom item menu.

In the **Kibana** section, click on **Index Patterns**.

You should see a text box with a placeholder *`index-name-*`*. Fill it up with: **fluentd-\*** and a short list should appear along with a message ** Success!  Your index pattern matches 10 indices.**

Hit the **Next Step** button and select **@timestamp** for the Time Filter drop-down box. Finally hit **Create index pattern**.

Leave it at this for now, we'll come back to Kibana later.

## 1.1.6 Setup Grafana dashboard
The final part of this setup involves Grafana.

Head over to [Grafana at http://localhost:43000/](http://localhost:43000/).

Enter in the credentials `user` for the username, and `password` for the password.

Once inside, hover above the **+** button on the left sidebar and select **Import** from the menu that just appeared.

Copy the content of the file located at [./grafana-dashboard/node-panel.json](./grafana-dashboard/node-panel.json) and paste it into the multiline textbox lablled with **Or paste JSON**.

Hit the **Load** button.

In the dropdown box **Select a Prometheus data source**, click it and select the resulting **Prometheus** item.

Leave it at this, we'll come back to Grafana later.

# 1.2 Introduction to the Application
The application was designed to demonstrate two situations:

1. A microservices architecture where each `application` (as defined by us) is a service
2. A highly-available application where each `application` is a replicate

The application exposes the following endpoints:

| Method | Path | Description |
| --- | --- | --- |
| GET | `/next-1` | Simulates a service calling another - get response from the next server as defined by `NEXT_SERVER_1` |
| GET | `/next-2` | Simulates a service calling another - get response from the next server as defined by `NEXT_SERVER_2` |
| GET | `/next-sequential` | Simulates a service retrieving data from two other services in parallel - this happens when the data response of the first service decides the request to the second service (eg. relational data) |
| GET | `/next-parallel` | Simulates a service retrieving data from two other services in parallel - this happens when we need to retrieve various parts of a profile (eg. profile picture from an images hosting service, and email from an accounts service) |
| GET | `/next-complex/:iteration` | Simulates a cascade of network calls for no reason at all - simulates a microservices architecture. The `:iteration` is the maximum number of cascading layers we should go. For example an `:iteration` of `6` would cause the network calls to reach minimally 6 levels deep. |
| GET | `/error` | Simulated error endpoint |

# 1.3 Cloud Native

## 1.3.1 Liveness Checks
Liveness checks tell an orchestrator if the application instance is alive and if it is not, the orchestrator should restart it.

Access this at the `/healthz` endpoint.

```bash
curl -vv http://localhost:40001/healthz
```

Or via browser: [http://localhost:40001/healthz](http://localhost:40001/healthz)

> In production setups, you should either obscure the endpoint by changing the endpoint path, or protect it using a token/certificate-based authentication.

## 1.3.2 Readiness Checks
Readiness checks tell an orchestrator if the application instance is ready to receive requests and if it is not, the orchestrator should not route traffic to it but keep it alive till is is ready.

Access this at the `/readyz` endpoint.

```bash
curl -vv http://localhost:40001/readyz
```

Or via browser: [http://localhost:40001/readyz](http://localhost:40001/readyz)

> In production setups, you should either obscure the endpoint by changing the endpoint path, or protect it using a token/certificate-based authentication.

## 1.3.3 Application Metrics
Metrics provide us insights into how an application instance (or cluster) is performing.

Access this at the `/metrics` endpoint.

```bash
curl -vv http://localhost:40001/metrics
```

Or via browser, [http://localhost:40001/metrics](http://localhost:40001/metrics)

> In production setups, you should either obscure the endpoint by changing the endpoint path, or protect it using a token/certificate-based authentication.

Access [Prometheus at http://localhost:49090](http://localhost:49090) to check out the available metrics of our applications.

Access [Grafana at http://localhost:43000](http://localhost:43000) to check out visualisations of the application metrics. Username is `user` and password is `password` if you haven't changed the `grafana.ini` file.

## 1.3.4 Centralised Logging
Centralised logging helps us to see a time-based series of logs instead of having to manually check each instance. In horizontally scalable setups, this becomes an issue really quick when you have 50 low-powered application instances.

Access [Kibana at http://localhost:45601](http://localhost:45601) to check out the centralised logs in time-series.

## 1.3.5 Distributed Tracing
Distributed tracing helps us to see where a request went and to provide each request with a context that can be used to string together a single request that went through multiple services.

To demonstrate this, let's run a query that spans multiple services:

```bash
curl localhost:40001/next-sequential;
```

Access [Zipkin at http://localhost:49411](http://localhost:49411) to check out the trace visualisations. Hit on **Find Traces** to see the traces.

Access [Kibana at http://localhost:45601](http://localhost:45601) to check out the trace contexts in the logs - note that all logs have a `context` property which is an object with the properties `traceId`, `spanId`, `parentId` and `sampled`.

We will later try and match trace IDs in both the tracer and the logs to gain a fuller picture of what's happening.

## 1.3.6 Alerting
Alerting helps us to get notified of events and respond to them. Only when alerts are present and we can respond to them can we begin to automate them.

> This section requires you to have a Telegram account. If you don't, it will be demonstrated so no FOMO!

Talk to [The Bot Father](https://telegram.me/BotFather) and create a new bot. You should receive a token.

Create a `.env` file in the `./notifier` directory:

```bash
touch ./notifier/.env
```

Paste the following into the `.env` file:

```
TELEGRAM_BOT_TOKEN=XXXXXXXXX:ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789
TELEGRAM_CHAT_ID=
```

Replace the `TELERAM_BOT_TOKEN` with the token you retrieved from [The Bot Father](https://telegram.me/BotFather).

Initiate a chat to your bot with `/start` and it should respond with the chat ID. Paste the chat ID into the `TELEGRAM_CHAT_ID` field in the `.env` file.

# 1.4 Trace the Error
Run the following command:

```bash
curl http://localhost:40003/next-complex/10;
```

You should see a message declaring **AN ERROR OCCURRED**. If you don't, run the command a few more times till you do.

Once you do, open [Zipkin at http://localhost:49411](http://localhost:49411).
In the dropdown box labelled **Sort**, select the dropdown menu item **Newest first** and hit **Find Traces**. Your errored request should appear in red.

Click on one of the spans in red and hit the **More info** button on the bottom right of the dialog box. You should be able to see the `traceId` and `spanId`.

Open [Kibana at http://localhost:45601](http://localhost:45601), click on **Discover** in the left navigation menu and search for the `spanId` of the errored trace.

You should see multiple logs turn up with the `context.parentId` or `context.spanId` set to the `spanId` value.

Because the `/next-complex/:iteration` call is non-deterministic, check each of the logs for a status code of 500 to find your error.

# Next Steps
Click [here to return to Cloud Native Applications](./README.md)
