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
let totalResults = 0;
let page = 1;
const pageSize = 10;
const groupSize = 5;
const getNews = async () => {
  // 데이터 받아서 랜더링하는 공통부분
  try {
    url.searchParams.set('page', page); //url함수 속성, 쿼리만들어줌 &page=page
    url.searchParams.set('pageSize', pageSize);

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch');
    }
    const data = await response.json(); // json은 파일 형식중 하나

    if (response.status === 200) {
      if (data.articles.length < 1) {
        throw new Error('No matches for your search');
      }
      //     throw new Error();
      newsList = data.articles;
      totalResults = data.totalResults;
      console.log(totalResults);
      render();
      paginationRender();
    } else {
      // throw new Error(data.message);
      console.log('rrr', response.status);
      throw new Error(data.message || 'Failed to fetch data');
    }
  } catch (error) {
    if (error instanceof TypeError) {
      errorRender('Network error: Failed to fetch data');
    } else {
      errorRender(error.message);
    }
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
};

const errorRender = (error) =>
  (document.getElementById(
    'newsBoard'
  ).innerHTML = `<div class="error-box">${error}</div>`);

const paginationRender = () => {
  //페이지
  // totalREsult, page, pageSize, groupSize, totalPages, lastPage, firstPage
  const pageGroup = Math.ceil(page / groupSize);
  const totalPages = Math.ceil(totalResults / pageSize);
  let lastPage = pageGroup * groupSize;
  if (lastPage > totalPages) {
    lastPage = totalPages;
  }
  const firstPage =
    lastPage - groupSize + 1 <= 0 ? 1 : lastPage - groupSize + 1;

  let paginationHTML =
    page - 1 < 1
      ? ''
      : `<li class="page-item" onclick="moveToPage(1)">
                        <a class="page-link">&lt;&lt;</a>
                      </li>
                      <li class="page-item" onclick="moveToPage(${page - 1})">
                        <a class="page-link" >&lt;</a>
                      </li>`;

  for (let i = firstPage; i <= lastPage; i++) {
    paginationHTML += `<li class="page-item ${
      i === page ? 'active' : ''
    }" onclick="moveToPage(${i})"><a class="page-link" >${i}</a></li>`;
  }

  paginationHTML +=
    page >= totalPages
      ? ''
      : `<li class="page-item" onclick="moveToPage(${
          page + 1
        })"><a  class="page-link">&gt;</a></li><li class="page-item" onclick="moveToPage(${totalPages})">
                        <a class="page-link" >&gt;&gt;</a>
                       </li>`;
  document.querySelector('.pagination').innerHTML = paginationHTML;
};
const moveToPage = (pageNum) => {
  console.log(pageNum);
  page = pageNum;
  getNews();
};
getLatestNews();
