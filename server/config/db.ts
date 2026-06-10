import mongoose from 'mongoose';

export async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('[MongoDB Error] MONGODB_URI is not defined in the environment variables.');
    return;
  }

  try {
    mongoose.connection.on('connected', () => {
      console.log('[ShootMate Database] Successfully connected to MongoDB Atlas cluster.');
    });

    mongoose.connection.on('error', (err) => {
      console.error('[ShootMate Database] MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('[ShootMate Database] MongoDB connection lost.');
    });

    await mongoose.connect(uri);
  } catch (err) {
    console.error('[ShootMate Database] Failed to initialize MongoDB connection:', err);
    process.exit(1);
  }
}
