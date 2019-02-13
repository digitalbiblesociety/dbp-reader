import React from 'react';
import renderer from 'react-test-renderer';
import { fromJS } from 'immutable';
import VersionListSection from '..';
import {
	itemsParser,
	filterFunction,
	getTexts,
} from './versionListSectionUtils';

const filterText = '';
const activeTextId = 'ENGESV';
const items = [
	{
		path: '/ENGESV',
		key: 'ENGESV2001',
		className: '',
		title: 'English Standard Version',
		text: 'English Standard Version',
		altText: '',
		types: {
			audio_drama: true,
			text_plain: true,
			audio: true,
			text_format: true,
		},
	},
	{
		path: '/ENGNIV',
		key: 'ENGNIV1978',
		className: 'active-version',
		title: 'New International Version',
		text: 'New International Version',
		altText: '',
		types: {
			text_plain: true,
			audio: true,
			audio_drama: true,
			video_stream: true,
		},
	},
	{
		path: '/ENGKJV',
		key: 'ENGKJV1611',
		className: '',
		title: 'King James Version',
		text: 'King James Version',
		altText: '',
		types: { audio: true, audio_drama: true, text_plain: true },
	},
	{
		path: '/ENGNAB',
		key: 'ENGNAB1970',
		className: '',
		title: 'New American Bible',
		text: 'New American Bible',
		altText: '',
		types: { text_format: true, audio_drama: true, text_plain: true },
	},
	{
		path: '/ENGWEB',
		key: 'ENGWEB1997',
		className: '',
		title: 'World English Bible',
		text: 'World English Bible (Hosanna audio)',
		altText: 'World English Bible',
		types: { text_plain: true, text_format: true, audio_drama: true },
	},
	{
		path: '/ENGWWH',
		key: 'ENGWWH1997',
		className: '',
		title: 'World English Bible (Afred Henson)',
		text: 'World English Bible (Afred Henson)',
		altText: '',
		types: { audio_drama: true, text_plain: true },
	},
	{
		path: '/ENGNIVA',
		key: 'ENGNIVAnull',
		className: '',
		title: 'New International Version (Anglicised)',
		text: 'New International Version (Anglicised)',
		altText: '',
		types: { audio_drama: true, audio: true, text_plain: true },
	},
];

describe('<VersionListSection />', () => {
	it('Should match previous snapshot with valid props', () => {
		const tree = renderer.create(<VersionListSection items={items} />).toJSON();

		expect(tree).toMatchSnapshot();
	});
	it('Should match previous snapshot using data from api', async () => {
		const apiItems = await getTexts({ languageCode: 6414 });
		const sectionItems = itemsParser(
			fromJS(apiItems),
			activeTextId,
			filterText,
			filterFunction,
			(bible, audioType) => `${bible}_${audioType}`,
		);
		const tree = renderer
			.create(<VersionListSection items={sectionItems} />)
			.toJSON();

		expect(tree).toMatchSnapshot();
	});
});
