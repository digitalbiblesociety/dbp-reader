/**
 *
 * Asynchronously loads the component for Footer
 *
 */

import Loadable from 'react-loadable';

export default Loadable({
	loader: () => import('./index'),
	loading: () => null,
});
