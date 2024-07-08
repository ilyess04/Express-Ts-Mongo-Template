import bcrypt from "bcryptjs";
import jwt, { Secret } from "jsonwebtoken";
import { IUserModel } from "../../common/interfaces";
import { UserService } from "../user/user.service";

export interface IJwtPayloadUser {
  userId: string;
}

export class AuthService {
  private readonly jwtSecret: Secret;
  private readonly userService: UserService = new UserService();

  constructor() {
    this.jwtSecret = process.env.JWT_SECRET || "JWT_SECRET";
  }

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  async comparePasswords(user: IUserModel, password: string): Promise<boolean> {
    return bcrypt.compare(password, user.password);
  }

  generateToken(user: IUserModel): {
    accessToken: string;
    refreshToken: string;
  } {
    const userId = user._id as string;
    const payload: IJwtPayloadUser = { userId };
    const accessToken = jwt.sign(payload, this.jwtSecret, {
      expiresIn: process.env.ACCESS_TOKEN_TIMEOUT,
    });
    const refreshToken: string = jwt.sign(
      { ...payload, refresh: true },
      this.jwtSecret,
      { expiresIn: process.env.REFRESH_TOKEN_TIMEOUT }
    );
    return { accessToken, refreshToken };
  }

  async validateUser(
    email: string,
    password: string
  ): Promise<IUserModel | null> {
    const user = await this.userService.getUserByEmail(email);
    if (user && (await this.comparePasswords(user, password))) {
      return user;
    }
    return null;
  }

  async decodeToken(token: string): Promise<IJwtPayloadUser> {
    try {
      const decoded = jwt.verify(token, this.jwtSecret) as IJwtPayloadUser;
      return decoded;
    } catch (error) {
      throw new Error("Invalid token");
    }
  }
}
