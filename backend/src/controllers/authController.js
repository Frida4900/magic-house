const prisma = require("../lib/prisma");
const { hashPassword, comparePassword } = require("../utils/password");
const { signToken } = require("../utils/jwt");

function sanitizeUser(user) {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    createdAt: user.createdAt
  };
}

async function register(req, res, next) {
  try {
    const { username, email, password } = req.body;

    if (!username || username.trim().length < 2) {
      return res.status(400).json({ message: "用户名至少需要 2 个字符。" });
    }

    if (!email || !email.includes("@")) {
      return res.status(400).json({ message: "请输入有效邮箱地址。" });
    }

    if (!password || password.length < 6) {
      return res.status(400).json({ message: "密码至少需要 6 位。" });
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }]
      }
    });

    if (existingUser) {
      return res.status(409).json({ message: "用户名或邮箱已被使用。" });
    }

    const user = await prisma.user.create({
      data: {
        username: username.trim(),
        email: email.trim().toLowerCase(),
        passwordHash: await hashPassword(password)
      }
    });

    const token = signToken(user);

    return res.status(201).json({
      message: "注册成功。",
      token,
      user: sanitizeUser(user)
    });
  } catch (error) {
    return next(error);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "请输入邮箱和密码。" });
    }

    const user = await prisma.user.findUnique({
      where: {
        email: email.trim().toLowerCase()
      }
    });

    if (!user) {
      return res.status(401).json({ message: "邮箱或密码不正确。" });
    }

    const isPasswordValid = await comparePassword(password, user.passwordHash);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "邮箱或密码不正确。" });
    }

    const token = signToken(user);

    return res.json({
      message: "登录成功。",
      token,
      user: sanitizeUser(user)
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  register,
  login
};

