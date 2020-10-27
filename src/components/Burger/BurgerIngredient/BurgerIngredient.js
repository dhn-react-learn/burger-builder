import React, { Component } from 'react';

import PropTypes from 'prop-types';

import classes from './BurgerIngredient.module.css';

class BurgerIngredient extends Component{
  render() {
    const renderedClasses = {
      'bread-bottom': classes.BreadBottom,
      'meat': classes.Meat,
      'cheese': classes.Cheese,
      'bacon': classes.Bacon,
      'salad': classes.Salad
    }
    if (renderedClasses[this.props.type]) {
      return <div className={renderedClasses[this.props.type]}></div>;
    }
    if (this.props.type === 'bread-top') {
      return (
        <div className={classes.BreadTop}>
          <div className={classes.Seed1}></div>
          <div className={classes.Seed2}></div>
        </div>
      );
    }
    return null;
  }
}

BurgerIngredient.propTypes = {
  type: PropTypes.string.isRequired
}

export default BurgerIngredient;