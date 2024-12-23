import { Request, Response } from 'express';
import { login, register, logout } from '../services/AuthService';
import { Logger } from '../utils/logger';

const logger = Logger.getInstance();

export class AuthController {

  public login = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;
      const token = await login(email, password);
      res.json({ success: true, message: 'Login successful', token });
    } catch (error) {
      logger.error('Login failed:', error);
      res.status(401).json({ success: false, error: 'Invalid credentials' });
    }
  };

  public register = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password, name, age, bmi } = req.body;
      await register({
        email,
        password,
        name,
        age,
        bmi,
        isAdmin: false
      });
      res.status(201).json({ success: true, message: 'User registered successfully' });
    } catch (error) {
      logger.error('Registration failed:', error);
      console.log(error)
      res.status(400).json({ success: false, error: 'Registration failed' });
    }
  };



  public logout = async (req: Request, res: Response): Promise<void> => {
    try {
      const { token } = req.body;
      await logout(token);
      res.json({ success: true, message: 'Logged out successfully' });
    } catch (error) {
      logger.error('Logout failed:', error);
      res.status(400).json({ success: false,error: 'Failed to logout' });
    }
  };
}