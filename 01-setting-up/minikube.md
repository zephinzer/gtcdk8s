# MiniKube
> Minikube is a k8s deployment that works on a single virtual machine.

For the sake of standardisation and ease of debugging, **we will be using version `v0.28.0`**. You can get the latest version by substituting the version number (`v0.28.0`) in the below URLs with the alatest stable version if you want (after the workshop!).

Go to https://github.com/kubernetes/minikube/releases/tag/v0.28.0 and download the appropriate package for your system:

| Platform | Filename |
| --- | --- |
| Linux | [minikube-linux-amd64](https://github.com/kubernetes/minikube/releases/download/v0.28.0/minikube-linux-amd64) |
| MacOS | [minikube-darwin-amd64](https://github.com/kubernetes/minikube/releases/download/v0.28.0/minikube-darwin-amd64) |
| Windows | [minikube-windows-amd64](https://github.com/kubernetes/minikube/releases/download/v0.28.0/minikube-windows-amd64) |

For Windows users, you have the option of downloading the installer from this link - https://github.com/kubernetes/minikube/releases/download/v0.28.0/minikube-installer.exe

## Verify Installation
Verify MiniKube is correctly set up by running the following in your Terminal:

```sh
minikube version
```

Your output should look like:

```
minikube version: v0.28.0
```
