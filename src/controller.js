import view from "./view";

/*
constants for [] of current recos and reviews
 */

 /*
 methods for updating reco and review data
 */

 const Model = require("./model.js").default;
 const View = require("./view.js").default;
 const Movie = require("./movie.js").default;
 const Review = require("./review.js").default;
 const $ = require('jquery');

 const attachRecoPaginationClickHandler = (button) => {
    let el = $("#" + button.direction);    
    el.on('click', function(el) {
        if (button.direction.includes("next")) {            
            
        }
        else if (button.direction.includes("prev")) {
            recoPageNumber--;        
            getRecommendations(userLogin, recoCount, button.imdbKey, button.genreKey, button.ratingKey, false, true);        
        }        
        
    });
}

/**
 * Class that controls the operation of the page. 
 * Contains all functions needed for fetching, updating, and rendering data.
 * Data manipulation is handled by calling the provided Model class.
 * View updating is handled by calling the provided View class.
 */
 class Controller {
     constructor(model = new Model(), view = new View()) {
         this.model = model;
         this.view = view;
         this.getRecommendations = this.getRecommendations.bind(this);
         this.getRecommendationsSuccess = this.getRecommendationsSuccess.bind(this);
         this.getPrevRecommendationsSuccess = this.getPrevRecommendationsSuccess.bind(this);
         this.getNextRecommendations = this.getNextRecommendations.bind(this);
         this.getPrevRecommendations = this.getPrevRecommendations.bind(this);
         this.getReviewsSuccess = this.getReviewsSuccess.bind(this);
         this.getReviews = this.getReviews.bind(this);
         this.getPreviousReviewsSuccess = this.getPreviousReviewsSuccess.bind(this);
         this.getPreviousReviews = this.getPreviousReviews.bind(this);
         this.attachReviewHandlers = this.attachReviewHandlersToRecommendations.bind(this);
         this.addNewReview = this.addNewReview.bind(this);
         this.updateReview = this.updateReview.bind(this);
         this.getMoviesToReviewSuccess = this.getMoviesToReviewSuccess.bind(this);         
         this.getMoviesToReview = this.getMoviesToReview.bind(this);         
         this.refreshRecommendations = this.refreshRecommendations.bind(this);
         this.refreshRecommendationsSuccess = this.refreshRecommendationsSuccess.bind(this);
         this.removeReview = this.removeReview.bind(this);
     }

     getRecommendations() {         
        this.model.getRecommendations(this.getRecommendationsSuccess, this.getRecommendationsFail, this.view.renderRecommendationsLoading);
     }

     refreshRecommendations() {
         this.model.getRecommendations(this.refreshRecommendationsSuccess, this.getRecommendationsFail, this.view.renderRecommendationsLoading);
     }

     getNextRecommendations() {         
         this.model.getNextRecommendations(this.getRecommendationsSuccess, this.view.renderRecommendationsLoading);
     }

     getPrevRecommendations() {
         this.model.getPrevRecommendations(this.getPrevRecommendationsSuccess, this.view.renderRecommendationsLoading);
     }

     getReviews() {
         this.model.getNextReviews(this.getReviewsSuccess, this.view.renderReviewsLoading);
     }

     getPreviousReviews() {         
         this.model.getPreviousReviews(this.getPreviousReviewsSuccess, this.view.renderReviewsLoading);
     }

     getMoviesToReview(genre) {
         this.model.getMoviesToReview(genre, this.getMoviesToReviewSuccess, this.view.renderMoviesToReviewLoading);
     }

     refreshRecommendationsSuccess(response) {
        let recommendations = [];
        if (response.highestRatedGenre != undefined) {
            this.model.setFavoriteGenre(response.highestRatedGenre);
        }        
        for (let recommendation of response.movies) {
            let movie = new Movie(recommendation.title,
                    recommendation.posterUrl, parseInt(recommendation.imdbRating),
                    recommendation.imdbId, this.model.userLogin);
            recommendations.push(movie);
        }
        this.view.renderRecommendations(recommendations);        
        this.initializePage();
        this.attachReviewHandlersToRecommendations(this.model.reviewMovie, this.addNewReview);          
        this.model.incrementRecommendationPage(response, recommendations);        
        if (this.model.hasNextRecommendationPage()) {
            let nextButton = this.view.renderNextRecommendationsButton();
            this.attachPaginationHandler(nextButton, this.getNextRecommendations);
        }
        
        return recommendations;
     }

     getMoviesToReviewSuccess(response) {
        let moviesToReview = [];
        for (let movieToReview of response.movies) {
            let movie = new Movie(movieToReview.title, movieToReview.posterUrl, parseInt(movieToReview.imdbRating),
                            movieToReview.imdbId, this.model.userLogin);
            moviesToReview.push(movie);
        }
        this.view.renderMoviesToReview(moviesToReview);
        this.attachReviewHandlersToRecommendations(this.model.reviewMovie, this.addNewReview); 

        return moviesToReview;
     }

     getPrevRecommendationsSuccess(response) {
        let recommendations = [];
        for (let recommendation of response.movies) {
            let movie = new Movie(recommendation.title,
                    recommendation.posterUrl, parseInt(recommendation.imdbRating),
                    recommendation.imdbId, this.model.userLogin);
            recommendations.push(movie);
        }
        this.view.renderRecommendations(recommendations);
        this.attachReviewHandlersToRecommendations(this.model.reviewMovie, this.addNewReview);         
        this.model.decrementRecommendationPage(recommendations);
        if (this.model.hasNextRecommendationPage()) {
            let nextButton = this.view.renderNextRecommendationsButton();
            this.attachPaginationHandler(nextButton, this.getNextRecommendations);
        }

        if (this.model.hasPreviousRecommendationPage()) {
            let prevButton = this.view.renderPrevRecommendationsButton();
            this.attachPaginationHandler(prevButton, this.getPrevRecommendations);
        }

        return recommendations;
     }

     getRecommendationsSuccess(response) {        
        let recommendations = [];
        if (response.highestRatedGenre != undefined) {
            this.model.setFavoriteGenre(response.highestRatedGenre);
        }
        for (let recommendation of response.movies) {
            let movie = new Movie(recommendation.title,
                    recommendation.posterUrl, parseInt(recommendation.imdbRating),
                    recommendation.imdbId, this.model.userLogin);
            recommendations.push(movie);
        }
        this.view.renderRecommendations(recommendations);
        
        this.initializePage();
        this.attachReviewHandlersToRecommendations(this.model.reviewMovie, this.addNewReview);         
        this.model.incrementRecommendationPage(response, recommendations);        
        if (this.model.hasNextRecommendationPage()) {
            let nextButton = this.view.renderNextRecommendationsButton();
            this.attachPaginationHandler(nextButton, this.getNextRecommendations);
        }

        if (this.model.hasPreviousRecommendationPage()) {
            let prevButton = this.view.renderPrevRecommendationsButton();
            this.attachPaginationHandler(prevButton, this.getPrevRecommendations);
        }
        
        return recommendations;
     }

     getReviewsSuccess(response) {
         let reviews = [];
         for (let item of response.reviews) {
            let review = new Review(item.title, item.posterUrl,
                 parseInt(item.rating), item.imdbId, this.userLogin);
            reviews.push(review);
         }
         this.view.renderReviews(reviews);
         this.attachReviewHandlersToReviews(this.model.reviewMovie, this.updateReview);
         this.attachDeleteHandlers(this.model.deleteReview, this.removeReview);
         this.model.incrementReviewPage(response.lastEvaluatedRangeKey, reviews);         
         if (this.model.hasNextReviewPage()) {
             let nextButton = this.view.renderNextReviewsButton();
             this.attachPaginationHandler(nextButton, this.getReviews);
         }

         if (this.model.hasPreviousReviewPage()) {
             let prevButton = this.view.renderPreviousReviewsButton();
             this.attachPaginationHandler(prevButton, this.getPreviousReviews);
         }

         return reviews;
     }

     getPreviousReviewsSuccess(response) {
        let reviews = [];
        for (let item of response.reviews) {
           let review = new Review(item.title, item.posterUrl,
                parseInt(item.rating), item.imdbId, this.userLogin);
           reviews.push(review);
        }
        this.view.renderReviews(reviews);
        this.attachReviewHandlersToReviews(this.model.reviewMovie, this.updateReview);
        this.attachDeleteHandlers(this.model.deleteReview, this.removeReview);
        this.model.decrementReviewPage(reviews);         
        if (this.model.hasNextReviewPage()) {
            let nextButton = this.view.renderNextReviewsButton();
            this.attachPaginationHandler(nextButton, this.getReviews);
        }

        if (this.model.hasPreviousReviewPage()) {
            let prevButton = this.view.renderPreviousReviewsButton();
            this.attachPaginationHandler(prevButton, this.getPreviousReviews);
        }

        return reviews;
     }

    getRecommendationsFail(response) {
        console.log(response);
     }

     attachPaginationHandler(button, fn) {
        let el = $("#" + button.direction);
        el.on('click', function(el) {               
            fn();
        });
     }

     attachReviewHandlersToRecommendations(modelFn, viewFn) {
        let $submitButtons = $(".save-review"); 
        $submitButtons.off('click');
        $submitButtons.each(function(i, obj) {
            let button = $(this);
            let imdbId = button.data("imdbid");        
            let posterUrl = button.data("poster-url");
            let title = button.data("title");
            let $select = $("#" + imdbId + "-select");      
            
            button.on('click', function(el) {                        
                let $element = $("#movie-" + imdbId);                
                let rating = $select.find("option:selected").data("rating");
                let newReview = new Review(title, posterUrl, rating, imdbId, "aficlark");
                modelFn(imdbId, rating)                            
                viewFn(newReview);          
                $element.remove();      
            });
        });    
     }

     attachReviewHandlersToReviews(modelFn, viewFn) {
        let $submitButtons = $(".update-review"); 
        $submitButtons.off('click');
        $submitButtons.each(function(i, obj) {
            let button = $(this);
            let imdbId = button.data("imdbid");        
            let posterUrl = button.data("poster-url");
            let title = button.data("title");
            
            button.on('click', function(el) {                        
                let $element = $("#movie-" + imdbId);                
                let $select = $("#" + imdbId + "-select");      
                let rating = $select.find("option:selected").data("rating");
                let newReview = new Review(title, posterUrl, rating, imdbId, "aficlark");
                modelFn(imdbId, rating)                   
                viewFn(newReview);          
                $element.remove();      
            });
        });    
     }

     updateReview(review) {
        let currentReviews = this.model.getCurrentReviews();         
        currentReviews.forEach(function(existingReview, i) {
            if (existingReview.imdbId === review.imdbId) {
                currentReviews.splice(i, 1, review);                
            }
        });
        this.model.setCurrentReviews(currentReviews);
        this.view.renderReviews(currentReviews);
        this.attachReviewHandlersToReviews(this.model.reviewMovie, this.updateReview);
        this.attachReviewHandlersToRecommendations(this.model.reviewMovie, this.addNewReview);
        this.attachDeleteHandlers(this.model.deleteReview, this.removeReview);
        if (this.model.hasNextReviewPage()) {
            let nextButton = this.view.renderNextReviewsButton();
            this.attachPaginationHandler(nextButton, this.getReviews);
        }

        if (this.model.hasPreviousReviewPage()) {
            let prevButton = this.view.renderPreviousReviewsButton();
            this.attachPaginationHandler(prevButton, this.getPreviousReviews);
        }
     }

     removeReview(imdbId) {
         let currentReviews = this.model.getCurrentReviews();
         currentReviews.forEach(function(existingReview, i) {
            if (existingReview.imdbId === imdbId) {
                currentReviews.splice(i, 1);                
            }
        });
        this.model.setCurrentReviews(currentReviews);
        this.view.renderReviews(currentReviews);
        this.attachReviewHandlersToReviews(this.model.reviewMovie, this.updateReview);
        this.attachReviewHandlersToRecommendations(this.model.reviewMovie, this.addNewReview);
        this.attachDeleteHandlers(this.model.deleteReview, this.removeReview);
        if (this.model.hasNextReviewPage()) {
            let nextButton = this.view.renderNextReviewsButton();
            this.attachPaginationHandler(nextButton, this.getReviews);
        }

        if (this.model.hasPreviousReviewPage()) {
            let prevButton = this.view.renderPreviousReviewsButton();
            this.attachPaginationHandler(prevButton, this.getPreviousReviews);
        }
     }

     addNewReview(review) {         
         let currentReviews = this.model.getCurrentReviews();         
         currentReviews.unshift(review);
         this.model.setCurrentReviews(currentReviews);
         this.view.renderReviews(currentReviews);
         this.attachReviewHandlersToRecommendations(this.model.reviewMovie, this.addNewReview);
         this.attachReviewHandlersToReviews(this.model.reviewMovie, this.updateReview);
         this.attachDeleteHandlers(this.model.deleteReview, this.removeReview);
         if (this.model.hasNextReviewPage()) {
            let nextButton = this.view.renderNextReviewsButton();
            this.attachPaginationHandler(nextButton, this.getReviews);
        }

        if (this.model.hasPreviousReviewPage()) {
            let prevButton = this.view.renderPreviousReviewsButton();
            this.attachPaginationHandler(prevButton, this.getPreviousReviews);
        }
     }

     attachDeleteHandlers(modelFn, viewFn) {
        let $deleteButtons = $(".delete-review");
        $deleteButtons.off('click');
        $deleteButtons.each(function(i, obj) {
            let button = $(this);
            let imdbId = button.data("imdbid");
            button.on('click', function(el) {
                modelFn(imdbId);
                viewFn(imdbId);
            });
        });
     }

     attachGetMoviesHandler(modelFn) {
         let $submitButton = $("#searchGenre");         
         $submitButton.off('click');
         $submitButton.on('click', function(el) {
            let $select = $("#selectGenre");
            let genre = $select.find("option:selected").data("genre");            
            modelFn(genre);
         });
     }

     attachRefreshHandler(modelFn) {
        let $refreshButton = $("#refreshRecommendations");
        $refreshButton.off('click');
        $refreshButton.on('click', function(el) {
            modelFn();
        });
     }

     initializePage() {
         let genres = this.model.getGenreOptions();
         this.view.renderMovieOptions(genres);
         this.view.renderFavoriteGenreInfo(this.model.getFavoriteGenre());
         this.attachGetMoviesHandler(this.getMoviesToReview);
         this.attachRefreshHandler(this.refreshRecommendations);
     }
     
 }

 export default Controller;