// Sample posts data for the Dashboard
export const posts = [
  {
    id: 'post1',
    author: {
      name: 'Dung',
      avatar: 'https://picsum.photos/seed/avatar123/36/48.jpg',
      location: 'トンニャット公園にて'
    },
    content: 'ここでジョギングするのは最高です。みんなジョギングに来ます！',
    image: {
      src: 'https://picsum.photos/seed/park123/400/300.jpg',
      alt: 'park'
    },
    timestamp: '2024-12-08T10:30:00',
    likes: 0,
    comments: []
  },
  {
    id: 'post2',
    author: {
      name: 'Bao',
      avatar: 'https://picsum.photos/seed/avatar123/36/48.jpg',
      location: '自宅で'
    },
    content: 'こんな雨の日に最適いて運動するの一番です。',
    image: {
      src: 'https://picsum.photos/seed/workout123/400/300.jpg',
      alt: 'workout'
    },
    timestamp: '2024-12-08T09:15:00',
    likes: 0,
    comments: []
  },
  {
    id: 'post3',
    author: {
      name: 'Akira',
      avatar: 'https://picsum.photos/seed/avatar456/36/48.jpg',
      location: 'ジムにて'
    },
    content: '今日のトレーニングはハードだったけど、とても充実感があります！筋トレ最高！',
    image: {
      src: 'https://picsum.photos/seed/gym123/400/300.jpg',
      alt: 'gym'
    },
    timestamp: '2024-12-08T14:20:00',
    likes: 0,
    comments: []
  }
];

// Get all posts
export const getAllPosts = () => {
  return posts;
};

// Get post by ID
export const getPostById = (postId) => {
  return posts.find(post => post.id === postId);
};

// Add comment to post
export const addCommentToPost = (postId, comment) => {
  const post = getPostById(postId);
  if (post) {
    post.comments.push({
      id: Date.now(),
      ...comment,
      timestamp: new Date().toISOString()
    });
    return post;
  }
  return null;
};

// Get comments for post
export const getCommentsByPostId = (postId) => {
  const post = getPostById(postId);
  return post ? post.comments : [];
};

// Toggle like on post
export const togglePostLike = (postId) => {
  const post = getPostById(postId);
  if (post) {
    post.likes += 1;
    return post;
  }
  return null;
};
