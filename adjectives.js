var ADJECTIVES = {
    red: function(wordDetail) {
        log("Painting the word '"+wordDetail.word+"' red.");
        colorizeImage(wordDetail.imageDetail, "#ff0000");
    },
    blue: function(wordDetail) {
        log("Painting the word '"+wordDetail.word+"' blue.");
        colorizeImage(wordDetail.imageDetail, "#0000ff");
    },
    green: function(wordDetail) {
        log("Painting the word '"+wordDetail.word+"' green.");
        colorizeImage(wordDetail.imageDetail, "#00ff00");
    },
};