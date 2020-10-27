import React, { Component } from 'react';

import Aux from '../../hoc/Aux';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';

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
    totalPrice: 4
  }

  ingredientHandler = (type, handler) => {
    if (type in INGREDIENT_PRICES) {
      this.setState((prevState) => {
        const newIngredients = {
          ...prevState.ingredients
        };
        newIngredients[type] = handler(prevState.ingredients[type], 1);
        const newPrice = handler(prevState.totalPrice, INGREDIENT_PRICES[type]);
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

  render() {
    const disabledInfo = Object.keys(this.state.ingredients)
      .reduce((acc, ing) => ({...acc, [ing]: this.state.ingredients[ing] <= 0}), {});
    return (
      <Aux>
        <Burger ingredients={this.state.ingredients} />
        <BuildControls 
          ingredientAdded={this.addIngredientHandler}
          ingredientRemoved={this.removeIngredientHandler}
          disabled={disabledInfo}
          price={this.state.totalPrice}
        />
      </Aux>
    );
  }
}

export default BurgerBuilder;