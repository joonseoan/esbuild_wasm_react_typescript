import { createStore, applyMiddleware } from 'redux';
import reduxThunk from 'redux-thunk';

import reducers from './reducers';

// {}: initial state for app!
export const store = createStore(reducers, {}, applyMiddleware(reduxThunk));