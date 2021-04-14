import * as actionTypes from '../actions/actionTypes';

const initialState = {
  ingredients: null,
  totalPrice: 4,
};

const INGREDIENT_PRICES = {
  salad: 0.5,
  bacon: 0.7,
  meat: 1.3,
  cheese: 0.4
};

const reducer = (state = initialState, action) => {
  let ingredients, purchasable;
  switch (action.type) {
    case actionTypes.ADD_INGREDIENT:
      ingredients = {
        ...state.ingredients,
        [action.payload]: state.ingredients[action.payload] + 1
      }
      purchasable = Object.keys(ingredients)
        .reduce(
          (acc, key) => acc + ingredients[key], 0
        ) > 0;
      return {
        ...state,
        ingredients,
        totalPrice: state.totalPrice + INGREDIENT_PRICES[action.payload],
        purchasable
      }
    case actionTypes.REMOVE_INGREDIENT:
      ingredients = {
        ...state.ingredients,
        [action.payload]: state.ingredients[action.payload] - 1
      }
      purchasable = Object.keys(ingredients)
        .reduce(
          (acc, key) => acc + ingredients[key], 0
        ) > 0;
      return {
        ...state,
        ingredients: {
          ...state.ingredients,
          [action.payload]: state.ingredients[action.payload] - 1
        },
        totalPrice: state.totalPrice - INGREDIENT_PRICES[action.payload]
      }
    case actionTypes.SET_INGREDIENTS:
      return {
        ...state,
        ingredients: action.payload,
        price: 4
      }
    case actionTypes.FETCH_INGREDIENTS_FAILED:
      return {
        ...state,
        error: true
      }
    default:
      return state;
  }
};

export default reducer;
