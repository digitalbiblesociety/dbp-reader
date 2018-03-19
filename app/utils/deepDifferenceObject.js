import transform from 'lodash/fp/transform';
import isEqual from 'lodash/fp/isEqual';
import isObject from 'lodash/fp/isObject';

const convertedTransform = transform.convert({
	cap: false,
});

const iteratee = (baseObj) => (result, value, key) => {
	if (!isEqual(value, baseObj[key])) {
		const valIsObj = isObject(value) && isObject(baseObj[key]);
		result[key] = valIsObj === true ? differenceObject(value, baseObj[key]) : value; // eslint-disable-line no-param-reassign
	}
};

const differenceObject = (targetObj, baseObj) => convertedTransform(iteratee(baseObj), null, targetObj);

export default differenceObject;
