// needed for regenerator-runtime
// (ES7 generator support is required by redux-saga)
import 'babel-polyfill';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { XMLSerializer } from 'xmldom';

configure({ adapter: new Adapter() });
// Add shim for xmlSerializer here so it gets loaded
global.XMLSerializer = XMLSerializer;
