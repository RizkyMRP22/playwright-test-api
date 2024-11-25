import { faker } from '@faker-js/faker';

export function getDataFaker() {
    return {
        fullName : faker.person.fullName(),
        phoneNumber : `0812-${faker.string.numeric(4)}-${faker.string.numeric(4)}`,
        email : faker.internet.email(),
        companyName : faker.company.name(),
        externalId : faker.string.numeric(8)
    }
}