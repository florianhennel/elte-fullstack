import express from "express";
import connectDb from "./db.ts";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
import process from "node:process";

import { User, UserInvalidToken, UserRefreshToken } from "./schema.ts";
const app = express();
const port = 3000;

connectDb();

app.use(express.json());

app.get(
  "/",
  (_req: express.Request, res: express.Response) => {
    res.send({ message: "Hello World!" });
  },
);
app.post("/login", async (req: express.Request, res: express.Response) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(422).json({
        message: "Please fill in all fields (username and password)",
      });
    }

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({
        message: "Username or password is invalid!",
      });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Email or password is invalid" });
    }

    const accessToken = jwt.sign({ userId: user._id }, process.env.secret, {
      subject: "accessApi",
      expiresIn: process.env.accessTokenExpiresIn,
    });

    const refreshToken = jwt.sign(
      { userId: user._id },
      process.env.refreshTokenSecret,
      { subject: "refreshToken", expiresIn: process.env.refreshTokenExpiresIn },
    );

    new UserRefreshToken({
      refreshToken,
      userId: user._id,
    }).save();

    return res.status(200).json({
      id: user._id,
      username: user.username,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
});

app.post("/register", async (req: express.Request, res: express.Response) => {
  try {
    const { username, password } = req.body;
    const hashedpassword = await bcrypt.hash(password, 10);

    if (!username || !password) {
      return res.status(422).json({
        message: "Please fill in all fields (username and password)",
      });
    }

    if (await User.findOne({ username })) {
      return res.status(409).json({ message: "Username is taken" });
    }

    const user = new User({ username, password: hashedpassword });
    await user.save();
    res.status(201).send({
      message: "User registered successfully",
      "user": user,
    });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
});

app.post("/refresh", async (req: express.Request, res: express.Response) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token not found" });
    }

    const decodedRefreshToken = jwt.verify(
      refreshToken,
      process.env.refreshTokenSecret,
    );

    const userRefreshToken = await UserRefreshToken.findOne({
      refreshToken,
      userId: decodedRefreshToken.userId,
    });

    if (!userRefreshToken) {
      return res.status(401).json({
        message: "Refresh token invalid or expired",
      });
    }

    await UserRefreshToken.deleteOne({ _id: userRefreshToken._id });

    const accessToken = jwt.sign(
      { userId: decodedRefreshToken.userId },
      process.env.accessTokenSecret,
      { subject: "accessApi", expiresIn: process.env.accessTokenExpiresIn },
    );

    const newRefreshToken = jwt.sign(
      { userId: decodedRefreshToken.userId },
      process.env.refreshTokenSecret,
      { subject: "refreshToken", expiresIn: process.env.refreshTokenExpiresIn },
    );

    await new UserRefreshToken({
      refreshToken: newRefreshToken,
      userId: decodedRefreshToken.userId,
    }).save();

    return res.status(200).json({
      accessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    if (
      error instanceof jwt.TokenExpiredError ||
      error instanceof jwt.JsonWebTokenError
    ) {
      return res.status(401).json({
        message: "Refresh token invalid or expired",
      });
    }

    return res.status(500).json({ message: error.message });
  }
});

app.get(
  "/api/auth/logout",
  isAuthenticated,
  async (req: express.Request, res: express.Response) => {
    try {
      await UserRefreshToken.deleteMany({ userId: req.user.id });

      await new UserInvalidToken({
        accessToken: req.accessToken.value,
        userId: req.user.id,
        expirationTime: req.accessToken.exp,
      }).save();

      return res.status(204).send();
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
);

app.get(
  "/profile",
  isAuthenticated,
  async (req: express.Request, res: express.Response) => {
    try {
      const user = await User.find({ _id: req.user.id });
      res.status(200).send(user);
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  },
);

async function isAuthenticated(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) {
  const accessToken = req.headers.authorization;

  if (!accessToken) {
    return res.status(401).json({ message: "Access token not found" });
  }
  if (await UserInvalidToken.findOne({ accessToken })) {
    return res.status(401).json({
      message: "Access token invalid",
      code: "AccessTokenInvalid",
    });
  }
  try {
    const decodedAccessToken = jwt.verify(accessToken, process.env.secret);

    req.accessToken = { value: accessToken, exp: decodedAccessToken.exp };
    req.user = { id: decodedAccessToken.userId };

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({
        message: "Access token expired",
        code: "AccessTokenExpired",
      });
    } else if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        message: "Access token invalid",
        code: "AccessTokenInvalid",
      });
    } else {
      return res.status(500).json({ message: error.message });
    }
  }
}

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
