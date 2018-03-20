var ADJECTIVES = {
    red: function(wordDetail) {
        log("Painting the word '"+wordDetail.word+"' red.");
        colorizeImage(wordDetail.imageDetail, "255, 0, 0");
    },
    blue: function(wordDetail) {
        log("Painting the word '"+wordDetail.word+"' blue.");
        colorizeImage(wordDetail.imageDetail, "0, 0, 255");
    },
    green: function(wordDetail) {
        log("Painting the word '"+wordDetail.word+"' green.");
        colorizeImage(wordDetail.imageDetail, "0, 255, 0");
    },
    purple: function(wordDetail) {
        log("Painting the word '"+wordDetail.word+"' purple.");
        colorizeImage(wordDetail.imageDetail, "102, 0, 255");
    },
    orange: function(wordDetail) {
        log("Painting the word '"+wordDetail.word+"' orange.");
        colorizeImage(wordDetail.imageDetail, "255, 127, 0");
    },
    yellow: function(wordDetail) {
        log("Painting the word '"+wordDetail.word+"' yellow.");
        colorizeImage(wordDetail.imageDetail, "255, 255, 0");
    },
    black: function(wordDetail) {
        log("Painting the word '"+wordDetail.word+"' black.");
        colorizeImage(wordDetail.imageDetail, "0, 0, 0");
    },
    white: function(wordDetail) {
        log("Painting the word '"+wordDetail.word+"' white.");
        colorizeImage(wordDetail.imageDetail, "200, 200, 200");
    },
    aqua: function(wordDetail) {
        log("Painting the word '"+wordDetail.word+"' aqua.");
        colorizeImage(wordDetail.imageDetail, "0, 255, 255");
    },
    lime: function(wordDetail) {
        log("Painting the word '"+wordDetail.word+"' lime.");
        colorizeImage(wordDetail.imageDetail, "153, 255, 51");
    },
    pink: function(wordDetail) {
        log("Painting the word '"+wordDetail.word+"' pink.");
        colorizeImage(wordDetail.imageDetail, "255, 102, 204");
    },
    magenta: function(wordDetail) {
        log("Painting the word '"+wordDetail.word+"' magenta.");
        colorizeImage(wordDetail.imageDetail, "255, 0, 255");
    },
    brown: function(wordDetail) {
        log("Painting the word '"+wordDetail.word+"' brown.");
        colorizeImage(wordDetail.imageDetail, "102, 51, 0");
    },
    navy: function(wordDetail) {
        log("Painting the word '"+wordDetail.word+"' navy.");
        colorizeImage(wordDetail.imageDetail, "0, 0, 102");
    },
    tan: function(wordDetail) {
        log("Painting the word '"+wordDetail.word+"' tan.");
        colorizeImage(wordDetail.imageDetail, "255, 204, 153");
    },
};