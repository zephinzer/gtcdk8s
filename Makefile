pull.images: docker.exists
	@printf -- 'Following images will be downloaded:\n';
	@cat .images/.list | cut -f 1 -d ' ' | xargs -I@ printf -- '- @\n'
	@cat .images/.list | cut -f 1 -d ' ' | xargs -I@ docker pull @;

save.images: docker.exists
	@printf -- 'Following images will be created:\n';
	for image in `cat ./.images/.list`; do \
		docker save -o "./.images/$$(printf -- "$$image.tar" | sed -r "s/(\/|\:)/./g")" "$$image"; \
	done;

load.images: docker.exists
	ls -1A ./.images | xargs -I@ docker load -i './.images/@'

docker.exists:
	@which docker && exit 0 || $(MAKE) docker.exists.not

docker.exists.not:
	@printf -- '\033[31mDocker does not exist - download it and try again\033[0m\n'
	@exit 1
	