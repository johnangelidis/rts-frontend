# RTS Application Frontend

Angular frontend for the RTS Application, built with standalone components and Angular Material.

## Run locally

```bash
npm install
ng serve
```

The application runs at `http://localhost:4200`. During development, `/rts-backend` is proxied to `http://localhost:8080/rts-backend`.

## Pages

- `/` - public landing page
- `/auth` - public login/sign-up page
- `/search` - authenticated ticker search and favorite creation
- `/profile` - authenticated favorite list

Ticker searches are routed through the Spring Boot backend. Configure `FINNHUB_API_KEY` in the backend environment; no Finnhub key is needed in the frontend.
