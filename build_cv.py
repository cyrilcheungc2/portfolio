# Generates cv.html next to this file. Edit the data below, then run:  python3 build_cv.py
# (Or edit cv.html directly — but then don't re-run this, or your edits are overwritten.)
import html as H, os

def zh(text, tag='span', cls='zh'):
    """Chinese line: hidden until 中英對照 is on. Inner span lets it expand smoothly."""
    if not text: return ''
    return f'<{tag} class="{cls}" lang="zh-Hant-HK"><span>{H.escape(text)}</span></{tag}>'

JOBS = [
 ('2024','Now','Jul 2024 – Present','2024年7月至今','Freelance Designer','自由職業設計師','Self-employed','自僱',
  [('Print and digital design, EDMs and social content for different clients.','為不同客戶提供印刷及數碼設計、EDM 及社交媒體內容。'),
   ('Marketing visuals for campaigns and online platforms.','為推廣活動及網上平台製作宣傳視覺。'),
   ('Video shooting and editing in Premiere Pro, including subtitles and green-screen work.','負責影片拍攝及以 Premiere Pro 剪接，包括字幕及綠幕製作。')]),
 ('2023','2024','Sep 2023 – May 2024','2023年9月至2024年5月','Marketing Designer','市場推廣設計師','Beauti22 Ltd','',
  [('Launched the brand’s Facebook page and grew it to 500+ organic followers in the first two months.','開設品牌 Facebook 專頁，首兩個月自然增長至逾 500 名追蹤者。'),
   ('Designed FB / IG posts, digital coupons and EDMs; filmed and edited beauty promotion videos.','設計 FB / IG 帖子、電子優惠券及 EDM，並拍攝及剪接美容推廣影片。'),
   ('Produced branding assets, recruitment banners and custom WhatsApp stickers.','製作品牌素材、招聘橫額及自訂 WhatsApp 貼圖。'),
   ('Print materials and support for exhibition campaigns.','製作印刷物料，並支援展覽推廣活動。'),
   ('Prepared Meta ad creatives, with basic set-up, boosting and copywriting.','製作 Meta 廣告素材，並負責基本設定、推廣及文案。')]),
 ('2021','2022','Jun 2021 – Mar 2022','2021年6月至2022年3月','Senior Web Designer','高級網頁設計師','Mastermind Ltd','',
  [('Designed, built and maintained websites in VS Code with HTML, CSS, Bootstrap and basic JavaScript.','以 VS Code 及 HTML、CSS、Bootstrap、基本 JavaScript 設計、製作及維護網站。'),
   ('Built responsive layouts and tested them on desktop and mobile.','製作響應式版面，並於電腦及手機上測試。'),
   ('Worked with project managers and back-end developers in regular meetings.','定期與項目經理及後端開發人員開會協作。'),
   ('Google banners, icons, logos and other graphic design.','製作 Google 橫額、圖示、標誌及其他平面設計。')]),
 ('2021','2021','Feb 2021 – May 2021','2021年2月至5月','Freelance Designer','自由職業設計師','Self-employed','自僱',
  [('Flyers, picture books, logos, pull-up banners and coupons — mainly for restaurants and charities.','設計傳單、繪本、標誌、易拉架及優惠券，客戶主要為餐飲業及慈善機構。'),
   ('Social media posts and EDMs matched to each client’s brand.','按客戶品牌設計社交媒體帖子及 EDM。'),
   ('Photography and simple video editing.','攝影及簡單影片剪接。')]),
 ('2018','2020','Sep 2018 – Sep 2020','2018年9月至2020年9月','Senior Graphic Designer','高級平面設計師','Miniwork Ltd','',
  [('Game UI for web and mobile, including mini-game interfaces.','設計網頁及手機版遊戲介面，包括小遊戲介面。'),
   ('Marketing visuals: logos, banners, EDMs and posters.','製作宣傳視覺，包括標誌、橫額、EDM 及海報。'),
   ('Prepared design guidelines for front-end developers and checked the build on web and mobile.','為前端開發人員製作設計指引，並於網頁及手機上檢查成品。'),
   ('Planned work and schedules with project managers and the front-end / back-end teams; assigned components to junior designers.','與項目經理及前後端團隊安排工作及進度，並分配設計部件予初級設計師。')]),
 ('2016','2017','Apr 2016 – Jul 2017','2016年4月至2017年7月','Senior Multimedia Designer','高級多媒體設計師','Silent Majority','',
  [('Facebook and website visuals, basic photography, filming and short-film editing.','製作 Facebook 及網站視覺，並負責基本攝影、拍攝及短片剪接。'),
   ('Trained junior designers and helped interview new designers.','培訓初級設計師，並協助面試新設計師。')]),
 ('2014','2016','Apr 2014 – Apr 2016','2014年4月至2016年4月','Web Designer','網頁設計師','LujoLujo Asia Company Ltd — Funshare.com','',
  [('Website interface design, covers, posters and EDMs for Funshare.com.','為 Funshare.com 設計網站介面、封面、海報及 EDM。')]),
 ('2012','2013','Dec 2012 – Jun 2013','2012年12月至2013年6月','Assistant Illustrator','助理插畫師','Next Media — Sharp Daily','壹傳媒 — 爽報',
  [('Illustrations and newspaper layouts for daily print.','繪畫插圖及負責每日報章排版。')]),
 ('2012','2012','Mar 2012 – Jun 2012','2012年3月至6月','Concept Artist','概念美術師','T-Films','',
  [('Early concept drawings, pre-production visuals and posters for film projects.','為電影項目繪畫前期概念圖、製作前期視覺及海報。')]),
 ('2011','2012','Sep 2011 – Jan 2012','2011年9月至2012年1月','Graphic Designer','平面設計師','Mica International Company Ltd','',
  [('Posters, print and banner ads.','設計海報、印刷品及橫額廣告。')]),
]
# SELECTED PROJECT — shown above Experience. No job title on purpose.
PROJECT = dict(
  name='ViaToyz', kind='Independent e-commerce brand', kind_zh='獨立電商品牌',
  when='May 2026 – Present', when_zh='2026年5月至今',
  intro=('Built and developed a real-world e-commerce brand from launch, combining visual design, AI-assisted content production and day-to-day digital execution.',
         '由品牌推出開始實際建立及營運電商視覺內容，結合視覺設計、AI 輔助內容製作及日常數碼執行。'),
  tags=[('E-commerce','電商'),('AI Video','AI 影片'),('Social / Ads','社交媒體 / 廣告')],
  points=[
   ('Developed the brand’s visual direction across the online store, product launches, promotional campaigns and social media.','建立品牌於網店、產品發布、推廣活動及社交媒體上的整體視覺方向。'),
   ('Created product visuals, key visuals, website banners and short-form AI videos — from concept, storyboard and shot planning to generation, editing and final delivery.','製作產品圖、主視覺、網站 Banner 及 AI 短片，由概念、分鏡及鏡頭規劃，到生成、剪接及最終成片。'),
   ('Produced e-commerce content across product pages, homepage campaigns, Instagram, Facebook and Threads.','製作產品頁、首頁 Campaign，以及 Instagram、Facebook、Threads 等電商及社交媒體內容。'),
   ('Created Meta advertising visuals and used GA4 and Google Search Console to review traffic, customer journeys and content performance.','製作 Meta 廣告視覺，並利用 GA4 及 Google Search Console 檢視流量、顧客流程及內容表現。'),
   ('Managed the creative workflow across web, social and video, turning individual products into complete launch-ready campaigns.','統籌網站、社交媒體及影片的創意流程，將單一產品發展成完整、可推出市場的宣傳內容。'),
  ])

EDU = [
 ('2022','Certificate in Backend Web Developer','後端網頁開發證書','SCOPE & ERB','城大專業進修學院（SCOPE）及僱員再培訓局（ERB）'),
 ('2018','Certificate Course in Home Page Designer','網頁設計師證書課程','HKFTU Spare Time Study Centre','工聯會業餘進修中心'),
 ('2011 – 2013','Diploma in Product Design Engineering','產品設計工程文憑','VTC','職業訓練局（VTC）'),
 ('2010 – 2011','Professional Diploma in Concept Art & Design','概念美術及設計專業文憑','Kwun Tong Vocational Training Centre','觀塘職業訓練中心'),
 ('2007 – 2008','Advanced Diploma in Illustration & Design','插畫及設計高級文憑','Kwun Tong Vocational Training Centre','觀塘職業訓練中心'),
 ('2006 – 2007','Diploma in Graphic Art & Design','平面藝術及設計文憑','Kwun Tong Vocational Training Centre','觀塘職業訓練中心'),
]
# CORE STRENGTHS — no percentages on purpose. Order = importance.
STRENGTHS = [   # primary
 ('Visual Design','視覺設計',
  [('Campaign',''),('E-commerce','電商'),('Branding','品牌'),('Digital / Print','數碼 / 印刷'),('Social visuals','社交媒體視覺')]),
 ('Creative Concepts','創意構思',
  [('Concept development','概念發展'),('Storytelling','故事構思'),('Art direction','美術指導'),('Storyboarding','分鏡')]),
 ('AI Visual / Video','AI 圖像 / 影片',
  [('AI image','AI 圖像'),('AI video','AI 影片'),('Shot planning','鏡頭規劃'),('Prompt direction',''),('Reference consistency','參考圖一致性')]),
]
SUPPORTING = [
 ('Video Editing','影片剪接', [('Short-form','短片'),('Premiere Pro',''),('Colour','調色'),('Subtitles','字幕')]),
 ('Photography','攝影', [('Product','產品'),('Food','食物'),('Portrait','人像'),('Retouching','修圖')]),
]
CAM = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 8h3l1.6-2h6.8L17 8h3v11H4z"/><circle cx="12" cy="13.2" r="3.6"/></svg>'
CODE = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8.5 7 3.5 12l5 5M15.5 7l5 5-5 5"/></svg>'
TOOLS = [   # icon tiles (glow lap)
 ('Design &amp; video','設計及剪片', [('Ps','Photoshop',''),('Ai','Illustrator',''),('Pr','Premiere Pro',''),('Ae','After Effects',''),('剪','CapCut 剪映','')]),
 ('AI','', [('Sd','Seedance',''),('即','Jimeng 即夢',''),('Hf','Higgsfield','')]),
]
TOOL_TAGS = [   # small tags
 ('Web &amp; digital','網頁及數碼', [('HTML / CSS',''),('Bootstrap',''),('WordPress',''),('GitHub',''),('VS Code',''),('GA4',''),('Google Search Console','')]),
 ('Drawing &amp; traditional art','繪畫及傳統美術', [('Illustration &amp; storyboarding','插畫及分鏡'),('Sketching','素描'),('Acrylic','塑膠彩'),('Oil pastel','油粉彩'),('Colour pencil','木顏色'),('Soft pastel','粉彩'),('Watercolour','水彩'),('Wacom tablet','Wacom 繪圖板')]),
]
AWARDS = [
 ('“18 Districts Loveable Sights” Drawing Competition',''),
 ('Original Animation Humanoid Design Competition',''),
]
HOBBIES = [('Swimming','游泳'),('Running','跑步'),('Sports','運動'),('Movies','電影'),('Music','音樂')]
LANGS = [('Cantonese','廣東話','Native','母語'),('Mandarin','普通話','Conversational','日常會話'),('English','英文','Basic','基礎')]

def h2(id_, en, zh_, reveal=True):
    r = ' data-reveal' if reveal else ''
    return f'<h2 class="cv-h2" id="{id_}"{r}>{en}{zh(zh_, "span", "zh zh-h")}</h2>'

jobs=[]
for (y1,y2,months,months_zh,role,role_zh,org,org_zh,pts) in JOBS:
    years = y1 if y1==y2 else f'{y1}<span class="cv-dash">–</span>{y2}'
    points=''.join(f'\n              <li>{H.escape(e)}{zh(c)}</li>' for e,c in pts)
    jobs.append(f'''
        <li class="cv-job" data-seq>
          <div class="cv-when" data-step>
            <span class="cv-years">{years}</span>
            <span class="cv-months">{months}</span>{zh(months_zh, 'span', 'zh zh-months')}
          </div>
          <div class="cv-what">
            <h3 class="cv-role" data-step>{role}{zh(role_zh, 'span', 'zh zh-role')}</h3>
            <p class="cv-org" data-step>{H.escape(org)}{zh(org_zh)}</p>
            <ul class="cv-points" data-step>{points}
            </ul>
          </div>
        </li>''')
edu=''.join(f'''
        <li class="cv-edu" data-seq>
          <span class="cv-edu-year" data-step>{y}</span>
          <div>
            <h3 class="cv-edu-name" data-step>{H.escape(n)}{zh(nz)}</h3>
            <p class="cv-edu-school" data-step>{H.escape(s)}{zh(sz)}</p>
          </div>
        </li>''' for y,n,nz,s,sz in EDU)
def kw(items):
    en = ' · '.join(e for e,_ in items)
    zh_ = ' · '.join((z or e) for e,z in items)
    return f'{en}{zh(zh_)}'
strengths = ''.join(f'''
            <li class="cv-strength" style="--i:{i}">
              <span class="cv-strength-no" aria-hidden="true">{i+1:02d}</span>
              <div class="cv-strength-head">
                <h3 class="cv-strength-name">{n}{zh(nz)}</h3>
                <span class="cv-strength-tag">Primary{zh('主力')}</span>
              </div>
              <p class="cv-strength-kw">{kw(items)}</p>
            </li>''' for i,(n,nz,items) in enumerate(STRENGTHS))
supporting = ''.join(f'''
            <li class="cv-support" style="--i:{i+len(STRENGTHS)}">
              <h4 class="cv-support-name">{n}{zh(nz)}</h4>
              <p class="cv-strength-kw">{kw(items)}</p>
            </li>''' for i,(n,nz,items) in enumerate(SUPPORTING))
tools=[]; k=0
for group,group_zh,items in TOOLS:
    tiles=[]
    for mark,name,name_zh in items:
        is_svg = mark.startswith('<svg')
        lang = ' lang="zh-Hant-HK"' if mark in ('即', '剪') else ''
        icon = mark if is_svg else f'<span class="cv-mono"{lang}>{mark}</span>'
        level = ''
        tiles.append(f'''
            <li class="cv-tool" style="--k:{k}" tabindex="0" data-tool>
              <span class="cv-tool-icon" aria-hidden="true">{icon}</span>
              <span class="cv-tool-name">{name}{zh(name_zh)}</span>{level}
            </li>''')
        k+=1
    tools.append(f'''
          <div class="cv-tool-group">
            <h4 class="cv-tool-group-title">{group}{zh(group_zh)}</h4>
            <ul class="cv-tools">{''.join(tiles)}
            </ul>
          </div>''')
for group,group_zh,items in TOOL_TAGS:
    chips=''.join(f'''
              <li>{name}{zh(name_zh)}</li>''' for name,name_zh in items)
    tools.append(f'''
          <div class="cv-tool-group">
            <h4 class="cv-tool-group-title">{group}{zh(group_zh)}</h4>
            <ul class="cv-tags">{chips}
            </ul>
          </div>''')
awards=''.join(f'''
            <li>{H.escape(a)}{zh(az)}</li>''' for a,az in AWARDS)
hobbies=''.join(f'''
            <li>{e}{zh(z)}</li>''' for e,z in HOBBIES)
P = PROJECT
project_tags = ''.join(f'\n              <li>{e}{zh(z)}</li>' for e,z in P['tags'])
project_points = ''.join(f'''
              <li>{H.escape(e)}{zh(c)}</li>''' for e,c in P['points'])
project = f'''
        <!-- SELECTED PROJECT: shown before Experience -->
        <section class="cv-section" id="project" aria-labelledby="proj-title">
          {h2('proj-title','Selected project','精選項目')}
          <article class="cv-project" data-seq>
            <div class="cv-project-head" data-step>
              <h3 class="cv-project-name">{P['name']}</h3>
              <p class="cv-project-when">{P['when']}{zh(P['when_zh'])}</p>
            </div>
            <p class="cv-project-kind" data-step>{P['kind']}{zh(P['kind_zh'])}</p>
            <ul class="cv-project-tags" data-step aria-label="Focus">{project_tags}
            </ul>
            <p class="cv-project-intro" data-step>{H.escape(P['intro'][0])}{zh(P['intro'][1])}</p>
            <ul class="cv-points" data-step>{project_points}
            </ul>
          </article>
        </section>
'''
langs=''.join(f'''
            <li><span class="cv-lang">{e}{zh(ez)}</span><span class="cv-lang-level">{l}{zh(lz)}</span></li>''' for e,ez,l,lz in LANGS)

TOGGLE_ICON = '<span class="zh-switch" aria-hidden="true"><span></span></span>'
page = f'''<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>CV — Cyril Cheung</title>
  <meta name="description" content="CV of Cyril Cheung — Hong Kong designer with 10+ years in visual design, digital content and moving image, plus AI-assisted visual and video production.">
  <meta name="theme-color" content="#120a22">

  <meta property="og:type" content="website">
  <meta property="og:title" content="CV — Cyril Cheung">
  <meta property="og:description" content="Experience, skills and tools.">
  <meta property="og:url" content="https://cyrilcheungc2.github.io/portfolio/cv.html">
  <meta property="og:image" content="https://cyrilcheungc2.github.io/portfolio/assets/images/home/og-image.jpg">
  <meta name="twitter:card" content="summary_large_image">

  <link rel="icon" href="assets/images/favicon.svg" type="image/svg+xml">

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <!-- Noto Sans HK = Traditional Chinese (Hong Kong) for the 中英對照 lines -->
  <link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wdth,wght@12..96,75..100,300..800&family=Noto+Sans+HK:wght@400;500;700&display=swap" rel="stylesheet">

  <link rel="stylesheet" href="assets/css/main.css">
  <link rel="stylesheet" href="assets/css/pages/cv.css">
  <script>
    document.documentElement.classList.add('js');
    // restore 中英對照 before first paint, so the page doesn't jump
    try {{ if (localStorage.getItem('cyril-zh') === '1') document.documentElement.classList.add('show-zh'); }} catch (e) {{}}
  </script>
</head>

<body class="page-cv" id="top">
  <a class="skip-link" href="#experience">Skip to experience</a>

  <!-- ===================== HEADER / NAV (same as Home) ===================== -->
  <header class="site-header" data-header>
    <a class="wordmark" href="index.html" aria-label="Cyril Cheung — Home">CYRIL<span class="wordmark-dot" aria-hidden="true"></span></a>

    <button class="menu-btn" type="button" aria-expanded="false" aria-controls="site-nav" data-menu-btn>
      <span class="sr-only">Menu</span>
      <span class="menu-btn-lines" aria-hidden="true"></span>
    </button>

    <nav class="site-nav" id="site-nav" aria-label="Main">
      <ul class="nav-list">
        <li><a href="index.html">Home</a></li>
        <li><a href="design.html">Design</a></li>
        <li><a href="ai-video.html">AI + Video</a></li>
        <li><a href="about.html">About</a></li>
        <li><a href="cv.html" aria-current="page">CV</a></li>
      </ul>
      <a class="nav-cta" href="contact.html">Let’s talk</a>
    </nav>
  </header>

  <main>
    <!-- ===================== INTRO ===================== -->
    <section class="cv-intro" aria-labelledby="page-title" data-intro>
      <div class="cv-intro-top" data-rise style="--d:0">
        <p class="kicker">CV</p>
        <!-- 中英對照 switch: shows the Chinese line under every English line -->
        <button type="button" class="zh-toggle" aria-pressed="false" data-zh-toggle>
          {TOGGLE_ICON}<span class="zh-toggle-text">中英對照</span>
        </button>
      </div>
      <h1 class="cv-title" id="page-title"><span class="line"><span style="--d:1">Cyril Cheung</span></span></h1>
      <p class="cv-roles" data-rise style="--d:2">Senior Designer <span aria-hidden="true">·</span> Visual Design <span aria-hidden="true">·</span> Creative Concepts <span aria-hidden="true">·</span> AI Visual / Video <span aria-hidden="true">·</span> E-commerce Creative{zh('資深設計師 · 視覺設計 · 創意構思 · AI 圖像 / 影片 · 電商創意', 'span', 'zh zh-roles')}</p>
      <!-- SUMMARY: edit freely -->
      <p class="cv-summary" data-rise style="--d:3">Designer with 10+ years of experience across visual design, digital content and moving image, with recent hands-on experience in AI-assisted visual and video production. I develop ideas from concept to execution across campaigns, e-commerce, social content and short-form video — combining design judgement, AI tools and practical production to create work that is visually clear and commercially relevant.{zh('資深設計師，擁有逾十年視覺設計、數碼內容及動態影像經驗，近年專注於 AI 輔助圖像及影片製作。由創意概念到實際執行，涵蓋 Campaign、電商視覺、社交媒體內容及短片製作，結合設計判斷、AI 工具及實際製作能力，將創意轉化為清晰並具商業目的的視覺內容。')}</p>
      <ul class="cv-quick" data-rise style="--d:4">
        <li><span>Based in{zh('所在地')}</span>Hong Kong{zh('香港')}</li>
        <li><span>Designing since{zh('入行年份')}</span>2011</li>
        <li><span>Email{zh('電郵')}</span><a href="mailto:cyrilcheungc2@gmail.com">cyrilcheungc2@gmail.com</a></li>
      </ul>
    </section>

    <div class="cv-layout">
      <!-- ===================== MAIN COLUMN ===================== -->
      <div class="cv-main">
{project}
        <!-- EXPERIENCE: newest first. Each entry appears year → title → company → details. -->
        <section class="cv-section" id="experience" aria-labelledby="exp-title" tabindex="-1">
          {h2('exp-title','Experience','工作經驗')}
          <ol class="cv-timeline">{''.join(jobs)}
          </ol>
        </section>

        <section class="cv-section" aria-labelledby="edu-title">
          {h2('edu-title','Education','學歷')}
          <ol class="cv-edu-list">{edu}
          </ol>
        </section>
      </div>

      <!-- ===================== SIDE COLUMN ===================== -->
      <aside class="cv-side" aria-label="Strengths, tools, languages, awards and hobbies">
        <!-- CORE STRENGTHS: 3 primary + 2 supporting. No percentages on purpose. -->
        <section class="cv-section cv-card" aria-labelledby="skills-title" data-skills>
          {h2('skills-title','Core strengths','核心能力', False)}
          <ol class="cv-strengths">{strengths}
          </ol>
          <h3 class="cv-sub-title">Supporting{zh('輔助能力')}</h3>
          <ul class="cv-supports">{supporting}
          </ul>
        </section>

        <!-- TOOLS: only tools you really use. -->
        <section class="cv-section cv-card" aria-labelledby="tools-title" data-tools>
          {h2('tools-title','Tools','工具', False)}{''.join(tools)}
        </section>

        <section class="cv-section cv-card" aria-labelledby="lang-title" data-reveal>
          {h2('lang-title','Languages','語言', False)}
          <ul class="cv-langs">{langs}
          </ul>
        </section>

        <!-- AWARDS: add the year / result if you have them -->
        <section class="cv-section cv-card" aria-labelledby="awards-title" data-reveal>
          {h2('awards-title','Awards','獎項', False)}
          <ul class="cv-list">{awards}
          </ul>
        </section>

        <section class="cv-section cv-card" aria-labelledby="hobby-title" data-reveal>
          {h2('hobby-title','Outside work','工作以外', False)}
          <ul class="cv-tags">{hobbies}
          </ul>
        </section>
      </aside>
    </div>

    <!-- ===================== NEXT ===================== -->
    <section class="next-block" aria-label="Next">
      <a class="next-link" href="contact.html">
        <span class="kicker">Next</span>
        <span class="next-title">Contact <span class="next-arrow" aria-hidden="true">→</span></span>
      </a>
      <!-- CONTACT: email only (no phone, no Instagram). -->
      <ul class="contact-links">
        <li><a href="mailto:cyrilcheungc2@gmail.com">cyrilcheungc2@gmail.com</a></li>
      </ul>
    </section>
  </main>

  <footer class="site-footer">
    <p>© 2026 Cyril Cheung</p>
    <a href="#top" data-to-top>Back to top <span aria-hidden="true">↑</span></a>
  </footer>

  <!-- Floating copy of the switch, shown after scrolling past the intro -->
  <button type="button" class="zh-toggle zh-float" aria-pressed="false" data-zh-toggle data-zh-float>
    {TOGGLE_ICON}<span class="zh-toggle-text">中英對照</span>
  </button>

  <script src="assets/js/main.js" defer></script>
  <script src="assets/js/pages/cv.js" defer></script>
</body>
</html>
'''
open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'cv.html'),'w',encoding='utf-8').write(page)
print('cv.html', len(page), 'chars; zh lines:', page.count('class="zh'))
