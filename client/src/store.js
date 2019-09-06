import {
    createStore,
    applyMiddleware,
    compose,
    combineReducers
} from 'redux';
import { connectRouter, routerMiddleware } from 'connected-react-router';
import thunk from 'redux-thunk';
import { createBrowserHistory } from 'history';
// import { composeWithDevTools } from 'redux-devtools-extension';

import threadReducer from './containers/Thread/reducer';
import profileReducer from './containers/Profile/reducer';

export const history = createBrowserHistory();

const initialState = {};

const middlewares = [
    thunk,
    routerMiddleware(history)
];

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const reducers = {
    posts: threadReducer,
    profile: profileReducer,
};

const rootReducer = combineReducers({
    router: connectRouter(history),
    ...reducers
});

const store = createStore(
    rootReducer,
    initialState,
    composeEnhancers(applyMiddleware(...middlewares))
);

export default store;
