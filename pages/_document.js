import Document, { Head, Main, NextScript } from 'next/document';
/* eslint-disable */
export default class MyDocument extends Document {
	render() {
		return (
			<html>
				<Head>
					<meta charSet="utf-8" />
					<link rel="stylesheet" href="/_next/static/style.css" />
					<link rel="stylesheet" href="../.next/static/style.css" />
					<meta name="viewport" content="width=device-width, initial-scale=1" />
					<link rel="manifest" href="../app/manifest.json" />
					<meta
						name="msvalidate.01"
						content="ECDC0FFC6CCBA2520B05CD8B4F535D3C"
					/>
					<meta
						name="google-site-verification"
						content="fu_40NhKpBp1VNYa0-zreXkuzeebDvQQA1KNDXeYYwo"
					/>
					<meta name="mobile-web-app-capable" content="yes" />
					<meta name="apple-mobile-web-app-title" content="Bible Is" />
					<meta name="apple-mobile-web-app-capable" content="yes" />
					<meta name="theme-color" content="#941B2F" />
					<link
						rel="apple-touch-icon"
						href="../app/images/app-icons/favicon-96x96.png"
					/>
					<link
						rel="preload"
						as="style"
						href="https://fonts.googleapis.com/css?family=Raleway|Alegreya|Roboto+Slab|Roboto:400,500"
					/>
					<title>Bible.is</title>
					<meta
						name="google-site-verification"
						content="frHSU18EKPDnEoKj--plFdubfj_GB7hXesy-3N1o57s"
					/>
					<meta property="og:title" content="Bible.is" />
					<meta property="og:url" content="https://is.bible.build" />
					<meta
						property="og:description"
						content="Main page for the Bible.is web app"
					/>
					<meta property="og:type" content="website" />
					<meta property="og:site_name" content="Bible.is" />
					<meta
						property="og:image"
						content="../app/images/app-icons/favicon-96x96.png"
					/>
					<meta property="fb:app_id" content="173528326559718" />
					<script src="https://apis.google.com/js/platform.js" async defer />
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
