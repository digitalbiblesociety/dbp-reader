export default function getFormattedTimeString(time) {
	const durSecs = Math.floor(time % 60);
	const durMins = Math.floor(time / 60);
	const durSecsString =
		durSecs.toFixed(0).length === 1
			? `0${durSecs.toFixed(0)}`
			: durSecs.toFixed(0);
	const durMinsString = durMins.toFixed(0);

	if (durMinsString.length === 1) {
		return `0${durMins}:${durSecsString}`;
	} else if (durMinsString.length > 1) {
		return `${durMins}:${durSecsString}`;
	}
	return `00:${durSecsString}`;
}
