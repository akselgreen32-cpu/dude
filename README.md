# Dude - Mini Movie Pals

Tiny movie-character pals that live in your browser. They wander, climb walls, crawl along the top edge of the page, perch on headings and images, chat in 60+ styles, and keep an eye on how long you have been online, nudging you to rest.

Version 2.1.0 - Chrome, Edge, Brave and other Chromium browsers (Manifest V3), desktop only.

## The cast

Spider-Man, Naruto, Baymax, The Flash, Minion, Groot, Batman and CJ. The first four show up by default. Turn the others on from any character's menu (Cast tab).

Each character has its own voice, bio, traits and a **bond level** (Stranger > Pal > Buddy > Best friend > Family). Bond grows when you click, chat and keep them around, and every level unlocks a deeper personal line in their Profile tab.

## What they do

- **Wander and climb:** walk, run, hop, climb the side walls, hang and crawl along the top edge, and leap onto page elements (headings, images, buttons, cards) to roam on top of them.
- **Signature moves:** Spider-Man flips, Naruto makes shadow clones, Flash zips, Baymax scans and hugs, Minion giggles, Groot sways, Batman broods, CJ dances.
- **Drag them:** pick any pal up and drop them anywhere. They fall back down.
- **Banter:** pals that meet chat with each other.
- **Night mode:** after 11 PM they get sleepy and take naps.

## Menu (click a character)

| Tab | What it does |
|---|---|
| Actions | Scroll to top or bottom, back, reload, new tab, close tab, plus "Say something" |
| Talk | Search and pick from 61 conversation styles (Care, Focus, Fun, Roleplay, Me) |
| Time | Session timer ring, today's total, top sites today |
| Profile | Bio, traits, bond level and unlocked memories |
| Cast | Choose who is on screen, Quiet mode switch |

The toolbar button shows or hides everyone on all tabs.

## Screen time and rest reminders

- Only **active** browsing counts (browser focused, you are not idle or locked).
- **Session reminders** at 30 min, 1 h, 2 h, 3 h, 4 h, then every hour.
- **Daily total reminders** at 1 h, 2 h, 4 h, 6 h, 8 h, 10 h, then every 2 h.
- A **10-minute break** resets the session and you get a "welcome back".
- **Rest window 11 PM to 5 AM:** a nudge every 30 minutes while you are still browsing (reading included), getting firmer as it gets later.
- If a page cannot show the pals (for example `chrome://` pages) or they are hidden, you get a normal system notification instead.

## Install from the release zip

1. Download `dude-extension-v2.1.zip` from the Releases page.
2. Extract it into a folder you will keep (the browser loads the extension from that folder).
3. Open `chrome://extensions` (Edge: `edge://extensions`, Brave: `brave://extensions`).
4. Turn on **Developer mode** (top right).
5. Click **Load unpacked** and choose the extracted folder (the one that contains `manifest.json`).
6. Refresh any tabs that were already open.

To update: remove the old version, extract the new zip, and load it the same way (or overwrite the folder and press the reload icon on the extension card).

## Permissions, and why

| Permission | Used for |
|---|---|
| storage | Remembering your cast, bond levels, quiet mode and screen-time totals |
| alarms | A once-a-minute tick for the timer |
| idle | Knowing when you stepped away |
| tabs | Reading the active tab's website name for "top sites" and closing/opening tabs from the menu |
| notifications | Reminders on pages where the pals cannot appear |
| All sites (content script) | Showing the pals on every page |

Everything stays on your computer. Nothing is sent anywhere, and there are no accounts, analytics or network requests.

## Customize

- **Rest window and reminder times:** top of `background.js` (`MS`, `DMS`, `BREAK`, `LATE_FROM`, `LATE_TO`).
- **Default cast:** `DEFAULT_CAST` at the top of `content.js`.
- **Characters and their lines:** `characters.js`.
- **Conversation styles:** `styles.js`. Each row is `[name, emoji, 'line|line|line']`.

## Known limits

- Browsers do not let extensions draw on the tab strip or address bar. The closest spot is the top edge of the page, right under your tabs.
- Pals do not appear on browser pages (`chrome://`), the Web Store, or other pages where extensions are blocked.
- Full-screen video hides them.

## Troubleshooting

- **Not seeing them:** refresh the page, try a normal site like wikipedia.org, and check the extension card has no red Errors button. Click the toolbar icon in case they are hidden.
- **Menu will not open:** click the character itself (not the speech bubble). Drag moves them, a plain click opens the menu.
- **No reminders:** make sure notifications are allowed for your browser in your system settings.

## Credits and disclaimer

A fan-made personal project. The characters are simple original chibi drawings inspired by characters owned by their respective rights holders, and all dialogue is original. This project is not affiliated with or endorsed by any studio or publisher, and is not intended for commercial use.
