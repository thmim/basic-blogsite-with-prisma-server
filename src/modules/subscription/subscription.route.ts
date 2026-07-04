import { Router } from "express";
import { subscriptionController } from "./subscription.controller";
import { auth } from "../../middleware/auth";
import { Role } from "../../../generated/prisma/enums";

const route = Router();

route.post("/checkout", auth(Role.ADMIN,Role.USER,Role.MODERATOR) ,subscriptionController.createSubscription);

route.post("/webhooks", subscriptionController.handleWebhook);

export const subscriptionRoute = route;