//API key = 7e6e41d6

const configObj = {
  renderOption(movie) {
    const imgSrc = movie.Poster === "N/A" ? "" : movie.Poster;
    return `
    <img src = "${imgSrc}"/>
    ${movie.Title} (${movie.Year})
  `;
  },

  inputValue(option) {
    return option.Title;
  },
  async fetchData(searchTerm) {
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
  },
};
createAutoComplete({
  root: document.querySelector(".left-autocomplete"),
  onOptionSelect(option) {
    document.querySelector(".tutorial").classList.add("is-hidden");
    onMovieSelect(option, document.querySelector(".left-summary"), "left");
  },
  ...configObj,
});

createAutoComplete({
  root: document.querySelector(".right-autocomplete"),
  onOptionSelect(option) {
    document.querySelector(".tutorial").classList.add("is-hidden");
    onMovieSelect(option, document.querySelector(".right-summary"), "right");
  },
  ...configObj,
});

let leftMovie, rightMovie;
const onMovieSelect = async (movie, summarySection, side) => {
  const details = await axios.get("http://www.omdbapi.com/", {
    params: {
      apikey: "7e6e41d6",
      i: movie.imdbID,
    },
  });

  summarySection.innerHTML = movieTemplate(details.data);

  if (side === "left") {
    leftMovie = details.data;
  } else {
    rightMovie = details.data;
  }

  if (leftMovie && rightMovie) {
    runComparison();
  }
};

function runComparison() {
  const leftSideStats = document.querySelectorAll(
    ".left-summary .notification"
  );
  const rightSideStats = document.querySelectorAll(
    ".right-summary .notification"
  );

  leftSideStats.forEach((lStat, index) => {
    const rStat = rightSideStats[index];
    const lStatValue = parseInt(lStat.dataset.value);
    const rStatValue = parseInt(rStat.dataset.value);

    if (lStatValue > rStatValue) {
      rStat.classList.remove("is-primary");
      rStat.classList.add("is-warning");
    } else if (rStatValue > lStatValue) {
      lStat.classList.remove("is-primary");
      lStat.classList.add("is-warning");
    }
  });
}

const movieTemplate = (movieDetail) => {
  const dollars = parseInt(
    movieDetail.BoxOffice.replace(/\$/g, "").replace(/,/g, "")
  );
  const metascore = parseInt(movieDetail.Metascore);
  const imdbRating = parseFloat(movieDetail.imdbRating);
  const imdbVotes = parseInt(movieDetail.imdbVotes.replace(/,/g, ""));
  const awards = movieDetail.Awards.split(" ").reduce((prev, word) => {
    if (isNaN(parseInt(word))) {
      return prev;
    }
    return prev + parseInt(word);
  }, 0);

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
    <article data-value=${awards} class="notification is-primary">
      <p class="title">${movieDetail.Awards}</p>
      <p class="subtitle">Awards</p>
    </article>
    <article data-value=${dollars} class="notification is-primary">
      <p class="title">${movieDetail.BoxOffice}</p>
      <p class="subtitle">Box Office</p>
    </article>
    <article data-value=${metascore} class="notification is-primary">
      <p class="title">${movieDetail.Metascore}</p>
      <p class="subtitle">Metascore</p>
    </article>
    <article data-value=${imdbRating} class="notification is-primary">
      <p class="title">${movieDetail.imdbRating}</p>
      <p class="subtitle">IMDB Rating</p>
    </article>
    <article data-value=${imdbVotes} class="notification is-primary">
      <p class="title">${movieDetail.imdbVotes}</p>
      <p class="subtitle">IMDB Votes</p>
    </article>

  `;
};
