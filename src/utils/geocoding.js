const addressCache = new Map();

/**
 * Reverse geocodes coordinates (lat, lng) to a human-readable address.
 * Uses Nominatim (OpenStreetMap) API.
 * Includes a simple in-memory cache to avoid redundant network calls.
 */
export const reverseGeocode = async (lat, lng) => {
    if (!lat || !lng) return null;

    const cacheKey = `${lat.toFixed(6)},${lng.toFixed(6)}`;
    if (addressCache.has(cacheKey)) {
        return addressCache.get(cacheKey);
    }

    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1&accept-language=en`,
            {
                headers: {
                    "User-Agent": "EMS-App/1.0",
                },
            }
        );

        if (!response.ok) {
            throw new Error("Geocoding request failed");
        }

        const data = await response.json();

        // Extract a clean address from structured data if possible
        const addr = data.address || {};
        const parts = [];

        // Priority parts for better local accuracy
        if (addr.road) parts.push(addr.road);
        if (addr.village || addr.suburb || addr.neighbourhood) parts.push(addr.village || addr.suburb || addr.neighbourhood);
        if (addr.city || addr.town || addr.city_district) parts.push(addr.city || addr.town || addr.city_district);
        if (addr.state_district) parts.push(addr.state_district);
        if (addr.state) parts.push(addr.state);

        let shortAddress = parts.join(", ");

        // Fallback to display_name if parts are too few
        if (parts.length < 2) {
            shortAddress = (data.display_name || "Unknown Location").split(",").slice(0, 5).map(part => part.trim()).join(", ");
        }

        addressCache.set(cacheKey, shortAddress);
        return shortAddress;
    } catch (error) {
        console.error("Geocoding error:", error);
        return "Error resolving address";
    }
};
