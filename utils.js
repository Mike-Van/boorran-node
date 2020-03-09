const { GQL } = require('fetchier');
const { HASURA_URL, HASURA_ACCESS_KEY } = require('./config');

const gqRequest = async (query, variables) => {
  return await GQL({
    url: HASURA_URL,
    headers: { 'x-hasura-admin-secret': HASURA_ACCESS_KEY },
    query,
    variables
  });
};

const userField = `id name email photo store role metadata activationStatus`;
const sessionField = `id createdAt expiredAt user { ${userField} }`;

const qCheckUser = (email, pin) => `{
  Users(where: {
    _and: [
      { email: { _eq: "${email}"} }
      { pin: { _eq: "${pin}"} }
    ]
  }) {
    ${userField}
    userSessions(limit: 1, order_by: {createdAt: desc}) {
      ${sessionField}
    }
  }
}`;

const qCreateSession = (id, expired) => `mutation {
  insert_Sessions(objects: {
    userId: "${id}",
    expiredAt: "${expired}"
  }) {
    returning {
      ${sessionField}
    }
  }
}`;

const qGetUserByToken = token => `{
  Sessions(where: {
    id: { _eq: "${token}" }
  }) {
    ${sessionField}
  }
}`;

const qUpsertOrder = `mutation($obj: [boorran_Orders_insert_input!]!) {
  insert_boorran_Orders(objects: $obj on_conflict: {
    constraint: Orders_shopifyOrderId_key
    update_columns: [ shopifyOrderId ]
  }) {
    returning {
      id
      createdAt
    }
  }
}`

const parseOrderObj = order => {
  const {
    id,
    order_number,
    line_items,
    note,
    payment_gateway_names = [],
    financial_status,
    customer,
    created_at,
    shipping_address = {},
    billing_address = {},
    total_line_items_price,
    total_discounts,
    total_tax,
    subtotal_price,
    total_shipping_price_set: { shop_money: { amount } },
    total_price,
  } = order;

  const address = shipping_address.address1 || billing_address.address1 || customer.default_address && customer.default_address.address1;

  return {
    shopifyOrderId: id.toString(),
    createdAt: created_at,
    shopifyOrderNumber: order_number.toString(),
    note: note,
    paymentMethod: payment_gateway_names[0] || '',
    status: financial_status,
    orderAddress: address,
    deliveryDestination: address,
    itemsPrice: total_line_items_price,
    discount: total_discounts,
    taxPrice: total_tax,
    subTotal: subtotal_price,
    deliveryPrice: amount,
    grandTotal: total_price,
    boorranGrandTotal: total_price,
    customer: {
      data: {
        email: customer.email,
        phone: customer.phone,
        firstName: customer.first_name,
        lastName: customer.last_name,
        shopifyCustomerId: customer.id.toString()
      },
      on_conflict: {
        constraint: "Customers_shopifyCustomerId_key",
        update_columns: ['email', 'firstName', 'lastName', 'phone']
      }
    },
    orderItems: {
      data: line_items.map(item => {
        return {
          itemId: item.product_id,
          itemTitle: item.title,
          variantId: item.variant_id,
          variantTitle: item.variant_title,
          quantity: item.quantity,
          discount: item.total_discount,
          unitPrice: item.price
        }
      }),
      on_conflict: {
        constraint: "OrderItems_pkey",
        update_columns: []
      }
    }
  };
};

module.exports = {
  qCheckUser,
  qCreateSession,
  qGetUserByToken,
  gqRequest,
  qUpsertOrder,
  parseOrderObj,
};
