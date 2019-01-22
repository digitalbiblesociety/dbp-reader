const getLastSelectedVerse = (
	e,
	{
		formattedSourceMain,
		userSettings,
		windowObject,
		main,
		activeBookId,
		activeChapter,
		text,
		selectedWholeVerse,
		getFormattedParentVerse,
		getPlainParentVerseWithoutNumber,
	},
) => {
	const target = e.target;
	const isFormatted =
		!!formattedSourceMain &&
		(!userSettings.getIn(['toggleOptions', 'readersMode', 'active']) ||
			!userSettings.getIn(['toggleOptions', 'readersMode', 'available'])) &&
		(!userSettings.getIn(['toggleOptions', 'oneVersePerLine', 'active']) ||
			!userSettings.getIn(['toggleOptions', 'oneVersePerLine', 'available']));
	const primaryButton = e.button === 0;
	const stateObject = {};
	const selectedText = windowObject.getSelection().toString();
	let openMenu = true;
	if (selectedText) {
		stateObject.wholeVerseIsSelected = false;
		stateObject.anchorOffset = windowObject.getSelection().anchorOffset;
		stateObject.anchorText = windowObject.getSelection().anchorNode.data;
		stateObject.anchorNode = windowObject.getSelection().anchorNode;
		stateObject.focusOffset = windowObject.getSelection().focusOffset;
		stateObject.focusText = windowObject.getSelection().focusNode.data;
		stateObject.focusNode = windowObject.getSelection().focusNode;
		stateObject.userSelectedText = selectedText;
		stateObject.selectedText = selectedText;
	}

	// if formatted iterate up the dom looking for data-id
	if (isFormatted) {
		const verseNode = getFormattedParentVerse(target);
		const lastVerse = verseNode
			? verseNode.attributes['data-id'].value.split('_')[1]
			: '';
		// third check may not be required, if micro optimization is needed then look into removing contains
		if (primaryButton && selectedText && main.contains(target) && lastVerse) {
			stateObject.lastVerse = lastVerse;
		} else if (lastVerse && main.contains(target) && primaryButton) {
			// treat the event as a click and allow the whole verse to be highlighted
			const verseText =
				[
					...document.querySelectorAll(
						`[data-id="${activeBookId}${activeChapter}_${lastVerse}"]`,
					),
				].reduce((a, c) => a.concat(' ', c.textContent), '') || '';

			selectedWholeVerse(lastVerse, false, e.clientX, e.clientY, verseText);
			openMenu = false;
		}
	} else {
		const verseNode = getPlainParentVerseWithoutNumber(target);
		const lastVerse = verseNode
			? verseNode.attributes['data-verseid'].value
			: '';
		// third check may not be required, if micro optimization is needed then look into removing contains
		if (primaryButton && selectedText && main.contains(target) && lastVerse) {
			stateObject.lastVerse = lastVerse;
		} else if (lastVerse && main.contains(target) && primaryButton) {
			// treat the event as a click and allow the whole verse to be highlighted
			selectedWholeVerse(
				lastVerse,
				true,
				e.clientX,
				e.clientY,
				text
					.filter((v) => v.verse_start === parseInt(lastVerse, 10))
					.map((v) => v.verse_text)[0] || '',
			);
			openMenu = false;
		}
	}

	return {
		openMenu,
		stateObject,
	};
};

export default getLastSelectedVerse;
