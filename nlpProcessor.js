




// const axios = require("axios");
// require("dotenv").config();

// // Hugging Face API headers
// const headers = {
//     Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
//     "Content-Type": "application/json"
// };

// // Function to extract named entities (ORG, DATE, LOCATION)
// const extractNER = async (emailText) => {
//     try {
//         const response = await axios.post(
//             "https://api-inference.huggingface.co/models/dslim/bert-base-NER",
//             { inputs: emailText },
//             { headers }
//         );

//         console.log("NER Response:", response.data); // Debugging API response

//         if (!response.data || !Array.isArray(response.data)) {
//             console.error("Invalid NER response format:", response.data);
//             return null;
//         }

//         let extracted_data = {
//             ORG: [],
//             JOB_ROLE: [],
//             DATE: [],
//             LOCATION: [],
//             STIPEND: [],
//             SKILLS: [],
//             DURATION: []
//         };

//         // Process extracted entities safely
//         response.data.forEach((entity) => {
//             if (entity.entity && entity.word) {
//                 if (entity.entity.includes("ORG")) extracted_data.ORG.push(entity.word);
//                 if (entity.entity.includes("DATE")) extracted_data.DATE.push(entity.word);
//                 if (entity.entity.includes("LOC")) extracted_data.LOCATION.push(entity.word);
//             }
//         });

//         return extracted_data;
//     } catch (error) {
//         console.error("Error extracting NER details:", error.response ? error.response.data : error.message);
//         return null;
//     }
// };

// // Function to extract job roles and skills using keyphrase extraction
// const extractJobDetails = async (emailText) => {
//     try {
//         const response = await axios.post(
//             "https://api-inference.huggingface.co/models/ml6team/keyphrase-extraction-kbir-inspec",
//             { inputs: emailText },
//             { headers }
//         );

//         console.log("Job Details Response:", response.data); // Debugging API response

//         if (!response.data || !Array.isArray(response.data)) {
//             console.error("Invalid job details response format:", response.data);
//             return { JOB_ROLE: [], SKILLS: [] };
//         }

//         let job_roles = [];
//         let skills = [];

//         // Filtering relevant keywords safely
//         response.data.forEach((keywordObj) => {
//             if (typeof keywordObj === "string") {
//                 const keyword = keywordObj.toLowerCase();

//                 if (keyword.includes("engineer") || keyword.includes("developer") || keyword.includes("intern") || keyword.includes("manager")) {
//                     job_roles.push(keyword);
//                 }
//                 if (keyword.includes("python") || keyword.includes("java") || keyword.includes("machine learning") || keyword.includes("cloud") || keyword.includes("react")) {
//                     skills.push(keyword);
//                 }
//             } else {
//                 console.error("Invalid keywordObj format:", keywordObj);
//             }
//         });

//         return { JOB_ROLE: job_roles, SKILLS: skills };
//     } catch (error) {
//         console.error("Error extracting job details:", error.response ? error.response.data : error.message);
//         return { JOB_ROLE: [], SKILLS: [] };
//     }
// };

// // Function to extract stipend using regex
// const extractStipend = (emailText) => {
//     const stipendMatch = emailText.match(/\$?\d{3,6}(\s?(per month|per annum|p\.a\.|p\.m\.|year))/i);
//     return stipendMatch ? [stipendMatch[0]] : [];
// };

// // Main function to process email text
// const extractDetails = async (emailText) => {
//     console.log("Processing Email Text:", emailText); // Debugging email content

//     const nerData = await extractNER(emailText) || { ORG: [], DATE: [], LOCATION: [] };
//     const jobData = await extractJobDetails(emailText) || { JOB_ROLE: [], SKILLS: [] };
//     const stipend = extractStipend(emailText);

//     return {
//         ORG: nerData.ORG || [],
//         JOB_ROLE: jobData.JOB_ROLE || [],
//         DATE: nerData.DATE || [],
//         LOCATION: nerData.LOCATION || [],
//         STIPEND: stipend || [],
//         SKILLS: jobData.SKILLS || [],
//         DURATION: [] // Add duration extraction later if needed
//     };
// };

module.exports = { extractDetails };

function extractDetails(text) {
    if (!text) return {};  // Prevent undefined error

    const extractedData = {
       
        DEADLINE: []
    };

   

    // More effective Deadline Extraction (Handles: "Deadline: 5 March 2025", "Apply by March 5, 2025", "Last date to apply: 10/03/2025", "Last chance to apply: 5 Feb 2025")
    const deadlineRegex = /\b(?:deadline[:\s]*|apply\s*by[:\s]*|last\s*date\s*to\s*apply[:\s]*|registration\s*closes\s*on[:\s]*|last\s*chance\s*to\s*apply[:\s]*)\s*(\d{1,2}(?:st|nd|rd|th)?[\s-\/]?(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)[\s-\/]?\d{1,2}[\s-\/]?\d{4}|\d{4}[-\/]\d{1,2}[-\/]\d{1,2})\b/gi;
    extractedData.DEADLINE = [...text.matchAll(deadlineRegex)].map(match => match[1]);

    return extractedData;
}
module.exports = { extractDetails };







