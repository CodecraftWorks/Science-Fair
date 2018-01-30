const MASHAPE_API_KEY = "31PIkspQlQmshKrLYuu7DCRdQc0dp1uecH3jsnjvOjGiSlKwHJ";
const MASHAPE_API_HOST = "wordsapiv1.p.mashape.com";
const YOUR_API_KEY = "66705a0c886e45269259d802b030a51b";
const YOUR_API_SECRET = "ca4c6d12c1d94243aa9a068501a9ce39";

var chosenWords = [];

$(function() {
    //var canvas = $("#canvas");
    //var ctx = canvas[0].getContext("2d");

    $("#enter").click(start);
    // $("#view").click(function() {
    //     chosenWords.forEach(c => {
    //         $("#debug").append(JSON.stringify(c)+"\n");
    //     });
    // });
});

function start() {
    var input = $("#tbox").val();
    if (!input) {
        return;
    }

    resetInterface();

    var words = input.trim().split(" ");
    chosenWords = [];

    var promises = [];

    words.forEach(w => {
        promises.push(processWord(w));
    });

    $.when.apply($, promises).then(processChosenWords);
    
}

function processChosenWords() {
    console.log("Finished with all!");
    chosenWords.forEach(w => {
        var wordDetail = w.words[w.selectedIndex];
        console.log("checking "+wordDetail.partOfSpeech);
        if (wordDetail.partOfSpeech == "noun") {
            console.log("Found the noun: " + wordDetail.word);
            $.ajax({
                url: "http://api.thenounproject.com/icon/"+wordDetail.word,
                headers: {
                    "oauth_consumer_key": YOUR_API_KEY, 
                    "oauth_consumer_secret": YOUR_API_SECRET
                }
            })
        }
    });
}

function processWord(w) {
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
                data.results.forEach(result => {
                    cWord.addWord(w, result.definition, result.partOfSpeech, result.synonyms, result.typeOf);
                });
            }
            console.log("Finished with '"+w+"'.");
        }).fail(function(xhr, textStatus, error) {
            showError("Something went wrong: '"+textStatus+",' Error: "+error);
        });
    return call;
}

function resetInterface() {
    $("#debug").html(null);
    $("#options").html(null);
    $("#errors").removeClass().html(null);
}

function showError(message) {
    $("#errors").hide().addClass("alert alert-danger").html(message).fadeIn("slow");
}
