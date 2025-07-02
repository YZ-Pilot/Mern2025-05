import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { s3 } from '../config/s3.js';
import File from '../models/File.js';

const BUCKET = process.env.S3_BUCKET_NAME;

export const uploadFile = async (req, res) => {
  const file = req.file;
  if (!file) return res.status(400).json({ message: 'No file uploaded' });

  const fileKey = `${uuidv4()}-${file.originalname}`;
  const fileStream = fs.createReadStream(file.path);

  try {
    await s3.send(
      new PutObjectCommand({
        Bucket: BUCKET,
        Key: fileKey,
        Body: fileStream,
        ContentType: file.mimetype,
      })
    );
    fs.unlinkSync(file.path);

    const savedFile = await File.create({
      originalName: file.originalname,
      key: fileKey,
      userId: req.body.userId,
    });

    res.json(savedFile);
  } catch (err) {
    console.error('Upload failed:', err);
    res.status(500).json({ message: 'Upload failed', error: err.message });
  }
};

export const getFiles = async (req, res) => {
  const files = await File.find();
  res.json(files);
};

export const deleteFile = async (req, res) => {
  const file = await File.findById(req.params.id);
  if (!file) return res.status(404).json({ message: 'Not found' });

  try {
    await s3.send(
      new DeleteObjectCommand({
        Bucket: BUCKET,
        Key: file.key,
      })
    );
    await File.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Delete failed', error: err.message });
  }
};
