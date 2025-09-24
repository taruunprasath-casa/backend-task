import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const SECRET = process.env.SECRET;

export interface AuthRequest extends Request {
  user?: any;
}

export const auth = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && (authHeader as string).split(" ")[1];

  if (!token) return res.status(401).json({ message: "No token provided" });

  jwt.verify(token, SECRET as string, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Invalid token" });

    req.user = decoded;
    next();
  });
};
