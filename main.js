// const API_KEY = 'a7c947ae7ecb44d6baf7c8b20bcd20e8';
let mql = window.matchMedia('screen and (max-width: 768px)');
let newsList = [];
const getLatestNews = async () => {
  const url = new URL(
    `https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines`
  );
  const response = await fetch(url);
  const data = await response.json(); // json은 파일 형식중 하나
  newsList = data.articles;
  console.log(newsList);
  render();
};

const openNav = () => {
  document.getElementById('mySidenav').style.width = '250px';
  // document.getElementById('main').style.marginLeft = '250px';
  document.body.style.backgroundColor = 'rgba(0,0,0,0.4)';
};

const closeNav = () => {
  document.getElementById('mySidenav').style.width = '0';
  // document.getElementById('main').style.marginLeft = '0';
  document.body.style.backgroundColor = 'white';
};

const openSearchBox = () => {
  let inputArea = document.getElementById('input-area');
  console.log(inputArea.style.display);
  if (inputArea.style.display === 'inline') {
    inputArea.style.display = 'none';
  } else {
    inputArea.style.display = 'inline';
  }
};

const render = () => {
  const filter = newsList.map((news) => {
    // console.log(typeof news.description);
    console.log(news.urlToImage.onerror);
    if (typeof news.description === 'object') {
      news.description = `내용없음`;
    }
    if (news.description.length >= 200) {
      news.description = `${news.description.slice(0, 200)}...`;
    }
    console.log(news.source.name);
    if (news.source.name === null) {
      news.source.name = `no source`;
    }
    if (news.urlToImage === null) {
      news.urlToImage =
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqEWgS0uxxEYJ0PsOb2OgwyWvC0Gjp8NUdPw&usqp=CAU';
    }
  });

  const newsHTML = newsList
    .map(
      (news) => `<div class="row news">
  <div class="col-lg-4">
    <img
      class="news-img-size"
      src=${news.urlToImage} 
      onerror="this.onerror=null; this.src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqEWgS0uxxEYJ0PsOb2OgwyWvC0Gjp8NUdPw&usqp=CAU';"
    />
  </div>
  <div class="col-lg-8">
    <h2>${news.title}</h2>
    <p>${news.description}</p>
    <div>${news.source.name} ${moment(news.publishedAt).fromNow()}</div>
  </div>
</div>`
    )
    .join('');

  document.getElementById('newsBoard').innerHTML = newsHTML;
};
//기존 반복문 사용해서 렌더링
// const render = () => {
//   let newsHTML = '';
//   for (let i = 0; i < newsList.length; i++) {
//     console.log(newsList[i]);
//     newsHTML += `<div class="row news">
//         <div class="col-lg-4">
//           <img
//             class="news-img-size"
//             src=${newsList[i].urlToImage}
//             alt="제니"
//           />
//         </div>
//         <div class="col-lg-8">
//           <h2>${newsList[i].title}</h2>
//           <p>${newsList[i].description}</p>
//           <div>${newsList[i].author}</div>
//         </div>
//       </div>`;
//   }

//   document.getElementById('newsBoard').innerHTML = newsHTML;
// };

getLatestNews();
