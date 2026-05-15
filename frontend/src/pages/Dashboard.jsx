import ChatWidget from '../components/ChatWidget';
// import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';

const StatCard = ({ title, value, icon, color }) => (
  <div style={{
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: '12px',
    padding: '1.5rem',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  }}>
    <div style={{
      width: '48px',
      height: '48px',
      borderRadius: '12px',
      background: `${color}20`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '1.4rem'
    }}>
      {icon}
    </div>
    <div>
      <div style={{ fontSize: '1.75rem', fontWeight: '600', color: 'var(--text)' }}>
        {value}
      </div>
      <div style={{ fontSize: '0.8rem', color: 'var(--muted)', marginTop: '2px' }}>
        {title}
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  const { company } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await API.get('/analytics/overview');
        setStats(data.stats);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <DashboardLayout>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>
            Welcome back, {company?.name} 👋
          </h1>
          <p style={styles.subtitle}>
            Here's what's happening with your chatbot today
          </p>
        </div>
      </div>

      {/* Bot info bar */}
      <div style={styles.botBar}>
        <div style={styles.botInfo}>
          <div style={{
            ...styles.botDot,
            background: 'var(--success)'
          }}></div>
          <span style={{ color: 'var(--muted)', fontSize: '0.875rem' }}>
            Your bot: <strong style={{ color: 'var(--text)' }}>
              {company?.botName}
            </strong> is active
          </span>
        </div>
        <div style={styles.botColor}>
          <div style={{
            width: '16px',
            height: '16px',
            borderRadius: '50%',
            background: company?.botColor
          }}></div>
          <span style={{ color: 'var(--muted)', fontSize: '0.875rem' }}>
            {company?.botColor}
          </span>
        </div>
      </div>

      {/* Stats grid */}
      {loading ? (
        <div style={styles.loading}>Loading stats...</div>
      ) : (
        <div style={styles.statsGrid}>
          <StatCard
            title="Total Conversations"
            value={stats?.totalConversations || 0}
            icon="💬"
            color="#6366f1"
          />
          <StatCard
            title="Total Messages"
            value={stats?.totalMessages || 0}
            icon="✉️"
            color="#22c55e"
          />
          <StatCard
            title="Open Tickets"
            value={stats?.escalatedConversations || 0}
            icon="🎫"
            color="#f59e0b"
          />
          <StatCard
            title="Documents Indexed"
            value={stats?.totalDocuments || 0}
            icon="📄"
            color="#3b82f6"
          />
          <StatCard
            title="RAG Replies"
            value={stats?.ragUsageCount || 0}
            icon="🧠"
            color="#8b5cf6"
          />
          <StatCard
            title="Resolution Rate"
            value={`${stats?.resolutionRate || 0}%`}
            icon="✅"
            color="#10b981"
          />
        </div>
      )}

      {/* Quick actions */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Quick Actions</h2>
        <div style={styles.actionsGrid}>
          <a href="/documents" style={styles.actionCard}>
            <span style={styles.actionIcon}>📄</span>
            <div>
              <div style={styles.actionTitle}>Upload Documents</div>
              <div style={styles.actionSub}>
                Train your bot with your content
              </div>
            </div>
          </a>
          <a href="/embed" style={styles.actionCard}>
            <span style={styles.actionIcon}>🔗</span>
            <div>
              <div style={styles.actionTitle}>Get Embed Code</div>
              <div style={styles.actionSub}>
                Add chatbot to your website
              </div>
            </div>
          </a>
          <a href="/settings" style={styles.actionCard}>
            <span style={styles.actionIcon}>⚙️</span>
            <div>
              <div style={styles.actionTitle}>Customize Bot</div>
              <div style={styles.actionSub}>
                Change name, color and greeting
              </div>
            </div>
          </a>
          <a href="/tickets" style={styles.actionCard}>
            <span style={styles.actionIcon}>🎫</span>
            <div>
              <div style={styles.actionTitle}>View Tickets</div>
              <div style={styles.actionSub}>
                Manage human handoff requests
              </div>
            </div>
          </a>
        </div>
      </div>
       <ChatWidget companyId={company?.id} />
    </DashboardLayout>
  );
};

const styles = {
  header: {
    marginBottom: '1.5rem'
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
  botBar: {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: '10px',
    padding: '0.75rem 1.25rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '1.5rem'
  },
  botInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  botDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%'
  },
  botColor: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  loading: {
    color: 'var(--muted)',
    padding: '2rem 0'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem',
    marginBottom: '2rem'
  },
  section: {
    marginTop: '1rem'
  },
  sectionTitle: {
    fontSize: '1rem',
    fontWeight: '600',
    color: 'var(--text)',
    marginBottom: '1rem'
  },
  actionsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '1rem'
  },
  actionCard: {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: '12px',
    padding: '1.25rem',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    textDecoration: 'none',
    transition: 'border-color 0.2s',
    cursor: 'pointer'
  },
  actionIcon: {
    fontSize: '1.5rem'
  },
  actionTitle: {
    fontSize: '0.9rem',
    fontWeight: '500',
    color: 'var(--text)',
    marginBottom: '2px'
  },
  actionSub: {
    fontSize: '0.78rem',
    color: 'var(--muted)'
  }
};

export default Dashboard;