import { PrismaClient } from "@prisma/client";
import csvToJson from "csvtojson/v2";

const prisma = new PrismaClient();
async function main() {
  //Import users from csv. I use it to import users from prod for testing purposes
  await csvToJson()
    .fromFile("./scripts/Reaction.csv")
    .then(async jsonObj => {
      for (const reaction of jsonObj) {
        try {
          const res = await prisma.reaction.create({
            data: {
              id: Number(reaction.id),
              createdAt: new Date(reaction.createdAt),
              updatedAt: new Date(reaction.updatedAt),
              reactionType: reaction.reactionType,
              userId: Number(reaction.userId),
              questionId: reaction.questionId ? Number(reaction.questionId) : undefined,
              replyId: reaction.replyId ? Number(reaction.replyId) : undefined
            }
          });
          console.log("Successfully inserted reaction: ", res);
        } catch (err) {
          console.log("Error inserting reaction: ", reaction.profileName, err);
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
