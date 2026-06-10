import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  id: string;
  email: string;
  password?: string; // Hashed password, optional for Google login users
  name: string;
  role: 'creator' | 'professional';
  phone: string; // Mobile Number
  country: string;
  city: string;
  photoUrl: string; // Profile Photo
  professions?: string[]; // Profession Type (Cameraman, Videographer, Photographer, Video Editor)
  rating: number; // Rating
  projectsCompleted: number; // Total Projects
}

const UserSchema: Schema = new Schema({
  id: { type: String, required: true, unique: true, index: true },
  email: { type: String, required: true, unique: true, index: true, lowercase: true, trim: true },
  password: { type: String },
  name: { type: String, required: true },
  role: { type: String, enum: ['creator', 'professional'], required: true },
  phone: { type: String, default: '' },
  country: { type: String, default: '' },
  city: { type: String, default: '' },
  photoUrl: { type: String, default: '' },
  professions: { type: [String], default: [] },
  rating: { type: Number, default: 5.0 },
  projectsCompleted: { type: Number, default: 0 }
});

export default mongoose.model<IUser>('User', UserSchema);
