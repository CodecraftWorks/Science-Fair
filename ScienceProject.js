var chosenWords = [];

var canvas = $("#canvas");
var ctx = canvas[0].getContext("2d");

$(function() {
    $("#enter").click(main);
});

function main() {
    var input = $("#tbox").val();
    if (!input) {
        return;
    }
    resetInterface();

    var words = input.trim().split(" ");
    var promises = [];
    words.forEach(w => {
        promises.push(findInfoForWord(w));
    });
    $.when.apply($, promises).then(processChosenWords);
}

function redrawCanvas() {
    chosenWords.forEach(w => {
        var wordDetail = w.wordDetails[w.selectedIndex];
        var imageDetail = wordDetail.imageDetail;
        var wordType = wordDetail.partOfSpeech;

        log("The image is '"+imageDetail.url+"'.");
        $("#images").append("<img src='"+imageDetail.url+"'/>");
    });
}

function processChosenWords() {
    var promises = [];
    log("Finished with all!");
    chosenWords.forEach(w => {
        var wordDetail = w.wordDetails[w.selectedIndex];
        log("Word '"+wordDetail.word+"' is a '"+wordDetail.partOfSpeech+"'.");

        if (wordDetail.partOfSpeech == "noun") {
            log("Found the noun: " + wordDetail.word);
            promises.push(findImageForNoun(wordDetail));
        }
        else if (wordDetail.partOfSpeech == "verb") {
            log("Need to add the implementation for those.");
            // TODO
        }
        else if (wordDetail.partOfSpeech == "adverb") {
            log("Need to add the implementation for those.");
            // TODO
        }
        else if (wordDetail.partOfSpeech == "adjective") {
            log("Need to add the implementation for those.");
            // TODO
        }
        else {
            log("Word '"+wordDetail.word+"' is a '"+wordDetail.partOfSpeech+"'. Unsure how to handle that.");
            // TODO
        }
    });
    $.when.apply($, promises).then(redrawCanvas);
}

function findImageForNoun(wordDetail) {    
    var call = $.ajax({
            url: "https://picture-this-194003.appspot.com/noun-image.php?limit=1&word="+wordDetail.word,
            type: "GET",
            dataType : 'json',
        }).then(function(data) {
            if (data.results && data.results.length > 0) {
                var url = data.results[0].preview_url_84;
                log("Result is: "+JSON.stringify(data.results[0]));
                wordDetail.imageDetail = new ImageDetail(url);
            }
        }).fail(function(xhr, textStatus, error) {
            showError("Hmm... something went wrong: '"+textStatus+",' Error: "+error);
        });
    return call;
}

function findInfoForWord(w) {
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
                log("Got back: "+JSON.stringify(data))
                data.results.forEach(result => {
                    cWord.addWord(w, result.definition, result.partOfSpeech, result.synonyms, result.typeOf);
                });
            }
            log("Finished with '"+w+"'.");
        }).fail(function(xhr, textStatus, error) {
            showError("Something went wrong: '"+textStatus+",' Error: "+error);
        });
    return call;
}

function resetInterface() {
    chosenWords = [];
    $("#debug").html(null);
    $("#options").html(null);
    $("#images").html(null);
    $("#errors").removeClass().html(null);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function showError(message) {
    $("#errors").hide().addClass("alert alert-danger").html(message).fadeIn("slow");
}

function log(message) {
    console.log(message);
}
