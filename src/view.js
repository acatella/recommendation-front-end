const $ = require('jquery');
const RecommendationPaginationButton = require('./paginationButton').default;
const ReviewPaginationButton = require('./reviewPaginationButton').default;

/**
 * Handles rendering the state of the application.
 */
class View {
    constructor() {}
    
    renderFavoriteGenreInfo(favoriteGenre) {
        let $favoriteGenreHeading = $("#favoriteGenre");
        let text = "Since '" + favoriteGenre + "' is your highest rated genre right now, check out these movies. You can scroll to see more.";
        $favoriteGenreHeading.text(text);        
    }

    renderRecommendations(recommendations = []) {                
        let $recommendationContainer = $("#recos");
        $recommendationContainer.empty();
        for (let recommendation of recommendations) {
            $recommendationContainer.append(recommendation.getElement());
        }
    }

    renderRecommendationsLoading() {        
        let $recommendationContainer = $("#recos");
        $recommendationContainer.empty();
        $recommendationContainer.append($("<div class='loading'>Loading</div>"));
    }

    renderMoviesToReviewLoading() {
        let $container = $("#movies");
        $container.empty();
        $container.append($("<div class='loading'>Loading Movies</div>"));
    }

    renderReviewsLoading() {
        let $reviewContainer = $("#reviews");
        $reviewContainer.empty();
        $reviewContainer.append($("<div class='loading'>Loading</div>"));

    }

    renderNextRecommendationsButton() {
        let $recommendationContainer = $("#recos");
        let nextButton = new RecommendationPaginationButton("next-reco");
        $recommendationContainer.append(nextButton.getElement());
        
        return nextButton;
    }

    renderPrevRecommendationsButton() {
        let $recommendationContainer = $("#recos");
        let prevButton = new RecommendationPaginationButton("prev-reco");
        $recommendationContainer.prepend(prevButton.getElement());
        
        return prevButton;
    }

    renderReviews(reviews = []) {
        let $reviewContainer = $("#reviews");
        $reviewContainer.empty();
        if (reviews.length) {
            for (let review of reviews) {
                $reviewContainer.append(review.getElement());
            }
        } else {
            $reviewContainer.append($("<div class='empty'>No Reviews Found</div>"));
        }
        
    }

    renderNextReviewsButton() {
        let $reviewContainer = $("#reviews");
        let nextButton = new ReviewPaginationButton("next-reviews");
        $reviewContainer.append(nextButton.getElement());

        return nextButton;
    }

    renderPreviousReviewsButton() {
        let $reviewContainer = $("#reviews");
        let prevButton = new ReviewPaginationButton("prev-reviews");
        $reviewContainer.prepend(prevButton.getElement());

        return prevButton;
    }

    renderMoviesToReview(moviesToReview) {
        let $container = $("#movies");
        $container.empty();
        if (moviesToReview.length) {
            for (let movie of moviesToReview) {
                $container.append(movie.getElement());
            }
        } else {
            $container.append($("<div class='empty'>No Movies Found</div>"));
        }        
    }

    renderMovieOptions(options) {
        let $select = $("#selectGenre");
        $select.empty();
        options.forEach(function(option) {
            let $option = $("<option>" + option + "</option>");
            $option.data("genre", option);
            $select.append($option);
        });
    }
}

export default View;
