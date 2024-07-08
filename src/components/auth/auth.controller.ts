import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { UserService } from "../user/user.service";

export class AuthController {
  private readonly authService = new AuthService();
  private readonly userService = new UserService();

  async register(req: Request, res: Response) {
    try {
      const { firstname, lastname, email, password } = req.body;
      const hashedPassword = await this.authService.hashPassword(password);
      const user = await this.userService.createUser({
        firstname,
        lastname,
        email,
        password: hashedPassword,
      });

      res.status(201).json({
        message: "User created successfully!",
        user,
      });
    } catch (error) {
      res.status(500).json({ error });
    }
  }
}
