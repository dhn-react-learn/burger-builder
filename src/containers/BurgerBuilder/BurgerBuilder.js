import React, { Component } from 'react';

import Aux from '../../hoc/Aux/Aux';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import axios from '../../axios-orders';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';

const INGREDIENT_PRICES = {
  salad: 0.5,
  bacon: 0.7,
  meat: 1.3,
  cheese: 0.4
};

class BurgerBuilder extends Component {
  state = {
    ingredients: null,
    totalPrice: 4,
    purchasable: false,
    purchasing: false,
    loading: false,
    error: false
  }

  componentDidMount() {
    axios.get('/ingredients.json')
      .then(res => {
        console.log(res.data);
        this.setState({ ingredients: res.data });
      }).catch(error => {
        this.setState({ error: true });
      });
  }

  updatePurchaseState = (ingredients) => {
    const sum = Object.keys(ingredients)
      .reduce(
        (acc, key) => acc + ingredients[key], 0
      );
    this.setState({ purchasable: sum > 0 });
  }

  ingredientHandler = (type, handler) => {
    if (type in INGREDIENT_PRICES) {
      this.setState((prevState) => {
        const newIngredients = {
          ...prevState.ingredients
        };
        newIngredients[type] = handler(prevState.ingredients[type], 1);
        const newPrice = handler(prevState.totalPrice, INGREDIENT_PRICES[type]);
        this.updatePurchaseState(newIngredients);
        return {
          ingredients: newIngredients,
          totalPrice: newPrice
        }
      });
    }
  }

  addIngredientHandler = (type) => {
    this.ingredientHandler(type, (a, b) => a + b);
  }

  removeIngredientHandler = (type) => {
    this.ingredientHandler(type, (a, b) => a - b > 0 ? a - b : 0);
  }

  purchaseHandler = () => {
    this.setState({ purchasing: true });
  }

  purchaseCancelHandler = () => {
    this.setState({ purchasing: false });
  }

  purchaseContinueHandler = () => {
    // alert("You continue!!!");
    const order = {
      ingredients: this.state.ingredients,
      price: this.state.totalPrice,
      customer: {
        name: 'Duc Nguyen',
        address: {
          street: 'Test Street 1',
          zipCode: '12345',
          country: 'Viet Nam'
        },
        email: 'test@test.com'
      },
      deliveryMethod: 'fastest'
    }
    this.setState({ loading: true });
    axios.post('/orders.json', order)
      .then(response => {
        this.setState({ loading: false, purchasing: false });
      })
      .catch(error => {
        this.setState({ loading: false, purchasing: false });
      });
  }

  render() {
    let orderSummary = null;
    let buildControls = this.state.error ? <p>Ingredients can't be loaded!</p> : <Spinner />;
    if (this.state.ingredients) {
      const disabledInfo = Object.keys(this.state.ingredients)
        .reduce((acc, ing) => ({...acc, [ing]: this.state.ingredients[ing] <= 0}), {});
      if (!this.state.loading) {
        orderSummary = (
          <OrderSummary
            ingredients={this.state.ingredients}
            price={this.state.totalPrice}
            purchaseCanceled={this.purchaseCancelHandler}
            purchaseContinued={this.purchaseContinueHandler}
          />
        );
      }
      buildControls = (
        <Aux>
          <Burger ingredients={this.state.ingredients} />
          <BuildControls 
            ingredientAdded={this.addIngredientHandler}
            ingredientRemoved={this.removeIngredientHandler}
            disabled={disabledInfo}
            purchasable={this.state.purchasable}
            price={this.state.totalPrice}
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

export default withErrorHandler(BurgerBuilder, axios);