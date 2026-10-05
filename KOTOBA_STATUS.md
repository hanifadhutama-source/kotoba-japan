# KOTOBA DEVELOPMENT STATUS

## Current Version

0.4.0

## Current Phase

Phase 4A — Demo Quest 1: Greetings ✅ COMPLETE

## Completed Phases

### Phase 0 — Preparation ✅
- Original Kota Kata project backed up
- Existing codebase audited
- KOTOBA documentation created (CONTEXT, DESIGN, ROADMAP, STATUS)

### Phase 1 — Rebrand ✅
- Renamed Kota Kata → KOTOBA
- Brand icon ⛩️ applied
- Noto Sans JP font added
- Japanese red primary color (#dc2626)
- HUD brand text and victory message updated

### Phase 2A — Atmospheric Reskin ✅
- src/main.js: Updated scene.background and scene.fog → 0xd4e9f7 (Tokyo morning sky)
- src/world/CityWorld.js: hemiLight, groundMat (0x6b7280), asphaltMat (0x1f2937), sidewalkMat (0xd1d5db)
- Verified: no collision or gameplay regressions

### Phase 2B — Building Recolor & Billboard Update ✅
- 40+ buildings recolored using Tokyo urban visual hierarchy
- Billboard texts replaced with Japanese area signage
- Billboard font updated to Noto Sans JP
- Verified: all gameplay functional

### Phase 2C — Environmental Props Polish ✅ ← JUST COMPLETED

Files modified:
- src/world/CityWorld.js only

#### Trees (createVoxelTree):
- Deterministic height variation per tree (seed from x/z → 80%–120% height scale)
- Trunk narrowed to 0.7 width, color deepened to 0x3b2f24
- Canopy rebuilt with 3 layers + crown peak (6 leaf blocks, wide base skirt 3.2×3.2)
- Dual-material canopy: primary + accent color per layer for visual depth
- Cherry: soft sakura pink (0xf9a8d4) + light bloom (0xfce7f3)
- Autumn: deep amber-brown (0xb45309) + bright amber (0xd97706)
- Oak: deep street green (0x166534) + mid-green accent (0x15803d)
- Collider dimensions preserved exactly (gameplay unchanged)

#### Street Vendor Carts (createStreetVendorCart):
- Already Yatai-styled in prior session (dark wood, slate roof, lantern, noren curtain)
- This session: replaced Indonesian titles with Japanese food names
  - KEDAI ES KRIM → たこ焼き
  - WARUNG KOPI LITERASI → ラーメン屋台
  - KIOS BUKU BEKAS → やきとり
  - BAKSO NUSANTARA → おでん
- Lantern accent colors changed to authentic Yatai palette (deep red, navy, dark amber, forest green)

#### Bus Stops:
- Replaced Indonesian names with Japanese area labels
  - Halte Perpustakaan Kota → 図書館前 (Toshokansaki)
  - Halte Menara Bisnis → ビジネス街 (Bijinesugai)
  - Halte Kampus Sains → 学校前 (Gakkomae)
  - Halte Stasiun Media → 中央広場 (Chuo Hiroba)

## Verification (Phase 2C)

- Vite dev server: RUNNING, hot-reloaded Phase 2C at 07:24:30 with 0 errors
- Collider architecture: preserved
- Gameplay systems: untouched

### Phase 3A — Tokyo Central Hub ✅ ← JUST COMPLETED

Files modified: src/world/CityWorld.js only

#### District Identity:
- NW → 学校エリア (School): 学校, 図書館, 体育館
- NE → 東京タワーエリア: 東京タワー (red landmark), ホテル
- SW → 住宅街: アパート, マンション, クリニック
- SE → 商店街: ショッピング, カフェ, 映画館
- Main avenue shops: コンビニ, ラーメン屋, 薬局, 郵便局
- Outer ring: 東京駅 (north), 市民会館 (south)

#### Plaza Stage Enhancement:
- Banner color: indigo → Japanese red (0xdc2626)
- Canvas text overlay: 中央広場 / KOTOBA Tokyo Hub
- Pillars: gray → white with red accent bands

#### Billboards (now 6, was 5):
- NW 学校エリア (dark blue), NE 東京タワー (red), SE 商店街 (navy)
- SW 住宅街 (dark wood, was shrine), North 東京駅 (existing), South 住民エリア (new)

#### New Hub Identity Props (createTokyoHubIdentity):
- 1× Directional signpost at (0, -19): ← 学校 / ↑ 東京駅 / 東京タワー → / ↓ 住宅街
- 4× Vending machines: 飲み物, コーヒー, お茶, 缶ジュース (each with collider)
- 6× Utility poles with cross arm, insulators, wire lines (each with slim collider)
- 4× District marker signs at (±34, ±34): 学校↖, 東京タワー↗, 住宅街↙, 商店街↘

## Spatial Hub Layout

```
        ↑ NORTH
  東京駅 Tokyo Station (z=-145)
        |
 学校 ←─┼─→ 東京タワー
エリア  │   エリア
  (NW)  │    (NE)
        │
    中央広場 (0,0)
        │
 住宅街 ←┼─→ 商店街
  (SW)  │   (SE)
        ↓ SOUTH
   住民エリア (z=+145)
```

## Verification (Phase 3A)

- Vite hot-reloaded twice: 07:40:16 + 07:41:17 — 0 errors
- No syntax or runtime errors in server log
- All existing colliders preserved (building positions/sizes unchanged)
- PlayerController, VoxelCharacter, NPC, quests, minigames: untouched
- All new props have colliders in this.colliders
- Visual browser inspection: NOT performed (agent quota limit)

### Phase 3A.1 — Spatial Cleanup ✅ ← JUST COMPLETED

Files modified: src/world/CityWorld.js only (createTokyoHubIdentity + createUtilityPole)

#### Utility Poles:
- Wire geometry changed: BoxGeometry(0.03, 0.03, 28) → BoxGeometry(28, 0.03, 0.03)
  Wires now run along X-axis (parallel to avenue), not Z-axis (which crossed traffic)
- Insulator positions: changed from X-offset to Z-offset to match new wire layout
- Cross arm: BoxGeometry(2.8, 0.12, 0.12) → BoxGeometry(0.12, 0.12, 2.8)
  Arm now spans Z-axis (between the 3 wire rows), consistent with wires and insulators
- Pole pair at (x=70, z=13) removed; replaced with symmetric pair at (-70, +17) and (-70, -17)
  — all 6 poles now symmetric around the avenue, at z=±17 (clearly outside road edge z=±6)

#### Vending Machines relocated to proper sidewalk tiles:
- 飲み物: (-14,-7) → (-20,-27) — NW sidewalk connector
- コーヒー: (14,7) → (20,27) — SE sidewalk connector
- お茶: (-7,14) → (-20,27) — SW sidewalk connector
- 缶ジュース: (7,-20) → (20,-27) — NE sidewalk connector
  All now outside both main avenue vehicle lanes (X-road: z=±6, Z-road: x=±6)

#### Directional Signpost relocated:
- (0,-19) → (-20,-20) — moved off the Z-road axis onto NW district sidewalk block
  Road Z-avenue spans x=±6; x=-20 is clearly on sidewalk

#### District Markers:
- Positions adjusted ±34 → ±32 (minor, keeps them inside district sidewalk blocks)

## Verification (Phase 3A.1)

- Vite reloaded 4× between 07:57–07:58 with 0 errors
- Collision architecture: preserved (no collider dimensions changed)
- Player movement, NPC, quests, minigames: untouched
- Visual browser inspection: NOT performed (quota limit — manual verification recommended)

## Remaining Issues

- Visual browser verification deferred (quota limit)
- South billboard (z=135) floats without a pole support (cosmetic only)
- District marker signs at (±34,±34) are near sidewalk areas — passable, not blocking

## Important Constraints

- Do NOT rebuild from scratch.
- Preserve PlayerController.
- Preserve VoxelCharacter.
- Preserve existing collision system.
- Preserve existing game loop.
- Preserve existing NPC interaction.
- Preserve existing minigame architecture.
- Avoid unnecessary changes to main.js.

## Risky Files

- src/main.js
- src/world/CityWorld.js
- src/entities/PlayerController.js
- src/entities/VoxelCharacter.js
- src/minigames/MinigameController.js

## Safe Files

- src/quest/QuestData.js
- index.html
- src/style.css
- src/ai/WanderingNPCManager.js

## Next Task

Phase 3 — Tokyo World

DO NOT begin Phase 3 until instructed.


## Completed

- Original Kota Kata project backed up
- Existing codebase audited
- KOTOBA documentation created (CONTEXT, DESIGN, ROADMAP, STATUS)
- Phase 2A (Atmospheric Reskin) completed successfully
  - src/main.js: Updated scene.background and scene.fog to 0xd4e9f7 (Tokyo morning sky)
  - src/world/CityWorld.js: Updated hemiLight, groundMat (0x6b7280), asphaltMat (0x1f2937), sidewalkMat (0xd1d5db)
- Verified all visual changes and confirmed no collision or gameplay regressions.

## Current Task

Phase 2A complete. Awaiting instruction to proceed.

## Next Task

Phase 2B — Building Recolor & Billboard Update
- Modifikasi warna bangunan
- Ganti teks billboard dengan bahasa Jepang

## Important Constraints

- Do NOT rebuild from scratch.
- Preserve PlayerController.
- Preserve VoxelCharacter.
- Preserve existing collision system.
- Preserve existing game loop.
- Preserve existing NPC interaction.
- Preserve existing minigame architecture.
- Avoid unnecessary changes to main.js.

## Risky Files

- src/main.js
- src/world/CityWorld.js
- src/entities/PlayerController.js
- src/entities/VoxelCharacter.js
- src/minigames/MinigameController.js

## Safe Files

- src/quest/QuestData.js
- index.html
- src/style.css
- src/ai/WanderingNPCManager.js

## Last Completed

Phase 2A Atmospheric Reskin completed.

Files modified:
- src/main.js
- src/world/CityWorld.js

Files NOT modified (preserved):
- src/entities/PlayerController.js
- src/entities/VoxelCharacter.js
- src/minigames/MinigameController.js
- src/quest/QuestData.js
- src/ai/WanderingNPCManager.js
- index.html
- src/style.css

Issues: None.

All functionality verified working.

## Current Objective

Phase 3A complete. Await instruction to begin Phase 3B (Tokyo Station Area).

## Next Task: Phase 3B — Tokyo Station Area

When instructed:
- Add platform/tracks visual near existing station building (x=0, z=-145)
- Add station entrance gate/arch
- Add train indicator board (発車案内)
- Add platform benches and props
- Add 改札口 (ticket gate) structure

### Phase 3B — Tokyo Station Area ✅ COMPLETE

Files modified: src/world/CityWorld.js only

Elements added (createTokyoStationArea):
- Station plaza pavement (z=-126 to -136, x=-20 to +20) + center accent strip
- Raised curb edge at boulevard side
- Entrance canopy: Japanese red slab roof, white soffit, 4 slim pillars with red bases
- Facade signage: 東京駅 (charcoal panel, white kanji), TOKYO STATION (English)
- Exit signs: ← 出口 and 中央口 → (green, above canopy)
- Info board on pole (案内図, east side x=+16 z=-131) with map list
- 2× Platform benches (x=±14, z=-130)
- 2× Vending machines (x=+18, z=-128/-133)
- 1× Bicycle rack with 駐輪場 label (x=-16, z=-130)

Spatial verification:
- All props in safe zone z=-126 to -137, x=±7 to ±20
- Z-avenue vehicle lane (x=±6) kept clear
- Boulevard vehicle lane (z=-124.5) kept clear
- Existing station building collider unchanged

### Phase 3C — Commercial / Konbini District ✅ COMPLETE

Files modified: src/world/CityWorld.js only
New method: createCommercialDistrict() + 5 helper methods

Area: East Main-Avenue shop strip, x=63–113, z=±8 to ±22

Elements added:

#### Konbini Storefront (x=78, z=-18, building south face z=-13):
- Full-width green fascia panel
- コンビニ + 24H sign (canvas texture)
- いらっしゃいませ welcome sign below
- Glass display windows (two panels flanking door)
- Dark door frame
- 入口 sign above door

#### Shop Signs:
- パン屋 (x=96, z=-18): warm brown fascia + Japanese bakery sign
- 本屋 (x=78, z=+18): navy fascia + bookstore sign (facing south)

#### Pedestrian Frontage:
- 2× Darker concrete strips (frontage pavement, z=-8 to -13.5 and z=+8 to +13.5)
- 2× Dark curb edge strips at road boundary (z=±7.8)

#### Shop Awnings:
- Konbini: green awning (w=11, protruding south from z=-13)
- パン屋: brown awning (w=10, south)
- 本屋: navy awning (w=10, north toward avenue)

#### Props:
- 3× Vending machines (x=68, z=-12/-15.5/+12)
- 4× Street lamps (x=67/110, z=±10)
- 2× Recycle bins with ゴミ label (x=72, z=±11)
- 1× Bicycle rack with 駐輪場 label (x=105, z=-12)
- 2× Flower planters (x=65, z=±11)
- 1× District entrance sign: 商店街 / Shopping Street (x=63, z=0)

Spatial verification:
- All props at x=63–112, z=±8 to ±22 — outside vehicle lane z=±6
- Sidewalk strip (90,0,46,14) confirmed: x=67–113, z=±7 — props placed outside
- No props in Z-avenue lane (x=±6) or X-avenue lane (z=±6)

Vite verification:
- Hot-reloaded at 08:12:07 (constructor call) + 08:16:23 (methods) — 0 errors
- No syntax/runtime errors
- All gameplay systems untouched
- Visual browser inspection: NOT performed (quota — manual check recommended)

## STOP — Phase 3C complete. Do not continue to Phase 3D.

## Next Phase Queued (do not start yet)

Phase 3D — School Area (NW District, x=-55, z=-55)

### Phase 3D — Education / School District ✅ COMPLETE

Files modified: src/world/CityWorld.js only
New method: createEducationDistrict() + 3 helper methods

Area: NW district — school building x=-55, z=-55 (existing 学校 (Gakkou) building)

#### Spatial context:
- School east face (player-facing from hub): x=-46
- School south face: z=-46
- Inner road north lane edge: z=-56.5 → frontage props placed at z=-47 to -55 only
- NW district sidewalk: x:-83 to -13, z:-83 to -13

#### School Facade Signage (east face, x=-46):
- Primary: 学校 (large white kanji on navy panel with red accent bars)
- Secondary: GAKKOU — SCHOOL (gray text, dark backing)
- 入口 (entrance) sign at ground level
- Navy fascia backing panel on east face

#### School Entrance Canopy (east face):
- White flat canopy, 8 units wide along Z, 3 deep eastward
- Japanese red leading edge stripe
- 2 slim white support pillars at z=±3.2 from building center
- Red base blocks per pillar
- Slim colliders per pillar

#### School Frontage Pavement:
- Darker concrete strip on east approach: x=-47 to -58, z=-44 to -66
- Dark curb edge strip at z=-55.8 (just before inner road zone)

#### Education Props:
- 掲示板 (notice board): x=-48, z=-50 — school information board with canvas texture
  Content: welcome message, study hours, school name, library direction
- 駐輪場 (bicycle rack): x=-48, z=-54 — safe of road edge at z=-56.5
- 2× Flower planters: x=-44, z=-50 and z=-60 (flanking east approach)
- 2× Street lamps: x=-44, z=-48 and z=-62 (east frontage path)
- 学校エリア district entrance sign: x=-32, z=-48 (approach from central hub)

#### Spatial Safety:
- Inner road vehicle lane (z=-56.5 to -63.5): NO props placed here
- Main Z-avenue (x=±6): no conflict (x=-32 to -48, safely in NW district)
- All props within NW sidewalk quarter (x:-83 to -13, z:-83 to -13)
- No props touching school building collider

#### Vite Verification:
- Hot-reloaded at 08:19:37 (constructor call) + 08:30:33 (methods) — 0 errors
- No syntax/runtime errors
- All gameplay systems untouched
- Visual browser inspection: NOT performed (quota — manual check at http://localhost:5173/)

## STOP — Phase 3D complete. Do not continue to Phase 3E.

### Phase 4A — Demo Quest 1: Greetings ✅ COMPLETE

* Quest 1 (Japanese Greetings) is now playable.
* The NPC "Sensei" is placed in the NW Education District at x=-48, z=-48.
* The NPC interaction triggers the quest introduction.
* Connected to the existing `VOCAB_CHOICE` minigame with questions about Konnichiwa, Arigatou, Ohayou.
* Quest completion provides visual feedback and updates the quest badge.
* All existing systems (movement, collision, dialog, etc.) are preserved.
* Runtime verified with zero errors.

### Phase 4A.1 — Sensei NPC Position Fix ✅ COMPLETE

* Sensei moved outside school building (from x=-48, z=-48 to x=-42, z=-55).
* Sensei positioned near school entrance, securely on the pedestrian pavement on the east approach.
* NPC collision/placement verified to be outside the building collider.
* Quest 1 preserved without modifications to the quest logic.
* Runtime verified.

### Phase 4B — Demo Quest 2: Numbers & Shopping ✅ COMPLETE

* Quest 2 implemented.
* Shopping/Numbers learning content added (Ichi, San, Go).
* Existing `VOCAB_CHOICE` minigame format reused.
* Commercial/Konbini NPC "Kenji" connected and placed safely at `x: 82, z: -10`.
* Quest completion provides visual feedback and updates the quest badge.
* Quest 1 completely preserved.
* Runtime verified with zero errors.

### Phase 4C — Quest 3: Hiragana Basics ✅ COMPLETE

* Quest 3 implemented.
* Hiragana learning content added (a, i, u, ka, ko).
* Existing `VOCAB_CHOICE` minigame format reused since `KANA_READING` is not supported by `MinigameController`.
* NPC "Senpai" connected and placed near the Education district entrance at `x: -36, z: -48`.
* Quest progression preserved, Quest 1 and Quest 2 completely preserved.
* Runtime verified with zero errors.

### Phase 4D — Quest 4: Everyday Japanese Vocabulary ✅ COMPLETE

* Quest 4 implemented.
* Everyday vocabulary learning content added (mizu, tabemono, hon, gakkou, eki).
* Existing `VOCAB_CHOICE` minigame reused.
* NPC "Haruka" (Tour Guide) connected and placed safely in Tokyo Station Plaza at `x: 10, z: -130`.
* Quest progression preserved. Quests 1, 2, and 3 completely preserved.
* Runtime verified with zero errors.

### Phase 4E — Quest 5: Sentence Building ✅ COMPLETE

* Quest 5 implemented.
* Sentence building learning content added.
* Existing `SENTENCE_BUILDER` minigame format completely reused without controller modifications.
* NPC "Akira" (Local Guide) connected and placed securely in the NW corner of the Central Plaza at `x: -14, z: -14`.
* Quest progression preserved. Quests 1, 2, 3, and 4 completely preserved.
* Runtime verified with zero errors.

### Phase 4F — Quest 6: Japanese Culture & Etiquette ✅ COMPLETE

* Quest 6 implemented.
* Japanese culture and etiquette learning content added (ojigi, trash disposal rules, genkan, train etiquette, queuing).
* Existing `HOAX_DETECTOR` minigame format reused perfectly.
* NPC "Yuki" (Duta Budaya) connected and placed safely in the NE corner of the Central Plaza at `x: 20, z: -20`.
* Quest progression preserved. Quests 1–5 completely preserved.
* Runtime verified with zero errors.

### Phase 4G — Quest 7: Daily Conversation ✅ COMPLETE

* Quest 7 implemented.
* Daily conversation learning content added (Ogenki desu ka, Hai, Iie, Sumimasen, Mata ne).
* Existing `VOCAB_CHOICE` minigame format reused.
* NPC "Aiko" (Shop Regular) connected and placed near the Bakery in the Commercial district at `x: 96, z: -10`.
* Quest progression preserved. Quests 1–6 completely preserved.
* Runtime verified with zero errors.

### Phase 4H — Quest 8: Situational Japanese ✅ COMPLETE

* Quest 8 implemented.
* Situational Japanese learning content added (Self-introduction, expressing needs, asking for location).
* Existing `SENTENCE_BUILDER` minigame format completely reused perfectly.
* NPC "Takeshi" (Commuter) connected and placed safely in the Tokyo Station Plaza area at `x: -10, z: -130`.
* Quest progression preserved. Quests 1–7 completely preserved.
* Runtime verified with zero errors.

### Phase 4I — Quest 9: Culture & Communication ✅ COMPLETE

* Quest 9 implemented.
* Culture and communication learning content added (combining Japanese language with appropriate communication and cultural understanding).
* Existing `HOAX_DETECTOR` minigame format completely reused perfectly for True/False questions.
* NPC "Miyuki" (Local Student) connected and placed safely in the NE area approach to Tokyo Tower at `x: 45, z: -45`.
* Quest progression preserved. All previous quests (1–8) completely preserved.
* Runtime verified with zero errors.

### Phase 5A — Central Shibuya Crossing ✅ COMPLETE

* Central Plaza fountain replaced with a massive asphalt intersection base (`x: 0, z: 0`, 26x26).
* Shibuya Crossing (scramble crossing) added with prominent white zebra crossings in all directions and diagonals.
* Hachiko landmark (pedestal and bronze dog) added at the NW corner sidewalk (`x: -11, z: -11`) complete with "ハチ公 / HACHIKO" sign.
* Shibuya signage added via stylized corner buildings (SHIBUYA 109 style at SW corner and QFRONT style at NE corner with SCRAMBLE CROSSING billboard).
* Tokyo commercial facades added alongside urban props (traffic poles, vending machine, trash bin).
### Phase 5A.1 — Ambient NPC Language Cleanup ✅ COMPLETE

* 12 profil ambient NPC diperbarui dari nuansa lokal ke profil Japanese city (contoh: Tanaka · Salaryman, Sakura · Student).
* Percakapan casual/bubble chat dirombak 100% menggunakan frasa bahasa Jepang level pemula (Konnichiwa, Ii tenki desu ne) dilengkapi terjemahan bahasa Indonesia.
* Sistem rendering *Canvas* pada bubble sprite ditingkatkan secara mulus untuk mendukung format multiline (Jepang di atas, Indonesia di bawah dengan warna *dim* / `#cbd5e1`).
* Tidak ada satupun NPC quest utama (Q1–Q9) yang diganggu atau diubah; hanya NPC ambience berjumlah 36 warga *wandering* yang diperbarui.
* Validasi *Vite* 0 error; *immersion* kota Tokyo semakin kuat tanpa mengganggu game logic yang sudah stabil.

## Next Phase Queued (do not start yet)

Phase 5B — Add More Landmarks
