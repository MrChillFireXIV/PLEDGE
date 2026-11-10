# PLEDGE bug report server

Players send bug reports from **Settings → Report a bug** in the game, with a description and an optional picture (a file or a screenshot of the game). This server receives them, and you read them in your browser.

## Run it

Needs Node 18 or newer. There are no packages to install.

```
cd tools/bug-server
ADMIN_KEY=pick-a-secret node server.js
```

It listens on port 8787. You can change that with `PORT=...`. Reports are saved as files in `tools/bug-server/reports/`.

## Read the reports

Open `http://<server>/?key=pick-a-secret` in your browser. Each report shows:
- the player's text and the picture
- where they were: chapter, day, time, quest and position
- their level, graphics setting, screen size and browser

You can mark reports fixed, reopen them or delete them. The key is remembered in your browser for 30 days.

## Point the game at it

The game has to be able to reach the server. Running it on your own computer only works while you play on that same computer. For players, put it on any host that runs Node, such as Render, Railway, Fly.io or a small VPS.

Then set the address in `src/js/24a-bug-report.js`:

```
const BUG_URL='https://your-server.example.com';
```

Rebuild with `python3 build.py`. To test without rebuilding, run this in the browser console:

`localStorage.setItem('pledge.bugUrl','http://localhost:8787')`

## Or use a Discord channel

If you'd rather not run a server, set `BUG_URL` to a Discord channel webhook (Channel settings → Integrations → Webhooks → New Webhook → Copy URL). Each report then arrives in that channel as a message, with the picture attached.

## If nothing is set up

The game says that reporting isn't connected and lets the player download the report as a `.json` file instead.

## Limits

- Reports are capped at 12 MB. The game shrinks pictures to 1280 px, so a typical report is about 200 KB.
- Each address can send 20 reports per 10 minutes.
