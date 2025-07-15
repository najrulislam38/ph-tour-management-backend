import { Router } from "express";
import { UserRoutes } from "../modules/user/user.route";

export const router = Router();

const moduleRoutes = [
  {
    path: "/user",
    route: UserRoutes,
  },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

// app.use("/user", UserRoutes)
// app.use("/tour", TourRoutes)
// app.use("/booking", BookingRoutes)
