import { useState, useEffect, useRef } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import API from '../api/axios';
import toast from 'react-hot-toast';

const Documents = () => {
  const [documents, setDocuments] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef(null);

  // Fetch documents on load
  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const { data } = await API.get('/documents');
      setDocuments(data.documents);
    } catch (error) {
      toast.error('Failed to load documents');
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file type
    const ext = file.name.split('.').pop().toLowerCase();
    if (!['pdf', 'txt'].includes(ext)) {
      toast.error('Only PDF and TXT files allowed');
      return;
    }

    // Check file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File too large. Max 10MB');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('document', file);

    try {
      await API.post('/documents/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Document uploaded! Indexing started...');
      fetchDocuments();

      // Poll for status update after 10 seconds
      setTimeout(fetchDocuments, 10000);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
      fileInputRef.current.value = '';
    }
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete "${name}"?`)) return;
    try {
      await API.delete(`/documents/${id}`);
      toast.success('Document deleted');
      setDocuments(documents.filter(d => d.id !== id));
    } catch (error) {
      toast.error('Failed to delete document');
    }
  };

  const formatSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'ready':
        return { background: '#22c55e20', color: '#22c55e' };
      case 'processing':
        return { background: '#f59e0b20', color: '#f59e0b' };
      case 'failed':
        return { background: '#ef444420', color: '#ef4444' };
      default:
        return { background: 'var(--surface2)', color: 'var(--muted)' };
    }
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Documents</h1>
          <p style={styles.subtitle}>
            Upload your FAQs, policies and product docs — your bot learns from these
          </p>
        </div>
        <button
          onClick={() => fileInputRef.current.click()}
          disabled={uploading}
          style={{
            ...styles.uploadBtn,
            opacity: uploading ? 0.7 : 1
          }}
        >
          {uploading ? '⏳ Uploading...' : '+ Upload Document'}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.txt"
          onChange={handleUpload}
          style={{ display: 'none' }}
        />
      </div>

      {/* Info box */}
      <div style={styles.infoBox}>
        <span>💡</span>
        <span>
          Supported formats: <strong>PDF</strong> and <strong>TXT</strong> — 
          Max size: <strong>10MB</strong> — 
          The bot will answer questions using content from these documents
        </span>
      </div>

      {/* Documents list */}
      {loading ? (
        <div style={styles.empty}>Loading documents...</div>
      ) : documents.length === 0 ? (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>📄</div>
          <h3 style={styles.emptyTitle}>No documents yet</h3>
          <p style={styles.emptySub}>
            Upload your first document to train your chatbot
          </p>
          <button
            onClick={() => fileInputRef.current.click()}
            style={styles.uploadBtn}
          >
            + Upload Document
          </button>
        </div>
      ) : (
        <div style={styles.table}>
          {/* Table header */}
          <div style={styles.tableHeader}>
            <span style={{ flex: 3 }}>Name</span>
            <span style={{ flex: 1 }}>Type</span>
            <span style={{ flex: 1 }}>Size</span>
            <span style={{ flex: 1 }}>Chunks</span>
            <span style={{ flex: 1 }}>Status</span>
            <span style={{ flex: 1 }}>Uploaded</span>
            <span style={{ flex: 1 }}>Action</span>
          </div>

          {/* Table rows */}
          {documents.map((doc) => (
            <div key={doc.id} style={styles.tableRow}>
              <span style={{ flex: 3, ...styles.docName }}>
                <span style={styles.docIcon}>
                  {doc.fileType === 'pdf' ? '📕' : '📝'}
                </span>
                {doc.name}
              </span>
              <span style={{ flex: 1, color: 'var(--muted)', textTransform: 'uppercase', fontSize: '0.78rem' }}>
                {doc.fileType}
              </span>
              <span style={{ flex: 1, color: 'var(--muted)', fontSize: '0.85rem' }}>
                {formatSize(doc.fileSize)}
              </span>
              <span style={{ flex: 1, color: 'var(--muted)', fontSize: '0.85rem' }}>
                {doc.chunkCount}
              </span>
              <span style={{ flex: 1 }}>
                <span style={{
                  ...styles.statusBadge,
                  ...getStatusStyle(doc.status)
                }}>
                  {doc.status === 'processing' ? '⏳ ' : 
                   doc.status === 'ready' ? '✅ ' : '❌ '}
                  {doc.status}
                </span>
              </span>
              <span style={{ flex: 1, color: 'var(--muted)', fontSize: '0.85rem' }}>
                {formatDate(doc.uploadedAt)}
              </span>
              <span style={{ flex: 1 }}>
                <button
                  onClick={() => handleDelete(doc.id, doc.name)}
                  style={styles.deleteBtn}
                >
                  Delete
                </button>
              </span>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

const styles = {
  header: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: '1.5rem',
    flexWrap: 'wrap',
    gap: '1rem'
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: 'var(--text)',
    marginBottom: '0.25rem'
  },
  subtitle: {
    color: 'var(--muted)',
    fontSize: '0.9rem'
  },
  uploadBtn: {
    background: 'var(--accent)',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    padding: '0.7rem 1.25rem',
    fontSize: '0.875rem',
    fontWeight: '500',
    cursor: 'pointer'
  },
  infoBox: {
    background: 'rgba(99,102,241,0.1)',
    border: '1px solid rgba(99,102,241,0.25)',
    borderRadius: '10px',
    padding: '0.75rem 1rem',
    fontSize: '0.875rem',
    color: 'var(--muted)',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    marginBottom: '1.5rem'
  },
  empty: {
    color: 'var(--muted)',
    padding: '2rem 0'
  },
  emptyState: {
    textAlign: 'center',
    padding: '4rem 2rem',
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: '12px'
  },
  emptyIcon: {
    fontSize: '3rem',
    marginBottom: '1rem'
  },
  emptyTitle: {
    fontSize: '1.1rem',
    fontWeight: '600',
    color: 'var(--text)',
    marginBottom: '0.5rem'
  },
  emptySub: {
    color: 'var(--muted)',
    fontSize: '0.875rem',
    marginBottom: '1.5rem'
  },
  table: {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: '12px',
    overflow: 'hidden'
  },
  tableHeader: {
    display: 'flex',
    padding: '0.75rem 1.25rem',
    borderBottom: '1px solid var(--border)',
    fontSize: '0.78rem',
    fontWeight: '500',
    color: 'var(--muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  },
  tableRow: {
    display: 'flex',
    alignItems: 'center',
    padding: '1rem 1.25rem',
    borderBottom: '1px solid var(--border)',
    transition: 'background 0.2s',
    fontSize: '0.875rem'
  },
  docName: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: 'var(--text)',
    fontWeight: '500',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },
  docIcon: {
    fontSize: '1rem',
    flexShrink: 0
  },
  statusBadge: {
    display: 'inline-block',
    padding: '3px 8px',
    borderRadius: '6px',
    fontSize: '0.78rem',
    fontWeight: '500'
  },
  deleteBtn: {
    background: 'rgba(239,68,68,0.1)',
    color: '#ef4444',
    border: '1px solid rgba(239,68,68,0.2)',
    borderRadius: '6px',
    padding: '4px 10px',
    fontSize: '0.78rem',
    cursor: 'pointer'
  }
};

export default Documents;