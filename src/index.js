const $ = require('jquery');
const logger = require('./starRating');
const Movie = require('./movie').default;
const PaginationButton = require('./paginationButton').default;
const lastEvaluatedImdbParam = "&lastEvaluatedImdbId=";
const lastEvaluatedGenreParam = "&lastEvaluatedGenre=";
const lastEvaluatedRatingParam = "&lastEvaluatedRating=";
const userLogin = "aficlark";
const recoCount = 10;
let recoPageNumber = 0;

const recommendationState = {
    pageKeys : [
        {
            startingImdbId : "",
            startingGenre : "",
            startingRating : ""
        }
    ]
};

const getRecommendations = (login, count, imdbKey, genreKey, ratingKey, isNextPage) => {
    let recoEl = $("#recos");    
    let loadingText = "Loading recommendations";
    recoEl.html("<div class='col loading-text'>" + loadingText + "</div>");    
    let requestInfo = login + "?count=" + count;    
    if (imdbKey && genreKey && ratingKey) {
        requestInfo = attachKeysToRequest(requestInfo, imdbKey, genreKey, ratingKey);
    }
    console.log(recoPageNumber);
    $.get("https://vlcu6ff1v8.execute-api.us-west-2.amazonaws.com/dev/recommendations/" + requestInfo, null, function(response, status) {
        console.log(status);        
    }).done(function(response) {
        let recommendations = response.movies;
        let favoriteGenre = response.highestRatedGenre;        
        recoEl.empty();
        if (recommendations.length > 0) {                                          
            console.log("keys:", recommendationState);
            if (isNextPage) {
                addKeys(response);
            }
            else {
                removeKeys();
            }
            recommendations.forEach(function(el) {                                
                let movie = new Movie(el.title, el.posterUrl, parseInt(el.imdbRating));
                recoEl.append(movie.getElement());
                
            });
            if (hasNextPage()) {
                let keys = recommendationState.pageKeys[recoPageNumber + 1];
                let nextButton = new PaginationButton(keys.startingImdbId, keys.startingGenre, keys.startingRating, "next-reco");
                recoEl.append(nextButton.getElement());
                attachPaginationClickHandler(nextButton, response);
            }

            if (hasPrevPage()) {
                let keys = recommendationState.pageKeys[recoPageNumber - 1];
                let prevButton = new PaginationButton(keys.startingImdbId, keys.startingGenre, keys.startingRating, "prev-reco");
                recoEl.prepend(prevButton.getElement());
                attachPaginationClickHandler(prevButton);
            }
        } else {
            recoEl.html("<div class='col'>No more recommendations.</div>");
            if (hasPrevPage()) {
                let keys = recommendationState.pageKeys[recoPageNumber - 1];
                let prevButton = new PaginationButton(keys.startingImdbId, keys.startingGenre, keys.startingRating, "prev-reco");
                recoEl.prepend(prevButton.getElement());
                attachPaginationClickHandler(prevButton);
            }
        }    
    });
}

getRecommendations(userLogin, recoCount, "", "", "", true);

const attachKeysToRequest = (requestString, imdbKey, genreKey, ratingKey) => {
    requestString += lastEvaluatedImdbParam + imdbKey;
    requestString += lastEvaluatedGenreParam + genreKey;
    requestString += lastEvaluatedRatingParam + ratingKey;
    
    return requestString;
}

const attachPaginationClickHandler = (button, data) => {
    let el = $("#" + button.direction);
    console.log(button)
    el.on('click', function(el) {
        if (button.direction.includes("next")) {
            recoPageNumber++;            
            getRecommendations(userLogin, recoCount, button.imdbKey, button.genreKey, button.ratingKey, true);        
        }
        else if (button.direction.includes("prev")) {
            recoPageNumber--;        
            getRecommendations(userLogin, recoCount, button.imdbKey, button.genreKey, button.ratingKey, false);        
        }        
        
    });
}

const hasPrevPage = () => {
    if (recoPageNumber > 0) {
        return true;
    }

    return false;
}

const hasNextPage = () => {
    if (recommendationState.pageKeys[recoPageNumber + 1] !== void 0) {
        return true;
    }

    return false;
}

const addKeys = (data) => {
    recommendationState.pageKeys.push(
        {
            startingImdbId : data.lastEvaluatedHashKey,
            startingGenre : data.lastEvaluatedGenre,
            startingRating : data.lastEvaluatedRating
        }
    )
}

const removeKeys = () => {
    recommendationState.pageKeys.pop();
}

// star rating selection example... can use data atrribute value to set rating
// see jsbin here: https://jsbin.amazon.com/lasataluw/2/edit
$(".starRatings").on('click',"li", function(e) {
    const $li = $(e.currentTarget);
    const rating = $li.data("rating");
})