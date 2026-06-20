const http = require('http');
const https = require('https');
const querystring = require('querystring');
const crypto = require('crypto');

require('fs').readFileSync('/etc/environment', 'utf8').split('\n').forEach(line => {
  const [k, ...rest] = line.split('=');
  if (k && rest.length) process.env[k.trim()] = rest.join('=').trim().replace(/^"|"$/g, '');
});

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;
const GHL_API_KEY = process.env.GHL_API_KEY;
const GHL_LOCATION_ID = process.env.GHL_LOCATION_ID;

console.log('Stripe Key:', STRIPE_SECRET_KEY ? 'loaded' : 'MISSING');
console.log('Stripe Webhook Secret:', STRIPE_WEBHOOK_SECRET ? 'loaded' : 'MISSING (webhook signature verification disabled)');
console.log('GHL Key:', GHL_API_KEY ? 'loaded' : 'MISSING');

// Map of internal plan IDs to Stripe Price IDs (LIVE prices, swap to test prices while testing).
const PRICE_MAP = {
  'diamond': process.env.STRIPE_PRICE_DIAMOND || 'price_1Thku42Ke4aqimc2aQHBORrt',
  'vip': process.env.STRIPE_PRICE_VIP || '',
  'core': process.env.STRIPE_PRICE_CORE || ''
};

const PLAN_LABELS = {
  diamond: 'Diamond Plan',
  vip: 'VIP Plan',
  core: 'Core Plan'
};

function stripeRequest(path, method, formData) {
  return new Promise((resolve, reject) => {
    const body = formData ? querystring.stringify(formData) : '';
    console.log('[Stripe Request]', method, path);
    const req = https.request({
      hostname: 'api.stripe.com',
      path: path,
      method: method,
      headers: {
        'Authorization': `Bearer ${STRIPE_SECRET_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(body)
      }
    }, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        console.log('[Stripe Response]', res.statusCode, data.substring(0, 400));
        try { resolve(JSON.parse(data)); }
        catch (e) { console.error('[Stripe Parse Error]', e.message); reject(e); }
      });
    });
    req.on('error', e => { console.error('[Stripe Request Error]', e.message); reject(e); });
    if (body) req.write(body);
    req.end();
  });
}

async function getOrCreateCustomer(email, name, phone) {
  const search = await stripeRequest(`/v1/customers/search?query=${encodeURIComponent(`email:'${email}'`)}`, 'GET');
  if (search.data && search.data.length > 0) return search.data[0];
  return stripeRequest('/v1/customers', 'POST', { email, name, phone: phone || '' });
}

// Create the subscription in "incomplete" state up front.
// This returns a PaymentIntent whose client_secret we hand to Stripe's
// Payment Element, which automatically shows card, Apple Pay, Google Pay,
// Link, Cash App Pay, etc. based on what's enabled in the Stripe Dashboard
// and what the visitor's browser/device supports.
async function createIncompleteSubscription(customerId, priceId, plan, email, name) {
  return stripeRequest('/v1/subscriptions', 'POST', {
    customer: customerId,
    'items[0][price]': priceId,
    payment_behavior: 'default_incomplete',
    'payment_settings[save_default_payment_method]': 'on_subscription',
    'expand[0]': 'latest_invoice.payment_intent',
    'metadata[plan]': plan,
    'metadata[customer_email]': email,
    'metadata[customer_name]': name
  });
}

function createGHLContact(name, email, phone, plan) {
  return new Promise((resolve) => {
    if (!GHL_API_KEY || !GHL_LOCATION_ID) { resolve(null); return; }
    const nameParts = (name || '').trim().split(' ');
    const body = JSON.stringify({
      firstName: nameParts[0] || name,
      lastName: nameParts.slice(1).join(' ') || '',
      email: email,
      phone: phone || '',
      locationId: GHL_LOCATION_ID,
      tags: ['stripe-checkout', `plan-${plan}`, 'new-customer'],
      source: 'CliqLabs Checkout'
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
      res.on('data', c => data += c);
      res.on('end', () => {
        console.log('[GHL Contact]', data.substring(0, 300));
        try { resolve(JSON.parse(data)); } catch (e) { resolve(null); }
      });
    });
    req.on('error', e => { console.error('[GHL Contact Error]', e.message); resolve(null); });
    req.write(body);
    req.end();
  });
}

function verifyStripeSignature(payload, signatureHeader, secret) {
  if (!secret || !signatureHeader) return false;
  const parts = signatureHeader.split(',').reduce((acc, part) => {
    const [k, v] = part.split('=');
    acc[k] = v;
    return acc;
  }, {});
  const timestamp = parts.t;
  const signature = parts.v1;
  const signedPayload = `${timestamp}.${payload}`;
  const expected = crypto.createHmac('sha256', secret).update(signedPayload, 'utf8').digest('hex');
  try {
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
  } catch (e) {
    return false;
  }
}

const server = http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Stripe-Signature');

  if (req.method === 'OPTIONS') { res.writeHead(200); res.end(); return; }

  // Create customer + incomplete subscription, return PaymentIntent client_secret
  // for the frontend Payment Element to collect ANY supported payment method.
  if (req.method === 'POST' && req.url === '/api/checkout/init') {
    let body = '';
    req.on('data', c => body += c);
    req.on('end', async () => {
      try {
        const { plan, name, email, phone } = JSON.parse(body);
        const priceId = PRICE_MAP[plan];
        if (!priceId) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'This plan is not yet available for checkout.' }));
          return;
        }
        const customer = await getOrCreateCustomer(email, name, phone);
        if (!customer.id) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Could not create customer.' }));
          return;
        }
        const sub = await createIncompleteSubscription(customer.id, priceId, plan, email, name);
        const pi = sub.latest_invoice && sub.latest_invoice.payment_intent;
        if (!pi || !pi.client_secret) {
          console.error('[checkout/init] No payment intent on subscription:', JSON.stringify(sub).substring(0, 500));
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Could not initialize payment.' }));
          return;
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          client_secret: pi.client_secret,
          subscription_id: sub.id
        }));
      } catch (e) {
        console.error('[checkout/init] EXCEPTION:', e.message);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Something went wrong setting up checkout.' }));
      }
    });
    return;
  }

  // Update the customer record with real details once the visitor fills the form
  // (called right before confirmPayment, since the PaymentIntent/customer was
  // created with placeholder info when the page first loaded)
  if (req.method === 'POST' && req.url === '/api/checkout/update-customer') {
    let body = '';
    req.on('data', c => body += c);
    req.on('end', async () => {
      try {
        const { subscription_id, name, email, phone } = JSON.parse(body);
        const sub = await stripeRequest(`/v1/subscriptions/${subscription_id}`, 'GET');
        if (sub.customer) {
          await stripeRequest(`/v1/customers/${sub.customer}`, 'POST', { name, email, phone: phone || '' });
          await stripeRequest(`/v1/subscriptions/${subscription_id}`, 'POST', {
            'metadata[customer_email]': email,
            'metadata[customer_name]': name
          });
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: true }));
      } catch (e) {
        console.error('[update-customer] EXCEPTION:', e.message);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: e.message }));
      }
    });
    return;
  }

  // Stripe webhook: the ONLY trusted source of truth that payment actually succeeded.
  // Verified via signature so nobody can fake a "payment succeeded" call.
  if (req.method === 'POST' && req.url === '/api/checkout/webhook') {
    let rawBody = '';
    req.on('data', c => rawBody += c);
    req.on('end', async () => {
      const signature = req.headers['stripe-signature'];
      const verified = verifyStripeSignature(rawBody, signature, STRIPE_WEBHOOK_SECRET);
      if (!verified) {
        console.error('[webhook] Signature verification FAILED, rejecting');
        res.writeHead(400);
        res.end('Signature verification failed');
        return;
      }
      try {
        const event = JSON.parse(rawBody);
        console.log('[webhook] Verified event:', event.type);

        if (event.type === 'invoice.payment_succeeded' || event.type === 'customer.subscription.created') {
          const obj = event.data.object;
          const metadata = obj.metadata || (obj.subscription_details && obj.subscription_details.metadata) || {};
          const email = metadata.customer_email;
          const name = metadata.customer_name;
          const plan = metadata.plan;
          if (email && plan) {
            await createGHLContact(name, email, '', plan);
            console.log('[webhook] GHL contact created for verified payment:', email, plan);
          }
        }
        res.writeHead(200);
        res.end('ok');
      } catch (e) {
        console.error('[webhook] EXCEPTION:', e.message);
        res.writeHead(400);
        res.end('error');
      }
    });
    return;
  }

  res.writeHead(404);
  res.end();
});

server.listen(3002, () => console.log('Stripe checkout server running on port 3002'));
