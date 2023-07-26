import React, { useState,useEffect,useContext,useReducer } from 'react';

import Card from '../UI/Card/Card';
import classes from './Login.module.css';
import Button from '../UI/Button/Button';
import AuthContext from '../../context/auth-context';
import Input from '../Input/Input';

const emailReducer=(state,action)=>{
  if(action.type==='USER_INPUT'){
    return {value : action.val,isValid: action.val.includes('@')};
  }
  if(action.type==='INPUT_BLUR'){
    return {value : state.value,isValid: state.value.includes('@')};
  }
  return {value : '',isValid: false};
};

const passwordReducer=(state,action)=>{
  if(action.type==='PASSWORD_INPUT'){
    return {value : action.val,isValid: action.val.trim().length>6};
  }
  if(action.type==='PASSWORD_BLUR'){
    return {value : state.value,isValid: state.value.trim().length>6};
  }
  return {value : '',isValid: false};
};

const Login = (props) => {
  const [formIsValid, setFormIsValid] = useState(false);

  const[emailState,dispatchEmail]=useReducer(emailReducer,{
    value : '',
    isValid: false
  });

  const[passwordState,dispatchPassword]=useReducer(passwordReducer,{
    value : '',
    isValid: false
  });

  const authCtx = useContext(AuthContext);
  useEffect(() => {
    console.log('EFFECT RUNNING');

    return () => {
      console.log('EFFECT CLEANUP');
    };
  }, []);

  const { isValid: emailIsValid } = emailState;
  const { isValid: passwordIsValid } = passwordState;

  useEffect(() => {
    const identifier = setTimeout(() => {
      console.log('Checking form validity!');
      setFormIsValid(emailIsValid && passwordIsValid);
    }, 500);

    return () => {
      console.log('CLEANUP');
      clearTimeout(identifier);
    };
  }, [emailIsValid, passwordIsValid]);

  const emailChangeHandler = (event) => {
    dispatchEmail({type: 'USER_INPUT', val: event.target.value});
    setFormIsValid(
         emailState.isValid && passwordState.isValid 
       );
  };
  
  const passwordChangeHandler = (event) => {
    dispatchPassword({type: 'PASSWORD_INPUT', val: event.target.value});
    setFormIsValid(
     emailState.isValid && passwordState.isValid 
    );
  };

  const validateEmailHandler = () => {
    dispatchEmail({type:'INPUT_BLUR'})
  };

  const validatePasswordHandler = () => {
    dispatchEmail({type:'PASSWORD_BLUR'})
  };

  const submitHandler = (event) => {
    event.preventDefault();
    authCtx.onLogin(emailState.value, passwordState.value);
  };

  return (
    <Card className={classes.login}>
      <form onSubmit={submitHandler}>
        <Input id='email' 
        label='E-mail' 
        type='email'
         isValid={emailIsValid} 
         value={emailState.value}
        onChange={emailChangeHandler}
        onBlur={validateEmailHandler}>
        </Input>
        <Input
        id='password'
        label='password'
        type='password'
        isValid={passwordIsValid}
        value={passwordState.value}
        onChange={passwordChangeHandler}
        onBlur={validatePasswordHandler}>   
        </Input>
        <div className={classes.actions}>
          <Button type="submit" className={classes.btn} disabled={!formIsValid}>
            Login
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default Login;
