import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const ChatWidget = ({ companyId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [config, setConfig] = useState(null);
  const messagesEndRef = useRef(null);

  // Load widget config
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const { data } = await axios.get(
          `https://intellisupport-production.up.railway.app/api/widget/${companyId}`
        );
        setConfig(data.config);
        setMessages([{
          role: 'assistant',
          content: data.config.welcomeMessage
        }]);
      } catch (error) {
        console.error('Failed to load widget config');
      }
    };
    if (companyId) fetchConfig();
  }, [companyId]);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const { data } = await axios.post(
        'https://intellisupport-production.up.railway.app/api/chat/message',
        {
          companyId,
          sessionId,
          message: userMessage
        }
      );

      setSessionId(data.sessionId);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.reply
      }]);
    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.'
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleEscalate = async () => {
    if (!sessionId) return;
    try {
      await axios.post('https://intellisupport-production.up.railway.app/api/tickets', {
        companyId,
        sessionId,
        visitorMessage: 'Customer requested human support'
      });
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '✅ A support ticket has been created. A human agent will contact you soon!'
      }]);
    } catch (error) {
      console.error('Failed to create ticket');
    }
  };

  if (!config) return null;

  return (
    <div style={styles.container}>
      {/* Chat window */}
      {isOpen && (
        <div style={styles.window}>
          {/* Header */}
          <div style={{
            ...styles.header,
            background: config.botColor
          }}>
            <div style={styles.headerInfo}>
              <div style={styles.avatar}>
                {config.botName?.charAt(0)}
              </div>
              <div>
                <div style={styles.botName}>{config.botName}</div>
                <div style={styles.botStatus}>● Online · replies instantly</div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={styles.closeBtn}
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div style={styles.messages}>
            {messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  ...styles.messageRow,
                  justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start'
                }}
              >
                <div style={{
                  ...styles.bubble,
                  background: msg.role === 'user'
                    ? config.botColor
                    : 'var(--surface2, #2a2a3e)',
                  color: msg.role === 'user' ? '#fff' : '#f0f0f5',
                  borderRadius: msg.role === 'user'
                    ? '18px 18px 4px 18px'
                    : '18px 18px 18px 4px'
                }}>
                  {msg.content}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {loading && (
              <div style={styles.messageRow}>
                <div style={{ ...styles.bubble, background: '#2a2a3e', color: '#8888a8' }}>
                  Typing...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Human handoff button */}
          {sessionId && (
            <div style={styles.handoffBar}>
              <button onClick={handleEscalate} style={styles.handoffBtn}>
                👤 Talk to a human
              </button>
            </div>
          )}

          {/* Input */}
          <div style={styles.inputRow}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              style={styles.input}
              disabled={loading}
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              style={{
                ...styles.sendBtn,
                background: config.botColor,
                opacity: loading || !input.trim() ? 0.6 : 1
              }}
            >
              ↑
            </button>
          </div>

          {/* Powered by */}
          <div style={styles.poweredBy}>
            Powered by <strong>IntelliSupport</strong>
          </div>
        </div>
      )}

      {/* Toggle bubble */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          ...styles.bubble2,
          background: config.botColor
        }}
      >
        {isOpen ? '✕' : '💬'}
      </button>
    </div>
  );
};

const styles = {
  container: {
    position: 'fixed',
    bottom: '24px',
    right: '24px',
    zIndex: 9999,
    fontFamily: 'Inter, DM Sans, sans-serif'
  },
  window: {
    width: '360px',
    height: '520px',
    background: '#16161e',
    border: '1px solid #2a2a3e',
    borderRadius: '16px',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    marginBottom: '16px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.4)'
  },
  header: {
    padding: '1rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  headerInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  avatar: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    fontWeight: '600',
    color: '#fff'
  },
  botName: {
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#fff'
  },
  botStatus: {
    fontSize: '0.72rem',
    color: 'rgba(255,255,255,0.7)'
  },
  closeBtn: {
    background: 'rgba(255,255,255,0.15)',
    border: 'none',
    color: '#fff',
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    cursor: 'pointer',
    fontSize: '0.8rem'
  },
  messages: {
    flex: 1,
    overflowY: 'auto',
    padding: '1rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.6rem'
  },
  messageRow: {
    display: 'flex',
    width: '100%'
  },
  bubble: {
    maxWidth: '80%',
    padding: '0.6rem 0.9rem',
    fontSize: '0.875rem',
    lineHeight: 1.5,
    wordBreak: 'break-word'
  },
  handoffBar: {
    padding: '0.5rem 1rem',
    borderTop: '1px solid #2a2a3e'
  },
  handoffBtn: {
    background: 'none',
    border: '1px solid #2a2a3e',
    color: '#8888a8',
    borderRadius: '6px',
    padding: '0.4rem 0.85rem',
    fontSize: '0.78rem',
    cursor: 'pointer',
    width: '100%'
  },
  inputRow: {
    display: 'flex',
    gap: '0.5rem',
    padding: '0.75rem',
    borderTop: '1px solid #2a2a3e'
  },
  input: {
    flex: 1,
    background: '#22222f',
    border: '1px solid #2a2a3e',
    borderRadius: '8px',
    padding: '0.6rem 0.85rem',
    color: '#f0f0f5',
    fontSize: '0.875rem',
    outline: 'none'
  },
  sendBtn: {
    width: '36px',
    height: '36px',
    borderRadius: '8px',
    border: 'none',
    color: '#fff',
    fontSize: '1rem',
    cursor: 'pointer',
    flexShrink: 0
  },
  poweredBy: {
    textAlign: 'center',
    padding: '0.4rem',
    fontSize: '0.7rem',
    color: '#555570'
  },
  bubble2: {
    width: '56px',
    height: '56px',
    borderRadius: '50%',
    border: 'none',
    color: '#fff',
    fontSize: '1.4rem',
    cursor: 'pointer',
    boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 'auto'
  }
};

export default ChatWidget;