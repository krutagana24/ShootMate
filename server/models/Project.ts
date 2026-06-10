import mongoose, { Schema, Document } from 'mongoose';

export interface IProject extends Document {
  id: string;
  title: string;
  date: string;
  creatorId: string;
  professionalId: string;
}

const ProjectSchema: Schema = new Schema({
  id: { type: String, required: true, unique: true, index: true },
  title: { type: String, required: true },
  date: { type: String, required: true },
  creatorId: { type: String, required: true, index: true },
  professionalId: { type: String, required: true, index: true }
});

export default mongoose.model<IProject>('Project', ProjectSchema);
