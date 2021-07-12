import React, { Component } from 'react';

import { connect } from 'react-redux';

import Order from '../../components/Burger/Order/Order';
import Spinner from '../../components/UI/Spinner/Spinner';
import axios from '../../axios-orders';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import * as actionCreators from '../../store/actions/index';

class Orders extends Component {
  componentDidMount() {
    this.props.fetchOrders(this.props.token, this.props.userId);
  }
  render() {
    if (this.props.loading || !this.props.orders) {
      return <Spinner />;
    }
    return (
      <div>
        {(this.props.orders).map(order => (
          <Order
            key={order.id}
            ingredients={order.ingredients}
            price={order.price}/>
        ))}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    loading: state.order.fetchingOrders,
    orders: state.order.orders,
    token: state.auth.idToken,
    userId: state.auth.userId
  }
};
const mapDispatchToProps = (dispatch) => {
  return {
    fetchOrders: (token, userId) => dispatch(actionCreators.fetchOrders(token, userId))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(Orders, axios));