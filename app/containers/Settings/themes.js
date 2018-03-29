const paper = {
	'--header-footer-background': 'rgba(170, 134, 120, 1)',
	'--header-footer-background-transparent': 'rgba(170, 134, 120, 0)',
	'--audio-player-background': 'rgba(231, 208, 193, 1)',
	'--text-selection-color': 'rgb(172, 216, 231)',
	'--text-contextmenu-background': 'rgb(198, 169, 155)',
	'--text-arrow-color': 'rgb(0, 0, 0)',
	'--text-super-color': 'rgb(110, 67, 57)',
	'--settings-font-color': 'rgb(198, 172, 161)',
	'--menu-header-background': 'rgb(101, 55, 45)',
	'--menu-secondary-header-background': 'rgb(170, 134, 119)',
	'--menu-background-color': 'rgb(101, 55, 45)',
	'--menu-secondary-background-color': 'rgb(248, 228, 211)',
	'--menu-title-text-color': 'rgb(255, 255, 255)',
	'--menu-active-text-color': 'rgb(112, 63, 51)',
	'--menu-active-color': 'rgb(98, 177, 130)',
	'--menu-hover-color': 'rgb(98, 177, 130)',
	'--menu-font-color': 'rgb(134, 97, 87)',
	'--menu-inactive-svg-color': 'rgb(61,65,68)',
	'--application-background': 'rgb(253, 248, 241)',
	'--application-base-color': 'rgb(110, 67, 57)',
	'--settings-option-inactive-secondary-color': 'rgb(255, 255, 255)',
	'--audio-player-progress-background': 'rgb(255, 255, 255)',
	'--settings-option-inactive-color': 'rgb(112, 63, 51)',
	'--context-menu-background-color': 'rgb(204,178,165)',
	'--audioplayer-handle-background-color': 'rgba(255, 255, 255, 0.5)',
	'--text-selection-background': '#FDF9F3',
	'--text-selection-section-header-background': '#FDF9F3',
	'--text-selection-section-type-label': '#000000',
	'--text-selection-search-text-color': '#000000',
	'--text-selection-search-input-background': '#FDF9F3',
	'--text-selection-accordion-title-background': '#F8E4D3',
	'--text-selection-accordion-body-background': '#FDF9F3',
	'--text-selection-active-item-color': '#6FBC8F',
};

const dark = {
	'--header-footer-background': 'rgba(39, 42, 47, 1)',
	'--header-footer-background-transparent': 'rgba(39, 42, 47, 0)',
	'--audio-player-background': 'rgba(46, 49, 54, 1)',
	'--text-selection-color': 'rgb(111, 188, 143)',
	'--text-contextmenu-background': 'rgb(46, 49, 54)',
	'--text-arrow-color': 'rgb(255, 255, 255)',
	'--text-super-color': 'rgb(255, 255, 255)',
	'--settings-font-color': 'rgb(99, 105, 106)',
	'--menu-font-color': 'rgb(255, 255, 255)',
	'--menu-inactive-svg-color': 'rgb(61,65,68)',
	'--menu-background-color': 'rgb(44, 48, 54)',
	'--menu-active-text-color': 'rgb(255, 255, 255)',
	'--menu-secondary-background-color': 'rgb(39, 42, 47)',
	'--menu-hover-color': 'rgb(98, 177, 130)',
	'--menu-active-color': 'rgb(98, 177, 130)',
	'--menu-title-text-color': 'rgb(255, 255, 255)',
	'--menu-secondary-header-background': 'rgb(39, 42, 47)',
	'--menu-header-background': 'rgb(26, 29, 33)',
	'--application-background': 'rgb(26, 29, 33)',
	'--application-base-color': 'rgb(255, 255, 255)',
	'--settings-option-inactive-secondary-color': 'rgb(27, 31, 46)',
	'--audio-player-progress-background': 'rgb(32,34,39)',
	'--settings-option-inactive-color': 'rgb(98, 177, 130)',
	'--context-menu-background-color': 'rgba(44, 48, 54, 0.75)',
	'--audioplayer-handle-background-color': 'rgba(0, 0, 0, 0.5)',
};

const red = {
	'--header-footer-background': 'rgba(158, 30, 53, 1)',
	'--header-footer-background-transparent': 'rgba(158, 30, 53, 0)',
	'--audio-player-background': 'rgba(78, 70, 75, 1)',
	'--text-selection-color': 'rgb(216, 182, 185)',
	'--text-contextmenu-background': 'rgb(71, 64, 70)',
	'--text-arrow-color': 'rgb(0, 0, 0)',
	'--text-super-color': 'rgb(33, 33, 33)',
	'--settings-font-color': 'rgb(99, 105, 116)',
	'--menu-font-color': 'rgb(255, 255, 255)',
	'--menu-inactive-svg-color': 'rgb(61,65,68)',
	'--menu-active-text-color': 'rgb(255, 255, 255)',
	'--menu-background-color': 'rgb(44, 48, 54)',
	'--menu-secondary-background-color': 'rgb(44, 48, 54)',
	'--menu-hover-color': 'rgb(98, 177, 130)',
	'--menu-active-color': 'rgb(98, 177, 130)',
	'--menu-title-text-color': 'rgb(255, 255, 255)',
	'--menu-secondary-header-background': 'rgb(39, 42, 47)',
	'--menu-header-background': 'rgb(115, 16, 37)',
	'--application-background': 'rgb(253, 248, 241)',
	'--application-base-color': 'rgb(50, 53, 58)',
	'--settings-option-inactive-secondary-color': 'rgb(27, 31, 46)',
	'--audio-player-progress-background': 'rgb(32,34,39)',
	'--settings-option-inactive-color': 'rgb(98, 177, 130)',
	'--context-menu-background-color': 'rgba(44, 48, 54, 0.80)',
	'--audioplayer-handle-background-color': 'rgba(0, 0, 0, 0.5)',
};

const themes = {
	paper,
	dark,
	red,
};

const fonts = {
	sans: '"Noto Sans", Helvetica, sans serif',
	serif: '"Alegreya", "Palatino Linotype", Palatino, serif',
	slab: '"Roboto Slab", Rockwell, Courier, monospace',
};

const sizes = {
	0: '0.78em',
	18: '0.88em',
	42: '0.98em',
	69: '1.08em',
	100: '1.18em',
};

export const toggleWordsOfJesus = (state) => {
	document.documentElement.style.setProperty('--application-words-of-jesus', state ? '#A00' : 'inherit');
	sessionStorage.setItem('bible_is_words_of_jesus', state);
};

export const applyFontFamily = (fontFamily) => {
	document.documentElement.style.setProperty('--application-font-family', fonts[fontFamily]);
	sessionStorage.setItem('bible_is_font_family', fontFamily);
};

export const applyFontSize = (fontSize) => {
	document.documentElement.style.setProperty('--application-base-font-size', sizes[fontSize]);
	sessionStorage.setItem('bible_is_font_size', fontSize);
};

export const applyTheme = (theme) => {
	Object.entries(themes[theme]).forEach((property) => {
		document.documentElement.style.setProperty(property[0], property[1]);
	});
	sessionStorage.setItem('bible_is_theme', theme);
};
