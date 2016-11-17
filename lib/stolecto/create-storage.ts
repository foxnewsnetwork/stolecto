/**
API shamelessly stolen from redux:
https://github.com/reactjs/redux/blob/master/src/createStore.js
*/
export default function createStorage(reducer, enhancer) {
  if (typeof enhancer !== 'undefined') {
    if (typeof enhancer !== 'function') {
      throw new Error('Expected the enhancer to be a function.')
    }
    return enhancer(createStorage)(reducer);
  }

  let currentState = {};

  return {
    getState() { return currentState; },
    dispatch(action) {
      currentState = reducer(action);
      return action;
    }
  };
}
