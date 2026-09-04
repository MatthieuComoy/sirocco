// Server-side proxy for the AVURNAV/AVINAV live feed. The browser can't call
// services.ping-info-nautique.fr directly — it sends no CORS headers at all,
// so every client-side fetch fails and the app always falls back to the
// bundled snapshot, which only gets as fresh as the last deploy (see
// src/lib/services/pingWarnings.ts and scripts/refresh-warnings-data.mjs).
// A server-to-server request has no such restriction.

// Loosely validated rather than matched against a hardcoded list: the
// upstream itself rejects an unknown series name (400, "nameOfSeries is
// unknown"), so this only needs to stop the series param from being used to
// smuggle in something that isn't a series name at all.
const SERIES_NAME_RE = /^[A-Z0-9 .'-]{1,60}$/;

export default async (req: Request) => {
  const series = new URL(req.url).searchParams.get('series');
  if (!series || !SERIES_NAME_RE.test(series)) {
    return new Response(JSON.stringify({ error: 'Missing or invalid series parameter' }), {
      status: 400,
      headers: { 'content-type': 'application/json' },
    });
  }

  const upstreamUrl = `https://services.ping-info-nautique.fr/nw/v1/Get_NW_Messages?nameOfSeries=${encodeURIComponent(series)}&lang=fr`;

  try {
    const upstreamRes = await fetch(upstreamUrl);
    const body = await upstreamRes.text();
    return new Response(body, {
      status: upstreamRes.status,
      headers: {
        'content-type': upstreamRes.headers.get('content-type') ?? 'application/xml',
        // Short edge cache: these notices don't change by the minute, and
        // this keeps repeat loads across users from all hitting the
        // upstream individually.
        'cache-control': 'public, max-age=300',
      },
    });
  } catch {
    return new Response(JSON.stringify({ error: 'Upstream request failed' }), {
      status: 502,
      headers: { 'content-type': 'application/json' },
    });
  }
};

export const config = {
  path: '/api/nw-proxy',
};
