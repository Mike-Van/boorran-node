const HASURA_URL = process.env.HASURA_URL || 'https://boorran-gql.herokuapp.com/v1/graphql';
const HASURA_ACCESS_KEY = process.env.HASURA_ACCESS_KEY || 'Boorran168';

const BOORRAN_API_KEY = process.env.BOORRAN_API_KEY || '6b74f6399b477624321c873ed27233f9';
const BOORRAN_API_PW = process.env.BOORRAN_API_PW || 'e3c65a82a58b3e25ef9d667877562589';
const BOORRAN_STOREFRONT_TOKEN = process.env.BOORRAN_STOREFRONT_TOKEN || 'adf25cb8f1704358950a1a44d052b69d';
const BOORRAN_STORE = process.env.BOORRAN_STORE || 'boorran-store.myshopify.com';

module.exports = {
  HASURA_URL,
  HASURA_ACCESS_KEY,
  BOORRAN_API_PW,
  BOORRAN_API_KEY,
  BOORRAN_STOREFRONT_TOKEN,
  BOORRAN_STORE
}
