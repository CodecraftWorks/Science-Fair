var RUN_FUNCTION = function(wordDetail) {
    log("Animating run for "+wordDetail.word+", with id #"+wordDetail.imageDetail.id);
    $("#"+wordDetail.imageDetail.id+" img").on("load", function() {
        $("#"+wordDetail.imageDetail.id).animate({ "left": "+=150px" }, 500 );
    });
}
var WALK_FUNCTION = function(wordDetail) {
    log("Animating walk for "+wordDetail.word+", with id #"+wordDetail.imageDetail.id);
    $("#"+wordDetail.imageDetail.id+" img").on("load", function() {
        $("#"+wordDetail.imageDetail.id).animate({ "left": "+=150px" }, 1500 );
    });
}
var JUMP_FUNCTION = function(wordDetail) {
    log("Animating jump for "+wordDetail.word+", with id #"+wordDetail.imageDetail.id);
    $("#"+wordDetail.imageDetail.id+" img").on("load", function() {
        $("#"+wordDetail.imageDetail.id).effect("bounce", { times: 1 }, 500 );
    });
}
var FALL_FUNCTION = function(wordDetail) {
    log("Animating walk for "+wordDetail.word+", with id #"+wordDetail.imageDetail.id);
    $("#"+wordDetail.imageDetail.id+" img").on("load", function() {
        $("#"+wordDetail.imageDetail.id).animate({ "top": "+=300px" }, 500 );
    });
}

var VERBS = {
    run: RUN_FUNCTION,
    ran: RUN_FUNCTION,
    running: RUN_FUNCTION,
    walk: WALK_FUNCTION,
    walking: WALK_FUNCTION,
    jump: JUMP_FUNCTION,
    jumping: function(wordDetail) {
        log("Animating jump for "+wordDetail.word+", with id #"+wordDetail.imageDetail.id);
        $("#"+wordDetail.imageDetail.id+" img").on("load", function() {
            $("#"+wordDetail.imageDetail.id).effect("bounce", { times: 15 }, 4000 );
        });
    },
    fall: FALL_FUNCTION,
    fell: FALL_FUNCTION,
    falling: FALL_FUNCTION,
};