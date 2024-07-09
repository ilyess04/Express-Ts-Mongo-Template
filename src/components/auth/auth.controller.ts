import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { UserService } from "../user/user.service";
import EmailService from "../../common/email/email.service";
import { IJwtRequest } from "../../common/interfaces";

export class AuthController {
  private readonly authService: AuthService;
  private readonly userService: UserService;
  private readonly emailService: EmailService;

  constructor() {
    this.authService = new AuthService();
    this.userService = new UserService();
    this.emailService = new EmailService();
  }

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
      return res.status(500).json({ error });
    }
  }
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const user = await this.userService.getUserByEmail(email);
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
      return res.status(500).json({ error });
    }
  }
  async forgotPassword(req: Request, res: Response) {
    try {
      const { email } = req.body;
      const user = await this.userService.getUserByEmail(email);
      if (!user) {
        return res.status(401).send({
          message: "user unauthorized!",
        });
      }
      const resetPasswordToken =
        await this.authService.generateResetPasswordToken(user);
      const context = {
        url: process.env.FRONTEND_HOST + "/resetpassword/" + resetPasswordToken,
      };
      this.emailService.sendEmail({
        to: user.email,
        subject: "reset password",
        template: "resetPasswordTemplate",
        context,
      });
      return res.status(200).send({
        message: "resetpassword email has been sent successfuly!",
      });
    } catch (error) {
      return res.status(500).json({ error });
    }
  }
  async resetPassword(req: Request, res: Response) {
    try {
      const { password, confirmPassword } = req.body;
      const { token } = req.params;
      if (password === confirmPassword) {
        await this.authService.resetPasswordToken(token, confirmPassword);
        return res.status(200).json({
          message: "password changed successfuly!",
        });
      } else {
        return res.status(400).json({
          message: "passwords not matching!",
        });
      }
    } catch (error) {
      return res.status(500).json({ error });
    }
  }
  async refreshToken(req: IJwtRequest | any, res: Response) {
    try {
      const user = req.user;
      const { accessToken, refreshToken } =
        this.authService.generateToken(user);
      return res.status(200).json({
        accessToken,
        refreshToken,
      });
    } catch (error) {
      return res.status(500).json({ error });
    }
  }
}
