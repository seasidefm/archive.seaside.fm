install:
	yarn

dev: install
	yarn dev

ready:
    docker run --rm --privileged linuxkit/binfmt:v0.8

tag:
	docker tag seaside-archives registry.dougflynn.dev/seaside-archives .

build-arm: ready
	docker buildx build --platform linux/arm64 --push \
		-t registry.dougflynn.dev/seaside-archives \
		-f docker/prod.Dockerfile .

publish: build-arm
	echo Waiting a few seconds for docker image to upload...
	#sleep 10
	#kubectl rollout restart deployment -n botsuro seaside-archives-deployment