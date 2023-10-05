# oceny-frontend-v2
Web frontend for [oceny-backend](https://github.com/kabuspl/oceny-backend). My first project using TypeScript.  

See it in action: [oceny.kabus.ovh](https://oceny.kabus.ovh/)

## Running

- Install npm packages:
```bash
npm install
```

- Create and edit .env file based on .env.example
    - Set API_ENDPOINT to URL where you have exposed oceny-backend api. You can for example use nginx like [here](#example-nginx-config). Your API_ENDPOINT then will be something like: http://domain.com/api.

- Compile:
```bash
npx webpack
```

- Launch index.html from dist directory

### Example nginx config
```nginx
server {
        listen 443 ssl;
        server_name oceny.kabus.ovh;

        root   /var/www/oceny-frontend-v2/dist;

        # serve static frontend
        location / {
                try_files $uri $uri/ =404;
        }

        # proxy_pass to backend api
        location /api {
                proxy_pass http://127.0.0.1:4080;
        }
}
```