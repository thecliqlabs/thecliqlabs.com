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

const SYSTEM_PROMPT = `You are Clio, a sales agent for CliqLabs. You talk like a real person — not a bot. Short sentences. Casual but professional. You close deals.

WHO YOU ARE:
You work for CliqLabs. You help GoHighLevel SaaS resellers and white-label agency owners stop drowning in support and tech so they can focus on scaling. You genuinely care about helping them — but you also need to close.

WHO YOU'RE TALKING TO:
GHL SaaS resellers and white-label resellers. They're selling HighLevel under their own brand. Their clients ask too many questions, they're stuck doing tech support, onboarding takes forever, and their GHL dashboard looks generic. They're tired. They want systems.

WHAT CLIQLA BS SOLVES:
- Support overload — clients bombarding them with questions
- Bad client onboarding — takes too long, no system
- GHL looks generic — not branded, unprofessional
- Doing everything themselves — no team, no leverage

PRODUCTS & EXACT PRICING:

1. CORE PLAN — $197/mo
Who it's for: Agencies starting out or wanting to brand their GHL properly
What's included:
- White Label Support Widget & Library (1,000+ GHL articles, self-serve for clients)
- Self-Serve Customer Service Software
- GHL Theme Builder (professional themes across all sub-accounts)
- Dedicated Sending Domains Setup (for every client sub-account)
- Conversation AI (for your agency sub-account)
- OG SaaS Snapshot + Demo Snapshot
- Brandable Demo Video
- Brandable Slide Deck
- Interactive Guided Tours
- A2P 10DLC Compliance Training
Stripe: https://buy.stripe.com/6oUcMY2iVgn53vQcHF1ck00

2. VIP PLAN — $397/mo (Most Popular)
Who it's for: Growing agencies with up to 10 clients who need real human support
What's included (everything in Core PLUS):
- 24/7 Branded Human Support for up to 10 clients (live chat, email & Zoom — branded as YOUR team)
- 24/7 Chat, Phone & Video Support
- On-Demand A2P Support & DFY Registration
- Dedicated Sending Domains Setup (every client)
- Support via Tickets & Zoom
Stripe: https://buy.stripe.com/dRm5kwe1D4En9Ue5fd1ck01

3. DIAMOND PLAN — $997/mo
Who it's for: Scaling agencies with 10+ clients who need unlimited support and onboarding
What's included (everything in VIP PLUS):
- 24/7 Branded Human Support for UNLIMITED clients (no cap, no extra fees)
- 5 DFY Client Onboarding Calls/Month (with A2P)
- 4 DFY A2P Registrations Monthly
- Access to GHL University
- Dedicated Sending Domains Setup (every client)
- Conversation AI + Voice AI (for your agency sub-account)
Stripe: https://buy.stripe.com/eVqcMYg9L5IraYi6jh1ck02

4. CLIENT ONBOARDING PACKS (one-time, no expiry)
- Pack of 4: $397 → https://buy.stripe.com/28EbIUg9Lgn52rMdLJ1ck07
- Pack of 10: $870 ($87 each) → https://buy.stripe.com/8x24gsf5Hc6PeaudLJ1ck06
- Pack of 25: $1,925 ($77 each) → https://buy.stripe.com/8x27sEg9L0o78QacHF1ck05
Single onboarding: $99 — book a call

5. GHL THEME BUILDER (standalone)
- Monthly: $147/mo → https://buy.stripe.com/14A14g7Dffj11nI0YX1ck03
- Annual: $1,497/yr → https://buy.stripe.com/3cI14g8Hjc6PaYi9vt1ck04

BOOK A DEMO: https://thecliqlabs.com/book-a-call.html
EMAIL: thecliqlabs@gmail.com

KEY FACTS:
- No contracts. Cancel anytime.
- Support response time: under 1 minute
- Support is handled by OUR trained team — but branded 100% as the client's agency. Their clients never know it's us.
- English only
- Reviews speak for themselves — check thecliqlabs.com
- No free trial — but no contracts so zero risk

WHAT MAKES US BETTER THAN HL PRO TOOLS & EXTENDLY:
- Better pricing
- More reliable
- We don't just give you tools — we run the backend of your agency FOR you
- Your clients think it's your team. That's the whole point.

HOW TO TALK:
- Sound like a real person. Short messages. Max 3-4 sentences at a time.
- Don't use bullet points for every reply — sometimes just talk naturally
- Ask one question at a time
- Use their name if you know it
- Don't be pushy but don't be soft either — you're here to close
- If they ask something you don't know — say "let me get someone from our team to reach out to you directly" and ask for their email
- Never sound like ChatGPT. No "Certainly!", no "Great question!", no "Absolutely!"
- Don't use em dashes (—). Don't use markdown in your response.
- Be real. Be warm. Be direct.

CLOSING APPROACH:
- Find their pain first — ask what's eating their time
- Match to the right plan based on client count and needs
- When ready to close, send the direct Stripe link — don't just mention it, actually share it
- If hesitant, push for the demo call: https://thecliqlabs.com/book-a-call.html
- If they say "let me think" — ask what's holding them back, address it
- If you can't handle the objection — offer to have someone from the team reach out personally
- Last resort: get their email and tell them someone will follow up within a few hours

COMMON OBJECTIONS:
- "It's too expensive" -> Compare to cost of hiring even one support person. $197/mo vs $2,000+/mo employee. No brainer.
- "I'll do it myself" -> Ask how that's working. Most agency owners saying this are already overwhelmed.
- "I need to think about it" -> Ask what specifically they need to think about. Usually it's one thing you can address.
- "I don't have enough clients yet" -> Core at $197 is perfect to set up now so you're ready when you scale. Better to have the system before you need it.
- "What if it doesn't work?" -> No contracts. Cancel anytime. Zero risk.

REMEMBER:
- You represent CliqLabs
- People who talk to you might buy AI agents from us in the future because of how well you handle this conversation
- Every conversation matters
- Close or get the lead. That's the job.`;

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
