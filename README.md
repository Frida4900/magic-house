# 青柚电影

一个中文电影评分网站示例项目，前端使用 React + Vite，后端使用 Express，数据层使用 PostgreSQL + Prisma，并通过 TMDB API 自动同步“正在上映”和“热门电影”。

## 目录结构

```text
.
├─ frontend/         # React 前端
├─ backend/          # Express API + Prisma
├─ database/         # PostgreSQL 初始化说明
├─ .env.example      # 根目录环境变量示例
└─ package.json      # Workspace 与联调脚本
```

## 本地启动

1. 安装 PostgreSQL，并创建数据库：

   ```bash
   psql -U postgres -f database/init.sql
   ```

2. 复制环境变量：

   ```bash
   copy backend\.env.example backend\.env
   copy frontend\.env.example frontend\.env
   ```

3. 在根目录安装依赖：

   ```bash
   npm install
   ```

4. 生成 Prisma Client 并执行迁移：

   ```bash
   npm run prisma:generate
   npm run prisma:migrate
   ```

5. 首次同步电影数据：

   ```bash
   npm run sync:movies
   ```

6. 启动前后端：

   ```bash
   npm run dev
   ```

   前端默认 `http://localhost:3000`，后端默认 `http://localhost:4000`。

## 测试步骤

1. 执行后端健康检查测试：

   ```bash
   npm test
   ```

2. 打开首页，确认“正在上映”“热门电影”“口碑推荐”均正常显示。
3. 注册新账号，进入任意电影详情页，提交评分与评论。
4. 修改一部电影评分后刷新页面，确认“本站评分”会更新。

## 部署步骤

### 前端部署到 Vercel

1. 在 Vercel 导入 `frontend/` 目录。
2. Build Command 设为 `npm run build`。
3. Output Directory 设为 `dist`。
4. 配置环境变量 `VITE_API_BASE_URL=https://your-backend-domain`。

### 后端部署到 Railway 或 Render

1. 部署 `backend/` 目录。
2. 设置启动命令 `npm start`。
3. 配置 `DATABASE_URL`、`JWT_SECRET`、`TMDB_API_KEY`、`CLIENT_ORIGIN`。
4. 部署后执行：

   ```bash
   npm run prisma:generate
   npm run prisma:deploy
   npm run sync:movies
   ```

5. 将前端域名写入 `CLIENT_ORIGIN`，例如 `https://your-frontend.vercel.app`。
