## kubernetes 
 → Used to orchestrate containers, manage scaling, and handle networking efficiently

## Deploy to Kubernetes:
kubectl apply -f payment-deployment.yaml
kubectl apply -f shipping-deployment.yaml

## List all running deployments:
kubectl get deployments
## Delete a specific deployment
kubectl delete deployment <deployment_name>
## remove all Kubernetes deployments:
kubectl delete deployments --all
# stop Kubernetes entirely:
kubectl delete all --all