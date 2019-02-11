/**
 * Create the store with dynamic reducers
 */

import { createStore, applyMiddleware, compose } from 'redux';
import { fromJS } from 'immutable';
import { routerMiddleware } from 'react-router-redux';
import createSagaMiddleware from 'redux-saga';
import {
	persistStore,
	autoRehydrate,
} from 'jh108-redux-persist-immutable-plugin';
import REDUX_PERSIST from './utils/reduxPersist';
import createReducer from './reducers';

const sagaMiddleware = createSagaMiddleware();

export default function configureStore(initialState = {}, history) {
	// Create the store with two middlewares
	// 1. sagaMiddleware: Makes redux-sagas work
	// 2. routerMiddleware: Syncs the location/URL path to the state
	const middlewares = [sagaMiddleware, routerMiddleware(history)];

	const enhancers = [applyMiddleware(...middlewares), autoRehydrate()];

	/* eslint-disable no-underscore-dangle */
	const composeEnhancers =
		process.env.NODE_ENV !== 'production' &&
		typeof window === 'object' &&
		window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
			? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
					// Prevent recomputing reducers for `replaceReducer`
					shouldHotReload: false,
			  })
			: compose;
	/* eslint-enable */

	const store = createStore(
		createReducer(),
		fromJS(initialState),
		composeEnhancers(...enhancers),
	);

	if (typeof self === 'object') {
		persistStore(store, REDUX_PERSIST.storeConfig);
	}

	// Extensions
	store.runSaga = sagaMiddleware.run;
	store.injectedReducers = {}; // Reducer registry
	store.injectedSagas = {}; // Saga registry

	/* istanbul ignore next */
	if (module.hot) {
		module.hot.accept('./reducers', () => {
			store.replaceReducer(createReducer(store.injectedReducers));
		});
	}

	return store;
}
