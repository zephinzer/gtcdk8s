# Topic 0: Setting Up
This section should be completed **BEFORE** the workshop and can take up to an hour to complete.





## Objectives
Install the required software as follows:

1. [This Repository](#this-repository)
1. [VirtualBox](#virtualbox)
1. [Docker (with Compose)](#docker-with-compose)
1. [kubectl](#kubectl)
1. [MiniKube](#minikube)
1. [Node](#node)
1. [Other bootstrapping](#other-bootstrapping)





## Topic End-Goal
At the end of this section, you should have this repository cloned locally, and you should be able to run `minikube start` and have the following output:

```
Starting local Kubernetes v1.10.0 cluster...
Starting VM...
Getting VM IP address...
Moving files into cluster...
Setting up certs...
Connecting to cluster...
Setting up kubeconfig...
Starting cluster components...
Kubectl is now configured to use the cluster.
Loading cached images from config file.
```

You should also be able to run `docker`, `docker-compose`, `kubectl`, and `vboxmanage` without any `No command ${CMD} found` errors.





## This Repository
You should have `git` already installed.

Run the following command to clone this repository:

```bash
git clone https://github.com/zephinzer/gtcdk8s.git
```

This should create a local copy of the repository on your machine so that you can work on the example applications.





## VirtualBox
VirtualBox is the hypervisor that we will use to create the single-node cluster.

Go to this link - [https://www.virtualbox.org/wiki/Downloads](https://www.virtualbox.org/wiki/Downloads) - and download the appropriate binary for your platform.

For Linux users, follow the instructions at this page: [https://www.virtualbox.org/wiki/Linux_Downloads](https://www.virtualbox.org/wiki/Linux_Downloads).

### VirtualBox Installation Notes
#### Secure Boot needs to be disabled?
If you're running Ubuntu on a machine with Secure Boot enabled, the easier way is to use another machine. If you choose to continue with this, follow the steps in [./virtualbox-on-ubuntu-with-secure-boot.md](./virtualbox-on-ubuntu-with-secure-boot.md) (warning: not trivial).

#### Verifying VirtualBox Installation
Verify that VirtualBox is correctly installed by running the following in your Terminal/PowerShell:

```sh
vboxmanage --version;
```

Your output should look something like:

```
5.2.10r122088
```





## Docker (with Compose)
Docker is the containerisation tool we'll be using.

| Operating System | Link | Other Notes |
| --- | --- | --- |
| Ubuntu | [https://store.docker.com/editions/community/docker-ce-server-ubuntu](https://store.docker.com/editions/community/docker-ce-server-ubuntu) | Follow the instructions below on 1. enabling Docker to be run without root 2. installing `docker-compose` |
| Fedora | [https://store.docker.com/editions/community/docker-ce-server-fedora](https://store.docker.com/editions/community/docker-ce-server-fedora) | Follow the instructions below on 1. enabling Docker to be run without root 2. installing `docker-compose` |
| Windows | [https://store.docker.com/editions/community/docker-ce-desktop-windows](https://store.docker.com/editions/community/docker-ce-desktop-windows) | If your system is older than Windows 8, you may need to install it from the link in the row directly below this |
| Windows (older) | [https://docs.docker.com/toolbox/toolbox_install_windows/](https://docs.docker.com/toolbox/toolbox_install_windows/) | Install via this link ONLY IF your system does not support the above link |
| MacOS | [https://store.docker.com/editions/community/docker-ce-desktop-mac](https://store.docker.com/editions/community/docker-ce-desktop-mac) | You lucky child |

### Docker Installation Notes
#### [Linux-Only] Installing Docker Compose
Install `pip` first (the alternative is to download the Docker Compose binary which isn't as convenient to update):

```bash
# ubuntu
sudo apt install python-pip;
# fedora
sudo dnf install python-pip;
# rhel
sudo yum install epel-release;
sudo yum install python-pip;
```

Next, install `docker-compose` with `pip`:

```bash
pip install docker-compose;
```

#### [Linux-Only] Running Docker without `root`
> This is a convenience solution that exposes certain vulnerabilities in Docker. Since for Linux environments we're actually sharing our machine's kernel with Docker, you may want to disable this at the end of the workshop. You have been warned!

Run:

```bash
sudo groupadd docker;
sudo usermod -aG docker $USER;
```

Log out of your system and log back in for changes to take effect.

#### Verifying `docker` Installation
Verify Docker is installed correctly by running the following in your Terminal/PowerShell:

```bash
docker --version;
```

Your output should look like:

```
Docker version 18.03.1-ce, build 9ee9f40
```

#### Verifying `docker-compose` Installation
Verify Docker Compose is installed correctly by running the following in your Terminal/PowerShell:

```bash
docker-compose version;
```

Your output should look like:

```
docker-compose version 1.20.1, build 5d8c71b
docker-py version: 3.2.1
CPython version: 2.7.12
OpenSSL version: OpenSSL 1.0.2g  1 Mar 2016
```




## kubectl
Kubectl is the command line tool we'll be using to communicate with our k8s master instance.

For all operating systems, follow the instructions at this link to install `kubectl`: [https://kubernetes.io/docs/tasks/tools/install-kubectl/](https://kubernetes.io/docs/tasks/tools/install-kubectl/).

### kubectl Installation Notes
#### Verifying `kubectl` Installation
Verify `kubectl` is correctly set up by running the following in your Terminal/Powershell:

```sh
kubectl version --client;
```

Your output should look like:

```
Client Version: version.Info{Major:"1", Minor:"11", GitVersion:"v1.11.1", GitCommit:"2bba0127d85d5a46ab4b778548be28623b32d0b0", GitTreeState:"clean", BuildDate:"2018-05-21T09:17:39Z", GoVersion:"go1.9.3", Compiler:"gc", Platform:"linux/amd64"}
```





## MiniKube
Minikube is a k8s deployment that works on a single virtual machine (termed a node).

For all operating systems, follow the instructions at this link: [https://github.com/kubernetes/minikube/releases](https://github.com/kubernetes/minikube/releases).

> **Important**: Please use version v0.28.2 as it has been tested to work best out of all.

### MiniKube Installation Notes
#### [Mac/Linux-Only] Solving inability to create host-only adapter
If you encounter the following error:

```
Error starting host:  Error creating host: Error executing step: Creating VM.: Error setting up host only network on machine start: The host-only adapter we just created is not visible. This is a well known VirtualBox bug. You might want to uninstall it and reinstall at least version 5.0.12 that is is supposed to fix this issue
```

Run the following command to restart the VirtualBox service:

```sh
# for linux:
sudo /sbin/rcvboxdrv restart;

# for mac:
sudo /Library/Application\ Support/VirtualBox/LaunchDaemons/VirtualBoxStartup.sh restart
```

If all is well, your output should look like:

#### [Mac/Linux-Only] Solving `kube-proxy` unable to start
This may or may not happen depending on your machine. If you encounter the following error:

```
E0715 02:10:13.259782   16316 start.go:281] Error restarting cluster:  restarting kube-proxy: waiting for kube-proxy to be up for configmap update: timed out waiting for the condition
```

Simply run `minikube delete` and `minikube start` again.

#### Verifying MiniKube Installation
Verify MiniKube is correctly set up by running the following in your Terminal:

```bash
minikube version;
```

Your output should look like:

```
minikube version: v0.28.2
```

Also verify that it runs well.

```bash
minikube start;
```

This should exit without errors and should display something like:

```
Starting local Kubernetes v1.10.0 cluster...
Starting VM...
Getting VM IP address...
Moving files into cluster...
Setting up certs...
Connecting to cluster...
Setting up kubeconfig...
Starting cluster components...
Kubectl is now configured to use the cluster.
Loading cached images from config file.
```

You can then run the following to verify that all is well with the execution:

```bash
minikube status;
```

This should yield something similar to:

```
minikube: Running
cluster: Running
kubectl: Correctly Configured: pointing to minikube-vm at 192.168.99.100
```

Well done, that was possibly the toughest installation for this workshop.





## Node

> We won't be using Node much but it is useful to run some of the examples without a container just to see what it's like and the conveniences which containerisation brings.

Download and install Node from [the official download page](https://nodejs.org/en/download/). 

### Node Installation Notes
#### Verifying Node Installation
Verify Node is correctly set up by running the following in your Terminal:

```bash
node -v;
```

Your output should look like:

```
v8.11.4
```





## Other Bootstrapping
### External Docker Images
Just in case the conference WiFi isn't too good and you aren't willing to use your mobile data, you can run the following command **from the root of this repository** to grab all the external Docker images we will be using before the conference:

```bash
make pull.images;
```

The above command should pull all images required for the workshop.

If you don't have `make` installed, install it via Brew:

```bash
brew install make;
```

# Next Steps
All set up? Head [over to the first section - Cloud Native Applications](../01-application/README.md).
