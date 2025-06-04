## build & run the containers:
docker build -t payment-service ./payment
docker run -d -p 3001:3001 payment-service
# List running containers: 
docker ps
## List all containers (including stopped ones): 
docker ps -a
## Stop a container: 
docker stop <container_id>
## Remove a container: 
docker rm <container_id>
