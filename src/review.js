const $ = require('jquery');
const Movie = require('./movie').default;
const getRatingElement = require('./getRatingElement').default;
const totalStars = 5;

class Review extends Movie {
    constructor(title, posterUrl, rating, imdbId, currentUser) {
        super(title, posterUrl, rating, imdbId, currentUser);
    }

    getElement() {
        let movieContainer = $("<div id='review-" + this.imdbId + "'></div>").addClass("col-3 movie");
        let titleEl = $("<h4></h4>").text(this.title);
        let posterEl = $("<img>");
        posterEl.attr('src', this.posterUrl);
        let ratingEl = getRatingElement(this.rating);
        let reviewEl = $("<div class='user-review'></div>");        
        let selectBox = $("<select id='" + this.imdbId + "-select' class='rating-select'></select>");
        for (let i = 1; i <= totalStars; i++) {
            let $option = $("<option data-rating=" + i + "></option>");
            $option.text(i + " Star");
            selectBox.append($option);
        }
        let saveButton = $("<button data-imdbId='" + this.imdbId + "' class='save-review'>Save Review</button>");        
        let deleteButton = $("<button data-imdbId='" + this.imdbId + "' class='delete-review'>Delete Review</button>");
        movieContainer.append(titleEl);
        movieContainer.append(posterEl);
        movieContainer.append(ratingEl);
        movieContainer.append(selectBox);
        movieContainer.append(saveButton);
        movieContainer.append(deleteButton);

        return movieContainer;
    }
}

export default Review;