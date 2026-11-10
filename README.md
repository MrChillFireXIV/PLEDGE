# PLEDGE

**Play:** https://mrchillfirexiv.github.io/PLEDGE/

A THREE.js college game. GitHub builds `src/` into one page and publishes it to GitHub Pages every time `main` changes.

## Publishing a new version

You get a new project zip (for example `pledge-split-v290.zip`), so:

- **Windows:** drag the zip onto `scripts\update.bat`.
- **Mac/Linux/Git Bash:** `scripts/update.sh path/to/pledge-split-v290.zip`

The script swaps in the new game files, commits "Update game to V290" and pushes. About a minute later the
site has the new version. Follow it under the repo's **Actions** tab.

The script needs the **project zip**, the one with `src/` and `build.py`, not the single `.html` file. The site is
built from `src/`.

## Why players keep their saves

- **Saves live in each player's browser** (localStorage, keys `pledge.save.v1`, `pledge.save.s2`, `pledge.save.s3`),
  never in this repo. The site's address stays the same for every version, so each new version reads the same saves.
- **Backups:** the first time a player opens a new version, the page copies their saves into a backup (the last 3
  are kept). Open **https://mrchillfirexiv.github.io/PLEDGE/?restore** to put one back.
- **Save-key check:** if a code change renames the save keys, the build stops and nothing is published, so a bad
  change can't make everyone's progress disappear. The check is in `pages/publish.py`.
- **Broken build = no publish:** if the JavaScript has a syntax error, the build fails and players keep the last
  good version.
- **New-version notice:** a player with the game open sees "New version … is out" with a **Save & reload** button.
- The page asks the browser to keep its storage, so it isn't cleared to free up space.

Saves are per browser and per device. Playing on another computer, or clearing site data, starts fresh.
To move a save, use **Export save / Import save** in the game's Report-a-Bug tab.

**Moving from the old `.html` file:** saves made in a downloaded `PLEDGE.html` belong to that file, not to the
website. To bring one over, open the old file, **Export save**, then open the website and **Import save**.

## Repo layout

| path | what |
|---|---|
| `src/`, `build.py`, `vendor/`, `tools/`, `docs/`, `CLAUDE.md`, `MAP.md` | the game project (replaced by each update) |
| `pages/publish.py` | builds `_site/` for GitHub Pages and runs the save-key check |
| `pages/save-guard.js` | save backups, `?restore`, new-version notice (added to the website build only) |
| `scripts/update.*` | publish a new version from a zip |
| `.github/workflows/pages.yml` | builds and deploys on every push to `main` |

Local build: `python3 build.py` creates `dist/PLEDGE.html`, the same single file you can still send to friends.
