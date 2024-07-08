import bcrypt from "bcryptjs";
import jwt, { Secret } from "jsonwebtoken";
import { IUserModel } from "../../common/interfaces";
import { UserService } from "../user/user.service";

export interface IJwtPayloadUser {
  userId: string;
}

export class AuthService {
  private readonly jwtSecret: Secret;

  constructor(private readonly userService: UserService) {
    this.jwtSecret = process.env.JWT_SECRET || "JWT_SECRET";
  }

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  async comparePasswords(user: IUserModel, password: string): Promise<boolean> {
    return bcrypt.compare(password, user.password);
  }

  generateToken(user: IUserModel): string {
    const userId = user._id as string;
    const payload: IJwtPayloadUser = { userId };
    return jwt.sign(payload, this.jwtSecret, { expiresIn: "1h" });
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
