// const API_KEY = 'a7c947ae7ecb44d6baf7c8b20bcd20e8';
let mql = window.matchMedia('screen and (max-width: 768px)');
let newsList = [];
const menus = document.querySelectorAll('.menus button');
menus.forEach((menu) =>
  menu.addEventListener('click', (event) => getNewsByCategory(event))
);

const sideMenus = document.querySelectorAll('.side-menu-list button');
sideMenus.forEach((menu) =>
  menu.addEventListener('click', (event) => getNewsByCategory(event))
);
let url = new URL(
  `https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines`
);

const getNews = async () => {
  // 데이터 받아서 랜더링하는 공통부분
  try {
    const response = await fetch(url);
    console.log('111', response);
    const data = await response.json(); // json은 파일 형식중 하나
    console.log('222', data);

    if (response.status === 200) {
      newsList = data.articles;
      render();
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    errorRender(error);
  }
};
const getLatestNews = async () => {
  // 처음 보이는 화면
  url = new URL(
    `https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines`
  );
  await getNews();
};
const getNewsByCategory = async (event) => {
  // 카테고리 클릭하면 보이는 화면
  const category = event.target.textContent.toLowerCase();
  url = new URL(
    `https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?category=${category}`
  );
  await getNews();
};

const getNewsByKeyword = async () => {
  // 키워드 검색하면 보이는 화면
  const keyword = document.getElementById('search-input').value;
  url = new URL(
    `https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?q=${keyword}`
  );
  await getNews();
  document.getElementById('search-input').value = '';
};
const enter = async (e) => {
  // 키워드 검색시 엔터 누르면 go버튼 누르는 것과 같게 동작
  if (e.code === 'Enter') {
    await getNewsByKeyword();
  }
};
const openNav = () => {
  // 사이드바 보일 때
  document.getElementById('mySidenav').style.width = '250px';
  // document.getElementById('main').style.marginLeft = '250px';
  document.body.style.backgroundColor = 'rgba(0,0,0,0.4)';
};

const closeNav = () => {
  // 사이드바 닫힐 때
  document.getElementById('mySidenav').style.width = '0';
  // document.getElementById('main').style.marginLeft = '0';
  document.body.style.backgroundColor = 'white';
};

const openSearchBox = () => {
  // 돋보기 버튼 누를때 입력창 활성화 비활성화 동작
  let inputArea = document.getElementById('input-area');
  // console.log(inputArea.style.display);
  if (inputArea.style.display === 'inline') {
    inputArea.style.display = 'none';
  } else {
    inputArea.style.display = 'inline';
  }
};

const render = () => {
  // 화면 랜더링
  // console.log('rrr', newsList.length);

  const newsHTML = newsList
    .map(
      (news) => `<div class="row news">
    <div class="col-lg-4">
      <img
        class="news-img-size"
        src=${
          news.urlToImage ||
          'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqEWgS0uxxEYJ0PsOb2OgwyWvC0Gjp8NUdPw&usqp=CAU'
        }
        onerror="this.onerror=null; this.src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqEWgS0uxxEYJ0PsOb2OgwyWvC0Gjp8NUdPw&usqp=CAU';"
      />
    </div>
    <div class="col-lg-8">
      <h2>${news.title}</h2>
      <p>${
        news.description == null || news.description == ''
          ? '내용없음'
          : news.description.length > 200
          ? news.description.slice(0, 200) + '...'
          : news.description
      }</p>
      <div>${news.source.name || 'no source'} ${moment(
        news.publishedAt
      ).fromNow()}</div>
    </div>
  </div>`
    )
    .join('');

  // console.log(newsHTML);

  document.getElementById('newsBoard').innerHTML = newsHTML;

  try {
    if (newsList < 1) {
      throw new Error();
    }
  } catch (error) {
    const errorMessage = 'No matches for your search';
    errorRender(errorMessage);
  }
};

const errorRender = (error) =>
  (document.getElementById(
    'newsBoard'
  ).innerHTML = `<div class="error-box">${error}</div>`);

getLatestNews();
