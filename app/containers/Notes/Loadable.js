/**
 *
 * Asynchronously loads the component for Notes
 *
 */

import Loadable from 'react-loadable';

export default Loadable({
	loader: () => import('./index'),
	loading: () => null,
});
