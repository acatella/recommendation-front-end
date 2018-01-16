const $ = require('jquery');

class PaginationButton {
    constructor(direction) {
        this.direction = direction;
    }

    getElement() {
        let $button = $("<button id='" + this.direction + "'></button").addClass("btn btn-light pagination-button");
        let $glyph = $("<span></span>");
        if (this.direction.includes("next")) {
           $button.text(">")
        }
        else {
            $button.text("<");
        }                        
        
        return $button;
    }
}

export default PaginationButton;