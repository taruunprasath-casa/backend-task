import userValidator from "../validators/user";
import user from "../services/user";
import type { Request, Response } from "express";
import { User } from "../models/User";
import jwt from "jsonwebtoken";

const createUser = async (req: Request, res: Response) => {
  try {
    const userData = userValidator.userData.parse(req.body);

    const { name, email, password } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({ message: "Credentials are Mandatory" });
    }

    const exists = await User.findOne({ where: { email } });
    if (exists) {
      return res.status(409).json({ message: "User already exisits" });
    }
    const newUser = await User.create(userData);

    return res.status(200).json({
      name: newUser.name,
      email: newUser.email,
      password: newUser.password,
    });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ message: err?.message });
  }
};

const userLogin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "email & password required" });

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const match = await user.verifyPassword(password);
    if (!match) return res.status(401).json({ message: "Invalid credentials" });

    const payload = { id: user.id, email: user.email };

    console.log("SECRET", process.env.SECRET);
    const token = jwt.sign(payload, process.env.SECRET as string, {
      expiresIn: "2w",
    });
    console.log("Auth Token: ", token);
    return res.json({ token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

const getAllUsers = async (_req: Request, res: Response) => {
  try {
    const users = await user.getAllUsers();
    res.json(users);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ error: message });
  }
};

const getUserById = async (req: Request, res: Response) => {
  try {
    const users = await user.getUserById(Number(req.params.id));
    res.status(200).json(users);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ error: message });
  }
};

const updateUser = async (req: Request, res: Response) => {
  try {
    const updated = await user.updateUser(Number(req.params.id), req.body);
    res.json(updated);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(400).json({ error: message });
  }
};

const deleteUser = async (req: Request, res: Response) => {
  try {
    await user.deleteUser(Number(req.params.id));
    res.json({ message: "User Deleted successfully" });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(400).json({ error: message });
  }
};

export default {
  createUser,
  userLogin,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
