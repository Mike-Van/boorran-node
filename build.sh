!#/bin/bash

git pull 
docker build . -t api:latest
docker system prune
cd ../etc/hasura
docker-compose down
docker-compose up
