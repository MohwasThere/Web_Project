import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

console.log("MONGO URI EXISTS:", !!MONGODB_URI);

if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI not found in .env');
    process.exit(1);
}

export const testConnection = async () => {
    try {
        console.log("🔌 Testing MongoDB connection...");
        console.log(`   URI: ${MONGODB_URI.replace(/:(.*)@/, ':****@')}`);

        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connection established!');

        const result = await mongoose.connection.db?.command({ ping: 1 });
        console.log(`   Ping response: ${JSON.stringify(result)}`);

        await mongoose.disconnect();
        console.log('🔌 Disconnected.\n✅ All tests passed!');

        process.exit(0);
    } catch (error: any) {
        console.error(`❌ Connection failed: ${error.message}`);
        process.exit(1);
    }
};

testConnection(); 