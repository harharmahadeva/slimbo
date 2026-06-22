# Slimbo — Changelog

All changes to the Slimbo PWA are recorded here.
Format: [v{MAJOR}.{MINOR}.{PATCH}] — YYYY-MM-DD

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
