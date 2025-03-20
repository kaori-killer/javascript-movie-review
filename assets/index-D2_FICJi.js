var __typeError = (msg) => {
  throw TypeError(msg);
};
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
var __privateWrapper = (obj, member, setter, getter) => ({
  set _(value) {
    __privateSet(obj, member, value, setter);
  },
  get _() {
    return __privateGet(obj, member, getter);
  }
});
var _movieList, _page;
(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity) fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
    else fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
async function fetchPopularMovies(page2) {
  const popularMovieUrl = `https://api.themoviedb.org/3/movie/popular?language=ko-KR&page=${page2}`;
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${"eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxYWMyODc3Y2Q4M2IwZDQ5MGRiODRhMDI5ZDBmNmMxMSIsIm5iZiI6MTc0MjI2NTAzMy4yOTksInN1YiI6IjY3ZDhkYWM5YzUzMzllYWJjNjM2NGQzYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.4zRY7Zc8S7gb3XdoyaKNQcaLuV37Z25Niw5aSHFg5sc"}`
    }
  };
  const response = await fetch(popularMovieUrl, options);
  const { results, totalPages } = await response.json();
  return { results, totalPages };
}
const createElement = ({
  tag,
  classNames = [],
  ...attributes
}) => {
  const $element = document.createElement(tag);
  classNames.forEach((className) => $element.classList.add(className));
  Object.entries(attributes).forEach(([key, value]) => {
    if (key === "required" && $element instanceof HTMLInputElement) {
      $element.required = Boolean(value);
    } else {
      $element.setAttribute(key, value);
    }
  });
  return $element;
};
const STAR_IMG_SRC = "./images/star_empty.png";
const MoviePreviewInfo = ({ movie, bigFont = true }) => {
  const title = movie.title;
  const voteAverage = movie.vote_average;
  const $fragment2 = document.createDocumentFragment();
  const $rate = createElement({ tag: "div", classNames: ["rate"] });
  const $starImg = createElement({
    tag: "img",
    classNames: ["star"],
    src: STAR_IMG_SRC
  });
  const $rateValue = createElement({
    tag: "span"
  });
  const $title = createElement({
    tag: "div"
  });
  if (bigFont) {
    $rateValue.classList.add("rate-value");
    $title.classList.add("title");
  }
  $fragment2.append($rate);
  $rate.append($starImg);
  $rate.append($rateValue);
  $fragment2.append($title);
  $rateValue.textContent = voteAverage;
  $title.textContent = title;
  return $fragment2;
};
const imageUrl = (path, size = 400) => `https://image.tmdb.org/t/p/w${size}${path}`;
const MovieItem = ({ movie }) => {
  const title = movie.title;
  const posterPath = movie.poster_path;
  const $li = createElement({
    tag: "li"
  });
  const $div = createElement({
    tag: "div",
    classNames: ["item"]
  });
  const $img = createElement({
    tag: "img",
    classNames: ["thumbnail"],
    src: `${imageUrl(posterPath)}`,
    alt: `${title}`
  });
  $li.appendChild($div);
  $div.appendChild($img);
  $div.appendChild(MoviePreviewInfo({
    movie,
    bigFont: false
  }));
  return $li;
};
const SkeletonMovieItem = () => {
  const $div = createElement({
    tag: "div"
  });
  $div.innerHTML = `
                  <li>
                    <div class="item">
                      <div class="thumbnail skeleton"></div>
                      <div class="item-desc">
                        <p class="rate">
                          <div class="skeleton skeleton-star"></div>
                        <div class="skeleton skeleton-text-title"></div>
                      </div>
                    </div>
                  </li>
        `;
  return $div;
};
const NOTHING_IMG_SRC = "./images/으아아.png";
const NOTHING_TEXT = "검색 결과가 없습니다.";
const $fragment = document.createDocumentFragment();
const NothingMovieList = () => {
  const $p = createElement({
    tag: "p",
    classNames: ["nothing-text"]
  });
  const $img = createElement({
    tag: "img",
    src: NOTHING_IMG_SRC,
    alt: "으아아",
    classNames: ["nothing-img"]
  });
  $p.textContent = NOTHING_TEXT;
  $fragment.appendChild($p);
  $fragment.appendChild($img);
  return $fragment;
};
const MovieList = ({ movies: movies2 }) => {
  const $ul = createElement({
    tag: "ul",
    classNames: ["thumbnail-list"]
  });
  if (movies2.length === 0) {
    return NothingMovieList();
  }
  if (movies2 === "loading") {
    [1, 1, 1].forEach(() => {
      $ul.appendChild(SkeletonMovieItem());
    });
  } else {
    movies2.forEach((movie) => {
      $ul.appendChild(MovieItem({ movie }));
    });
  }
  return $ul;
};
async function fetchSearchMovies(query, page2) {
  const searchMovieUrl = `https://api.themoviedb.org/3/search/movie?query=${query}&include_adult=false&language=kr-KO&page=${page2}`;
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${"eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxYWMyODc3Y2Q4M2IwZDQ5MGRiODRhMDI5ZDBmNmMxMSIsIm5iZiI6MTc0MjI2NTAzMy4yOTksInN1YiI6IjY3ZDhkYWM5YzUzMzllYWJjNjM2NGQzYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.4zRY7Zc8S7gb3XdoyaKNQcaLuV37Z25Niw5aSHFg5sc"}`
    }
  };
  const response = await fetch(searchMovieUrl, options);
  const { results, total_pages } = await response.json();
  const totalPages = total_pages;
  return { results, totalPages };
}
class Movies {
  constructor() {
    __privateAdd(this, _movieList);
    __privateSet(this, _movieList, []);
  }
  get movieList() {
    return __privateGet(this, _movieList);
  }
  updateMovies(movies2) {
    __privateSet(this, _movieList, movies2);
  }
  addMovies(movies2) {
    __privateSet(this, _movieList, [...__privateGet(this, _movieList), ...movies2]);
  }
}
_movieList = new WeakMap();
const movies = new Movies();
class Page {
  constructor() {
    __privateAdd(this, _page);
    __privateSet(this, _page, 1);
  }
  getPage() {
    __privateWrapper(this, _page)._++;
    return __privateGet(this, _page);
  }
}
_page = new WeakMap();
const page = new Page();
const Button = ({ text, type }) => {
  const $button = createElement({
    tag: "button",
    classNames: ["primary", `${type}`]
  });
  $button.textContent = text;
  $button.addEventListener("click", async () => {
    document.querySelector(".search-bar");
    const params = new URLSearchParams(window.location.search);
    let fetchedMovies;
    const currentPage = page.getPage();
    if (params.has("query")) {
      fetchedMovies = await fetchSearchMovies(params.get("query"), currentPage);
    } else {
      fetchedMovies = await fetchPopularMovies(currentPage);
    }
    movies.addMovies(fetchedMovies.results);
    if (fetchedMovies.totalPages === currentPage) {
      $button.classList.toggle("disappear");
    }
    document.querySelector(".thumbnail-list").remove();
    document.querySelector("section").appendChild(
      MovieList({
        movies: movies.movieList
      })
    );
  });
  return $button;
};
const BUTTON_DETAIL = "자세히 보기";
const TopRatedContainer = ({ popularMovie }) => {
  const $topRatedContainer = createElement({
    tag: "div",
    classNames: ["top-rated-container"]
  });
  const $topRatedMovie = createElement({
    tag: "div",
    classNames: ["top-rated-movie"]
  });
  $topRatedContainer.append($topRatedMovie);
  $topRatedMovie.append(MoviePreviewInfo({
    bigFont: true,
    movie: popularMovie
  }));
  $topRatedMovie.append(Button({ text: BUTTON_DETAIL, type: "detail" }));
  return $topRatedContainer;
};
const SEARCH_BUTTON_IMAGE_SRC = "./images/searchButtonIcon.png";
const PAGE$1 = 1;
const SEARCH_BAR_PLACEHOLDER = "검색어를 입력하세요";
const SearchBar = () => {
  const $form = createElement({
    tag: "form",
    classNames: ["search-bar-container"]
  });
  const $input = createElement({
    tag: "input",
    classNames: ["search-bar"],
    placeholder: SEARCH_BAR_PLACEHOLDER
  });
  const $button = createElement({
    tag: "button",
    classNames: ["search-bar-button"]
  });
  const $img = createElement({
    tag: "img",
    src: SEARCH_BUTTON_IMAGE_SRC
  });
  $button.appendChild($img);
  $form.append($input, $button);
  const handleSearch = async (event) => {
    event.preventDefault();
    const query = $input.value.trim();
    if (!query) return;
    document.querySelector(".background-container").classList.add("disappear");
    const params = new URLSearchParams(window.location.search);
    params.set("query", query);
    window.history.replaceState({}, "", `${window.location.pathname}?${params.toString()}`);
    document.querySelector(".list-title").textContent = `"${query}" 검색 결과`;
    const searchMovieData = await fetchSearchMovies(query, PAGE$1);
    movies.updateMovies(searchMovieData.results);
    const $thumbnailList = document.querySelector(".thumbnail-list");
    if ($thumbnailList) $thumbnailList.remove();
    document.querySelector("section").appendChild(
      MovieList({ movies: movies.movieList })
    );
  };
  $form.addEventListener("submit", handleSearch);
  return $form;
};
const LOGO_IMG_SRC$1 = "./images/logo.png";
const Gnb = () => {
  const $div = createElement({
    tag: "div",
    classNames: ["gnb"]
  });
  const $logo = createElement({
    tag: "h1",
    classNames: ["logo"]
  });
  const $logoImg = createElement({
    tag: "img",
    src: LOGO_IMG_SRC$1,
    alt: "MovieList"
  });
  $div.appendChild($logo);
  $logo.appendChild($logoImg);
  $div.appendChild(SearchBar());
  return $div;
};
const Header = ({ popularMovie }) => {
  const title = popularMovie == null ? void 0 : popularMovie.title;
  const posterPath = popularMovie == null ? void 0 : popularMovie.poster_path;
  const $header = createElement({
    tag: "header"
  });
  const $backgroundContainer = createElement({
    tag: "div",
    classNames: ["background-container"]
  });
  const $overlay = createElement({
    tag: "div",
    classNames: ["overlay"],
    "aria-hidden": "true"
  });
  const $img = createElement({
    tag: "img",
    src: `${imageUrl(posterPath)}`,
    alt: `${title}`
  });
  $header.appendChild(Gnb());
  $header.appendChild($backgroundContainer);
  $backgroundContainer.appendChild($overlay);
  $overlay.appendChild($img);
  $backgroundContainer.appendChild(TopRatedContainer({ popularMovie }));
  return $header;
};
const BUTTON_MORE = "더보기";
const MovieContainer = ({ movies: movies2 }) => {
  const $container = createElement({
    tag: "div",
    classNames: ["container"]
  });
  const $main = createElement({
    tag: "main"
  });
  const $section = createElement({
    tag: "section"
  });
  const $h2 = createElement({
    tag: "h2",
    classNames: ["list-title"]
  });
  $h2.textContent = "지금 인기 있는 영화";
  $container.appendChild($main);
  $main.appendChild($section);
  $section.appendChild($h2);
  $section.appendChild(MovieList({ movies: movies2 }));
  $main.appendChild(Button({ text: BUTTON_MORE, type: "more" }));
  return $container;
};
const LOGO_IMG_SRC = "./images/woowacourse_logo.png";
const Footer = () => {
  const $footer = createElement({
    tag: "footer",
    classNames: ["footer"]
  });
  const $copy = createElement({
    tag: "p"
  });
  const $p = createElement({
    tag: "p"
  });
  const $img = createElement({
    tag: "img",
    src: LOGO_IMG_SRC,
    width: "180"
  });
  const COPY_TEXT = "우아한테크코스 All Rights Reserved.";
  $copy.textContent = COPY_TEXT;
  $footer.appendChild($copy);
  $footer.appendChild($p);
  $p.appendChild($img);
  return $footer;
};
const Main = ({ movies: movies2 }) => {
  const $body = document.querySelector("body");
  if ($body) {
    const $wrap = createElement({
      tag: "div",
      id: "wrap"
    });
    const $container = createElement({
      tag: "div",
      id: "container"
    });
    $body.appendChild($wrap);
    $container.appendChild(
      Header({
        popularMovie: movies2[0]
        // STEP 2에서 추가 구현하는 부분
      })
    );
    $container.appendChild(
      MovieContainer({
        movies: movies2
      })
    );
    $wrap.appendChild($container);
    $wrap.appendChild(Footer());
  }
};
const deleteParams = () => {
  const params = new URLSearchParams(window.location.search);
  if (params.has("query")) {
    params.delete("query");
    window.history.replaceState(
      {},
      "",
      `${window.location.pathname}?${params.toString()}`
    );
  }
};
deleteParams();
Main({
  movies: "loading"
});
const PAGE = 1;
fetchPopularMovies(PAGE).then((popularMovieData) => {
  var _a;
  movies.updateMovies(popularMovieData.results);
  (_a = document.querySelector("#wrap")) == null ? void 0 : _a.remove();
});
Main({
  movies: movies.movieList
});
