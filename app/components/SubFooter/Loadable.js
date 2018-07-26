/**
 *
 * Asynchronously loads the component for SubFooter
 *
 */

import Loadable from 'react-loadable';

export default Loadable({
	loader: () => import('./index'),
	loading: () => null,
});
