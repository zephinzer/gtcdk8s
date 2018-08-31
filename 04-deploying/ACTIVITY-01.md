# Activity 1: Create and Deploy an Application
In this activity, we will be creating and deploying a simple application to demonstrate the capabilities of Kubernetes.

> A completed set of manifests can be found in the directory `./.example-app` if you're unable to keep up.

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

For this activity we'll also require a type of Kubernetes resource known as an Ingress. Let's enable it by running:

```bash
minikube addons enable ingress;
# ingress was successfully enabled
```

## 1.2 Write a deployment file
Create a new directory named `example-app` relative to the `./04-deploying` directory:

```bash
mkdir example-app;
```

We proceed by creating a file named deployment.yaml with the following content:

