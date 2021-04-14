import React, { Component } from 'react';
import { connect } from 'react-redux';

import Button from '../../../components/UI/Button/Button';
import axios from '../../../axios-orders';
import classes from './ContactData.module.css';
import Spinner from '../../../components/UI/Spinner/Spinner';
import Input from '../../../components/UI/Input/Input';
import withErrorHandler from '../../../hoc/withErrorHandler/withErrorHandler';
import * as actionCreators from '../../../store/actions/index';

class ContactData extends Component {
  state = {
    formIsValid: false,
    orderForm: {
      name: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'Your Name'
        },
        value: '',
        validation: {
          required: true,
          errorMessage: 'Please enter a valid name',
        },
        valid: false,
        touched: false,
      },
      street: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'Street'
        },
        value: '',
        validation: {
          required: true,
          errorMessage: 'Please enter a valid street',
        },
        valid: false,
        touched: false,
      },
      zipCode: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'ZIP'
        },
        value: '',
        validation: {
          required: true,
          minLength: 3,
          maxLength: 5,
          errorMessage: 'Please enter a valid zip code',
        },
        valid: false,
        touched: false,
      },
      country: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'Country'
        },
        value: '',
        validation: {
          required: true
        },
        valid: false,
        touched: false,
      },
      email: {
        elementType: 'input',
        elementConfig: {
          type: 'email',
          placeholder: 'Your Mail'
        },
        value: '',
        validation: {
          required: true,
          errorMessage: 'Please enter a valid email',
        },
        valid: false,
        touched: false,
      },
      deliveryMethod: {
        elementType: 'select',
        elementConfig: {
          options: [
            { value: 'fastest', displayValue: 'Fastest' },
            { value: 'cheapest', displayValue: 'Cheapest' },
          ]
        },
        value: 'fastest',
        valid: true,
        touched: false,
      }
    }
  }

  orderHandler = (event) => {
    event.preventDefault();
    const formData = {};
    for (let elId in this.state.orderForm) {
      formData[elId] = this.state.orderForm[elId].value;
    }
    const order = {
      ingredients: this.props.ingredients,
      price: this.props.totalPrice,
      orderData: formData
    }
    this.props.onOrderBurger(order);
  }

  inputChangedHandler = (event, inputId) => {
    let formIsValid = true;
    for (let inputId in this.state.orderForm) {
      formIsValid = formIsValid && this.state.orderForm[inputId].valid;
    }
    this.setState({
      orderForm: {
        ...this.state.orderForm,
        [inputId]: {
          ...this.state.orderForm[inputId],
          value: event.target.value,
          valid: this.checkValidity(event.target.value, this.state.orderForm[inputId].validation),
          touched: true,
        }
      },
      formIsValid
    });
  }

  checkValidity(value, rules) {
    let isValid = true;
    if (!rules) { return true; }
    if (rules.required) {
      isValid = isValid && value.trim() !== '';
    }
    if (rules.minLength) {
      isValid = isValid && value.length >= rules.minLength;
    }
    if (rules.maxLength) {
      isValid = isValid && value.length <= rules.maxLength;
    }
    return isValid;
  }

  render() {
    const formElements = Object.keys(this.state.orderForm).map(eleName => ({ id: eleName, config: this.state.orderForm[eleName]}));
    let form = (
      <form onSubmit={this.orderHandler}>
        {formElements.map(el => {
          return <Input
            key={el.id}
            elementType={el.config.elementType}
            elementConfig={el.config.elementConfig}
            value={el.config.value}
            name={el.id}
            invalid={!el.config.valid}
            shouldValidate={el.config.validation}
            touched={el.config.touched}
            errorMessage={el.config?.validation?.errorMessage}
            changed={(e) => this.inputChangedHandler(e, el.id)} />
        })}
        <Button btnType="Success" clicked={this.orderHandler} disabled={!this.state.formIsValid}>ORDER</Button>
      </form>
    );
    if (this.state.loading) {
      form = <Spinner />
    }
    return (
      <div className={classes.ContactData}>
        <h4>Enter your Contact Data</h4>
        {form}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    ingredients: state.burger.ingredients,
    totalPrice: state.burger.totalPrice,
    loading: state.order.loading
  }
}

const mapDispatchToPros = (dispatch) => {
  return {
    onOrderBurger: (order) => dispatch(actionCreators.purchaseBurger(order))
  }
}

export default connect(mapStateToProps, mapDispatchToPros)(withErrorHandler(ContactData, axios));