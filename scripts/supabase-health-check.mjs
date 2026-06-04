import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const envPath = resolve(process.cwd(), 'apps/mobile/.env');
const env = parseEnv(readFileSync(envPath, 'utf8'));
const supabaseUrl = env.EXPO_PUBLIC_SUPABASE_URL;
const publishableKey = env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!isUsableValue(supabaseUrl) || !isUsableValue(publishableKey)) {
  console.error('Supabase env is missing or still uses placeholders.');
  process.exit(1);
}

const checks = [
  {
    name: 'discovery_markets',
    path: '/rest/v1/discovery_markets?select=label&active=eq.true&limit=1',
  },
  {
    name: 'events',
    path: '/rest/v1/events?select=id,title,status&limit=1',
  },
  {
    name: 'profiles',
    path: '/rest/v1/profiles?select=id&limit=1',
  },
];

let failed = false;

for (const check of checks) {
  const response = await fetch(`${supabaseUrl}${check.path}`, {
    headers: {
      apikey: publishableKey,
      Authorization: `Bearer ${publishableKey}`,
    },
  });
  const body = await response.text();

  if (!response.ok) {
    failed = true;
    console.error(`${check.name}: ${response.status} ${summarize(body)}`);
    continue;
  }

  console.log(`${check.name}: ok`);
}

if (failed) {
  process.exit(1);
}

function parseEnv(contents) {
  return Object.fromEntries(
    contents
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith('#'))
      .map((line) => {
        const index = line.indexOf('=');
        return [line.slice(0, index), line.slice(index + 1).replace(/^["']|["']$/g, '')];
      }),
  );
}

function isUsableValue(value) {
  return Boolean(
    value &&
      value.trim() &&
      !value.includes('your-project-ref') &&
      !value.includes('your_key_here') &&
      value !== 'sb_publishable_your_key_here',
  );
}

function summarize(body) {
  try {
    const parsed = JSON.parse(body);
    return parsed.message ?? body.slice(0, 180);
  } catch {
    return body.slice(0, 180);
  }
}
