const validateCoordinates = (lat, lon) => {
    try {
        const latitude = parseFloat(String(lat).replace(',', '.'));
        const longitude = parseFloat(String(lon).replace(',', '.'));

        const isValidLat = !isNaN(latitude) && latitude >= -90 && latitude <= 90;
        const isValidLon = !isNaN(longitude) && longitude >= -180 && longitude <= 180;

        return isValidLat && isValidLon;
    } catch (error) {
        return false;
    }
};

const isOSMCompatible = (lat, lon) => {
    if (!validateCoordinates(lat, lon)) return false;

    const coordPattern = /^-?\d{1,3}(\.\d+)?$/;
    return coordPattern.test(lat) && coordPattern.test(lon);
};

module.exports = {
    validateCoordinates,
    isOSMCompatible
  };