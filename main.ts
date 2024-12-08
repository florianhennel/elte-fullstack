import express from "express";
import connectDB from "./db.ts";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import cors from 'cors';
dotenv.config();
import process from "node:process";
import cookieParser from "cookie-parser";
import { Card, Enemy, Item, Level, User, UserInvalidToken, UserRefreshToken } from "./schema.ts";
import { seedCards, seedEnemies, seedItems, seedLevels } from "./seed.ts";
const app = express();
const port = 3000;

connectDB().then(async () => {
  if (await Card.countDocuments() === 0) {
    seedCards();
  }
  if (await Enemy.countDocuments() === 0) {
    seedEnemies();
  }
  if (await Level.countDocuments() === 0) {
    seedLevels();
  }
  if (await Item.countDocuments() === 0) {
    seedItems();
  }
});
app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.get("/",(_req: express.Request, res: express.Response) => {
  console.log("/get request");
  res.send({ message: "Hello World!" });
});
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

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 30 * 60 * 1000, // Match access token expiration
    });

    return res.status(200).json({
      id: user._id,
      username: user.username,
      accessToken,
      refreshToken,
    });
  } catch (error: any) {
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
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(500).send({ message: error.message });
    } else {
      return res.status(500).send({ message: "Unknown error" });
    }
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
  } catch (error: unknown) {
    if (
      error instanceof jwt.TokenExpiredError ||
      error instanceof jwt.JsonWebTokenError
    ) {
      return res.status(401).json({
        message: "Refresh token invalid or expired",
      });
    } else if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    } else {
      return res.status(500).json({ message: "Unknown error" });
    }
  }
});
app.get("/api/auth/logout", isAuthenticated, async (req: express.Request, res: express.Response) => {
  try {
    await UserRefreshToken.deleteMany({ userId: req.user.id });

    await new UserInvalidToken({
      accessToken: req.accessToken.value,
      userId: req.user.id,
      expirationTime: req.accessToken.exp,
    }).save();

    return res.status(204).send();
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(500).send({ message: error.message });
    } else {
      return res.status(500).send({ message: "Unknown error" });
    }
  }
});
app.get("/profile", isAuthenticated, async (req: express.Request, res: express.Response) => {
  try {
    const user = await User.find({ _id: req.user.id });
    res.status(200).send(user);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(500).send({ message: error.message });
    } else {
      return res.status(500).send({ message: "Unknown error" });
    }
  }
});
app.get("/users", async (_req: express.Request, res: express.Response) => {
  try {
    const users = await User.find();
    res.status(200).send(users);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(500).send({ message: error.message });
    } else {
      return res.status(500).send({ message: "Unknown error" });
    }
  }
});
app.get("/cards", isAuthenticated, async (req: express.Request, res: express.Response) => {
    try {
      const cards = await Card.find(req.query);
      res.status(200).send(cards);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return res.status(500).send({ message: error.message });
      } else {
        return res.status(500).send({ message: "Unknown error" });
      }
    }
  },
);
app.get("/cards/:id", isAuthenticated, async (req: express.Request, res: express.Response) => {
  try {
    const cards = await Card.findOne({ _id: req.params.id });
    res.status(200).send(cards);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(500).send({ message: error.message });
    } else {
      return res.status(500).send({ message: "Unknown error" });
    }
  }
});
app.get("/enemies", isAuthenticated, async (req: express.Request, res: express.Response) => {
  try {
    const enemies = await Enemy.find(req.query);
    res.status(200).send(enemies);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(500).send({ message: error.message });
    } else {
      return res.status(500).send({ message: "Unknown error" });
    }
  }
});
app.get("/enemies/:id", isAuthenticated, async (req: express.Request, res: express.Response) => {
  try {
    const enemies = await Enemy.findOne({ _id: req.params.id });
    res.status(200).send(enemies);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(500).send({ message: error.message });
    } else {
      return res.status(500).send({ message: "Unknown error" });
    }
  }
});
app.get("/levels", isAuthenticated, async (req: express.Request, res: express.Response) => {
  try {
    const levels = await Level.find(req.query);
    res.status(200).send(levels);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(500).send({ message: error.message });
    } else {
      return res.status(500).send({ message: "Unknown error" });
    }
  }
});
app.get("/levels/:id", isAuthenticated, async (req: express.Request, res: express.Response) => {
  try {
    const level = await Level.findOne({ _id: req.params.id });
    if (!level) {
      return res.status(404).send({ message: "Level not found" });
    }
    res.status(200).send(level);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(500).send({ message: error.message });
    } else {
      return res.status(500).send({ message: "Unknown error" });
    }
  }
});
app.get("/items/all", isAuthenticated, async (req: express.Request, res: express.Response) => {
  try {
    const items = await Item.find(req.query);
    res.status(200).send(items);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(500).send({ message: error.message });
    } else {
      return res.status(500).send({ message: "Unknown error" });
    }
  }
});
app.get("/items/:id", isAuthenticated, async (req: express.Request, res: express.Response) => {
  try {
    const item = await Item.findOne({ _id: req.params.id });
    if (!item) {
      return res.status(404).send({ message: "Item not found" });
    }
    res.status(200).send(item);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(500).send({ message: error.message });
    } else {
      return res.status(500).send({ message: "Unknown error" });
    }
  }
});
app.get("/items", isAuthenticated, async (req: express.Request, res: express.Response) => {
  try {
    const user = await User.findOne({ _id: req.user.id });
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    const items = await Item.find({ userId: user._id });
    res.status(200).send(items);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(500).send({ message: error.message });
    } else {
      return res.status(500).send({ message: "Unknown error" });
    }
  }
});
app.post("/items", isAuthenticated, async (req: express.Request, res: express.Response) => {
  try {
    const user = await User.findOne({ _id: req.user.id });
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    const item = await Item.findOne({ _id: req.body.itemId });
    if (item) {
      item.userId = user._id;
      await item.save();
      res.status(201).send(item);
    } else {
      res.status(404).send({ message: "Item not found" });
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(500).send({ message: error.message });
    } else {
      return res.status(500).send({ message: "Unknown error" });
    }
  }
});

async function isAuthenticated(req: express.Request, res: express.Response,next: express.NextFunction) {
  const accessToken: string = req.headers.authorization?.split(" ")[1];

  const cookieToken: string = req.cookies.accessToken;

  const token = accessToken || cookieToken;

  if (!token) {
    return res.status(401).json({ message: "Access token not found" });
  }
  if (await UserInvalidToken.findOne({ token })) {
    return res.status(401).json({
      message: "Access token invalid",
      code: "AccessTokenInvalid",
    });
  }
  try {
    const decodedAccessToken = jwt.verify(token, process.env.secret);

    req.accessToken = { value: token, exp: decodedAccessToken.exp };
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
    } else if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    } else {
      return res.status(500).json({ message: "Unknown error" });
    }
  }
}
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
