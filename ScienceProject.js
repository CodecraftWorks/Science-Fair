const MASHAPE_API_KEY = "31PIkspQlQmshKrLYuu7DCRdQc0dp1uecH3jsnjvOjGiSlKwHJ";
const MASHAPE_API_HOST = "wordsapiv1.p.mashape.com";

var chosenWords = [];

$(function() {
    //var canvas = $("#canvas");
    //var ctx = canvas[0].getContext("2d");

    $("#enter").click(function() {
        var input = $("#tbox").val();
        if (!input) {
            return;
        }

        resetInterface();

        var words = input.split(" ");
        chosenWords = [];

        words.forEach(w => {
            processWord(w);
        })
    });
    $("#view").click(function() {
        chosenWords.forEach(c => {
            $("#debug").append(JSON.stringify(c)+"\n");
        });
    });
});

function processWord(w) {
    var cWord = new ChosenWord(w);
    chosenWords.push(cWord);
    $.ajax({
        url: "https://wordsapiv1.p.mashape.com/words/"+w,
        headers: {
            "X-Mashape-Key": MASHAPE_API_KEY,
            "X-Mashape-Host": MASHAPE_API_HOST
        }
    }).then(function(data) {
        if (!data.results || data.results.length < 1) {
            alert("We couldn't find that word.");
            return;
        }
        data.results.forEach(result => {
            cWord.addWord(w, result.definition, result.partOfSpeech, result.synonyms, result.typeOf);
        });
    });
}

function resetInterface() {
    $("#debug").html(null);
    $("#options").html(null);
}