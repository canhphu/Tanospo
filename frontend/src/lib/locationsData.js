export const locations = [
  { 
    id: 1,
    name: "トンニャット公園",
    distance: "500m",
    address: "ハノイ市ドンダー区トンニャット通り",
    description: "美しい公園で、ジョギングや散歩に最適です。朝夕の時間帯は多くの地元住民で賑わっています。",
    facilities: ["ジョギングコース", "子供用遊具", "ベンチ", "トイレ"],
    sportIds: [1, 5], // ウォーキング, ヨガ
    openTime: "5:00 - 22:00",
    rating: 4.5,
    lat: 21.0142709,
    lng: 105.8439724,
    image: "https://picsum.photos/seed/park1/400/300.jpg"
  },
  { 
    id: 2,
    name: "ミンカイ通り368番地",
    distance: "1.0km",
    address: "ハノイ市ホアンキエム区ミンカイ通り368",
    description: "市街地中心部に位置するスポーツ施設。最新の設備が整っており、様々なスポーツを楽しめます。",
    facilities: ["サッカー場", "バスケットボールコート", "シャワー", "駐車場"],
    sportIds: [2], // フットボール
    openTime: "6:00 - 23:00",
    rating: 4.8,
    lat: 20.9963911,
    lng: 105.8607845,
    image: "https://picsum.photos/seed/sports1/400/300.jpg"
  },
  { 
    id: 3,
    name: "ハノイ工科大学",
    distance: "1.6km",
    address: "ハノイ市ロンビエン区ハノイ工科大学",
    description: "大学のキャンパス内にある広大なグラウンド。学生だけでなく、地域住民も利用できます。",
    facilities: ["サッカー場", "陸上トラック", "ウェイトルーム", "更衣室"],
    sportIds: [2, 6], // フットボール, 筋トレ
    openTime: "平日 16:00 - 20:00, 土日 8:00 - 18:00",
    rating: 4.3,
    lat: 21.0066,
    lng: 105.8432,
    image: "https://picsum.photos/seed/university1/400/300.jpg"
  },
  { 
    id: 4,
    name: "タン・ニャ文化会館",
    distance: "2.1km",
    address: "ハノイ市ドンバ区タン・ニャ通り",
    description: "多目的文化施設で、スポーツイベントや文化活動が開催されています。",
    facilities: ["多目的グラウンド", "屋内体育館", "会議室", "カフェテリア"],
    sportIds: [3], // バドミントン
    openTime: "8:00 - 22:00",
    rating: 4.6,
    lat: 21.045661,
    lng: 105.8368037,
    image: "https://picsum.photos/seed/cultural1/400/300.jpg"
  },
  {
    id: 5,
    name: "サイクリングロード",
    distance: "3.0km",
    address: "ハノイ市タイホー区レドゥックト通り",
    description: "川沿いの美しいサイクリングロード。レンタサイクルも利用可能です。",
    facilities: ["レンタサイクル", "休憩所", "給水所"],
    sportIds: [4, 1], // サイクリング, ウォーキング
    openTime: "24時間",
    rating: 4.7,
    lat: 21.0301,
    lng: 105.8485,
    image: "https://picsum.photos/seed/cycling1/400/300.jpg"
  },
  {
    id: 6,
    name: "市民プール",
    distance: "2.5km",
    address: "ハノイ市バーディン区チャンフー通り",
    description: "屋内プール施設。初心者から上級者まで楽しめます。",
    facilities: ["25mプール", "キッズプール", "シャワー", "ロッカー"],
    sportIds: [6], // 筋トレ
    openTime: "6:00 - 21:00",
    rating: 4.4,
    lat: 21.0256,
    lng: 105.8412,
    image: "https://picsum.photos/seed/pool1/400/300.jpg"
  },
{ 
    id: 7,
    name: "レストラン・スポーツバー「ゴールデンゴール」",
    distance: "1.2km",
    address: "ハノイ市ホアンキエム区ハングバイ通り45",
    description: "サッカーテーマのスポーツバー。大きなスクリーンで試合を観戦しながら食事が楽しめます。",
    facilities: ["大型スクリーン", "フードメニュー", "ドリンクバー", "Wi-Fi"],
    sportIds: [2], // フットボール
    openTime: "11:00 - 23:00",
    rating: 4.5,
    lat: 21.0185,
    lng: 105.8502,
    image: "https://picsum.photos/seed/sportsbar1/400/300.jpg"
  },
  {
    id: 8,
    name: "中央公園ジョギングコース",
    distance: "2.3km",
    address: "ハノイ市バーディン区グエンチー通り",
    description: "木々に囲まれた静かなジョギングコース。1周約1kmの整備されたコースです。",
    facilities: ["ウォータークーラー", "休憩所", "距離表示", "トイレ"],
    sportIds: [1], // ウォーキング
    openTime: "5:00 - 22:00",
    rating: 4.6,
    lat: 21.0356,
    lng: 105.8154,
    image: "https://picsum.photos/seed/jogging1/400/300.jpg"
  },
  {
    id: 9,
    name: "リバーサイド・サイクリングロード",
    distance: "3.5km",
    address: "ハノイ市ロンビエン区ズアンディン通り",
    description: "紅河沿いの美しいサイクリングロード。レンタサイクルも利用可能です。",
    facilities: ["レンタサイクル", "休憩所", "給水所", "駐輪場"],
    sportIds: [4, 1], // サイクリング, ウォーキング
    openTime: "5:00 - 22:00",
    rating: 4.8,
    lat: 21.0423,
    lng: 105.8578,
    image: "https://picsum.photos/seed/riverside1/400/300.jpg"
  },
  {
    id: 10,
    name: "サンシャイン・スポーツコンプレックス",
    distance: "4.1km",
    address: "ハノイ市カウザイ区トーティエット通り",
    description: "最新設備を備えた総合スポーツ施設。屋内・屋外の様々なスポーツが楽しめます。",
    facilities: ["プール", "ジム", "サウナ", "カフェ"],
    sportIds: [2, 3, 6], // フットボール, バドミントン, 筋トレ
    openTime: "6:00 - 23:00",
    rating: 4.7,
    lat: 21.0289,
    lng: 105.7987,
    image: "https://picsum.photos/seed/complex1/400/300.jpg"
  },
  {
    id: 11,
    name: "グリーンフィールド・テニスコート",
    distance: "3.8km",
    address: "ハノイ市タイホー区クアンホア通り",
    description: "自然に囲まれたオープンテニスコート。レッスンも受け付けています。",
    facilities: ["コート4面", "レンタルラケット", "更衣室", "駐車場"],
    sportIds: [3], // テニス
    openTime: "7:00 - 22:00",
    rating: 4.4,
    lat: 21.0456,
    lng: 105.8123,
    image: "https://picsum.photos/seed/tennis1/400/300.jpg"
  },
  {
    id: 12,
    name: "スカイビュー・ヨガスタジオ",
    distance: "1.9km",
    address: "ハノイ市ホアンキエム区ハングバックビル25階",
    description: "市内を一望できる高層ビルのヨガスタジオ。初心者から上級者まで対応。",
    facilities: ["マットレンタル", "ロッカー", "シャワー", "カフェ"],
    sportIds: [5], // ヨガ
    openTime: "6:00 - 22:00",
    rating: 4.9,
    lat: 21.0223,
    lng: 105.8521,
    image: "https://picsum.photos/seed/yoga1/400/300.jpg"
  },
  {
    id: 13,
    name: "フィットネス・ファクトリー24",
    distance: "2.7km",
    address: "ハノイ市ドンダー区チャンクアンカイ通り",
    description: "24時間利用可能なフィットネスジム。最新のトレーニングマシンが揃っています。",
    facilities: ["マシンジム", "フリーウェイト", "プロテインバー", "シャワー"],
    sportIds: [6], // 筋トレ
    openTime: "24時間",
    rating: 4.6,
    lat: 21.0156,
    lng: 105.8378,
    image: "https://picsum.photos/seed/gym1/400/300.jpg"
  },
  {
    id: 14,
    name: "シティ・スケートパーク",
    distance: "3.2km",
    address: "ハノイ市ハイバーチュン区ライタイト通り",
    description: "スケートボーダーやBMXライダーのための本格的なスケートパーク。",
    facilities: ["スケートパーク", "レンタルショップ", "カフェ", "観覧席"],
    sportIds: [2], // スケートボード
    openTime: "8:00 - 21:00",
    rating: 4.5,
    lat: 21.0089,
    lng: 105.8476,
    image: "https://picsum.photos/seed/skate1/400/300.jpg"
  },
  {
    id: 15,
    name: "ウエストサイド・テニスコート",
    distance: "4.5km",
    address: "ハノイ市カウザイ区タインザン通り",
    description: "ウエストサイドエリアにある人気のテニスコート。夜間照明完備。",
    facilities: ["コート6面", "ナイター照明", "レッスン", "駐車場"],
    sportIds: [5], // テニス
    openTime: "6:00 - 23:00",
    rating: 4.3,
    lat: 21.0387,
    lng: 105.7823,
    image: "https://picsum.photos/seed/tennis2/400/300.jpg"
  },
  {
    id: 16,
    name: "マリーナ・ビーチバレーコート",
    distance: "5.0km",
    address: "ハノイ市ロンビエン区ヴィンテックスマリーナ",
    description: "人工ビーチに面したビーチバレーコート。海を感じながらプレイできます。",
    facilities: ["ビーチコート3面", "シャワー", "ロッカー", "カフェ"],
    sportIds: [5], // ビーチバレー
    openTime: "7:00 - 21:00",
    rating: 4.7,
    lat: 21.0523,
    lng: 105.8678,
    image: "https://picsum.photos/seed/beach1/400/300.jpg"
  }
];