// Site copy in four languages. Japanese is the original; English, Simplified
// Chinese and Korean are translations of it. Prices stay in yen.
export type Lang = 'ja' | 'en' | 'zh' | 'ko'
export const LANGS: Lang[] = ['ja', 'en', 'zh', 'ko']
export const OTHER_LANGS: Exclude<Lang, 'ja'>[] = ['en', 'zh', 'ko']
export const LANG_LABEL: Record<Lang, string> = { ja: '日本語', en: 'English', zh: '中文', ko: '한국어' }
export const LANG_SHORT: Record<Lang, string> = { ja: 'JP', en: 'EN', zh: '中', ko: '한' }
export const HTML_LANG: Record<Lang, string> = { ja: 'ja', en: 'en', zh: 'zh-Hans', ko: 'ko' }

// path of a page inside the site, relative to <base href>: '' / 'en/' ...
export const prefix = (lang: Lang) => (lang === 'ja' ? '' : `${lang}/`)

type Commitment = { title: string; body: string }
type Product = { name: string; description: string; alt: string }
type Signature = { name: string; alt: string; copy: string[] }

export type Dict = {
  meta: { title: string; description: string; newsTitle: string; newsDescription: string }
  nav: Record<'intro' | 'news' | 'media' | 'concept' | 'products' | 'store' | 'access', string>
  header: { top: string; open: string; close: string; reserve: string; reserveLong: string; newTab: string; walk: string; hours: string; language: string }
  intro: { h1: string; video: string; copy: string[] }
  news: { label: string; lead: string[]; all: string; pageLead: string[]; back: string; filterAll: string; categories: Record<string, string>; original: string; viewOnInstagram: string }
  media: { label: string; lead: string[]; intro: string; more: string; kinds: Record<string, string> }
  signature: { heading: string; details: string; items: Signature[] }
  concept: { label: string; lead: string[]; poem: string[]; body: string; listLabel: string; imageAlt: string; items: Commitment[] }
  products: { label: string; lead: string[]; intro: string; taxNote: string; reserve: string; reserveAria: (name: string) => string; priceAria: (price: string) => string; yen: string; items: Product[] }
  store: { label: string; lead: string[]; catchCopy: string[]; lines: string[]; body: string; bullets: string[]; alts: [string, string, string] }
  access: { label: string; lead: string[]; body: string; rows: { name: string; address: string; access: string; hours: string; closed: string; payment: string; contact: string }; values: { name: string; access: string; hours: string; closed: string; payment: string }; reserve: string; map: string }
  footer: { nav: string; rights: string }
}

const ja: Dict = {
  meta: {
    title: '門仲どらやき どら山 總本鋪 | 門前仲町のどらやき専門店 DORAYAMA',
    description:
      '門前仲町、深川不動堂と富岡八幡宮の参道にあるどらやき専門店。毎朝、店頭の銅板で一枚ずつ手焼きする、ふかふかの「おふとん生地」と塩入りつぶあん。東京メトロ門前仲町駅から徒歩1分、年中無休。',
    newsTitle: 'お知らせ | 門仲どらやき どら山 總本鋪',
    newsDescription: '門仲どらやき どら山からのお知らせ。月替わりの旬どら、催事への出店、メディア掲載などをご案内します。',
  },
  nav: { intro: 'トップ', news: 'お知らせ', media: 'メディア掲載', concept: 'こだわり', products: 'お品書き', store: '總本鋪', access: '店舗情報' },
  header: {
    top: '門仲どらやき どら山 トップへ',
    open: 'メニューを開く',
    close: 'メニューを閉じる',
    reserve: 'ご予約',
    reserveLong: 'ご予約（テイクイーツ）',
    newTab: '（新しいタブで開きます）',
    walk: '門前仲町駅 徒歩1分',
    hours: '10:00〜16:00（売り切れ次第終了）・年中無休',
    language: '言語を選ぶ',
  },
  intro: {
    h1: '門仲どらやき どら山 總本鋪',
    video: 'どら山の店先と、銅板でどらやきを焼く様子',
    copy: [
      '深川不動堂と富岡八幡宮の参道、',
      '門前仲町の路地に、どら山はあります。',
      '毎朝、店頭の銅板で一枚ずつ。',
      '卵白を泡立てた、おふとんのような生地に、',
      '十勝の小豆を炊いた、塩入りのつぶあん。',
      '富岡八幡宮に奉納する、縁起の良い門仲どらやき。',
      'また食べたくなる、毎日食べたくなる。',
    ],
  },
  news: {
    label: 'お知らせ',
    lead: ['Seasonal dorayaki of the month,', 'media coverage and other news from the shop.'],
    all: 'お知らせ一覧',
    pageLead: ['Seasonal dorayaki of the month, media coverage', 'and other news from DORAYAMA in Monzen-nakacho.'],
    back: 'お知らせ一覧',
    filterAll: 'すべて',
    categories: { 旬どら: '旬どら', 新商品: '新商品', '催事・出店': '催事・出店', メディア: 'メディア', 店舗のお知らせ: '店舗のお知らせ', 開店までの歩み: '開店までの歩み', その他: 'その他' },
    original: '',
    viewOnInstagram: 'Instagramで見る',
  },
  media: {
    label: 'メディア掲載',
    lead: ['Featured on television, in magazines', 'and on the web.'],
    intro: 'テレビや雑誌、ウェブメディアでご紹介いただきました。',
    more: '掲載の詳しい内容',
    kinds: { テレビ: 'テレビ', 雑誌: '雑誌', 書籍: '書籍', 新聞: '新聞', ウェブ: 'ウェブ', ラジオ: 'ラジオ', その他: 'その他' },
  },
  signature: {
    heading: '門仲どらやき',
    details: '（商品詳細）',
    items: [
      { name: 'おふとん生地', alt: '銅鍋の横で、銅板に生地を流す手元', copy: ['卵の白身を泡立てたメレンゲに、', '卵・小麦粉・砂糖を合わせた', 'どら山の黄金比率の生地。', '毎朝、銅鍋で仕込み、', 'ひとつずつ銅板へ流します。'] },
      { name: '銅板手焼き', alt: '銅板の上でこんがりと焼き上がった皮', copy: ['熱をむらなく伝える銅板で、', '一枚ずつ手で焼き上げます。', '焼き色と火の通りを見極め、', 'ふかふかのおふとんのような', '皮に仕上げます。'] },
      { name: '黑どら', alt: '断面を見せた、つぶあんの黑どら', copy: ['焼きたての皮で挟むのは、', '北海道十勝産の小豆を', '甘さ控えめに炊いたつぶあん。', '隠し味に塩をきかせた、', 'どら山の定番です。'] },
    ],
  },
  concept: {
    label: 'こだわり',
    lead: ['Each dorayaki is baked by hand on a copper griddle every morning,', 'and has long been offered to Tomioka Hachimangu Shrine.'],
    poem: ['富岡八幡宮奉納、', '毎朝、銅板で一枚ずつ。', 'また食べたくなる、', '毎日食べたくなる。'],
    body: '深川不動堂と富岡八幡宮を結ぶ参道の近く、門前仲町に店を構えるどらやき専門店です。富岡八幡宮に奉納している縁起の良い「門仲どらやき」を、毎朝店内で焼き上げています。ふかふかの生地と、塩をきかせたつぶあん。温めれば焼きたての香りがよみがえる、日々のおやつにも手みやげにもなるどらやきです。',
    listLabel: 'どら山のこだわり',
    imageAlt: '薄暗い店内で静かに並ぶどらやき',
    items: [
      { title: 'おふとん生地', body: '卵の白身を分けて泡立て、きめ細かなメレンゲにしてから生地に合わせます。たっぷりと空気を含ませることで、スポンジケーキのようにふわりと軽い、ふかふかのおふとんのような皮に焼き上がります。' },
      { title: '銅板手焼き', body: '生地は毎朝、店頭の銅板で一枚ずつ手で焼いています。熱をむらなく伝える銅板で、焼き色と火の通りを見極めながら返していく。店先からは、その日の焼きたての香りが漂います。' },
      { title: '新三同割', body: '卵・小麦粉・砂糖を同じ割合で合わせる、和菓子の伝統配合「三同割」。この基本を土台に、幾千回の試作を重ねて、どら山だけの黄金比率にたどり着きました。' },
      { title: '塩入りつぶあん', body: '北海道十勝産の小豆に白双糖を合わせ、甘さを控えめに炊き上げます。隠し味に塩をきかせ、粒の食感を残すのがどら山のつぶあん。ふんわりした生地との対比を楽しめます。' },
      { title: '国産素材', body: '北海道十勝産小豆、純国産本みりん、香川県産うどん粉、国産こめ油、北海道産てんさい糖。毎日食べても飽きのこない味を目指し、素材は国産のものを選んでいます。' },
    ],
  },
  products: {
    label: 'お品書き',
    lead: ['Skins baked fresh every morning,', 'with classic and seasonal fillings.'],
    intro: '毎朝焼き上げる皮に、定番のつぶあんと白あん、季節ごとの味を挟んでいます。店頭ではその日に焼いたどらやきを、ご予約はテイクイーツで翌日以降のお受け取り分を5個から承ります。',
    taxNote: '価格はすべて税込です。',
    reserve: 'ご予約',
    reserveAria: (name) => `${name}をご予約（新しいタブで開きます）`,
    priceAria: (price) => `税込${price}円`,
    yen: '圓',
    items: [
      { name: '黑どら（つぶあん）', description: 'どら山の定番。北海道十勝産の小豆を甘さ控えめに炊き、隠し味に塩をきかせたつぶあんを、ふかふかの生地でたっぷり挟みました。', alt: '黑どら（つぶあん）' },
      { name: '白どら（白あん）', description: '白いんげん豆の白あんを挟んだ、やさしい甘さのどらやき。つぶあんとはまた違う、なめらかな口あたりを楽しめます。', alt: '白どら（白あん）' },
      { name: 'あんバターどら', description: '塩入りのつぶあんに、十勝産生乳のバターを合わせました。あんの甘さとバターのコクが重なる、ひと口目から満足感のある一品です。', alt: 'つぶあんとバターを挟んだ、あんバターどら' },
      { name: 'めっちゃ抹茶どら', description: '抹茶をたっぷり使った、鮮やかな緑のどらやき。抹茶好きの方にこそ味わっていただきたい、香りの立つひと品です。', alt: '抹茶色の生地の、めっちゃ抹茶どら' },
      { name: '生どら', description: '季節のフルーツとクリームを、ふかふかの生地で包みました。中身は時季によって入れ替わります。', alt: 'バナナとクリームを挟んだ生どら' },
      { name: '旬どら（月替わり）', description: '毎月入れ替わる、季節のどらやき。10月は「幻の栗マロンかぼちゃどら」です。月ごとの味はお知らせとInstagramでご案内します。', alt: '10月の旬どら、幻の栗マロンかぼちゃどら' },
      { name: '皮だけ（4枚）', description: 'ふかふかの生地だけを4枚にした、どら山ならではのセット。あんこが苦手な方も、お好みのトッピングでオリジナルのどらやきをお楽しみいただけます。', alt: 'どらやきの皮だけ4枚セット' },
      { name: '手みやげ・ギフト', description: 'ひとつずつ個包装にし、箱と紙袋に入れてお渡しします。個包装なので、職場や集まりでの配り分けにも便利です。ご挨拶や手みやげにどうぞ。', alt: '個包装のどらやきとギフト箱、紙袋' },
    ],
  },
  store: {
    label: '總本鋪',
    lead: ['On the approach to Fukagawa Fudodo and Tomioka Hachimangu,', 'the batter is baked fresh in the shop every morning.'],
    catchCopy: ['参道の', '焼きたてを'],
    lines: ['深川不動堂と富岡八幡宮の参道。', '毎朝、店内で生地を焼いています。'],
    body: '2022年6月、門前仲町に開いた總本鋪。東京メトロ東西線「門前仲町駅」から徒歩1分、三菱UFJ銀行ビルの裏の路地に、白い暖簾が目印の小さな店を構えています。窓越しに銅板で焼く様子が見え、店先には焼きたての香り。参拝の帰りや、ちょっとした手みやげに立ち寄っていただける店でありたいと思っています。',
    bullets: ['テレビ朝日「じゅん散歩」で紹介', '富岡八幡宮へ定期奉納'],
    alts: ['のれんの掛かった、どら山 總本鋪の外観', 'どらやきが並ぶ店内の棚', 'ギフト用の箱と紙袋'],
  },
  access: {
    label: '店舗情報',
    lead: ['A one-minute walk from Monzen-nakacho Station,', 'open every day from 10:00 until sold out.'],
    body: '毎日10時から16時まで、年中無休で営業しています。毎朝焼いた分がなくなり次第終了となりますので、確実にお求めになりたい方はご予約が便利です。ご予約はテイクイーツから、翌日以降のお受け取り分を5個から、30日先まで承ります（お受け取りは10:30〜15:45）。お支払いはオンライン決済のほか店頭でも可能で、店頭ではクレジットカードと交通系ICがご利用いただけます。',
    rows: { name: '店名', address: '住所', access: 'アクセス', hours: '営業時間', closed: '定休日', payment: 'お支払い', contact: 'お問い合わせ' },
    values: { name: '門仲どらやき どら山 總本鋪', access: '東京メトロ東西線「門前仲町駅」徒歩1分', hours: '10:00〜16:00（売り切れ次第終了）', closed: '年中無休', payment: 'クレジットカード・交通系IC' },
    reserve: 'ご予約（翌日以降・5個から）',
    map: 'Googleマップで開く・経路を調べる',
  },
  footer: { nav: 'フッターナビゲーション', rights: '© DORAYAMA All Rights Reserved.' },
}

const en: Dict = {
  meta: {
    title: 'Monnaka Dorayaki DORAYAMA | Dorayaki shop in Monzen-nakacho, Tokyo',
    description:
      'A dorayaki shop on the approach to Fukagawa Fudodo and Tomioka Hachimangu Shrine in Monzen-nakacho, Tokyo. Fluffy pancakes baked by hand on a copper griddle every morning, filled with lightly salted red bean paste. One minute from Monzen-nakacho Station, open every day.',
    newsTitle: 'News | Monnaka Dorayaki DORAYAMA',
    newsDescription: 'News from DORAYAMA: the seasonal dorayaki of the month, pop-up shops and media coverage.',
  },
  nav: { intro: 'Home', news: 'News', media: 'Media', concept: 'Concept', products: 'Products', store: 'Store', access: 'Access' },
  header: {
    top: 'Monnaka Dorayaki DORAYAMA, back to top',
    open: 'Open menu',
    close: 'Close menu',
    reserve: 'Reserve',
    reserveLong: 'Reservations (Take Eats, Japanese)',
    newTab: ' (opens in a new tab)',
    walk: '1 min walk from Monzen-nakacho Station',
    hours: '10:00–16:00 (until sold out), open every day',
    language: 'Choose language',
  },
  intro: {
    h1: 'Monnaka Dorayaki DORAYAMA',
    video: 'The front of the shop and dorayaki being baked on a copper griddle',
    copy: [
      'On the approach to Fukagawa Fudodo and Tomioka Hachimangu,',
      'in a side street of Monzen-nakacho, you will find Dorayama.',
      'Every morning, one by one, on the copper griddle in the shop.',
      'A pancake as soft as a futon, made with whipped egg whites,',
      'and red bean paste from Tokachi, with a touch of salt.',
      'Monnaka dorayaki, offered to Tomioka Hachimangu for good fortune.',
      'The kind you want again, the kind you want every day.',
    ],
  },
  news: {
    label: 'News',
    lead: ['Seasonal dorayaki of the month,', 'media coverage and other news from the shop.'],
    all: 'All news',
    pageLead: ['Seasonal dorayaki of the month, media coverage', 'and other news from DORAYAMA in Monzen-nakacho.'],
    back: 'All news',
    filterAll: 'All',
    categories: { 旬どら: 'Seasonal', 新商品: 'New items', '催事・出店': 'Pop-ups', メディア: 'Media', 店舗のお知らせ: 'Shop news', 開店までの歩み: 'Our beginnings', その他: 'Other' },
    original: 'The full article is in Japanese.',
    viewOnInstagram: 'View on Instagram',
  },
  media: {
    label: 'Media',
    lead: ['Featured on television, in magazines', 'and on the web.'],
    intro: 'Dorayama has been featured on television, in magazines and in online media.',
    more: 'Read more',
    kinds: { テレビ: 'TV', 雑誌: 'Magazine', 書籍: 'Book', 新聞: 'Newspaper', ウェブ: 'Web', ラジオ: 'Radio', その他: 'Other' },
  },
  signature: {
    heading: 'Monnaka Dorayaki',
    details: '(Details)',
    items: [
      { name: 'Futon batter', alt: 'Batter being poured onto a copper griddle beside a copper bowl', copy: ['Meringue of whipped egg whites,', 'folded with egg, flour and sugar', 'in Dorayama’s golden ratio.', 'Mixed in a copper bowl each morning', 'and poured onto the griddle one by one.'] },
      { name: 'Copper griddle', alt: 'Golden pancakes on the copper griddle', copy: ['On a copper griddle that spreads heat evenly,', 'each pancake is baked by hand.', 'Watching the colour and the heat,', 'we finish them soft and plump', 'like a futon.'] },
      { name: 'Kuro-dora', alt: 'A cut kuro-dora showing the red bean paste', copy: ['Between freshly baked pancakes,', 'red beans from Tokachi, Hokkaido,', 'cooked into a lightly sweet paste.', 'A hint of salt brings it out —', 'Dorayama’s classic.'] },
    ],
  },
  concept: {
    label: 'Concept',
    lead: ['Each dorayaki is baked by hand on a copper griddle every morning,', 'and has long been offered to Tomioka Hachimangu Shrine.'],
    poem: ['Offered to Tomioka Hachimangu,', 'baked one by one each morning.', 'The kind you want again,', 'the kind you want every day.'],
    body: 'Dorayama is a dorayaki shop in Monzen-nakacho, near the approach that links Fukagawa Fudodo and Tomioka Hachimangu Shrine. Every morning we bake our auspicious “Monnaka dorayaki”, which we offer to Tomioka Hachimangu, in the shop. Fluffy pancakes and red bean paste with a touch of salt. Warm one up and the freshly baked aroma comes back — a dorayaki for everyday treats and for gifts.',
    listLabel: 'What makes Dorayama',
    imageAlt: 'Dorayaki lined up quietly in the dim shop',
    items: [
      { title: 'Futon batter', body: 'We separate the eggs and whip the whites into a fine meringue before folding it into the batter. With plenty of air, the pancakes bake up light like sponge cake — soft and plump like a futon.' },
      { title: 'Hand-baked on copper', body: 'Every morning the batter is baked by hand, one at a time, on the copper griddle at the front of the shop. Copper spreads heat evenly, and we turn each pancake while watching its colour. The smell of fresh baking drifts out to the street.' },
      { title: 'A new “san-dō-wari”', body: '“San-dō-wari” is the traditional wagashi ratio of equal parts egg, flour and sugar. Building on it through thousands of trials, we arrived at a golden ratio of our own.' },
      { title: 'Salted red bean paste', body: 'Red beans from Tokachi, Hokkaido are cooked with white sugar into a lightly sweet paste. A hint of salt and whole beans left in give it texture — a contrast with the soft pancake.' },
      { title: 'Japanese ingredients', body: 'Tokachi red beans, pure Japanese hon-mirin, Kagawa wheat flour, Japanese rice bran oil and Hokkaido beet sugar. We choose Japanese ingredients for a taste you will not tire of, even every day.' },
    ],
  },
  products: {
    label: 'Products',
    lead: ['Skins baked fresh every morning,', 'with classic and seasonal fillings.'],
    intro: 'Pancakes baked every morning, filled with our classic red bean or white bean paste and flavours of the season. The shop sells what is baked that day; reservations for pick-up from the next day onward (5 pieces or more) are taken on Take Eats.',
    taxNote: 'All prices include tax.',
    reserve: 'Reserve',
    reserveAria: (name) => `Reserve ${name} (opens in a new tab)`,
    priceAria: (price) => `${price} yen including tax`,
    yen: 'yen',
    items: [
      { name: 'Kuro-dora (red bean)', description: 'Our classic. Red beans from Tokachi, Hokkaido, cooked lightly sweet with a hint of salt, generously filled between fluffy pancakes.', alt: 'Kuro-dora with red bean paste' },
      { name: 'Shiro-dora (white bean)', description: 'A gently sweet dorayaki filled with white kidney bean paste — smooth on the tongue, different from red bean.', alt: 'Shiro-dora with white bean paste' },
      { name: 'Anko butter dora', description: 'Salted red bean paste with butter made from Tokachi milk. The sweetness of the beans meets the richness of the butter.', alt: 'An anko butter dora with red bean paste and butter' },
      { name: 'Super matcha dora', description: 'A bright green dorayaki made with plenty of matcha — a fragrant treat for matcha lovers.', alt: 'Super matcha dora with matcha-coloured pancakes' },
      { name: 'Nama-dora (cream)', description: 'Seasonal fruit and cream wrapped in fluffy pancakes. The filling changes with the season.', alt: 'Nama-dora with banana and cream' },
      { name: 'Shun-dora (monthly special)', description: 'A seasonal dorayaki that changes every month. October’s is the “Phantom Kuri-Maron Pumpkin Dorayaki”. Each month’s flavour is announced in our news and on Instagram.', alt: 'October’s shun-dora, Kuri-Maron pumpkin dorayaki' },
      { name: 'Pancakes only (4)', description: 'A set of four of our fluffy pancakes on their own. Even if red bean is not for you, make your own dorayaki with your favourite toppings.', alt: 'A set of four dorayaki pancakes' },
      { name: 'Gifts', description: 'Each piece is wrapped individually and handed over in a box and a paper bag — easy to share at work or at a gathering. Perfect as a small gift.', alt: 'Individually wrapped dorayaki with a gift box and paper bag' },
    ],
  },
  store: {
    label: 'Store',
    lead: ['On the approach to Fukagawa Fudodo and Tomioka Hachimangu,', 'the batter is baked fresh in the shop every morning.'],
    catchCopy: ['On the approach,', 'freshly baked'],
    lines: ['On the approach to Fukagawa Fudodo and Tomioka Hachimangu.', 'We bake the pancakes in the shop every morning.'],
    body: 'Our main shop opened in Monzen-nakacho in June 2022. One minute from Monzen-nakacho Station on the Tokyo Metro Tozai Line, it is a small shop with a white noren curtain in the side street behind the MUFG Bank building. Through the window you can watch us bake on the copper griddle, and the smell of fresh baking greets you at the door. We hope you will drop in after visiting the shrine, or for a small gift.',
    bullets: ['Featured on TV Asahi’s “Jun Sanpo”', 'Regularly offered to Tomioka Hachimangu'],
    alts: ['The front of Dorayama with its noren curtain', 'Shelves of dorayaki inside the shop', 'Gift boxes and paper bags'],
  },
  access: {
    label: 'Access',
    lead: ['A one-minute walk from Monzen-nakacho Station,', 'open every day from 10:00 until sold out.'],
    body: 'We are open every day from 10:00 to 16:00. We close when the day’s baking sells out, so reserving is the surest way to get yours. Reservations are taken on Take Eats (in Japanese) for pick-up from the next day onward, from 5 pieces, up to 30 days ahead (pick-up 10:30–15:45). You can pay online or in the shop; in the shop we accept credit cards and transit IC cards.',
    rows: { name: 'Name', address: 'Address', access: 'Access', hours: 'Hours', closed: 'Closed', payment: 'Payment', contact: 'Contact' },
    values: { name: 'Monnaka Dorayaki DORAYAMA (main shop)', access: '1 min walk from Monzen-nakacho Station (Tokyo Metro Tozai Line)', hours: '10:00–16:00 (until sold out)', closed: 'Open every day', payment: 'Credit cards, transit IC cards' },
    reserve: 'Reserve (next day onward, from 5 pieces)',
    map: 'Open in Google Maps / directions',
  },
  footer: { nav: 'Footer navigation', rights: '© DORAYAMA All Rights Reserved.' },
}

const zh: Dict = {
  meta: {
    title: '门仲铜锣烧 Dorayama（どら山）总本铺 | 东京门前仲町的铜锣烧专门店',
    description:
      '位于东京门前仲町、深川不动堂与富冈八幡宫参道旁的铜锣烧专门店。每天早上在店内铜板上逐片手工烤制的松软饼皮，搭配加了少许盐的红豆馅。距门前仲町站步行1分钟，全年无休。',
    newsTitle: '新闻 | 门仲铜锣烧 Dorayama（どら山）',
    newsDescription: 'Dorayama 的最新消息：每月限定的季节铜锣烧、快闪店铺及媒体报道。',
  },
  nav: { intro: '首页', news: '新闻', media: '媒体报道', concept: '匠心', products: '商品', store: '总本铺', access: '店铺信息' },
  header: {
    top: '门仲铜锣烧 Dorayama 返回首页',
    open: '打开菜单',
    close: '关闭菜单',
    reserve: '预约',
    reserveLong: '预约（Take Eats・日文）',
    newTab: '（在新标签页打开）',
    walk: '门前仲町站步行1分钟',
    hours: '10:00〜16:00（售完即止）・全年无休',
    language: '选择语言',
  },
  intro: {
    h1: '门仲铜锣烧 Dorayama（どら山）总本铺',
    video: '店门口的景象，以及在铜板上烤制铜锣烧的样子',
    copy: [
      '在深川不动堂与富冈八幡宫的参道旁，',
      '门前仲町的小巷里，有一家 Dorayama。',
      '每天早上，在店里的铜板上一片一片地烤。',
      '用打发蛋白做成、像棉被一样松软的饼皮，',
      '夹上十胜红豆熬制、带一点盐味的红豆馅。',
      '供奉给富冈八幡宫、寓意吉祥的门仲铜锣烧。',
      '让人还想再吃，每天都想吃。',
    ],
  },
  news: {
    label: '新闻',
    lead: ['Seasonal dorayaki of the month,', 'media coverage and other news from the shop.'],
    all: '全部新闻',
    pageLead: ['Seasonal dorayaki of the month, media coverage', 'and other news from DORAYAMA in Monzen-nakacho.'],
    back: '全部新闻',
    filterAll: '全部',
    categories: { 旬どら: '当月限定', 新商品: '新品', '催事・出店': '快闪・出店', メディア: '媒体', 店舗のお知らせ: '店铺消息', 開店までの歩み: '开店历程', その他: '其他' },
    original: '完整内容为日文。',
    viewOnInstagram: '在 Instagram 查看',
  },
  media: {
    label: '媒体报道',
    lead: ['Featured on television, in magazines', 'and on the web.'],
    intro: 'Dorayama 曾受到电视、杂志及网络媒体的介绍。',
    more: '查看详情',
    kinds: { テレビ: '电视', 雑誌: '杂志', 書籍: '书籍', 新聞: '报纸', ウェブ: '网络', ラジオ: '广播', その他: '其他' },
  },
  signature: {
    heading: '门仲铜锣烧',
    details: '（商品详情）',
    items: [
      { name: '棉被饼皮', alt: '在铜锅旁把面糊倒在铜板上的手', copy: ['将蛋白打发成蛋白霜，', '再与鸡蛋、面粉、砂糖混合，', '这是 Dorayama 的黄金比例饼皮。', '每天早上在铜锅里备料，', '一片一片地倒在铜板上。'] },
      { name: '铜板手烤', alt: '在铜板上烤得金黄的饼皮', copy: ['用导热均匀的铜板，', '一片一片手工烤制。', '仔细看着颜色与火候，', '烤出像棉被一样', '松软的饼皮。'] },
      { name: '黑铜锣烧', alt: '切开后可见红豆馅的黑铜锣烧', copy: ['刚烤好的饼皮里夹的，', '是北海道十胜产的红豆', '低甜度熬制的颗粒红豆馅。', '以少许盐提味，', '是 Dorayama 的招牌。'] },
    ],
  },
  concept: {
    label: '匠心',
    lead: ['Each dorayaki is baked by hand on a copper griddle every morning,', 'and has long been offered to Tomioka Hachimangu Shrine.'],
    poem: ['供奉富冈八幡宫，', '每天早上在铜板上一片片烤制。', '让人还想再吃，', '每天都想吃。'],
    body: 'Dorayama 是一家位于门前仲町、靠近连接深川不动堂与富冈八幡宫参道的铜锣烧专门店。我们每天早上在店内烤制供奉给富冈八幡宫、寓意吉祥的「门仲铜锣烧」。松软的饼皮，加上带有盐味的红豆馅。稍微加热就能找回刚出炉的香气，既适合日常点心，也适合作为伴手礼。',
    listLabel: 'Dorayama 的坚持',
    imageAlt: '在昏暗店内静静排列的铜锣烧',
    items: [
      { title: '棉被饼皮', body: '将蛋白分开打发成细腻的蛋白霜，再拌入面糊。饱含空气的面糊，烤出来像海绵蛋糕一样轻盈，像棉被一样松软。' },
      { title: '铜板手烤', body: '每天早上在店门口的铜板上，一片一片地手工烤制。铜板导热均匀，我们一边观察颜色与火候一边翻面。店门口飘着当天刚出炉的香气。' },
      { title: '新三同割', body: '鸡蛋、面粉、砂糖以相同比例混合，是和果子的传统配方「三同割」。以此为基础，经过上千次试做，我们找到了 Dorayama 独有的黄金比例。' },
      { title: '盐味红豆馅', body: '北海道十胜产红豆配上白双糖，熬成甜度适中的豆馅。以少许盐提味，并保留颗粒口感，与松软的饼皮形成对比。' },
      { title: '日本国产食材', body: '北海道十胜红豆、纯日本产本味醂、香川县产面粉、日本产米糠油、北海道产甜菜糖。为了做出每天吃也不会腻的味道，我们选用日本国产食材。' },
    ],
  },
  products: {
    label: '商品',
    lead: ['Skins baked fresh every morning,', 'with classic and seasonal fillings.'],
    intro: '每天早上烤制的饼皮，夹上经典的红豆馅、白豆馅以及季节限定口味。店内出售当天烤制的铜锣烧；在 Take Eats 可预约次日以后取货的商品（5个起）。',
    taxNote: '价格均为含税价。',
    reserve: '预约',
    reserveAria: (name) => `预约${name}（在新标签页打开）`,
    priceAria: (price) => `含税${price}日元`,
    yen: '日元',
    items: [
      { name: '黑铜锣烧（颗粒红豆）', description: 'Dorayama 的招牌。北海道十胜红豆低甜度熬制，以少许盐提味，满满夹在松软的饼皮中。', alt: '黑铜锣烧（颗粒红豆）' },
      { name: '白铜锣烧（白豆馅）', description: '夹着白芸豆馅、甜味温和的铜锣烧。与红豆馅不同，口感更加顺滑。', alt: '白铜锣烧（白豆馅）' },
      { name: '红豆黄油铜锣烧', description: '在盐味红豆馅中加入十胜生乳制成的黄油。豆馅的甜与黄油的香浓相互交融。', alt: '夹着红豆馅与黄油的红豆黄油铜锣烧' },
      { name: '超浓抹茶铜锣烧', description: '使用大量抹茶、色泽鲜绿的铜锣烧。香气浓郁，献给喜爱抹茶的你。', alt: '抹茶色饼皮的超浓抹茶铜锣烧' },
      { name: '生铜锣烧（鲜奶油）', description: '用松软的饼皮包住季节水果和奶油，内馅随季节更换。', alt: '夹着香蕉与奶油的生铜锣烧' },
      { name: '当月限定铜锣烧', description: '每月更换口味的季节铜锣烧。10月为「梦幻栗子南瓜铜锣烧」。每月口味会在新闻与 Instagram 公布。', alt: '10月限定的栗子南瓜铜锣烧' },
      { name: '只有饼皮（4片）', description: '只有松软饼皮的4片装，是 Dorayama 特有的组合。不喜欢豆馅的人，也可以用喜欢的配料做出自己的铜锣烧。', alt: '4片铜锣烧饼皮套装' },
      { name: '伴手礼・礼盒', description: '每个独立包装，装入礼盒和纸袋交给您。独立包装便于在公司或聚会上分发，适合作为问候礼或伴手礼。', alt: '独立包装的铜锣烧、礼盒与纸袋' },
    ],
  },
  store: {
    label: '总本铺',
    lead: ['On the approach to Fukagawa Fudodo and Tomioka Hachimangu,', 'the batter is baked fresh in the shop every morning.'],
    catchCopy: ['参道旁的', '新鲜出炉'],
    lines: ['深川不动堂与富冈八幡宫的参道旁。', '每天早上在店内烤制饼皮。'],
    body: '2022年6月在门前仲町开业的总本铺。距东京地铁东西线「门前仲町站」步行1分钟，位于三菱UFJ银行大楼后面的小巷里，以白色门帘为标志的小店。隔着窗户可以看到在铜板上烤制的样子，店门口飘着刚出炉的香气。希望您参拜归来或需要伴手礼时顺道光临。',
    bullets: ['曾在朝日电视台「纯散步」中介绍', '定期供奉富冈八幡宫'],
    alts: ['挂着门帘的 Dorayama 总本铺外观', '店内摆满铜锣烧的货架', '礼盒与纸袋'],
  },
  access: {
    label: '店铺信息',
    lead: ['A one-minute walk from Monzen-nakacho Station,', 'open every day from 10:00 until sold out.'],
    body: '每天10点至16点营业，全年无休。每天早上烤制的数量售完即止，如想确保购买，建议提前预约。可在 Take Eats（日文）预约次日以后取货的商品，5个起，最远可预约30天后（取货时间10:30〜15:45）。可在线支付或在店内付款；店内可使用信用卡和交通IC卡。',
    rows: { name: '店名', address: '地址', access: '交通', hours: '营业时间', closed: '定休日', payment: '支付方式', contact: '联系方式' },
    values: { name: '门仲铜锣烧 Dorayama（どら山）总本铺', access: '东京地铁东西线「门前仲町站」步行1分钟', hours: '10:00〜16:00（售完即止）', closed: '全年无休', payment: '信用卡・交通IC卡' },
    reserve: '预约（次日以后・5个起）',
    map: '在 Google 地图中打开・查看路线',
  },
  footer: { nav: '页脚导航', rights: '© DORAYAMA All Rights Reserved.' },
}

const ko: Dict = {
  meta: {
    title: '몬나카 도라야키 Dorayama(どら山) 총본포 | 도쿄 몬젠나카초의 도라야키 전문점',
    description:
      '도쿄 몬젠나카초, 후카가와 부동당과 도미오카 하치만구 참배길에 있는 도라야키 전문점. 매일 아침 가게 앞 구리판에서 한 장씩 손으로 굽는 폭신한 반죽과 소금을 살짝 넣은 팥소. 몬젠나카초역에서 도보 1분, 연중무휴.',
    newsTitle: '소식 | 몬나카 도라야키 Dorayama',
    newsDescription: 'Dorayama의 소식: 매월 바뀌는 계절 도라야키, 팝업 출점, 미디어 소개 등.',
  },
  nav: { intro: '홈', news: '소식', media: '미디어', concept: '고집', products: '메뉴', store: '총본포', access: '매장 정보' },
  header: {
    top: '몬나카 도라야키 Dorayama 홈으로',
    open: '메뉴 열기',
    close: '메뉴 닫기',
    reserve: '예약',
    reserveLong: '예약(Take Eats・일본어)',
    newTab: '(새 탭에서 열림)',
    walk: '몬젠나카초역 도보 1분',
    hours: '10:00〜16:00(품절 시 종료)・연중무휴',
    language: '언어 선택',
  },
  intro: {
    h1: '몬나카 도라야키 Dorayama(どら山) 총본포',
    video: '가게 앞 풍경과 구리판에서 도라야키를 굽는 모습',
    copy: [
      '후카가와 부동당과 도미오카 하치만구의 참배길,',
      '몬젠나카초의 골목에 Dorayama가 있습니다.',
      '매일 아침, 가게의 구리판에서 한 장씩.',
      '달걀흰자를 거품 낸, 이불처럼 폭신한 반죽에',
      '도카치산 팥을 끓인, 소금을 살짝 넣은 팥소.',
      '도미오카 하치만구에 봉납하는, 길한 몬나카 도라야키.',
      '또 먹고 싶어지는, 매일 먹고 싶어지는.',
    ],
  },
  news: {
    label: '소식',
    lead: ['Seasonal dorayaki of the month,', 'media coverage and other news from the shop.'],
    all: '전체 소식',
    pageLead: ['Seasonal dorayaki of the month, media coverage', 'and other news from DORAYAMA in Monzen-nakacho.'],
    back: '전체 소식',
    filterAll: '전체',
    categories: { 旬どら: '이달의 도라야키', 新商品: '신상품', '催事・出店': '팝업・출점', メディア: '미디어', 店舗のお知らせ: '매장 소식', 開店までの歩み: '오픈까지의 이야기', その他: '기타' },
    original: '전체 내용은 일본어로 되어 있습니다.',
    viewOnInstagram: 'Instagram에서 보기',
  },
  media: {
    label: '미디어',
    lead: ['Featured on television, in magazines', 'and on the web.'],
    intro: 'Dorayama는 TV, 잡지, 웹 미디어에 소개되었습니다.',
    more: '자세히 보기',
    kinds: { テレビ: 'TV', 雑誌: '잡지', 書籍: '서적', 新聞: '신문', ウェブ: '웹', ラジオ: '라디오', その他: '기타' },
  },
  signature: {
    heading: '몬나카 도라야키',
    details: '(상품 상세)',
    items: [
      { name: '이불 반죽', alt: '구리 냄비 옆에서 구리판에 반죽을 붓는 손', copy: ['달걀흰자를 거품 낸 머랭에', '달걀・밀가루・설탕을 더한', 'Dorayama만의 황금비율 반죽.', '매일 아침 구리 냄비에서 준비해', '하나씩 구리판에 붓습니다.'] },
      { name: '구리판 수제 굽기', alt: '구리판 위에서 노릇하게 구워진 반죽', copy: ['열을 고르게 전하는 구리판에서', '한 장씩 손으로 굽습니다.', '구운 색과 익힘을 살피며', '이불처럼 폭신한', '반죽으로 완성합니다.'] },
      { name: '흑도라', alt: '단면이 보이는 팥소 흑도라', copy: ['갓 구운 반죽 사이에 넣는 것은', '홋카이도 도카치산 팥을', '달지 않게 끓인 통팥소.', '소금으로 맛을 살린', 'Dorayama의 대표 메뉴입니다.'] },
    ],
  },
  concept: {
    label: '고집',
    lead: ['Each dorayaki is baked by hand on a copper griddle every morning,', 'and has long been offered to Tomioka Hachimangu Shrine.'],
    poem: ['도미오카 하치만구 봉납,', '매일 아침 구리판에서 한 장씩.', '또 먹고 싶어지는,', '매일 먹고 싶어지는.'],
    body: 'Dorayama는 후카가와 부동당과 도미오카 하치만구를 잇는 참배길 근처, 몬젠나카초에 있는 도라야키 전문점입니다. 도미오카 하치만구에 봉납하는 길한 「몬나카 도라야키」를 매일 아침 가게에서 굽고 있습니다. 폭신한 반죽과 소금으로 맛을 살린 팥소. 데우면 갓 구운 향이 되살아나, 일상의 간식으로도 선물로도 좋은 도라야키입니다.',
    listLabel: 'Dorayama의 고집',
    imageAlt: '어둑한 가게 안에 조용히 놓인 도라야키',
    items: [
      { title: '이불 반죽', body: '달걀흰자를 따로 거품 내어 고운 머랭으로 만든 뒤 반죽에 섞습니다. 공기를 듬뿍 머금어 스펀지케이크처럼 가볍고, 이불처럼 폭신한 반죽으로 구워집니다.' },
      { title: '구리판 수제 굽기', body: '반죽은 매일 아침 가게 앞 구리판에서 한 장씩 손으로 굽습니다. 열을 고르게 전하는 구리판에서 구운 색과 익힘을 살피며 뒤집습니다. 가게 앞에는 그날 갓 구운 향이 퍼집니다.' },
      { title: '새로운 삼동할', body: '달걀・밀가루・설탕을 같은 비율로 섞는 화과자의 전통 배합 「삼동할」. 이 기본을 토대로 수천 번의 시험을 거쳐 Dorayama만의 황금비율에 이르렀습니다.' },
      { title: '소금 통팥소', body: '홋카이도 도카치산 팥에 백쌍당을 더해 달지 않게 끓입니다. 소금으로 맛을 살리고 팥알의 식감을 남긴 것이 Dorayama의 팥소. 폭신한 반죽과의 대비를 즐길 수 있습니다.' },
      { title: '일본산 재료', body: '홋카이도 도카치산 팥, 순수 일본산 혼미림, 가가와현산 밀가루, 일본산 쌀겨유, 홋카이도산 사탕무 설탕. 매일 먹어도 질리지 않는 맛을 위해 일본산 재료를 고릅니다.' },
    ],
  },
  products: {
    label: '메뉴',
    lead: ['Skins baked fresh every morning,', 'with classic and seasonal fillings.'],
    intro: '매일 아침 굽는 반죽에 기본 팥소와 흰앙금, 계절의 맛을 넣습니다. 매장에서는 그날 구운 도라야키를 판매하며, 다음 날 이후 수령분(5개부터)은 Take Eats에서 예약을 받습니다.',
    taxNote: '가격은 모두 세금 포함입니다.',
    reserve: '예약',
    reserveAria: (name) => `${name} 예약(새 탭에서 열림)`,
    priceAria: (price) => `세금 포함 ${price}엔`,
    yen: '엔',
    items: [
      { name: '흑도라(통팥)', description: 'Dorayama의 대표 메뉴. 홋카이도 도카치산 팥을 달지 않게 끓이고 소금으로 맛을 살린 팥소를 폭신한 반죽에 듬뿍 넣었습니다.', alt: '흑도라(통팥)' },
      { name: '백도라(흰앙금)', description: '흰강낭콩 앙금을 넣은 부드러운 단맛의 도라야키. 팥소와는 또 다른 매끄러운 식감을 즐길 수 있습니다.', alt: '백도라(흰앙금)' },
      { name: '앙버터 도라', description: '소금 팥소에 도카치산 생우유로 만든 버터를 더했습니다. 팥의 단맛과 버터의 풍미가 어우러지는 만족스러운 한 품.', alt: '팥소와 버터를 넣은 앙버터 도라' },
      { name: '진짜 말차 도라', description: '말차를 듬뿍 사용한 선명한 녹색의 도라야키. 말차를 좋아하는 분께 추천하는 향긋한 한 품.', alt: '말차색 반죽의 진짜 말차 도라' },
      { name: '생도라(크림)', description: '계절 과일과 크림을 폭신한 반죽으로 감쌌습니다. 속재료는 계절에 따라 바뀝니다.', alt: '바나나와 크림을 넣은 생도라' },
      { name: '이달의 도라야키', description: '매달 바뀌는 계절 도라야키. 10월은 「환상의 밤 마롱 단호박 도라야키」입니다. 매달의 맛은 소식과 Instagram에서 안내합니다.', alt: '10월의 밤 마롱 단호박 도라야키' },
      { name: '반죽만(4장)', description: '폭신한 반죽만 4장 담은 Dorayama만의 세트. 팥소를 좋아하지 않는 분도 원하는 토핑으로 나만의 도라야키를 즐길 수 있습니다.', alt: '도라야키 반죽 4장 세트' },
      { name: '선물・기프트', description: '하나씩 개별 포장해 상자와 종이봉투에 담아 드립니다. 개별 포장이라 직장이나 모임에서 나누기에도 편리합니다. 인사 선물로도 좋습니다.', alt: '개별 포장된 도라야키와 선물 상자, 종이봉투' },
    ],
  },
  store: {
    label: '총본포',
    lead: ['On the approach to Fukagawa Fudodo and Tomioka Hachimangu,', 'the batter is baked fresh in the shop every morning.'],
    catchCopy: ['참배길의', '갓 구운 맛'],
    lines: ['후카가와 부동당과 도미오카 하치만구의 참배길.', '매일 아침 가게에서 반죽을 굽습니다.'],
    body: '2022년 6월 몬젠나카초에 문을 연 총본포. 도쿄메트로 도자이선 「몬젠나카초역」에서 도보 1분, 미쓰비시UFJ은행 빌딩 뒤편 골목에 흰 노렌이 눈에 띄는 작은 가게입니다. 창 너머로 구리판에서 굽는 모습이 보이고, 가게 앞에는 갓 구운 향이 납니다. 참배 후에, 또는 작은 선물이 필요할 때 들러 주시면 좋겠습니다.',
    bullets: ['TV 아사히 「준산포」에서 소개', '도미오카 하치만구에 정기 봉납'],
    alts: ['노렌이 걸린 Dorayama 총본포 외관', '도라야키가 진열된 매장 선반', '선물용 상자와 종이봉투'],
  },
  access: {
    label: '매장 정보',
    lead: ['A one-minute walk from Monzen-nakacho Station,', 'open every day from 10:00 until sold out.'],
    body: '매일 10시부터 16시까지 연중무휴로 영업합니다. 매일 아침 구운 분량이 다 팔리면 종료하므로, 확실히 구매하시려면 예약을 권해 드립니다. 예약은 Take Eats(일본어)에서 다음 날 이후 수령분을 5개부터, 30일 후까지 받습니다(수령 10:30〜15:45). 온라인 결제 또는 매장 결제가 가능하며, 매장에서는 신용카드와 교통계 IC카드를 이용하실 수 있습니다.',
    rows: { name: '상호', address: '주소', access: '교통', hours: '영업시간', closed: '정기휴일', payment: '결제', contact: '문의' },
    values: { name: '몬나카 도라야키 Dorayama(どら山) 총본포', access: '도쿄메트로 도자이선 「몬젠나카초역」 도보 1분', hours: '10:00〜16:00(품절 시 종료)', closed: '연중무휴', payment: '신용카드・교통계 IC카드' },
    reserve: '예약(다음 날 이후・5개부터)',
    map: 'Google 지도에서 열기・경로 검색',
  },
  footer: { nav: '푸터 내비게이션', rights: '© DORAYAMA All Rights Reserved.' },
}

export const DICT: Record<Lang, Dict> = { ja, en, zh, ko }
