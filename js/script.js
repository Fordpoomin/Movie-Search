let page = 1;
let total = 0;
let maxPage = 0;

$(document).ready(() => {
  const search = window.sessionStorage.getItem("searchQuery");
  const sessionPage = window.sessionStorage.getItem("page");
  if (search) {
    $("#searchInput").val(search);
    page = parseInt(sessionPage);
    getMovies(search);
  } else {
    document.getElementById("back").disabled = true;
  }

  $("#searchForm").on("submit", (e) => {
    page = 1;
    let searchQuery = $("#searchInput").val();
    getMovies(searchQuery);
    e.preventDefault();
  });
});



document.getElementById("next").addEventListener("click", () => {
  nextPage();
  if (page === maxPage) {
    document.getElementById("next").disabled = true;
    return;
  }
  document.getElementById("next").disabled = false;
  document.getElementById("back").disabled = false;
  document.getElementById("number").innerHTML = `${page}/${maxPage}`;
});

document.getElementById("back").addEventListener("click", () => {
  previosPage();
  if (page === 1) {
    document.getElementById("back").disabled = true;
    return;
  }
  document.getElementById("back").disabled = false;
  document.getElementById("next").disabled = false;
  document.getElementById("number").innerHTML = `${page}/${maxPage}`;
});

function nextPage() {
  if (page === maxPage) {
    alert("You have reached the end of the search results");
    return;
  }
  page += 1;
  let searchQuery = $("#searchInput").val();
  getMovies(searchQuery);
}

function previosPage() {
  if (page === 1) {
    alert("You are on the first page");
  }
  page -= 1;
  let searchQuery = $("#searchInput").val();
  getMovies(searchQuery);
}

function getMovies(searchQuery) {
  // axios.get('http://www.omdbapi.com?s='+searchQuery+'&page='+page+'&apikey=adb3d41e')
  window.sessionStorage.setItem("searchQuery", searchQuery);
  window.sessionStorage.setItem("page", page);
  axios
    .get(
      "http://www.omdbapi.com?s=" +
      searchQuery +
      "&apikey=adb3d41e" +
      "&page=" +
      page
    )
    .then((response) => {
      if (response.data.Error) {
        alert(response.data.Error);
        return;
      }
      // console.log(response);
      let movies = response.data.Search;
      total = response.data.totalResults;
      maxPage = Math.ceil(total / 10);
      document.getElementById("number").innerHTML = `${page}/${maxPage}`;
      // console.log(movies);
      let output = "";
      $.each(movies, (index, movie) => {
        output += `
          <div class="col-md-3 movie-card">
            <div class="well text-center">
            <a onclick="movieSelected('${movie.imdbID}')" href="#"><img src="${movie.Poster}"></a>
              <h5>${movie.Title}</h5>
              <a onclick="movieSelected('${movie.imdbID}')" class="btn btn-primary" href="#">Movie Details</a>
            </div>
          </div>
        `;
      });

      $("#movies").html(output);
    })
    .catch((err) => {
      console.log(err);
    });
}

function movieSelected(id) {
  sessionStorage.setItem("movieId", id);
  window.location = "movie.html";
  return false;
}

function getMovie() {
  let movieId = sessionStorage.getItem("movieId");
  // console.log(movieId)

  axios
    .get("http://www.omdbapi.com?i=" + movieId + "&apikey=adb3d41e")
    .then((response) => {
      // console.log(response);
      let movie = response.data;

      let output = `
        <div class="row">
          <div class="col-md-4">
            <img src="${movie.Poster}" class="thumbnail" >
          </div>
          <div class="col-md-8">
            <h2>${movie.Title}</h2> 
            <ul class="list-group">
              <li class="list-group-item"><b>Genre: </b>${movie.Genre}</li>
              <li class="list-group-item"><b>Released: </b>${movie.Released}</li>
              <li class="list-group-item"><b>Rated: </b>${movie.Rated}</li>
              <li class="list-group-item"><b>IMDB Rating: </b>${movie.imdbRating}</li>
              <li class="list-group-item"><b>Director: </b>${movie.Director}</li>
              <li class="list-group-item"><b>Actors: </b>${movie.Actors}</li>
            </ul>
          </div>
        </div>
        <div class="row">
          <div class="well">
            <h3>Plot</h3>
            ${movie.Plot}
            <hr>
            <a href="http://imdb.com/title/${movie.imdbID}" target="_blank" class="btn btn-primary">View IMDB</a>
            <a href="index.html" class="btn btn-light">Go Back to Search</a>
          </div>
        </div>
      `;

      $("#movie").html(output);
    })
    .catch((err) => {
      console.log(err);
    });
}
