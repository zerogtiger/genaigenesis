//creates every possible combination of sentences
function generateSentences(inputString) {
    const sentences = [];
    const words = inputString.split(".");
    for (let i = 0; i < words.length; i++) {
        for (let j = i + 1; j <= words.length; j++) {
            sentences.push(words.slice(i, j).join("."));
        }
    }
    return sentences;
}

// Example usage
let inputString = "s1.s2.s3.s4";
let result = generateSentences(inputString);
console.log(result);
