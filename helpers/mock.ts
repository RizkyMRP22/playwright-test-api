import { getDataFaker } from '../helpers/faker';
const extractData = getDataFaker();

/**
 * Generates a payload for create new poi.
 * @returns payload for create new poi
 */
export const payloadAddNewPOI = () => ({
    address: "Jl. Sukagenah No.45, Nagarasari, Kec. Cipedes, Kab. Tasikmalaya, Jawa Barat 46132, Indonesia",
    description: "test QA",
    buildType: "Ruko",
    latitude: -7.305260501068479,
    longitude: 108.22631835937501,
    name: extractData.poiName,
    ecosystem: "Indibiz Media & Komunikasi",
    sectorId: 173,
    subsectorId: 563,
    opportunityId: 3
});