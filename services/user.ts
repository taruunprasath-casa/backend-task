import { UserData } from "../interfaces/user";
import { User } from "../models/User";

class UserService {
  async createUser(user: UserData) {
    return await User.create(user);
  }
  async getAllUsers() {
    return await User.findAll();
  }
  async getUserById(id: number): Promise<any> {
    return await User.findByPk(id);
  }
  async updateUser(id: number, data: UserData) {
    const user = await User.findByPk(id);
    if (!user) throw new Error("User Not Found");
    return await user.update(data);
  }
  async deleteUser(id: number) {
    const user = await User.findByPk(id);
    if (!user) throw new Error("User Not Found");
    await user.destroy();
    return true;
  }
}

export default new UserService();
