
module.exports = { extractDetails };

function extractDetails(text) {
    if (!text) return {};  // Prevent undefined error

    const extractedData = {
       
        DEADLINE: []
    };

    const deadlineRegex = /\b(?:deadline[:\s]*|apply\s*by[:\s]*|last\s*date\s*to\s*apply[:\s]*|registration\s*closes\s*on[:\s]*|last\s*chance\s*to\s*apply[:\s]*)\s*(\d{1,2}(?:st|nd|rd|th)?[\s-\/]?(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)[\s-\/]?\d{1,2}[\s-\/]?\d{4}|\d{4}[-\/]\d{1,2}[-\/]\d{1,2})\b/gi;
    extractedData.DEADLINE = [...text.matchAll(deadlineRegex)].map(match => match[1]);

    return extractedData;
}
module.exports = { extractDetails };







