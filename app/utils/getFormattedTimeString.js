// Time is in seconds
export default function getFormattedTimeString(time) {
  // Calculate values from number of milliseconds
  const durSecs = Math.floor(time % 60);
  const durMins = Math.floor((time / 60) % 60);
  const durHours = Math.floor(time / 60 / 60 / 60);

  // Build strings
  const durSecsString =
    durSecs.toFixed(0).length === 1
      ? `0${durSecs.toFixed(0)}`
      : durSecs.toFixed(0);
  const durMinsString =
    durMins.toFixed(0).length === 1
      ? `0${durMins.toFixed(0)}`
      : durMins.toFixed(0);
  const durHoursString =
    durHours.toFixed(0).length === 1
      ? `0${durHours.toFixed(0)}`
      : durHours.toFixed(0);

  if (durHoursString !== '00') {
    return `${durHoursString}:${durMinsString}:${durSecsString}`;
  }
  return `${durMinsString}:${durSecsString}`;
}
