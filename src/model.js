const Movie = require('./movie').default;
const Review = require('./review').default;
const $ = require('jquery');

const lastEvaluatedImdbParam = "&lastEvaluatedImdbId=";
const lastEvaluatedGenreParam = "&lastEvaluatedGenre=";
const lastEvaluatedRatingParam = "&lastEvaluatedRating=";
const recommendationsApiUrl = "https://vlcu6ff1v8.execute-api.us-west-2.amazonaws.com/dev/recommendations/";
const reviewsApiUrl = "https://vlcu6ff1v8.execute-api.us-west-2.amazonaws.com/dev/reviews/";
const reviewApiUrl = "https://vlcu6ff1v8.execute-api.us-west-2.amazonaws.com/dev/review/";
const moviesApiUrl = "https://vlcu6ff1v8.execute-api.us-west-2.amazonaws.com/dev/movies/";
const defaultUserLogin = "aficlark";
const defaultRecommendationCount = 10;
const defaultReviewCount = 15;
const defaultMoviesToReviewCount = 32;

const recommendationState = {
    favoriteGenre: "",
    pageKeys : [
        {
            startingImdbId : "",
            startingGenre : "",
            startingRating : ""
        }
    ],
    nextPageNumber : 0, 
    recommendations : []
};

const reviewState = {
    pageKeys : [
        {
            startingImdbId : ""
        }
    ],
    nextPageNumber : 0,
    reviews: []
}

const moviesToReviewState = {
    pageKeys : [
        {
            startingImdbId : "",
            startingGenre : "",
            startingRating : ""
        }
    ],
    nextPageNumber : 0, 
    movies : [],
    genres: ["Comedy", "Action", "Adventure", "Sci-Fi", "Thriller", "Drama", "Romance", "Mystery", "Horror"]

}

const attachKeysToRecommendationRequest = (requestString, keys) => {
    requestString += lastEvaluatedImdbParam + keys.startingImdbId;
    requestString += lastEvaluatedGenreParam + keys.startingGenre;
    requestString += lastEvaluatedRatingParam + keys.startingRating;
    
    return requestString;
}

class Model {
    constructor(userLogin = defaultUserLogin) {
        this.userLogin = userLogin;
        this.getNextRecommendations = this.getNextRecommendations.bind(this);
    }

    getRecommendations(successFn, failFn, loadingFn) {
        let requestInfo = this.userLogin + "?count=" + defaultRecommendationCount;
        
        $.get(recommendationsApiUrl + requestInfo, null, function(response, status) {            
            
        }).done(function(response){            
            successFn(response);                                                    
        });
        loadingFn();
    }

    getNextRecommendations(successFn, loadingFn) {
        let requestInfo = this.userLogin + "?count=" + defaultRecommendationCount;
        let keys = recommendationState.pageKeys[recommendationState.nextPageNumber];
        requestInfo = attachKeysToRecommendationRequest(requestInfo, keys);
        $.get(moviesApiUrl + recommendationState.favoriteGenre + "/" + requestInfo, null, function(response, status) {            
            
        }).done(function(response) {
            let currentRecommendations = successFn(response);            
            recommendationState.recommendations = currentRecommendations;                
        });
        loadingFn();
    }    

    getPrevRecommendations(successFn, loadingFn) {
        let requestInfo = this.userLogin + "?count=" + defaultRecommendationCount;
        let keys = recommendationState.pageKeys[recommendationState.nextPageNumber - 2];
        requestInfo = recommendationState.nextPageNumber > 2 ? attachKeysToRecommendationRequest(requestInfo, keys)
                        : requestInfo;        
        $.get(moviesApiUrl + recommendationState.favoriteGenre + "/" + requestInfo, null, function(response, status) {
            
        }).done(function(response) {
            let currentRecommendations = successFn(response);            
            recommendationState.recommendations = currentRecommendations;                
        });
        loadingFn();
    }

    getMoviesToReview(genre, successFn, loadingFn) {
        moviesToReviewState.movies.length = 1;
        let requestInfo = genre + "/" + defaultUserLogin + "?count=" + defaultMoviesToReviewCount;
        $.get(moviesApiUrl + requestInfo, null, function(response, status) {

        }).done(function(response) {
            let currentMoviesToReview = successFn(response);
            moviesToReviewState.movies = currentMoviesToReview;            
        });
        loadingFn();
    }

    getNextReviews(successFn, loadingFn) {
        let requestInfo = this.userLogin + "?count=" + defaultReviewCount;
        let imdbKey = reviewState.pageKeys[reviewState.nextPageNumber].startingImdbId;
        if (imdbKey !== "") {
            requestInfo += "&lastEvaluatedImdbId=" + imdbKey;
        }        
        $.get(reviewsApiUrl + requestInfo, null, function(response, status) {
            
        }).done(function(response) {
            console.log("response is:", response);
            let currentReviews = successFn(response);
            console.log("returned reviews:", currentReviews);
            reviewState.reviews = currentReviews;
            console.log(reviewState);
        });        
        loadingFn();        
    }

    getPreviousReviews(successFn, loadingFn) {
         let requestInfo = this.userLogin + "?count=" + defaultReviewCount;
        let imdbKey = reviewState.pageKeys[reviewState.nextPageNumber - 2].startingImdbId;
        if (imdbKey !== "") {
            requestInfo += "&lastEvaluatedImdbId=" + imdbKey;
        }
        console.log(requestInfo);
        $.get(reviewsApiUrl + requestInfo, null, function(response, status) {
            
        }).done(function(response) {            
            let currentReviews = successFn(response);            
            reviewState.reviews = currentReviews;            
        });
        loadingFn();
    }

    deleteReview(imdbId) {
        let result = false;
        $.ajax({
            dataType: "text",
            method: "Delete",
            url: reviewApiUrl + defaultUserLogin + "/" + imdbId,
        }).done(function() {
            result = true;
            reviewState.reviews.forEach(function(review, i) {
                if (review.imdbId === imdbId) {
                    reviewState.reviews.splice(i, 1);
                }
            });
        });

        return result;
    }

    getCurrentReviews() {
        return reviewState.reviews;
    }

    setCurrentReviews(newReviews) {
        reviewState.reviews = newReviews;
    }

    getFavoriteGenre() {
        return recommendationState.favoriteGenre;
    }

    setFavoriteGenre(genre) {
        recommendationState.favoriteGenre = genre;
    }

    reviewMovie(imdbId, rating) {        
        $.ajax({        
            data: '{"rating":' + rating + '}',
            dataType: 'json',
            contentType: 'application/json',
            processData: false,
            method: 'PUT',
            url: reviewApiUrl + defaultUserLogin + "/" + imdbId,
        }).done(function(response) {            
            return true;
        }).fail(function(response) {
            return false;
        });
    }

    resetRecommendationPage() {
        recommendationState.pageKeys.length = 1;
    }

    incrementRecommendationPage(data, currentRecommendations) {
        recommendationState.pageKeys.push(
            {
                startingImdbId : data.lastEvaluatedHashKey,
                startingGenre : data.lastEvaluatedGenre,
                startingRating : data.lastEvaluatedRating
            }
        )
        recommendationState.nextPageNumber++;
        recommendationState.recommendations = currentRecommendations;   
    }

    decrementRecommendationPage(currentRecommendations) {
        recommendationState.pageKeys.pop();
        recommendationState.nextPageNumber--;
        recommendationState.recommendations = currentRecommendations;
    }

    incrementReviewPage(imdbKey, currentReviews) {
        reviewState.pageKeys.push({startingImdbId : imdbKey});
        reviewState.nextPageNumber++;
        reviewState.reviews = currentReviews;
    }    

    decrementReviewPage(currentReviews) {
        reviewState.pageKeys.pop();
        reviewState.nextPageNumber--;
        reviewState.reviews = currentReviews;
    }

    hasNextRecommendationPage() {
        if (recommendationState.recommendations.length >= defaultRecommendationCount && 
            recommendationState.pageKeys[recommendationState.nextPageNumber] !== void 0) {
            return true;
        }
    
        return false;
    }

    hasPreviousRecommendationPage() {
        if (recommendationState.nextPageNumber > 1) {
            return true;
        }

        return false;
    }

    getNextRecommendationsKeys() {
        return recommendationState.pageKeys[recommendationState.nextPageNumber];
    }

    hasNextReviewPage() {
        if (reviewState.reviews.length >= defaultReviewCount && reviewState.pageKeys[reviewState.nextPageNumber] !== null) {
            return true;
        }
    
        return false;
    }

    hasPreviousReviewPage() {
        if (reviewState.nextPageNumber > 1) {
            return true;
        }
    
        return false;
    }

    getGenreOptions() {
        console.log(recommendationState.favoriteGenre);
        console.log(moviesToReviewState.genres);
        let filteredGenres = moviesToReviewState.genres.filter(genre => genre != recommendationState.favoriteGenre);
        console.log("filtered:", filteredGenres);

        return filteredGenres;
    }
}

export default Model;