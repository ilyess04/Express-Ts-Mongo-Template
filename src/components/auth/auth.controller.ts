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

      return res.status(201).json({
        message: "User created successfully!",
        user,
      });
    } catch (error) {
      res.status(500).json({ error });
    }
  }
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const user = await this.userService.getUserByEmail(email);
      console.log(user)
      const verifPassword = await this.authService.decodePassword(
        user!,
        password
      );
      if (!user || !verifPassword) {
        return res.status(400).json({
          message: "unothorized",
        });
      }
      const { accessToken, refreshToken } =
        this.authService.generateToken(user);
      return res.status(200).json({
        user: user,
        accessToken: accessToken,
        refreshToken: refreshToken,
      });
    } catch (error) {
      res.status(500).json({ error });
    }
  }
}
