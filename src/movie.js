const $ = require('jquery');
const totalStars = 5;
const getRatingElement = require('./getRatingElement').default;

class Movie {
    constructor(title, posterUrl, rating, imdbId, currentUser) {
        this.title = title;
        this.rating = Math.floor(rating);
        this.posterUrl = posterUrl;
        this.imdbId = imdbId;
        this.currentUser = currentUser;
    }

    getElement() {
        let movieContainer = $("<div id='movie-" + this.imdbId + "'></div>").addClass("col-3 movie");
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
        movieContainer.append(titleEl);
        movieContainer.append(posterEl);
        movieContainer.append(ratingEl);
        movieContainer.append(selectBox);
        movieContainer.append(saveButton);

        return movieContainer;
    }
    
}

export default Movie;