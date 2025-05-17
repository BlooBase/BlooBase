//this file contains functions that are implemented in the web app

async function fetchOrderStatus(orderId, userToken) {
  //replace this with the actual api
  const response = await fetch(`/api/orders/${orderId}`, {
    headers: { Authorization: `Bearer ${userToken}` },
  });
  const result = await response.json();
  if (result.success) {
    console.log(result.data); 
  } else {
    console.error(result.error);
  }
}

module.exports = { fetchOrderStatus };

