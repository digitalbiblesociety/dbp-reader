/** Finds footnotes in dom and adds appropriate event handler
	@ref is a dom element
	@handler is the desired event handler
 */

/* eslint-disable no-param-reassign, no-unused-expressions, jsx-a11y/no-static-element-interactions */
const setEventHandlersForFootnotes = (ref, handler) => {
	const notes = [...ref.getElementsByClassName('note')];

	notes.forEach((note) => {
		if (
			note.childNodes &&
			note.childNodes[0] &&
			typeof note.childNodes[0].removeAttribute === 'function'
		) {
			note.childNodes[0].removeAttribute('href');
		}

		note.onclick = (e) => {
			e.stopPropagation();
			if (typeof window !== 'undefined') {
				const rightEdge = window.innerWidth - 300;
				const x = rightEdge < e.clientX ? rightEdge : e.clientX;

				handler({
					id: note.attributes.id.value,
					coords: { x, y: e.clientY },
				});
			}
		};
	});
};
/* eslint-enable no-param-reassign, no-unused-expressions, jsx-a11y/no-static-element-interactions */

export default setEventHandlersForFootnotes;
