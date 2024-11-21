import { test, expect, APIRequestContext } from '@playwright/test';
import { login } from '../../../endpoints/auth/postLogin';
import { getListAssignment } from '../../../endpoints/poi/getListAssignmentPoi';
import { getStorage, saveStorage, searchById } from '../../../../../helpers/parsingData';

test.describe('API GET List POI', () => {
    test.beforeAll(async ({ request }: { request: APIRequestContext }) => {
        const response = await login(request);
        const responseData = await response.json();

        expect.soft(response.ok(), 'Expected response API is valid').toBeTruthy();
        expect.soft(responseData.code, 'Expected response code is 200').toBe(200);
        expect.soft(responseData.message, 'Expected message is "Your Request Has Been Processed"').toBe("Your Request Has Been Processed");

        saveStorage("loginToken", responseData.data.accessToken);
    });

    test('Positive Case:[200] Get List Assignment to Me POI in Mobile ', async ({ request }: { request: APIRequestContext }) => {
        const loginToken = getStorage("loginToken");
        const response = await getListAssignment(request, loginToken);
        const responseData = await response.json();
        expect.soft(response.ok(), 'Expected response API is valid').toBeTruthy();
        expect.soft(responseData.code, 'Expected response code is 200').toBe(200);
        expect.soft(responseData.message, 'Expected message is "success"').toBe("Success");

        // console.log("Data Type:", Array.isArray(responseData.data));
        // console.log("IDs in Data:", responseData.data.map((item) => item.id));


        //   // Search by ID
        const searchId = 3757524; // Example ID to search
        const foundItem = searchById(responseData.data, searchId);

        // Validate the search result
        expect.soft(foundItem, `Expected to find an item with ID ${searchId}`).not.toBeNull();
        if (foundItem) {
            expect.soft(foundItem.name, 'Expected name to match').toBe("Kantor Komunitas Bisnis GAPURA");
        }
    });

});
