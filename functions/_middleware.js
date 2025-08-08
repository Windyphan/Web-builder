export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);

  // Skip processing for static assets
  if (
    url.pathname.startsWith('/assets/') ||
    url.pathname.startsWith('/api/') ||
    url.pathname === '/favicon.ico' ||
    url.pathname === '/vite.svg' ||
    url.pathname === '/robots.txt' ||
    url.pathname === '/sitemap.xml' ||
    url.pathname === '/googlec04985f57c64ab4e.html'
  ) {
    return;
  }

  // For SPA routes, serve index.html
  if (
    url.pathname === '/about' ||
    url.pathname === '/portfolio' ||
    url.pathname === '/pricing' ||
    url.pathname === '/contact' ||
    url.pathname === '/blog' ||
    url.pathname === '/admin/blog' ||
    url.pathname.startsWith('/blog/')
  ) {
    const indexUrl = new URL('/index.html', request.url);
    return fetch(indexUrl.toString());
  }

  // Continue with normal processing for other routes
  return;
}

