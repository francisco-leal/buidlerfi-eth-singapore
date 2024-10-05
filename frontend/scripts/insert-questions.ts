import { PrismaClient } from "@prisma/client";
import csvToJson from "csvtojson/v2";

const prisma = new PrismaClient();
async function main() {
  //Import users from csv. I use it to import users from prod for testing purposes
  await csvToJson()
    .fromFile("./scripts/Question.csv")
    .then(async jsonObj => {
      for (const question of jsonObj) {
        try {
          const res = await prisma.question.create({
            data: {
              id: Number(question.id),
              repliedOn: new Date(question.repliedOn),
              questionContent: question.questionContent,
              questionerId: Number(question.questionerId),
              replierId: Number(question.replierId),
              createdAt: new Date(question.createdAt),
              updatedAt: new Date(question.updatedAt)
            }
          });
          console.log("Successfully inserted question: ", res);
        } catch (err) {
          console.log("Error inserting question: ", question.profileName, err);
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
