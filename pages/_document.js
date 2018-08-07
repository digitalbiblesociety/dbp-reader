import Document, { Head, Main, NextScript } from 'next/document';
/* eslint-disable */
export default class MyDocument extends Document {
	render() {
		return (
			<html>
				<Head>
					<link rel="stylesheet" href="/_next/static/style.css" />
					{/*<link rel="stylesheet" href="../.next/static/style.css" />*/}
					<meta name="viewport" content="width=device-width, initial-scale=1" />
					<link rel="manifest" href="/static/manifest.json" />
					<link rel="icon" type="image/x-icon" href="/static/favicon.ico" />
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
					<meta
						property={'og:image'}
						content={'/static/apple-icon-180x180.png'}
					/>
					<meta name={'twitter:card'} content={'summary'} />
					<meta name={'twitter:site'} content={'@bibleis'} />
					<meta name={'twitter:creator'} content={'@audiobible'} />
					<meta
						name={'twitter:image'}
						content={'/static/apple-icon-180x180.png'}
					/>

					<meta name="twitter:app:id:iphone" content="" />

					<meta name="twitter:app:id:ipad" content="" />

					<meta name="twitter:app:id:googleplay" content="" />
					<link rel="apple-touch-icon" href="/static/favicon-96x96.png" />
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
