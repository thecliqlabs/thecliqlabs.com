(function() {
  const style = document.createElement('style');
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');

    #clio-bubble{position:fixed;bottom:24px;right:24px;z-index:99998;width:58px;height:58px;border-radius:50%;background:linear-gradient(135deg,#1fb9e6,#0a7fa3);box-shadow:0 4px 20px rgba(31,185,230,0.45);cursor:pointer;display:flex;align-items:center;justify-content:center;border:none;outline:none;transition:transform .2s,box-shadow .2s}
    #clio-bubble:hover{transform:scale(1.08);box-shadow:0 6px 28px rgba(31,185,230,0.55)}
    #clio-notif{position:absolute;top:-2px;right:-2px;width:20px;height:20px;border-radius:50%;background:#ff4757;border:2.5px solid #fff;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:#fff;font-family:sans-serif}

    #clio-window{position:fixed;bottom:94px;right:24px;z-index:99999;width:360px;max-width:calc(100vw - 32px);background:#fff;border-radius:20px;box-shadow:0 12px 56px rgba(0,0,0,0.18);display:none;flex-direction:column;overflow:hidden;font-family:'Poppins',sans-serif;max-height:600px}
    #clio-window.open{display:flex}

    #clio-header{background:linear-gradient(135deg,#1fb9e6,#0d8db3);padding:18px 18px 32px;position:relative;overflow:hidden}
    #clio-header-wave{position:absolute;bottom:-1px;left:0;right:0;height:28px;background:#fff;clip-path:ellipse(55% 100% at 50% 100%)}
    #clio-header-top{display:flex;align-items:center;gap:10px;margin-bottom:8px}
    #clio-avatar{width:42px;height:42px;border-radius:50%;background:rgba(255,255,255,0.25);display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0;border:2px solid rgba(255,255,255,0.4)}
    #clio-info{flex:1}
    #clio-name{font-size:15px;font-weight:700;color:#fff;letter-spacing:-.3px}
    #clio-status{font-size:11px;color:rgba(255,255,255,0.85);display:flex;align-items:center;gap:4px;margin-top:2px}
    #clio-status::before{content:'';width:7px;height:7px;border-radius:50%;background:#4ade80;display:inline-block;flex-shrink:0}
    #clio-close{background:none;border:none;cursor:pointer;color:rgba(255,255,255,0.8);font-size:22px;padding:0;line-height:1;transition:color .2s}
    #clio-close:hover{color:#fff}
    #clio-header-sub{font-size:12px;color:rgba(255,255,255,0.8);padding-left:52px}

    /* LEAD FORM */
    #clio-form{padding:20px 16px 16px;background:#fff;display:flex;flex-direction:column;gap:10px}
    #clio-form-title{font-size:14px;font-weight:700;color:#111;margin-bottom:2px}
    #clio-form-sub{font-size:12px;color:#888;margin-bottom:6px;line-height:1.6}
    .clio-field{display:flex;flex-direction:column;gap:4px}
    .clio-field label{font-size:11px;font-weight:600;color:#555;text-transform:uppercase;letter-spacing:.5px}
    .clio-field input{background:#f4f5f7;border:1.5px solid #eee;border-radius:10px;padding:9px 12px;font-size:13px;color:#222;font-family:'Poppins',sans-serif;outline:none;transition:border-color .2s}
    .clio-field input:focus{border-color:#1fb9e6;background:#fff}
    .clio-field input::placeholder{color:#bbb}
    #clio-form-btn{background:linear-gradient(135deg,#1fb9e6,#0d8db3);color:#fff;border:none;border-radius:12px;padding:12px;font-size:14px;font-weight:700;cursor:pointer;font-family:'Poppins',sans-serif;transition:all .2s;margin-top:4px}
    #clio-form-btn:hover{opacity:.9;transform:translateY(-1px)}

    /* MESSAGES */
    #clio-messages{flex:1;overflow-y:auto;padding:14px 14px 8px;display:flex;flex-direction:column;gap:10px;min-height:260px;max-height:360px;background:#f8f9fa}
    #clio-messages::-webkit-scrollbar{width:3px}
    #clio-messages::-webkit-scrollbar-thumb{background:#ddd;border-radius:2px}

    .clio-msg{max-width:84%;padding:10px 13px;font-size:13px;line-height:1.7;animation:clio-pop .18s ease;word-wrap:break-word;word-break:break-word;overflow-wrap:break-word}
    @keyframes clio-pop{from{opacity:0;transform:translateY(5px)}to{opacity:1;transform:none}}
    .clio-msg.bot{background:#fff;color:#333;border-radius:4px 16px 16px 16px;align-self:flex-start;box-shadow:0 1px 4px rgba(0,0,0,0.08)}
    .clio-msg.user{background:linear-gradient(135deg,#1fb9e6,#0d8db3);color:#fff;font-weight:600;border-radius:16px 16px 4px 16px;align-self:flex-end}
    .clio-msg a{color:#1fb9e6;font-weight:600;text-decoration:underline;word-break:break-all}
    .clio-msg.user a{color:#fff}
    .clio-msg strong{font-weight:700}
    .clio-msg ul{padding-left:14px;margin:4px 0;display:flex;flex-direction:column;gap:3px}
    .clio-msg p{margin:0 0 5px}
    .clio-msg p:last-child{margin:0}

    /* QUICK REPLIES */
    .clio-quick-replies{display:flex;flex-wrap:wrap;gap:6px;margin-top:4px;align-self:flex-start;max-width:100%}
    .clio-qr-btn{background:#fff;border:1.5px solid #1fb9e6;color:#1fb9e6;border-radius:20px;padding:6px 14px;font-size:12px;font-weight:600;cursor:pointer;font-family:'Poppins',sans-serif;transition:all .2s;white-space:nowrap}
    .clio-qr-btn:hover{background:#1fb9e6;color:#fff}

    .clio-typing{display:flex;gap:4px;align-items:center;padding:11px 14px;background:#fff;border-radius:4px 16px 16px 16px;align-self:flex-start;width:fit-content;box-shadow:0 1px 4px rgba(0,0,0,0.08)}
    .clio-typing span{width:7px;height:7px;border-radius:50%;background:#ccc;animation:clio-dot 1.2s ease-in-out infinite}
    .clio-typing span:nth-child(2){animation-delay:.2s}
    .clio-typing span:nth-child(3){animation-delay:.4s}
    @keyframes clio-dot{0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-5px)}}

    #clio-input-wrap{padding:10px 12px;border-top:1px solid #eee;display:flex;gap:8px;align-items:flex-end;background:#fff}
    #clio-input{flex:1;background:#f4f5f7;border:1.5px solid #eee;border-radius:12px;padding:9px 13px;font-size:13px;color:#222;font-family:'Poppins',sans-serif;resize:none;outline:none;max-height:90px;min-height:38px;transition:border-color .2s;line-height:1.5}
    #clio-input::placeholder{color:#bbb}
    #clio-input:focus{border-color:#1fb9e6;background:#fff}
    #clio-send{width:38px;height:38px;border-radius:50%;background:linear-gradient(135deg,#1fb9e6,#0d8db3);border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:all .2s;box-shadow:0 2px 8px rgba(31,185,230,0.35)}
    #clio-send:hover{transform:scale(1.08);box-shadow:0 4px 12px rgba(31,185,230,0.45)}
    #clio-send svg{width:15px;height:15px;fill:#fff}
    #clio-powered{text-align:center;font-size:10px;color:#ccc;padding:5px 0 8px;background:#fff;font-family:'Poppins',sans-serif}

    /* TEASER MESSAGE BUBBLE */
    #clio-teaser{position:fixed;bottom:92px;right:24px;z-index:99997;max-width:260px;background:#fff;border-radius:16px 16px 4px 16px;padding:14px 16px;box-shadow:0 8px 28px rgba(0,0,0,0.16);font-family:'Poppins',sans-serif;font-size:13px;color:#1a1a1a;line-height:1.55;opacity:0;transform:translateY(10px) scale(.96);pointer-events:none;transition:opacity .35s ease,transform .35s ease;cursor:pointer}
    #clio-teaser.show{opacity:1;transform:translateY(0) scale(1);pointer-events:auto}
    #clio-teaser-close{position:absolute;top:6px;right:8px;background:none;border:none;color:#bbb;font-size:14px;cursor:pointer;padding:2px;line-height:1}
    #clio-teaser-close:hover{color:#777}
  `;
  document.head.appendChild(style);

  // Bubble
  const bubble = document.createElement('button');
  bubble.id = 'clio-bubble';
  bubble.innerHTML = `
    <div id="clio-notif">1</div>
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
      <path d="M13 2C7.48 2 3 6.02 3 11c0 2.76 1.26 5.23 3.25 6.94L5 22l4.5-1.5C10.56 20.83 11.76 21 13 21c5.52 0 10-4.02 10-9S18.52 2 13 2z" fill="white"/>
      <circle cx="9" cy="11" r="1.3" fill="#1fb9e6"/>
      <circle cx="13" cy="11" r="1.3" fill="#1fb9e6"/>
      <circle cx="17" cy="11" r="1.3" fill="#1fb9e6"/>
    </svg>
  `;
  document.body.appendChild(bubble);

  // Teaser message bubble
  const teaser = document.createElement('div');
  teaser.id = 'clio-teaser';
  teaser.innerHTML = `<button id="clio-teaser-close">×</button><span id="clio-teaser-text"></span>`;
  document.body.appendChild(teaser);

  // Window
  const win = document.createElement('div');
  win.id = 'clio-window';
  win.innerHTML = `
    <div id="clio-header">
      <div id="clio-header-top">
        <div id="clio-avatar">🤖</div>
        <div id="clio-info">
          <div id="clio-name">Clio — CliqLabs AI</div>
          <div id="clio-status">Online now</div>
        </div>
        <button id="clio-close">×</button>
      </div>
      <div id="clio-header-sub">We typically reply in seconds</div>
      <div id="clio-header-wave"></div>
    </div>

    <!-- LEAD FORM -->
    <div id="clio-form">
      <div id="clio-form-title">👋 Welcome to CliqLabs!</div>
      <div id="clio-form-sub">Tell us about yourself and Clio will help you find the right solution for your GHL agency.</div>
      <div class="clio-field"><label>Full Name *</label><input type="text" id="clio-fname" placeholder="Your full name"/></div>
      <div class="clio-field"><label>Email *</label><input type="email" id="clio-femail" placeholder="your@email.com"/></div>
      <div class="clio-field"><label>Phone</label><input type="tel" id="clio-fphone" placeholder="+1 (555) 000-0000"/></div>
      <div class="clio-field"><label>Agency Name</label><input type="text" id="clio-fagency" placeholder="Your agency name"/></div>
      <button id="clio-form-btn">Start Chat with Clio →</button>
    </div>

    <!-- CHAT -->
    <div id="clio-messages" style="display:none"></div>
    <div id="clio-input-wrap" style="display:none">
      <textarea id="clio-input" placeholder="Type a message..." rows="1"></textarea>
      <button id="clio-send">
        <svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
      </button>
    </div>
    <div id="clio-powered" style="display:none">Powered by CliqLabs AI</div>
  `;
  document.body.appendChild(win);

  let messages = [];
  let isOpen = false;
  let teaserIndex = 0;
  let teaserDismissed = false;
  let teaserCycleTimer = null;
  let isTyping = false;
  let leadInfo = {};

  const messagesEl = document.getElementById('clio-messages');
  const inputEl = document.getElementById('clio-input');
  const formEl = document.getElementById('clio-form');

  function cleanMarkdown(text) {
    return text
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/\*([^*]+)\*/g, '$1')
      .replace(/#{1,3}\s/g, '')
      .replace(/`([^`]+)`/g, '$1')
      .replace(/^[-•]\s(.+)$/gm, '<li>$1</li>')
      .replace(/(<li>[^]*?<\/li>)/g, '<ul>$1</ul>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br/>')
      .replace(/(https?:\/\/[^\s<"]+)/g, '<a href="$1" target="_blank" rel="noopener">Click here →</a>');
  }

  function addMessage(text, role, quickReplies) {
    const div = document.createElement('div');
    div.className = `clio-msg ${role}`;
    if (role === 'bot') {
      div.innerHTML = `<p>${cleanMarkdown(text)}</p>`;
    } else {
      div.textContent = text;
    }
    messagesEl.appendChild(div);

    if (quickReplies && quickReplies.length) {
      const qr = document.createElement('div');
      qr.className = 'clio-quick-replies';
      quickReplies.forEach(label => {
        const btn = document.createElement('button');
        btn.className = 'clio-qr-btn';
        btn.textContent = label;
        btn.addEventListener('click', () => {
          qr.remove();
          sendMessage(label);
        });
        qr.appendChild(btn);
      });
      messagesEl.appendChild(qr);
    }

    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function showTyping() {
    const div = document.createElement('div');
    div.className = 'clio-typing';
    div.id = 'clio-typing-ind';
    div.innerHTML = '<span></span><span></span><span></span>';
    messagesEl.appendChild(div);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function hideTyping() {
    const t = document.getElementById('clio-typing-ind');
    if (t) t.remove();
  }

  async function sendMessage(userText) {
    if (!userText.trim() || isTyping) return;
    addMessage(userText, 'user');
    messages.push({ role: 'user', content: userText });
    isTyping = true;
    showTyping();

    try {
      const res = await fetch('/api/clio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages, contactInfo: leadInfo })
      });
      const data = await res.json();
      hideTyping();
      const reply = data.reply || "I'm having trouble right now. Please email thecliqlabs@gmail.com";
      
      // Detect quick reply suggestions
      let qrs = [];
      if (reply.includes('24/7 Support') || reply.includes('support')) qrs = ['Tell me about pricing', 'Book a Demo', 'I need support'];
      else if (reply.includes('Theme Builder')) qrs = ['Monthly $147', 'Annual $1,497', 'See themes'];
      else if (reply.includes('onboarding')) qrs = ['Pack of 4 - $397', 'Pack of 10 - $870', 'Pack of 25 - $1,925'];
      
      addMessage(reply, 'bot', qrs.length ? qrs : null);
      messages.push({ role: 'assistant', content: reply });
    } catch(e) {
      hideTyping();
      addMessage("Having a quick issue! Please email thecliqlabs@gmail.com 😊", 'bot');
    }
    isTyping = false;
  }

  // Form submit
  document.getElementById('clio-form-btn').addEventListener('click', () => {
    const name = document.getElementById('clio-fname').value.trim();
    const email = document.getElementById('clio-femail').value.trim();
    const phone = document.getElementById('clio-fphone').value.trim();
    const agency = document.getElementById('clio-fagency').value.trim();

    if (!name || !email) {
      document.getElementById('clio-fname').style.borderColor = name ? '#eee' : '#ff4757';
      document.getElementById('clio-femail').style.borderColor = email ? '#eee' : '#ff4757';
      return;
    }

    leadInfo = { name, email, phone, agency };

    // Hide form, show chat
    formEl.style.display = 'none';
    messagesEl.style.display = 'flex';
    document.getElementById('clio-input-wrap').style.display = 'flex';
    document.getElementById('clio-powered').style.display = 'block';

    // Remove notif badge
    const notif = document.getElementById('clio-notif');
    if (notif) notif.style.display = 'none';

    // Greeting with their name
    setTimeout(() => {
      showTyping();
      setTimeout(() => {
        hideTyping();
        const greeting = `Hey ${name.split(' ')[0]}! 👋 Great to meet you${agency ? ` from ${agency}` : ''}. I'm Clio, CliqLabs AI agent. I'm here to help you scale your GoHighLevel agency. What's your biggest challenge right now?`;
        addMessage(greeting, 'bot', ['24/7 Client Support', 'Client Onboarding', 'GHL Theme Builder', 'Just exploring']);
        messages.push({ role: 'assistant', content: greeting });
      }, 1000);
    }, 200);
  });

  // Open/close
  bubble.addEventListener('click', () => {
    isOpen = !isOpen;
    win.classList.toggle('open', isOpen);
    if (isOpen) {
      teaser.classList.remove('show');
      teaserDismissed = true;
      if (teaserCycleTimer) clearInterval(teaserCycleTimer);
    }
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

  // Rotating teaser messages (does NOT force-open the chat)
  const teaserMessages = [
    "Drowning in GHL support tickets? I can help. \ud83d\udc4b",
    "Need 24/7 white-label support for your agency?",
    "Curious what CliqLabs costs? Ask me anything.",
    "Scaling your GHL agency? Let's talk.",
    "Got a quick question about onboarding? I'm here.",
    "Want your GHL dashboard fully branded? Ask Clio."
  ];
  function showTeaser(){
    if (isOpen || teaserDismissed) return;
    const textEl = document.getElementById('clio-teaser-text');
    textEl.textContent = teaserMessages[teaserIndex % teaserMessages.length];
    teaserIndex++;
    teaser.classList.add('show');
    setTimeout(() => { teaser.classList.remove('show'); }, 7000);
  }

  function startTeaserCycle(){
    showTeaser();
    teaserCycleTimer = setInterval(showTeaser, 25000);
  }

  // First teaser after 15s, then repeats every 25s until dismissed or chat opened
  setTimeout(startTeaserCycle, 15000);

  teaser.addEventListener('click', (e) => {
    if (e.target.id === 'clio-teaser-close') return;
    teaser.classList.remove('show');
    if (!isOpen) {
      isOpen = true;
      win.classList.add('open');
    }
  });

  document.getElementById('clio-teaser-close').addEventListener('click', (e) => {
    e.stopPropagation();
    teaserDismissed = true;
    teaser.classList.remove('show');
    if (teaserCycleTimer) clearInterval(teaserCycleTimer);
  });
})();
