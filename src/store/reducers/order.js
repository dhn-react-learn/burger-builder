import * as actionTypes from '../actions/actionTypes';

const initialState = {
  orders: [],
  fetchingOrders: false,
  loading: false,
  error: null,
  purchased: false
};

const orderReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.PURCHASE_INIT:
      return {
        ...state,
        purchased: false
      }
    case actionTypes.PURCHASE_BURGER_START:
      return {
        ...state,
        loading: true,
        error: null
      }
    case actionTypes.PURCHASE_BURGER_SUCCESS:
      return {
        ...state,
        orders: [...state.orders, {...action.orderData, id: action.orderId}],
        purchased: true
      }
    case actionTypes.PURCHASE_BURGER_FAILED:
      return {
        ...state,
        loading: false,
        error: action.error,
        purchased: true
      }
    case actionTypes.FETCH_ORDERS_START:
      return {
        ...state,
        fetchingOrders: true,
        orders: []
      }
    case actionTypes.FETCH_ORDERS_SUCCESS:
      return {
        ...state,
        fetchingOrders: false,
        orders: action.orders
      }
    case actionTypes.FETCH_ORDERS_FAILED:
      return {
        ...state,
        fetchingOrders: false
      }
    default:
      return state;
  }
}

export default orderReducer;
