const baseUrl = process.env.HA_FIXTURE_URL || 'http://127.0.0.1:8123';
const timeoutMs = Number(process.env.HA_FIXTURE_TIMEOUT_MS || 240000);
const start = Date.now();

async function sleep(ms) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

while (Date.now() - start < timeoutMs) {
  try {
    const response = await fetch(`${baseUrl}/`);
    if (response.ok || response.status === 401) {
      console.log(`[ha-fixture] Home Assistant responded with ${response.status}`);
      process.exit(0);
    }
  } catch (error) {
    // keep waiting
  }

  await sleep(3000);
}

console.error(`[ha-fixture] Timed out waiting for ${baseUrl}`);
process.exit(1);
