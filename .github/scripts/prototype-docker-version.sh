#!/bin/sh

# See https://docs.github.com/en/actions/learn-github-actions/environment-variables#default-environment-variables for references on GITHUB_REF_NAME
prototype_branch=$1                                                        # $GITHUB_REF_NAME
prototype_branch=$(echo $prototype_branch | sed -r 's/prototype-beta\///') # remove pre-prending prototype-beta/
prototype_name=$(echo $prototype_branch | sed -r 's/-beta//')              # remove appended -beta

docker_image=$(curl "https://hub.docker.com/v2/repositories/getmeili/meilisearch/tags?&page_size=100" | jq | grep "$prototype_name" | head -1)
docker_image=$(echo $docker_image | grep '"name":' | cut -d ':' -f 2- | tr -d ' ' | tr -d '"' | tr -d ',')
echo $docker_image
