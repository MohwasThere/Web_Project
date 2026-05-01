import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { connectToDatabase } from "../../database/mongoose";
import { nextCookies } from "better-auth/next-js";

let authinstance: ReturnType<typeof betterAuth> | null = null;

export const getAuth = async() => {
    if(authinstance) return authinstance;

    const mongoose = await connectToDatabase();
    const db = mongoose.connection.db;


    if(!db) throw new Error("MongoDB connection not Found");

    authinstance = betterAuth({
        database: mongodbAdapter(db as any),

        secret: process.env.BETTER_AUTH_SECRET,
        baseURL:process.env.BETTER_AUTH_URK,
        emailAndPassword: {
            enabled: true,
            disableSignUp: false,
            requireEmailVerification: false,
            minPasswordLength: 8,
            maxPasswordLength: 128,
            autoSignIn: true,
        },
        plugins: [nextCookies()],
    });

    return authinstance;
}

export const auth = await getAuth();