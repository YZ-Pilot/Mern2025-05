import mongoose from 'mongoose';

const fileSchema = new mongoose.Schema({
  originalName: String,
  key: String,
  userId: String,
  uploadedAt: { type: Date, default: Date.now },
});

export default mongoose.model('File', fileSchema);
