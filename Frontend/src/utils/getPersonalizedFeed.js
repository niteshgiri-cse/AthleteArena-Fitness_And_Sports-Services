export const getPersonalizedFeed = (feedData, interests) => {
  return feedData.filter((item) =>
    interests.includes(item.category)
  );
};
