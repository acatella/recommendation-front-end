const $ = require('jquery');

class PaginationButton {
    constructor(imdbKey, genreKey, ratingKey, direction) {
        this.imdbKey = imdbKey;
        this.genreKey = genreKey;
        this.ratingKey = ratingKey;
        this.direction = direction;
    }

    getElement() {
        let $button = $("<button id='" + this.direction + "'></button").addClass("btn btn-light pagination-button");
        $button.text(this.direction);
        
        return $button;
    }
}

export default PaginationButton;