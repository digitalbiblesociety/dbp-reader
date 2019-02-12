import reconciler from './stateReconciler';
const REDUX_PERSIST = {
	active: true,
	reducerVersion: '1',
	reducerKey: 'Bible.is',
	storeConfig: {
		whitelist: ['profile', 'settings', 'searchContainer', 'notes'],
		blacklist: ['homepage', 'textSelection'],
		keyPrefix: 'Bible.is.v1.',
		stateReconciler: reconciler,
	},
};

export default REDUX_PERSIST;
