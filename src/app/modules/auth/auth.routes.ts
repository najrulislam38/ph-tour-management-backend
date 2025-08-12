import { NextFunction, Request, Response, Router } from "express";
import { AuthControllers } from "./auth.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../user/user.interface";
import passport from "passport";
import { envVariables } from "../../../config/env";

const router = Router();

router.post("/login", AuthControllers.credentialLogin);
router.post("/refresh-token", AuthControllers.getNewAccessToken);
router.post("/logout", AuthControllers.logout);
router.post(
  "/change-password",
  checkAuth(...Object.values(Role)),
  AuthControllers.changePassword
);
router.post(
  "/reset-password",
  checkAuth(...Object.values(Role)),
  AuthControllers.resetPassword
);
router.post(
  "/set-password",
  checkAuth(...Object.values(Role)),
  AuthControllers.setPassword
);
router.post("/forget-password", AuthControllers.forgetPassword);
// Frontend -> forget-password -> email -> user status check -> short expiration token (valid for 10 min) -> email -> Fronted Link http://localhost:5173/reset-password?email=saminisrar1@gmail.com&token=token -> frontend e  query theke user er email and token extract anbo -> new password user theke nibe -> backend er /reset-password api -> authorization = token -> newPassword -> token verify -> password hash -> save user password

// google routes
router.get(
  "/google",

  async (req: Request, res: Response, next: NextFunction) => {
    const redirect = req.query.redirect || "/";
    passport.authenticate("google", {
      scope: ["profile", "email"],
      state: redirect as string,
    })(req, res, next);
  }
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${envVariables.FRONTEND_URL}/login?error=There is some issus with your account. Please contact with out support team!`,
  }),
  AuthControllers.googleCallbackController
);

export const AuthRoutes = router;
