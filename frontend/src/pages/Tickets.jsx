import { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import API from '../api/axios';
import toast from 'react-hot-toast';

const Tickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const { data } = await API.get('/tickets');
      setTickets(data.tickets);
    } catch (error) {
      toast.error('Failed to load tickets');
    } finally {
      setLoading(false);
    }
  };

  const updateTicket = async (id, status) => {
    try {
      await API.put(`/tickets/${id}`, { status });
      toast.success(`Ticket marked as ${status}`);
      setTickets(tickets.map(t =>
        t.id === id ? { ...t, status } : t
      ));
      if (selected?.id === id) {
        setSelected({ ...selected, status });
      }
    } catch (error) {
      toast.error('Failed to update ticket');
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'open': return { background: '#ef444420', color: '#ef4444' };
      case 'in-progress': return { background: '#f59e0b20', color: '#f59e0b' };
      case 'closed': return { background: '#22c55e20', color: '#22c55e' };
      default: return { background: 'var(--surface2)', color: 'var(--muted)' };
    }
  };

  return (
    <DashboardLayout>
      <div style={styles.header}>
        <h1 style={styles.title}>Support Tickets</h1>
        <p style={styles.subtitle}>Human handoff requests from customers</p>
      </div>

      {loading ? (
        <div style={{ color: 'var(--muted)' }}>Loading tickets...</div>
      ) : tickets.length === 0 ? (
        <div style={styles.emptyState}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎫</div>
          <h3 style={{ color: 'var(--text)', marginBottom: '0.5rem' }}>No tickets yet</h3>
          <p style={{ color: 'var(--muted)', fontSize: '0.875rem' }}>
            When customers request human help, tickets appear here
          </p>
        </div>
      ) : (
        <div style={styles.layout}>
          {/* Tickets list */}
          <div style={styles.ticketsList}>
            {tickets.map((ticket) => (
              <div
                key={ticket.id}
                onClick={() => setSelected(ticket)}
                style={{
                  ...styles.ticketCard,
                  borderColor: selected?.id === ticket.id
                    ? 'var(--accent)'
                    : 'var(--border)'
                }}
              >
                <div style={styles.ticketTop}>
                  <span style={{
                    ...styles.statusBadge,
                    ...getStatusStyle(ticket.status)
                  }}>
                    {ticket.status}
                  </span>
                  <span style={styles.ticketDate}>
                    {new Date(ticket.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p style={styles.ticketMessage}>
                  {ticket.visitorMessage.length > 80
                    ? ticket.visitorMessage.slice(0, 80) + '...'
                    : ticket.visitorMessage}
                </p>
                <div style={styles.ticketMeta}>
                  <span style={styles.ticketMetaItem}>
                    💬 {ticket.messageCount} messages
                  </span>
                  <span style={{
                    ...styles.priorityBadge,
                    color: ticket.priority === 'high' ? '#ef4444' :
                           ticket.priority === 'medium' ? '#f59e0b' : '#22c55e'
                  }}>
                    {ticket.priority} priority
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Ticket detail */}
          {selected ? (
            <div style={styles.ticketDetail}>
              <div style={styles.detailHeader}>
                <h2 style={styles.detailTitle}>Ticket Details</h2>
                <span style={{
                  ...styles.statusBadge,
                  ...getStatusStyle(selected.status)
                }}>
                  {selected.status}
                </span>
              </div>

              <div style={styles.detailMessage}>
                <div style={styles.detailLabel}>Customer Message</div>
                <p style={styles.detailText}>{selected.visitorMessage}</p>
              </div>

              <div style={styles.detailDate}>
                📅 {new Date(selected.createdAt).toLocaleString()}
              </div>

              <div style={styles.actionButtons}>
                <div style={styles.actionLabel}>Update Status:</div>
                <div style={styles.btnRow}>
                  <button
                    onClick={() => updateTicket(selected.id, 'in-progress')}
                    style={styles.actionBtn}
                  >
                    Mark In Progress
                  </button>
                  <button
                    onClick={() => updateTicket(selected.id, 'closed')}
                    style={{ ...styles.actionBtn, background: '#22c55e20', color: '#22c55e', borderColor: '#22c55e40' }}
                  >
                    Mark Closed
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div style={styles.selectPrompt}>
              <p>← Select a ticket to view details</p>
            </div>
          )}
        </div>
      )}
    </DashboardLayout>
  );
};

const styles = {
  header: { marginBottom: '1.5rem' },
  title: { fontSize: '1.5rem', fontWeight: '600', color: 'var(--text)', marginBottom: '0.25rem' },
  subtitle: { color: 'var(--muted)', fontSize: '0.9rem' },
  emptyState: { textAlign: 'center', padding: '4rem 2rem', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px' },
  layout: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' },
  ticketsList: { display: 'flex', flexDirection: 'column', gap: '0.75rem' },
  ticketCard: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '1.25rem', cursor: 'pointer', transition: 'border-color 0.2s' },
  ticketTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' },
  statusBadge: { padding: '3px 10px', borderRadius: '6px', fontSize: '0.78rem', fontWeight: '500' },
  ticketDate: { fontSize: '0.78rem', color: 'var(--muted)' },
  ticketMessage: { fontSize: '0.875rem', color: 'var(--text)', marginBottom: '0.75rem', lineHeight: 1.5 },
  ticketMeta: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  ticketMetaItem: { fontSize: '0.78rem', color: 'var(--muted)' },
  priorityBadge: { fontSize: '0.75rem', fontWeight: '500' },
  ticketDetail: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '1.5rem', height: 'fit-content', position: 'sticky', top: '2rem' },
  detailHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' },
  detailTitle: { fontSize: '1rem', fontWeight: '600', color: 'var(--text)' },
  detailMessage: { background: 'var(--surface2)', borderRadius: '10px', padding: '1rem', marginBottom: '1rem' },
  detailLabel: { fontSize: '0.75rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' },
  detailText: { fontSize: '0.9rem', color: 'var(--text)', lineHeight: 1.6 },
  detailDate: { fontSize: '0.8rem', color: 'var(--muted)', marginBottom: '1.5rem' },
  actionButtons: { borderTop: '1px solid var(--border)', paddingTop: '1.25rem' },
  actionLabel: { fontSize: '0.85rem', fontWeight: '500', color: 'var(--text)', marginBottom: '0.75rem' },
  btnRow: { display: 'flex', gap: '0.75rem', flexWrap: 'wrap' },
  actionBtn: { background: '#f59e0b20', color: '#f59e0b', border: '1px solid #f59e0b40', borderRadius: '8px', padding: '0.6rem 1rem', fontSize: '0.85rem', fontWeight: '500', cursor: 'pointer' },
  selectPrompt: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '3rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted)', fontSize: '0.9rem' }
};

export default Tickets;