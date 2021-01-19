const createAutoComplete = ({ root }) => {
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

  const input = root.querySelector("input");
  const dropdown = root.querySelector(".dropdown");
  const resultWrapper = root.querySelector(".results");

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
};
