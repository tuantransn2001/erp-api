import db from "../../../models";
const { User } = db;
import { USER_ARRAY } from "../../../data/seeders";
import { each as forEachAsync } from "awaity";
export const handleFakeDataTest = async () => {
  const seedData = [
    {
      Model: User,
      data: USER_ARRAY,
    },
  ];

  await forEachAsync(seedData, async ({ Model, data }) => {
    await Model.destroy({ truncate: { cascade: true } });
    await Model.bulkCreate(data);
  });
};
