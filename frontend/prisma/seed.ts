import { createAdminInviteCodes } from "@/backend/inviteCode/inviteCode";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
async function main() {
  await prisma.user.create({
    data: {
      wallet: "0x0",
      isAdmin: true,
      isActive: false,
      privyUserId: "",
      displayName: "System Default User",
      id: 1
    }
  });

  //For use by admins
  await prisma.inviteCode.create({
    data: {
      code: "BF0000",
      maxUses: 5,
      used: 0,
      userId: 1,
      isActive: true
    }
  });

  //To distribute to users
  await createAdminInviteCodes(100, true);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
