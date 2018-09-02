# Activity 1: Create and Deploy an Application
In this activity, we will be creating and deploying a simple application to demonstrate the capabilities of Kubernetes.

> A completed set of manifests can be found in the directory `./.manifests` if you're unable to keep up.





## Summary of Sub-Activities
1. 1.1 Make sure verything is installed
2. 1.2 About the application
3. 1.3 Creating service accounts
4. 1.4 Deploying Admin component
5. 1.5 Deploying API component
6. 1.6 Deploying Game component
7. 1.7 Deploying the Ingress
8. 1.8 Modifying /etc/hosts
9. 1.9 Reviewing the application


- - -


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


- - -


## 1.2 About the Application
### 1.2.1 Application Overview
The application we are deploying is a fork of Terrence Ryan's Whack-A-Pod. Here's a video of it in action if you're interested:

<iframe width="100%" height="315" src="https://www.youtube.com/embed/2-Q5VuRj0Gc" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>

What it demonstrates is the ability of Kubernetes to restart Pods where errors have happened.

My fork of the repository can be found at [https://github.com/zephinzer/whack_a_pod](https://github.com/zephinzer/whack_a_pod) and it fixes some things which are broken in the original repository such as MiniKube compatiblity.

In the interest of time, I have pushed the [relevant images to DockerHub](https://hub.docker.com/r/zephinzer/eg-whack-a-pod/tags/) so that we can skip the container build process and start writing the Kubernetes manifests.

### 1.2.2 Other Technical Details
The application consists of three parts, `admin`, `api` and `game`. 

For the `admin` app, this application handles pod starting up and shutting down. Hence, we will need to grant it the ability to access the cluster.

For the `api` app, this application is the logical application which will be killed/restarted. No issues here.

For the `game` app, this is the front-end for the application which we will be accessing via an Ingress.


- - -


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


- - -


## 1.4 Deploying Admin Component
We proceed by deploying the administration app. This application controls the pod status and allows us to kill, restart and monitor existing deployments, services and pods.


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

We also specified the ports which the Admin component uses. Functionally, this exposes the port 8080 on the pod which we will direct the Service to later.

Once done, apply the above manifest by running the following in the same directory as your newly created file:

```bash
kubectl apply -f ./deployment.admin.yaml;
```

> **Speed up** if you can't catch up: `kubectl apply -f ./.manifests/deployment.admin.yaml`


### 1.4.2 Verifying the Admin deployment is up
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


### 1.4.3 Exposing the Administration Deployment
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


### 1.4.4 Verifying the Admin service is up
You can now verify your service is up by using the following command:

```bash
kubectl get services -o wide;
# NAME         TYPE        CLUSTER-IP       EXTERNAL-IP   PORT(S)          AGE       SELECTOR
# admin        NodePort    10.96.94.163     <none>        8080:31565/TCP   30m       app=admin
# ...
```

To access the service at this point is normally impossible in a production grade Kubernetes. But thankfully, MiniKube allows us to do this. Run:

```bash
minikube service admin;
```

Your browser should open with a local inbound IP address. This is your exposed `admin` deployment!

Alternatively to check out all services, run:

```bash
minikube service list;
```

This only works if you've deployed the services with a NodePort type. However note that NodePort is [not recommended for use in production](https://oteemo.com/2017/12/12/think-nodeport-kubernetes/) and you should be using ClusterIP instead which is more secure.


- - -


## 1.5 Deploying API Component
The API component is the application which will be killed and restarted by the Admin component. The deployment is much more ordinary since no permissions are needed. You can think of these as the applications you'll normally be deploying!


### 1.5.1 Creating the API Deployment
Create a file named `deployment.api.yaml` with the following content:

```yaml
apiVersion: extensions/v1beta1
kind: Deployment
metadata:
  labels:
    app: api
  name: api-deployment
```

> In the above code snippet, the `apiVersion` property should be at column 0.

In a similar fashion to the Admin component, you can see that we're defining `labels` and a `name` for the deployment.

Next, we add the deployment specification, append the following to the file:

```yaml
spec:
  replicas: 12
  selector:
    matchLabels:
      app: api
  strategy:
    rollingUpdate:
      maxSurge: 25%
      maxUnavailable: 25%
    type: RollingUpdate
```

> In the above code snippet, the `spec` property should be at column 0.

Unlike the Admin component which requires just 1 replica, here we indicate 12 replicas. This means that Kubernetes will create 12 instances of your application and a load balancer which routes the call to these 12 when a request comes in.

Next, we add the template:

```yaml
  template:
    metadata:
      labels:
        app: api
    spec:
      containers:
      - image: zephinzer/eg-whack-a-pod:api
        imagePullPolicy: IfNotPresent
        name: api-deployment
        ports:
        - containerPort: 8080
          protocol: TCP
      restartPolicy: Always
```

> In the above code snippet, the `template` property should be at column 2.

Finally, we specified the image and corresponding port (`8080`) which the image uses. 

Deploy this manifest by running the following in the same directory as your manifest file:

```bash
kubectl apply -f ./deployment.api.yaml;
```

> **Speed up** if you can't catch up: `kubectl apply -f ./.manifests/deployment.api.yaml`

### 1.5.2 Verifying the API deployment is up
Run the following to verify that the API has been deployed:

```bash
kubectl get deployment api-deployment;
# Output:
# NAME             DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
# api-deployment   12        12        12           12          23h
```


### 1.5.3 Exposing the API Deployment
Create a new file named `./service.api.yaml` with the following contents:

```yaml
apiVersion: v1
kind: Service
metadata:
  labels:
    app: api
  name: api
spec:
  ports:
  - port: 8080
    protocol: TCP
    targetPort: 8080
  selector:
    app: api
  type: NodePort
```

Finally, run the following in the same directory as the newly created file:

```bash
kubectl apply -f ./service.api.yaml;
```

Your Service should now be deployed.

> **Speed up** if you can't catch up: `kubectl apply -f ./.manifests/service.api.yaml`


### 1.5.4 Verifying the API service is up
Run the following to verify that the API service has been deployed:

```bash
kubectl get service api;
# Output:
# NAME      TYPE       CLUSTER-IP       EXTERNAL-IP   PORT(S)          AGE
# api       NodePort   10.101.246.182   <none>        8080:30346/TCP   1d
```


- - -


## 1.6 Deploying Game Component
The Game component is the front-end for our application. This usually means the least amount of configuration possible.

### 1.6.1 Creating the Game Deployment  
You know the drill, create a new file named `deployment.game.yaml` with the following content (refer to previous two sections for explanations):

```yaml
apiVersion: extensions/v1beta1
kind: Deployment
metadata:
  labels:
    app: game
  name: game-deployment
spec:
  replicas: 4
  selector:
    matchLabels:
      app: game
  strategy:
    rollingUpdate:
      maxSurge: 25%
      maxUnavailable: 25%
    type: RollingUpdate
  template:
    metadata:
      labels:
        app: game
    spec:
      containers:
      - image: zephinzer/eg-whack-a-pod:game
        imagePullPolicy: IfNotPresent
        name: game-deployment
        ports:
        - containerPort: 8080
          protocol: TCP
      restartPolicy: Always
```

Next, deploy it by running the following in the same directory as the file:

```bash
kubectl apply -f ./deployment.game.yaml;
```

> **Speed up** if you can't catch up: `kubectl apply -f ./.manifests/deployment.game.yaml`


### 1.6.2 Verifying the Game Deployment is up  
Run the following to verify the `game` deployment is available:

```bash
kubectl get deployment game-deployment;
# Output:
# NAME              DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
# game-deployment   4         4         4            4           23h
```


### 1.6.3 Exposing the Game Deployment  
As before, create a new file named `service.game.yaml` with the following content:

```yaml
apiVersion: v1
kind: Service
metadata:
  labels:
    app: game
  name: game
spec:
  ports:
  - port: 8080
    protocol: TCP
    targetPort: 8080
  selector:
    app: game
  type: NodePort
```

Deploy the service with:

```bash
kubectl apply -f ./service.game.yaml;
```

> **Speed up** if you can't catch up: `kubectl apply -f ./.manifests/service.game.yaml`


### 1.6.4 Verifying the Game Service is up
Run the following to verify the `game` service is available:

```bash
kubectl get service game;
# Output:
# NAME      TYPE       CLUSTER-IP       EXTERNAL-IP   PORT(S)          AGE
# game      NodePort   10.103.236.216   <none>        8080:32351/TCP   23h
```


- - -


## 1.7 Deploying the Ingress
The final step before we can access our application is to deploy and Ingress. The Ingress directs a web request to the correct service based on the hostname.


### 1.7.1 Creating the Ingress
Create a new file named `ingress.whack-a-pod.local.yaml`.

Paste in the following YAML:

```yaml
apiVersion: extensions/v1beta1
kind: Ingress
metadata:
  annotations:
    ingress.kubernetes.io/rewrite-target: /
  name: wap-ingress
```

Notice that the `kind` property has changed to an Ingress string. This is followd by `annotations` which we've never seen before. Annotations are meta-configurations - configuration for the configuration file (ha ha). These annotations are added as labels to the pod which the application can read and use to configure itself at runtime.

> The functional behaviour of the above annotation if you're curious, is to rewrite the target URI to begin with `/`. So for example, if we were to access the URL `http://whack-a-pod.local/api/some/path`, the URI will be re-written before being sent to the target pod to `/some/path`.

Next, we add in the Ingress specification:

```yaml
spec:
  rules:
  - host: whack-a-pod.local
    http:
      paths:
      - backend:
          serviceName: api
          servicePort: 8080
        path: /api/
      - backend:
          serviceName: admin
          servicePort: 8080
        path: /admin/
      - backend:
          serviceName: game
          servicePort: 8080
        path: /
```

> Note that the `spec` property should begin at column 0.

In the above, we are adding `rules` which tell the Ingress how to handle hostnames and paths. In the above configuration, we are telling the Ingress to route requests with a hostname of `"whack-a-pod.local"` to the various services we are defining in the `paths` property.

In the `paths` property, we have 3 defined backends, our `api`, `admin` and `game` services, all of which are accsssible at port `8080` as we defined in our earlier files. Each of these also specify a `path` property which means that given a URL of `http://whack-a-pod.local/api/some/path`, the Ingress will send the request to the `api` service. The annotations we provided will remove the `/api` from `/api/some/path` so that it becomes `/some/path` to the `api` service.

Finally, deploy the Ingress by running the following in the same directory as the newly created file:

```bash
kubectl apply -f ./ingress.whack-a-pod.local.yaml;
```

> **Speed up** if you can't catch up: `kubectl apply -f ./.manifests/ingress.whack-a-pod.local.yaml`


## 1.7.2 Verifying the Ingress is up
Use the following command to verify the Ingress has been deployed:

```bash
kubectl get ingress;
# Output:
# NAME          HOSTS               ADDRESS     PORTS     AGE
# wap-ingress   whack-a-pod.local   10.0.2.15   80        1d
```

If the `ADDRESS` column is empty, keep running the command till an address is assigned to the Ingress. This typically takes 15-30 seconds depending on your machine's resources.

The reported IP address in a production Kubernetes setup will normally already be accessible, but since MiniKube runs within a VM, we will need the IP address of the VM instead before we can access the Ingress.


- - -


## 1.8 Modifying /etc/hosts
In order to access our application, we'll need to get the IP address of the MiniKube VM so that we can finally hit our Ingress. This is achieved by running:

```bash
minikube ip
```

This should return you a local IP which we can then use in conjunction with the hostname, `whack-a-pod.local` to access our application.

Open your `/etc/hosts` (you will need `sudo` permissions, so run `sudo vim /etc/hosts`) file and append a new line with the following format:

```etchosts
192.xxx.xxx.xxx whack-a-pod.local
```

Save and exit (hit `escape` followed by typing `:x` and hitting enter if you're on `vim` - `emacs` and `nano` users you're on your own).


- - -


## 1.9 Reviewing the application
When all the above has been completed, you can visit [http://whack-a-pod.local/advanced.html](http://whack-a-pod.local/advanced.html) to try out an application deployd on Kubernetes that demonstrates Kubernetes. Kinda meta eh?

The application that has been deployed is a `color` API that simply returns a hex color code. The front-end is polling the `color` API which then routes the request to any of the 12 pods which will return a coluor. The colour is then used as a backlight on the Kubernetes logo.

Neat stuff.


- - -

# Next Steps
Head back to [Deploying Containers in Production](./README.md).
