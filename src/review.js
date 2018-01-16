const $ = require('jquery');
const Movie = require('./movie').default;
const getRatingElement = require('./getRatingElement').default;
const totalStars = 5;

class Review extends Movie {
    constructor(title, posterUrl, rating, imdbId, currentUser) {
        super(title, posterUrl, rating, imdbId, currentUser);
    }

    getElement() {
        let movieContainer = $("<div id='movie-" + this.imdbId + "'></div>").addClass("col-3 movie");
        let titleEl = $("<h4></h4>").text(this.title);
        let posterEl = $("<img>");
        posterEl.attr('src', this.posterUrl);
        let ratingContainer = $("<div class='rating-container'></div>");
        let ratingEl = getRatingElement(this.rating);
        let ratingTitle = $("<span>Your Rating</span>");
        ratingContainer.append(ratingTitle);
        ratingContainer.append(ratingEl);
        let reviewEl = $("<div class='user-review'></div>");        
        let selectBox = $("<select id='" + this.imdbId + "-select' class='rating-select'></select>");
        for (let i = 1; i <= totalStars; i++) {
            let $option = $("<option data-rating=" + i + "></option>");
            $option.text(i + " Star");
            selectBox.append($option);
        }
        let saveButton = $("<button data-imdbid='" + this.imdbId + "' class='update-review'>Save Review</button>");                
        saveButton.data('poster-url', this.posterUrl); 
        saveButton.data('title', this.title);
        let deleteButton = $("<button data-imdbid='" + this.imdbId + "' class='delete-review'>Delete Review</button>");
        let selectContainer = $("<div class='select-container'></div>");
        let selectTitle = $("<span>Update Review</span>");
        selectContainer.append(selectTitle);
        selectContainer.append($("<br>"));
        selectContainer.append(selectBox);
        selectContainer.append(saveButton);
        selectContainer.append(deleteButton);
        movieContainer.append(titleEl);
        movieContainer.append(posterEl);
        movieContainer.append(ratingContainer);

        movieContainer.append(selectContainer);

        return movieContainer;
    }
}

export default Review;