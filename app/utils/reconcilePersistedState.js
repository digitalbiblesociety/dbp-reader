export default (reducers, prefix) => {
	reducers.forEach((reducer) => localStorage.removeItem(`${prefix}${reducer}`));
};
