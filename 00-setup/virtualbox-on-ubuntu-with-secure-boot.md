# VirtualBox on Ubuntu with Secure Boot
This issue happens when attempting to run VirtualBox on Ubuntu when the Secure Boot option is enabled and is a known issue.

To solve this problem, install VirtualBox from the 3rd party repository at https://www.ubuntuupdates.org/ppa/virtualbox.org_contrib.

## Set up 3rd party repository

First, set up the keys:
```sh
wget -q -O - http://download.virtualbox.org/virtualbox/debian/oracle_vbox_2016.asc | sudo apt-key add -
```

Next, add the repository:

> The below command is for 16.04, for 18.04, change `xenial` to `bionic`. For older versions, change as appropriate to your system (ie. 17.04 - `artsy`)

```sh
sudo sh -c 'echo "deb http://download.virtualbox.org/virtualbox/debian xenial non-free contrib" >> /etc/apt/sources.list.d/virtualbox.org.list' 
```

If you're on < 18.04, run `apt update` too.

## Install VirtualBox

Next, install VirtualBox with either:

```sh
sudo apt install virtualbox-5.2
```

Or

```sh
sudo apt install virtualbox-5.1
```

You should get an error when VirtualBox tries to build the kernel modules. This is expected if Secure Boot is enabled because it prevents the loading of keys other than the OEM's machine owner's key (MOK).

## Building the kernel modules
The solution follows that we sign the kernel modules with our own user generated MOK. This means we need to:
1. Generate the MOK
2. Register (enroll) the MOK
3. Sign the modules

### Generating the MOK
We will be using `root` to generate and enroll the MOKs.

Generate the keys at `/root/custom-moks`:

```sh
sudo openssl req \
  -nodes \
  -new -x509 \
  -newkey rsa:2048 \
  -keyout /root/custom-moks/MOK.priv \
  -outform DER \
  -out /root/custom-moks/MOK.der \
  -days 36500 \
  -subj "/CN=Your common name/";
```

> Replace the `Your common name` with your own name.

### Register the MOK
Run the following to register the created MOK:

```sh
sudo mokutil --import /root/custom-moks/MOK.der;
```

You'll be prompted for passwords. Enter a fresh password (this is used later when the bootloader registers the MOKs).

Reboot your machine and you'll be greeted with a terminal screen requesting for the password you entered a few moments ago.

Enter the password and let the system reboot again (happens automatically).

When the system boots, ensure that the MOK has been registered using:

```sh
sudo mokutil --test-key /root/custom-moks/MOK.der
```

### Sign the modules
Create a new script at `/root/custom-moks/vbsign` and paste in the following script:

```sh
#!/bin/bash
for modfile in $(dirname $(modinfo -n vboxdrv))/*.ko; do
  echo "Signing $modfile";
  /usr/src/linux-headers-$(uname -r)/scripts/sign-file sha256 \
                                /root/module-signing/MOK.priv \
                                /root/module-signing/MOK.der "$modfile";
done;
```

This script allows you to run `sudo /root/custom-moks/vbsign` to sign all your VirtualBox kernels at once.

Make sure it's executable:

```sh
sudo chmod 700 /root/custom-moks/vbsign;
```

Run it once with:

```sh
sudo /root/custom-moks/vbsign;
```

You should see a list of signed modules.

### Verifying that all is well

Verify the MOK is enrolled:

```sh
sudo mokutil --test-key /root/custom-moks/MOK.der;
```

> Output should look like: `"/root/custom-moks/MOK.der is already enrolled"`

Check that the `vboxdrv` works:

```sh
sudo modprobe vboxdrv;
```

> Output should be an empty newline.

Check that the kernel modules are signed with your custom MOK:

```sh
tail $(modinfo -n vboxdrv) | grep "Module signature appended"
```

> Output should look like: `"Binary file (standard input) matches"`

**You're all set!**

# References
1. https://askubuntu.com/questions/900118/vboxdrv-sh-failed-modprobe-vboxdrv-failed-please-use-dmesg-to-find-out-why
2. https://askubuntu.com/questions/760671/could-not-load-vboxdrv-after-upgrade-to-ubuntu-16-04-and-i-want-to-keep-secur
3. https://stegard.net/2016/10/virtualbox-secure-boot-ubuntu-fail/
4. https://www.ubuntuupdates.org/ppa/virtualbox.org_contrib