/**
 *
 * TermsAndConditions
 *
 */

import React from 'react';
import SvgWrapper from '../app/components/SvgWrapper';

function TermsAndConditions() {
	const onClick = () => {
		if (typeof history !== 'undefined') {
			history.back();
		}
	};
	return (
		<div className="policy-page-container">
			<header className="privacy-header">
				<a className="logo" onClick={onClick} title="Go Back" rel={'noopener'}>
					<SvgWrapper className={'svg'} svgid={'bible.is_logo'} />
				</a>
			</header>
			<main>
				<h1 className="intro">Terms and Conditions</h1>
				<p>
					<strong>Terms of Use</strong>
				</p>
				<p>Last Modified: January 1, 2019</p>
				<p>
					<strong>
						Description of Services and Acceptance of Terms of Use{' '}
					</strong>
				</p>
				<p>
					Welcome to the web site{' '}
					<a href="http://www.bible.is.com">www.bible.is</a>
					(the “Site”) which is operated by Hosanna/Faith Comes By Hearing
					(“FCBH”, “we” or “us”). The services provided on the Site include
					Bible content and related reference materials, and any other features,
					content or applications offered from time to time by FCBH in
					connection with the Site (collectively the “Services”).
				</p>
				<p>
					By visiting the Site and/or any mobile application (together
					“Bible.is”) or using the Services, whether as a guest or a registered
					user, you accept and agree to these Terms, including any future
					modifications, and to abide by all applicable laws, rules and
					regulations.
				</p>
				<p>
					Please read through this agreement, as well as the Privacy Policy
					carefully. All information collected by FCBH on or through Bible.is is
					subject to our Privacy Policy. By visiting the Site or using the
					Services, you consent to all actions taken by FCBH with respect to
					your information in compliance with the Privacy Policy.
				</p>
				<p>
					FCBH may modify these Terms from time to time, in its sole discretion.
					Any changes are effective upon posting on the Site. Your continued use
					of the Site or the Services following any such modification
					constitutes your acceptance and agreement to the Terms as modified.
				</p>
				<p>
					FCBH reserves the right to change or cease offering Bible.is or any
					part, portion, or functionality without notice. FCBH will not be
					liable if for any reason all or any part of Bible.is is not available
					at any time.
				</p>
				<p>
					<strong>Intellectual Property Rights</strong>
				</p>
				<p>
					Bible.is and its contents, features and functionality (including, but
					not limited to, software, text, images, audio, videos, and the design,
					selection and arrangement of the same) (collectively the “Content”),
					are owned by FCBH, its licensors or other providers of such material
					and are protected by United States and international copyright,
					trademark, patent, trade secret and other intellectual property or
					proprietary rights laws.
				</p>
				<p>
					The names and logos of Bible.is and FCBH, all related names, logos,
					product and services names, designs and slogans are trademarks and/or
					copyrights of FCBH. All other names, logos, product and service names,
					designs and slogans on Bible.is are the trademarks of their respective
					owners.
				</p>
				<p>
					Except as expressly set forth in these Terms or otherwise expressly
					granted to you in writing by FCBH, no rights (either by implication,
					estoppel or otherwise) in or to the Content are granted to you. All
					rights not expressly granted to you are reserved by FCBH.
				</p>
				<p>
					<strong>Permitted Use </strong>
				</p>
				<p>
					FCBH allows you to use Bible.is in accordance with these Terms for
					your personal, non-commercial use. Except as provided in these Terms,
					you may not copy, download, stream, capture, reproduce, duplicate,
					archive, upload, modify, translate, publish, broadcast, transmit,
					retransmit, distribute, perform, display, sell or otherwise use any
					Content appearing on the Site.
				</p>
				<p>Subject to your strict compliance with these Terms, you may:</p>
				<ul>
					<li>
						Use the Bible.is Services to download, read, listen, or view the
						Content for personal, non-commercial use, in accordance with its
						pre-defined functionality only;
					</li>
					<li>
						Use the services to make personal notes or participate in the
						Bible.is community areas.
					</li>
				</ul>
				<p>You will not:</p>
				<ul>
					<li>
						use Bible.is in any way that violates any federal, state, local or
						international law or regulation;
					</li>
					<li>
						violate the rights of others including patent, trademark, trademark,
						trade secret, copyright, privacy, publicity or other proprietary
						rights;
					</li>
					<li>
						post, upload or otherwise transmit or link to Content anything that
						is unlawful; threatening; harmful; abusive; hateful; discriminatory;
						pornographic or includes nudity; obscene; vulgar; offensive;
						harassing; excessively violent; tortious; defamatory; libelous;
						false or misleading; or invasive of another’s patent, copyright,
						trademark, trade secret, contract, privacy, publicity, or other
						rights;
					</li>
					<li>harass or harm another person;</li>
					<li>exploit or endanger a minor;</li>
					<li>impersonate or attempt to impersonate any person or entity;</li>
					<li>
						disable, overburden, damage, or impair Bible.is or interfere with
						another’s use;
					</li>
					<li>
						introduce any virus, Trojan horse, worm, logic bomb, or other
						material which is malicious or technologically harmful;
					</li>
					<li>
						attempt to gain unauthorized access to, interfere with, damage, or
						disrupt any parts of Bible.is or any server, computer, or database
						connected to Bible.is;
					</li>
					<li>
						attack Bible.is via a denial-of-service attack or a distributed
						denial-of-service attack;
					</li>
					<li>
						engage in any other conduct which, as determined by FCBH, may harm
						FCBH or users of Bible.is or expose them to liability;
					</li>
					<li>
						otherwise attempt to interfere with the proper working of Bible.is;
						or
					</li>
					<li>
						attempt, facilitate or encourage others to do any of the foregoing
						acts.
					</li>
				</ul>
				<p>
					<strong>Your Reliance on Information and Translations</strong>
				</p>
				<p>
					The information presented on or through Bible.is is made available
					solely for general information purposes. FCBH does not warrant the
					accuracy, completeness or usefulness of any of this information. Any
					reliance you place on such information is strictly at your own risk.
					Bible translations found on Bible.is are provided by the licensors of
					FCBH and FCBH does not represent or warrant the accuracy of those
					translations.
				</p>
				<p>
					<strong />
					<strong>Third Party Links</strong>
				</p>
				<p>
					The Services may contain links to other sites and pop-ups and similar
					resources provided by third parties. These links and resources are
					provided for your convenience only. FCBH has no control over the
					contents of those sites or resources, and accepts no responsibility
					for them or for any loss or damage that may arise from your use of
					them. When you use such links and resources, you do so at your own
					risk and subject to the terms and conditions of use for such websites.
					FCBH is not responsible or liable to you or any third party for the
					content or accuracy of any materials provided by any third parties.
					The inclusion of any link does not imply approval or endorsement by
					FCBH of the service provided by the third party.
				</p>
				<p>
					<strong>Disclaimer of Warranties</strong>
				</p>
				<p>
					YOUR USE OF BIBLE.IS, ITS CONTENT AND ANY FUNCTIONALITY, SERVICES OR
					ITEMS OBTAINED THROUGH BIBLE.IS IS AT YOUR OWN RISK, ALL OF WHICH ARE
					PROVIDED ON AN “AS IS” AND “AS AVAILABLE” BASIS, WITHOUT ANY
					WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. NEITHER FCBH NOR
					ANY PERSON ASSOCIATED WITH FCBH MAKES ANY WARRANTY OR REPRESENTATION
					WITH RESPECT TO THE COMPLETENESS, SECURITY, RELIABILITY, QUALITY,
					ACCURACY OR AVAILABILITY OF BIBLE.IS. WITHOUT LIMITING THE FOREGOING,
					NEITHER FCBH, NOR ANYONE ASSOCIATED WITH FCBH, REPRESENTS OR WARRANTS
					THAT BIBLE.IS OR ANY FUNCTIONALITY CONTENT OR ANY SERVICES OR ITEMS
					OBTAINED THROUGH BIBLE.IS WILL BE ACCURATE, RELIABLE, ERROR-FREE OR
					UNINTERRUPTED, THAT DEFECTS WILL BE CORRECTED, THAT BIBLE.IS OR THE
					SERVER THAT MAKES IT AVAILABLE ARE FREE OF VIRUSES OR OTHER HARMFUL
					COMPONENTS OR THAT BIBLE.IS OR ANY SERVICES OR ITEMS OBTAINED THROUGH
					BIBLE.IS WILL OTHERWISE MEET YOUR NEEDS OR EXPECTATIONS.
				</p>
				<p>
					FCBH HEREBY DISCLAIMS ALL WARRANTIES OF ANY KIND, WHETHER EXPRESS OR
					IMPLIED, STATUTORY OR OTHERWISE, INCLUDING BUT NOT LIMITED TO ANY
					WARRANTIES OF MERCHANTABILITY, NON-INFRINGEMENT AND FITNESS FOR
					PARTICULAR PURPOSE.
				</p>
				<p>
					THE FOREGOING DOES NOT AFFECT ANY WARRANTIES WHICH CANNOT BE EXCLUDED
					OR LIMITED UNDER APPLICABLE LAW.
				</p>
				<p>
					<strong>Limitation on Liability</strong>
				</p>
				<p>
					IN NO EVENT WILL FCBH, ITS LICENSORS, SERVICE PROVIDERS, OR ANY OF
					THEIR EMPLOYEES, AGENTS, OFFICERS OR DIRECTORS BE LIABLE FOR DAMAGES
					OF ANY KIND, UNDER ANY LEGAL THEORY, ARISING OUT OF OR IN CONNECTION
					WITH YOUR USE, OR INABILITY TO USE BIBLE.IS, ANY WEBSITES LINKED TO
					IT, ANY CONTENT OFFERED ON OR THROUGH BIBLE.IS OR SUCH OTHER WEBSITES
					OR ANY SERVICES OR ITEMS OBTAINED THROUGH BIBLE.IS, INCLUDING ANY
					DIRECT, INDIRECT, SPECIAL, INCIDENTAL, CONSEQUENTIAL OR PUNITIVE
					DAMAGES, INCLUDING BUT NOT LIMITED TO, PERSONAL INJURY, PAIN AND
					SUFFERING, EMOTIONAL DISTRESS, LOSS OF REVENUE, LOSS OF PROFITS, LOSS
					OF BUSINESS OR ANTICIPATED SAVINGS, LOSS OF USE, LOSS OF GOODWILL,
					LOSS OF DATA, AND WHETHER CAUSED BY TORT (INCLUDING NEGLIGENCE),
					BREACH OF CONTRACT OR OTHERWISE, EVEN IF FORESEEABLE.
				</p>
				<p>
					THE FOREGOING DOES NOT AFFECT ANY LIABILITY WHICH CANNOT BE EXCLUDED
					OR LIMITED UNDER APPLICABLE LAW.
				</p>
				<p>
					<strong>Indemnification</strong>
				</p>
				<p>
					You agree to defend, indemnify and hold harmless FCBH, its affiliates,
					licensors and service providers, and its and their respective
					officers, directors, employees, contractors, agents, licensors,
					suppliers, successors and assigns from and against any claims,
					liabilities, damages, judgments, awards, losses, costs, expenses or
					fees (including reasonable attorneys’ fees) arising out of or relating
					to your violation of these Terms or your use of Bible.is, any use of
					Content, services and products other than as expressly authorized in
					these Terms or your use of any information obtained from Bible.is.
				</p>
				<p>
					<strong>Governing Law and Jurisdiction</strong>
				</p>
				<p>
					All matters, disputes or claims relating to Bible.is and these Terms
					(including non-contractual disputes or claims), shall be governed by
					and construed in accordance with the internal laws of the State of New
					Mexico without giving effect to any choice or conflict of law
					provision or rule. Any legal suit, action or proceeding arising out
					of, or related to, these Terms or Bible.is shall be instituted
					exclusively in the federal courts of the United States or the courts
					of the State of New Mexico in each case located in Albuquerque,
					Bernalillo County, New Mexico. By agreeing to these Terms and using
					Bible.is, you waive any and all objections to the exercise of
					jurisdiction over you by such courts and to venue in such courts.
				</p>
				<p>
					<strong>Waiver and Severability</strong>
				</p>
				<p>
					FCBH may only waive its rights under these Terms in writing. If any
					provision of these Terms is held by a court or other tribunal of
					competent jurisdiction to be invalid, illegal or unenforceable for any
					reason, such provision shall be eliminated or limited to the minimum
					extent such that the remaining provisions of these Terms will continue
					in full force and effect.
				</p>
				<p>
					<strong>Entire Agreement</strong>
				</p>
				<p>
					These Terms and our{' '}
					<a href="https://www.bible.com/privacy">Privacy Policy</a> constitute
					the sole and entire agreement between you and FCBH with respect to
					Bible.is and supersede all prior and contemporaneous understandings,
					agreements, representations and warranties, both written and oral,
					with respect to Bible.is.
				</p>
				<p>
					<strong />
					<br />
				</p>
			</main>
			<footer className="privacy-footer" />
		</div>
	);
}

TermsAndConditions.propTypes = {};

export default TermsAndConditions;
