const $ = require('jquery');

class ReviewPaginationButton {
    constructor(direction) {        
        this.direction = direction;
    }

    getElement() {
        let $button = $("<button id='" + this.direction + "'></button").addClass("btn btn-light rev-pagination-button");
        if (this.direction.includes("next")) {
            $button.text(">")
         }
         else {
             $button.text("<");
         }             
        
        return $button;
    }
}

export default ReviewPaginationButton;