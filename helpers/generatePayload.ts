import { getDataFaker } from './faker';
const extractData = getDataFaker();

class PayloadRequest {
    // Earth's radius in meters
    static earthRadius = 6371000;

    // Generate random latitude and longitude within a given range in meters
    static generateRandomCoordinate(latitude: number, longitude: number, rangeMeters: number = 500): { latitude: number, longitude: number } {
        const angularDistance = rangeMeters / this.earthRadius;
        const randomAngle = Math.random() * 2 * Math.PI;

        const latOffset = angularDistance * Math.cos(randomAngle);
        const lonOffset = angularDistance * Math.sin(randomAngle) / Math.cos(latitude * Math.PI / 180);

        // Calculate new latitude and longitude
        let newLatitude = latitude + (latOffset * 180) / Math.PI;
        let newLongitude = longitude + (lonOffset * 180) / Math.PI;

        // Clamp latitude to ensure it is within the valid range
        newLatitude = Math.max(-90, Math.min(90, newLatitude));

        // Wrap longitude within -180 to 180
        if (newLongitude > 180) newLongitude -= 360;
        if (newLongitude < -180) newLongitude += 360;

        return { latitude: newLatitude, longitude: newLongitude };
    }

    static addNewPoi() {
        const baseLatitude = -7.305260501068479;
        const baseLongitude = 108.22631835937501;
        const { latitude, longitude } = this.generateRandomCoordinate(baseLatitude, baseLongitude, 500);

        return {
            address: "Jl. Sukagenah No.45, Nagarasari, Kec. Cipedes, Kab. Tasikmalaya, Jawa Barat 46132, Indonesia",
            description: "test QA",
            buildType: "Ruko",
            latitude:latitude,
            longitude:longitude,
            name: extractData.poiName,
            ecosystem: "Indibiz Media & Komunikasi",
            sectorId: 173,
            subsectorId: 563,
            opportunityId: 3
        };
    }
}

export default PayloadRequest;
