## kubernetes 
 → Used to orchestrate containers, manage scaling, and handle networking efficiently
## Kind (Kubernetes IN Docker)
 is an excellent option for running Kubernetes locally inside Docker.
# Create a Kind Cluster
kind create cluster --name my-cluster
# To delete the Kind cluster later:
kind delete cluster --name my-cluster
## Deploy to Kubernetes: manifests inside Kind
-kubectl apply -f APIproject/kubernetes/payment-deployment.yaml
-kubectl apply -f APIproject/kubernetes/shipping-deployment.yaml
-kubectl apply -f APIproject/kubernetes/notifications-deployment.yaml
## List all running deployments:
kubectl get deployments
## Delete a specific deployment
kubectl delete deployment <deployment_name>
## remove all Kubernetes deployments:
kubectl delete deployments --all
# stop Kubernetes entirely:
kubectl delete all --all

