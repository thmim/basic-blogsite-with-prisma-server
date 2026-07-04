import Stripe from "stripe";
import config from "../config";

// here stripe is a class thats why i use new to call it
export const stripe = new Stripe(config.stripe_secret_key as string)

