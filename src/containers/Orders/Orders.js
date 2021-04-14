import React, { Component } from 'react';

import { connect } from 'react-redux';

import Order from '../../components/Burger/Order/Order';
import Spinner from '../../components/UI/Spinner/Spinner';
import axios from '../../axios-orders';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import * as actionCreators from '../../store/actions/index';

class Orders extends Component {
  componentDidMount() {
    this.props.fetchOrders();
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
    orders: state.order.orders
  }
};
const mapDispatchToProps = (dispatch) => {
  return {
    fetchOrders: () => dispatch(actionCreators.fetchOrders())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(Orders, axios));