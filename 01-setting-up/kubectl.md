# Kubectl
> Kubectl is the command line tool we'll be using to communicate with our k8s master instance.

For the sake of standardisation and ease of debugging, **we will be using version `v1.11.0`**. You can get the latest version by substituting the version number (`v1.11.0`) in the URLs with the latest stable version if you want (after the workshop!).

The link that will show you the latest version is https://storage.googleapis.com/kubernetes-release/release/stable.txt.

| Platform | Command |
| --- | --- |
| Linux | curl -LO https://storage.googleapis.com/kubernetes-release/release/v1.11.0/bin/darwin/amd64/kubectl |
| MacOS | curl -LO https://storage.googleapis.com/kubernetes-release/release/v1.11.0/bin/linux/amd64/kubectl |
| Windows | curl -LO https://storage.googleapis.com/kubernetes-release/release/v1.11.0/bin/windows/amd64/kubectl.exe |

For Windows users, if you don't have the `curl` command, use this link instead - https://storage.googleapis.com/kubernetes-release/release/v1.11.0/bin/windows/amd64/kubectl.exe.

## Verify Installation
Verify Kubectl is correctly set up by running the following in your Terminal:

```sh
kubectl version --client
```

Your output should look like:

```
Client Version: version.Info{Major:"1", Minor:"10", GitVersion:"v1.10.3", GitCommit:"2bba0127d85d5a46ab4b778548be28623b32d0b0", GitTreeState:"clean", BuildDate:"2018-05-21T09:17:39Z", GoVersion:"go1.9.3", Compiler:"gc", Platform:"linux/amd64"}
```
