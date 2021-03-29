import React, { Component } from 'react';

import Order from '../../components/Burger/Order/Order';
import Spinner from '../../components/UI/Spinner/Spinner';
import axios from '../../axios-orders';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';

class Orders extends Component {
  state = {
    orders: null,
    loading: false
  }
  componentDidMount() {
    this.setState({ loading: true });
    axios.get('orders.json')
      .then(res => {
        const orders = Object.keys(res.data).map(orderId => ({...res.data[orderId], id: orderId}));
        this.setState({ orders, loading: false });
      })
      .catch(err => this.setState({ loading: false }))
  }
  render() {
    if (this.state.loading || !this.state.orders) {
      return <Spinner />;
    }
    return (
      <div>
        {(this.state.orders).map(order => (
          <Order
            key={order.id}
            ingredients={order.ingredients}
            price={order.price}/>
        ))}
      </div>
    );
  }
}

export default withErrorHandler(Orders, axios);