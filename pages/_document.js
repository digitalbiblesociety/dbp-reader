import Document, { Head, Main, NextScript } from 'next/document';
// Import CSS reset and Global Styles
// import '../static/app.scss';
// Need to figure out how to get the site to load this file from any url
// import '../static/manifest.json';``
// Importing the check here so that it is available to the css
/* eslint-disable */
export default class MyDocument extends Document {
	// static getInitialProps = async ({ req }) => {
	// 	// console.log(Object.keys(req.headers));
	// 	// console.log(Object.keys(req.header));
	// 	// console.log(req.header.userAgent);
	// 	// console.log(req.headers['user-agent']);
	// 	const browserObject = {
	// 		agent: '',
	// 		majorVersion: '',
	// 		version: '',
	// 	};
	//
	// 	if (req.headers['user-agent']) {
	// 		if (/msie [0-9]{1}/i.test(req.headers['user-agent'])) {
	// 			browserObject.agent = 'msie';
	// 			browserObject.majorVersion = parseInt(
	// 				/MSIE ([0-9]{1})/i.exec(req.headers['user-agent'])[1],
	// 				10,
	// 			);
	// 			browserObject.version = /MSIE ([0-9.]+)/i.exec(req.headers['user-agent'])[1];
	// 		} else if (/Trident\/[7]{1}/i.test(req.headers['user-agent'])) {
	// 			browserObject.agent = 'msie';
	// 			browserObject.majorVersion = 11;
	// 			browserObject.version = '11';
	// 		}
	// 	}
	// 	return { isIE: browserObject.agent === 'msie' };
	// }
	render() {
		// const { isIE } = this.props;
		// console.log('this is ie', isIE);
		// For enabling user feedback add the script below
		// <script async defer type="text/javascript" src="https://fcbhjira.atlassian.net/s/d41d8cd98f00b204e9800998ecf8427e-T/-30xhtk/b/6/a44af77267a987a660377e5c46e0fb64/_/download/batch/com.atlassian.jira.collector.plugin.jira-issue-collector-plugin:issuecollector/com.atlassian.jira.collector.plugin.jira-issue-collector-plugin:issuecollector.js?locale=en-UK&collectorId=267e7e86" />
		return (
			<html>
				<Head>
					<script
						src="https://cdn.polyfill.io/v2/polyfill.min.js"
						defer
						async
					/>
					<link rel="stylesheet" href="/_next/static/style.css" />
					<meta httpEquiv={'X-UA-Compatible'} content={'IE=edge'} />
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
						href="https://listen.dbp4.org/static/manifest.json"
					/>
					<link
						rel="apple-touch-icon"
						href="https://listen.dbp4.org/static/favicon-96x96.png"
					/>
					<meta
						property={'og:image'}
						content={'https://listen.dbp4.org/static/icon-96x96.png'}
					/>
					<meta
						name={'twitter:image'}
						content={'https://listen.dbp4.org/static/icon-96x96.png'}
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
						var body = document.getElementsByTagName('body')[0];
						if (body) {
							body.appendChild(bannerDiv);
						}
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
					<meta
						name="google-site-verification"
						content="frHSU18EKPDnEoKj--plFdubfj_GB7hXesy-3N1o57s"
					/>
					<meta property="fb:app_id" content="173528326559718" />
					<script src="https://apis.google.com/js/platform.js" async defer />
					<script
						async
						defer
						dangerouslySetInnerHTML={{
							__html:
								'(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({"gtm.start": new Date().getTime(),event:"gtm.js"});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!="dataLayer"?"&l="+l:"";j.async=true;j.src="https://www.googletagmanager.com/gtm.js?id="+i+dl;f.parentNode.insertBefore(j,f);})(window,document,"script","dataLayer","GTM-N3RF6RC");',
						}}
					/>
				</Head>
				<body>
					<Main />
					<NextScript />
					<noscript>
						<iframe
							src="https://www.googletagmanager.com/ns.html?id=GTM-N3RF6RC"
							height="0"
							width="0"
							style={{ display: 'none', visibility: 'hidden' }}
						/>
					</noscript>
				</body>
			</html>
		);
	}
}
/* eslint-enable */
