const app = require("./app");
const env = require("./config/env");
const prisma = require("./lib/prisma");
const { startMovieSyncJob } = require("./jobs/movieSyncJob");
const { syncNowPlayingAndPopular } = require("./services/movieSyncService");

const server = app.listen(env.port, async () => {
  console.log(`后端服务已启动：http://localhost:${env.port}`);

  if (env.tmdbApiKey) {
    try {
      const result = await syncNowPlayingAndPopular();
      console.log("启动时同步完成：", result);
    } catch (error) {
      console.error("启动时同步失败：", error.message);
    }
  }

  startMovieSyncJob();
});

async function shutdown(signal) {
  console.log(`收到 ${signal}，准备关闭服务...`);
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

