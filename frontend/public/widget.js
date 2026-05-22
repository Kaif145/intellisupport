(function () {
  const config = window.IntelliSupportConfig || {};
  const companyId = config.companyId;
  if (!companyId) return;

  const BASE = 'https://intellisupport-production.up.railway.app';

  // Inject styles
  const style = document.createElement('style');
  style.innerHTML = `
    #intellisupport-btn {
      position: fixed; bottom: 24px; right: 24px;
      width: 56px; height: 56px; border-radius: 50%;
      background: #6366f1; border: none; cursor: pointer;
      box-shadow: 0 4px 20px rgba(0,0,0,0.3);
      display: flex; align-items: center; justify-content: center;
      font-size: 1.4rem; z-index: 99999; color: white;
      transition: transform 0.2s;
    }
    #intellisupport-btn:hover { transform: scale(1.08); }
    #intellisupport-window {
      position: fixed; bottom: 90px; right: 24px;
      width: 360px; height: 520px;
      background: #16161e; border: 1px solid #2a2a3e;
      border-radius: 16px; display: none; flex-direction: column;
      overflow: hidden; z-index: 99999;
      box-shadow: 0 20px 60px rgba(0,0,0,0.4);
      font-family: Inter, DM Sans, sans-serif;
    }
    #intellisupport-window.open { display: flex; }
    #is-header {
      padding: 1rem; display: flex;
      align-items: center; justify-content: space-between;
    }
    #is-header-info { display: flex; align-items: center; gap: 10px; }
    #is-avatar {
      width: 32px; height: 32px; border-radius: 50%;
      background: rgba(255,255,255,0.2);
      display: flex; align-items: center; justify-content: center;
      font-size: 14px; font-weight: 600; color: #fff;
    }
    #is-botname { font-size: 0.9rem; font-weight: 600; color: #fff; }
    #is-status { font-size: 0.72rem; color: rgba(255,255,255,0.7); }
    #is-close {
      background: rgba(255,255,255,0.15); border: none;
      color: #fff; width: 28px; height: 28px;
      border-radius: 50%; cursor: pointer; font-size: 0.8rem;
    }
    #is-messages {
      flex: 1; overflow-y: auto; padding: 1rem;
      display: flex; flex-direction: column; gap: 0.6rem;
    }
    .is-msg-row { display: flex; width: 100%; }
    .is-msg-row.user { justify-content: flex-end; }
    .is-msg-row.bot { justify-content: flex-start; }
    .is-bubble {
      max-width: 80%; padding: 0.6rem 0.9rem;
      font-size: 0.875rem; line-height: 1.5; word-break: break-word;
    }
    .is-bubble.user {
      border-radius: 18px 18px 4px 18px; color: #fff;
    }
    .is-bubble.bot {
      border-radius: 18px 18px 18px 4px;
      background: #2a2a3e; color: #f0f0f5;
    }
    #is-handoff-bar {
      padding: 0.5rem 1rem; border-top: 1px solid #2a2a3e;
    }
    #is-handoff-btn {
      background: none; border: 1px solid #2a2a3e;
      color: #8888a8; border-radius: 6px;
      padding: 0.4rem 0.85rem; font-size: 0.78rem;
      cursor: pointer; width: 100%;
    }
    #is-input-row {
      display: flex; gap: 0.5rem; padding: 0.75rem;
      border-top: 1px solid #2a2a3e;
    }
    #is-input {
      flex: 1; background: #22222f;
      border: 1px solid #2a2a3e; border-radius: 8px;
      padding: 0.6rem 0.85rem; color: #f0f0f5;
      font-size: 0.875rem; outline: none;
      font-family: inherit;
    }
    #is-send {
      width: 36px; height: 36px; border-radius: 8px;
      border: none; color: #fff; font-size: 1rem;
      cursor: pointer; background: #6366f1;
    }
    #is-powered {
      text-align: center; padding: 0.4rem;
      font-size: 0.7rem; color: #555570;
    }
    .is-typing { color: #8888a8; font-style: italic; }
  `;
  document.head.appendChild(style);

  // Fetch widget config
  let botColor = '#6366f1';
  let botName = 'Support Bot';
  let sessionId = null;

  fetch(`${BASE}/api/widget/${companyId}`)
    .then(r => r.json())
    .then(data => {
      if (data.success) {
        botColor = data.config.botColor || '#6366f1';
        botName = data.config.botName || 'Support Bot';
        // Apply color
        document.getElementById('intellisupport-btn').style.background = botColor;
        document.getElementById('is-header').style.background = botColor;
        document.getElementById('is-send').style.background = botColor;
        document.getElementById('is-avatar').textContent = botName.charAt(0);
        document.getElementById('is-botname').textContent = botName;
        // Add welcome message
        addMessage('bot', data.config.welcomeMessage || 'Hi! How can I help you today?');
      }
    })
    .catch(() => {
      addMessage('bot', 'Hi! How can I help you today?');
    });

  // Build HTML
  const btn = document.createElement('button');
  btn.id = 'intellisupport-btn';
  btn.innerHTML = '💬';

  const win = document.createElement('div');
  win.id = 'intellisupport-window';
  win.innerHTML = `
    <div id="is-header" style="background:${botColor}">
      <div id="is-header-info">
        <div id="is-avatar">${botName.charAt(0)}</div>
        <div>
          <div id="is-botname">${botName}</div>
          <div id="is-status">● Online · replies instantly</div>
        </div>
      </div>
      <button id="is-close">✕</button>
    </div>
    <div id="is-messages"></div>
    <div id="is-handoff-bar">
      <button id="is-handoff-btn">👤 Talk to a human</button>
    </div>
    <div id="is-input-row">
      <input id="is-input" placeholder="Type a message..." />
      <button id="is-send">↑</button>
    </div>
    <div id="is-powered">Powered by <strong>IntelliSupport</strong></div>
  `;

  document.body.appendChild(btn);
  document.body.appendChild(win);

  // Toggle open/close
  btn.addEventListener('click', () => {
    win.classList.toggle('open');
    btn.innerHTML = win.classList.contains('open') ? '✕' : '💬';
  });

  document.getElementById('is-close').addEventListener('click', () => {
    win.classList.remove('open');
    btn.innerHTML = '💬';
  });

  // Add message to chat
  function addMessage(role, text) {
    const messages = document.getElementById('is-messages');
    const row = document.createElement('div');
    row.className = `is-msg-row ${role === 'user' ? 'user' : 'bot'}`;
    const bubble = document.createElement('div');
    bubble.className = `is-bubble ${role === 'user' ? 'user' : 'bot'}`;
    if (role === 'user') bubble.style.background = botColor;
    bubble.textContent = text;
    row.appendChild(bubble);
    messages.appendChild(row);
    messages.scrollTop = messages.scrollHeight;
  }

  // Send message
  async function sendMessage() {
    const input = document.getElementById('is-input');
    const text = input.value.trim();
    if (!text) return;
    input.value = '';
    addMessage('user', text);

    // Show typing
    const messages = document.getElementById('is-messages');
    const typingRow = document.createElement('div');
    typingRow.className = 'is-msg-row bot';
    typingRow.id = 'is-typing';
    typingRow.innerHTML = '<div class="is-bubble bot is-typing">Typing...</div>';
    messages.appendChild(typingRow);
    messages.scrollTop = messages.scrollHeight;

    try {
      const res = await fetch(`${BASE}/api/chat/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ companyId, sessionId, message: text })
      });
      const data = await res.json();
      document.getElementById('is-typing')?.remove();
      if (data.success) {
        sessionId = data.sessionId;
        addMessage('bot', data.reply);
      }
    } catch (e) {
      document.getElementById('is-typing')?.remove();
      addMessage('bot', 'Sorry, something went wrong. Please try again.');
    }
  }

  // Send on button click
  document.getElementById('is-send').addEventListener('click', sendMessage);

  // Send on Enter key
  document.getElementById('is-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
  });

  // Human handoff
  document.getElementById('is-handoff-btn').addEventListener('click', async () => {
    if (!sessionId) return;
    try {
      await fetch(`${BASE}/api/tickets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyId,
          sessionId,
          visitorMessage: 'Customer requested human support'
        })
      });
      addMessage('bot', '✅ A support ticket has been created. A human agent will contact you soon!');
    } catch (e) {
      addMessage('bot', 'Failed to create ticket. Please try again.');
    }
  });

})();