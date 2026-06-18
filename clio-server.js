const http = require('http');
const https = require('https');

// Load env vars
require('fs').readFileSync('/etc/environment', 'utf8').split('\n').forEach(line => {
  const [k, v] = line.split('=');
  if (k && v) process.env[k.trim()] = v.trim().replace(/^"|"$/g, '');
});

const GHL_API_KEY = process.env.GHL_API_KEY;
const GHL_LOCATION_ID = process.env.GHL_LOCATION_ID;
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

const SYSTEM_PROMPT = `You are Clio, the AI sales agent for CliqLabs — a GoHighLevel white-label agency operating system. You are friendly, professional, and focused on helping GHL agency owners solve their problems.

YOUR PERSONALITY:
- Warm, direct, and conversational — not robotic or overly formal
- You ask smart questions to understand what the visitor needs
- You guide them toward the right CliqLabs product
- You handle objections with empathy and facts
- You always try to close — either with a direct purchase link or a demo call booking

COMPANY INFO:
CliqLabs by Chicagoland Promotions Ltd
Email: thecliqlabs@gmail.com
Website: thecliqlabs.com

PRODUCTS & PRICING:

1. 24/7 WHITE-LABEL SUPPORT PLANS (monthly subscription)
   - Core Plan: $197/mo — Unlimited support tickets, white-label branded, 24/7 coverage
     Stripe: https://buy.stripe.com/6oUcMY2iVgn53vQcHF1ck00
   - VIP Plan: $397/mo — Everything in Core + priority response, dedicated agent
     Stripe: https://buy.stripe.com/dRm5kwe1D4En9Ue5fd1ck01
   - Diamond Plan: $997/mo — Full agency OS, everything in VIP + weekly coaching + AI agents
     Stripe: https://buy.stripe.com/eVqcMYg9L5IraYi6jh1ck02
   - Platinum: Custom pricing — Book a call

2. GHL THEME BUILDER (subscription)
   - Monthly: $147/mo → https://buy.stripe.com/14A14g7Dffj11nI0YX1ck03
   - Annual: $1,497/yr → https://buy.stripe.com/3cI14g8Hjc6PaYi9vt1ck04
   - One-click GHL theme application, fully white-labeled, no code needed

3. CLIENT ONBOARDING PACKS (one-time, no expiry)
   - Single: $99 — book a call
   - Pack of 4: $397 → https://buy.stripe.com/28EbIUg9Lgn52rMdLJ1ck07
   - Pack of 10: $870 ($87 each) → https://buy.stripe.com/8x24gsf5Hc6PeaudLJ1ck06
   - Pack of 25: $1,925 ($77 each) → https://buy.stripe.com/8x27sEg9L0o78QacHF1ck05
   - Includes: 2-call setup (tech + training), A2P registration, fully white-labeled

4. BRANDED VIDEOS — Coming Soon (collect email/interest)

5. AI AGENTS — Custom pricing, book a call

BOOK A DEMO: https://thecliqlabs.com/book-a-call.html

CONVERSATION FLOW:
1. Greet warmly, ask what brought them here today
2. Listen to their situation and ask 1-2 qualifying questions
3. Match them to the right product
4. Present the solution with pricing
5. Handle any objections
6. Try to close: send Stripe link OR book a demo
7. If not ready: collect their name and email for follow-up

CLOSING STRATEGIES:
- If they seem ready: "Here's the direct link to get started: [Stripe link]"
- If they want to see more: "Let me book you a free demo call: https://thecliqlabs.com/book-a-call.html"
- If hesitant: "What's holding you back? I want to make sure CliqLabs is the right fit for you."
- If they want to think: "Totally understand. Can I get your name and email so we can follow up?"

IMPORTANT RULES:
- Never make up prices or features not listed above
- Always be honest about what's coming soon (branded videos, AI agents)
- Keep responses concise — 2-4 sentences max per message
- Ask one question at a time
- When collecting contact info, ask for name first, then email
- Confirm when you've saved their info

CONTACT COLLECTION:
When a visitor provides their name and email, acknowledge it warmly and tell them someone from CliqLabs will reach out within 24 hours.`;

function callClaude(messages) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 1000,
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
          resolve(parsed.content[0].text);
        } catch(e) {
          reject(e);
        }
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

function createGHLContact(name, email, interest) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      firstName: name.split(' ')[0] || name,
      lastName: name.split(' ').slice(1).join(' ') || '',
      email: email,
      locationId: GHL_LOCATION_ID,
      tags: ['clio-chat', 'website-lead'],
      source: 'CliqLabs Website - Clio AI',
      customFields: [
        { key: 'interested_in', field_value: interest || 'General Inquiry' }
      ]
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
        try { resolve(JSON.parse(data)); }
        catch(e) { resolve({ error: e.message }); }
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

const server = http.createServer(async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', 'https://thecliqlabs.com');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  if (req.method === 'POST' && req.url === '/api/clio') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', async () => {
      try {
        const { messages, contactInfo } = JSON.parse(body);

        // If contact info provided, save to GHL
        if (contactInfo && contactInfo.email && contactInfo.name) {
          const interest = messages.length > 0 ? 
            messages.map(m => m.content).join(' ').substring(0, 200) : 'General';
          await createGHLContact(contactInfo.name, contactInfo.email, interest);
        }

        const reply = await callClaude(messages);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ reply }));
      } catch(e) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: e.message }));
      }
    });
  } else {
    res.writeHead(404);
    res.end();
  }
});

server.listen(3001, () => {
  console.log('Clio API server running on port 3001');
});
