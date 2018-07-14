# Docker
> Docker is the containerisation technology we will use to deploy applications to our k8s cluster

Go to this link - https://store.docker.com/search?type=edition&offering=community - and download the appropriate package for your platform.

## Verify Installation
Verify Docker is installed correctly by running the following in your Terminal:

```sh
docker version;
```

Your output should look like:

```
Client:
 Version:      18.03.1-ce
 API version:  1.37
 Go version:   go1.9.5
 Git commit:   9ee9f40
 Built:        Thu Apr 26 07:17:20 2018
 OS/Arch:      linux/amd64
 Experimental: false
 Orchestrator: swarm

Server:
 Engine:
  Version:      18.03.1-ce
  API version:  1.37 (minimum version 1.12)
  Go version:   go1.9.5
  Git commit:   9ee9f40
  Built:        Thu Apr 26 07:15:30 2018
  OS/Arch:      linux/amd64
  Experimental: false
```