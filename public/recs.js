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
      var getDiv, posterURL, toWrite = "";
      for (i = 0; i < data.results.length; i++) {
        getDiv = 'top' + i;
        posterURL = baseImageURL + posterSize + data.results[i].poster_path;
        toWrite += '<img class="moviePoster"';
        toWrite += 'src="' + posterURL + '">';

        toWrite += '<div class="moreInfo">';
        toWrite += '<div class="movieTitle">' + data.results[i].original_title + '</div>';
        var overview
        if(data.results[i].overview.length > 320){
          //trim the string to the maximum length
          overview =data.results[i].overview.substr(0, 320);
          //re-trim if we are in the middle of a word and 
          overview = overview.substr(0, overview.lastIndexOf(".")+1) + ".."
        }
        else{
          overview = data.results[i].overview;
        }
        
        toWrite += '<div class="synopsis">' + overview + '</div>';
        //check if movie is already in their

        toWrite += '<input type="image" class="Button" src="assets/add.png"';
        toWrite += ' id="' + data.results[i].id + '" value="false">';
        toWrite += '</div>';

        document.getElementById(getDiv).innerHTML = toWrite;
        toWrite = "";
      }
      console.log(data);

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
          } else {
            console.log("Access Denied");
            alert("Please login to add this movie to your watchlist");
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

function loadMovies(movies) {
  var getDiv, posterURL, toWrite = "";

  for (i = 0; i < 20; i++) {
    getDiv = 'top' + i;

    if ( i > movies.length - 1 || movies[i].poster_path == null) {
      document.getElementById(getDiv).innerHTML = "";
    } else {
      posterURL = baseImageURL + posterSize + movies[i].poster_path;
      toWrite += '<img class="moviePoster"';
      toWrite += 'src="' + posterURL + '">';

      toWrite += '<div class="moreInfo">';
      toWrite += '<div class="movieTitle">' + movies[i].original_title + '</div>';
      var overview
      if(movies[i].overview.length > 320){
        //trim the string to the maximum length
        overview = movies[i].overview.substr(0, 320);
        //re-trim if we are in the middle of a word and 
        overview = overview.substr(0, overview.lastIndexOf(".")+1) + ".."
      }
      else{
        overview = movies[i].overview;
      }
      toWrite += '<div class="synopsis">' + overview + '</div>';

      toWrite += '<input type="image" class="Button" src="assets/add.png"';
      toWrite += ' id="' + movies[i].id + '" value="false">';
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
      } else {
        console.log("Access Denied");
        alert("Please login to add this movie to your watchlist");
      }
      e.target.src = "assets/added.png";
      e.target.value = "true";
    });
  });
}


function searchPerson(person) {
  var personID;

  let url =
    "https://api.themoviedb.org/3/search/person?api_key=9aadfff8aa707747cec36dc03dfe8b0f&language=en-US&query=" + person + "&page=1&include_adult=false";
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
      loadMovies(movies);
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
        loadMovies(movies);
      }
    })
    .catch(function (err) {
      alert(err);
    });

}

document.addEventListener('DOMContentLoaded', getConfig);