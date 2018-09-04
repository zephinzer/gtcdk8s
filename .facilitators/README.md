# Notes for Facilitators

- [Overall flow](#overall-flow)
- [Section 1: Cloud Native Applications](#section-1-cloud-native-applications)
- [Docker Images](#docker-images)
- [MiniKube Commands](#minikube-commands)
- [Kubectl Commands](#kubectl-commands)
- [Other Issues](#other-issues)


- - -


## Overall Flow
The workshop is 2 hours and will proceed in 30 minute blocks - 30 minutes for each of the following sections:

1. [Cloud Native Applications](../01-application/README.md)
1. [Application Containerisation](../02-containerising/README.md)
1. [Environment Provisioning](../03-provisioning/README.md)
1. [Deploying Containers in Production](../04-deploying/README.md)

This will consist of ~10 minutes of introducing concepts and demonstration of final product, along with 20 minutes of self-working through during which we will walk around helping participants.


- - -


## Section 1 - Cloud Native Applications
This section covers:
- Liveness checks
- Readiness checks
- Application metrics
- Centralised logging
- Distributed tracing
- Alerting

Endpoints:
- [Grafana at http://localhost:43000](http://localhost:43000)
- [Kibana at http://localhost:45601](http://localhost:45601)
- [Prometheus at http://localhost:49090](http://localhost:49090)
- [Zipkin at http://localhost:49411](http://localhost:49411)

Things to note:
- **Empty Grafana**: Import the Grafana panel JSON from `./01-application/grafana-dashboard/node-panel.json`
- **No Logs**: Re-add the index (`fluentd-*`) under **Management** > **Index Patterns** > **Create Index Pattern**


- - -


## Docker Images
Re: [Other Bootstrapping - External Docker Images](../00-setup/README.md#external-docker-images)

### Online Backup
The Docker tarballs can be found online at [this url](https://drive.google.com/drive/folders/1Lp_V_O4NeqIzaA1P4BoAOqqtJdxZ-dx4?usp=sharing)

### Pulling all images
Run the following on the target host to pull all images so they're accessible locally:

```bash
make pull.images;
```

### Saving all images to tarballs
Run the following from the repository root to save all images as tarballs:

```bash
make save.images;
```

### Loading all images from tarballs
Run the following from the repository root to load all images as tarballs:

```bash
make load.images;
```


- - -


## MiniKube Commands
Here are some commands you can use to debug the MiniKube. Additional notes on how to solve problems can be found [within the setup instructions (click this link)](../00-setup/README.md#minikube-installation-notes).



- - -


## Kubectl Commands
The following is a list of commands you can use to diagnose problems with the participant's machines.

All deployments will be done on the `default` namespace **EXCEPT** for the Ingress controller (note: not the Ingress, but the Ingress controller) which we have no control over since it's MiniKube's custom add-on. The Ingress controller is deployed in the `kube-system` namespace. To specify a namespace, simply add `-n <namespace_id>` to any command.

```bash
# get all deployments
kubectl get deploy;

# get all services
kubectl get svc;

# get all ingresses
kubectl get ing;

# get the ingress controller
kubectl get deploy nginx-ingress-controller -n kube-system;
# note: if this is empty, participant has likely not enabled it on their Minikube, enable it with `minikube addons enable ingress`,
```


- - -


## Other Issues

### Section 4
#### Default Backend
If participant hits `default backend - 404`, this means the Ingress is not property configured. Check that:

- `/etc/hosts` is configured to have an IP address corresponding to the value returned by `minikube ip` pointing to the hostname `whack-a-pod.local`.
- If that fails, do a `curl -vv http://whack-a-pod.local >/dev/null` and check that the IP corresponds to the IP of the VM (`minikube ip`)
- Verify that `kubectl get ingress wap-ingress` returns something and that the `HOSTS` column points to `whack-a-pod.local`