install:
	yarn

dev: install
	yarn dev

tag:
	docker tag seaside-archives registry.dougflynn.dev/seaside-archives .

build-arm: ready
	docker buildx build --platform linux/arm64 --push \
		-t registry.dougflynn.dev/seaside-archives \
		-f docker/Dockerfile.prod .

build:
	docker buildx build --platform linux/arm64 --push \
		-t registry.dougflynn.dev/seaside-archives \
		-f docker/Dockerfile.prod .

publish: build
	echo Waiting a few seconds for docker image to upload...
	sleep 10
	kubectl rollout restart deployment -n seasidefm archives