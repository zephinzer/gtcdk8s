# Deploying Containers in Production
Welcome to the last section of the workshop!

In this section, we move on to a platform that is more commonly used to deploy containerised applications - Kubernetes. While Docker Swarm is a viable option today, most deployments are still done on Kubernetes because of its availability as enterprise options. Swarm also lacks certain essential features for container orchestration such as a readiness check mechanism.

Google has their [Google Kubernetes Engine](https://cloud.google.com/kubernetes-engine/) and Microsoft has the [Azure Kubernetes Service](https://azure.microsoft.com/en-us/services/kubernetes-service/). Amazon however, still uses a `docker-compose`ish methodology of deploying on its [Elastic Container Service](https://aws.amazon.com/ecs/) but has recently also launched its [Elastic Kubernetes Service](https://aws.amazon.com/eks/).

# Section Objectives
1. Understand various resource types in Kubernetes
2. Deploy a simple service in Kubernetes
3. Understand and use the Kubernetes Dashboard

# Kubernetes
Kubernetes is a batteries-included container orchestration platform.

## Kubernetes Manifest Types


## Kubernetes Resource Types
This is a short list of the possible resource types which we will be using in 

### Virtual Hardware
#### Clusters
Think of clusters as different clouds. They are disparate networks, and devices and subnets existing within each cluster cannot directly access the devices and subnets of another cluster.

#### Nodes
Nodes refer to the virtual machines within a cluster. Think of them as boxes of RAM and CPU through which various applications can be filled up into.

#### Pods
Pods are groups of one or more container instances. A pod is an atomic resource in Kubernetes and pods occupy nodes where RAM and CPU are available.

### Virtual Resources
#### ReplicaSet
ReplicaSet is short for replication set and this resource specifies details related to the application such as which container image to use, how many instances should be available, how the service rollout should happen *etc*.

#### Deployment
Deployments wrap around a RelicaSet and provides meta-data to identify the ReplicaSet as a whole instead of by individual pods generated from a ReplicaSet.

#### Service
Services expose a Deployment to the subnet which Kubernetes has created. Services link open ports on the Node to ports on the Deployment. An exposed Deployment together with the Service definition functionally behaves like a load balancer, distributing incoming requests to the pods generated from the ReplicaSet specification.

#### Ingress
An Ingress is functionally like a reverse proxy. It directs an incoming request to the correct application by translating the specified hostname into a Node's IP address and the port on the Node which links to the Service of interest. The Service's load balancer then distributes the request to the Pods of the Deployment.

### Summary
![Kubernetes Resource Types](../resources/k8s-res-types.png)


# Activity 1: Create and Deploy an Application
Click [here to go to the activity readme](./ACTIVITY-01.md).

# References & Further Reading
- [Official Kubernetes Reference](https://kubernetes.io/docs/reference/) (they have really good documentation)
- [Google Kubernetes Engine by Google](https://cloud.google.com/kubernetes-engine/)
- [Elastic Kubernetes Service by Amazon](https://aws.amazon.com/eks/)
- [Azure Kubernetes Service by Microsoft](https://azure.microsoft.com/en-us/services/kubernetes-service/)
- [Container Service for Kubernetes by Alibaba Cloud](https://www.alibabacloud.com/en/product/kubernetes)
