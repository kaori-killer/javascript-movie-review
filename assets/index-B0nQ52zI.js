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
const STAR_IMG_SRC = "./star_empty.png";
const MoviePreviewInfo = ({ movie, bigFont = true }) => {
  const title = movie == null ? void 0 : movie.title;
  const voteAverage = movie == null ? void 0 : movie.vote_average;
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
  const title = movie == null ? void 0 : movie.title;
  const posterPath = movie == null ? void 0 : movie.poster_path;
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
const NothingImg = "/javascript-movie-review/assets/%EC%9C%BC%EC%95%84%EC%95%84-Bye2rQsa.png";
const NOTHING_TEXT = "검색 결과가 없습니다.";
const $fragment = document.createDocumentFragment();
const NothingMovieList = () => {
  const $p = createElement({
    tag: "p",
    classNames: ["nothing-text"]
  });
  const $img = createElement({
    tag: "img",
    src: NothingImg,
    alt: "으아아",
    classNames: ["nothing-img"]
  });
  $p.textContent = NOTHING_TEXT;
  $fragment.appendChild($p);
  $fragment.appendChild($img);
  return $fragment;
};
const SKELETON_ITEMS_COUNT = 20;
const MovieList = ({ movies: movies2 }) => {
  const $ul = createElement({
    tag: "ul",
    classNames: ["thumbnail-list"]
  });
  if (movies2.length === 0) {
    return NothingMovieList();
  }
  if (movies2 === "loading") {
    Array(SKELETON_ITEMS_COUNT).fill(null).forEach(() => {
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
const INITIAL_PAGE = 1;
class Page {
  constructor() {
    __privateAdd(this, _page);
    __privateSet(this, _page, INITIAL_PAGE);
  }
  reset() {
    __privateSet(this, _page, INITIAL_PAGE);
  }
  getNextPage() {
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
    const params = new URLSearchParams(window.location.search);
    let fetchedMovies;
    const currentPage = page.getNextPage();
    if (params.has("query")) {
      fetchedMovies = await fetchSearchMovies(
        params.get("query") || "",
        currentPage
      );
    } else {
      fetchedMovies = await fetchPopularMovies(currentPage);
    }
    movies.addMovies(fetchedMovies.results);
    if (fetchedMovies.totalPages === currentPage) {
      $button.classList.toggle("disappear");
    }
    const thumbnailList = document.querySelector(".thumbnail-list");
    if (thumbnailList) {
      thumbnailList.remove();
    }
    const section = document.querySelector("section");
    if (section) {
      section.appendChild(
        MovieList({
          movies: movies.movieList
        })
      );
    }
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
const SearchButtonImage = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAYAAAAfSC3RAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAC5SURBVHgBlVIBDYMwEPxOAQ5WCUjonCABB+CEOaiEzsEkdA7AQfds1+TWtGRccmny93f9PogAKaVOOSlj+mJVemUvLewiGluYaiZLtwSlo/pM5rE0LhB8Y5oxj14KTwjNt9BEPRc/kAOofEfbkGsX5QaxO/Becb44LSBtbtxmaUEdC661OXymCG2ppfLa90ZPk3Dd1swDpWesCI2l2VQCnB75LQ9jzIbmoLRY0E3+Rfr9w6KRE6Cb5Q2u4UqS3Rky4QAAAABJRU5ErkJggg==";
const PAGE = 1;
const SEARCH_BAR_PLACEHOLDER = "검색어를 입력하세요";
function createSearchBarUI(onSubmit) {
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
    src: SearchButtonImage
  });
  $button.appendChild($img);
  $form.append($input, $button);
  $form.addEventListener("submit", (event) => {
    event.preventDefault();
    onSubmit($input.value.trim());
  });
  return $form;
}
function updateURLQueryParam(query) {
  const params = new URLSearchParams(window.location.search);
  params.set("query", query);
  page.reset();
  window.history.replaceState({}, "", `${window.location.pathname}?${params.toString()}`);
}
function updateDOMForSearch(query) {
  document.querySelector(".background-container").classList.add("disappear");
  document.querySelector(".list-title").textContent = `"${query}" 검색 결과`;
  const $thumbnailList = document.querySelector(".thumbnail-list");
  if ($thumbnailList) $thumbnailList.remove();
}
async function performSearch(query) {
  if (!query) return;
  updateURLQueryParam(query);
  updateDOMForSearch(query);
  const searchMovieData = await fetchSearchMovies(query, PAGE);
  movies.updateMovies(searchMovieData.results);
  const $movieList = MovieList({ movies: movies.movieList });
  document.querySelector("section").appendChild($movieList);
}
const SearchBar = () => {
  return createSearchBarUI(performSearch);
};
const LogoImg = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHsAAAAUCAYAAACtZULwAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAUdSURBVHgB7VrhcRsrEP6cyX+rBFyBlQpMKrBeBZYreHYFUip4cgVSKkhSgXgVRKlApAKrAx77AA+3t3CcpHGcmXwzjO5gF5Zd2GU5XTjnlgDsxcXFxj9r/0xl5csDulh5mgOrQ+Qfgsj72vCyOl7n5brAifDdKv+zZ9Ub3/V9ZWzS+RVeEy7g2ZetL/v4rlwfWuCdujYovAFIguEMKOhrPTD2HmdElEHnhdO8z56VL5NKf1NfjFD3B28DS1/usnfrS8dzJGPvvEv56IJLXhQ6uxbqfjdjf8KvAx/71cNaMraKhr6p0GqhrkZfhR+PvIhC36NYXw5+8e0E+o7n8TS20rdEu0G7bNMoW8Ihlt2R548Nez8UxlWQvaxFXS+XQn+qM54rxFgX4jjHhHXWi0Ol/jIeivNbN4y9L4uM70GgmUOAr18LtBPXl2/P+HSjbN99meVKFWh4zN6z9m1usCjzc8PYe9fVy9y1Yfsu8hgE//6UyWcFPU5zxQjtO1TggtFpkhrDINplphQj0JQ8i2bvZmg3urBwWmUjPXzJDX4iaGHMUT8zJSgEvTxgJJKxk/vIXcG/Av208FzjybFG24Ry0G6bRffFDdZTtqfl7pfwGcNYYDz+wYlwwVses2j+xkgkY5OCaFXPszZpl14XnhMsCoi7WgtN5E3uY3ks9HEbf7+x+onrp3Va4DeoIHopxaqtLx8RPB6VD+jLptzpaaW0aWw2bhqb20PF3wPKerdZeYnZFINoB23iO01CyqFfYlzkyfHs5NiV+tNC/VcuXaGPfWyT4tMD49+y9u9Z235Ev0tBtqVAN3cnxGwn62UrjL0R6NTQ3HK8Z6vgOb2Q2/QMtGpyt0uTmsT4x1dkNV6jv3NEHjo1u/5dR5KBFseatWmEG7/kEjVrb3HhSqi79f3dNNCdCklvOhqL2n4geKZlLC8oZSMlJGOT4fYFQTSrmzr54ukHzgeLrmL/NzYtMj+2YTLlBtFCXwbHofUOQeEExDnRgrwT+qVC8TydJ8geFPbMWEMTUsy2CEm/Ye2SAaeQFWFQx9iDWQn8EEhxO8lzy9osz0vfIryMcwT92wFSmid5tq2Ts6Eq0s4mpSxjnNJZe+mQJhnOoo4DzgOD/slZQ/ZCBqeNYxvozrKYSP8IKZVGmAd5LDKupGuFkPpdjbngScZOMYJ3bAQeLdQdYoxXGIfSble8//TgxzHCWeI2unfO1xKvO/1n+ObHWqEB7oQTeeRVrHoVjZ9SSSoL9EMbufgNGpGMnY7vCpkS42Gpd0gT+mlZ3RJN71LEyRcVnNegm5uSMjSjoQVo0IZDQbYVk+0L+jnxX5DnNvP0PxHiq0EZS/Tj9VWSKYahtJG4R6uFRhUzgp+pouVDiOQeOVoOZxZhArmA0+hRbHxPd9JD/VPczpVOfAuBphVGqJsxZV1CvvxId+YcuUwGZVihbu3H5vLfQR47geykWPu88xZzst737Kx95YYxi7TFPDu2L91xUExm1cAzZxOv5qKu7U7cVfhL99rLwti1PLsVOht/ULfvMl0oyG7hWBctYYXxB5pPPM2I73aA7yvG4R5tB7Icj9nzE45AdPHH8H5m4YF0a2sM5MaJgdz4owu7gdxF7h4M6m7owIwh0ab4Q78f4jiUJikUPnEiuOFNJXV6Qj/VSih9htyhq5CX53g+oWtJ8lJ3mWxokS1mM9R+w/hsYeycl77opXB5DXnjpXBhaHz6G1neGOd75YKXpX4umRz4Dz1my31xwGpxAAAAAElFTkSuQmCC";
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
    src: LogoImg,
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
const LogoImage = "/javascript-movie-review/assets/woowacourse_logo-C2VvP7wQ.png";
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
    src: LogoImage,
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
async function init() {
  var _a;
  const PAGE2 = 1;
  const popularMovieData = await fetchPopularMovies(PAGE2);
  movies.updateMovies(popularMovieData.results);
  (_a = document.querySelector("#wrap")) == null ? void 0 : _a.remove();
  Main({
    movies: movies.movieList
  });
}
init();
