import { Router } from "express";
import user from "../controllers/user";

const router = Router();

router.post("/register", user.createUser);

router.post("/login", user.userLogin);

router.get("/", user.getAllUsers);

router.get("/:id", user.getUserById);

router.put("/:id", user.updateUser);

router.delete("/:id", user.deleteUser);

export default router;
