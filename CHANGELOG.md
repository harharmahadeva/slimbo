# Slimbo — Changelog

All changes to the Slimbo PWA are recorded here.
Format: [v{MAJOR}.{MINOR}.{PATCH}] — YYYY-MM-DD

---

## [v1.21.0] — 2026-06-28
### Changed — Button UX overhaul
- **`.btn-icon` restyled** — all nav buttons are now pill-shaped with a visible border, padding, and bold text instead of bare icon circles
- **Back buttons labelled** — all `←` bare arrows now show `← Terug`; all `🏠` bare home icons now show `🏠 Huis`
- **Logout buttons labelled** — Bram and Sandy dashboards show `← Uitloggen` using the same `btn-icon` style
- **Bram logout** — removed inline styles, now uses `.btn-icon` class consistently
- **Sandy header** — removed duplicate "Sign out" button; single `← Uitloggen` button remains
- **Tafel picker back** — labelled `← Terug` instead of bare arrow
- **Version number** — `v1.21.0` shown on login screen below the tagline
- **Logout buttons** — arrow removed; new `.btn-logout` class gives red-tinted background + border so button is visible against any background

---

## [v1.20.0] — 2026-06-24
### Added — Background push notifications (iPad)
- **True push notifications** — Devvrat's iPad now receives study reminders even when the app is closed, via Web Push API (requires iOS 16.4+, PWA installed to home screen)
- **Service worker push handler** — sw.js handles `push` events and `notificationclick` (tapping opens the app)
- **3 daily reminders** via Vercel Cron (UTC times mapped to Amsterdam):
  - 07:00 — "Goedemorgen! Tijd voor Slimbo 🚀"
  - 15:00 — progress-aware: "nog X minuten te gaan 💪"
  - 20:00 — final nudge, or "dagdoel bereikt! ⭐" if done
- **`/api/subscribe`** — saves push subscription to Vercel KV when Devvrat logs in
- **`/api/send-push`** — cron endpoint, reads subscription + today's minutes from KV, sends push via VAPID
- **`/api/sync-mins`** — app posts studied minutes to KV every 5 min so push messages are accurate
- **`vercel.json`** — cron schedule at 05:00, 13:00, 18:00 UTC (= 07:00, 15:00, 20:00 CEST)
- **`package.json`** — adds `web-push` npm dependency for VAPID signing
- SW bumped to `slimbo-v4`

> **Setup required (one-time):** Add 4 environment variables in Vercel dashboard — see README for details.

---

## [v1.19.2] — 2026-06-24
### Added — Dagelijks Nederlands module
- **New 🗣️ Dagelijks card** on home screen — teaches everyday Dutch vocabulary an 8-9 year old native Dutch child would know
- **72 words across 8 themes**: Gevoelens, Thuis, Eten, Weer, Buiten, School, Familie, Vrije tijd, Dieren
- **Learn-first flow**: 6 randomly selected words shown with emoji + real-life example sentence; tap any word to hear it spoken (TTS, nl-NL); first word auto-plays on load
- **Practice modes** — alternating per session:
  - 🔊 **Luisteren + Kiezen**: word spoken via TTS, choose from 4 options (all from the learned set)
  - ✏️ **Luisteren + Typen**: emoji + gapped sentence shown, type the word you hear
- **"🔄 Andere woorden"** button on learn screen to reshuffle a new random set of 6
- **Full Bram dashboard tab** — 🗣️ Dagelijks tab shows all 72 words grouped by theme, each with flag + note
- **Sandy dashboard** — dagelijks added to per-module progress bars and session history
- **Service worker** bumped to `slimbo-v3` to force cache refresh

---

## [v1.18.0] — 2026-06-24
### Changed — Bram full teacher dashboard
- **Complete content review access** — Bram can now browse all content across every module via tabs: Voortgang · Woordenschat · Kleding · Spelling d/t · Lezen · Dictee · Delen
- **Flag + comment system** — every item (word, sentence, question, sum) has a ⚑ flag button and a free-text note field; notes saved to localStorage
- **Feedback tab** — dedicated "⚑ Feedback" tab shows all flagged items and their notes in one place; badge shows count
- **Progress view improved** — visual per-module bars (green/yellow/red), recent 10 sessions with date + score, 2×2 stat grid
- **Tab state preserved** — re-renders same tab after flagging an item
- **Backward compat** — old `flagItem()` calls still work via alias

---

## [v1.17.0] — 2026-06-24
### Added
- **Kleding module** 👕 — new themed vocabulary module matching Devvrat's current school theme (De Arabesk, Arnhem)
- 15 clothing words: jas, broek, schoen, sokken, jurk, trui, muts, sjaal, pyjama, regenjas, riem, overhemd, rok, laarzen, handschoenen — each with emoji + Dutch hint
- Same learn-first flow as Woordenschat: all 6 words shown with emoji before the scramble quiz starts
- "🔄 Andere woorden" button on the learn screen to reshuffle a different set of 6
- Stars, today-done badge, and resume all work the same as other modules
- Kleding added to Sandy and Bram dashboards (module results + performance stats)
- Module counter on home updated from `/6` → `/8` to reflect 8 learnable modules

---

## [v1.16.0] — 2026-06-23
### Changed
- **Dictee — louder & clearer audio**: rate slowed from 0.8 → 0.65, volume explicitly set to 1.0; word now spoken **twice** automatically on question load (800ms gap between repetitions) so student can hear it clearly
- **Rekenen — multiple worked examples before quiz**: replaced single 4-step walkthrough with a static learn card showing the splitsmethode explained + **2 fully worked examples** (one ➕ addition and one ➖ subtraction) for each level; student taps "Ik snap het! Start oefening →" when ready
- **Lezen — wrong-answer feedback now names the correct answer**: previously just said "kijk nog eens naar de tekst"; now shows `❌ Het juiste antwoord is: "..."` so student knows what the right answer was
- **Celebration score**: `spelling_intro` step now excluded from question total (was inflating denominator by 1)

---

## [v1.15.0] — 2026-06-23
### Fixed
- **Service worker cache bust** — bumped cache key from `slimbo-v1` to `slimbo-v2`; old cached `index.html` was being served stale so users saw outdated versions of the app despite pushes to GitHub. New SW invalidates the old cache on activation and fetches fresh content.

---

## [v1.14.0] — 2026-06-23
### Changed
- **Woordenschat — learn before test**: after tapping the module, all 6 words for that session are shown (emoji + woord + hint) before the scrambled-letter quiz begins. "✅ Ik ken ze! Start oefening →" advances to the quiz.
- **Spelling d/t — rule intro before questions**: first step is now a rule card explaining ik-vorm (no d/t), hij/zij/het (stam+t), and 't kofschip (past tense rule) with colour-coded examples. "Begrepen! Start oefening →" advances to the 8 questions.
- **Score/progress bar**: intro steps are excluded from the question counter and dot row so "1/9" never shows; intro step shows "Uitleg" instead.

---

## [v1.13.0] — 2026-06-23
### Changed
- **Tafels — learn before test**: after picking a table, a learn screen now appears showing all 10 facts (4×1=4 through 4×10=40) with a staggered slide-in animation before the adaptive quiz begins. "✅ Ik ken ze! Start oefenen →" button advances to the quiz. Back arrow returns to the table picker.

---

## [v1.12.0] — 2026-06-22
### Security (OWASP hardening)
- **CSP meta tag** added — restricts script/style/font/connect sources
- **XSS fix** — `esc()` helper added; applied to `renderMsgBanners` so Sandy's messages are HTML-escaped before insertion into innerHTML
- **Login rate limiting** — 5 failed attempts triggers a 60-second lockout; counter resets on success
- **Message ID collision fix** — `sendMsg` now uses `Date.now()+'_'+random` for unique IDs
- **Resume tafelN bug** — `tafelN=r.tafelN||0` replaced with `r.tafelN!=null?r.tafelN:1`; `0` was falsy and reset to zero, breaking adaptive tafels after resume

### Design — Kids UX overhaul
- **Demo disclaimer badge** added to home screen — "🔒 Demo versie · Alleen voor persoonlijk gebruik · Niet commercieel"
- **`--text3` contrast fix** — raised from `#7E7B9A` (~3.2:1) to `#9B98B8` (~4.6:1, passes WCAG AA)
- **`ring-label` legibility** — font-size raised from 9px to 12px
- **Confetti bug fixed** — JS was creating `.conf-piece` elements but CSS animation targets `.confetto`; class name unified to `confetto`; confetti now animates correctly on celebration screen
- **Answer buttons** — min-height 66px, font-size 18px, border-radius 18px, active-scale feedback; applies to all mc-btn, opt-btn, lezen-opt
- **D/T spelling buttons** — min-height 70px, font-size 28px
- **Number grid buttons** (Rekenen) — min-height 62px, font-size 22px
- **Primary buttons** (login, cel-btn, next-btn) — min-height 58–60px, larger font, bigger radius
- **Module cards** — border-radius 24px, emoji 42px, mod-name 17px/900 weight, bigger padding
- **Module card active** — scale(.92) — more satisfying press animation for kids
- **Stats pills** — larger padding, 24px value font, 12px label
- **Login card** — larger border-radius (32px), bigger rocket emoji (64px), larger brand (46px), bigger input
- **User picker buttons** — min-height 100px, 40px avatar, 15px name, better selected state with shadow
- **Question text** — q-zin 22px, tafel-quiz-sum 56px, rekenen-sum 50px for easy reading
- **Hero text** — name 32px, greeting 15px, sub 14px
- **PIN overlay** — bigger card radius (28px), larger input (24px), bigger OK button
- **Touch targets** — `touch-action:manipulation` on all buttons; streak-chip, logout-btn minimum sizes set
- **Resume banner** — border-radius 16px, resume-btn min-height 44px
- **Celebration screen** — cel-emoji 88px, cel-title 38px, cel-stars 54px, cel-btn 60px min-height

---

## [v1.11.0] — 2026-06-22
### Changed
- **Sound effects off by default** — `_muted` now defaults to `true` (was `false`); stored as `slimbo_mute=0` only when explicitly turned on
- **🔇/🔊 toggle button** added to home screen header — Devvrat can tap to turn sound on or off; preference persists in localStorage across sessions

---

## [v1.10.0] — 2026-06-22
### Fixed
- **Raket Race buttons** — options with string values (spelling/dictee words) were passed via `JSON.stringify` inside `onclick`, causing double-quote collision in HTML attributes and breaking all button taps. Switched to `data-idx` attribute + `answerRaket(this)` — buttons now work for all option types (numbers and strings)
- **Dictee — now a real dictation exercise:**
  - Word is no longer shown on screen — student must listen and type from memory
  - Word is spoken automatically on question load via Web Speech API (`SpeechSynthesis`, `nl-NL`, rate 0.8)
  - 🔊 "Luister naar het woord" button lets student replay as many times as needed
  - After answering, the correct word is spoken again and the full sentence is shown in the feedback (so student sees context of what the word means)

## [v1.9.0] — 2026-06-22
### Added — Raket Race bonus mode
- New 🚀 **Raket Race** card on home screen (8th module)
- 10 random MC questions pulled from all modules: 3 spelling, 3 rekenen, 2 tafels, 2 dictee spelling-choice
- Timer counts up from 0 — beat your personal best
- Personal best saved to `progress.raketBest`; shown on home card
- Custom result screen: time, score, stars, new-record flash
- "Nog een race" retry button

### Added — Dictee module (Groep 4 syllabus)
- New 📝 **Dictee** card (7th module), 10 random words per session
- 35 words across 7 spelling categories: ei/ij · au/ou · ui · ng/nk · sch · open syllable (aa/oo/ee) · samenstellingen
- Format: full sentence with word blanked, emoji visual, hint, letter-count, category label
- Student types the word; exact match checked (case-insensitive)
- Wrong answer shows what they typed vs correct spelling
- Star badges and today-done tracking same as other modules

### Fixed — Tafels rotation when ≤3 facts remain
- Previously: only 2–3 hard facts cycled back-to-back → frustrating
- Now: mastered facts are mixed in 1:1 as warm-up review rounds, labelled "✓ herhaling — al gememoreerd!"
- Hard facts still appear every other question; session still ends only when all 10 mastered

## [v1.6.0] — 2026-06-22
### Added — Tafels adaptive memorization engine
- Session never ends until all 10 facts (×1 through ×10) are individually mastered
- **Mastery bar per fact:** 6 consecutive correct answers with no wrong in between — any wrong resets that fact's streak to 0
- **Speed signal:** response time must trend down across the 6 (first 3 avg slower than last 3 avg), OR already consistently fast (avg < 2.5s, avg total < 4s)
- Questions are always random; same fact never repeats back-to-back
- **Streak dot grid** on every question screen shows all 10 facts with live progress:
  - Gray = untouched
  - Orange = streak 1–2
  - Yellow = streak 3–4
  - Teal = streak 5 (one away)
  - Green = mastered ✓
  - Active fact pulses pink and scales up
  - Each non-mastered dot shows current streak count (e.g. "3/6")
- Speed feedback label after every answer: ⚡ Bliksemsel / 🚀 Super snel / ✅ Goed tempo / 💪 Sneller volgende keer
- "⭐ 7×8 gememoreerd!" flash when a fact crosses the mastery bar
- Custom mastery celebration screen when all 10 facts cleared, with option to pick another table or go home
- `factStreak(a,b)` helper tracks consecutive correct count from the tail of history
- Session resume (`slimbo_resume_devvrat`) updated on every question render

---

## [v1.5.0] — 2026-06-22
### Added
- **Mid-session resume** — Devvrat's exact position is saved to localStorage (`slimbo_resume_devvrat`) after every question render
- Resume card appears on the home screen showing which module was interrupted, which question number, and the time he stopped (e.g. "Woordenschat 📚 · Vraag 3/6 · gestopt om 14:32")
- "▶ Doorgaan" button restores the full shuffled question set, question index, and correct count — no reshuffle, no restart
- Dismiss (×) button on resume card to clear and start fresh
- Resume state auto-expires at midnight (only shown if saved today)
- `clearResume()` called on fresh `startModule()` and on `showCelebration()` so completed sessions don't linger
- localStorage key: `slimbo_resume_[username]`

---

## [v1.4.0] — 2026-06-22
### Changed
- Exercise screen: content now vertically centered on screen instead of stacking at the top
- `#exerciseScreen` set to `display:flex; flex-direction:column`
- `.ex-body` gets `flex:1; display:flex; flex-direction:column; justify-content:center`

---

## [v1.3.0] — 2026-06-22
### Fixed
- Login button cut off on Samsung Galaxy S23 (narrow viewport)
- Switched login layout from `justify-content:center` to `flex-start` with tighter spacing so button is always visible

---

## [v1.2.0] — 2026-06-22
### Changed
- Replaced free-text username input on login screen with tap-to-select user picker (3 avatar buttons: Devvrat, Bram, Sandy)
- Eliminates browser autofill / autocomplete interference
- PIN field still typed manually; Enter key advances focus correctly

---

## [v1.1.0] — 2026-06-22
### Changed
- Removed pre-filled username placeholder from login screen input

---

## [v1.0.2] — 2026-06-22
### Added
- Part 2: all 6 learning modules (Woordenschat, Spelling d/t, Delen, Begrijpend Lezen, Tafels, Rekenen)
- Sandy parent dashboard (English): module performance bars, 7-day activity chart, recent sessions, adjustable daily goal, send encouragement messages
- Bram reviewer dashboard: progress overview, content flagging on exercises
- All content data: 15 WOORDEN_SETS, 20 DT_OEFENINGEN, 5 LEZEN_VERHALEN, 15 DELEN_SOMMEN
- Questions shuffled on every module start

---

## [v1.0.1] — 2026-06-22
### Changed
- Constrained app shell to `max-width: 480px` centered — phone shell feel on desktop

---

## [v1.0.0] — 2026-06-22
### Added
- Initial build of Slimbo kids learning PWA
- Student: Devvrat Sharma, Groep 4B→5, De Arabesk
- 6 modules targeting Cito weak areas: Woordenschat, Spelling d/t, Delen, Begrijpend Lezen, Tafels, Rekenen
- Time tracking: 120 min/day minimum goal, progress ring on home screen
- Eye care: 45 min continuous → 5-min break overlay, Sandy PIN (8003) to skip
- Warm CSS tint after 30 min (warm1) and 40 min (warm2)
- Blink reminder every 20 min
- Alarms at 07:30, 15:00, 20:00, 22:30 (animated rocket + Web Audio)
- App locked outside 07:00–23:00 for student role
- Web Audio API sounds: correct / wrong / fanfare / modStart / tap / streak / windChime / alarm
- SVG progress ring (r=52, circumference=326.73px), turns gold at goal
- localStorage per user (`slimbo_[username]`), Sandy→Devvrat messages (`slimbo_msgs`)
- Service worker: cache-first, offline capable
- Login screen with PIN authentication (Devvrat / Sandy / Bram)
