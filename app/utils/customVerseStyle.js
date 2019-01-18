const customStyle = (verse) =>
	verse.wholeVerseHighlighted
		? {
				background: `linear-gradient(${
					verse.highlightedColor ? verse.highlightedColor : 'inherit'
				},${verse.highlightedColor ? verse.highlightedColor : 'inherit'})`,
		  }
		: {};

export default customStyle;
