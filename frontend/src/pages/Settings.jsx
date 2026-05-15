import { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import toast from 'react-hot-toast';

const Settings = () => {
  const { company, updateCompany } = useAuth();
  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const [botForm, setBotForm] = useState({
    name: company?.name || '',
    botName: company?.botName || '',
    botColor: company?.botColor || '#6366f1',
    welcomeMessage: company?.welcomeMessage || ''
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleBotChange = (e) => {
    setBotForm({ ...botForm, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
  };

  const handleBotSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await API.put('/settings/bot', botForm);
      updateCompany(data.company);
      toast.success('Settings updated!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setPasswordLoading(true);
    try {
      await API.put('/settings/password', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });
      toast.success('Password updated!');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed');
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div style={styles.header}>
        <h1 style={styles.title}>Settings</h1>
        <p style={styles.subtitle}>Customize your chatbot and account</p>
      </div>

      <div style={styles.grid}>
        {/* Bot settings */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>🤖 Bot Customization</h2>
          <p style={styles.cardSub}>Change how your bot looks and talks</p>

          <form onSubmit={handleBotSubmit} style={styles.form}>
            <div style={styles.field}>
              <label style={styles.label}>Company Name</label>
              <input
                name="name"
                value={botForm.name}
                onChange={handleBotChange}
                style={styles.input}
                placeholder="Your Company Name"
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Bot Name</label>
              <input
                name="botName"
                value={botForm.botName}
                onChange={handleBotChange}
                style={styles.input}
                placeholder="Support Bot"
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Bot Color</label>
              <div style={styles.colorRow}>
                <input
                  type="color"
                  name="botColor"
                  value={botForm.botColor}
                  onChange={handleBotChange}
                  style={styles.colorPicker}
                />
                <input
                  name="botColor"
                  value={botForm.botColor}
                  onChange={handleBotChange}
                  style={{ ...styles.input, flex: 1 }}
                  placeholder="#6366f1"
                />
              </div>
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Welcome Message</label>
              <textarea
                name="welcomeMessage"
                value={botForm.welcomeMessage}
                onChange={handleBotChange}
                style={styles.textarea}
                placeholder="Hi! How can I help you today?"
                rows={3}
              />
            </div>

            {/* Preview */}
            <div style={styles.preview}>
              <div style={styles.previewLabel}>Preview</div>
              <div style={styles.previewWidget}>
                <div style={{
                  ...styles.previewHeader,
                  background: botForm.botColor
                }}>
                  <div style={styles.previewAvatar}>
                    {botForm.botName?.charAt(0) || 'B'}
                  </div>
                  <div>
                    <div style={styles.previewName}>{botForm.botName || 'Bot'}</div>
                    <div style={styles.previewStatus}>● Online</div>
                  </div>
                </div>
                <div style={styles.previewBody}>
                  <div style={styles.previewMsg}>
                    {botForm.welcomeMessage || 'Hi! How can I help?'}
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{ ...styles.btn, opacity: loading ? 0.7 : 1 }}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>

        {/* Password settings */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>🔒 Change Password</h2>
          <p style={styles.cardSub}>Update your account password</p>

          <form onSubmit={handlePasswordSubmit} style={styles.form}>
            <div style={styles.field}>
              <label style={styles.label}>Current Password</label>
              <input
                type="password"
                name="currentPassword"
                value={passwordForm.currentPassword}
                onChange={handlePasswordChange}
                style={styles.input}
                placeholder="••••••••"
              />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>New Password</label>
              <input
                type="password"
                name="newPassword"
                value={passwordForm.newPassword}
                onChange={handlePasswordChange}
                style={styles.input}
                placeholder="Min. 6 characters"
              />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Confirm New Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={passwordForm.confirmPassword}
                onChange={handlePasswordChange}
                style={styles.input}
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              disabled={passwordLoading}
              style={{ ...styles.btn, opacity: passwordLoading ? 0.7 : 1 }}
            >
              {passwordLoading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

const styles = {
  header: { marginBottom: '1.5rem' },
  title: { fontSize: '1.5rem', fontWeight: '600', color: 'var(--text)', marginBottom: '0.25rem' },
  subtitle: { color: 'var(--muted)', fontSize: '0.9rem' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' },
  card: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '1.75rem' },
  cardTitle: { fontSize: '1rem', fontWeight: '600', color: 'var(--text)', marginBottom: '0.25rem' },
  cardSub: { color: 'var(--muted)', fontSize: '0.85rem', marginBottom: '1.5rem' },
  form: { display: 'flex', flexDirection: 'column', gap: '1.25rem' },
  field: { display: 'flex', flexDirection: 'column', gap: '0.4rem' },
  label: { fontSize: '0.85rem', fontWeight: '500', color: 'var(--text)' },
  input: { background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: '8px', padding: '0.7rem 1rem', color: 'var(--text)', fontSize: '0.9rem', outline: 'none', width: '100%' },
  textarea: { background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: '8px', padding: '0.7rem 1rem', color: 'var(--text)', fontSize: '0.9rem', outline: 'none', width: '100%', resize: 'vertical' },
  colorRow: { display: 'flex', gap: '0.75rem', alignItems: 'center' },
  colorPicker: { width: '48px', height: '40px', border: '1px solid var(--border)', borderRadius: '8px', cursor: 'pointer', background: 'none' },
  preview: { background: 'var(--surface2)', borderRadius: '10px', padding: '1rem' },
  previewLabel: { fontSize: '0.75rem', color: 'var(--muted)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' },
  previewWidget: { borderRadius: '10px', overflow: 'hidden', border: '1px solid var(--border)', maxWidth: '220px' },
  previewHeader: { padding: '0.6rem 0.85rem', display: 'flex', alignItems: 'center', gap: '8px' },
  previewAvatar: { width: '24px', height: '24px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', color: '#fff', fontWeight: '600' },
  previewName: { fontSize: '0.8rem', color: '#fff', fontWeight: '500' },
  previewStatus: { fontSize: '0.7rem', color: 'rgba(255,255,255,0.7)' },
  previewBody: { background: 'var(--surface)', padding: '0.75rem' },
  previewMsg: { background: 'var(--surface2)', borderRadius: '8px', padding: '0.5rem 0.75rem', fontSize: '0.78rem', color: 'var(--text)' },
  btn: { background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '8px', padding: '0.75rem', fontSize: '0.9rem', fontWeight: '500', cursor: 'pointer' }
};

export default Settings;