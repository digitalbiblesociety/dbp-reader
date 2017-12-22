/**
 *
 * Asynchronously loads the component for ChapterSelection
 *
 */

import Loadable from 'react-loadable';

export default Loadable({
	loader: () => import('./index'),
	loading: () => null,
});
