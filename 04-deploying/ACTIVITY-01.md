# Activity 1: Create and Deploy an Application
In this activity, we will be creating and deploying a simple application to demonstrate the capabilities of Kubernetes.

> A completed set of manifests can be found in the directory `./.manifests` if you're unable to keep up.

## 1.1 Make sure everything is installed
Run the following to start your local Kubernetes cluster:

```bash
minikube start;
```

> `minikube` is still in beta and if you encounter any errors, do check out [the MiniKube installation section](../00-setup/README.md#minikube) or if you're on Linux, check out [the page dedicated to it](../00-setup/virtualbox-on-ubuntu-with-secure-boot.md).

This is possibly the hardest step of this workshop so pat yourself on the back if you've got it!

To verify that everything is running correctly, run:

```bash
minikube status;
# ...
# kubectl: Correctly Configured: pointing to minikube-vm at aaa.bbb.ccc.ddd (a local IP address)
```

For this activity we'll also require a type of Kubernetes resource known as an Ingress. It's also nice to monitor our pods. So let's enable them by running:

```bash
minikube addons enable ingress;
# ingress was successfully enabled

minikube addons enable metrics-server;
# metrics-server was successfully enabled

minikube addons enable heapster;
# heapster was successfully enabled
```

The `ingress` add-on allows for routing to deployed services via a hostname, the `metrics-server` add-on allows for monitoring Pods, and the `heapster` add-on allows for monitoring of the Node.

## 1.2 About the Application
### 1.2.1 Application Overview
The application we are deploying is a fork of Terrence Ryan's Whack-A-Pod. Here's a video of it in action if you're interested:

<iframe width="560" height="315" src="https://www.youtube.com/embed/2-Q5VuRj0Gc" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>

What it demonstrates is the ability of Kubernetes to restart Pods where errors have happened.

My fork of the repository can be found at [https://github.com/zephinzer/whack_a_pod](https://github.com/zephinzer/whack_a_pod) and it fixes some things which are broken in the original repository such as MiniKube compatiblity.

In the interest of time, I have pushed the [relevant images to DockerHub](https://hub.docker.com/r/zephinzer/eg-whack-a-pod/tags/) so that we can skip the container build process and start writing the Kubernetes manifests.

### 1.2.2 Other Technical Details
The application consists of three parts, `admin`, `api` and `game`. 

For the `admin` app, this application handles pod starting up and shutting down. Hence, we will need to grant it the ability to access the cluster.

For the `api` app, this application is the logical application which will be killed/restarted. No issues here.

For the `game` app, this is the front-end for the application which we will be accessing via an Ingress.

## 1.3 Creating Service Accounts
We'll be creating a service account with cluster administration rights for the `admin` application first.

Check with `minikube` that our `kubectl` is correctly linked to the MiniKube cluster:

```bash
minikube status;
```

The last line of the output should declare:

```
kubectl: Correctly Configured: pointing to minikube-vm at ....
```

Next, run the following to create the service account and assign the `cluster-admin` ClusterRole to it:

```bash
kubectl create serviceaccount wap-admin;
kubectl create clusterrolebinding wap-admin \
  --clusterrole=cluster-admin \
  --serviceaccount=default:wap-admin;
```

## 1.4 Deploying `admin`
We proceed by deploying the administration app.

### 1.4.1 Creating the Administration Deployment
Create a new file called `deployment.admin.yaml` (location does not matter now). This file will specify details about the deployment. Paste the following into the file:

```yaml
apiVersion: extensions/v1beta1
kind: Deployment
metadata:
  labels:
    app: admin
  name: admin-deployment
```

> In the above code snippet, the `apiVersion` property should be at column 0.

This defines basic self-explanatory details such as the `name` of the Deployment, and `labels`. The `labels` will be used by the Services to identify the Deployments we are trying to expose.

Next, append the following specification which is the specification of a Deployment (as compared to the metadata which we achieved in the above code block):

```yaml
spec:
  replicas: 1
  selector:
    matchLabels:
      app: admin
  strategy:
    rollingUpdate:
      maxSurge: 25%
      maxUnavailable: 25%
    type: RollingUpdate
```

> In the above code snippet, the `spec` property should be at column 0.

Lastly, we define logical aspects of the application such as which container image we're using, the ports via which the application be reached and how should Kubernetes orchestrate its existence:

```yaml
  template:
    metadata:
      labels:
        app: admin
    spec:
      containers:
      - env:
        - name: APIIMAGE
          value: zephinzer/eg-whack-a-pod:api
        image: zephinzer/eg-whack-a-pod:admin
        imagePullPolicy: IfNotPresent
        name: admin-deployment
        ports:
        - containerPort: 8080
          protocol: TCP
      restartPolicy: Always
      serviceAccount: wap-admin
      serviceAccountName: wap-admin
```

> In the above code snippet, the `template` property should be at column 2.

Note that in the above, we are applying the `serviceAccount` property. This is usually not needed unless it is an administrative application which requires access to Kubernetes resources. The above `wap-admin` service account should correspond to what we created in step 1.3.

Once done, apply the above manifest by running:

```bash
kubectl apply -f deployment.admin.yaml;
```

> **Speed up** if you can't catch up: `kubectl apply -f ./.manifests/deployment.admin.yaml`

You can now observe our deployed application via the following commands:

```bash
# view the deployment status
kubectl get deployments;
# Output:
# NAME               DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
# admin-deployment   1         1         1            1           15m

# check out the pods
kubectl get pods -o wide;
# Output:
# NAME               DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE       CONTAINERS         IMAGES            SELECTOR
# admin-deployment   1         1         1            1           30m       admin-deployment   zephinzer/eg-whack-a-pod:admin   app=admin
# ...

# get metrics on the above pod
# *note*: change the pod ID to whatever your output shows
kubectl top pod admin-deployment-64568f9996-h8lz8
# Output:
# NAME                                CPU(cores)   MEMORY(bytes)
# admin-deployment-64568f9996-h8lz8   0m           3Mi
```

You'll notice that when we retrieve the pod, we see an IP address. This IP address is the Pod's IP address which exists in the Node's subnet and is ephremal - this means that should we kill the pod and another is brought up, the IP address will change - so don't depend on it! We could kill it now actually to see what happens:

```bash
# once again, change the pod ID to your own pod's ID
kubectl delete pod admin-deployment-64568f9996-h8lz8;
```

Run the command to get the pods again:

```bash
kubectl get pods -o wide | grep admin-deployment;
```

Observe that the IP address has changed. Not a good way to refer to that pod! So, let's deploy a service!


### 1.4.2 Exposing the Administration Deployment
Create a new file named `service.admin.yaml`. This is a Service type resource that will allow the `admin` application to be accessed from another pod in a reliable manner. Add the following to the newly created file:

```yaml
apiVersion: v1
kind: Service
metadata:
  labels:
    app: admin
  name: admin
spec:
  ports:
  - port: 8080
    protocol: TCP
    targetPort: 8080
  selector:
    app: admin
  type: NodePort
```

That's all there is to creating a Service! Some things to notice:

1. The `spec.selector.app` property corresponds to the deployment we made earlier and directs this Service to find the Deployment containing a label where `app=admin`.
2. The `spec.ports[0].port` and `spec.ports[0].targetPort` are the same in this case, but the former refers to the port of the Service, and the latter refers to the actual application port on the Pod.

Now run the following command to apply your Service manifest:

```bash
kubectl apply -f ./service.admin.yaml;
```

> **Speed up** if you can't catch up: `kubectl apply -f ./.manifests/service.admin.yaml`

You can now observe your service using the following commands:

```bash
kubectl get services -o wide;
# NAME         TYPE        CLUSTER-IP       EXTERNAL-IP   PORT(S)          AGE       SELECTOR
# admin        NodePort    10.96.94.163     <none>        8080:31565/TCP   30m       app=admin
# ...
```

To access them at this point is normally impossible in a production grade Kubernetes. But thankfully, MiniKube allows us to do this. Run:

```bash
minikube service admin;
```

Your browser should open with a local inbound IP address. This is your exposed `admin` deployment!

Alternatively to check out all services, run:

```bash
minikube service list;
```

This only works if you've deployed the services with a NodePort type. However note that NodePort is [not recommended for use in production](https://oteemo.com/2017/12/12/think-nodeport-kubernetes/)


## 1.5 Deploying `api`

### 1.5.1 Creating the API Deployment

> **Speed up** if you can't catch up: `kubectl apply -f ./.manifests/deployment.api.yaml`

### 1.5.2 xposing the API Deployment

> **Speed up** if you can't catch up: `kubectl apply -f ./.manifests/service.api.yaml`

## 1.6 Deploying `game`

### 1.6.1 Creating the Game Deployment

> **Speed up** if you can't catch up: `kubectl apply -f ./.manifests/deployment.game.yaml`

### 1.6.2 Exposing the Game Deployment

> **Speed up** if you can't catch up: `kubectl apply -f ./.manifests/service.game.yaml`

## 1.7 Deploying the Ingress


