const MASHAPE_API_KEY = "31PIkspQlQmshKrLYuu7DCRdQc0dp1uecH3jsnjvOjGiSlKwHJ";
const MASHAPE_API_HOST = "wordsapiv1.p.mashape.com";

const NOUN_PROJECT_API_KEY = "66705a0c886e45269259d802b030a51b";
const NOUN_PROJECT_API_SECRET = "ca4c6d12c1d94243aa9a068501a9ce39";

var chosenWords = [];

$(function() {
    //var canvas = $("#canvas");
    //var ctx = canvas[0].getContext("2d");
    $("#enter").click(start);
});

function start() {
    var input = $("#tbox").val();
    if (!input) {
        return;
    }
    resetInterface();

    var words = input.trim().split(" ");
    var promises = [];

    words.forEach(w => {
        promises.push(processWord(w));
    });

    $.when.apply($, promises).then(processChosenWords);
    
}

function processChosenWords() {
    log("Finished with all!");
    chosenWords.forEach(w => {
        var wordDetail = w.words[w.selectedIndex];
        log("checking "+wordDetail.partOfSpeech);
        if (wordDetail.partOfSpeech == "noun") {
            log("Found the noun: " + wordDetail.word);

            findImageForNoun(wordDetail.word);
        }
    });
}

function findImageForNoun(noun) {
    // Initialize
    const oauth = OAuth({
        consumer: {
            key: NOUN_PROJECT_API_KEY,
            secret: NOUN_PROJECT_API_SECRET
        },
        signature_method: 'HMAC-SHA1',
        hash_function(base_string, key) {
            return CryptoJS.HmacSHA1(base_string, key).toString(CryptoJS.enc.Base64);
        }
    });
    
    const request_data = {
        url: "http://api.thenounproject.com/icon/"+noun,
        method: "GET",
    };
    
    // // Note: The token is optional for some requests
    // const token = {
    //     key: '370773112-GmHxMAgYyLbNEtIKZeRNFsMKPR9EyMZeS9weJAEb',
    //     secret: 'LswwdoUaIvS8ltyTt5jkRh4J50vUPVVHtR2YPi5kE'
    // };

    var auth = oauth.authorize(request_data);

    var h = oauth.toHeader(auth);

    log("1: "+JSON.stringify(auth));
    log("2: "+JSON.stringify(h));

    /*
    Authorization: OAuth oauth_consumer_key="66705a0c886e45269259d802b030a51b", oauth_nonce="fd1vd7qZRAMQBnoCHljbf3rgu8K429hO", oauth_signature="ndI71Zhrd5gbSYRSw0v85J%2BGmmM%3D", oauth_signature_method="HMAC-SHA1", oauth_timestamp="1517455338", oauth_version="1.0"
    Authorization: OAuth oauth_consumer_key=\"66705a0c886e45269259d802b030a51b\", oauth_nonce=\"D7Hh7w1PEMUXDijIiHED6wTiQArMRh6q\", oauth_signature=\"deca60cc1fa4871727a3e1cde4caebaa0d355ff2\", oauth_signature_method=\"HMAC-SHA1\", oauth_timestamp=\"1517455506\", oauth_version=\"1.0\""
    */

    $.ajax({
        url: request_data.url,
        type: request_data.method,
        contentType: 'x-www-form-urlencoded',
        dataType: 'json',
        headers: h,
    }).always(function(data) {
        log(JSON.stringify(data))
    });
    
    // $.ajax({
    //     url: request_data.url,
    //     type: request_data.method,
    //     //data: request_data.data,
    //     headers: oauth.toHeader(oauth.authorize(request_data))
    // }).always(function(data) {
    //     log(JSON.stringify(data))
    // });
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
    $("#errors").removeClass().html(null);
}

function showError(message) {
    $("#errors").hide().addClass("alert alert-danger").html(message).fadeIn("slow");
}

function log(message) {
    console.log(message);
}
