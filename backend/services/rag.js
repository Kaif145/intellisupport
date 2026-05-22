import dotenv from 'dotenv';
dotenv.config();

import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ── Vector schema stored in MongoDB ──
const vectorSchema = new mongoose.Schema({
  companyId: { type: String, required: true, index: true },
  documentId: { type: String, required: true },
  chunkIndex: { type: Number, required: true },
  text: { type: String, required: true },
  vector: { type: [Number], required: true }
}, { timestamps: true });

const Vector = mongoose.models.Vector || mongoose.model('Vector', vectorSchema);

// ── Split text into chunks ──
const chunkText = (text, chunkSize = 500, overlap = 50) => {
  const chunks = [];
  let start = 0;
  while (start < text.length) {
    const end = Math.min(start + chunkSize, text.length);
    const chunk = text.slice(start, end).trim();
    if (chunk.length > 20) chunks.push(chunk);
    start += chunkSize - overlap;
  }
  return chunks;
};

// ── Local embedding function ──
const getEmbedding = (text) => {
  const words = text.toLowerCase().split(/\s+/);
  const vector = new Array(384).fill(0);
  words.forEach((word, i) => {
    for (let j = 0; j < word.length; j++) {
      vector[(word.charCodeAt(j) * (i + 1)) % 384] += 1;
    }
  });
  const magnitude = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
  return magnitude > 0 ? vector.map(v => v / magnitude) : vector;
};

// ── Cosine similarity ──
const cosineSimilarity = (a, b) => {
  let dot = 0, magA = 0, magB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    magA += a[i] * a[i];
    magB += b[i] * b[i];
  }
  return dot / (Math.sqrt(magA) * Math.sqrt(magB) || 1);
};

// ── Extract text from file ──
const extractText = async (filePath, fileType) => {
  if (fileType === 'pdf') {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(dataBuffer);
    return data.text;
  } else if (fileType === 'txt') {
    return fs.readFileSync(filePath, 'utf-8');
  }
  throw new Error('Unsupported file type');
};

// ── INDEX a document ──
const indexDocument = async (companyId, filePath, fileType, documentId) => {
  try {
    console.log(`📂 Starting indexing for company: ${companyId}`);
    console.log(`📄 File: ${filePath}, Type: ${fileType}`);

    const text = await extractText(filePath, fileType);
    console.log(`📝 Extracted text length: ${text.length} characters`);
    console.log(`📝 First 200 chars: ${text.slice(0, 200)}`);

    const chunks = chunkText(text);
    console.log(`📄 Processing ${chunks.length} chunks...`);

    // Delete old vectors for this document
    await Vector.deleteMany({ 
      companyId: companyId.toString(), 
      documentId: documentId.toString() 
    });

    // Insert new vectors
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      const vector = getEmbedding(chunk);
      await Vector.create({
        companyId: companyId.toString(),
        documentId: documentId.toString(),
        chunkIndex: i,
        text: chunk,
        vector
      });
      console.log(`✅ Indexed chunk ${i + 1}/${chunks.length}: ${chunk.slice(0, 50)}...`);
    }

    console.log(`🎉 Document fully indexed in MongoDB!`);
    return chunks.length;
  } catch (error) {
    console.error('❌ Indexing error:', error);
    throw error;
  }
};

// ── SEARCH documents ──
const searchDocuments = async (companyId, query, topK = 3) => {
  try {
    // Get all vectors for this company
    const allVectors = await Vector.find({ 
      companyId: companyId.toString() 
    });

    console.log(`🔍 Searching ${allVectors.length} vectors for company ${companyId}`);

    if (allVectors.length === 0) return [];

    // Embed query
    const queryVector = getEmbedding(query);

    // Calculate similarity scores
    const scored = allVectors.map(v => ({
      text: v.text,
      score: cosineSimilarity(queryVector, v.vector)
    }));

    // Sort by score descending
    scored.sort((a, b) => b.score - a.score);

    console.log('📊 Top scores:', scored.slice(0, 3).map(s => s.score.toFixed(3)));

    // Return top K results above threshold
    return scored
      .filter(s => s.score > 0.1)
      .slice(0, topK)
      .map(s => s.text);

  } catch (error) {
    console.error('Search error:', error);
    return [];
  }
};

// ── DELETE all vectors for a company document ──
const deleteDocumentVectors = async (companyId, documentId) => {
  try {
    await Vector.deleteMany({ 
      companyId: companyId.toString(),
      documentId: documentId.toString()
    });
    console.log(`🗑️ Deleted vectors for document ${documentId}`);
  } catch (error) {
    console.error('Delete vectors error:', error);
  }
};

// ── DELETE all vectors for a company ──
const deleteCompanyIndex = async (companyId) => {
  try {
    await Vector.deleteMany({ companyId: companyId.toString() });
    console.log(`🗑️ Deleted all vectors for company ${companyId}`);
  } catch (error) {
    console.error('Delete company index error:', error);
  }
};

export { indexDocument, searchDocuments, deleteDocumentVectors, deleteCompanyIndex };