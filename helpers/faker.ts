import { Faker, id_ID } from '@faker-js/faker';

const faker = new Faker({ locale: id_ID });

export function getDataFaker() {
    return {
        fullName: faker.person.fullName(),
        phoneNumber: `081${faker.string.numeric(1)}-${faker.string.numeric(4)}-${faker.string.numeric(4)}`,
        email: faker.internet.email(), 
        companyName: faker.company.name(),
        externalId: faker.string.numeric(8),
        poiName: `[MyTens] ${faker.company.name()}`,
        invalidToken: faker.string.alphanumeric(64),
        coordinateRandom: faker.string.numeric(6),
        randomNumber: faker.string.numeric(3)
    };
}
 