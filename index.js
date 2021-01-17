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
let timeoutId;
const onInput = (e) => {
  if (timeoutId) {
    clearTimeout(timeoutId);
  }
  timeoutId = setTimeout(() => {
    fetchData(e.target.value);
  }, 1000);
};
input.addEventListener("input", onInput);
