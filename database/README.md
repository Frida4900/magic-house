# 数据库说明

本项目使用 PostgreSQL 作为主数据库，表结构由 Prisma 管理。

核心表：

- `users`：用户账号与密码哈希
- `movies`：TMDB 同步的电影基础信息
- `ratings`：用户对电影的 1-10 分评分
- `comments`：用户评论

建议流程：

1. 先执行 `database/init.sql` 创建数据库。
2. 再进入根目录执行 `npm run prisma:generate` 与 `npm run prisma:migrate`。
3. 最后运行 `npm run sync:movies` 拉取 TMDB 数据。
