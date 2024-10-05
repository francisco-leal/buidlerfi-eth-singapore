import { PrismaClient } from "@prisma/client";
import csvToJson from "csvtojson/v2";

const prisma = new PrismaClient();
async function main() {
  //Import users from csv. I use it to import users from prod for testing purposes
  await csvToJson()
    .fromFile("./scripts/Trade.csv")
    .then(async jsonObj => {
      for (const item of jsonObj) {
        try {
          const res = await prisma.trade.create({
            data: {
              id: Number(item.id),
              createdAt: new Date(item.createdAt),
              updatedAt: new Date(item.updatedAt),
              amount: BigInt(item.amount),
              block: BigInt(item.block),
              chainId: Number(item.chainId),
              holderAddress: item.holderAddress,
              ownerAddress: item.ownerAddress,
              hash: item.hash,
              ethCost: BigInt(item.ethCost),
              ownerFee: BigInt(item.ownerFee),
              processed: item.processed === "True",
              protocolFee: BigInt(item.protocolFee),
              timestamp: BigInt(item.timestamp)
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
