# Notes for Facilitators

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