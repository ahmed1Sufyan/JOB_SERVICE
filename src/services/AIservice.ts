/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-misused-promises */

import { GoogleGenerativeAI } from '@google/generative-ai';
import { configDotenv } from 'dotenv';
configDotenv();
// const generateTextAI = (message: string) => {
//     const genAI = new GoogleGenerativeAI(process.env.API_KEY!);
//     const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
//     const rl = readLine.createInterface({
//         input: process.stdin,
//         output: process.stdout,
//     });
//     const chat = model.startChat({
//         history: [],
//         generationConfig: {
//             maxOutputTokens: 100,
//         },
//     });

//     function askAndRespond() {
//         rl.question('you :', async (msg) => {
//             if (msg.toLowerCase() == 'exit') {
//                 rl.close();
//             } else {
//                 const result = await chat.sendMessage(msg);
//                 const res = result.response;
//                 const txt = res.text();
//                 console.log('AI :', txt);
//                 askAndRespond();
//             }
//         });
//     }
//     askAndRespond();
//     // const prompt = message;

//     // const result = await model.generateContentStream(prompt);

//     // Print text as it comes in.
//     // for await (const chunk of result.stream) {
//     //     const chunkText = chunk.text();
//     //     process.stdout.write(chunkText);
//     //     log(chunkText);
//     // }
// };

export default class AIservice {
    // @ts-expect-err0r
    async generateTextAI(text: { jobTitle: string; experienceLevel: string }) {
        console.log(text);

        const genAI = new GoogleGenerativeAI(process.env.API_KEY!);

        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const prompt = `I am building an interview preparation app where users practice interviews without explicitly mentioning the job title ${text.jobTitle} of ${text.experienceLevel}. Based on the given role and required skills, 
        generate a detailed job description focusing on the responsibilities, expectations, and skills relevant for the role. Do not create a general 
        job posting format but rather focus on providing content suitable for interview practice, emphasizing problem-solving scenarios, technical 
        challenges, and behavioral expectations;
        give response to follow the below given example do not add any special characters etc 
        *Strictly Remember* use the easy human understable words which help to understand 

        **Example** : 
        Job Title: Junior Frontend Developer

        Overview:
        We are seeking a motivated and enthusiastic Junior Frontend Developer to join our dynamic team. In this role, you will play a significant part in creating engaging and user-friendly web applications that enhance our clients' experiences. You will work closely with designers and backend developers while gaining valuable experience and knowledge in frontend technologies.

        Key Responsibilities and Duties:
        - Collaborate with the design team to implement and maintain user interfaces for web applications.
        - Write clean, maintainable, and efficient code in HTML, CSS, and JavaScript.
        - Assist in the development of responsive web designs to ensure optimal performance across different devices.
        - Participate in code reviews, providing and receiving constructive feedback to improve code quality.
        - Troubleshoot and debug issues with frontend applications to enhance functionality and user experience.
        - Stay updated on emerging frontend technologies and industry trends to continuously improve skills and knowledge.

            Required Qualifications and Skills:
            - 1-3 years of experience in frontend development or a related field.
            - Understanding of web development principles, including HTML, CSS, and JavaScript.
            - Familiarity with version control systems, preferably Git.
            - Basic knowledge of responsive design and accessibility standards.

            Technical Skills or Tools Required:
            - Proficient in HTML5, CSS3, and JavaScript.
            - Familiarity with JavaScript frameworks such as React, Vue.js, or Angular is a plus.
            - Experience with CSS preprocessors like SASS or LESS is desirable.
            - Understanding of RESTful APIs and AJAX for dynamic content loading.

            Ideal Candidate:
            The ideal candidate will be a proactive and passionate individual with a solid understanding of frontend development principles. You should be eager to learn and grow, bring creative ideas to the table, and possess strong problem-solving skills. A collaborative attitude and the ability to communicate effectively with teammates will be essential for success in this role. If you are excited about building innovative web applications and making a real impact, we would love to hear from you.
        `;

        const result = await model.generateContent(prompt);
        return result.response.text();
    }
}
