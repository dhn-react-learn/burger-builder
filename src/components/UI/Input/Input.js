import React from 'react';

import classes from './Input.module.css';

const input = (props) => {
  let inputElement = null;
  const inputClasses = [classes.InputElement];
  let validationError = null;
  if (props.invalid && props.shouldValidate && props.touched) {
    inputClasses.push(classes.Invalid);
    validationError = <p className={classes.ValidationError}>{props.errorMessage}</p>;
  }

  switch (props.elementType) {
    case ('input'):
      inputElement = 
        <input
          className={inputClasses.join(' ')}
          name={props.name}
          {...props.elementConfig}
          value={props.value}
          onChange={props.changed} />;
      break;
    case ('textarea'):
      inputElement = 
        <textarea
          className={inputClasses.join(' ')}
          name={props.name}
          {...props.elementConfig}
          value={props.value}
          onChange={props.changed} />;
      break;
    case ('select'):
      inputElement = 
        <select
          name={props.name}
          className={inputClasses.join(' ')}
          value={props.value}
          onChange={props.changed}>
          {props.elementConfig.options.map(opt => <option key={opt.value} value={opt.value}>{opt.displayValue}</option>)}
        </select>
      break;
    default:
      inputElement = 
        <input
          className={inputClasses.join(' ')}
          name={props.name}
          {...props.elementConfig}
          value={props.value}
          onChange={props.changed} />;
  }
  return (
    <div className={classes.Input}>
      <label className={classes.Label}>{props.label}</label>
      {inputElement}
      {validationError}
    </div>
  )
}

export default input;