# Cyril Cheung — Portfolio V2

做好咗 **Home**、**Design**、**AI + Video**、**About**、**CV**、**Contact**（全部 6 頁）。

---

## 0. 最常做嘅事（快速指南）

| 想做 | 改邊度 |
|---|---|
| 加 / 改 / 收埋 **Design 作品** | `assets/data/design.js` ＋ 圖放 `assets/work/design/<作品id>/` |
| 加 / 改 / 收埋 **影片** | `assets/data/videos.js` ＋ 片放 `assets/work/video/<影片id>/` |
| 換 **首頁 Selected work** 5 格 | `assets/data/home.js` ＋ 圖放 `assets/work/home/` |
| 換首頁 4 張小卡縮圖 | 覆蓋 `assets/work/home/card-1.webp` … `card-4.webp`（16:10） |
| 改 **顏色 / 字體**（全站） | `assets/css/main.css` 最頂 `:root` |
| 改 **頁頭選單 / 頁尾** | 每個 `.html` 入面嘅 `<header>` / `<footer>`（樣式喺 `main.css`） |
| 改 **CV** | `build_cv.py` 改資料 → 跑 `python3 build_cv.py`（見第 9 節） |
| 改 **About** 文字 | `about.html` |
| 改 **Contact** 文字 / 卡 | `contact.html`（電郵喺入面搜尋 `cyrilcheungc2@gmail.com`） |
| 開 / 關 **防存圖** | `assets/js/main.js` 最頂 `protectImages: true / false` |
| 檢查有冇圖搵唔到 | 瀏覽器開 `design.html?check` / `ai-video.html?check` / `index.html?check` |

**一般唔使郁嘅：** `assets/js/`（程式）、`assets/css/pages/`（每頁樣式）。

---

## 1. 檔案結構

```
portfolio/
├── index.html  design.html  ai-video.html  about.html  cv.html  contact.html
├── build_cv.py                 ← 產生 cv.html 嘅資料檔（Python）
├── graphic.html uiux.html …    ← 舊網址自動轉頁（見第 10 節）
└── assets/
    ├── data/                   ← ★ 內容：你最常改嘅地方
    │   ├── design.js           ← Design 作品清單（文字、分類、圖片檔名）
    │   ├── videos.js           ← 影片清單（featured / grid / shorts）
    │   └── home.js             ← 首頁 Selected work 揀邊 5 個
    ├── work/                   ← ★ 作品圖同片
    │   ├── design/<作品id>/    ← cover.webp ＋ 01.webp、02.webp…
    │   ├── video/<影片id>/     ← video.mp4 ＋ poster.webp
    │   └── home/               ← a–e.webp（首頁精選）、card-1–4.webp（首頁小卡）
    ├── css/
    │   ├── main.css            ← 全站共用：顏色、字體、頁頭、選單、頁尾
    │   └── pages/*.css         ← 每頁獨有樣式
    ├── js/
    │   ├── main.js             ← 全站共用：手機選單、彈出視窗、捲動效果
    │   └── pages/*.js          ← 每頁獨有功能
    └── images/                 ← 網站本身嘅圖（Hero 底圖 + gaze/ 影片格、About 相、favicon）
```

每頁載入次序：`main.css` → 該頁 css；`data/*.js` → `main.js` → 該頁 js。唔好調亂。

---

## 2. 加一個 Design 作品

1. 喺 `assets/work/design/` 開一個新 folder，例如 `my-new-project`（只用細楷英文、數字同 `-`）
2. 放圖入去：
   - `cover.webp`：作品格仔用嘅封面，闊約 **900px**
   - `01.webp`、`02.webp`…：撳開之後顯示，最長邊約 **1800px**
   - JPG / PNG 都得，只要檔名同資料檔寫嘅一樣
3. 打開 `assets/data/design.js`，複製一段 `{ … }`，貼喺想佢出現嘅位置（排上面 = 排前），改：
   - `id`：同 folder 名一樣（亦都係連結：`design.html#my-new-project`）
   - `title`、`type`（卡上細字）、`year`
   - `cats`：分類，可以多個 → `campaign` / `digital` / `ecommerce` / `print` / `brand` / `packaging` / `illustration`
   - `client`、`about`（一段簡介）、可選 `brief` / `idea` / `result`、`role`、`tools` —— 唔填就唔顯示
   - `cover` 同 `images`：每行寫 `'檔名 闊x高 | 說明'`，例如 `'02.webp 1800x1200 | Leaflet — front and back'`
4. **每段 `{ … }` 之間要有逗號 `,`**，文字用單引號 `' '` 包住。句子入面要用 `'` 嘅話改用 `’`（彎引號）
5. 存檔，重新整理頁面

**闊x高點搵：** Mac 揀圖 → ⌘I（簡介）→「尺寸」。唔寫都得，只係載入時格仔會跳一下。

**收埋一個作品：** 嗰段加 `hidden: true,`。**刪除：** 刪成段 `{ … }`（連後面逗號）。

**有分類冇作品？** 標籤會自動收埋（例如而家冇 Packaging）。想加新分類：`design.html` 篩選列加一個 `<button class="dz-tab" data-filter="新字">`，再喺作品 `cats` 用同一個字。

**資料檔打錯字？** 作品格會顯示黃色提示「作品資料載入唔到」。九成係漏咗逗號或者引號。

---

## 3. 加一條影片

1. 喺 `assets/work/video/` 開新 folder，例如 `my-new-video`
2. 放兩個檔：
   - `video.mp4`：**H.264 ＋ AAC**，建議 720p、**10 MB 以內**
   - `poster.webp`：封面（同片一樣比例，揀最有代表性嗰格，唔好用黑畫面）
3. 打開 `assets/data/videos.js`，喺三個位置揀一個複製一段 `{ … }`：
   - `featured`：頁頂大片（只有一條，喺頁面直接播）
   - `grid`：「Videos」格（`cats`：`ai` / `short` / `commercial` / `concept`）
   - `shorts`：「Short-form for ViaToyz」左右碌嗰行（9:16 直片最啱）
4. 填 `size`（片嘅闊x高，例如 `720x1280`）、`duration`（例如 `0:25`）、文字

**壓片（Mac 裝咗 ffmpeg）：**
```bash
# 橫片
ffmpeg -i 原片.mov -vf scale=-2:720 -c:v libx264 -crf 23 -preset slow -c:a aac -b:a 128k -movflags +faststart video.mp4
# 直片
ffmpeg -i 原片.mov -vf scale=720:-2 -c:v libx264 -crf 23 -preset slow -c:a aac -b:a 128k -movflags +faststart video.mp4
```
太大就將 `-crf 23` 改大啲（例如 26）。

**用 YouTube：** 刪 `video` 嗰行，加 `youtube: '影片ID'`（網址 `v=` 後面嗰串），`poster` 照放。

**`note`：** 細字備註，例如 `'Personal concept — not a commissioned ad.'`。用咗真實品牌嘅自發作品記得寫，免得人以為係客戶 job。

---

## 4. 首頁 Selected work（`assets/data/home.js`）

5 格形狀固定：**a** 大橫 16:10、**b** 直 4:5、**c** 橫 4:3、**d** 正方 1:1、**e** 橫 4:3。

```js
{ slot: 'a', from: 'design', id: 'yi-ming-tong', image: 'a.webp 1600x1000' },
```
- `from`：`'design'` 或 `'video'`；`id`：對應作品 / 影片（撳落去會直接打開佢）
- 標題、類別、年份自動由 `design.js` / `videos.js` 攞；想另外寫：加 `title: '…', type: '…', year: '…'`
- 圖放 `assets/work/home/`，**預先裁好成嗰格嘅形狀**（唔係就會被自動裁中間）

---

## 5. 本機睇

**方法 A：** VS Code 裝 **Live Server** → 右鍵 `index.html` → *Open with Live Server*。
**方法 B：** 喺 portfolio 資料夾開 Terminal：`python3 -m http.server 8000` → 開 <http://localhost:8000>。

直接 double-click `index.html` 都睇到。字體由 Google Fonts 載入，要有網絡。
**測手機：** Chrome DevTools → Toggle device toolbar；最準係 push 上 GitHub Pages 用手機開。

---

## 6. 上載 GitHub（GitHub Pages）

- 整個 portfolio 資料夾上載。GitHub 網頁版拖檔上載，**每個檔案上限 25 MB**；用 git 指令上限 100 MB（50 MB 開始警告）。而家最大嘅片約 10 MB，冇問題
- 成個網站約 55 MB（主要係影片）。GitHub Pages 建議 1 GB 以內
- **舊網站檔案要刪：** `img/`、`VO/`、`UI_UX/`、`Illustrator/`、舊 `assets/` 入面冇用嘅嘢。冇連結嘅檔案，只要仲喺 repo，任何人打網址都睇到
- **GitHub Pages 係公開嘅**：唔好將客戶內部 / 保密資料放上去，就算唔整連結都一樣睇到

---

## 7. 動畫速度 / 細節設定

每個 page script 最頂都有 `CONFIG`，有中英註解：

| 檔案 | 主要設定 |
|---|---|
| `js/pages/home.js` | 名、卡片入場時間，打字速度，hero 過場，滑鼠視差，望住滑鼠（`gaze`） |
| `js/pages/design.js` | `tallestThumb`（縮圖最高比例）、`filterFade`、`revealStagger`、`swipeDistance` |
| `js/pages/ai-video.js` | `hoverPreview`（桌面滑鼠預覽）、`hoverDelay`、`filterFade`、`swipeDistance` |
| `js/pages/about.js` | 打字速度、中英切換 |
| `js/pages/cv.js` | 逐條出現速度、工具光圈 |
| `css/main.css` `:root` | 全站顏色、字體、`--dur-reveal` 等速度 |
| `css/pages/home.css` `:root` | Hero 專用：`--dur-title`、`--dur-card`、`--parallax-*` |

Hero 過場停留長度：`home.css` → `.work { margin-top: 55svh; }`。

---

## 8. Home Hero ＋ 望住滑鼠（影片抽格 → Canvas）

**做法：** 一條「頭轉一圈」嘅影片（AI 生成 720p → Higgsfield 用 ByteDance 放大到 1080p），抽成一格格 AVIF 圖，24 格全部用。分兩套：`images/home/gaze-hd/`（1080p，大屏電腦用）同 `images/home/gaze/`（縮返 720p，手機 / 細屏用）。網頁預先載入，按滑鼠方向揀「眼神最接近」嗰格做目標，再由而家嗰格**一格一格行過去**；每次只畫**一格真實畫面**（唔會兩格疊埋，所以冇殘影）。目標喺片入面太遠（中間冇拍到）就直接切過去。**唔係**用 CSS 郁個人，亦**唔係**拉影片進度（`video.currentTime`）。

- 底圖 `images/home/hero.webp` / `.jpg` = 影片第一格（托腮）。冇 JS、動畫未 load 好、或者 reduced-motion 時見到呢張。
- Canvas 只蓋住會郁嗰部分（`crop`），邊位柔化，所以睇唔到接駁。
- 次序：托腮相 → 開場（抬頭望住你）→ 桌面跟滑鼠（9 個方向 + 中間位）。滑鼠離開視窗 → 望返你。
- 手機（冇滑鼠）：自己周圍望一圈，停 6 秒再望；撳畫面 → 望去手指位置一陣。
- 大屏電腦載入 1080p 版（約 12.5 MB），手機、細屏同「慳數據」模式載入 720p 版（約 7.4 MB）；喺背景慢慢載入，唔會阻住頁面顯示。幾大先用 1080p：`hero-gaze.js` → `hd.minScreen`。
- AVIF 比 WebP 同樣清晰度細啲。好舊嘅瀏覽器（Safari 16.4 之前）唔識 AVIF → 自動只顯示靜態相，唔會壞。

| 想改 | 喺邊度 |
|---|---|
| 轉頭快慢、幾遠先轉到盡、幾遠就直接切、開場速度、關閉 | `home.js` → `CONFIG.gaze`（`follow` / `reachX` / `reachY` / `cut` / `introSpeed` / `enabled: false`） |
| 每格望緊邊個方向、開場 / 手機周圍望用邊幾格 | `assets/data/hero-gaze.js` |
| 手機上人嘅大細 / 位置 | `home.css` → `@media (max-aspect-ratio: 4/5)` 入面 `250cqw`、`0.55`、`0.32` |
| 「hi, that’s me」位置 | `home.css` → `.hero-note` 嘅 `left / top` |

**換新影片：**
1. 影片要求：鏡頭完全固定、背景唔郁、只係頭同眼郁、有規律噉轉一圈、轉嘅時候唔好眨眼。1080p 會清過 720p。
2. 將影片俾我，我用抽格工具（`export_gaze.py`，要 Python + ffmpeg）重出 `hero.webp`、`hero.jpg` 同 `gaze/` 所有格。
3. 人嘅位置或者轉頭次序唔同 → 要重填 `hero-gaze.js`（`crop`、`face`、`intro`、`idle`、`keys`）。呢步最好叫我睇片幫你填。
4. 影片尺寸唔係 1280×720 → 亦要改 `index.html` 張 `<img>` 嘅 `width/height` 同 `home.css` 嘅 `--ratio`。

分享預覽圖 `og-image.jpg` 係另一張圖，唔受影響。

---

## 9. CV（`cv.html`）

**改資料：** 改 `build_cv.py` 入面嘅資料（`PROJECT`、`JOBS`、`STRENGTHS`、`SUPPORTING`、`TOOLS`…），喺 portfolio 資料夾跑 `python3 build_cv.py`，會自動重出 `cv.html`（中英對照一齊出）。直接手改 `cv.html` 都得，但之後就唔好再跑 `build_cv.py`，否則會覆蓋。

- 冇百分比；3 個主力 ＋ 2 個輔助
- 中英對照：頁頂掣＋右下浮動掣；會記住選擇（同一部機），唔想記住：`cv.js` → `rememberZh: false`

---

## 10. 舊網址自動轉去新頁

| 舊網址 | 跳去 |
|---|---|
| `graphic.html` / `uiux.html` / `illustrator.html` / `photo.html` | `design.html` |
| `video.html` | `ai-video.html` |
| `resume.html` | `cv.html` |

---

## 11. Contact 頁（`contact.html`）

- 大字電郵 ＋「Write an email」＋「Copy address」（撳一下複製電郵）
- 4 張 3D 卡：Email、Hong Kong、CV、Work。平時輕輕左右浮動；桌面滑鼠移上去會 Y 軸翻轉 180°（加少少 X 軸傾斜、反光同光暈）；手機撳一下翻轉，撳 ↺ 返轉
- 只得 Email，冇電話、冇 Instagram
- 速度：`contact.css` 最頂 `--dur-flip-card`（翻轉時間）、`--float-x`（浮動距離）

---

## 12. 防存圖（`main.js` §6）

- 圖片同影片：禁止右鍵、拖曳、手機長按存圖；影片播放器唔顯示「下載」掣
- **限制要知：** 呢個只係阻止「隨手存圖」。冇任何網站可以阻止截圖，識技術嘅人亦都搵得到圖片檔。網站用嘅圖已經係縮細版（最長約 1800px），唔係原檔
- 想再安全啲：喺大圖加水印（例如角落細細隻「© Cyril Cheung」）—— 要嘅話叫我整
- 關閉：`main.js` 最頂 `protectImages: false`

---

## 13. Design 頁滑鼠圓圈 icon（放大鏡）

- 位置：`design.html` 底部 `<div class="view-cursor">` 入面嘅 `<svg class="vc-icon">`。
- **換 icon**：換走 `<svg ...>…</svg>`，但保留 `class="vc-icon"`。線條風格（24×24）嘅 icon 最夾，例如 lucide.dev 揀「Copy SVG」。用人哋嘅 icon 前睇清楚授權。
- **改大細**：`assets/css/pages/design.css` 搵 `.view-cursor .vc-icon`，改 `width / height`（而家 24px，圓圈係 60px）。
- **線條粗幼**：同一個位改 `stroke-width`。
- **出現時嘅小動畫**（斜住彈入）：同一個位改 `transform: rotate(-25deg) scale(0.7)`；唔要就改做 `transform: none`。
- 只喺電腦版出現，手機冇。

## 14. 無障礙 / 效能

- `prefers-reduced-motion`：入場動畫、視差、滑鼠預覽全部停；文字直接顯示
- 圖全部 WebP；影片 H.264 ＋ `faststart`；格仔圖用 lazy loading
- 純 HTML / CSS / JS，無 framework
- 測試備註：我用嘅測試瀏覽器冇 H.264，所以測播放時臨時換咗 WebM；網站本身用 MP4，Chrome / Safari / Edge / Firefox 都支援
