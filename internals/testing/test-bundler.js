// needed for regenerator-runtime
// (ES7 generator support is required by redux-saga)
import '@babel/polyfill';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { XMLSerializer } from 'xmldom';

configure({ adapter: new Adapter() });
// Add shim for xmlSerializer here so it gets loaded
global.XMLSerializer = XMLSerializer;

// lazy imports (require.resolveWeak) which conflicts with the Node module system.
// Need to use require instead of import here and pass through all the props given.
jest.mock('next/dynamic', () => () => {
	const DynamicComponent = () => null;
	DynamicComponent.displayName = 'LoadableComponent';
	DynamicComponent.preload = jest.fn();
	return DynamicComponent;
});
