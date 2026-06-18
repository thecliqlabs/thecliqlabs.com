(function() {
  // Inject styles
  const style = document.createElement('style');
  style.textContent = `
    #clio-bubble{position:fixed;bottom:24px;right:24px;z-index:99998;width:56px;height:56px;border-radius:50%;background:linear-gradient(135deg,#1fb9e6,#0a7fa3);box-shadow:0 4px 24px rgba(31,185,230,0.4);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:transform .2s,box-shadow .2s;border:none}
    #clio-bubble:hover{transform:scale(1.08);box-shadow:0 6px 32px rgba(31,185,230,0.5)}
    #clio-bubble svg{width:26px;height:26px;fill:#fff}
    #clio-pulse{position:absolute;top:-3px;right:-3px;width:14px;height:14px;border-radius:50%;background:#4ade80;border:2px solid #02121d;animation:clio-blink 2s ease-in-out infinite}
    @keyframes clio-blink{0%,100%{opacity:1}50%{opacity:.4}}
    #clio-window{position:fixed;bottom:92px;right:24px;z-index:99999;width:360px;max-width:calc(100vw - 32px);background:#02121d;border:1px solid rgba(31,185,230,0.25);border-radius:20px;box-shadow:0 20px 60px rgba(0,0,0,0.5);display:none;flex-direction:column;overflow:hidden;font-family:'Poppins',sans-serif;max-height:560px}
    #clio-window.open{display:flex}
    #clio-header{background:linear-gradient(135deg,#041e2e,#02121d);padding:16px 18px;display:flex;align-items:center;gap:12px;border-bottom:1px solid rgba(255,255,255,0.07)}
    #clio-avatar{width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,#1fb9e6,#0a7fa3);display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0}
    #clio-info{flex:1}
    #clio-name{font-size:14px;font-weight:700;color:#fff}
    #clio-status{font-size:11px;color:#4ade80;display:flex;align-items:center;gap:4px}
    #clio-status::before{content:'';width:6px;height:6px;border-radius:50%;background:#4ade80;display:inline-block}
    #clio-close{background:none;border:none;cursor:pointer;color:rgba(255,255,255,0.4);font-size:20px;padding:0;line-height:1;transition:color .2s}
    #clio-close:hover{color:#fff}
    #clio-messages{flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:10px;min-height:280px;max-height:360px}
    #clio-messages::-webkit-scrollbar{width:4px}
    #clio-messages::-webkit-scrollbar-track{background:transparent}
    #clio-messages::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.1);border-radius:2px}
    .clio-msg{max-width:82%;padding:10px 14px;border-radius:14px;font-size:13px;line-height:1.65;animation:clio-pop .2s ease}
    @keyframes clio-pop{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}
    .clio-msg.bot{background:rgba(255,255,255,0.06);color:rgba(255,255,255,0.85);border-radius:14px 14px 14px 4px;align-self:flex-start}
    .clio-msg.user{background:#1fb9e6;color:#02121d;font-weight:600;border-radius:14px 14px 4px 14px;align-self:flex-end}
    .clio-msg a{color:#1fb9e6;font-weight:700;text-decoration:underline}
    .clio-msg.bot a{color:#7ddff5}
    .clio-typing{display:flex;gap:4px;align-items:center;padding:12px 14px;background:rgba(255,255,255,0.06);border-radius:14px 14px 14px 4px;align-self:flex-start;width:fit-content}
    .clio-typing span{width:7px;height:7px;border-radius:50%;background:rgba(255,255,255,0.4);animation:clio-dot 1.2s ease-in-out infinite}
    .clio-typing span:nth-child(2){animation-delay:.2s}
    .clio-typing span:nth-child(3){animation-delay:.4s}
    @keyframes clio-dot{0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-6px)}}
    #clio-input-wrap{padding:12px;border-top:1px solid rgba(255,255,255,0.07);display:flex;gap:8px;align-items:flex-end}
    #clio-input{flex:1;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);border-radius:12px;padding:10px 14px;font-size:13px;color:#fff;font-family:'Poppins',sans-serif;resize:none;outline:none;max-height:100px;min-height:40px;transition:border-color .2s;line-height:1.5}
    #clio-input::placeholder{color:rgba(255,255,255,0.25)}
    #clio-input:focus{border-color:rgba(31,185,230,0.4)}
    #clio-send{width:38px;height:38px;border-radius:10px;background:#1fb9e6;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:all .2s}
    #clio-send:hover{background:#2dcfff;transform:scale(1.05)}
    #clio-send svg{width:16px;height:16px;fill:#02121d}
    #clio-powered{text-align:center;font-size:10px;color:rgba(255,255,255,0.18);padding:6px 0 10px;font-family:'Poppins',sans-serif}
  `;
  document.head.appendChild(style);

  // Create bubble
  const bubble = document.createElement('button');
  bubble.id = 'clio-bubble';
  bubble.innerHTML = `
    <div id="clio-pulse"></div>
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.48 2 2 6.02 2 11c0 2.76 1.26 5.23 3.25 6.94L4 22l4.5-1.5C9.56 20.83 10.76 21 12 21c5.52 0 10-4.02 10-9S17.52 2 12 2zm0 16c-1.05 0-2.06-.18-3-.5l-2.13.71.71-2.08C6.23 14.87 5 13.03 5 11c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7z"/></svg>
  `;
  document.body.appendChild(bubble);

  // Create window
  const win = document.createElement('div');
  win.id = 'clio-window';
  win.innerHTML = `
    <div id="clio-header">
      <div id="clio-avatar">🤖</div>
      <div id="clio-info">
        <div id="clio-name">Clio — CliqLabs AI</div>
        <div id="clio-status">Online now</div>
      </div>
      <button id="clio-close">×</button>
    </div>
    <div id="clio-messages"></div>
    <div id="clio-input-wrap">
      <textarea id="clio-input" placeholder="Ask me anything about CliqLabs..." rows="1"></textarea>
      <button id="clio-send">
        <svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
      </button>
    </div>
    <div id="clio-powered">Powered by CliqLabs AI</div>
  `;
  document.body.appendChild(win);

  // State
  let messages = [];
  let isOpen = false;
  let isTyping = false;
  let contactInfo = { name: null, email: null };
  let collectingName = false;
  let collectingEmail = false;

  const messagesEl = document.getElementById('clio-messages');
  const inputEl = document.getElementById('clio-input');

  function addMessage(text, role) {
    const div = document.createElement('div');
    div.className = `clio-msg ${role}`;
    // Convert URLs to links
    div.innerHTML = text.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" rel="noopener">$1</a>');
    messagesEl.appendChild(div);
    messagesEl.scrollTop = messagesEl.scrollHeight;
    return div;
  }

  function showTyping() {
    const div = document.createElement('div');
    div.className = 'clio-typing';
    div.id = 'clio-typing-indicator';
    div.innerHTML = '<span></span><span></span><span></span>';
    messagesEl.appendChild(div);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function hideTyping() {
    const t = document.getElementById('clio-typing-indicator');
    if (t) t.remove();
  }

  // Check if message contains email
  function extractEmail(text) {
    const match = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    return match ? match[0] : null;
  }

  async function sendMessage(userText) {
    if (!userText.trim() || isTyping) return;

    addMessage(userText, 'user');
    messages.push({ role: 'user', content: userText });

    // Check for email in message
    const email = extractEmail(userText);
    if (email && !contactInfo.email) {
      contactInfo.email = email;
      collectingEmail = false;
    }

    // Check for name collection
    if (collectingName && !contactInfo.name) {
      contactInfo.name = userText.trim();
      collectingName = false;
      collectingEmail = true;
    }

    isTyping = true;
    showTyping();

    try {
      const res = await fetch('https://thecliqlabs.com/api/clio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages,
          contactInfo: (contactInfo.name && contactInfo.email) ? contactInfo : null
        })
      });

      const data = await res.json();
      hideTyping();

      const reply = data.reply || "I'm having trouble connecting right now. Please email us at thecliqlabs@gmail.com";
      addMessage(reply, 'bot');
      messages.push({ role: 'assistant', content: reply });

      // Detect if Clio is asking for name
      if (reply.toLowerCase().includes("what's your name") || 
          reply.toLowerCase().includes("your name") ||
          reply.toLowerCase().includes("may i have your name")) {
        collectingName = true;
      }

    } catch(e) {
      hideTyping();
      addMessage("I'm having a moment! Please email us directly at thecliqlabs@gmail.com 😊", 'bot');
    }

    isTyping = false;
  }

  // Open/close
  bubble.addEventListener('click', () => {
    isOpen = !isOpen;
    win.classList.toggle('open', isOpen);

    // Send greeting on first open
    if (isOpen && messages.length === 0) {
      setTimeout(() => {
        showTyping();
        setTimeout(() => {
          hideTyping();
          const greeting = "Hey! 👋 I'm Clio, CliqLabs AI sales agent. I'm here to help you scale your GoHighLevel agency. What brought you to CliqLabs today?";
          addMessage(greeting, 'bot');
          messages.push({ role: 'assistant', content: greeting });
        }, 1200);
      }, 300);
    }
  });

  document.getElementById('clio-close').addEventListener('click', (e) => {
    e.stopPropagation();
    isOpen = false;
    win.classList.remove('open');
  });

  // Send on button click
  document.getElementById('clio-send').addEventListener('click', () => {
    const text = inputEl.value.trim();
    if (text) {
      inputEl.value = '';
      inputEl.style.height = 'auto';
      sendMessage(text);
    }
  });

  // Send on Enter (Shift+Enter for newline)
  inputEl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      const text = inputEl.value.trim();
      if (text) {
        inputEl.value = '';
        inputEl.style.height = 'auto';
        sendMessage(text);
      }
    }
  });

  // Auto-resize textarea
  inputEl.addEventListener('input', () => {
    inputEl.style.height = 'auto';
    inputEl.style.height = Math.min(inputEl.scrollHeight, 100) + 'px';
  });

  // Auto-open after 30 seconds
  setTimeout(() => {
    if (!isOpen) {
      isOpen = true;
      win.classList.add('open');
      setTimeout(() => {
        showTyping();
        setTimeout(() => {
          hideTyping();
          const greeting = "Hey! 👋 I'm Clio, CliqLabs AI sales agent. I'm here to help you scale your GoHighLevel agency. What brought you to CliqLabs today?";
          addMessage(greeting, 'bot');
          messages.push({ role: 'assistant', content: greeting });
        }, 1200);
      }, 300);
    }
  }, 30000);
})();
