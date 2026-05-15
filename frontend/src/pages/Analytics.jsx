import { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import API from '../api/axios';
import toast from 'react-hot-toast';

const Analytics = () => {
  const [stats, setStats] = useState(null);
  const [messagesPerDay, setMessagesPerDay] = useState([]);
  const [topQuestions, setTopQuestions] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const [overviewRes, convsRes] = await Promise.all([
        API.get('/analytics/overview'),
        API.get('/analytics/conversations')
      ]);
      setStats(overviewRes.data.stats);
      setMessagesPerDay(overviewRes.data.messagesPerDay);
      setTopQuestions(overviewRes.data.topQuestions);
      setConversations(convsRes.data.conversations);
    } catch (error) {
      toast.error('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  const maxMessages = Math.max(...messagesPerDay.map(d => d.count), 1);

  return (
    <DashboardLayout>
      <div style={styles.header}>
        <h1 style={styles.title}>Analytics</h1>
        <p style={styles.subtitle}>Track your chatbot performance</p>
      </div>

      {loading ? (
        <div style={{ color: 'var(--muted)' }}>Loading analytics...</div>
      ) : (
        <>
          {/* Stats row */}
          <div style={styles.statsRow}>
            {[
              { label: 'Total Conversations', value: stats?.totalConversations || 0, icon: '💬' },
              { label: 'Total Messages', value: stats?.totalMessages || 0, icon: '✉️' },
              { label: 'RAG Replies', value: stats?.ragUsageCount || 0, icon: '🧠' },
              { label: 'Resolution Rate', value: `${stats?.resolutionRate || 0}%`, icon: '✅' }
            ].map((s, i) => (
              <div key={i} style={styles.statCard}>
                <div style={styles.statIcon}>{s.icon}</div>
                <div style={styles.statValue}>{s.value}</div>
                <div style={styles.statLabel}>{s.label}</div>
              </div>
            ))}
          </div>

          <div style={styles.grid}>
            {/* Messages per day chart */}
            <div style={styles.card}>
              <h2 style={styles.cardTitle}>Messages per day (last 7 days)</h2>
              {messagesPerDay.length === 0 ? (
                <div style={styles.empty}>No data yet</div>
              ) : (
                <div style={styles.chart}>
                  {messagesPerDay.map((day, i) => (
                    <div key={i} style={styles.barGroup}>
                      <div style={styles.barWrapper}>
                        <div style={{
                          ...styles.bar,
                          height: `${(day.count / maxMessages) * 120}px`,
                          background: 'var(--accent)'
                        }}></div>
                      </div>
                      <div style={styles.barLabel}>
                        {day._id.slice(5)}
                      </div>
                      <div style={styles.barValue}>{day.count}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Top questions */}
            <div style={styles.card}>
              <h2 style={styles.cardTitle}>Top Questions</h2>
              {topQuestions.length === 0 ? (
                <div style={styles.empty}>No questions yet</div>
              ) : (
                <div style={styles.questionsList}>
                  {topQuestions.map((q, i) => (
                    <div key={i} style={styles.questionRow}>
                      <span style={styles.questionRank}>#{i + 1}</span>
                      <span style={styles.questionText}>
                        {q.question.length > 60
                          ? q.question.slice(0, 60) + '...'
                          : q.question}
                      </span>
                      <span style={styles.questionCount}>{q.count}x</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Recent conversations */}
          <div style={{ ...styles.card, marginTop: '1.5rem' }}>
            <h2 style={styles.cardTitle}>Recent Conversations</h2>
            {conversations.length === 0 ? (
              <div style={styles.empty}>No conversations yet</div>
            ) : (
              <div>
                <div style={styles.tableHeader}>
                  <span style={{ flex: 2 }}>Session ID</span>
                  <span style={{ flex: 1 }}>Messages</span>
                  <span style={{ flex: 1 }}>Status</span>
                  <span style={{ flex: 1 }}>Date</span>
                </div>
                {conversations.map((conv) => (
                  <div key={conv.id} style={styles.tableRow}>
                    <span style={{ flex: 2, color: 'var(--muted)', fontSize: '0.8rem', fontFamily: 'monospace' }}>
                      {conv.sessionId.slice(0, 20)}...
                    </span>
                    <span style={{ flex: 1, color: 'var(--text)' }}>
                      {conv.messageCount}
                    </span>
                    <span style={{ flex: 1 }}>
                      <span style={{
                        padding: '3px 8px',
                        borderRadius: '6px',
                        fontSize: '0.78rem',
                        background: conv.status === 'active' ? '#22c55e20' :
                                    conv.status === 'escalated' ? '#f59e0b20' : '#6366f120',
                        color: conv.status === 'active' ? '#22c55e' :
                               conv.status === 'escalated' ? '#f59e0b' : '#6366f1'
                      }}>
                        {conv.status}
                      </span>
                    </span>
                    <span style={{ flex: 1, color: 'var(--muted)', fontSize: '0.85rem' }}>
                      {new Date(conv.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </DashboardLayout>
  );
};

const styles = {
  header: { marginBottom: '1.5rem' },
  title: { fontSize: '1.5rem', fontWeight: '600', color: 'var(--text)', marginBottom: '0.25rem' },
  subtitle: { color: 'var(--muted)', fontSize: '0.9rem' },
  statsRow: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem', marginBottom: '1.5rem' },
  statCard: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '1.25rem', textAlign: 'center' },
  statIcon: { fontSize: '1.5rem', marginBottom: '0.5rem' },
  statValue: { fontSize: '1.75rem', fontWeight: '600', color: 'var(--text)', marginBottom: '0.25rem' },
  statLabel: { fontSize: '0.78rem', color: 'var(--muted)' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' },
  card: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '1.5rem' },
  cardTitle: { fontSize: '0.95rem', fontWeight: '600', color: 'var(--text)', marginBottom: '1.25rem' },
  empty: { color: 'var(--muted)', fontSize: '0.875rem', padding: '1rem 0' },
  chart: { display: 'flex', alignItems: 'flex-end', gap: '0.75rem', height: '160px', paddingTop: '1rem' },
  barGroup: { display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, gap: '4px' },
  barWrapper: { display: 'flex', alignItems: 'flex-end', height: '120px' },
  bar: { width: '100%', minWidth: '24px', borderRadius: '4px 4px 0 0', transition: 'height 0.3s', minHeight: '4px' },
  barLabel: { fontSize: '0.7rem', color: 'var(--muted)', textAlign: 'center' },
  barValue: { fontSize: '0.75rem', color: 'var(--text)', fontWeight: '500' },
  questionsList: { display: 'flex', flexDirection: 'column', gap: '0.75rem' },
  questionRow: { display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.6rem 0', borderBottom: '1px solid var(--border)' },
  questionRank: { fontSize: '0.78rem', fontWeight: '600', color: 'var(--accent)', minWidth: '24px' },
  questionText: { flex: 1, fontSize: '0.875rem', color: 'var(--text)' },
  questionCount: { fontSize: '0.78rem', fontWeight: '600', color: 'var(--muted)', background: 'var(--surface2)', padding: '2px 8px', borderRadius: '20px' },
  tableHeader: { display: 'flex', padding: '0.6rem 0', borderBottom: '1px solid var(--border)', fontSize: '0.75rem', fontWeight: '500', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' },
  tableRow: { display: 'flex', alignItems: 'center', padding: '0.75rem 0', borderBottom: '1px solid var(--border)', fontSize: '0.875rem' }
};

export default Analytics;