/**
 *
 * PrivacyPolicy
 *
 */

import React from 'react';
import SvgWrapper from '../app/components/SvgWrapper';
// import styled from 'styled-components';

// import { FormattedMessage } from 'react-intl';
// import messages from './messages';

function PrivacyPolicy() {
	const onClick = () => {
		if (typeof history !== 'undefined') {
			history.back();
		}
	};
	return (
		<div className="policy-page-container">
			<header className="privacy-header">
				<a
					className="logo"
					onClick={onClick}
					title={'Go Back'}
					rel={'noopener'}
				>
					<SvgWrapper className={'svg'} svgid={'bible.is_logo'} />
				</a>
			</header>
			<main>
				<h1 className="intro">Bible.is Privacy Policy</h1>
				<div className="one-space" />
				<p>
					<strong>Our Commitment to Privacy</strong>
				</p>
				<p>
					Faith Comes By Hearing is committed to transparency in letting you
					know how your personal information is obtained, used, shared, and
					secured.
				</p>
				<p>
					Your entry of personal data on any of our websites is completely
					optional, but the use of some services may require you to create an
					account in order to obtain full benefit.
				</p>
				<p>
					By visiting any of our websites and/or sharing personal information
					with us, you are accepting the practices described in this Privacy
					Policy.
				</p>
				<p>
					<strong>
						What information does Faith Comes By Hearing collect and how is it
						used?
					</strong>
				</p>
				<ul className="p_ul">
					<li className="p_li">
						If you sign up for our email updates, we will collect your name and
						email address in order to communicate with you and personalize our
						content.
					</li>
					<li className="p_li">
						We collect the following data when you visit our websites:
						<ul className="p_ul">
							<li className="p_li">
								Internet Protocol (IP) address, which is used to identify your
								location down to the region/city level. We use this information
								to identify where our services are used so that we can create a
								more personalized experience.
							</li>
							<li className="p_li">
								Referring URL (if any), which is used to identify where our
								traffic comes from and refine our marketing efforts in order to
								reduce expenses.
							</li>
							<li className="p_li">
								Technical information about your Internet browser software,
								which helps us to identify technical issues and fix bugs.
							</li>
							<li className="p_li">
								Site activity and statistics, which are used to help us
								understand which sections of our websites are most valuable in
								order to provide a more relevant experience.
							</li>
						</ul>
					</li>
				</ul>
				<ul className="p_ul">
					<li className="p_li">
						We employ the use of cookies on our websites. These cookies stay on
						your computer after you have gone offline and remain in the
						&ldquo;cookies&rdquo; folder after you have closed your web browser.
						Disabling cookies in your browser will likely affect the quality of
						services we provide. We use cookies to:
						<ul className="p_ul">
							<li className="p_li">identify you as a valid user;</li>
							<li className="p_li">help personalize your online experience;</li>
							<li className="p_li">improve our services;</li>
							<li className="p_li">remember your site preferences;</li>
							<li className="p_li">track the number of visitors to a page;</li>
							<li className="p_li">
								help you sign up for our services; and/or
							</li>
							<li className="p_li">protect your data.</li>
						</ul>
					</li>
				</ul>
				<ul className="p_ul">
					<li className="p_li">
						If you create an account on any of our websites or make a donation,
						we will ask you to provide other information such as your name and
						address to send you tax documents, process your transaction
						securely, and personalize your experience with our ministry. &nbsp;
					</li>
					<li className="p_li">
						We may ask for other relevant information to help process your
						request. For example, we will ask you to specify which branch of
						military service if you request chaplain materials.
					</li>
				</ul>
				<ul className="p_ul">
					<li className="p_li">
						We will use your provided information to record and support your
						participation in the activities you select. For example, if you fill
						out a survey, we will use that information to make better decisions
						on how we can communicate more effectively.
					</li>
				</ul>
				<p>
					<strong>Does FCBH share my information?</strong>
				</p>
				<ul className="p_ul">
					<li className="p_li">
						We do not trade or sell your information to third parties for any
						reason.
					</li>
					<li className="p_li">
						We do not share your information with third parties for any reason
						except the following:
						<ul className="p_ul">
							<li className="p_li">
								We use several third party tracking services such as Facebook
								and Google Analytics to provide a better, more customized
								experience for our users and identify the content that is most
								relevant to them. These platforms track information that allows
								them to associate demographics that you may have shared with
								them such as age, gender, occupation, location, etc. This
								information can be used to identify you, and we use it to share
								promotional messages and targeted ads with you on these
								platforms.
							</li>
							<li className="p_li">
								We provide your information to partners for the purpose of
								sending you relevant information regarding content they create.
								This only happens in rare circumstances, and you must
								specifically opt-in to receive partner content or information.
							</li>
							<li className="p_li">
								We take all reasonable measures to ensure that your personally
								identifiable information remains private. However, in the event
								that we are required to disclose personally identifiable
								information by a court, the police or other law enforcement
								bodies for lawful reasons, we will make such a disclosure
								without being in violation of this Policy.
							</li>
						</ul>
					</li>
				</ul>
				<ul className="p_ul">
					<li className="p_li">
						In the case of a breach in our systems, and if we suspect that your
						data may have been compromised, we will make every attempt to notify
						you as soon as possible &ndash; usually within 48 hours.
					</li>
				</ul>
				<p>
					<strong>How does FCBH provide safe online transactions?</strong>
				</p>
				<ul className="p_ul">
					<li className="p_li">
						We process all transactions using Authorize.net, a PCI-compliant
						industry leader in transaction processing. All information is sent
						using an industry-standard, encrypted (SSL), military-grade
						connection.
					</li>
					<li className="p_li">
						Children under the age of 16 are not eligible to use our service and
						must not attempt to register with us or submit any personal
						information to us without obtaining explicit parental consent.
						&nbsp;&nbsp;
					</li>
				</ul>
				<p>
					<strong>
						How can I unsubscribe from email updates, contact FCBH about my
						information, get a copy of my personal information, or ask that my
						personal information be deleted?
					</strong>
				</p>
				<ul className="p_ul">
					<li className="p_li">
						You may unsubscribe at any time by clicking on the
						&ldquo;unsubscribe&rdquo; link that is included with every bulk
						email we send. You may also make a request by contacting us using
						the information below.
					</li>
					<li className="p_li">
						To obtain a copy of the personal information we have collected, to
						request that we edit or delete your personal information from our
						records, or to modify your existing monthly contribution, contact us
						in one of the following methods:
						<ul className="p_ul">
							<li className="p_li">
								<strong>Postal mail:</strong> Faith Comes By Hearing, 2421 Aztec
								Rd., Albuquerque, NM 87107
							</li>
							<li className="p_li">
								<strong>Phone:</strong>
								&nbsp;(800) 545-6552 7am - 4pm MST, M - F; (505) 881-3321 9am –
								4pm MST, M – F
							</li>
							<li className="p_li">
								<strong>Email:</strong>{' '}
								<u>
									<a href="mailto:info@faithcomesbyhearing.com">
										info@faithcomesbyhearing.com
									</a>
								</u>
							</li>
						</ul>
					</li>
				</ul>
				<p>
					<strong>Disclaimer</strong>
				</p>
				<p>
					We will never contact you and ask that you provide your password for
					any reason. You should never disclose any of your account passwords to
					unauthorized people. We use industry-standard security measures and
					practices to help keep your personal information safe, but we cannot
					guarantee that these measures will stop any users from conducting
					illegal activity. Consequently, by signing up for email updates,
					creating an account on our sites, or providing any personal
					information, you acknowledge that there are circumstances in which
					unauthorized persons may access your personal information.
				</p>
				<p>
					Because some of our services rely on users sharing personal
					information, withdrawing your consent will mean that you are not able
					to receive the full benefits of these services as a user.
				</p>
				<p>
					Currency Conversion Notice: We cannot guarantee the accuracy of the
					exchange rates provided. You should confirm current rates before
					making any transactions that could be affected by changes in the
					exchange rates. Rates are for information purposes only and are
					subject to change without notice. All contributions are charged in US
					Dollars ($ USD).
				</p>
				<p>
					<strong>Effective date</strong>
				</p>
				<p>
					We reserve the right to change this Privacy Policy as we deem
					necessary, and in accordance with national and international laws.
					When we do, we will note the date of the most recent update
					immediately below.
				</p>
				<p>
					<b>May 25, 2018</b>
				</p>
				<p>
					<strong>
						Faith Comes By Hearing/Hosanna is a 501(c)(3) non-profit
						organization. All U.S. contributions are tax-deductible.
					</strong>
				</p>
			</main>
			<footer className="privacy-footer" />
		</div>
	);
}

PrivacyPolicy.propTypes = {};

export default PrivacyPolicy;
