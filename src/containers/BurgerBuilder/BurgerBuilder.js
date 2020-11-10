import React, { Component } from 'react';

import Aux from '../../hoc/Aux/Aux';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';

const INGREDIENT_PRICES = {
  salad: 0.5,
  bacon: 0.7,
  meat: 1.3,
  cheese: 0.4
};

class BurgerBuilder extends Component {
  state = {
    ingredients: {
      salad: 0,
      bacon: 0,
      cheese: 0,
      meat: 0
    },
    totalPrice: 4,
    purchasable: false,
    purchasing: false
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
    alert("You continue!!!");
  }

  render() {
    const disabledInfo = Object.keys(this.state.ingredients)
      .reduce((acc, ing) => ({...acc, [ing]: this.state.ingredients[ing] <= 0}), {});
    return (
      <Aux>
        <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
          <OrderSummary
            ingredients={this.state.ingredients}
            price={this.state.totalPrice}
            purchaseCanceled={this.purchaseCancelHandler}
            purchaseContinued={this.purchaseContinueHandler}
          />
        </Modal>
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
    );
  }
}

export default BurgerBuilder;