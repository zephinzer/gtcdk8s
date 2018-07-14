# Setting up your cluster

## Verify everything's installed
Run the following command and if all commands are listed as `Success`, you're good to go:

```sh
printf -- 'VirtualBox : ' && vboxmanage --version >/dev/null && printf -- 'Success\n' || printf -- 'Failure\n'; \
printf -- 'Docker     : ' && docker version >/dev/null && printf -- 'Success\n' || printf -- 'Failure\n'; \
printf -- 'MiniKube   : ' && minikube version >/dev/null && printf -- 'Success\n' || printf -- 'Failure\n'; \
printf -- 'KubeCtl    : ' && kubectl version --client >/dev/null && printf -- 'Success\n' || printf -- 'Failure\n';
```

## Start MiniKube
Run the following to get started:

```sh
minikube start
```

> If you encounter the following error:
> 
> ```
> Error starting host:  Error creating host: Error executing step: Creating VM.: Error setting up host only network on machine start: The host-only adapter we just created is not > visible. This is a well known VirtualBox bug. You might want to uninstall it and reinstall at least version 5.0.12 that is is supposed to fix this issue
> ```
> 
> Run the following command to restart the VirtualBox service:
> 
> ```sh
> # for linux:
> sudo /sbin/rcvboxdrv restart;
> # for mac:
> sudo /Library/Application\ Support/VirtualBox/LaunchDaemons/VirtualBoxStartup.sh restart
> ```

If all is well, your output should look like:

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

> If you encounter the following error:
> 
> ```
> E0715 02:10:13.259782   16316 start.go:281] Error restarting cluster:  restarting kube-proxy: waiting for kube-proxy to be up for configmap update: timed out waiting for the condition
> ```
> 
> Simply run `minikube delete` and `minikube start` again.

## Verify it works
Run the following to check if `kubectl` has a connection to the server:

```sh
kubectl version --short;
```

> The correct output should look like:
> 
> ```
> Client Version: v1.11.0
> Server Version: v1.10.0
> ```

Run the following to check if `minikube` has set up everything correctly:

```sh
minikube status;
```

> The correct output should look like:
> 
> ```
> minikube: Running
> cluster: Running
> kubectl: Correctly Configured: pointing to minikube-vm at 192.168.xxx.yyy
> ```

## Access the Dashboard
Run the following to access the dashboard:

```sh
minikube dashboard;
```

## References
1. http://local.getflywheel.com/community/t/virtualbox-failing-to-install/4989
2. https://sysadm.ru/linux/servers/virtual/virtualbox/network/centos-dev-vboxnetctl-no-such-file-or-directory/
