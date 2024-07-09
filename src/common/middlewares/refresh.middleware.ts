import { Request, Response, NextFunction } from "express";
import { IJwtPayloadUser } from "../interfaces";
import jwt from "jsonwebtoken";
import { UserService } from "../../components/user/user.service";

const refreshMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Authentication token missing" });
    }
    const { userId, refresh } = jwt.verify(
      token,
      process.env.TOKEN_SECRET_KEY!
    ) as IJwtPayloadUser;

    const userService = new UserService();
    const user = await userService.getUserById(userId);
    if (!user || !refresh) {
      return res.status(401).json({ message: "Invalid authentication token" });
    }
    (req as any).user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid authentication token" });
  }
};

export default refreshMiddleware;
