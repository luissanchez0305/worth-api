export const convertToBoolean = (value) => {
  if (value === null || value === undefined) {
    return undefined;
  }
  if (typeof value === 'boolean') {
    return value;
  }
  if (['true', 'on', 'yes', '1'].includes(value.toLowerCase())) {
    value = true;
  } else if (['false', 'off', 'no', '0'].includes(value.toLowerCase())) {
    value = false;
  } else {
    value = undefined;
  }
  return value;
};
