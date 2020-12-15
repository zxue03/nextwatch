const token = window.localStorage.getItem("movieAppToken");
watchListId = []

function getConfig() {
  let url = "https://api.themoviedb.org/3/configuration?api_key=9aadfff8aa707747cec36dc03dfe8b0f";
  fetch(url)
    .then((result) => {
      return result.json();
    })
    .then((data) => {
      baseImageURL = data.images.secure_base_url;
      posterSize = data.images.poster_sizes[2];
      console.log('fetched config:', data);
      loadTrending();
    })
    .catch(function (err) {
      alert(err);
    });
}

function loadTrending() {
  let url = "https://api.themoviedb.org/3/trending/movie/day?api_key=9aadfff8aa707747cec36dc03dfe8b0f";
  fetch(url)
    .then(results => results.json())
    .then((data) => {
      var movies = data.results;
      loadMovies(movies, "Trending");
    })
}

function loadMovies(movies, heading) {
  document.getElementById('displayHeading').innerHTML = "<h2>" + heading + "</h2>";
console.log(movies);
  var getDiv, posterURL, toWrite = "";
  for (i = 0; i < 20; i++) {
    getDiv = 'top' + i;

    if (i > movies.length - 1 || movies[i].poster_path == null) {
      document.getElementById(getDiv).innerHTML = "";
    } else {
      posterURL = baseImageURL + posterSize + movies[i].poster_path;
      toWrite += '<img class="moviePoster"';
      toWrite += 'src="' + posterURL + '">';

      toWrite += '<div class="moreInfo">';
      toWrite += '<div class="movieTitle">' + movies[i].original_title;
      date = movies[i].release_date;
      console.log(date);
      toWrite += ' (' + date.substring(0,4) + ')</div>';
      toWrite += '<div class="synopsis">' + movies[i].overview + '</div>';

      toWrite += '<input type="image" class="Button"';
      //check if movie is already in there
      currMovie = "" + movies[i].id;
      if (watchListId.indexOf(currMovie) != -1) {
        toWrite += 'src="assets/added.png" value="true"';
      } else {
        toWrite += 'src="assets/add.png" value="false"';
      }
      toWrite += ' id="' + movies[i].id + '">';
      toWrite += '</div>';

      document.getElementById(getDiv).innerHTML = toWrite;
      toWrite = "";
    }
  }

  document.querySelectorAll('.Button').forEach(item => {
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
        e.target.src = "assets/added.png";
      } else {
        console.log("Access Denied");
        alert("Please login to add this movie to your watchlist");
      }
    });
  });
}

function searchPerson(person) {
  var personID;

  let url =
    "https://api.themoviedb.org/3/search/person?api_key=9aadfff8aa707747cec36dc03dfe8b0f&language=en-US&query="
    + person
    + "&page=1&include_adult=false";

  fetch(url)
    .then(results => results.json())
    .then((data) => {
      if (data.results.length <= 0) {
        alert("No person found. Try a different name.");
      } else {
        personID = data.results[0].id;
        getMovies(personID);
      }
    })
    .catch(function (err) {
      alert(err);
    });
}

function searchMood(moodIndex) {
  let url = "https://api.themoviedb.org/3/discover/movie?api_key=9aadfff8aa707747cec36dc03dfe8b0f&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_genres=";
  for (i = 0; i < moods[moodIndex].subgenres.length; i++) {
    url += moods[moodIndex].subgenres[i] + ",";
  }

  fetch(url)
    .then(results => results.json())
    .then((data) => {
      var movies = data.results;
      loadMovies(movies, "Our Recommendations");
    })
    .catch(function (err) {
      alert(err);
    });
}

function getMovies(personID) {
  let url = "https://api.themoviedb.org/3/discover/movie?api_key=9aadfff8aa707747cec36dc03dfe8b0f&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_cast=" + personID;

  fetch(url)
    .then(results => results.json())
    .then((data) => {
      console.log("person search:", data);
      var movies = data.results;
      if (movies.length <= 0) {
        alert("Sorry! No movies found with that actor/actress");
      } else {
        loadMovies(movies, "Our Recommendations");
      }
    })
    .catch(function (err) {
      alert(err);
    });

}

const getWatchListId = async () => {
  if (token) {
    const rawRes = await fetch("/api/user/watchList", {
      headers: {
        "authorization": `Bearer ${token}`,
      },
    });
    if (rawRes.status == 200) {
      const res = await rawRes.json();
      watchListId = res.watchList;
    }
  }
};

const main = async () => {
  await getWatchListId();
  getConfig();
}

document.addEventListener('DOMContentLoaded', main);



