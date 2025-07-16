import { envVariables } from "../../config/env";
import { IAuthProvider, IUser, Role } from "../modules/user/user.interface";
import { User } from "../modules/user/user.mode";
import bcrypt from "bcryptjs";

export const seedSuperAdmin = async () => {
  try {
    const isSuperUserExist = await User.findOne({
      email: envVariables.SUPER_USER_EMAIL,
    });

    if (isSuperUserExist) {
      console.log("Super user already exist.");
      return;
    }

    console.log("tying to create super admin");

    const authProvider: IAuthProvider = {
      provider: "credentials",
      providerId: envVariables.SUPER_USER_EMAIL,
    };

    const hashedPassword = await bcrypt.hash(
      envVariables.SUPER_USER_PASSWORD,
      Number(envVariables.BCRYPT_SALT_ROUND)
    );

    const payload: IUser = {
      name: "Super User",
      role: Role.SUPER_ADMIN,
      email: envVariables.SUPER_USER_EMAIL,
      isVerified: true,
      password: hashedPassword,
      auths: [authProvider],
    };

    const superAdmin = await User.create(payload);
    console.log("Super Admin create successfully.");

    console.log(superAdmin);
  } catch (error) {
    console.log(error);
  }
};
