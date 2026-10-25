// Owner-only report using a Cloudflare token with Workers KV Storage Read.
// No secrets are bundled into the website; no public statistics endpoint exists.
const account = process.env.CLOUDFLARE_ACCOUNT_ID || 'da7cee06eb15c1bf1bdd626ea17395df';
const token = process.env.CLOUDFLARE_API_TOKEN;
if (!token) throw new Error('Set CLOUDFLARE_API_TOKEN with Workers KV Storage Read.');
async function get(path) {
  const response = await fetch(`https://api.cloudflare.com/client/v4/accounts/${account}${path}`, { headers: { Authorization: `Bearer ${token}` } });
  const data = await response.json();
  if (!data.success) throw new Error(`Cloudflare request failed (${response.status}). Check token permissions.`);
  return data;
}
const project = (await get('/pages/projects/nook')).result;
const namespace = project.deployment_configs.production.kv_namespaces.USAGE?.namespace_id;
if (!namespace) throw new Error('Production USAGE binding is missing.');
const days = new Map();
let cursor = '';
do {
  const params = new URLSearchParams({ prefix: 'gpx-import:', limit: '1000', ...(cursor ? { cursor } : {}) });
  const page = await get(`/storage/kv/namespaces/${namespace}/keys?${params}`);
  for (const key of page.result) {
    const day = /^gpx-import:(\d{4}-\d{2}-\d{2}):/.exec(key.name)?.[1];
    if (day) days.set(day, (days.get(day) || 0) + 1);
  }
  cursor = page.result_info?.cursor || '';
} while (cursor);
console.log('GPX imports by UTC day (last 90 days; imports, not unique people):');
for (const [day, count] of [...days].sort()) console.log(`${day}\t${count}`);
console.log(`Total\t${[...days.values()].reduce((sum, count) => sum + count, 0)}`);
