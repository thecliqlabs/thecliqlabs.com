const http = require('http');
const https = require('https');
const querystring = require('querystring');

// Load env vars
require('fs').readFileSync('/etc/environment', 'utf8').split('\n').forEach(line => {
  const [k, ...rest] = line.split('=');
  if (k && rest.length) process.env[k.trim()] = rest.join('=').trim().replace(/^"|"$/g, '');
});

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
console.log('Stripe Key:', STRIPE_SECRET_KEY ? 'loaded' : 'MISSING');

// Map of internal plan IDs to Stripe Price IDs.
// IMPORTANT: these placeholder Price IDs must be replaced with the real
// Stripe Price IDs from your Stripe Dashboard (Products > [Product] > Pricing).
// The existing buy.stripe.com payment links are NOT the same as Price IDs.
const PRICE_MAP = {
  'diamond': process.env.STRIPE_PRICE_DIAMOND || 'price_1Thku42Ke4aqimc2aQHBORrt'
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
        console.log('[Stripe Response]', res.statusCode, data.substring(0, 500));
        try {
          const parsed = JSON.parse(data);
          resolve(parsed);
        } catch (e) {
          console.error('[Stripe Parse Error]', e.message, 'Raw data:', data.substring(0, 300));
          reject(e);
        }
      });
    });
    req.on('error', e => {
      console.error('[Stripe Request Error]', e.message);
      reject(e);
    });
    if (body) req.write(body);
    req.end();
  });
}

// Create or retrieve a Stripe Customer for this email
async function getOrCreateCustomer(email, name, phone) {
  const search = await stripeRequest(
    `/v1/customers/search?query=${encodeURIComponent(`email:'${email}'`)}`,
    'GET'
  );
  if (search.data && search.data.length > 0) {
    return search.data[0];
  }
  return stripeRequest('/v1/customers', 'POST', {
    email: email,
    name: name,
    phone: phone || ''
  });
}

// Create a SetupIntent so the frontend (Stripe Elements) can securely collect card details
async function createSetupIntent(customerId) {
  return stripeRequest('/v1/setup_intents', 'POST', {
    customer: customerId,
    'payment_method_types[]': 'card'
  });
}

// Create the actual subscription once the payment method is attached
async function createSubscription(customerId, priceId, paymentMethodId) {
  return stripeRequest('/v1/subscriptions', 'POST', {
    customer: customerId,
    'items[0][price]': priceId,
    default_payment_method: paymentMethodId,
    'expand[0]': 'latest_invoice.payment_intent'
  });
}

const server = http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') { res.writeHead(200); res.end(); return; }

  // Step 1: visitor fills the form -> create customer + SetupIntent, return client_secret
  if (req.method === 'POST' && req.url === '/api/checkout/init') {
    let body = '';
    req.on('data', c => body += c);
    req.on('end', async () => {
      try {
        console.log('[checkout/init] body received:', body.substring(0, 200));
        const { plan, name, email, phone } = JSON.parse(body);
        const priceId = PRICE_MAP[plan];
        console.log('[checkout/init] plan:', plan, 'priceId:', priceId);
        if (!priceId) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Unknown plan' }));
          return;
        }
        const customer = await getOrCreateCustomer(email, name, phone);
        console.log('[checkout/init] customer result:', JSON.stringify(customer).substring(0, 300));
        if (!customer.id) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Could not create customer', detail: customer }));
          return;
        }
        const setupIntent = await createSetupIntent(customer.id);
        console.log('[checkout/init] setupIntent result:', JSON.stringify(setupIntent).substring(0, 300));
        if (!setupIntent.client_secret) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Could not create setup intent', detail: setupIntent }));
          return;
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          client_secret: setupIntent.client_secret,
          customer_id: customer.id
        }));
      } catch (e) {
        console.error('[checkout/init] EXCEPTION:', e.message, e.stack);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: e.message }));
      }
    });
    return;
  }

  // Step 2: after Stripe Elements confirms the SetupIntent on the frontend,
  // the browser sends us the resulting payment_method_id to start the subscription
  if (req.method === 'POST' && req.url === '/api/checkout/subscribe') {
    let body = '';
    req.on('data', c => body += c);
    req.on('end', async () => {
      try {
        console.log('[checkout/subscribe] body received:', body.substring(0, 300));
        const { plan, customer_id, payment_method_id } = JSON.parse(body);
        const priceId = PRICE_MAP[plan];
        const sub = await createSubscription(customer_id, priceId, payment_method_id);
        console.log('[checkout/subscribe] subscription result:', JSON.stringify(sub).substring(0, 400));
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ subscription: sub }));
      } catch (e) {
        console.error('[checkout/subscribe] EXCEPTION:', e.message, e.stack);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: e.message }));
      }
    });
    return;
  }

  res.writeHead(404);
  res.end();
});

server.listen(3002, () => console.log('Stripe checkout server running on port 3002'));
