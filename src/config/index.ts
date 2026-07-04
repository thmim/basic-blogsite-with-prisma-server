import dotenv from "dotenv";
import path from "path";
dotenv.config({path:path.join(process.cwd(),".env")});

export default{
    port:process.env.PORT,
    database_url:process.env.DATABASE_URL,
    app_url:process.env.APP_URL,
    bcrypt_salt_round:process.env.BCRYPT_SALT_ROUND,
    jwt_acces_secret:process.env.JWT_ACCESS_SECRET!,
    jwt_refresh_secret:process.env.JWT_REFRESH_SECRET!,
    jwt_access_expires:process.env.JWT_ACCESS_EXPIRES,
    jwt_refresh_expires:process.env.JWT_REFRESH_EXPIRES,
    stripe_product_price_id:process.env.STRIPE_PRODUCT_PRICE_ID,
    stripe_secret_key:process.env.STRIPE_SECRET_KEY,
    stripe_secret_webhook:process.env.STRIPE_SECRET_WEBHOOK
}