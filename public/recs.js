function getConfig() {
  let url = "https://api.themoviedb.org/3/configuration?api_key=9aadfff8aa707747cec36dc03dfe8b0f";
  fetch(url)
    .then((result) => {
      return result.json();
    })
    .then((data) => {
      baseImageURL = data.images.base_url;
      posterSize = data.images.poster_sizes[2];
      console.log('fetched config:', data);

      genresList = getGenres();
      loadTrending();
    })
    .catch(function (err) {
      alert(err);
    });
}

function getGenres() {
  let url = "https://api.themoviedb.org/3/genre/movie/list?api_key=9aadfff8aa707747cec36dc03dfe8b0f&language=en-US";
  var genresList = [];
  fetch(url)
    .then(results => results.json())
    .then((data) => {
      genresList = data.genres;
      console.log('fetched genres:', genresList);
    })
  
    return genresList;
}

function loadTrending() {
  let url = "https://api.themoviedb.org/3/trending/movie/day?api_key=9aadfff8aa707747cec36dc03dfe8b0f";
  fetch(url)
    .then(results => results.json())
    .then((data) => {
      var getDiv, posterURL, toWrite = "";
      for (i = 0; i < data.results.length; i++) {
        getDiv = 'top' + i;
        posterURL = baseImageURL + posterSize + data.results[i].poster_path;
        toWrite += '<img class="moviePoster"';
        toWrite += 'src="' + posterURL + '">';

        toWrite += '<div class="moreInfo">';
        toWrite += '<div class="movieTitle">' + data.results[i].original_title + '</div>';
        toWrite += '<div class="synopsis">' + data.results[i].overview + '</div>';
        toWrite += '<input type="image" class="addButton" src="assets/add.png"';
        toWrite += ' id="' + data.results[i].id + '" value="false">';
        toWrite += '</div>';

        document.getElementById(getDiv).innerHTML = toWrite;
        toWrite = "";
      }
      console.log(data);

      document.querySelectorAll('.addButton').forEach(item => {
        item.addEventListener('click', async (e) => {
          e.preventDefault();
          const url = "/api/user/addMovie";
          const data = {
            movieId: e.target.id
          };
          const token = window.localStorage.getItem("movieAppToken");
          const rawRes = await fetch(url, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(data),
          });
          if (rawRes.status == 200) {
            const res = await rawRes.json();
            console.log(res.message);
          } else {
            console.log("Access Denied");
            setTimeout(function () {
              window.location.href = "/login.html";
            }, 3000);
          }
          e.target.src = "assets/added.png";
          e.target.value = "true";
        });
      });
    })

  url = "https://api.themoviedb.org/3/discover/movie?api_key=9aadfff8aa707747cec36dc03dfe8b0f&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_genres=35";
  fetch(url)
  .then(results => results.json())
  .then((data) => {
    console.log(data);
  })
}


document.addEventListener('DOMContentLoaded', getConfig);