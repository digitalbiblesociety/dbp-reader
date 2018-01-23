/**
 *
 * Asynchronously loads the component for AudioPlayer
 *
 */

import Loadable from 'react-loadable';

export default Loadable({
	loader: () => import('./index'),
	loading: () => null,
});
