// functions/api/auth.js

export async function onRequest(context) {
    const { request, env } = context;
    const url = new URL(request.url);
    const code = url.searchParams.get('code');
  
    if (!code) {
      return new Response('Missing code parameter', { status: 400 });
    }
  
    const GITHUB_CLIENT_ID = url.searchParams.get('client_id');
    const GITHUB_CLIENT_SECRET = env.GITHUB_CLIENT_SECRET;
  
    if (!GITHUB_CLIENT_ID || !GITHUB_CLIENT_SECRET) {
        return new Response('GitHub OAuth app credentials not configured in environment', { status: 500 });
    }
  
    const response = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        client_id: GITHUB_CLIENT_ID,
        client_secret: GITHUB_CLIENT_SECRET,
        code: code,
      }),
    });
  
    const result = await response.json();
  
    if (result.error) {
      return new Response(JSON.stringify(result), { status: 400 });
    }
  
    return new Response(
      `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Authorizing...</title>
      </head>
      <body>
        <script>
          window.opener.postMessage('authorization:github:success:${JSON.stringify(result)}', '*')
          window.close()
        </script>
        <p>Authorized! You may now close this window.</p>
      </body>
      </html>
      `,
      {
        headers: { 'Content-Type': 'text/html' },
      }
    );
  }