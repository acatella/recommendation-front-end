const $ = require('jquery');
const logger = require('./starRating');
const Movie = require('./movie').default;
const Review = require('./review').default;
const PaginationButton = require('./paginationButton').default;
const ReviewPaginationButton = require('./reviewPaginationButton').default;
const lastEvaluatedImdbParam = "&lastEvaluatedImdbId=";
const lastEvaluatedGenreParam = "&lastEvaluatedGenre=";
const lastEvaluatedRatingParam = "&lastEvaluatedRating=";
const userLogin = "aficlark";
const recoCount = 10;
const reviewCount = 25;
let recoPageNumber = 0;
let reviewPageNumber = 0;

const recommendationState = {
    pageKeys : [
        {
            startingImdbId : "",
            startingGenre : "",
            startingRating : ""
        }
    ]
};

const reviewState = {
    pageKeys : [
        {
            startingImdbId : ""
        }
    ]
}

const getRecommendations = (login, count, imdbKey, genreKey, ratingKey, isNextPage, isPrevPage) => {
    let recoEl = $("#recos");    
    let loadingText = "Loading recommendations";
    recoEl.html("<div class='col loading-text'>" + loadingText + "</div>");    
    let requestInfo = login + "?count=" + count;    
    if (imdbKey !== "" && genreKey !== "" && ratingKey !== "") {
        requestInfo = attachKeysToRequest(requestInfo, imdbKey, genreKey, ratingKey);
    }
    console.log(requestInfo);
    $.get("https://vlcu6ff1v8.execute-api.us-west-2.amazonaws.com/dev/recommendations/" + requestInfo, null, function(response, status) {
        //console.log(status);        
    }).done(function(response) {
        let recommendations = response.movies;
        let favoriteGenre = response.highestRatedGenre;        
        recoEl.empty();
        if (recommendations.length > 0) {                                                      
            if (isNextPage) {
                addKeys(response);
            }
            else if(isPrevPage) {
                removeKeys();
            }
            //console.log(recommendationState.pageKeys);
            recommendations.forEach(function(el) {                                
                let movie = new Movie(el.title, el.posterUrl, parseInt(el.imdbRating), el.imdbId, userLogin);
                recoEl.append(movie.getElement());                
                
            });
            attachReviewHandler();
            if (hasNextPage()) {
                let keys = recommendationState.pageKeys[recoPageNumber + 1];
                let nextButton = new PaginationButton(keys.startingImdbId, keys.startingGenre, keys.startingRating, "next-reco");
                recoEl.append(nextButton.getElement());
                attachRecoPaginationClickHandler(nextButton, response);
            }

            if (hasPrevPage()) {
                let keys = recommendationState.pageKeys[recoPageNumber - 1];
                let prevButton = new PaginationButton(keys.startingImdbId, keys.startingGenre, keys.startingRating, "prev-reco");
                recoEl.prepend(prevButton.getElement());
                attachRecoPaginationClickHandler(prevButton);
            }
        } else {
            recoEl.html("<div class='col'>No Recommendations. Try making some reviews!</div>");
            if (hasPrevPage()) {
                let keys = recommendationState.pageKeys[recoPageNumber - 1];
                let prevButton = new PaginationButton(keys.startingImdbId, keys.startingGenre, keys.startingRating, "prev-reco");
                recoEl.prepend(prevButton.getElement());
                attachRecoPaginationClickHandler(prevButton);
            }
        }    
    });
}

const attachKeysToRequest = (requestString, imdbKey, genreKey, ratingKey) => {
    requestString += lastEvaluatedImdbParam + imdbKey;
    requestString += lastEvaluatedGenreParam + genreKey;
    requestString += lastEvaluatedRatingParam + ratingKey;
    
    return requestString;
}

const attachRecoPaginationClickHandler = (button, data) => {
    let el = $("#" + button.direction);    
    el.on('click', function(el) {
        if (button.direction.includes("next")) {
            recoPageNumber++;            
            getRecommendations(userLogin, recoCount, button.imdbKey, button.genreKey, button.ratingKey, true, false);        
        }
        else if (button.direction.includes("prev")) {
            recoPageNumber--;        
            getRecommendations(userLogin, recoCount, button.imdbKey, button.genreKey, button.ratingKey, false, true);        
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

const hasNextReviewPage = (reviews) => {
    if (reviews.length === reviewCount && reviewState.pageKeys[recoPageNumber + 1] !== void 0) {
        return true;
    }

    return false;
}

const hasPrevReviewPage = () => {
    if (reviewPageNumber > 0) {
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

const attachReviewHandler = () => {
    let $submitButtons = $(".save-review"); 
    $submitButtons.each(function(i, obj) {
        let button = $(this);
        let imdbId = button.data("imdbid");        
        let $select = $("#" + imdbId + "-select");        
        
        button.on('click', function(el) {
            let rating = $select.find("option:selected").data("rating");
            reviewMovie(imdbId, rating, button, $select);
        });
    });    
}

const reviewMovie = (imdbId, rating, buttonEl, selectorEl) => {
    buttonEl.hide();
    selectorEl.hide();
    console.log(rating);
    $.ajax({        
        data: '{"rating":' + rating + '}',
        dataType: 'json',
        contentType: 'application/json',
        processData: false,
        method: 'PUT',
        url: 'https://vlcu6ff1v8.execute-api.us-west-2.amazonaws.com/dev/review/' + userLogin + "/" + imdbId,
    }).done(function(response) {
        console.log(response);
        recommendationState.pageKeys.length = 1;
        reviewState.pageKeys.length = 1;
        recoPageNumber = 0;
        reviewPageNumber = 0;
        getRecommendations(userLogin, recoCount, 
            "",
            "",
            "",
            true,
            false
        );
        getReviews(userLogin, reviewCount, "", true, false);
    }).fail(function(response) {
        console.log("fail", response);
    });
}

const attachDeleteHandler = () => {
    let $deleteButtons = $(".delete-review");
    $deleteButtons.each(function(i, obj) {
        let button = $(this);
        let imdbId = button.data("imdbid");
        button.on('click', function(el) {
            deleteReview(imdbId);
        });
    });
}

const deleteReview = (imdbId) => {
    let $reviewEl = $("#review-" + imdbId);
    $reviewEl.hide();
    $.ajax({              
        dataType: "text",
        method: 'DELETE',
        url: 'https://vlcu6ff1v8.execute-api.us-west-2.amazonaws.com/dev/review/' + userLogin + "/" + imdbId,
    }).done(function(response) {
        console.log("success",response);
        recommendationState.pageKeys.length = 1;
        reviewState.pageKeys.length = 1;
        recoPageNumber = 0;
        reviewPageNumber = 0;
        getRecommendations(userLogin, recoCount, 
            "",
            "",
            "",
            true,
            false
        );
        getReviews(userLogin, reviewCount, "", true, false);
    }).fail(function(response) {
        console.log("fail", response);
    })

}

const getReviews = (login, count, imdbKey, isNextPage, isPrevPage) => {
    let reviewEl = $("#reviews");
    let loadingText = "Loading reviews";
    reviewEl.html("<div class='col loading-text'>" + loadingText + "</div>");
    let requestInfo = login + "?count=" + count;   
    if (imdbKey !== "") {
        requestInfo += "&lastEvaluatedImdbId=" + imdbKey;
    }
    $.get("https://vlcu6ff1v8.execute-api.us-west-2.amazonaws.com/dev/reviews/" + requestInfo, null, function(response, status) {
        let reviews = response.reviews;
        reviewEl.empty();
        if (reviews.length > 0) {
            if (isNextPage) {
                reviewState.pageKeys.push({startingImdbId : response.lastEvaluatedRangeKey});
            }
            else if (isPrevPage) {
                reviewState.pageKeys.pop();
            }
            console.log(reviewState.pageKeys);
            reviews.forEach(function(el) {
                let review = new Review(el.title, el.posterUrl, parseInt(el.rating), el.imdbId, userLogin);
                reviewEl.append(review.getElement());
            });
            attachReviewHandler();
            attachDeleteHandler();
            if (hasNextReviewPage(reviews)) {
                let key = reviewState.pageKeys[reviewPageNumber + 1];
                let nextButton = new ReviewPaginationButton(key.startingImdbId, "next-review");
                reviewEl.append(nextButton.getElement());
                attachReviewPaginationClickHandler(nextButton, response);
            }

            if(hasPrevReviewPage()) {
                let key = reviewState.pageKeys[reviewPageNumber - 1];
                let prevButton = new ReviewPaginationButton(key.startingImdbId, "prev-review");
                reviewEl.prepend(prevButton.getElement());
                attachReviewPaginationClickHandler(prevButton, response);
            }
        } else {
            reviewEl.html("<div class='col'>No Reviews. Make some!</div>");
            if(hasPrevReviewPage()) {
                let key = reviewState.pageKeys[reviewPageNumber - 1];
                let prevButton = new ReviewPaginationButton(key.startingImdbId, "prev-review");
                recoEl.prepend(prevButton.getElement());
                attachReviewPaginationClickHandler(prevButton, response);
            }
        }
    });
}

const attachReviewPaginationClickHandler = (button, data) => {
    let el = $("#" + button.direction);    
    el.on('click', function(el) {
        if (button.direction.includes("next")) {
            reviewPageNumber++;            
            getReviews(userLogin, reviewCount, button.imdbKey, true, false);
        }
        else if (button.direction.includes("prev")) {
            reviewPageNumber--;        
            getReviews(userLogin, reviewCount, button.imdbKey, false, true);
        }                
    });
}

getRecommendations(userLogin, recoCount, "", "", "", true, false);
getReviews(userLogin, reviewCount, "", true, false);