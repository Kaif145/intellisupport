import { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const EmbedCode = () => {
  const { company } = useAuth();
  const [copied, setCopied] = useState(false);

  const embedCode = `<!-- IntelliSupport Chatbot Widget -->
<script>
  (function() {
    window.IntelliSupportConfig = {
      companyId: '${company?.id}'
    };
    var script = document.createElement('script');
    script.src = 'http://localhost:5173/widget.js';
    script.async = true;
    document.head.appendChild(script);
  })();
</script>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    toast.success('Embed code copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <DashboardLayout>
      <div style={styles.header}>
        <h1 style={styles.title}>Embed Code</h1>
        <p style={styles.subtitle}>
          Add your chatbot to any website with one snippet
        </p>
      </div>

      {/* Steps */}
      <div style={styles.stepsRow}>
        {[
          { num: '1', title: 'Copy the code', desc: 'Click the copy button below' },
          { num: '2', title: 'Open your website', desc: 'Go to your HTML file or CMS' },
          { num: '3', title: 'Paste before </body>', desc: 'Add the code to your page' },
          { num: '4', title: 'Go live!', desc: 'Your chatbot appears instantly' }
        ].map((step) => (
          <div key={step.num} style={styles.stepCard}>
            <div style={styles.stepNum}>{step.num}</div>
            <div style={styles.stepTitle}>{step.title}</div>
            <div style={styles.stepDesc}>{step.desc}</div>
          </div>
        ))}
      </div>

      {/* Code block */}
      <div style={styles.codeCard}>
        <div style={styles.codeHeader}>
          <span style={styles.codeLabel}>Your embed code</span>
          <button
            onClick={handleCopy}
            style={styles.copyBtn}
          >
            {copied ? '✅ Copied!' : '📋 Copy Code'}
          </button>
        </div>
        <pre style={styles.codeBlock}>
          {embedCode}
        </pre>
      </div>

      {/* Company ID info */}
      <div style={styles.infoCard}>
        <div style={styles.infoRow}>
          <span style={styles.infoLabel}>Your Company ID</span>
          <code style={styles.infoValue}>{company?.id}</code>
        </div>
        <div style={styles.infoRow}>
          <span style={styles.infoLabel}>Bot Name</span>
          <span style={styles.infoValue}>{company?.botName}</span>
        </div>
        <div style={styles.infoRow}>
          <span style={styles.infoLabel}>Bot Color</span>
          <div style={styles.colorPreview}>
            <div style={{
              width: '16px',
              height: '16px',
              borderRadius: '50%',
              background: company?.botColor
            }}></div>
            <span style={styles.infoValue}>{company?.botColor}</span>
          </div>
        </div>
      </div>

      {/* Test section */}
      <div style={styles.testCard}>
        <h2 style={styles.testTitle}>🧪 Test your chatbot</h2>
        <p style={styles.testDesc}>
          Open a new browser tab and go to your website after adding the embed code.
          Your chatbot should appear as a floating bubble in the bottom right corner.
        </p>
        <div style={styles.testTip}>
          💡 <strong>Tip for demo:</strong> Create a simple HTML file, paste the embed
          code, open it in your browser — your chatbot will appear instantly!
        </div>
      </div>
    </DashboardLayout>
  );
};

const styles = {
  header: { marginBottom: '1.5rem' },
  title: { fontSize: '1.5rem', fontWeight: '600', color: 'var(--text)', marginBottom: '0.25rem' },
  subtitle: { color: 'var(--muted)', fontSize: '0.9rem' },
  stepsRow: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem', marginBottom: '1.5rem' },
  stepCard: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '1.25rem', textAlign: 'center' },
  stepNum: { width: '32px', height: '32px', borderRadius: '50%', background: 'var(--accent)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '600', fontSize: '0.9rem', margin: '0 auto 0.75rem' },
  stepTitle: { fontSize: '0.875rem', fontWeight: '600', color: 'var(--text)', marginBottom: '0.25rem' },
  stepDesc: { fontSize: '0.78rem', color: 'var(--muted)' },
  codeCard: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden', marginBottom: '1.5rem' },
  codeHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1.25rem', borderBottom: '1px solid var(--border)', background: 'var(--surface2)' },
  codeLabel: { fontSize: '0.85rem', fontWeight: '500', color: 'var(--text)' },
  copyBtn: { background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '6px', padding: '0.4rem 0.85rem', fontSize: '0.8rem', fontWeight: '500', cursor: 'pointer' },
  codeBlock: { padding: '1.25rem', fontSize: '0.8rem', color: '#a5f3fc', lineHeight: 1.7, overflowX: 'auto', margin: 0, background: '#0d1117' },
  infoCard: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '1.25rem', marginBottom: '1.5rem' },
  infoRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.6rem 0', borderBottom: '1px solid var(--border)' },
  infoLabel: { fontSize: '0.85rem', color: 'var(--muted)' },
  infoValue: { fontSize: '0.85rem', color: 'var(--text)', fontFamily: 'monospace' },
  colorPreview: { display: 'flex', alignItems: 'center', gap: '8px' },
  testCard: { background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '12px', padding: '1.5rem' },
  testTitle: { fontSize: '1rem', fontWeight: '600', color: 'var(--text)', marginBottom: '0.5rem' },
  testDesc: { fontSize: '0.875rem', color: 'var(--muted)', lineHeight: 1.6, marginBottom: '1rem' },
  testTip: { fontSize: '0.85rem', color: 'var(--text)', background: 'var(--surface)', borderRadius: '8px', padding: '0.75rem 1rem', lineHeight: 1.6 }
};

export default EmbedCode;