# Today's Word

A simple daily quote app. Opens to a single quote, the story behind it, and a
link to the sermon on YouTube. The library lives in a Google Sheet, so adding
quotes never requires touching code.

## 1. Set up your quote library (no code)

This version of the app is already configured to read your existing
spreadsheet's columns as-is — you don't need to rename anything:

| Theme/Topic | Context | Quote | Video Link | Timestamp |
|-------------|---------|-------|------------|-----------|

Timestamps can stay in `HH:MM:SS` format (e.g. `00:11:11`) — the app converts
that to the right YouTube link automatically.

1. Open your spreadsheet (`Sermon_Quotes_Archive_With_Context.xlsx`) in
   Google Sheets: **File → Import → Upload**, choose the file, and select
   "Replace spreadsheet" or "Insert new sheet" depending on whether you're
   starting fresh.

2. Keep adding rows the same way you already have been — same five columns,
   no new ones needed.

3. In Google Sheets: **File → Share → Publish to web**. Choose the "Sermon
   Quotes" tab, set the format to **CSV**, and click Publish. Copy the link
   it gives you.

4. Open `index.html`, find this line near the top of the `<script>` section:

   ```js
   const SHEET_CSV_URL = "";
   ```

   Paste your link between the quotes. Save the file.

That's it — from now on, adding a quote is just adding a row to the sheet and
republishing isn't even needed, since "publish to web" stays live.

## 2. How "today's quote" is chosen

The app uses the day of the year (1–365) to pick a row, so it cycles through
your whole library once a year and repeats the cycle the following year. If
you have fewer than 365 quotes, it'll loop back to the start early and start
over — you can keep adding rows at any time and it'll automatically use a
bigger library.

## 3. Hosting it on GitHub Pages

1. Create a new GitHub repository (can be private or public — anyone with the
   link can still view a public repo's Pages site, so use private if you'd
   rather control access more tightly via a separate method).
2. Upload `index.html` to the repository root.
3. Go to **Settings → Pages**, set the source to the `main` branch, root
   folder.
4. GitHub will give you a URL like `https://yourname.github.io/repo-name/`.
   That's the link you share with family.

Updates to the Google Sheet show up immediately — no redeploy needed. You'd
only need to touch GitHub again if you want to change the app's design or
code.

## Notes

- If `SHEET_CSV_URL` is left blank, or the sheet is unreachable, the app
  falls back to a few sample quotes so the page never shows broken.
- The share button uses your device's native share sheet where available
  (works well on phones); on desktop it copies the quote and link to your
  clipboard.
- Nothing is stored or tracked — it's a static page that reads your sheet
  fresh on every visit.
