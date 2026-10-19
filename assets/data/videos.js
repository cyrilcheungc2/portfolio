/* ==========================================================================
   AI + VIDEO 作品資料  —  ai-video.html 會自動用呢個檔砌出所有影片

   三個位置：
     featured  —— 最頂嗰條大片（只可以一條）
     grid      —— 「Videos」嗰格（有分類標籤）
     shorts    —— 「Short-form for ViaToyz」嗰行（左右碌，9:16 直片最啱）

   ▸ 加一條新片：
     1. 喺 assets/work/video/ 開一個新 folder，名同 id 一樣（例如 my-new-video）
     2. 放兩個檔入去：video.mp4（建議 720p、10MB 以內）＋ poster.webp（封面圖，同片一樣比例）
        壓片指令（Mac Terminal / ffmpeg）：
        ffmpeg -i 原片.mov -vf scale=-2:720 -c:v libx264 -crf 23 -preset slow -c:a aac -b:a 128k -movflags +faststart video.mp4
        （直片用 scale=720:-2）
     3. 複製下面其中一段 { … }，貼喺想佢出現嘅位置，改文字
     4. 每段 { … } 之間要有逗號 ,

   ▸ size = 片嘅闊x高（例如 720x1280）—— 用嚟預留位置，唔會變形
   ▸ 想放 YouTube 而唔係 mp4：刪走 video 嗰行，加 youtube: '影片ID'（網址 v= 後面嗰串）
   ▸ cats（只有 grid 用）：ai / short / commercial / concept
   ▸ note = 細字備註（可選），例如 'Personal concept — not a commissioned ad.'
   ▸ 想暫時收埋一條：加  hidden: true,
   ▸ 解像度低嘅片（例如 480p）：加  noUpscale: true,  —— 彈出播放時唔會放大過原本尺寸，亦冇全螢幕掣
   ========================================================================== */

window.VIDEO_WORK = {

  /* ---------------------------------------------------------- FEATURED */
  featured: {
    id: 'dragon',                                 // 網址：ai-video.html#dragon
    title: 'Sky Dragon',
    type: 'AI Video · Short-form ad',
    year: '2026',
    video: 'video.mp4',
    size: '720x1280',
    poster: 'poster.webp',
    duration: '0:25',
    about: 'A 25-second vertical ad for ViaToyz. A girl climbs a misty peak and meets a real dragon. When it sneezes she shuts her eyes — and opens them on a park bench, holding the sky-dragon plush keychain.',
    direction: 'Cinematic realism, one matched-pose cut back to reality, and two lines of Cantonese dialogue. The plush only appears after the cut.',
    role: 'Concept · Script & prompt · AI production · Edit',

  },

  /* ---------------------------------------------------------- GRID */
  grid: [
    {
      id: 'joguman-strap',
      title: 'JOGUMAN Luggage Strap',
      type: 'Product ad · E-commerce',
      year: '2026',
      cats: ['commercial'],
      video: 'video.mp4', size: '854x480', poster: 'poster.webp', duration: '0:45',
      noUpscale: true,                                // 只有 480p 原檔：唔放大、冇全螢幕
      about: 'A 45-second product ad for the JOGUMAN luggage strap, sold by ViaToyz. Macro shots of the print, stitching and quick-release buckle, then the strap at work on suitcases, boxes and an airport carousel. Chinese and English subtitles.',
      role: 'Concept · Production · Edit',          // ← 請確認 / 改返你實際做嘅部分
      tools: ''                                       // ← 例如 'Kling · CapCut 剪映'，留空就唔顯示
    },
    {
      id: 'pyramid',
      title: 'Pyramid Explorer',
      type: 'AI Video · Short-form',
      year: '2026',
      cats: ['ai', 'short'],
      video: 'video.mp4', size: '720x1280', poster: 'poster.webp', duration: '0:22',
      about: 'A vertical short for ViaToyz: an explorer finds the treasure inside a pyramid — and it’s a plush toy.',
      role: 'Concept · AI production · Edit',
     
    },
    {
      id: 'six-seven',
      title: 'Six Seven — Story Ad',
      type: 'AI Video · Short-form',
      year: '2026',
      cats: ['ai', 'short'],
      video: 'video.mp4', size: '1280x720', poster: 'poster.webp', duration: '0:54',
      about: 'A one-minute parody for ViaToyz: a young man walks into what looks like a secret society — and finds out he is there to join ViaToyz. Chinese and English subtitles.',
      role: 'Concept · AI production · Edit',
      tools: ''
    },
    {
      id: 'tbm-wart',
      title: 'TBM — “疣”得救',
      type: 'Motion graphics · Commercial',
      year: '2021',
      cats: ['commercial'],
      video: 'video.mp4', size: '720x720', poster: 'poster.webp', duration: '0:15',
      about: 'Animated social post for a wart-removal treatment. The headline 「疣」得救 is a pun: 疣 (wart) sounds like 有, so it reads “with TBM, there’s a cure”.',
      client: 'TBM The Beauty + Medical',
      role: 'Design · Animation',
      tools: 'After Effects'
    },
    {
      id: 'sloth',
      title: 'Office Sloth',
      type: 'AI Video · Short-form',
      year: '2026',
      cats: ['ai', 'short'],
      video: 'video.mp4', size: '720x1280', poster: 'poster.webp', duration: '0:16',
      about: 'A vertical short for ViaToyz following a sloth through an office day, from 9:00 to 17:55.',
      role: 'Concept · AI production · Edit',
      tools: ''
    },
    {
      id: 'thermage',
      title: 'TBM — Thermage FLX',
      type: 'Motion graphics · Commercial',
      year: '2021',
      cats: ['commercial'],
      video: 'video.mp4', size: '720x720', poster: 'poster.webp', duration: '0:32',
      about: 'Treatment explainer for social media — the technology, the two treatment tips and the benefits, in short animated cards.',
      client: 'TBM The Beauty + Medical',
      role: 'Design · Animation',
      tools: 'After Effects'
    },
    {
      id: 'xo-dog',
      title: 'XO Plush',
      type: 'AI Video · Commercial',
      year: '2026',
      cats: ['ai', 'commercial'],
      video: 'video.mp4', size: '720x1280', poster: 'poster.webp', duration: '0:08',
      about: 'An 8-second premium-style product spot for ViaToyz: a dog at a bar is served a cognac-bottle plush.',
      role: 'Concept · AI production · Edit',
  
    },
    {
      id: 'pc-easter',
      title: 'Perfect Code — Easter',
      type: 'Motion graphics · Commercial',
      year: '2021',
      cats: ['commercial'],
      video: 'video.mp4', size: '720x720', poster: 'poster.webp', duration: '0:08',
      about: 'Looping Easter animation for a medical-aesthetics clinic’s social media.',
      client: 'Perfect Code Medical',
      role: 'Design · Animation',
      tools: 'After Effects'
    }
  ],

  /* ---------------------------------------------------------- SHORTS (ViaToyz rail) */
  shorts: [
    {
      id: 'joguman', title: 'Joguman', year: '2026',
      video: 'video.mp4', size: '720x1280', poster: 'poster.webp', duration: '0:10',
      about: 'A hand-drawn-style day in the life of Joguman, ending on the keychain plush.',
      role: 'Concept · AI production · Edit'
    },
    {
      id: 'zombie', title: 'Zombie Shopper', year: '2026',
      video: 'video.mp4', size: '720x1280', poster: 'poster.webp', duration: '0:22',
      about: 'A zombie comedy that ends on the ViaToyz shop page.',
      role: 'Concept · AI production · Edit', tools: ''
    },
    {
      id: 'dog-turtle', title: 'Puppy & Turtle', year: '2026',
      video: 'video.mp4', size: '720x1280', poster: 'poster.webp', duration: '0:16',
      about: 'An animated-film-style story of a puppy and a turtle plush.',
      role: 'Concept · AI production · Edit'
    },
    {
      id: 'pink-bear', title: 'Pink Bear', year: '2026',
      video: 'video.mp4', size: '720x1280', poster: 'poster.webp', duration: '0:14',
      about: 'A dark, uneasy walk through empty corridors — then a giant pink plush bear.',
      role: 'Concept · AI production · Edit', tools: ''
    },
    {
      id: 'fish', title: 'Fish Talk', year: '2026',
      video: 'video.mp4', size: '720x1280', poster: 'poster.webp', duration: '0:08',
      about: 'Two puppet-style fish chatting underwater.',
      role: 'Concept · AI production · Edit', tools: ''
    },
    {
      id: 'pink-dream', title: 'Pink Dream', year: '2026',
      video: 'video.mp4', size: '720x1280', poster: 'poster.webp', duration: '0:22',
      about: 'A soft pink fantasy with a girl and her plush toys, floating through the clouds.',
      role: 'Concept · AI production · Edit', tools: ''
    }
  ]
};
