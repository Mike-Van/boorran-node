!#/bin/bash

git pull
docker system prune -f
docker build . -t api:latest
cd ../etc/hasura
docker-compose down
docker-compose up -d
