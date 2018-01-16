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
        let ratingContainer = $("<div class='rating-container'></div>");
        let ratingEl = getRatingElement(this.rating);
        let ratingTitle = $("<span>IMBD Rating</span>");
        ratingContainer.append(ratingTitle);
        ratingContainer.append(ratingEl);
        let reviewEl = $("<div class='user-review'></div>");     
        let selectContainer = $("<div class='select-container'></div>");
        let selectBox = $("<select id='" + this.imdbId + "-select' class='rating-select'></select>");
        for (let i = 1; i <= totalStars; i++) {
            let $option = $("<option data-rating=" + i + "></option>");
            $option.text(i + " Star");
            selectBox.append($option);
        }        
        let saveButton = $("<button data-imdbId='" + this.imdbId + "' class='save-review'>Save Review</button>");                
        saveButton.data('poster-url', this.posterUrl); 
        saveButton.data('title', this.title);
        selectContainer.append(selectBox);
        selectContainer.append(saveButton);
        movieContainer.append(titleEl);
        movieContainer.append(posterEl);
        movieContainer.append(ratingContainer);
        movieContainer.append(selectContainer);        

        return movieContainer;
    }
    
}

export default Movie;