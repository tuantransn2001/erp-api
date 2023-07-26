import db from "../../../models";
const { User } = db;
import { USER_ARRAY } from "../../../data/seeders";
import { each as forEachAwait } from "awaity";
export const handleFakeDataTest = async () => {
  const seedData = [
    {
      Model: User,
      data: USER_ARRAY,
    },
  ];

  await forEachAwait(seedData, async ({ Model, data }) => {
    await Model.destroy({ truncate: { cascade: true } });
    await Model.bulkCreate(data);
  });
};
