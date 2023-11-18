class Utility {
    static setDifficultyTag(tagClass, difficulty) {
        if(difficulty) {
            if(difficulty.toLowerCase() === "easy") {
                tagClass += " user-q-tag-green"
            } else if (difficulty.toLowerCase() === "medium") {
                tagClass += " user-q-tag-orange"
            } else if (difficulty.toLowerCase() === "hard") {
                tagClass += " user-q-tag-red"
            } else {
                tagClass += " user-q-tag-white"
            }
        }
        return tagClass;
    }
}

export default Utility;