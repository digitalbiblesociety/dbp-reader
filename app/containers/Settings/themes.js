const paper = {
	'--header-footer-background': 'rgb(170, 134, 120)',
	'--audio-player-background': 'rgba(231, 208, 193, 1)',
	'--text-selection-color': 'rgb(172, 216, 231)',
	'--text-contextmenu-background': 'rgb(198, 169, 155)',
	'--text-arrow-color': 'rgb(213, 196, 187)',
	'--text-super-color': 'rgb(110, 67, 57)',
	'--settings-font-color': 'rgb(134, 97, 87)',
	'--menu-header-background': 'rgb(101, 55, 45)',
	'--menu-secondary-header-background': 'rgb(170, 134, 119)',
	'--menu-background-color': 'rgb(101, 55, 45)',
	'--menu-secondary-background-color': 'rgb(248, 228, 211)',
	'--menu-title-text-color': 'rgb(105, 59, 49)',
	'--menu-active-color': 'rgb(98, 177, 130)',
	'--menu-hover-color': 'rgb(98, 177, 130)',
	'--menu-font-color': 'rgb(134, 97, 87)',
	'--menu-inactive-svg-color': 'rgb(61,65,68)',
	'--application-background': 'rgb(253, 248, 241)',
	'--application-base-color': 'rgb(110, 67, 57)',
};

const dark = {
	'--header-footer-background': 'rgb(39, 42, 47)',
	'--audio-player-background': 'rgba(46, 49, 54, 1)',
	'--text-selection-color': 'rgb(100, 180, 132)',
	'--text-contextmenu-background': 'rgb(46, 49, 54)',
	'--text-arrow-color': 'rgb(73, 76, 80)',
	'--text-super-color': 'rgb(255, 255, 255)',
	'--settings-font-color': 'rgb(99, 105, 106)',
	'--menu-font-color': 'rgb(255, 255, 255)',
	'--menu-inactive-svg-color': 'rgb(61,65,68)',
	'--menu-background-color': 'rgb(39, 42, 47)',
	'--menu-secondary-background-color': 'rgb(39, 42, 47)',
	'--menu-hover-color': 'rgb(98, 177, 130)',
	'--menu-active-color': 'rgb(98, 177, 130)',
	'--menu-title-text-color': 'rgb(255, 255, 255)',
	'--menu-secondary-header-background': 'rgb(39, 42, 47)',
	'--menu-header-background': 'rgb(26, 29, 33)',
	'--application-background': 'rgb(26, 29, 33)',
	'--application-base-color': 'rgb(255, 255, 255)',
};

const red = {
	'--header-footer-background': 'rgb(148, 27, 47)',
	'--audio-player-background': 'rgba(78, 70, 75, 1)',
	'--text-selection-color': 'rgb(216, 182, 185)',
	'--text-contextmenu-background': 'rgb(71, 64, 70)',
	'--text-arrow-color': 'rgb(229, 195, 195)',
	'--text-super-color': 'rgb(33, 33, 33)',
	'--settings-font-color': 'rgb(99, 105, 116)',
	'--menu-font-color': 'rgb(255, 255, 255)',
	'--menu-inactive-svg-color': 'rgb(61,65,68)',
	'--menu-background-color': 'rgb(39, 42, 47)',
	'--menu-secondary-background-color': 'rgb(39, 42, 47)',
	'--menu-hover-color': 'rgb(98, 177, 130)',
	'--menu-active-color': 'rgb(98, 177, 130)',
	'--menu-title-text-color': 'rgb(255, 255, 255)',
	'--menu-secondary-header-background': 'rgb(39, 42, 47)',
	'--menu-header-background': 'rgb(115, 16, 37)',
	'--application-background': 'rgb(253, 248, 241)',
	'--application-base-color': 'rgb(50, 53, 58)',
};

const themes = {
	paper,
	dark,
	red,
};

const fonts = {
	sans: '"Noto Sans", (Google Font), Helvetica, sans serif',
	serif: '"Alegreva", (Google Font), "Palatino Linotype", Palatino, serif',
	slab: '"Roboto Slab", (Google Font), Rockwell, Courier, monospace',
};

const sizes = {
	1: '0.78em',
	2: '0.88em',
	3: '0.98em',
	4: '1.08em',
	5: '1.18em',
};

export const applyFontFamily = (fontFamily) => {
	document.documentElement.style.setProperty('--application-font-family', fonts[fontFamily]);
};

export const applyFontSize = (fontSize) => {
	document.documentElement.style.setProperty('--application-base-font-size', sizes[fontSize]);
};

export const applyTheme = (theme) => {
	Object.entries(themes[theme]).forEach((property) => {
		document.documentElement.style.setProperty(property[0], property[1]);
	});
};
