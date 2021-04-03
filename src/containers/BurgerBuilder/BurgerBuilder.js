import React, { Component } from 'react';
import { connect } from 'react-redux';

import Aux from '../../hoc/Aux/Aux';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import axios from '../../axios-orders';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import * as actionTypes from '../../store/actions';

class BurgerBuilder extends Component {
  state = {
    purchasing: false,
    loading: false,
    error: false
  }

  componentDidMount() {
    axios.get('/ingredients.json')
      .then(res => {
        this.setState({ ingredients: res.data });
      }).catch(error => {
        this.setState({ error: true });
      });
  }

  purchaseHandler = () => {
    this.setState({ purchasing: true });
  }

  purchaseCancelHandler = () => {
    this.setState({ purchasing: false });
  }

  purchaseContinueHandler = () => {
    this.props.history.push('/checkout');
  }

  render() {
    let orderSummary = null;
    let buildControls = this.state.error ? <p>Ingredients can't be loaded!</p> : <Spinner />;
    if (this.props.ingredients) {
      const disabledInfo = Object.keys(this.props.ingredients)
        .reduce((acc, ing) => ({...acc, [ing]: this.props.ingredients[ing] <= 0}), {});
      if (!this.state.loading) {
        orderSummary = (
          <OrderSummary
            ingredients={this.props.ingredients}
            price={this.props.totalPrice}
            purchaseCanceled={this.purchaseCancelHandler}
            purchaseContinued={this.purchaseContinueHandler}
          />
        );
      }
      buildControls = (
        <Aux>
          <Burger ingredients={this.props.ingredients} />
          <BuildControls 
            ingredientAdded={this.props.onAddIngredient}
            ingredientRemoved={this.props.onRemoveIngredient}
            disabled={disabledInfo}
            purchasable={this.props.purchasable}
            price={this.props.totalPrice}
            ordered={this.purchaseHandler}
          />
        </Aux>
      )
    }

    return (
      <Aux>
        <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
          {orderSummary}
        </Modal>
        {buildControls}
      </Aux>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    ingredients: state.ingredients,
    totalPrice: state.totalPrice,
    purchasable: state.purchasable
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onAddIngredient: (ingrName) => dispatch({ type: actionTypes.ADD_INGREDIENT, payload: ingrName}),
    onRemoveIngredient: (ingrName) => dispatch({ type: actionTypes.REMOVE_INGREDIENT, payload: ingrName})
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));