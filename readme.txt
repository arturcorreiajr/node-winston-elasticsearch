docker build -t arturcorreiajunior/app-test-winston:latest .
docker push arturcorreiajunior/app-test-winston:latest 
kubectl apply -f yaml/index.yaml -n elastic 