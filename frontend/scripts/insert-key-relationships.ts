import { PrismaClient } from "@prisma/client";
import csvToJson from "csvtojson/v2";

const prisma = new PrismaClient();
async function main() {
  //Import users from csv. I use it to import users from prod for testing purposes
  await csvToJson()
    .fromFile("./scripts/KeyRelationship.csv")
    .then(async jsonObj => {
      for (const item of jsonObj) {
        try {
          const res = await prisma.keyRelationship.create({
            data: {
              id: Number(item.id),
              createdAt: new Date(item.createdAt),
              updatedAt: new Date(item.updatedAt),
              amount: Number(item.amount),
              holderId: Number(item.holderId),
              ownerId: Number(item.ownerId)
            }
          });
          console.log("Successfully inserted entry: ", res);
        } catch (err) {
          console.log("Error inserting entry: ", item.profileName, err);
        }
      }
    });
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
