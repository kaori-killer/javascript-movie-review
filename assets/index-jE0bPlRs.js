var __typeError = (msg) => {
  throw TypeError(msg);
};
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
var __privateMethod = (obj, member, method) => (__accessCheck(obj, member, "access private method"), method);
var __privateWrapper = (obj, member, setter, getter) => ({
  set _(value) {
    __privateSet(obj, member, value, setter);
  },
  get _() {
    return __privateGet(obj, member, getter);
  }
});
var _movieList, _page, _total, _STORAGE_KEY, _RatingStorage_instances, read_fn, write_fn;
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
async function request(url, options) {
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`HTTP 오류: ${response.status} ${response.statusText}`);
  }
  const data = await response.json();
  return data;
}
async function fetchSearchMovies(query, page2) {
  const url = `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(
    query
  )}&include_adult=false&language=ko-KR&page=${page2}`;
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${"eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxYWMyODc3Y2Q4M2IwZDQ5MGRiODRhMDI5ZDBmNmMxMSIsIm5iZiI6MTc0MjI2NTAzMy4yOTksInN1YiI6IjY3ZDhkYWM5YzUzMzllYWJjNjM2NGQzYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.4zRY7Zc8S7gb3XdoyaKNQcaLuV37Z25Niw5aSHFg5sc"}`
    }
  };
  const { results, total_pages } = await request(
    url,
    options
  );
  return { results, totalPages: total_pages };
}
function createElement(props) {
  const { tag, classNames = [], attributes = {} } = props;
  const $element = document.createElement(tag);
  classNames.forEach((className) => $element.classList.add(className));
  Object.entries(attributes).forEach(([key, value]) => {
    $element[key] = value;
  });
  return $element;
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
    __privateAdd(this, _total);
    __privateSet(this, _page, INITIAL_PAGE);
    __privateSet(this, _total, Infinity);
  }
  reset() {
    __privateSet(this, _page, INITIAL_PAGE);
    __privateSet(this, _total, Infinity);
  }
  getNextPage() {
    __privateWrapper(this, _page)._++;
    return __privateGet(this, _page);
  }
  getCurrentPage() {
    return __privateGet(this, _page);
  }
  setTotalPages(total) {
    __privateSet(this, _total, total);
  }
  hasNextPage() {
    return __privateGet(this, _page) <= __privateGet(this, _total);
  }
}
_page = new WeakMap();
_total = new WeakMap();
const page = new Page();
const SearchButtonImage = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAYAAAAfSC3RAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAC5SURBVHgBlVIBDYMwEPxOAQ5WCUjonCABB+CEOaiEzsEkdA7AQfds1+TWtGRccmny93f9PogAKaVOOSlj+mJVemUvLewiGluYaiZLtwSlo/pM5rE0LhB8Y5oxj14KTwjNt9BEPRc/kAOofEfbkGsX5QaxO/Becb44LSBtbtxmaUEdC661OXymCG2ppfLa90ZPk3Dd1swDpWesCI2l2VQCnB75LQ9jzIbmoLRY0E3+Rfr9w6KRE6Cb5Q2u4UqS3Rky4QAAAABJRU5ErkJggg==";
const EmptyStarSrc = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAxCAYAAACcXioiAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAQ4SURBVHgB7VlNctMwFP7UwrRl0/YGzgloNwyURd0TQE5AeoK2J2hyAuAEaU9QOEHMgvCzSW9QcwLChqbDNOI9RVEk106sWGZY5JvR+FlRJD29fxlYYYX/F/I79uQXxKgRAjWANh3Ro0ct0l0ptSPxQj2DYg31oIvZ5qHpLmpAcAno07+ZdWBIq+zoN5ZCgoCoQwLnhhK4oBUS8y7xGoFRhwT49CP9eqSfPb3aEBtoiH16BkJQCdDmW7AMl9VFq0w6GUCqdKvGBENoFXpj0R2LvjSUwCsERDAGtPHGVldiqBHeWf0xxwcEQkgJOMZr+3xxpHQ+Mb//CWfMIRmIDSUtlZlhplLrOJED41orIQgDecabHaP6pPY+E2OOEQChJFBkvC4E3lv0CQIgNw4o8Y6UiCNicQdjanxqQrVtQ0s9xk0bGkU5j+zR+E38tFa/1pF6aD1/GXrqfteJfkySzYkfImfjV8CS4mXjfY7jeUNkn+YXSxvxBR3Amc3II+fnEd4CS+tmQlH2bOGoO2JwC8umFS3aI8MckiuBPol3lnilqs3EyfjxQORjak/yxTsPStq/tYraKikMvY2pak769/SOhyTl3ek8j+aswb68g5qgGb4uM1Z+oxgzzg9+rheyvQTQll9xFcpfLwNeW9nMGG2r+4M9xmWAQ760BrCejjDQacI/hVqT1nYMXtDeMnYmCv7chp0asC2soymelRN5VcjPpC5ryhtGpnOMjnjpSEIhN5CR7reJNZvTCPckiT5OUTNIbU9oVwPYm5fkOnM2z5hb0OSeBNlGXcatjbVtdaX03qTNF0p+YUWWc8Mw1cXjUJWVchS3VPS7+s5RurnoJqNUSalSgI3MAnw6m9ivyoSO/lmVuaRgd1pm7lLJHOfz4gBNuIlaFKQ8HKlDicw7G+sBWmUPxisbVcYtrVixhqeojtiiO0XGWgT/dFqoED+BpNSiOlJrPu+g6c+AdEJ6gupIDLVEwe91L5S9dSOVqnyvpB3EjUkiN7Hr4xj8JBD+9CcFv7D8/MgvzfZjwBXxp0XDPa7XZ3NJvysXXxuILTopGsSbppRgwOkHvfb4unFBQpgYytMOSuuwo/+ZosKM4aB0R+mALMiZJGW7lLLnRddMMdUo+y3BRwKxtZEHuYlSFY6o9ualrtymEOq3nr6GcSGcOWOUhA8Dh5ht7KMhSTLUOFdy8yVWC4F91eBcdPGYLv2n66iVNSf95xAlsZwE9Gmp1FcqPY+tjQxpVk7C1Ccl3VqYFOKpNR/39UyKbktAlpeAjw1I65Xv/c+RFTWnGVuUbhf4cX3ibbgXYYxUzSlVBeZlBz4M9FCsmym147Kfj9Tt9P2DOiOLUgz4qFCnsJ/Tao9vX1ya0vjGnDnTsl7IL5XoU5Sc3GlGyhNR2Vn106lSK6lu66YBLEVNn2RrBZevqoRdYYUVvPAXJrOCc9SFL6sAAAAASUVORK5CYII=";
const MoviePreviewInfo = ({ movie, bigFont = true }) => {
  const title = movie == null ? void 0 : movie.title;
  const voteAverage = movie == null ? void 0 : movie.vote_average.toFixed(1);
  const $fragment2 = document.createDocumentFragment();
  const $rate = createElement({ tag: "div", classNames: ["rate"] });
  const $starImg = createElement({
    tag: "img",
    classNames: ["star"],
    attributes: {
      src: EmptyStarSrc
    }
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
function proxiedImageUrl(path) {
  return `/api/image${path}`;
}
class RatingStorage {
  constructor() {
    __privateAdd(this, _RatingStorage_instances);
    __privateAdd(this, _STORAGE_KEY, "movie-rating");
  }
  get(movieId) {
    return __privateMethod(this, _RatingStorage_instances, read_fn).call(this)[movieId] ?? 0;
  }
  set(movieId, rating) {
    const ratings = __privateMethod(this, _RatingStorage_instances, read_fn).call(this);
    ratings[movieId] = rating;
    __privateMethod(this, _RatingStorage_instances, write_fn).call(this, ratings);
  }
  has(movieId) {
    return movieId in __privateMethod(this, _RatingStorage_instances, read_fn).call(this);
  }
}
_STORAGE_KEY = new WeakMap();
_RatingStorage_instances = new WeakSet();
read_fn = function() {
  const raw = localStorage.getItem(__privateGet(this, _STORAGE_KEY));
  try {
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};
write_fn = function(data) {
  localStorage.setItem(__privateGet(this, _STORAGE_KEY), JSON.stringify(data));
};
const ratingStorage = new RatingStorage();
class Movie {
  constructor(id, title, posterUrl, rating, releaseDate, genres, overview) {
    this.id = id;
    this.title = title;
    this.posterUrl = posterUrl;
    this.rating = rating;
    this.releaseDate = releaseDate;
    this.genres = genres;
    this.overview = overview;
  }
  static fromTMDB(data) {
    return new Movie(
      data.id,
      data.title,
      `https://image.tmdb.org/t/p/w500${data.poster_path}`,
      data.vote_average,
      data.release_date,
      data.genres.map((g) => g.name),
      data.overview
    );
  }
}
async function fetchDetailsMovie(id) {
  const url = `https://api.themoviedb.org/3/movie/${id}?language=ko-KR`;
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${"eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxYWMyODc3Y2Q4M2IwZDQ5MGRiODRhMDI5ZDBmNmMxMSIsIm5iZiI6MTc0MjI2NTAzMy4yOTksInN1YiI6IjY3ZDhkYWM5YzUzMzllYWJjNjM2NGQzYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.4zRY7Zc8S7gb3XdoyaKNQcaLuV37Z25Niw5aSHFg5sc"}`
    }
  };
  const data = await request(url, options);
  return Movie.fromTMDB(data);
}
const Modal = ({ content, onOpen, onClose }) => {
  const $modalBg = document.createElement("div");
  $modalBg.classList.add("modal-background", "active");
  $modalBg.id = "modalBackground";
  const render = () => {
    $modalBg.innerHTML = content;
  };
  const closeModal = () => {
    onClose == null ? void 0 : onClose();
    $modalBg.remove();
    document.removeEventListener("keydown", handleEscapeKey);
    document.removeEventListener("click", handleCloseClick);
  };
  const handleEscapeKey = (e) => {
    if (e.key === "Escape") closeModal();
  };
  const handleCloseClick = (e) => {
    const target = e.target;
    if (target.className === "closeModal") closeModal();
  };
  const bindCloseEvents = () => {
    document.addEventListener("click", handleCloseClick);
    document.addEventListener("keydown", handleEscapeKey);
  };
  render();
  bindCloseEvents();
  onOpen == null ? void 0 : onOpen();
  return $modalBg;
};
const FilledStarSrc = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAxCAYAAACcXioiAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAKXSURBVHgB7ZhBbtQwFIZ/zyAxu8IN0hNANqh0Q+YG9ASlJyhzgpmeADgBvQG9QbOCJXMDwgnIqoyEqPnjcWmVxElsPU9bKZ/kZuQ4rp/f+/OeA4yMjDxqFCKhvyHh7B+gUWKGhUp5jcATxGPJxb81v67wk39XiMAE8cj+/5riVH/HM0QgigEMn3e8JLcdXPzvOwYJEssDx40ehVNEQFzERrzAj9abU6TqFdYQJIYHls47f6yoBYlhQOa8E0HMogY0xNsYIC9maQ8c944QFrOYiDvFW2eG51KZWdIDy8Ejr/AeQnh7wIhwwzZl+8s2YbvGC/iXCmd8ds1nS85Vcq6qZip9PdNqAMOh2s3ENMUFattUnHKguQAaoYwhBbarLNm3Vq9pdI2GAfZN8hkPEc2q9hAf73ZNWgbtZpdDUM3wahhgLTzDQ0PjE0PovN7tFDFDaQWfN0tMWkLnhs63EI3IsNVDgvtgK+Yj7nzuGtL7GrUJ6hK7N6Jgm3PxRdeg3kRmJ5iz5dgdOXNC2rf4Cq9EthNdVGI9HJ6p/TNxTCM6xOoiqJjTX3kwUfgCWeZdYnURXI3SE1XlmUCGgovfRwBhHrhktp7hFyQJLLHDyukZXkKaTdicYQZo+cN56JyhB5o3kCdoTv/XaIz4vyFAB/4eeBrnE6Eh4ItFSAhlA8cVbCe2FQOfyeBJiAH9scpywNYy56aG3yA1fRJz1/CrhfriX/GQXpUDjow6qLL11IGfB1zxr82he6EOzK7nrser6tJmXPeJz1MHfgao1mSTsz/1KcJoxIqXfT530XI7gwd+BlzzH2rr3u31hIuZD6nb6xhvHOAIdZFPsAcPQsrpBNUuzXAh9XnQzrnipuxxRYuQDRkZGRm5H/4BIkyx5W7xkPAAAAAASUVORK5CYII=";
function Stars(rate, id) {
  return Array.from({ length: 5 }, (_, i) => {
    const starValue = i + 1;
    const imgSrc = rate >= starValue ? FilledStarSrc : EmptyStarSrc;
    return `<img src="${imgSrc}" class="star" data-star-value="${starValue}" data-id=${id} style="cursor: pointer;" />`;
  }).join("");
}
const STAR_MESSAGES = {
  0: "아직 평가하지 않았어요",
  1: "최악이예요",
  2: "별로예요",
  3: "보통이에요",
  4: "재미있어요",
  5: "명작이에요"
};
function MyRate(rate, id) {
  return `
        <div class="my-rate" data-id="${id}">
            <p>내 별점</p>
            ${Stars(rate, id)}
            <span>${STAR_MESSAGES[rate]}</span>
            <span>(${rate * 2} / 10)</span>
        </div>
    `;
}
function extractReleaseYear(movieDetails) {
  return movieDetails.releaseDate.split("-")[0];
}
function extractGenres(movieDetails) {
  return movieDetails.genres.map((genre) => genre).join(", ");
}
const CloseBtnSrc = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAVCAYAAACpF6WWAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAFcSURBVHgBndVRToMwGAfw7+uyPXOEeQM9gezRGOcNBjzqNHEn8AhiIizxpYDxeZHps7uBu4EcwefpWlsYZsNSyv7JlrS0v0D7FQA2eXx+O5Q/2COUzqzp09wu2yj/wiS94xxu8g4E/3I0nJiCYfzqMGC+gCzRzAjrDjCg4u7I+mNnJEI0Hg09E5ADi3Z7+T1RjubgBklKoTVYhIy90yUHHreBNaB4/J6PZeshfokQ0Pk3rLIUerA7uPBOMtzubYJNwGJ4JXWwqIqFqBC7CVSiOtgErEUNYSWoRWXCZP7OObcVl74EeKQCZdR1CptdVoMyFut839bNxVqwprArs5UnD/cGNTAxBOWmHJiePDQE/3bZ5ORhG7BME4xTOusz0vk0BZtgcfImhEHPagvKXDnnrmqNRRn2yQpWYiLP2oBamOEyX9NiCUj+OZHvQxNwOwFNXdKB4581xtfe2eIXnjrtn65LhjUAAAAASUVORK5CYII=";
function MovieItemModal(movieDetails, rate) {
  const year = extractReleaseYear(movieDetails);
  const genres = extractGenres(movieDetails);
  const movieId = String(movieDetails.id);
  return `
    <div class="modal">
      <button class="close-modal">
        <img src="${CloseBtnSrc}" class="closeModal" />
      </button>
      <div class="modal-container">
        <div class="modal-image">
          <img src="${proxiedImageUrl(movieDetails.posterUrl)}" />
        </div>
        <div class="modal-description">
          <h2>${movieDetails.title}</h2>
          <p class="category">${year} · ${genres}</p>
          <p class="rate">
            <span>평균</span>
            <img src="${FilledStarSrc}" class="star" />
            <span>${movieDetails.rating.toFixed(1)}</span>
          </p>
          <hr />
          ${MyRate(rate, movieId)}
          <hr />
          <p class="detail">
            <p><strong>줄거리</strong></p>
            ${movieDetails.overview}
          </p>
        </div>
      </div>
    </div>
  `;
}
document.addEventListener("click", (event) => {
  const target = event.target;
  if (target.matches(".star")) {
    const starValue = target.getAttribute("data-star-value");
    const id = target.getAttribute("data-id");
    if (starValue && id) {
      const rate = parseInt(starValue, 10);
      ratingStorage.set(id, rate);
      const $myRate = document.querySelector(`.my-rate[data-id="${id}"]`);
      if ($myRate) {
        $myRate.innerHTML = MyRate(rate, id);
      }
    }
  }
});
const openMovieModal = async (movie) => {
  const movieDetails = await fetchDetailsMovie(movie.id);
  const initialRate = ratingStorage.get(String(movieDetails.id));
  const $modal = Modal({
    content: MovieItemModal(movieDetails, initialRate),
    onOpen: () => {
      var _a;
      return (_a = document.querySelector(".gnb")) == null ? void 0 : _a.classList.add("disappear");
    },
    onClose: () => {
      var _a;
      return (_a = document.querySelector(".gnb")) == null ? void 0 : _a.classList.remove("disappear");
    }
  });
  document.body.appendChild($modal);
};
const nullImage = "/javascript-movie-review/assets/nullImage-DNlbCffn.png";
const MovieItem = ({ movie }) => {
  const title = movie == null ? void 0 : movie.title;
  const posterPath = movie == null ? void 0 : movie.poster_path;
  const movieId = String(movie.id);
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
    attributes: {
      src: posterPath ? `${proxiedImageUrl(posterPath)}` : nullImage,
      alt: `${title}`
    }
  });
  $img.onerror = () => {
    $img.src = nullImage;
  };
  $li.appendChild($div);
  $div.appendChild($img);
  $div.appendChild(
    MoviePreviewInfo({
      movie,
      bigFont: false
    })
  );
  $li.addEventListener("click", async () => {
    openMovieModal(movie);
  });
  if (!ratingStorage.has(movieId)) {
    ratingStorage.set(movieId, 0);
  }
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
    classNames: ["nothing-img"],
    attributes: {
      src: NothingImg,
      alt: "으아아"
    }
  });
  $p.textContent = NOTHING_TEXT;
  $fragment.appendChild($p);
  $fragment.appendChild($img);
  return $fragment;
};
const SKELETON_ITEMS_COUNT = 20;
const MovieList = ({ movies: movies2, status }) => {
  const $ul = createElement({
    tag: "ul",
    classNames: ["thumbnail-list"]
  });
  if (status === "loading") {
    Array(SKELETON_ITEMS_COUNT).fill(null).forEach(() => {
      $ul.appendChild(SkeletonMovieItem());
    });
  }
  if (status === "fetched") {
    movies2.forEach((movie) => {
      $ul.appendChild(MovieItem({ movie }));
    });
  }
  if (status === "fetched" && movies2.length === 0) {
    return NothingMovieList();
  }
  return $ul;
};
function removeElement(selector) {
  const $element = document.querySelector(selector);
  if ($element) $element.remove();
}
function hideLoadMoreButton() {
  const $button = document.querySelector(".primary.more");
  if ($button) {
    $button.classList.add("disappear");
  }
}
function appendMovieList(section, status) {
  const list = MovieList({
    movies: status === "loading" ? [] : movies.movieList,
    status
  });
  section.appendChild(list);
  return list;
}
function renderErrorMessage(section, message) {
  const $error = createElement({ tag: "p" });
  $error.textContent = message;
  section.appendChild($error);
}
async function renderMovieList(fetchFn) {
  const section = document.querySelector("section");
  if (!section) return;
  removeElement(".thumbnail-list");
  const loadingList = appendMovieList(section, "loading");
  try {
    const { results, totalPages } = await fetchFn();
    movies.addMovies(results);
    if (loadingList instanceof HTMLElement) {
      loadingList.remove();
    }
    appendMovieList(section, "fetched");
    if (totalPages === page.getCurrentPage()) {
      hideLoadMoreButton();
    }
  } catch (error) {
    if (loadingList instanceof HTMLElement) {
      loadingList.remove();
    }
    console.error("영화 불러오기 실패:", error);
    hideLoadMoreButton();
    renderErrorMessage(section, "영화 데이터를 불러오는 데 실패했습니다.");
  }
}
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
    attributes: {
      placeholder: SEARCH_BAR_PLACEHOLDER
    }
  });
  const $button = createElement({
    tag: "button",
    classNames: ["search-bar-button"]
  });
  const $img = createElement({
    tag: "img",
    attributes: {
      src: SearchButtonImage
    }
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
  window.history.replaceState(
    {},
    "",
    `${window.location.pathname}?${params.toString()}`
  );
}
function updateDOMForSearch(query) {
  var _a;
  (_a = document.querySelector(".background-container")) == null ? void 0 : _a.classList.add("disappear");
  const $title = document.querySelector(".list-title");
  if ($title) $title.textContent = `"${query}" 검색 결과`;
}
async function performSearch(query) {
  if (!query) return;
  updateURLQueryParam(query);
  updateDOMForSearch(query);
  renderMovieList(async () => {
    const res = await fetchSearchMovies(query, PAGE);
    movies.updateMovies(res.results);
    return {
      results: res.results,
      totalPages: res.totalPages
    };
  });
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
    attributes: {
      src: LogoImg,
      alt: "MovieList"
    }
  });
  $div.appendChild($logo);
  $logo.appendChild($logoImg);
  $div.appendChild(SearchBar());
  return $div;
};
const Button = ({ text, type }) => {
  const $button = createElement({
    tag: "button",
    classNames: ["primary", type]
  });
  $button.textContent = text;
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
  $topRatedMovie.append(
    MoviePreviewInfo({
      bigFont: true,
      movie: popularMovie
    })
  );
  const $button = Button({ text: BUTTON_DETAIL, type: "detail" });
  $button.addEventListener("click", async () => {
    openMovieModal(popularMovie);
  });
  $topRatedMovie.append($button);
  $topRatedContainer.append($topRatedMovie);
  return $topRatedContainer;
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
    attributes: {
      "aria-hidden": "true"
    }
  });
  const $img = createElement({
    tag: "img",
    attributes: {
      src: `${proxiedImageUrl(posterPath)}`,
      alt: `${title}`
    }
  });
  $header.appendChild(Gnb());
  $header.appendChild($backgroundContainer);
  $backgroundContainer.appendChild($overlay);
  $overlay.appendChild($img);
  $backgroundContainer.appendChild(TopRatedContainer({ popularMovie }));
  return $header;
};
function setupInfiniteScroll({
  onLoad,
  onEnd,
  hasNextPage,
  offset = 100
}) {
  let isLoading = false;
  const handleScroll = () => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    const reachedBottom = scrollTop + clientHeight >= scrollHeight - offset;
    if (!reachedBottom || isLoading || !hasNextPage()) return;
    isLoading = true;
    onLoad().catch(console.error).finally(() => {
      isLoading = false;
      if (!hasNextPage()) {
        onEnd == null ? void 0 : onEnd();
      }
    });
  };
  window.addEventListener("scroll", handleScroll);
  return () => {
    window.removeEventListener("scroll", handleScroll);
  };
}
async function fetchPopularMovies(page2) {
  const url = `https://api.themoviedb.org/3/movie/popular?language=ko-KR&page=${page2}`;
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${"eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxYWMyODc3Y2Q4M2IwZDQ5MGRiODRhMDI5ZDBmNmMxMSIsIm5iZiI6MTc0MjI2NTAzMy4yOTksInN1YiI6IjY3ZDhkYWM5YzUzMzllYWJjNjM2NGQzYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.4zRY7Zc8S7gb3XdoyaKNQcaLuV37Z25Niw5aSHFg5sc"}`
    }
  };
  const { results, total_pages } = await request(
    url,
    options
  );
  return { results, totalPages: total_pages };
}
const BUTTON_MORE = "더보기";
const MovieContainer = ({ movies: movies2, status }) => {
  const $container = createElement({ tag: "div", classNames: ["container"] });
  const $main = createElement({ tag: "main" });
  const $section = createElement({ tag: "section" });
  const $h2 = createElement({ tag: "h2", classNames: ["list-title"] });
  $h2.textContent = "지금 인기 있는 영화";
  const movieListElement = MovieList({ movies: movies2, status });
  const $button = Button({ text: BUTTON_MORE, type: "more" });
  $button.addEventListener("click", () => {
    const params = new URLSearchParams(window.location.search);
    const currentPage = page.getNextPage();
    renderMovieList(async () => {
      const res = params.has("query") ? await fetchSearchMovies(params.get("query") || "", currentPage) : await fetchPopularMovies(currentPage);
      return {
        results: res.results,
        totalPages: res.totalPages
      };
    });
  });
  $section.appendChild($h2);
  $section.appendChild(movieListElement);
  $main.appendChild($section);
  $main.appendChild($button);
  $container.appendChild($main);
  return $container;
};
setupInfiniteScroll({
  onLoad: async () => {
    const params = new URLSearchParams(window.location.search);
    const currentPage = page.getNextPage();
    const res = params.has("query") ? await fetchSearchMovies(params.get("query") || "", currentPage) : await fetchPopularMovies(currentPage);
    page.setTotalPages(res.totalPages);
    renderMovieList(
      () => Promise.resolve({ results: res.results, totalPages: res.totalPages })
    );
  },
  hasNextPage: () => page.hasNextPage(),
  onEnd: () => {
    var _a;
    (_a = document.querySelector(".primary.more")) == null ? void 0 : _a.classList.add("disappear");
  },
  offset: 150
});
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
    attributes: {
      src: LogoImage,
      width: "180"
    }
  });
  const COPY_TEXT = "우아한테크코스 All Rights Reserved.";
  $copy.textContent = COPY_TEXT;
  $footer.appendChild($copy);
  $footer.appendChild($p);
  $p.appendChild($img);
  return $footer;
};
const Main = ({ movies: movies2, status }) => {
  const $body = document.querySelector("body");
  if ($body) {
    const $wrap = createElement({
      tag: "div",
      attributes: {
        id: "wrap"
      }
    });
    const $container = createElement({
      tag: "div",
      attributes: {
        id: "container"
      }
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
        movies: movies2,
        status
      })
    );
    $wrap.appendChild($container);
    $wrap.appendChild(Footer());
  }
};
async function fetchAndRender(fetchFn) {
  var _a;
  renderMain("loading");
  (_a = document.querySelector("#wrap")) == null ? void 0 : _a.remove();
  try {
    const data = await fetchFn();
    renderMain("fetched", data);
  } catch (error) {
    console.error("영화 불러오기 실패:", error);
    renderMain("error");
  }
}
fetchAndRender(async () => {
  const PAGE2 = 1;
  const params = new URLSearchParams(window.location.search);
  const res = params.has("query") ? await fetchSearchMovies(params.get("query") || "", PAGE2) : await fetchPopularMovies(PAGE2);
  movies.updateMovies(res.results);
  return movies.movieList;
});
function renderMain(status, movies2 = []) {
  Main({
    status,
    movies: movies2
  });
}
