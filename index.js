//API key = 7e6e41d6

const fetchData = async (searchTerm) => {
  const response = await axios.get("http://www.omdbapi.com/", {
    params: {
      apikey: "7e6e41d6",
      s: searchTerm,
    },
  });

  if (response.data.Error) {
    return [];
  }

  return response.data.Search;
};

const root = document.querySelector(".autocomplete");

root.innerHTML = `
  <label><b>Search For a Movie</b></label>
  <div>
    <input class="input" />
  </div>
  <div class="dropdown">
  
    <div class="dropdown-menu">
      <div class="dropdown-content results">
      </div>
    </div>
  </div>
`;

const input = document.querySelector("input");
const dropdown = document.querySelector(".dropdown");
const resultWrapper = document.querySelector(".results");

const onInput = async (e) => {
  const movies = await fetchData(e.target.value);
  if (!movies.length) {
    dropdown.classList.remove("is-active");
    return;
  }
  resultWrapper.innerHTML = "";
  dropdown.classList.add("is-active");

  movies.map((movie) => {
    const option = document.createElement("a");

    const imgSrc = movie.Poster === "N/A" ? "" : movie.Poster;
    option.classList.add("dropdown-item");
    option.innerHTML = `
      <img src = "${imgSrc}"/>
      ${movie.Title}
    `;

    option.addEventListener("click", () => {
      dropdown.classList.remove("is-active");
      input.value = movie.Title;

      onMovieSelect(movie);
    });

    resultWrapper.appendChild(option);
  });
};
input.addEventListener("input", debounce(onInput, 1000));

document.addEventListener("click", (e) => {
  if (!root.contains(e.target)) {
    dropdown.classList.remove("is-active");
  }
});

const onMovieSelect = async (movie) => {
  const details = await axios.get("http://www.omdbapi.com/", {
    params: {
      apikey: "7e6e41d6",
      i: movie.imdbID,
    },
  });

  document.querySelector("#summary").innerHTML = movieTemplate(details.data);
};

const movieTemplate = (movieDetail) => {
  return `
    <article class = "media">
      <figure class="media-left">
        <p class="image">
          <img src=${movieDetail.Poster} />
        </p>
      </figure>

      <div class="media-content">
        <div class="content">
          <h1>${movieDetail.Title}</h1>
          <h4>${movieDetail.Genre}</h4>
          <p>${movieDetail.Plot}</p>
        </div>
      </div>
    </article>
    <article class="notification is-primary">
      <p class="title">${movieDetail.Awards}</p>
      <p class="subtitle">Awards</p>
    </article>
    <article class="notification is-primary">
      <p class="title">${movieDetail.BoxOffice}</p>
      <p class="subtitle">Box Office</p>
    </article>
    <article class="notification is-primary">
      <p class="title">${movieDetail.Metascore}</p>
      <p class="subtitle">Metascore</p>
    </article>
    <article class="notification is-primary">
      <p class="title">${movieDetail.imdbRating}</p>
      <p class="subtitle">IMDB Rating</p>
    </article>
    <article class="notification is-primary">
      <p class="title">${movieDetail.imdbVotes}</p>
      <p class="subtitle">IMDB Votes</p>
    </article>

  `;
};
