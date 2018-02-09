/*

TODO List:
 - Bug in writing the last banjo for a line when the canvas height does not include another row yet.


*/

var chosenWords = [];
var SPACING_X = 16;
var SPACING_Y = 16;
var IMAGE_WIDTH = 84;
var IMAGE_HEIGHT = 84;
// var IMAGE_COUNT_X = 10;
// var IMAGE_COUNT_Y = 7;

$("#images").hide();

$(function() {
    resetInterface();
    $("#enter").click(main);
    $("#tbox").on('keyup', function (e) {
        if (e.keyCode == 13) {
            $("#enter").click();
        }
    });
});

function getCanvas() {
    return $("#canvas")[0];
}
function getContext() {
    return getCanvas().getContext("2d");  
}


function main() {
    try {
        var input = $("#tbox").val();
        if (!input) {
            return;
        }
        resetInterface();

        var words = input.toLowerCase().trim().split(" ");
        var promises = [];
        words.forEach(w => {
            promises.push(determineWordTypes(w));
        });
        $.when.apply($, promises).then(retrieveWordDetails);
                
    }
    catch(e) {
        error("ERROR: "+e);
        log("ERROR: "+e);
    }
}

// ====================================================================================
// ====================================================================================





function processAndDrawWords() {

    // Determine word assocations, such as adjectives applied to which noun etc.
    // This should be represented in the WordInfo objects themselves (likely some new model properties need to be added).

    /* Some user input examples for reference:
    red dog runs
    running boy
    the dog jumped
    the cat is blue
    */

    var currentNoun = null;
    var currentVerb = null;
    var currentAdjectives = [];

    chosenWords.forEach(w => {
        var wordDetail = w.wordDetails[w.selectedIndex];
        if (wordDetail.isNoun()) {
            if (currentAdjectives) {
                currentAdjectives.forEach(a => {
                    wordDetail.applyAdjective(a);
                });
                currentNoun = null;
            }
            else {
                currentNoun = wordDetail;
            }
            if (currentVerb) {
                wordDetail.applyVerb(currentVerb);
                currentNoun = null;
            }
        }
        else if (wordDetail.isVerb()) {
            if (currentNoun) {
                currentNoun.applyVerb(wordDetail);
                currentNoun = null;
            }
            else {
                currentVerb = wordDetail;
            }
        }
        else if (wordDetail.isAdjective()) {
            if (currentNoun) {
                currentNoun.applyAdjective(wordDetail);
            }
            else {
                currentAdjectives.push(wordDetail);
            }
        }
        else if (wordDetail.isSkipWord()) {
            // Nothing to do?
            log("Skipping "+wordDetail.partOfSpeech+" '"+wordDetail.word+"'.")
        }
    }); // forEach

    redrawCanvas();
}

function redrawCanvas() {
    var xpos = 0;
    var ypos = 0;
    var canvas = getCanvas();
    var ctx = getContext();  
    
    var count = 0;

    chosenWords.forEach(w => {
        count++;
        var wordDetail = w.wordDetails[w.selectedIndex];

        if (wordDetail.isNoun()) {
            var imageDetail = wordDetail.imageDetail;
            if (imageDetail != null) {
                log("Drawing image "+count+" at pos: "+xpos+", "+ypos+". "+imageDetail.url);
                imageDetail.setDrawnPosition(xpos, ypos);
                imageDetail.img.onload = preloadImageFunction(imageDetail, xpos, ypos);

                xpos += IMAGE_WIDTH + SPACING_X;
                if (xpos > canvas.width - IMAGE_WIDTH - SPACING_X) {
                    ypos += IMAGE_HEIGHT + SPACING_Y;
                    xpos = 0;
                }

                wordDetail.adjectives.forEach(a => {
                    log("Found attached adjective: "+a.word);
                    if (ADJECTIVES[a.word] !== undefined) {
                        log("Adjective implementation found for '"+a.word+"'.");
                        ADJECTIVES[a.word](wordDetail);
                    }
                });
                wordDetail.verbs.forEach(v => {
                    log("Found attached verb: "+v.word);
                    if (VERBS[v.word] !== undefined) {
                        log("Verb implementation found for '"+v.word+"'.");
                        VERBS[v.word](wordDetail);
                    }
                });
            }
        }
    }); // forEach
}

function colorizeImage(imageDetail, hexColor) {
    var ctx = getContext();
    ctx.fillStyle = hexColor;
    ctx.globalAlpha = 0.3;
    log("Drawing overlay at: "+imageDetail.x+"/"+imageDetail.y+" with size "+imageDetail.width+" x "+imageDetail.height+".");
    ctx.fillRect(imageDetail.x, imageDetail.y, imageDetail.width, imageDetail.height);
    ctx.globalAlpha = 1.0;
}

function fillDetailsForVerb(wordDetail) {    
    return $.Deferred()
        .done(function() {
            if (VERBS[wordDetail.word]) {
                log("Verb implementation found.");
                // TODO
            }
        })
        .resolve();
}

function fillDetailsForAdjective(wordDetail) {  
    return $.Deferred()
        .done(function() {

            if (ADJECTIVES[wordDetail.word]) {
                log("Adjective implementation found.");
                // TODO
            }
        })
        .resolve();
}








// ====================================================================================
// ====================================================================================

function retrieveWordDetails() {
    var promises = [];
    log("Finished with all! "+JSON.stringify(chosenWords));
    chosenWords.forEach(w => {
        var wordDetail = w.wordDetails[w.selectedIndex];
        log("Word '"+wordDetail.word+"' was found to be a '"+wordDetail.partOfSpeech+"'.");
        if (wordDetail.isNoun()) {
                promises.push(fillDetailsForNoun(wordDetail));
        }
        else if (wordDetail.isVerb()) {
            promises.push(fillDetailsForVerb(wordDetail));
        }
        else if (wordDetail.isAdjective()) {
            promises.push(fillDetailsForAdjective(wordDetail));
        }
        else if (wordDetail.isSkipWord()) {
            // Do nothing.
        }
        else {
            log("Word '"+wordDetail.word+"' is a '"+wordDetail.partOfSpeech+"'. Unsure how to handle that.");
        }
    });
    $.when.apply($, promises).then(processAndDrawWords);
}

function fillDetailsForNoun(wordDetail) {    
    var call = $.ajax({
            url: "https://picture-this-194003.appspot.com/noun-image.php?limit=1&word="+wordDetail.word,
            type: "GET",
            dataType : 'json',
        }).then(function(data) {
            if (data.results && data.results.length > 0) {
                var url = data.results[0].preview_url_84;
                wordDetail.imageDetail = new ImageDetail(url, IMAGE_WIDTH, IMAGE_HEIGHT);
            }
        }).fail(function(xhr, textStatus, error) {
            showError("Hmm... something went wrong: '"+textStatus+",' Error: "+error);
        });
    return call;
}

function preloadImageFunction(imageDetail, xpos, ypos) {
    return function() {
        getContext().drawImage(imageDetail.img, xpos, ypos);
        if (imageDetail.color) {
            colorizeImage(imageDetail, imageDetail.color);
        }
    };
}

function determineWordTypes(w) {
    var cWord = new ChosenWord(w);
    chosenWords.push(cWord);
    var call = $.ajax({
            url: "https://wordsapiv1.p.mashape.com/words/"+w,
            headers: {
                "X-Mashape-Key": MASHAPE_API_KEY,
                "X-Mashape-Host": MASHAPE_API_HOST
            }
        }).then(function(data) {
            if (data.results && data.results.length > 0) {
                // DEBUG log("Got back: "+JSON.stringify(data))
                data.results.forEach(result => {
                    cWord.addWord(w, result.definition, result.partOfSpeech, result.synonyms, result.typeOf);
                });
            }
            else {
                // Words that the WordsAPI doesn't know, become skip words.
                cWord.addWord(w, null, "skip", null, null);
            }
        }).fail(function(xhr, textStatus, error) {
            showError("Something went wrong: '"+textStatus+",' Error: "+error);
        });
    return call;
}

function resetInterface() {
    chosenWords = [];
    $("#debug").html(null).hide();
    $("#options").html(null)
    $("#images").html(null);
    $("#errors").removeClass().html(null).hide();
    var canvas = getCanvas();
    var ctx = getContext();
    canvas.width = 800; 
    canvas.height = 600;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function showError(message) {
    $("#errors").hide().addClass("alert alert-danger").html(message).fadeIn("slow");
}

function log(message) {
    console.log(message);
}

function debug(message) {
    $("#debug").html("<pre>"+message+"</pre>").show();
}
