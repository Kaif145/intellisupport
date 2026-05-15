import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import Document from '../models/Document.js';
import protect from '../middleware/auth.js';
import { indexDocument, deleteCompanyIndex } from '../services/rag.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Multer config — save uploaded files to uploads/
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
  fileFilter: (req, file, cb) => {
    const allowed = ['.pdf', '.txt'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and TXT files allowed'));
    }
  }
});

// @route   POST /api/documents/upload
// @desc    Upload and index a document
// @access  Private
router.post('/upload', protect, upload.single('document'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const fileExt = path.extname(req.file.originalname).toLowerCase().replace('.', '');
    const companyId = req.company._id;

    // Save document record to MongoDB
    const document = await Document.create({
      company: companyId,
      filename: req.file.filename,
      originalName: req.file.originalname,
      fileType: fileExt,
      fileSize: req.file.size,
      status: 'processing'
    });

    // Index the document in background
    indexDocument(companyId, req.file.path, fileExt)
      .then(async (chunkCount) => {
        await Document.findByIdAndUpdate(document._id, {
          status: 'ready',
          chunkCount
        });
        console.log(`✅ Document indexed: ${req.file.originalname}`);
      })
      .catch(async (error) => {
        await Document.findByIdAndUpdate(document._id, {
          status: 'failed'
        });
        console.error('Indexing failed:', error);
      });

    res.status(201).json({
      success: true,
      message: 'Document uploaded and indexing started',
      document: {
        id: document._id,
        name: req.file.originalname,
        status: 'processing'
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   GET /api/documents
// @desc    Get all documents for a company
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const documents = await Document.find({ 
      company: req.company._id 
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: documents.length,
      documents: documents.map(doc => ({
        id: doc._id,
        name: doc.originalName,
        fileType: doc.fileType,
        fileSize: doc.fileSize,
        chunkCount: doc.chunkCount,
        status: doc.status,
        uploadedAt: doc.createdAt
      }))
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   DELETE /api/documents/:id
// @desc    Delete a document
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const document = await Document.findOne({
      _id: req.params.id,
      company: req.company._id
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }

    // Delete file from uploads folder
    const filePath = path.join(__dirname, '../uploads', document.filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Delete from MongoDB
    await Document.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Document deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

export default router;