export const videoData = {
  5: [ // Yoga
    {
      id: 1,
      title: "初心者向けヨガ - 15分",
      description: "ヨガを始めたばかりの方に最適な基本ポーズ集",
      duration: "15分",
      thumbnail: "https://i.ytimg.com/vi/v7AYKMP6rOE/hqdefault.jpg",
      youtubeUrl: "https://www.youtube.com/watch?v=oBu-pQG6sTY"
    },
    {
      id: 2,
      title: "朝のヨガルーティン",
      description: "一日を元気に始めるための簡単なヨガ",
      duration: "10分",
      thumbnail: "https://i.ytimg.com/vi/oBu-pQG6sTY/hqdefault.jpg",
      youtubeUrl: "https://www.youtube.com/watch?v=cxqlmRvjjpI"
    },
    {
      id: 3,
      title: "リラックスヨガ",
      description: "ストレス解消に効果的なゆったりとしたヨガ",
      duration: "20分",
      thumbnail: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b",
      youtubeUrl: "https://www.youtube.com/watch?v=pH1Id5262wQ"
    }
  ],
  6: [ // Gym
    {
  id: 1,
  title: "自宅でできる筋トレ - 上半身",
  description: "胸、背中、腕の筋トレメニュー",
  duration: "15分",
  thumbnail: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b",
  youtubeUrl: "https://www.youtube.com/watch?v=RALLbdunkCQ"
},
{
  id: 2,
  title: "腹筋トレーニング",
  description: "引き締まった腹筋を手に入れるためのトレーニング",
  duration: "10分",
  thumbnail: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80",
  youtubeUrl: "https://www.youtube.com/watch?v=b-TFz42PRsk"
},
{
  id: 3,
  title: "足と腰の筋トレ",
  description: "走る、ジャンプするための足と腰の筋トレ",
  duration: "20分",
  thumbnail: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438",
  youtubeUrl: "https://www.youtube.com/watch?v=NJD97iJPhFM"
}
]
}

export const getVideos = (sportId) => {
  return videoData[sportId] || [];
};
