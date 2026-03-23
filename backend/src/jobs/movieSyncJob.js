const cron = require("node-cron");
const env = require("../config/env");
const { syncNowPlayingAndPopular } = require("../services/movieSyncService");

function startMovieSyncJob() {
  if (!env.tmdbApiKey) {
    console.warn("未配置 TMDB_API_KEY，已跳过自动同步任务。");
    return null;
  }

  if (!cron.validate(env.syncCron)) {
    console.warn(`SYNC_CRON 配置无效：${env.syncCron}`);
    return null;
  }

  const job = cron.schedule(env.syncCron, async () => {
    try {
      const result = await syncNowPlayingAndPopular();
      console.log("每日电影同步完成：", result);
    } catch (error) {
      console.error("每日电影同步失败：", error.message);
    }
  });

  console.log(`电影同步任务已启动，Cron: ${env.syncCron}`);
  return job;
}

module.exports = {
  startMovieSyncJob
};

