const fetchData = async () => {
  const response = await axios.get("http://www.omdbapi.com/", {
    params: {
      apikey: "7e6e41d6",
      s: "avengers",
    },
  });

  console.log(response.data);
};

fetchData();
//API key = 7e6e41d6
