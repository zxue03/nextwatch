
const watchListDiv = document.getElementById("watchListDiv");
const logoutButton = document.getElementById("logout");
const token = window.localStorage.getItem("movieAppToken");
var watchListId = []
var baseImageURL, posterSize;
var movieId = []
var movies = []

const getWatchListId = async () => {
    const rawRes = await fetch("/api/user/watchList", {
        headers: {
        "authorization": `Bearer ${token}`,
        },
    });
    if (rawRes.status == 200) {
        const res = await rawRes.json();
        watchListId = res.watchList;
        // loadWatchlist(res.watchList);
    } else {
        watchListDiv.innerHTML = "Access Denied. Please log in first...";
        setTimeout(function () {
        window.location.href = "/login.html";
        }, 3000);
    }
};

const getConfig = () => {
    let url = "https://api.themoviedb.org/3/configuration?api_key=9aadfff8aa707747cec36dc03dfe8b0f";
    fetch(url)
      .then((result) => {
        return result.json();
      })
      .then((data) => {
        baseImageURL = data.images.secure_base_url;
        posterSize = data.images.poster_sizes[2];
        console.log('fetched config:', data);
      })
      .catch(function (err) {
        alert(err);
      });
  }

const getWatchListMovie = async () => {

    for(i = 0; i< watchListId.length; i++){
        const rawRes = await fetch("https://api.themoviedb.org/3/movie/" + watchListId[i] + "?api_key=9aadfff8aa707747cec36dc03dfe8b0f&language=en-US");
        if (rawRes.status == 200) {
            const res = await rawRes.json();
            movies.push(res);
            console.log(movies)
            console.log(res);
        }
    }
}


logoutButton.addEventListener("click", () => {
    window.localStorage.removeItem("movieAppToken");
    watchListDiv.classList.remove("movieDisplay");
    watchListDiv.style.color = "white"
    watchListDiv.innerHTML = "Logging you out...";
    setTimeout(function () {
        window.location.href = "/login.html";
    }, 2500);
});

// TRYING TO LOAD WATCHLIST POSTERS HERE
function loadWatchlist(heading) {
    console.log(movies)
    console.log(movies.length)
    document.getElementById('displayHeading').innerHTML = "<h2>" + heading + "</h2>";

    var watchListContent = ""
    var toWrite = "",
        divName;
    // retrieve and store baseImageURL and poster size here
    // can hard code or get from config or some other way?
    for (i = 0; i < movies.length; i++) {
        divName = "watch" + i;
        posterURL = baseImageURL + posterSize + movies[i].poster_path;
        toWrite = '<div class = "movieBlock" id="' + divName + '">';
        // need to fetch the movies[i]
        
        toWrite += '<img class="moviePoster"';
        toWrite += 'src="' + posterURL + '">';

        toWrite += '<div class="moreInfo">';
        toWrite += '<div class="movieTitle">' + movies[i].original_title;
        date = movies[i].release_date;
        console.log(date);
        toWrite += ' (' + date.substring(0,4) + ')</div>';
        toWrite += '<div class="synopsis">' + movies[i].overview + '</div>';
  
        toWrite += '<input type="image" class="Button" src="assets/remove.png"';
        toWrite += ' id="' + movies[i].id + '" value="false">';
        toWrite += '</div>';
        toWrite += "</div>";

        watchListContent += toWrite;
        toWrite = "";
    }
    watchListDiv.innerHTML = watchListContent
    $(".movieBlock").hover(
        function () {
          $(this).addClass("interested");
        },
        function () {
          $(this).removeClass("interested");
        }
      );
      document.querySelectorAll('.Button').forEach(item => {
        item.addEventListener('click', async (e) => {

          e.preventDefault();
          const url = "/api/user/deleteMovie";
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
            e.target.parentElement.parentElement.remove()
          } else {
            console.log("Access Denied");
            setTimeout(function () {
              window.location.href = "/login.html";
            }, 3000);
          }
          
        });
      });
}



const main = async () => {
    getConfig();
    await getWatchListId();
    await getWatchListMovie();
    loadWatchlist("Your Watchlist");
}

document.addEventListener('DOMContentLoaded', main);


