import * as actionTypes from './actionTypes';
import axios from '../../axios-orders';

export const addIngredient = (ing) => ({ type: actionTypes.ADD_INGREDIENT, payload: ing });
export const removeIngredient = (ing) => ({ type: actionTypes.REMOVE_INGREDIENT, payload: ing });
export const setIngredients = (ings) => ({ type: actionTypes.SET_INGREDIENTS, payload: ings });
export const fetchIngredientsFailed = () => ({ type: actionTypes.FETCH_INGREDIENTS_FAILED });
export const initIngredients = () => {
  return (dispatch) => {
    axios.get('/ingredients.json')
    .then(res => {
      dispatch(setIngredients(res.data));
    }).catch(error => {
      dispatch(fetchIngredientsFailed());
    });
  }
};