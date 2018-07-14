# VirtualBox
> VirtualBox is the hypervisor that we will use to create the single-node cluster.

Go to this link - https://www.virtualbox.org/wiki/Downloads - and download the appropriate binary for your platform.

For Linux users, install it via your own repositories.

> **Note** If you're running Ubuntu on a machine with Secure Boot enabled, the easier way is to use another machine. If you choose to continue with this, follow the steps in [../00-notes/virtualbox-on-ubuntu-with-secure-boot.md]

## Verify Installation
Verify that VirtualBox is correctly installed by running the following in your Terminal:

```sh
vboxmanage --version;
```

Your output should look something like:

```
5.2.10r122088
```

