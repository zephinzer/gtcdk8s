# Deploying Containers in Production
Welcome to the last section of the workshop!

In this section, we move on to a platform that is more commonly used to deploy containerised applications - Kubernetes. While Docker Swarm is a viable option today, most deployments are still done on Kubernetes because of its availability as enterprise options. Swarm also lacks certain essential features for container orchestration such as a readiness check mechanism.

Google has their [Google Kubernetes Engine](https://cloud.google.com/kubernetes-engine/) and Microsoft has the [Azure Kubernetes Service](https://azure.microsoft.com/en-us/services/kubernetes-service/). Amazon however, still uses a `docker-compose`ish methodology of deploying on its [Elastic Container Service](https://aws.amazon.com/ecs/) but has recently also launched its [Elastic Kubernetes Service](https://aws.amazon.com/eks/).

# Section Objectives
1. Understand various resource types in Kubernetes
2. Deploy a simple service in Kubernetes
3. Understand and use the Kubernetes Dashboard

# Activity 1: Create and Deploy an Application
Click [here to go to the activity readme](./ACTIVITY-01.md).

# Next Steps
