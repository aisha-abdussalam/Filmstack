// import { PrismaClient } from "@prisma/client";
import { PrismaClient } from '../generated/client/index.js';

const prisma = new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"]
});

// Connect to database
const connectDB = async () => {
    try {
        await prisma.$connect();
        console.log("DB connected via prisma");
    } catch (error) {
        console.error(`Database connection error: ${error.message}`);
        process.exit(1) // stop the node js and tell our system it stopped because of an error
    }
}

const disconnectDB = async () => {
    await prisma.$disconnect();
}

export { prisma, connectDB, disconnectDB };