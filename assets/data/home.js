/* ==========================================================================
   HOME「Selected work」—— 首頁精選 5 格

   每格形狀固定（a 大橫、b 直 4:5、c 橫 4:3、d 正方、e 橫 4:3）。
   圖片放喺 assets/work/home/，最好預先裁好成嗰格嘅形狀。

   from: 'design' 或 'video' —— 標題、類別、年份會自動由 design.js / videos.js 攞
   id:   對應嗰個作品 / 影片嘅 id（撳落去會打開佢）
   想自己寫標題：加  title: '...', type: '...', year: '...'
   ========================================================================== */

window.HOME_PICKS = [
  { slot: 'a', from: 'design', id: 'yi-ming-tong', image: 'a.webp 1600x1000' },
  { slot: 'b', from: 'video',  id: 'dragon',       image: 'b.webp 720x900' },
  { slot: 'c', from: 'design', id: 'cm-plus',      image: 'c.webp 1600x1200' },
  { slot: 'd', from: 'design', id: 'tbm',          image: 'd.webp 1200x1200' },
  { slot: 'e', from: 'video',  id: 'six-seven',    image: 'e.webp 960x720' }
];
