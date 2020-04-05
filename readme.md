# Boorran Node
This is the repo containing the serverless application hosted at [https://node.boorran.com](https://node.boorran.com). All necessary configuration variables can be found inside `config.js` file.

To run this repo locally:
```
npm install && npm start
```

To start in production:
```
npm run start:production
```

To sync orders from Shopify manually, use `GET /boorran/orders` endpoint. Default, it'd fetch 50 latest orders and store it to hasura, then return object containing `page_info`. Use this to fetch further data by specify `page_info` and `limit` params.

Check out in `serverless.yaml` and `functions` folders for all available endpoints.

You should also have a new development environment hasura endpoint. I might delete the current one soon enough since its on my heroku account :D

To deploy this:
```
ssh root@178.128.94.27 //login to server
cd ../boorran-node //change to node directory
bash -x build.sh // run build shell commands
```
