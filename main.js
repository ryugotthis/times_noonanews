// const API_KEY = 'a7c947ae7ecb44d6baf7c8b20bcd20e8';
let news = [];
const getLatestNews = async () => {
  const url = new URL(
    `https://yougotthis-noonanews.netlify.app/top-headlines?q=아이유`
  );
  const response = await fetch(url);
  const data = await response.json(); // json은 파일 형식중 하나
  news = data.articles;
  console.log(news);
};
getLatestNews();
// http://times-node-env.eba-appvq3ef.ap-northeast-2.elasticbeanstalk.com/
