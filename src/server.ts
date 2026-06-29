import app from "./app";
import config from "./config";
import { prisma } from "./lib/prisma";
import "dotenv/config";
async function main(){
    const port = config.port;
    try {
await prisma.$connect();
console.log("db connected sucessfully")
        app.listen(port,()=>{
            console.log(`server is running on port:${port}`)

        })
        
    } catch (error) {
        console.log("error hocce",error)
        await prisma.$disconnect()
        process.exit(1);
    }
}
main();
