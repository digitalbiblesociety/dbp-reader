// needed for regenerator-runtime
// (ES7 generator support is required by redux-saga)
import '@babel/polyfill';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { XMLSerializer } from 'xmldom';
const jsdom = require('jsdom');
const documentHTML = `
	<!doctype html>
		<html>
			<body>
				<div id="__next"></div>
			</body>
		</html>
`;
configure({ adapter: new Adapter() });
function copyProps(src, target) {
	const props = Object.getOwnPropertyNames(src)
		.filter((prop) => typeof target[prop] === 'undefined')
		.reduce(
			(result, prop) => ({
				...result,
				[prop]: Object.getOwnPropertyDescriptor(src, prop),
			}),
			{},
		);
	Object.defineProperties(target, props);
}
const dom = new jsdom.JSDOM(documentHTML);
const { window } = dom;
global.window = window;
global.document = window.document;
global.navigator = {
	userAgent: 'node.js',
};
// Add shim for xmlSerializer here so it gets loaded
global.XMLSerializer = XMLSerializer;
copyProps(window, global);
// lazy imports (require.resolveWeak) which conflicts with the Node module system.
// Need to use require instead of import here and pass through all the props given.
jest.mock('next/dynamic', () => () => {
	const DynamicComponent = () => null;
	DynamicComponent.displayName = 'LoadableComponent';
	DynamicComponent.preload = jest.fn();
	return DynamicComponent;
});
