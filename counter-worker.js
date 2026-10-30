const jsonHeaders = (origin) => ({
  'Access-Control-Allow-Origin': origin || '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Cache-Control': 'no-store',
  'Content-Type': 'application/json; charset=utf-8',
  Vary: 'Origin',
});

function isAllowedOrigin(origin, configuredOrigin) {
  return !origin
    || origin === 'null'
    || origin === configuredOrigin
    || origin === 'http://localhost:5500'
    || origin === 'http://127.0.0.1:5500';
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin');
    const headers = jsonHeaders(origin === 'null' ? '*' : origin);

    if (!isAllowedOrigin(origin, env.SITE_ORIGIN)) {
      return Response.json({ error: 'Origin not allowed' }, { status: 403 });
    }

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers });
    }

    const url = new URL(request.url);
    if (request.method !== 'GET' || url.pathname !== '/api/visits') {
      return Response.json({ error: 'Not found' }, { status: 404, headers });
    }

    const counterId = env.VISITOR_COUNTER.idFromName('portfolio-total-visits');
    const counter = env.VISITOR_COUNTER.get(counterId);
    const result = await counter.fetch('https://counter.internal/increment');
    return new Response(await result.text(), { status: result.status, headers });
  },
};

export class VisitorCounter {
  constructor(state) {
    this.state = state;
  }

  async fetch() {
    const total = await this.state.storage.transaction(async (transaction) => {
      const currentTotal = await transaction.get('total') || 0;
      const nextTotal = currentTotal + 1;
      await transaction.put('total', nextTotal);
      return nextTotal;
    });

    return Response.json({ total });
  }
}