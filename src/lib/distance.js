/**
 * @param {number} lat1
 * @param {number} lon1
 * @param {number} lat2
 * @param {number} lon2
 */
export function distance(lat1, lon1, lat2, lon2) {
    const toRadians = (/** @type {number} */ degrees) => degrees * (Math.PI / 180);
    const a = Math.sin(toRadians(lat2 - lat1) / 2) * Math.sin(toRadians(lat2 - lat1) / 2) + Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(toRadians(lon2 - lon1) / 2) * Math.sin(toRadians(lon2 - lon1) / 2);
        
    return 6371 * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))); // Distance in kilometers
}