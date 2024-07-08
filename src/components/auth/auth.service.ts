import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { IJwtPayloadUser, IUserModel } from "../../common/interfaces";
import { UserService } from "../user/user.service";

export class AuthService {
  private readonly userService: UserService;

  constructor() {
    this.userService = new UserService();
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
    const accessToken = jwt.sign(payload, process.env.TOKEN_SECRET_KEY!, {
      expiresIn: process.env.ACCESS_TOKEN_TIMEOUT,
    });
    const refreshToken: string = jwt.sign(
      { ...payload, refresh: true },
      process.env.TOKEN_SECRET_KEY!,
      { expiresIn: process.env.REFRESH_TOKEN_TIMEOUT }
    );
    return { accessToken, refreshToken };
  }

  async generateResetPasswordToken(user: IUserModel): Promise<string> {
    const payload: IJwtPayloadUser = {
      userId: user._id as string,
    };
    const resetPasswordToken = jwt.sign(
      payload,
      process.env.RESET_PASSWORD_SECRET_KEY!,
      {
        expiresIn: process.env.RESET_PASSWORD_TOKEN_TIMEOUT,
      }
    );
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
      const decoded = jwt.verify(
        token,
        process.env.TOKEN_SECRET_KEY!
      ) as IJwtPayloadUser;
      return decoded;
    } catch (error) {
      throw new Error("Invalid token");
    }
  }

  async decodeResetToken(token: string): Promise<IJwtPayloadUser | undefined> {
    try {
      const payload = jwt.verify(token, process.env.RESET_PASSWORD_SECRET_KEY!);
      if (typeof payload === "object" && "userId" in payload) {
        const user = await this.userService.getUserById(payload.userId);
        if (user !== null) {
          return payload as IJwtPayloadUser;
        }
      }
    } catch (error) {
      throw new Error(JSON.stringify(error));
    }
  }

  async resetPasswordToken(
    token: string,
    password: string
  ): Promise<IUserModel | null> {
    const payload = await this.decodeResetToken(token);
    const user = await this.userService.getUserById(payload!.userId);
    if (!user) {
      throw new Error("User not found !");
    }
    const hashPassword = await this.hashPassword(password);
    return await this.userService.updateUser({
      password: hashPassword,
      _id: user._id as string,
    });
  }
}
