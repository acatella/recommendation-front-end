const $ = require('jquery');
const logger = require('./starRating');
const Movie = require('./movie').default;
const pageState = {
    prevImdbKey : "",
    prevGenreKey : "",
    prevRatingKey : "",
    nextImdbKey : "",
    nextGenreKey : "",
    nextRatingKey : ""
};

const getRecommendations = (login, count) => {
    let recoEl = $("#recos");    
    let loadingText = "Loading recommendations";
    recoEl.html("<div class='col loading-text'>" + loadingText + "</div>");    
    let requestInfo = login + "?count=" + count;
    $.get("https://vlcu6ff1v8.execute-api.us-west-2.amazonaws.com/dev/recommendations/" + requestInfo, null, function(response, status) {
        console.log(status);        
    }).done(function(response) {
        console.log("response:", response);
        let recommendations = response.movies;
        let favoriteGenre = response["highestRatedGenre"];        
        recoEl.empty();
        if (recommendations.length > 0) {                    
            recommendations.forEach(function(el) {                                
                let movie = new Movie(el.title, el.posterUrl, parseInt(el.imdbRating));
                recoEl.append(movie.getElement());
            });
        } else {
            recoEl.html("<div class='col'>There was some trouble finding recommendations for you. Please try again.</div>");
        }    
    });
}

getRecommendations("aficlark", 10);

const setKeys = (data) => {

}

// star rating selection example... can use data atrribute value to set rating
// see jsbin here: https://jsbin.amazon.com/lasataluw/2/edit
$(".starRatings").on('click',"li", function(e) {
    const $li = $(e.currentTarget);
    const rating = $li.data("rating");
})