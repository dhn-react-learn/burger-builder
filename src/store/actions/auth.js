import * as actionTypes from './actionTypes';
import axios from '../../axios-orders';

export const authStart = () => ({ type: actionTypes.AUTH_START });
export const authSucess = (userId, idToken) => ({ type: actionTypes.AUTH_SUCCESS, userId, idToken });
export const authFailed = (error) => ({ type: actionTypes.AUTH_FAILED, error });
export const authLogout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('expirationDate');
  return { type: actionTypes.AUTH_LOGOUT }
}
export const authLoad = () => {
  return dispatch => {
    const expirationDate = new Date(localStorage.getItem('expirationDate'));
    if (expirationDate && expirationDate >= new Date()) {
      dispatch(authSucess(null, localStorage.getItem('token')));
      dispatch(checkAuthTimeout(expirationDate.getTime() - new Date().getTime()));
    }
  }
}

export const checkAuthTimeout = (expirationTime) => {
  return dispatch => {
    setTimeout(() => {
      dispatch(authLogout());
    }, expirationTime);
  }
}

export const auth = (email, password, method) => {
  return dispatch => {
    dispatch(authStart());
    const methodUrl = method === 'signup' ? 'signUp' : 'signInWithPassword';
    const API_KEY = 'AIzaSyDq4AW6YEDIyqkXpAwua1ASNSnbIOxJTcY';
    const url = `https://identitytoolkit.googleapis.com/v1/accounts:${methodUrl}?key=${API_KEY}`
    const authData = {
      email,
      password,
      returnSecureToken: true
    }
    axios.post(url, authData)
      .then(resp => {
        const expirationDate = new Date(new Date().getTime() + resp.data.expiresIn * 1000);
        localStorage.setItem('token', resp.data.idToken);
        localStorage.setItem('expirationDate', expirationDate);
        dispatch(authSucess(resp.data.localId, resp.data.idToken));
        dispatch(checkAuthTimeout(resp.data.expiresIn * 1000));
      }).catch(error => {
        dispatch(authFailed(error.response.data.error));
      })
  }
}
