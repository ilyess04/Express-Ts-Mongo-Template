import bcrypt from "bcryptjs";
import jwt, { Secret } from "jsonwebtoken";
import { IJwtPayloadUser, IUserModel } from "../../common/interfaces";
import { UserService } from "../user/user.service";

export class AuthService {
  private readonly jwtSecret: Secret;
  private readonly userService: UserService = new UserService();

  constructor() {
    this.jwtSecret = process.env.JWT_SECRET || "JWT_SECRET";
  }

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  async decodePassword(user: IUserModel, password: string): Promise<boolean> {
    let match = false;
    match = user && (await bcrypt.compare(password, user.password));
    return match;
  }

  async comparePasswords(user: IUserModel, password: string): Promise<boolean> {
    return bcrypt.compare(password, user.password);
  }

  generateToken(user: IUserModel): {
    accessToken: string;
    refreshToken: string;
  } {
    const payload: IJwtPayloadUser = { userId: user._id as string };
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

  async generateResetPasswordToken(user: IUserModel): Promise<string> {
    const payload: IJwtPayloadUser = { userId: user._id as string };
    const resetPasswordToken = jwt.sign(payload, this.jwtSecret, {
      expiresIn: process.env.RESET_PASSWORD_TOKEN_TIMEOUT,
    });
    return resetPasswordToken;
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
