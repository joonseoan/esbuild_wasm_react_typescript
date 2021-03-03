import { createStore, applyMiddleware } from 'redux';
import reduxThunk from 'redux-thunk';

import reducers from './reducers';
import { ActionType } from './action-types';

// {}: initial state for app!
export const store = createStore(reducers, {}, applyMiddleware(reduxThunk));


// [IMPORTANT]
// we can manually test reducer by implementing dispatch and getState
store.dispatch({
  type: ActionType.INSERT_CELL_BEFORE,
  payload: {
    id: null,
    type: 'code',
  }
});

store.dispatch({
  type: ActionType.INSERT_CELL_BEFORE,
  payload: {
    id: null,
    type: 'text',
  }
});

store.dispatch({
  type: ActionType.INSERT_CELL_BEFORE,
  payload: {
    id: null,
    type: 'code',
  }
});

store.dispatch({
  type: ActionType.INSERT_CELL_BEFORE,
  payload: {
    id: null,
    type: 'text',
  }
});

// const id = store.getState().cells.orders[0];

// store.dispatch({
//   type: ActionType.UPDATE_CELL,
//   payload: {
//     id,
//     content: 'afadfadfdafafa',
//   }
// });




// store.dispatch({
//   type: ActionType.INSERT_CELL_BEFORE,
//   payload: {
//     id: null,
//     type: 'code',
//   }
// });


// const id = store.getState().cells.orders[1];

// store.dispatch({
//   type: ActionType.UPDATE_CELL,
//   payload: {
//     id,
//     content: 'abaceafda'
//   },
// });

// // [IMPORTANT]
// // by implementing "store", we can get "getState()"
const state = store.getState();
console.log('state ---> : ', state);