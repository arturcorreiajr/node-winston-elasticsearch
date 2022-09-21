```console
docker build -t arturcorreiajunior/app-test-winston:latest .
docker push arturcorreiajunior/app-test-winston:latest 
kubectl apply -f yaml/node.yaml -n elastic 
```