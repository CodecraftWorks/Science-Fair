var chosenWords = [];
var SPACING_X = 16;
var SPACING_Y = 16;
var IMAGE_WIDTH = 84;
var IMAGE_HEIGHT = 84;
// var IMAGE_COUNT_X = 10;
// var IMAGE_COUNT_Y = 7;

$(function() {
    resetInterface();
    $("#enter").click(main);
    $("#tbox").on('keyup', function (e) {
        if (e.keyCode == 13) {
            $("#enter").click();
        }
    });
});

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
        showError("ERROR: "+e);
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

    log("== FOR LOOP ==")
    for (i = 0; i < chosenWords.length; i++) {
        var wordDetail = chosenWords[i].wordDetails[chosenWords[i].selectedIndex];
        if (wordDetail.isNoun()) {
            log("== FOR LOOP NOUN FOUND ==")
        }
        else if (wordDetail.isVerb()) {
            log("== FOR LOOP VERB FOUND ==")
            if (i >= 2) {
                log("2");
                if (chosenWords[i - 1].wordDetails[chosenWords[i - 1].selectedIndex].isSkipWord()) {
                    if (chosenWords[i - 2].wordDetails[chosenWords[i - 2].selectedIndex].isNoun()) {
                        chosenWords[i - 2].wordDetails[chosenWords[i - 2].selectedIndex].applyVerb(wordDetail);
                        log("Went two back for verb '"+wordDetail.word+".'");
                        continue;
                    }
                }
            }
            if (i >= 1) {
                log("1");
                if (chosenWords[i - 1].wordDetails[chosenWords[i - 1].selectedIndex].isNoun()) {
                    chosenWords[i - 1].wordDetails[chosenWords[i - 1].selectedIndex].applyVerb(wordDetail);
                    log("Went one back for verb '"+wordDetail.word+".'");
                    continue;
                }
            }
            if (i < chosenWords.length - 1) {
                if (chosenWords[i + 1].wordDetails[chosenWords[i + 1].selectedIndex].isNoun()) {
                    chosenWords[i + 1].wordDetails[chosenWords[i + 1].selectedIndex].applyVerb(wordDetail);
                    log("Went one back for verb '"+wordDetail.word+".'");
                    continue;
                }
            }
        }
        else if (wordDetail.isAdjective()) {
            log("== FOR LOOP ADJECTIVE FOUND ==")
            if (i >= 2) {
                if (chosenWords[i - 1].wordDetails[chosenWords[i - 1].selectedIndex].isSkipWord()) {
                    if (chosenWords[i - 2].wordDetails[chosenWords[i - 2].selectedIndex].isNoun()) {
                        chosenWords[i - 2].wordDetails[chosenWords[i - 2].selectedIndex].applyAdjective(wordDetail);
                        log("Went two back for adjective '"+wordDetail.word+".'");
                        continue;
                    }
                }
            }
            if (i < chosenWords.length - 1) {
                if (chosenWords[i + 1].wordDetails[chosenWords[i + 1].selectedIndex].isNoun()) {
                    chosenWords[i + 1].wordDetails[chosenWords[i + 1].selectedIndex].applyAdjective(wordDetail);
                    log("Went one forward for adjective '"+wordDetail.word+".'");
                    continue;
                }
            }
            if (i < chosenWords.length - 1) {
                if (chosenWords[i + 1].wordDetails[chosenWords[i + 1].selectedIndex].isAdjective()) {
                    for (a = 2; a <= 5;) {
                        if (chosenWords[i + a].wordDetails[chosenWords[i + a].selectedIndex].isAdjective()) {
                            a++
                        }
                        else if (chosenWords[i + a].wordDetails[chosenWords[i + a].selectedIndex].isVerb() &&
                        chosenWords[i + a + 1].wordDetails[chosenWords[i + a + 1].selectedIndex].isNoun()) {
                            chosenWords[i + a + 1].wordDetails[chosenWords[i + a + 1].selectedIndex].applyAdjective(wordDetail);
                            log("Found a verb and went "+(a+1)+" forward for adjective '"+wordDetail.word+".'")
                            break;
                        }
                        else if (chosenWords[i + a].wordDetails[chosenWords[i + a].selectedIndex].isNoun()) {
                            chosenWords[i + a].wordDetails[chosenWords[i + a].selectedIndex].applyAdjective(wordDetail);
                            log("Went "+a+" forward for adjective '"+wordDetail.word+".'")
                            break;
                        }
                    }
                }
            }
        }
        else if (wordDetail.partOfSpeech == "skip") {

        }
    } // for
    redrawCanvas();
}

function redrawCanvas() {
    log("Redrawing canvas.");
    var xpos = 0;
    var ypos = 0;

    chosenWords.forEach(w => {
        var wordDetail = w.wordDetails[w.selectedIndex];

        if (wordDetail.isNoun()) {
            var imageDetail = wordDetail.imageDetail;
            if (imageDetail != null) {

                var divId = "word_"+Math.random().toString(36).slice(2);
                imageDetail.setDrawnPosition(divId, xpos, ypos);
                log("Drawing image (id: "+divId+") at pos: "+imageDetail.x+", "+imageDetail.y+". "+imageDetail.url);

                $("#images").append("<div id='"+divId+"' class='wordGroup' style='left: "+imageDetail.x+"; top: "+imageDetail.y+";'><div class='adjectives'><img src='"+imageDetail.url+"' class='image'/></div></div>");

                xpos += IMAGE_WIDTH + SPACING_X;
                if (xpos > $("#images").width() - IMAGE_WIDTH - SPACING_X) {
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

function colorizeImage(imageDetail, color) {
    $("#"+imageDetail.id+" .adjectives").css({
        "background-color": "rgba("+color+", 0.3)",
        "width": imageDetail.width+"px",
        "height": imageDetail.height+"px",
    });
}

function fillDetailsForVerb(wordDetail) {    
    return $.Deferred()
        .done(function() {
            if (VERBS[wordDetail.word]) {
                // TODO
            }
        })
        .resolve();
}

function fillDetailsForAdjective(wordDetail) {  
    return $.Deferred()
        .done(function() {
            if (ADJECTIVES[wordDetail.word]) {
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
            url: "https://f1r3site-science-fair.herokuapp.com/noun-image.php?limit=1&word="+wordDetail.word,
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
            showError("WordsAPI does not understand word '"+w+"'");
        });
    return call;
}

function resetInterface() {
    chosenWords = [];
    $("#debug").html(null).hide();
    $("#options").html(null).hide();
    $("#errors").removeClass().html(null).hide();
    clearCanvas();
}

function clearCanvas() {
    log("Clearing canvas.");
    $("#images").html(null);
    $("#images").width(800); 
    $("#images").height(600);
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
