import { faker } from "@faker-js/faker";
import { roles, statuses } from "./constants";

// Set a fixed seed for consistent data generation
faker.seed(67890);

export const usersData = Array.from({ length: 500 }, () => {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();

  return {
    id: faker.string.uuid(),
    firstName,
    lastName,
    username: faker.internet
      .username({ firstName, lastName })
      .toLocaleLowerCase(),
    email: faker.internet.email({ firstName }).toLocaleLowerCase(),
    phoneNumber: faker.phone.number({ style: "international" }),
    status: faker.helpers.arrayElement(statuses.map((s) => s.value)) as
      | "active"
      | "inactive"
      | "invited"
      | "suspended",
    role: faker.helpers.arrayElement(roles.map((r) => r.value)) as
      | "superadmin"
      | "admin"
      | "manager"
      | "cashier",
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
  };
});
