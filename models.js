function ChosenWord(w) {
    this.word = w;
    //this.selectedIndex = -1;
    this.words = [];

    this.addWord = function(w, d, p, s, t) {
        var wd = new WordDetail(w, d, p, s, t);
        this.words.push(wd);
    }
}

function WordDetail(w, d, p, s, t) {
    this.word = w;
    this.definition = d;
    this.partOfSpeech = p;
    this.synonyms = s || [];
    this.typeOf = t || [];
}