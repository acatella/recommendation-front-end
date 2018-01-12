const $ = require('jquery');

class ReviewPaginationButton {
    constructor(imdbKey, direction) {
        this.imdbKey = imdbKey;        
        this.direction = direction;
    }

    getElement() {
        let $button = $("<button id='" + this.direction + "'></button").addClass("btn btn-light pagination-button");
        $button.text(this.direction);
        
        return $button;
    }
}

export default ReviewPaginationButton;