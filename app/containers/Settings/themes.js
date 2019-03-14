import customThemes from '../../../theme_config/theme.json';
import customFonts from '../../../theme_config/fonts.json';
import customFontSizes from '../../../theme_config/fontSize.json';

export const paper = customThemes.customLightTheme;

export const dark = customThemes.customDarkTheme;

export const red = customThemes.customColoredTheme;

export const themes = {
	paper,
	dark,
	red,
};

const fonts = {
	sans: customFonts.sans,
	serif: customFonts.serif,
	slab: customFonts.slab,
};

const sizes = {
	0: customFontSizes.smallest,
	18: customFontSizes.small,
	42: customFontSizes.medium,
	69: customFontSizes.large,
	100: customFontSizes.largest,
};

export const toggleWordsOfJesus = (state) => {
	document.documentElement.style.setProperty(
		'--application-words-of-jesus',
		state ? '#A00' : 'inherit',
	);
	document.cookie = `bible_is_words_of_jesus=${state};path=/`;
};

export const applyFontFamily = (fontFamily) => {
	document.documentElement.style.setProperty(
		'--application-font-family',
		fonts[fontFamily],
	);
	document.cookie = `bible_is_font_family=${fontFamily};path=/`;
};

export const applyFontSize = (fontSize) => {
	document.documentElement.style.setProperty(
		'--application-base-font-size',
		sizes[fontSize],
	);
	document.cookie = `bible_is_font_size=${fontSize};path=/`;
};

export const applyTheme = (theme) => {
	if (themes[theme]) {
		Object.entries(themes[theme]).forEach((property) => {
			document.documentElement.style.setProperty(property[0], property[1]);
		});
		document.cookie = `bible_is_theme=${theme};path=/`;
	}
};
