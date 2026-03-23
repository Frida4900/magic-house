const prisma = require("../src/lib/prisma");
const { syncNowPlayingAndPopular } = require("../src/services/movieSyncService");

async function main() {
  const result = await syncNowPlayingAndPopular();
  console.log("电影同步完成：", result);
}

main()
  .catch((error) => {
    console.error("电影同步失败：", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

