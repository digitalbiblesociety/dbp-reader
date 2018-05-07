/**
 *
 * Asynchronously loads the component for BooksTableSection
 *
 */

import Loadable from 'react-loadable';

export default Loadable({
	loader: () => import('./index'),
	loading: () => null,
});
