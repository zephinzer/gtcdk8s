# Activity 1: Create and Deploy an Application
In this activity, we will be creating and deploying a simple application to demonstrate the capabilities of Kubernetes.

## 1.1 Make sure everything is installed
Run the following to start your local Kubernetes cluster:

```bash
minikube start;
```

> `minikube` is still in beta and if you encounter any errors, do check out [the MiniKube installation section](../00-setup/README.md#minikube) or if you're on Linux, check out [the page dedicated to it](../00-setup/virtualbox-on-ubuntu-with-secure-boot.md).

This is possibly the hardest step of this workshop so pat yourself on the back if you've got it!

## 1.2 Write a deployment file