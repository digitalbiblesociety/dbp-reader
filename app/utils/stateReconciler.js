export default (incoming, original, reducedState) => {
	const finalState = reducedState;
	const incomingId = incoming.profile.userId;
	const originalId = original.profile.userId;

	if (originalId && !incomingId) {
		finalState.profile.userId = originalId;
	}
	// The settings below need to be dynamically set based on the page content
	finalState.settings.userSettings.toggleOptions.crossReferences.available =
		original.settings.userSettings.toggleOptions.crossReferences.available;
	finalState.settings.userSettings.toggleOptions.redLetter.available =
		original.settings.userSettings.toggleOptions.redLetter.available;

	return finalState;
};
