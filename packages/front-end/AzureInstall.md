
# Containerizing and deploying to Azure

I am still learning how to deploy this with Docker containers on Azure.

Here is my basic steps, assuming the version you want to push is "v5".
I increment this with each push. I then have to edit the "Revisions and Replicas" at Azure to accept this tag.


```
az acr login --name helpfulcontainerregistry
docker build --platform linux/amd64  -t helpfulcontainerregistry.azurecr.io/myapp-frontend:v5 .

docker run --rm -p 3000:3000 helpfulcontainerregistry.azurecr.io/myapp-frontend:v5
docker push helpfulcontainerregistry.azurecr.io/myapp-frontend:v5
```
