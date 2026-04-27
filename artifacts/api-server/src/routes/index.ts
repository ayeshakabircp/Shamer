import { Router, type IRouter } from "express";
import healthRouter from "./health";
import shameRouter from "./shame";

const router: IRouter = Router();
router.use(healthRouter);
router.use(shameRouter);

export default router;