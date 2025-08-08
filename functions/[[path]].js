export async function onRequest(context) {
  const url = new URL(context.request.url);

  // Serve static files normally
  if (url.pathname.startsWith('/assets/') ||
      url.pathname.includes('.') ||
      url.pathname === '/favicon.ico' ||
      url.pathname === '/robots.txt') {
    return context.env.ASSETS.fetch(context.request);
  }

  // For all other routes, serve index.html but preserve the URL
  const response = await context.env.ASSETS.fetch(new URL('/index.html', context.request.url));

  return new Response(response.body, {
    status: 200,
    headers: {
      'Content-Type': 'text/html',
      'Cache-Control': 'public, max-age=0, must-revalidate'
    }
  });
}

