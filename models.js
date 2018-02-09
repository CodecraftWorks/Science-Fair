var WORDS_TO_SKIP = [
    "is",
    "the",
    "a",
    "an",
];

function ChosenWord(w) {
    this.word = w;
    this.selectedIndex = 0;
    this.wordDetails = [];

    this.addWord = function(w, d, p, s, t) {
        var wd = new WordDetail(w, d, p, s, t);
        this.wordDetails.push(wd);
    }
}

function WordDetail(w, d, p, s, t) {
    this.word = w;
    this.definition = d;
    this.partOfSpeech = p;
    this.synonyms = s || [];
    this.typeOf = t || [];
    this.imageDetail = null;
    this.adjectives = [];
    this.verbs = [];

    this.isNoun = function() {
        return !this.isVerb() && !this.isAdjective() && this.partOfSpeech === "noun";
    };
    this.isVerb = function() {
        return this.partOfSpeech === "verb" || VERBS[this.word] !== undefined;
    };
    this.isAdjective = function() {
        return this.partOfSpeech === "adjective" || ADJECTIVES[this.word] !== undefined;
    };
    this.isSkipWord = function() {
        return this.partOfSpeech === "skip" || WORDS_TO_SKIP.indexOf(this.word) > -1;
    }

    this.applyVerb = function(v) {
        if (this.isNoun()) {
            this.verbs.push(a);
        }
        else {
            log("Attempt to apply verb '"+a.word+"' to the "+this.partOfSpeech+" '"+this.word+"'. Must be a noun.");
        }
    };

    this.applyAdjective = function(a) {
        if (this.isNoun()) {
            this.adjectives.push(a);
        }
        else {
            log("Attempt to apply adjective '"+a.word+"' to the "+this.partOfSpeech+" '"+this.word+"'. Must be a noun.");
        }
    };
}

function ImageDetail(u, w, h) {
    this.img = new Image(w, h);
    this.img.src = u;
    this.url = u;
    this.x;
    this.y;
    this.width = w;
    this.height = h;
    this.color = null;

    this.setDrawnPosition = function(x, y) {
        this.x = x;
        this.y = y;
    }
}