import * as actionTypes from './actionTypes';
import axios from '../../axios-orders';

export const purchaseBurgerSuccess = (id, orderData) => {
  return {
    type: actionTypes.PURCHASE_BURGER_SUCCESS,
    orderId: id,
    orderData: orderData
  }
};
export const purchaseBurgerFailed = (error) => ({ type: actionTypes.PURCHASE_BURGER_FAILED, error });
export const purchaseBurgerStart = () => ({ type: actionTypes.PURCHASE_BURGER_START })
export const purchaseInit = () => ({ type: actionTypes.PURCHASE_INIT })

export const purchaseBurger = (orderData, token) => {
  return dispatch => {
    dispatch(purchaseBurgerStart());
    axios.post('/orders.json?auth=' + token, orderData)
    .then(resp => {
      console.log(resp.data);
      dispatch(purchaseBurgerSuccess(resp.data.name, orderData));
    })
    .catch(error => {
      dispatch(purchaseBurgerFailed(error));
    });
  }
}

export const fetchOrdersStart = () => ({ type: actionTypes.FETCH_ORDERS_START });
export const fetchOrdersSucess = (orders) => ({ type: actionTypes.FETCH_ORDERS_SUCCESS, orders });
export const fetchOrdersFailed = () => ({ type: actionTypes.FETCH_ORDERS_FAILED });
export const fetchOrders = (token, userId) => {
  return dispatch => {
    dispatch(fetchOrdersStart());
    const queryParams = '?auth=' + token + '&orderBy="userId"&equalTo="' + userId + '"';
    axios.get('orders.json' + queryParams)
      .then(res => {
        const orders = Object.keys(res.data).map(orderId => ({...res.data[orderId], id: orderId}));
        dispatch(fetchOrdersSucess(orders));
      })
      .catch(err => dispatch(fetchOrdersFailed()))
  }
}
