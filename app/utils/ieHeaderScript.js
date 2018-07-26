/* eslint-disable */
const script = () => {
	(window.onload = function() {
		var browserObject = {
			agent: "",
			majorVersion: "",
			version: "",
		};
		if (/msie\ [0-9]{1}/i.test(navigator.userAgent)) {
			browserObject.agent = "msie";
			browserObject.majorVersion = parseInt(/MSIE\ ([0-9]{1})/i.exec(navigator.userAgent)[1]);
			browserObject.version = /MSIE\ ([0-9.]+)/i.exec(navigator.userAgent)[1];
		} else if (/Trident\\/[7]{1}/i.test(navigator.userAgent)) {
		browserObject.agent = "msie";
		browserObject.majorVersion = 11;
		browserObject.version = "11";
	}

	if (browserObject.agent === "msie") {
		var bannerDiv = document.createElement("div");
		var startMessage = document.createElement("span");
		var middleMessage = document.createElement("span");
		var chromeLink = document.createElement("a");
		var fireFoxLink = document.createElement("a");
		var closeButton = document.createElement("span");
		chromeLink.href = 'https://www.google.com/chrome';
		chromeLink.target = '_blank';
		chromeLink.textContent = 'Chrome';
		fireFoxLink.href = 'https://www.moxilla.org.en-US/firefox/new';
		fireFoxLink.target = '_blank';
		fireFoxLink.textContent = 'FireFox';
		startMessage.textContent = 'You are using an old browser so some functionality may not be available. Please consider using a modern browser such as: ';
		middleMessage.textContent = ' or ';
		closeButton.textContent = 'X';
		closeButton.className = 'close-button';
		closeButton.onclick = function(e) {
			e.preventDefault();

			var el = document.getElementById("old-browser-banner");
			var parent = el.parentElement;
			parent.removeChild(el);
		}
		bannerDiv.id = "old-browser-banner";
		bannerDiv.appendChild(startMessage);
		bannerDiv.appendChild(chromeLink);
		bannerDiv.appendChild(middleMessage);
		bannerDiv.appendChild(fireFoxLink);
		bannerDiv.appendChild(closeButton);
		document.getElementsByTagName('body')[0].appendChild(bannerDiv);
	}
	})();
}
/* eslint-enable */

export default script;
