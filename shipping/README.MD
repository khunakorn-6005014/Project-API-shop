## build & run the containers:
docker build -t shipping-service ./shipping
docker run -d -p 3002:3002 shipping-service
# List running containers: 
docker ps
## List all containers (including stopped ones): 
docker ps -a
## Stop a container: 
docker stop <container_id>
## Remove a container: 
docker rm <container_id>
##  stop all containers at once:
docker stop $(docker ps -q)
##  to remove Docker images:
docker rmi -f <image_id>
## remove all images:
docker rmi $(docker images -q)
##
npm install         # make sure devDependencies (jest, supertest, mongodb-memory-server) are installed
npm test            # runs all unit & integration tests under tests/
“service-level tests currently run outside Docker; containerised runner to be added later