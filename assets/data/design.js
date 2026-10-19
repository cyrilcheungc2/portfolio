/* ==========================================================================
   DESIGN 作品資料  —  design.html 會自動用呢個檔砌出所有作品卡同彈出視窗

   ▸ 加一個新作品：
     1. 喺 assets/work/design/ 開一個新 folder，名同下面嘅 id 一樣（例如 my-new-project）
     2. 放圖入去：cover.webp（封面，闊約 900px）＋ 01.webp、02.webp…（彈出視窗用，最長邊約 1800px）
        jpg / png 都得，只要下面寫嘅檔名同 folder 入面一樣
     3. 複製下面其中一段 { … }，貼喺你想佢出現嘅位置，改文字
     4. 每段 { … } 之間要有逗號 ,  —— 漏咗逗號係最常見嘅錯

   ▸ 圖片嗰行嘅寫法："檔名 闊x高 | 說明"
       '01.webp 1800x1200 | Leaflet — front and back'
     闊x高 可以唔寫，但寫咗頁面載入時唔會跳。（Mac：揀圖 → ⌘I 睇「尺寸」）

   ▸ cats（分類）可以用：campaign / digital / ecommerce / print / brand / packaging / illustration / photo / ui
     一個作品可以有幾個分類。冇作品用到嘅分類，標籤會自動收埋。

   ▸ 次序：排喺上面嘅作品會排先出現。
   ▸ 想暫時收埋一個作品：喺嗰段加  hidden: true,
   ▸ 改完打開 design.html?check —— 搵唔到嘅圖會用紅字顯示檔名。
   ========================================================================== */

window.DESIGN_PROJECTS = [

  {
    id: 'yi-ming-tong',                         // 網址：design.html#yi-ming-tong（只用細楷英文、數字同 -）
    title: 'Yi Ming Tong 醫明堂',
    type: 'Brand · Print · Social',              // 卡上面嗰行細字
    year: '2023–24',
    cats: ['brand', 'print', 'digital'],
    client: 'Yi Ming Tong, Chinese medicine clinic, Wan Chai',
    about: 'Brand and print for a Chinese medicine clinic — logo, name cards, coupon, foam board, leaflet, price list and social posts.',
    idea: 'Brush lettering and warm paper tones give the clinic a traditional feel that still reads clearly. The four-season posters turn seasonal health tips into one series.',
    role: 'Logo · Brand · Print · Social design',
    tools: 'Photoshop · Illustrator',
    cover: 'cover.webp 900x1244',
    images: [
      '01.webp 1800x1800 | Logo — brush lettering for 醫明堂',
      '02.webp 1320x1600 | Name card — front and back (personal details blurred)',
      '03.webp 1800x1620 | Foam board for the clinic',
      '04.webp 1302x1800 | Four-season health posters — spring, summer, autumn, winter',
      '05.webp 1273x1800 | Leaflet — front and back',
      '06.webp 1620x1528 | $50 coupon — front and back',
      '07.webp 1800x1800 | Social posts',
      '08.webp 1800x1279 | 2024 price list'
    ]
  },

  {
    id: 'beauti22-expo',
    title: 'Beauti22 — Beauty Expo & Devices',
    type: 'Campaign · Print · Social',
    year: '2023',
    cats: ['campaign', 'print', 'digital'],
    client: 'Beauti22 International',
    about: 'Everything for a beauty-expo booth and the devices sold there — social posts, an A3 offer leaflet, pull-up banners and device leaflets.',
    role: 'Design',
    tools: 'Photoshop · Illustrator',
    cover: 'cover.webp 900x900',
    images: [
      '01.webp 1800x1800 | Beauty-expo social posts',
      '02.webp 1800x1274 | Expo offer leaflet (A3) — cover',
      '03.webp 1800x1048 | Pull-up banners for the expo booth',
      '04.webp 1272x1800 | Clearlight device leaflet',
      '05.webp 1800x1274 | V Power HIFU sales kit — cover',
      '06.webp 1800x1279 | EINXEL device leaflet',
      '07.webp 1303x1800 | Introfill device leaflet'
    ]
  },

  {
    id: 'tbm',
    title: 'TBM The Beauty + Medical',
    type: 'Social · Campaign',
    year: '2021',
    cats: ['digital', 'campaign'],
    client: 'TBM The Beauty + Medical',
    about: 'Monthly promotions for a medical-aesthetics group — Facebook and WeChat posts, ads, coupons and a photo-wall backdrop.',
    role: 'Design',
    tools: 'Photoshop · Illustrator',
    cover: 'cover.webp 900x900',
    images: [
      '01.webp 1800x1800 | March birthday offer',
      '02.webp 1800x1800 | “Want better, choose the best” — 7-for-1 offer',
      '03.webp 1800x1800 | Salus Talent Facebook ad',
      '04.webp 1800x1800 | February treatment menu for WeChat — 9 of 14 cards',
      '05.webp 1800x627 | Valentine’s Day, Women’s Day and LoveXpress posts',
      '06.webp 1620x1790 | Treatment coupons',
      '07.webp 1507x1493 | Photo-wall backdrop with size guide (3240 × 3250 mm)'
    ]
  },

  {
    id: 'cm-plus',
    title: 'CM+ Skincare',
    type: 'Print · Sales kit',
    year: '2023',
    cats: ['print'],
    client: 'CM+ skincare',
    about: 'Product posters, double-sided leaflets and sales kits for a skincare range — one look across every set, with a colour for each product line.',
    role: 'Design',
    tools: 'Photoshop · Illustrator',
    cover: 'cover.webp 900x1273',
    images: [
      '01.webp 1303x1800 | Product posters for four skincare sets',
      '02.webp 1800x1279 | NMN set leaflet — front and back',
      '03.webp 1800x1279 | Probiotics set leaflet — front and back',
      '04.webp 1800x1279 | Oil-control set leaflet — front and back',
      '05.webp 1274x1800 | Sensitive-skin serum sales kit — cover',
      '06.webp 1800x1274 | 28-day ampoule sales kit — cover',
      '07.webp 1800x1278 | Expo new-product A3 leaflet'
    ]
  },

  {
    id: 's22-beauty',
    title: 'S22 Beauty+',
    type: 'Campaign · Social',
    year: '2023–24',
    cats: ['campaign', 'digital'],
    client: 'S22 Beauty+',
    about: 'Treatment campaigns for a beauty centre — ThermaMax and PicoKey promotions, a giveaway, VIP plans and festive posts.',
    role: 'Design',
    tools: 'Photoshop · Illustrator',
    cover: 'cover.webp 900x1273',
    images: [
      '01.webp 1303x1800 | ThermaMax treatment campaign',
      '02.webp 1800x924 | PicoKey Christmas offer — two versions',
      '03.webp 1272x1800 | PicoKey leaflet',
      '04.webp 1800x1800 | Giveaway post',
      '05.webp 1800x664 | VIP treatment plans',
      '06.webp 1800x924 | Chinese New Year and gel-nail posts',
      '07.webp 1800x924 | Educational social posts'
    ]
  },

  {
    id: 'perfect-code',
    title: 'Perfect Code Medical',
    type: 'Print · Booth · Social',
    year: '2021',
    cats: ['print', 'brand'],
    client: 'Perfect Code Medical',
    about: 'Expo booth, pull-up banner, recruitment ad, coupon and social posts for a medical-aesthetics clinic.',
    role: 'Design',
    tools: 'Photoshop · Illustrator',
    cover: 'cover.webp 900x900',
    images: [
      '01.webp 1593x1800 | Expo booth — 3D visual',
      '02.webp 1800x1360 | Booth layout with sizes',
      '03.webp 900x2497 | Pull-up banner',
      '04.webp 1800x1101 | Recruitment ad — two layouts',
      '05.webp 1800x1800 | Women’s Day post',
      '06.webp 1800x924 | Wart-removal promotion and Easter post',
      '07.webp 1800x972 | “Free 1 of 6” treatment coupon'
    ]
  },

  {
    id: 'tbm-stickers',
    title: 'TBM WhatsApp Stickers',
    type: 'Character · Illustration',
    year: '2021',
    cats: ['illustration', 'brand'],
    client: 'TBM The Beauty + Medical',
    about: 'A cat character and festive sticker sets for the clinic’s WhatsApp chats with customers — friendly replies like “Good morning”, “What time suits you?” and “OK!”.',
    role: 'Character design · Illustration',
    tools: 'Illustrator · Photoshop',
    cover: 'cover.webp 900x900',
    images: [
      '01.webp 1800x943 | Office-cat WhatsApp stickers for customer chats',
      '02.webp 1800x514 | Year of the Ox stickers',
      '03.webp 1800x514 | Easter bunny stickers'
    ]
  },

  {
    id: 'dessert-visuals',
    title: 'Ice-cream & Drink Visuals',
    type: 'Product visual · Personal',
    year: '',
    cats: ['digital'],
    about: 'Personal work for my food Instagram, Foodie AC — key visuals for ice creams and a bottled tea, using splash, texture and colour so each product reads at a glance. Not commissioned by the brands.',
    role: 'Design · Retouching',
    tools: 'Photoshop',
    cover: 'cover.webp 881x881',
    images: [
      '01.webp 881x881 | Drumstick — peanut & salted caramel',
      '02.webp 881x881 | Dreyer’s — matcha bar',
      '03.webp 881x881 | Red-bean milk ice bar',
      '04.webp 881x881 | 7-Eleven × Pablo — cheese ice cream',
      '05.webp 1636x1259 | Orange-peel oolong tea — product shot'
    ]
  },

  {
    id: 'plk-van',
    title: 'Po Leung Kuk — Van Livery',
    type: 'Vehicle graphics · Print',
    year: '2022',
    cats: ['print', 'brand'],
    client: 'Po Leung Kuk',
    about: 'Livery for two workshop vans — four views of each van, plus the Pantone colours and type sizes for production.',
    role: 'Design',
    tools: 'Illustrator',
    cover: 'cover.webp 900x625',
    images: [
      '01.webp 1800x1249 | Van livery — four views with Pantone colours',
      '02.webp 1800x1249 | Second van — same system, different workshop name',
      '03.webp 643x538 | Rear view',
      '04.webp 1800x1105 | Colour and type scale for the signage'
    ]
  },

  {
    id: 'portraits',
    title: 'Portrait Photography',
    type: 'Photography',
    year: '',
    cats: ['photo'],
    about: 'Portraits shot and retouched by me — natural light, night light and colour as part of the mood.',
    role: 'Photography · Retouching',
    tools: 'Camera · Photoshop',
    cover: 'cover.webp 900x617',
    images: [
      '01.webp 1080x606 | Portrait among red flowers',
      '02.webp 1080x720 | Pink hair, window light',
      '03.webp 1200x800 | Café portrait',
      '04.webp 1200x800 | Night portrait under the bridge'
    ]
  },

  {
    id: 'gaming-ui',
    title: 'Gaming Platform UI',
    type: 'UI · UX',
    year: '',
    cats: ['ui'],
    about: 'UI work for an online gaming platform’s web and mobile apps — mock-ups, user flows, wireframes, a UI style guide, an A/B test and admin screens.',
    role: 'UI design',
    tools: '',
    cover: 'cover.webp 900x472',
    images: [
      '01.webp 1030x540 | Mock-ups — login, betting, in-game and full screen',
      '02.webp 1030x524 | User flow — sign in to game screen',
      '03.webp 1030x540 | Wireframe — mobile, 11 marked functions',
      '04.webp 1030x540 | Wireframe — web version',
      '05.webp 1800x1577 | UI style guide — colours, corners and borders',
      '06.webp 1030x540 | A/B test — two layouts for the same screen',
      '07.webp 1800x1158 | Mobile admin screens with spec notes',
      '08.webp 1600x1726 | User flows — login and a diary app',
      '09.webp 1080x939 | Traffic statistics dashboard'
    ]
  },

  {
    id: 'concept-art',
    title: 'Character & Concept Art',
    type: 'Illustration · Personal',
    year: 'Personal',
    cats: ['illustration'],
    about: 'Personal drawing work — character paintings, machine and creature designs, costume sketches and a pig character.',
    role: 'Illustration',
    tools: 'Photoshop',
    cover: 'cover.webp 900x1264',
    images: [
      '01.webp 1281x1800 | Character painting',
      '02.webp 2584x1181 | “C.H.T — Art of Ting” banner with a creature painting',
      '03.webp 1800x1292 | Machine — exploded view',
      '04.webp 1263x809 | Creature design — “Flash”',
      '05.webp 1800x1218 | Costume sketches',
      '06.webp 1756x1756 | Pig character'
    ]
  }

];
