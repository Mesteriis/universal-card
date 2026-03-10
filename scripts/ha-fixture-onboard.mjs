const baseUrl = process.env.HA_FIXTURE_URL || 'http://127.0.0.1:8123';
const clientId = process.env.HA_FIXTURE_CLIENT_ID || `${baseUrl}/`;
const username = process.env.HA_FIXTURE_USERNAME || 'fixture';
const password = process.env.HA_FIXTURE_PASSWORD || 'fixture-pass-123';
const displayName = process.env.HA_FIXTURE_NAME || 'Fixture Admin';
const language = process.env.HA_FIXTURE_LANGUAGE || 'en';

async function jsonFetch(url, options = {}) {
  const response = await fetch(url, options);
  const text = await response.text();
  const isJson = response.headers.get('content-type')?.includes('application/json');
  const data = text && isJson ? JSON.parse(text) : {};

  if (!response.ok) {
    throw new Error(`[ha-fixture] ${url} -> ${response.status}: ${text}`);
  }

  return data;
}

let status;

try {
  status = await jsonFetch(`${baseUrl}/api/onboarding`);
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  if (message.includes('/api/onboarding -> 404')) {
    console.log('[ha-fixture] onboarding endpoint unavailable, assuming fixture is already initialized');
    process.exit(0);
  }

  throw error;
}

const doneSteps = new Set(status.filter((step) => step.done).map((step) => step.step));

if (doneSteps.size === status.length) {
  console.log('[ha-fixture] onboarding already completed');
  process.exit(0);
}

if (doneSteps.has('user')) {
  throw new Error('[ha-fixture] user onboarding is already completed but later onboarding steps are not. Reset the fixture state before re-running bootstrap.');
}

const user = await jsonFetch(`${baseUrl}/api/onboarding/users`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: displayName,
    username,
    password,
    client_id: clientId,
    language
  })
});

const tokenResponse = await fetch(`${baseUrl}/auth/token`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: new URLSearchParams({
    grant_type: 'authorization_code',
    code: user.auth_code,
    client_id: clientId
  })
});

const tokenJson = await tokenResponse.json();
if (!tokenResponse.ok || !tokenJson.access_token) {
  throw new Error(`[ha-fixture] token exchange failed: ${JSON.stringify(tokenJson)}`);
}

const authHeaders = {
  Authorization: `Bearer ${tokenJson.access_token}`,
  'Content-Type': 'application/json'
};

await jsonFetch(`${baseUrl}/api/onboarding/core_config`, {
  method: 'POST',
  headers: authHeaders
});

await jsonFetch(`${baseUrl}/api/onboarding/analytics`, {
  method: 'POST',
  headers: authHeaders
});

await jsonFetch(`${baseUrl}/api/onboarding/integration`, {
  method: 'POST',
  headers: authHeaders,
  body: JSON.stringify({
    client_id: clientId,
    redirect_uri: clientId
  })
});

console.log(`[ha-fixture] onboarding completed for ${username}`);
