const http = require('http');
const https = require('https');

// Load env vars
require('fs').readFileSync('/etc/environment', 'utf8').split('\n').forEach(line => {
  const [k, ...rest] = line.split('=');
  if (k && rest.length) process.env[k.trim()] = rest.join('=').trim().replace(/^"|"$/g, '');
});

const GHL_API_KEY = process.env.GHL_API_KEY;
const GHL_LOCATION_ID = process.env.GHL_LOCATION_ID;
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

console.log('GHL Location:', GHL_LOCATION_ID ? 'loaded' : 'MISSING');
console.log('GHL API Key:', GHL_API_KEY ? 'loaded' : 'MISSING');
console.log('Anthropic Key:', ANTHROPIC_API_KEY ? 'loaded' : 'MISSING');

const contactMap = new Map(); // email -> contactId

const SYSTEM_PROMPT = `You are Clio, a sales agent for CliqLabs. You talk like a real person, not a bot. Short sentences. Casual but professional. You close deals.

WHO YOU ARE:
You work for CliqLabs. You help GoHighLevel SaaS resellers and white-label agency owners stop drowning in support and tech so they can focus on scaling. You genuinely care about helping them but you also need to close.

WHO YOU ARE TALKING TO:
GHL SaaS resellers and white-label resellers. They sell HighLevel under their own brand. Their clients ask too many questions, they are stuck doing tech support, onboarding takes forever, and their GHL dashboard looks generic. They are tired. They want systems.

WHAT CLIQLA BS SOLVES:
Support overload, bad client onboarding, GHL looks generic, doing everything themselves with no team and no leverage.

PRODUCTS AND EXACT PRICING:

1. CORE PLAN at $197/mo
For agencies starting out or wanting to brand their GHL properly.
Includes: White Label Support Widget and Library with 1000+ GHL articles for client self-serve, Self-Serve Customer Service Software, GHL Theme Builder for professional themes across all sub-accounts, Dedicated Sending Domains Setup for every client sub-account, Conversation AI for your agency sub-account, OG SaaS Snapshot, Demo Snapshot, Brandable Demo Video, Brandable Slide Deck, Interactive Guided Tours, A2P 10DLC Compliance Training.
Stripe link: https://buy.stripe.com/6oUcMY2iVgn53vQcHF1ck00

2. VIP PLAN at $397/mo - Most Popular
For growing agencies with up to 10 clients who need real human support.
Includes everything in Core plus: 24/7 Branded Human Support for up to 10 clients via live chat, email and Zoom all branded as YOUR team, 24/7 Chat Phone and Video Support, On-Demand A2P Support and DFY Registration, Dedicated Sending Domains for every client, Support via Tickets and Zoom.
Stripe link: https://buy.stripe.com/dRm5kwe1D4En9Ue5fd1ck01

3. DIAMOND PLAN at $997/mo
For scaling agencies with 10+ clients needing unlimited support and onboarding.
Includes everything in VIP plus: 24/7 Branded Human Support for UNLIMITED clients with no cap and no extra fees, 5 DFY Client Onboarding Calls per month with A2P, 4 DFY A2P Registrations monthly, Access to GHL University, Dedicated Sending Domains for every client, Conversation AI and Voice AI for your agency sub-account.
Stripe link: https://buy.stripe.com/eVqcMYg9L5IraYi6jh1ck02

4. CLIENT ONBOARDING PACKS - one time purchase, no expiry
Pack of 4 at $397: https://buy.stripe.com/28EbIUg9Lgn52rMdLJ1ck07
Pack of 10 at $870 which is $87 each: https://buy.stripe.com/8x24gsf5Hc6PeaudLJ1ck06
Pack of 25 at $1925 which is $77 each: https://buy.stripe.com/8x27sEg9L0o78QacHF1ck05
Single onboarding at $99 - book a call for this.

5. GHL THEME BUILDER standalone
Monthly at $147: https://buy.stripe.com/14A14g7Dffj11nI0YX1ck03
Annual at $1497: https://buy.stripe.com/3cI14g8Hjc6PaYi9vt1ck04

BOOK A DEMO: https://thecliqlabs.com/book-a-call.html
EMAIL: thecliqlabs@gmail.com

KEY FACTS:
No contracts. Cancel anytime. Support response time under 1 minute. Support is handled by our trained team but branded 100% as the client's agency. Their clients never know it's us. English only. No free trial but no contracts so zero risk.

WHAT MAKES US BETTER THAN HL PRO TOOLS AND EXTENDLY:
Better pricing, more reliable, we run the backend of your agency for you, your clients think it is your team.

HOW TO TALK:
Sound like a real person. Short messages. Max 3 to 4 sentences at a time. Do not use bullet points for every reply, sometimes just talk naturally. Ask one question at a time. Use their name if you know it. Do not be pushy but do not be soft either, you are here to close. If they ask something you do not know say let me get someone from our team to reach out and ask for their email. Never say Certainly, Great question, or Absolutely. Do not use em dashes. Do not use markdown asterisks or formatting symbols in your responses. Be real. Be warm. Be direct.

CLOSING APPROACH:
Find their pain first. Ask what is eating their time. Match to the right plan based on client count and needs. When ready to close send the direct Stripe link. If hesitant push for the demo call at https://thecliqlabs.com/book-a-call.html. If they say let me think ask what is holding them back and address it. If you cannot handle the objection offer to have someone from the team reach out personally. Last resort get their email and tell them someone will follow up within a few hours.

COMMON OBJECTIONS:
Too expensive: Compare to cost of hiring even one support person. $197/mo vs $2000+ per month employee. No brainer.
I will do it myself: Ask how that is working. Most agency owners saying this are already overwhelmed.
I need to think about it: Ask what specifically they need to think about. Usually it is one thing you can address.
Not enough clients yet: Core at $197 is perfect to set up now so you are ready when you scale.
What if it does not work: No contracts. Cancel anytime. Zero risk.

REMEMBER:
You represent CliqLabs. Every conversation matters. Close or get the lead. That is the job.`;

function callClaude(messages) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 400,
      system: SYSTEM_PROMPT,
      messages: messages
    });

    const req = https.request({
      hostname: 'api.anthropic.com',
      path: '/v1/messages',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'Content-Length': Buffer.byteLength(body)
      }
    }, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.content && parsed.content[0]) {
            resolve(parsed.content[0].text);
          } else {
            console.error('Claude bad response:', JSON.stringify(parsed).substring(0, 300));
            reject(new Error('No content in response'));
          }
        } catch(e) {
          console.error('Claude parse error:', e.message, data.substring(0, 200));
          reject(e);
        }
      });
    });
    req.on('error', e => { console.error('Claude request error:', e.message); reject(e); });
    req.write(body);
    req.end();
  });
}

function createGHLContact(leadInfo, conversation) {
  return new Promise((resolve) => {
    const name = (leadInfo.name || '').trim();
    const body = JSON.stringify({
      firstName: name.split(' ')[0] || name,
      lastName: name.split(' ').slice(1).join(' ') || '',
      email: leadInfo.email || '',
      phone: leadInfo.phone || '',
      companyName: leadInfo.agency || '',
      locationId: GHL_LOCATION_ID,
      tags: ['clio-chat', 'website-lead'],
      source: 'CliqLabs Website - Clio AI'
    });

    const req = https.request({
      hostname: 'services.leadconnectorhq.com',
      path: '/contacts/',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GHL_API_KEY}`,
        'Version': '2021-07-28',
        'Content-Length': Buffer.byteLength(body)
      }
    }, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          // Handle duplicate — GHL returns existing contactId in meta
          if (parsed.statusCode === 400 && parsed.meta && parsed.meta.contactId) {
            console.log('Contact exists, using existing ID:', parsed.meta.contactId);
            resolve({ contact: { id: parsed.meta.contactId } });
          } else {
            console.log('GHL Contact created:', JSON.stringify(parsed).substring(0, 200));
            resolve(parsed);
          }
        } catch(e) {
          console.error('GHL Contact error:', e.message, data.substring(0, 200));
          resolve(null);
        }
      });
    });
    req.on('error', e => { console.error('GHL request error:', e.message); resolve(null); });
    req.write(body);
    req.end();
  });
}

function addGHLNote(contactId, leadInfo, conversation) {
  return new Promise((resolve) => {
    const noteText = `Clio AI Chat - Website Lead\n\nAgency: ${leadInfo.agency || 'N/A'}\nPhone: ${leadInfo.phone || 'N/A'}\n\nConversation:\n${conversation}`;
    const body = JSON.stringify({ body: noteText });

    const req = https.request({
      hostname: 'services.leadconnectorhq.com',
      path: `/contacts/${contactId}/notes`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GHL_API_KEY}`,
        'Version': '2021-07-28',
        'Content-Length': Buffer.byteLength(body)
      }
    }, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        console.log('GHL Note added:', data.substring(0, 200));
        resolve();
      });
    });
    req.on('error', e => { console.error('GHL note error:', e.message); resolve(); });
    req.write(body);
    req.end();
  });
}


function createGHLConversation(contactId) {
  return new Promise((resolve) => {
    const body = JSON.stringify({
      locationId: GHL_LOCATION_ID,
      contactId: contactId
    });
    const req = https.request({
      hostname: 'services.leadconnectorhq.com',
      path: '/conversations/',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GHL_API_KEY}`,
        'Version': '2021-07-28',
        'Content-Length': Buffer.byteLength(body)
      }
    }, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          console.log('GHL Conversation:', JSON.stringify(parsed).substring(0, 200));
          resolve(parsed);
        } catch(e) { console.error('Conv error:', e.message); resolve(null); }
      });
    });
    req.on('error', e => { console.error('Conv req error:', e.message); resolve(null); });
    req.write(body);
    req.end();
  });
}

function sendGHLMessage(conversationId, text, type) {
  return new Promise((resolve) => {
    const body = JSON.stringify({
      conversationId: conversationId,
      locationId: GHL_LOCATION_ID,
      message: text,
      type: type || 'Custom',
      direction: type === 'inbound' ? 'inbound' : 'outbound'
    });
    const req = https.request({
      hostname: 'services.leadconnectorhq.com',
      path: '/conversations/messages',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GHL_API_KEY}`,
        'Version': '2021-07-28',
        'Content-Length': Buffer.byteLength(body)
      }
    }, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          console.log('GHL Message sent:', JSON.stringify(parsed).substring(0, 150));
          resolve(parsed);
        } catch(e) { console.error('Msg error:', e.message); resolve(null); }
      });
    });
    req.on('error', e => { console.error('Msg req error:', e.message); resolve(null); });
    req.write(body);
    req.end();
  });
}

const server = http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') { res.writeHead(200); res.end(); return; }

  if (req.method === 'POST' && req.url === '/api/clio') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', async () => {
      try {
        const { messages, contactInfo } = JSON.parse(body);

        // Save contact to GHL on first message after form submit
        if (contactInfo && contactInfo.email && contactInfo.name) {
          const conversation = (messages || []).map(m => `${m.role === 'user' ? 'Visitor' : 'Clio'}: ${m.content}`).join('\n');
          let contactId = contactMap.get(contactInfo.email);
          
          if (!contactId) {
            // First time - create contact
            const ghlRes = await createGHLContact(contactInfo, conversation);
            if (ghlRes && (ghlRes.contact || ghlRes.id)) {
              contactId = ghlRes.contact ? ghlRes.contact.id : ghlRes.id;
              if (contactId) contactMap.set(contactInfo.email, contactId);
            }
          }
          
          // Update note every 3 messages to keep GHL updated without spam
          if (contactId && messages && messages.length % 3 === 0) {
            await addGHLNote(contactId, contactInfo, conversation);
          } else if (contactId && !contactMap.has(contactInfo.email + '_noted')) {
            // Always add first note
            contactMap.set(contactInfo.email + '_noted', true);
            await addGHLNote(contactId, contactInfo, conversation);
          }
        }

        const reply = await callClaude(messages || []);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ reply }));
      } catch(e) {
        console.error('Handler error:', e.message);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: e.message }));
      }
    });
  } else {
    res.writeHead(404);
    res.end();
  }
});

server.listen(3001, () => console.log('Clio API server running on port 3001'));
