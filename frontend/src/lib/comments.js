export const comments = [
  {
    id: 1,
    locationId: 1,
    author: "Nguyen Van A",
    content: "Cửa hàng rất tốt, nhân viên thân thiện!",
    rating: 5,
    date: "2024-01-15"
  },
  {
    id: 2,
    locationId: 1,
    author: "Tran Thi B",
    content: "Giá cả hợp lý, sản phẩm chất lượng.",
    rating: 4,
    date: "2024-01-10"
  },
  {
    id: 3,
    locationId: 2,
    author: "Le Van C",
    content: "Dịch vụ nhanh chóng, chuyên nghiệp.",
    rating: 5,
    date: "2024-01-12"
  },
  {
    id: 4,
    locationId: 2,
    author: "Pham Thi D",
    content: "Sản phẩm đa dạng, giá cả cạnh tranh.",
    rating: 4,
    date: "2024-01-08"
  }
];

export const getCommentsByLocationId = (locationId) => {
  return comments.filter(comment => comment.locationId === parseInt(locationId));
};

export const addComment = (comment) => {
  const newComment = {
    id: comments.length + 1,
    ...comment,
    date: new Date().toISOString().split('T')[0]
  };
  comments.unshift(newComment);
  return newComment;
};
