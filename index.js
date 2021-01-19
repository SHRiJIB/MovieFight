//API key = 7e6e41d6

const fetchData = async (searchTerm) => {
  const response = await axios.get("http://www.omdbapi.com/", {
    params: {
      apikey: "7e6e41d6",
      s: searchTerm,
    },
  });
};

const input = document.querySelector("input");

const debounce = (func, delay = 1000) => {
  let timeoutId;
  return (...args) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func.apply(null, args);
    }, delay);
  };
};
const onInput = (e) => {
  fetchData(e.target.value);
};
input.addEventListener("input", debounce(onInput, 500));
