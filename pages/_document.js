import 'babel-polyfill';
import Document, { Head, Main, NextScript } from 'next/document';
// Import CSS reset and Global Styles
// import '../static/app.scss';
// Need to figure out how to get the site to load this file from any url
// import '../static/manifest.json';``
// Importing the check here so that it is available to the css
/* eslint-disable */
export default class MyDocument extends Document {
	render() {
		return (
			<html>
				<Head>
					<link rel="stylesheet" href="/_next/static/style.css" />
					{/*<link rel="stylesheet" href="../.next/static/style.css" />*/}
					<meta name="viewport" content="width=device-width, initial-scale=1" />
					<link rel="icon" type="image/x-icon" href="/static/favicon.ico" />

					{process.env.NODE_ENV === 'development' ? (
						<script src={'http://localhost:8097'} />
					) : null}
					<meta
						name="msvalidate.01"
						content="ECDC0FFC6CCBA2520B05CD8B4F535D3C"
					/>
					<meta
						name="google-site-verification"
						content="fu_40NhKpBp1VNYa0-zreXkuzeebDvQQA1KNDXeYYwo"
					/>
					<meta name="mobile-web-app-capable" content="yes" />
					<meta name="apple-mobile-web-app-title" content="Bible.is" />
					<meta name="apple-mobile-web-app-capable" content="yes" />
					<meta name="apple-mobile-web-app-status-bar-style" content="black" />
					<meta name="author" content="Faith Comes By Hearing" />
					<meta name="theme-color" content="#941B2F" />
					<meta property={'og:type'} content={'book'} />
					<meta property={'og:site_name'} content={'Bible.is Online'} />

					<meta name={'twitter:card'} content={'summary'} />
					<meta name={'twitter:site'} content={'@bibleis'} />
					<meta name={'twitter:creator'} content={'@audiobible'} />

					<link
						rel="manifest"
						href="https://devis.bible.build/static/manifest.json"
					/>
					<link
						rel="manifest"
						href="https://is.bible.build/static/manifest.json"
					/>
					<link
						rel="apple-touch-icon"
						href="https://devis.bible.build/static/favicon-96x96.png"
					/>
					<link
						rel="apple-touch-icon"
						href="https://is.bible.build/static/favicon-96x96.png"
					/>
					<meta
						property={'og:image'}
						content={'https://devis.bible.build/static/icon-180x180.png'}
					/>
					<meta
						property={'og:image'}
						content={'https://is.bible.build/static/icon-180x180.png'}
					/>
					<meta
						name={'twitter:image'}
						content={'https://devis.bible.build/static/icon-180x180.png'}
					/>
					<meta
						name={'twitter:image'}
						content={'https://is.bible.build/static/icon-180x180.png'}
					/>

					<meta name="twitter:app:id:iphone" content="" />
					<meta name="twitter:app:id:ipad" content="" />
					<meta name="twitter:app:id:googleplay" content="" />

					<meta
						name="google-site-verification"
						content="frHSU18EKPDnEoKj--plFdubfj_GB7hXesy-3N1o57s"
					/>
					<meta property="fb:app_id" content="173528326559718" />
					<script src="https://apis.google.com/js/platform.js" async defer />
					<script
						type="application/javascript"
						dangerouslySetInnerHTML={{
							__html: `(window.onload = function() {
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
					})();`,
						}}
					/>
					<link
						rel="preload"
						as="style"
						href="https://fonts.googleapis.com/css?family=Roboto:400,500"
					/>
					<link
						rel="preload"
						as="style"
						href="https://fonts.googleapis.com/css?family=Roboto+Slab"
					/>
					<link
						rel="preload"
						as="style"
						href="https://fonts.googleapis.com/css?family=Raleway"
					/>
					<link
						rel="preload"
						as="style"
						href="https://fonts.googleapis.com/css?family=Alegreya"
					/>
				</Head>
				<body>
					<Main />
					<NextScript />
				</body>
			</html>
		);
	}
}
/* eslint-enable */
