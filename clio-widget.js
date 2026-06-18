(function() {
  const style = document.createElement('style');
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
    
    #clio-bubble{position:fixed;bottom:24px;right:24px;z-index:99998;width:54px;height:54px;border-radius:50%;background:#1fb9e6;box-shadow:0 4px 20px rgba(31,185,230,0.45);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:transform .2s,box-shadow .2s;border:none;outline:none}
    #clio-bubble:hover{transform:scale(1.08);box-shadow:0 6px 28px rgba(31,185,230,0.55)}
    #clio-bubble-icon{width:26px;height:26px}
    #clio-pulse{position:absolute;top:1px;right:1px;width:13px;height:13px;border-radius:50%;background:#4ade80;border:2.5px solid #fff}
    
    #clio-window{position:fixed;bottom:90px;right:24px;z-index:99999;width:360px;max-width:calc(100vw - 32px);background:#fff;border-radius:20px;box-shadow:0 8px 48px rgba(0,0,0,0.18);display:none;flex-direction:column;overflow:hidden;font-family:'Poppins',sans-serif;max-height:580px}
    #clio-window.open{display:flex}
    
    #clio-header{background:#1fb9e6;padding:14px 16px;display:flex;align-items:center;gap:10px}
    #clio-avatar{width:38px;height:38px;border-radius:50%;background:rgba(255,255,255,0.2);display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0}
    #clio-info{flex:1}
    #clio-name{font-size:14px;font-weight:700;color:#fff;font-family:'Poppins',sans-serif}
    #clio-status{font-size:11px;color:rgba(255,255,255,0.85);display:flex;align-items:center;gap:5px;font-family:'Poppins',sans-serif}
    #clio-status::before{content:'';width:6px;height:6px;border-radius:50%;background:#4ade80;display:inline-block;flex-shrink:0}
    #clio-close{background:none;border:none;cursor:pointer;color:rgba(255,255,255,0.7);font-size:22px;padding:0;line-height:1;transition:color .2s;font-family:sans-serif}
    #clio-close:hover{color:#fff}
    
    #clio-messages{flex:1;overflow-y:auto;padding:14px;display:flex;flex-direction:column;gap:8px;min-height:300px;max-height:380px;background:#f8f9fa}
    #clio-messages::-webkit-scrollbar{width:3px}
    #clio-messages::-webkit-scrollbar-thumb{background:#ddd;border-radius:2px}
    
    .clio-msg{max-width:85%;padding:10px 13px;font-size:13px;line-height:1.65;animation:clio-pop .18s ease;word-wrap:break-word;word-break:break-word;overflow-wrap:break-word}
    @keyframes clio-pop{from{opacity:0;transform:translateY(5px)}to{opacity:1;transform:none}}
    .clio-msg.bot{background:#fff;color:#222;border-radius:4px 16px 16px 16px;align-self:flex-start;box-shadow:0 1px 4px rgba(0,0,0,0.08);font-family:'Poppins',sans-serif}
    .clio-msg.user{background:#1fb9e6;color:#fff;font-weight:600;border-radius:16px 16px 4px 16px;align-self:flex-end;font-family:'Poppins',sans-serif}
    .clio-msg a{color:#1fb9e6;font-weight:600;text-decoration:none;word-break:break-all;display:inline-block;max-width:100%}
    .clio-msg a:hover{text-decoration:underline}
    .clio-msg.user a{color:#fff;text-decoration:underline}
    .clio-msg ul{padding-left:16px;margin:6px 0;display:flex;flex-direction:column;gap:4px}
    .clio-msg ul li{font-size:13px;line-height:1.6}
    .clio-msg p{margin:0 0 6px}
    .clio-msg p:last-child{margin:0}
    .clio-msg strong{font-weight:700;color:#111}
    
    .clio-typing{display:flex;gap:4px;align-items:center;padding:11px 14px;background:#fff;border-radius:4px 16px 16px 16px;align-self:flex-start;width:fit-content;box-shadow:0 1px 4px rgba(0,0,0,0.08)}
    .clio-typing span{width:7px;height:7px;border-radius:50%;background:#ccc;animation:clio-dot 1.2s ease-in-out infinite}
    .clio-typing span:nth-child(2){animation-delay:.2s}
    .clio-typing span:nth-child(3){animation-delay:.4s}
    @keyframes clio-dot{0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-5px)}}
    
    #clio-input-wrap{padding:10px 12px;border-top:1px solid #eee;display:flex;gap:8px;align-items:flex-end;background:#fff}
    #clio-input{flex:1;background:#f4f5f7;border:1.5px solid #eee;border-radius:12px;padding:9px 13px;font-size:13px;color:#222;font-family:'Poppins',sans-serif;resize:none;outline:none;max-height:90px;min-height:38px;transition:border-color .2s;line-height:1.5}
    #clio-input::placeholder{color:#aaa}
    #clio-input:focus{border-color:#1fb9e6;background:#fff}
    #clio-send{width:36px;height:36px;border-radius:10px;background:#1fb9e6;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:all .2s}
    #clio-send:hover{background:#0aa3cf}
    #clio-send svg{width:15px;height:15px;fill:#fff}
    #clio-powered{text-align:center;font-size:10px;color:#bbb;padding:5px 0 8px;font-family:'Poppins',sans-serif;background:#fff}
  `;
  document.head.appendChild(style);

  // Bubble
  const bubble = document.createElement('button');
  bubble.id = 'clio-bubble';
  bubble.innerHTML = `
    <div id="clio-pulse"></div>
    <svg id="clio-bubble-icon" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="16" fill="#1fb9e6"/>
      <path d="M8 11.5C8 10.1193 9.11929 9 10.5 9H21.5C22.8807 9 24 10.1193 24 11.5V18.5C24 19.8807 22.8807 21 21.5 21H18L14 25V21H10.5C9.11929 21 8 19.8807 8 18.5V11.5Z" fill="white"/>
      <circle cx="12" cy="15" r="1.2" fill="#1fb9e6"/>
      <circle cx="16" cy="15" r="1.2" fill="#1fb9e6"/>
      <circle cx="20" cy="15" r="1.2" fill="#1fb9e6"/>
    </svg>
  `;
  document.body.appendChild(bubble);

  // Window
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
      <textarea id="clio-input" placeholder="Ask me anything..." rows="1"></textarea>
      <button id="clio-send">
        <svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
      </button>
    </div>
    <div id="clio-powered">Powered by CliqLabs AI</div>
  `;
  document.body.appendChild(win);

  let messages = [];
  let isOpen = false;
  let isTyping = false;
  let contactInfo = { name: null, email: null };
  let collectingName = false;
  let collectingEmail = false;

  const messagesEl = document.getElementById('clio-messages');
  const inputEl = document.getElementById('clio-input');

  // Clean markdown from Claude responses
  function cleanMarkdown(text) {
    return text
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>') // bold
      .replace(/\*([^*]+)\*/g, '$1') // italic — just remove
      .replace(/#{1,3}\s/g, '') // headers
      .replace(/`([^`]+)`/g, '$1') // inline code
      .replace(/^[-•]\s(.+)$/gm, '<li>$1</li>') // bullet points
      .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>') // wrap in ul
      .replace(/\n\n/g, '</p><p>') // paragraphs
      .replace(/\n/g, '<br/>') // line breaks
      .replace(/(https?:\/\/[^\s<]+)/g, '<a href="$1" target="_blank" rel="noopener">$1</a>'); // links
  }

  function addMessage(text, role) {
    const div = document.createElement('div');
    div.className = `clio-msg ${role}`;
    if (role === 'bot') {
      div.innerHTML = `<p>${cleanMarkdown(text)}</p>`;
    } else {
      div.textContent = text;
    }
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

  function extractEmail(text) {
    const match = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    return match ? match[0] : null;
  }

  async function sendMessage(userText) {
    if (!userText.trim() || isTyping) return;

    addMessage(userText, 'user');
    messages.push({ role: 'user', content: userText });

    const email = extractEmail(userText);
    if (email && !contactInfo.email) {
      contactInfo.email = email;
      collectingEmail = false;
    }

    if (collectingName && !contactInfo.name) {
      contactInfo.name = userText.trim();
      collectingName = false;
      collectingEmail = true;
    }

    isTyping = true;
    showTyping();

    try {
      const res = await fetch('/api/clio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages,
          contactInfo: (contactInfo.name && contactInfo.email) ? contactInfo : null
        })
      });

      const data = await res.json();
      hideTyping();

      const reply = data.reply || "I'm having trouble right now. Please email us at thecliqlabs@gmail.com";
      addMessage(reply, 'bot');
      messages.push({ role: 'assistant', content: reply });

      if (reply.toLowerCase().includes("your name") || reply.toLowerCase().includes("what's your name")) {
        collectingName = true;
      }
    } catch(e) {
      hideTyping();
      addMessage("Having a quick issue! Please email thecliqlabs@gmail.com 😊", 'bot');
    }

    isTyping = false;
  }

  function openChat() {
    isOpen = true;
    win.classList.add('open');
    if (messages.length === 0) {
      setTimeout(() => {
        showTyping();
        setTimeout(() => {
          hideTyping();
          const greeting = "Hey! 👋 I'm Clio, CliqLabs AI agent. I'm here to help you scale your GoHighLevel agency. What brought you to CliqLabs today?";
          addMessage(greeting, 'bot');
          messages.push({ role: 'assistant', content: greeting });
        }, 1000);
      }, 200);
    }
  }

  bubble.addEventListener('click', () => {
    if (!isOpen) { openChat(); } 
    else { isOpen = false; win.classList.remove('open'); }
  });

  document.getElementById('clio-close').addEventListener('click', (e) => {
    e.stopPropagation();
    isOpen = false;
    win.classList.remove('open');
  });

  document.getElementById('clio-send').addEventListener('click', () => {
    const text = inputEl.value.trim();
    if (text) { inputEl.value = ''; inputEl.style.height = 'auto'; sendMessage(text); }
  });

  inputEl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      const text = inputEl.value.trim();
      if (text) { inputEl.value = ''; inputEl.style.height = 'auto'; sendMessage(text); }
    }
  });

  inputEl.addEventListener('input', () => {
    inputEl.style.height = 'auto';
    inputEl.style.height = Math.min(inputEl.scrollHeight, 90) + 'px';
  });

  // Auto open after 45 seconds
  setTimeout(() => { if (!isOpen) openChat(); }, 45000);
})();
