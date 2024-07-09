// const API_KEY = 'a7c947ae7ecb44d6baf7c8b20bcd20e8';
let news = [];
const getLatestNews = async () => {
  const url = new URL(`https://yougotthis-noonanews.netlify.app/top-headlines`);
  const response = await fetch(url);
  const data = await response.json(); // json은 파일 형식중 하나
  news = data.articles;
  console.log(`new: ${news}`);
};
getLatestNews();
