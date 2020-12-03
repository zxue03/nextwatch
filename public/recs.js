function getConfig() {
    let url = "https://api.themoviedb.org/3/configuration?api_key=9aadfff8aa707747cec36dc03dfe8b0f";
    fetch(url)
        .then((result) => {
            return result.json();
        })
        .then((data) => {
            baseImageURL = data.images.base_url;
            configData = data.images;
            configData = data.images;
            console.log('config:', data);
            console.log('config fetched');
            runSearch('jaws')
        })
        .catch(function (err) {
            alert(err);
        });
}

function runSearch(keyword) {
    let url = "https://api.themoviedb.org/3/search/movie?api_key=9aadfff8aa707747cec36dc03dfe8b0f&query=" + keyword;
    fetch(url)
        .then(results => results.json())
        .then((data) => {
            console.log(data);
        })

    url = "https://api.themoviedb.org/3/trending/movie/week?api_key=9aadfff8aa707747cec36dc03dfe8b0f";
    fetch(url)
        .then(results => results.json())
        .then((data) => {
            console.log(data);
        })
}

document.addEventListener('DOMContentLoaded', getConfig);