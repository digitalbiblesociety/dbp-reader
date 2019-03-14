import getAudioAsyncCall from '../getAudioAsyncCall';
import {
	engesv,
	ntpotp,
	seawbt,
	filesets3,
	filesets4,
	filesets5,
	filesets6,
	filesets7,
	filesets8,
} from '../testUtils/filesetsForAudioCall';

const types = {
	drama: 'audio_drama',
	plain: 'audio',
	ntDrama: 'N2DA',
	otDrama: 'O2DA',
	ntPlain: 'N1DA',
	otPlain: 'O1DA',
	ntPartialDrama: 'P2DA',
	otPartialDrama: 'P2DA',
	ntPartialPlain: 'P1DA',
	otPartialPlain: 'P1DA',
};

describe('Get audio async call utility function test', () => {
	it('should return expected audio object with valid parameters', async () => {
		const result = await getAudioAsyncCall(engesv, 'MAT', 1, types.drama);

		expect(result).toHaveProperty('type', 'loadaudio');
		expect(result).toHaveProperty('audioPaths');
		expect(Array.isArray(result.audioPaths)).toEqual(true);
		expect(result.audioPaths.length).toBeTruthy();
		expect(result.audioPaths[0].includes(types.ntDrama)).toBeTruthy();
	});
	it('should return expected audio object with valid parameters', async () => {
		const result = await getAudioAsyncCall(engesv, 'MAT', 1, types.plain);

		expect(result).toHaveProperty('type', 'loadaudio');
		expect(result).toHaveProperty('audioPaths');
		expect(Array.isArray(result.audioPaths)).toEqual(true);
		expect(result.audioPaths.length).toBeTruthy();
		expect(result.audioPaths[0].includes(types.ntPlain)).toBeTruthy();
	});
	it('should return expected audio object with valid parameters', async () => {
		const result = await getAudioAsyncCall(engesv, 'GEN', 1, types.plain);

		expect(result).toHaveProperty('type', 'loadaudio');
		expect(result).toHaveProperty('audioPaths');
		expect(Array.isArray(result.audioPaths)).toEqual(true);
		expect(result.audioPaths.length).toBeTruthy();
		expect(result.audioPaths[0].includes(types.otPlain)).toBeTruthy();
	});
	it('should return expected audio object with valid parameters', async () => {
		const result = await getAudioAsyncCall(engesv, 'GEN', 1, types.drama);

		expect(result).toHaveProperty('type', 'loadaudio');
		expect(result).toHaveProperty('audioPaths');
		expect(Array.isArray(result.audioPaths)).toEqual(true);
		expect(result.audioPaths.length).toBeTruthy();
		expect(result.audioPaths[0].includes(types.otDrama)).toBeTruthy();
	});
	it('should return expected audio object with valid parameters', async () => {
		const result = await getAudioAsyncCall(engesv, 'GEN', 1);

		expect(result).toHaveProperty('type', 'loadaudio');
		expect(result).toHaveProperty('audioPaths');
		expect(Array.isArray(result.audioPaths)).toEqual(true);
		expect(result.audioPaths.length).toBeTruthy();
		expect(result.audioPaths[0].includes(types.otDrama)).toBeTruthy();
	});
	it('should return expected audio object with valid parameters', async () => {
		const result = await getAudioAsyncCall(ntpotp, 'MRK', 1, types.drama);

		expect(result).toHaveProperty('type', 'loadaudio');
		expect(result).toHaveProperty('audioPaths');
		expect(Array.isArray(result.audioPaths)).toEqual(true);
		expect(result.audioPaths.length).toBeTruthy();
	});
	it('should return expected audio object with valid parameters', async () => {
		const result = await getAudioAsyncCall(ntpotp, 'GEN', 1, types.plain);

		expect(result).toHaveProperty('type', 'loadaudio');
		expect(result).toHaveProperty('audioPaths');
		expect(Array.isArray(result.audioPaths)).toEqual(true);
		expect(result.audioPaths.length).toBeTruthy();
	});
	it('should return expected audio object with valid parameters', async () => {
		const result = await getAudioAsyncCall(ntpotp, 'GEN', 1, types.drama);

		expect(result).toHaveProperty('type', 'loadaudio');
		expect(result).toHaveProperty('audioPaths');
		expect(Array.isArray(result.audioPaths)).toEqual(true);
		expect(result.audioPaths.length).toBeTruthy();
	});
	it('should return expected audio object with valid parameters', async () => {
		const result = await getAudioAsyncCall(ntpotp, 'MAT', 1, types.plain);

		expect(result).toHaveProperty('type', 'loadaudio');
		expect(result).toHaveProperty('audioPaths');
		expect(Array.isArray(result.audioPaths)).toEqual(true);
		expect(result.audioPaths.length).toBeTruthy();
	});
	it('should return expected audio object with valid parameters', async () => {
		const result = await getAudioAsyncCall(seawbt, 'GEN', 1, types.drama);

		expect(result).toHaveProperty('type', 'loadaudio');
		expect(result).toHaveProperty('audioPaths');
		expect(Array.isArray(result.audioPaths)).toEqual(true);
		expect(result.audioPaths.length).toBeTruthy();
	});
	it('should return expected audio object with valid parameters', async () => {
		const result = await getAudioAsyncCall(seawbt, 'ACT', 1, types.plain);

		expect(result).toHaveProperty('type', 'loadaudio');
		expect(result).toHaveProperty('audioPaths');
		expect(Array.isArray(result.audioPaths)).toEqual(true);
		expect(result.audioPaths.length).toBeTruthy();
	});
	it('should return expected audio object with valid parameters', async () => {
		const result = await getAudioAsyncCall(filesets3, 'GEN', 1, types.drama);

		expect(result).toHaveProperty('type', 'loadaudio');
		expect(result).toHaveProperty('audioPaths');
		expect(Array.isArray(result.audioPaths)).toEqual(true);
		expect(result.audioPaths.length).toBeTruthy();
	});
	it('should return expected audio object with valid parameters', async () => {
		const result = await getAudioAsyncCall(filesets4, 'MAT', 1, types.drama);

		expect(result).toHaveProperty('type', 'loadaudio');
		expect(result).toHaveProperty('audioPaths');
		expect(Array.isArray(result.audioPaths)).toEqual(true);
		expect(result.audioPaths.length).toBeTruthy();
	});
	it('should return expected audio object with valid parameters', async () => {
		const result = await getAudioAsyncCall(filesets5, 'GEN', 1, types.drama);

		expect(result).toHaveProperty('type', 'loadaudio');
		expect(result).toHaveProperty('audioPaths');
		expect(Array.isArray(result.audioPaths)).toEqual(true);
		expect(result.audioPaths.length).toBeTruthy();
	});
	it('should return expected audio object with valid parameters', async () => {
		const result = await getAudioAsyncCall(filesets6, 'MAT', 1, types.drama);

		expect(result).toHaveProperty('type', 'loadaudio');
		expect(result).toHaveProperty('audioPaths');
		expect(Array.isArray(result.audioPaths)).toEqual(true);
		expect(result.audioPaths.length).toBeTruthy();
	});
	it('should return expected audio object with valid parameters', async () => {
		const result = await getAudioAsyncCall(filesets7, 'MAT', 1, types.drama);

		expect(result).toHaveProperty('type', 'loadaudio');
		expect(result).toHaveProperty('audioPaths');
		expect(Array.isArray(result.audioPaths)).toEqual(true);
		expect(result.audioPaths.length).toBeTruthy();
	});
	it('should return expected audio object with valid parameters', async () => {
		const result = await getAudioAsyncCall(filesets8, 'GEN', 1, types.drama);

		expect(result).toHaveProperty('type', 'loadaudio');
		expect(result).toHaveProperty('audioPaths');
		expect(Array.isArray(result.audioPaths)).toEqual(true);
		expect(result.audioPaths.length).toBeTruthy();
	});
	it('should return expected audio object with valid parameters', async () => {
		const result = await getAudioAsyncCall(
			[{ id: 'ENGESVN2DA', size: 'C', type: types.drama }],
			'GEN',
			1,
			types.drama,
		);

		expect(result).toHaveProperty('type', 'loadaudio');
		expect(result).toHaveProperty('audioPaths');
		expect(Array.isArray(result.audioPaths)).toEqual(true);
		expect(result.audioPaths.length).toBeTruthy();
	});
});
