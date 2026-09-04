// Server-side proxy for the NGA global NAVAREA broadcast warnings feed.
// Unlike ping-info-nautique.fr this one usually works fine from a browser,
// but routing it through the same proxy pattern keeps behavior consistent
// and gives it the same short edge cache.

export default async () => {
  try {
    const upstreamRes = await fetch('https://msi.nga.mil/api/publications/broadcast-warn?status=active&output=json');
    const body = await upstreamRes.text();
    return new Response(body, {
      status: upstreamRes.status,
      headers: {
        'content-type': 'application/json',
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
  path: '/api/nga-proxy',
};
