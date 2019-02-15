import lscache from 'lscache';
import cachedFetch, { overrideCache, logCache } from '../cachedFetch';

const url = `${
	process.env.BASE_API_ROUTE
}/bibles/filesets/ENGESV/MAT/5?asset_id=${process.env.DBP_BUCKET_ID}&key=${
	process.env.DBP_API_KEY
}&v=4&type=text_plain`;

describe('cached fetch utility function', () => {
	it('should cache url', async () => {
		const response = await cachedFetch(url);

		expect(Array.isArray(response.data)).toEqual(true);
	});
	it('should check for url in cache', async () => {
		const spy = jest.spyOn(lscache, 'get');
		const response = await cachedFetch(url);

		expect(spy).toHaveBeenCalledTimes(1);
		expect(Array.isArray(response.data)).toEqual(true);
	});
	it('should override portion of the cache', async () => {
		const spy = jest.spyOn(lscache, 'set');
		const getSpy = jest.spyOn(lscache, 'get');
		const newValue = 'Hello There!';

		expect(logCache(url)).not.toEqual(newValue);
		expect(getSpy).toHaveBeenCalledTimes(2);

		overrideCache(url, newValue);

		expect(logCache(url)).toEqual(newValue);

		expect(getSpy).toHaveBeenCalledTimes(3);
		expect(spy).toHaveBeenCalledTimes(1);
	});
});
