import * as actionTypes from '../actions/actionTypes';

const initialState = {
  authenticating: false,
  authenticated: false,
  userId: null,
  idToken: null,
  error: null,
};

const reducer = (state = initialState, action) => {
  console.log(action.type);
  switch (action.type) {
    case actionTypes.AUTH_START:
      return {
        ...state,
        authenticating: true,
        authenticated: false,
        userId: null,
        idToken: null,
        error: null
      }
    case actionTypes.AUTH_LOGOUT:
      return {
        ...state,
        authenticated: false,
        userId: null,
        idToken: null
      }
    case actionTypes.AUTH_SUCCESS:
      return {
        ...state,
        authenticating: false,
        authenticated: true,
        userId: action.userId,
        idToken: action.idToken
      }
    case actionTypes.AUTH_FAILED:
      return {
        ...state,
        authenticating: false,
        authenticated: false,
        error: action.error
      }
    default:
      return state;
  }
}

export default reducer;
