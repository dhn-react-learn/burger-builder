import React, { Component } from 'react';

import { connect } from 'react-redux';
import { Redirect } from 'react-router';
import * as QueryString from 'query-string';

import Input from '../../components/UI/Input/Input';
import Button from '../../components/UI/Button/Button';
import Spinner from '../../components/UI/Spinner/Spinner';
import classes from './Auth.module.css';
import * as actionCreators from '../../store/actions/index';

class Auth extends Component {
  state = {
    controls: {
      email: {
        elementType: 'input',
        elementConfig: {
          type: 'email',
          placeholder: 'Mail Address'
        },
        value: '',
        validation: {
          required: true,
          isEmail: true
        },
        valid: false,
        touched: false,
      },
      password: {
        elementType: 'input',
        elementConfig: {
          type: 'password',
          placeholder: 'Password'
        },
        value: '',
        validation: {
          required: true,
          minLength: 6
        },
        valid: false,
        touched: false,
      },
    },
    formIsValid: false,
    isSignup: false
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

  inputChangedHandler = (event, inputId) => {
    const inputValid = this.checkValidity(event.target.value, this.state.controls[inputId].validation);
    let formIsValid = inputValid;
    for (let id in this.state.controls) {
      if (id !== inputId) {
        formIsValid = formIsValid && this.state.controls[id].valid;
      }
    }
    this.setState({
      controls: {
        ...this.state.controls,
        [inputId]: {
          ...this.state.controls[inputId],
          value: event.target.value,
          valid: inputValid,
          touched: true,
        }
      },
      formIsValid
    });
  }

  submitHandler = (event) => {
    event.preventDefault();
    const email = this.state.controls.email.value;
    const password = this.state.controls.password.value;
    this.props.onAuthHandler(email, password, this.state.isSignup ? 'signup' : 'signin');
  }

  switchSigninHandler = (event) => {
    event.preventDefault();
    this.setState(prevState => {
      return {
        isSignup: !prevState.isSignup
      };
    });
  }

  render() {
    if (this.props.isAuthenticated) {
      const params = QueryString.parse(this.props.location.search);
      const redirect = params.redirect || "/";
      return <Redirect to={redirect} />;
    }
    let form = <Spinner />
    if (!this.props.authenticating) {
      const formElements = Object.keys(this.state.controls).map(
        eleName => ({ id: eleName, config: this.state.controls[eleName]})
      );
      form = (
        <form>
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
          <Button btnType="Success" clicked={this.submitHandler} disabled={!this.state.formIsValid}
            >{this.state.isSignup ? 'SUBMIT' : 'SIGNIN'}</Button>
          <Button btnType="Danger" clicked={this.switchSigninHandler}>SWITCH TO {this.state.isSignup ? 'SIGNIN' : 'SIGNUP' }</Button>
        </form>
      );
    }
    let errorMessage = null;
    if (this.props.error) {
      errorMessage = <p>{this.props.error.message}</p>;
    }
    return (
      <div className={classes.Auth}>
        {errorMessage}
        {form}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    authenticating: state.auth.authenticating,
    error: state.auth.error,
    isAuthenticated: state.auth.authenticated
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onAuthHandler: (email, password, method) => dispatch(actionCreators.auth(email, password, method))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Auth);