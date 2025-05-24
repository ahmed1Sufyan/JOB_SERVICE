/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { NextFunction, Request, Response } from 'express';
import AIservice from '../services/AIservice';
import createHttpError from 'http-errors';
import pdf from 'pdf-parse';
import { UploadedFile } from 'express-fileupload';
import { Text } from '../types';
import logger from '../config/logger';
const AI = new AIservice();

// export function extractData(rawText : any) {
//     // Example: Using regex to extract Name, Email, etc.
//     const nameRegex = /Summary:\s*(.+)/;
//     const emailRegex = /Work Experience:\s*(.+)/;
//     const phoneRegex = /Phone:\s*(.+)/;
//     const dobRegex = /Date of Birth:\s*(.+)/;
//     const addressRegex = /Address:\s*(.+)/;

//     // if(!rawText) return
//     return {
//       name: rawText.match(nameRegex) ? rawText.match(nameRegex)[1] : null,
//       email: rawText.match(emailRegex) ? rawText.match(emailRegex)[1] : null,
//       phone: rawText.match(phoneRegex) ? rawText.match(phoneRegex)[1] : null,
//       dob: rawText.match(dobRegex) ? rawText.match(dobRegex)[1] : null,
//       address: rawText.match(addressRegex) ? rawText.match(addressRegex)[1] : null,
//       rawText: rawText, // Optionally include the raw text for reference
//     };
//   }
export class AiResponseController {
    async generateText(req: Request, res: Response, next: NextFunction) {
        // console.log(req.body);

        const file = req?.files?.resume as UploadedFile; // Assuming 'resume' is the key from the frontend
        const { type, jobTitle, experienceLevel, text } = req.body as {
            jobTitle: string;
            experienceLevel: string;
            type: string;
            text: string;
        };

        const extractTextFromPDF = async (pdfBuffer: Buffer) => {
            try {
                return await pdf(pdfBuffer);
            } catch (error) {
                logger.error('Error extracting text:', error);
            }
        };
        // function cleanJsonText(jsonString: string) {
        //     try {
        //         // Remove any unwanted characters and ensure it's properly formatted
        //         const fixedJsonString = jsonString
        //             .replace(/\n/g, '') // Remove newlines
        //             .replace(/\t/g, '') // Remove tabs
        //             .replace(/,\s*}/g, '}') // Remove trailing commas before }
        //             .replace(/,\s*]/g, ']'); // Remove trailing commas before ]

        //         // Parse the JSON
        //         const jsonData = JSON.parse(fixedJsonString);
        //         return jsonData;
        //     } catch (error) {
        //         logger.error("Invalid JSON format:", error);
        //         return null;
        //     }
        // }
        // function cleanJsonText(text: string): string {
        //     try {
        //         // Remove markdown syntax (if AI wraps in ```json ... ```)
        //         text = text.replace(/```json/g, '').replace(/```/g, '').trim();

        //         // Ensure the response is valid JSON
        //         return JSON.parse(text);
        //     } catch (error) {
        //         throw new Error("Invalid JSON response received from AI.");
        //     }
        // }

        function cleanJsonText(aiText: string) {
            try {
                // Remove non-JSON parts like explanations or additional AI-generated text
                const jsonMatch = aiText.match(/\{[\s\S]*\}/);
                if (!jsonMatch) throw new Error('No valid JSON found in input');

                const jsonString = jsonMatch[0]
                    .replace(/\/\/.*$/gm, '') // Remove single-line comments
                    .replace(/\/\*[\s\S]*?\*\//g, ''); // Remove multi-line comments

                // Parse and return a cleaned JSON object
                return JSON.parse(jsonString);
            } catch (error) {
                console.error('Invalid JSON:');
                return null;
            }
        }
        // console.log(type);
        console.log(req.body);

        // return next(createHttpError(400, "Data Invalid"))
        let prompt = ``;
        if (type == Text.jobdescription && jobTitle && experienceLevel) {
            prompt = ``;
        } else if (type == Text.recommendations) {
            prompt = `
            
            **AI MUST return a valid JSON response ONLY—NO extra text, NO markdown formatting, NO explanations.**  

AI will analyze the provided **user skills** and match them with **available skills** to determine the most relevant field for the user. AI must select the best matching **available skills** and provide structured JSON output.  

🚨 **STRICT INSTRUCTIONS:**  
1. **JSON response ONLY** – No extra text, markdown, or explanations.  
2. **AI must filter and select only relevant skills from available skills.**  
3. **AI must suggest the most suitable field based on matched skills.**  
4. **If no relevant match is found, AI must return an error JSON response.**  
5. **AI must provide structured, human-friendly feedback.**  
5. **Output should be JSON Format Strictly**  


## ✅ **JSON Format Example (for valid matches)**  
{
  "status": "success",
  "matched_skills": ["React.js", "Node.js", "MongoDB"],
  "recommended_field": "MERN Stack Development",
}

user skills :
${JSON.stringify(req.body?.skills)}

Available Skills
${JSON.stringify(req.body?.availableJobs)}

            `;
        } else if (type == Text.resume_review && file.data) {
            const resumedata = await extractTextFromPDF(file.data);
            console.log(resumedata);

            //             prompt = `
            //             **I need a detailed review of this resume. Analyze all aspects, including grammar, spelling, formatting, readability, and professional tone. Provide specific suggestions on how to improve it to make it more impactful. Give feedback on each section, such as Objective, Skills, Projects, Education, and Achievements. If there are any typos or grammatical errors, correct them and suggest improvements. The review should be structured and provide actionable feedback. Here is the resume data:"**

            // ${JSON.stringify(resumedata)}

            // This will ensure you get a thorough and valuable review!

            // - **Resume is valid:** AI will return a structured **JSON format** review.

            // **REMEMBER STRICTLY:**
            // **Data should be in Below Example like JSON format**

            // **JSON output example** :

            // {
            //   "status": "positive",
            //   "score": 85,
            //   "overview": "Your resume is strong, but there's room for improvement.",
            //   "summary": "This resume shows potential but needs significant restructuring and improvement to maximize its impact. The content is good, but the presentation and wording need work.",
            //   "key_insights": {
            //     "strong_skills_section": "Your technical skills are well-presented and relevant to the industry. Consider grouping them by proficiency level for even better organization.",
            //     "improve_work_experience_descriptions": "Use more action verbs and quantify your achievements. For example, instead of 'Responsible for project management', try 'Led a team of 5 to successfully deliver 3 major projects, resulting in a 20% increase in client satisfaction'.",
            //     "optimize_for_ats": "Include more industry-specific keywords throughout your resume. We've identified 15 relevant keywords that are missing from your current version."
            //   },
            //   "sections": {
            //     "professional_summary": {
            //       "score": 90,
            //       "feedback": "Highlight your unique value and major achievements."
            //     },
            //     "work_experience": {
            //       "score": 80,
            //       "feedback": "Use action verbs and quantify achievements."
            //     },
            //     "skills": {
            //       "score": 95,
            //       "feedback": "Well-presented. Consider grouping by proficiency."
            //     },
            //     "education": {
            //       "score": 85,
            //       "feedback": "Add key coursework or achievements."
            //     }
            //   },
            //   "improvements": [
            //     "Optimize for ATS by adding relevant keywords.",
            //     "Quantify achievements with numbers and percentages.",
            //     "Enhance summary to showcase unique strengths."
            //   ],
            //   "comparison": {
            //     "your_resume": {
            //       "keyword_optimization": 80,
            //       "quantifiable_achievements": 60,
            //       "ats_compatibility": 90
            //     },
            //     "industry_standard": {
            //       "keyword_optimization": 75,
            //       "quantifiable_achievements": 70,
            //       "ats_compatibility": 80
            //     }
            //   }
            // }

            // - **Resume is incomplete and not valid:** AI will return an error message.
            // {
            //   "status": "error",
            //   "message": "Invalid or incomplete resume data provided.",
            //   "suggestion": "Please ensure all required fields are provided in the correct format."
            // }

            // This version keeps it clean, readable, and structured while retaining all key details. 🚀
            //             `
            prompt = `
**I need a detailed, in-depth, and structured review of this resume in JSON format ONLY. AI MUST return a valid JSON response—NO extra text, NO markdown formatting, NO explanations.**  

AI must analyze all aspects of the resume, including **grammar, spelling, formatting, readability, ATS optimization, and professional tone**. Provide **structured, actionable feedback** for improvement. Evaluate key sections like **Objective, Skills, Projects, Education, and Achievements**. **Correct any typos or grammatical errors and suggest enhancements.**  

🚨 **STRICT INSTRUCTIONS: AI MUST RETURN A VALID JSON RESPONSE ONLY**  
1. **Data must be in JSON format ONLY** – No extra text, markdown, or explanations.  
2. **If resume data is valid:** AI must return a **structured JSON review** with detailed insights.  
3. **If resume data is incomplete or invalid:** AI must return an **error JSON response**.  
4. **Use simple, human-friendly language for easy understanding.**  
5. **AI MUST NOT copy words from the example below; it must generate unique and original responses.**  
6. **Explain each properties like in the example data in depth and detailed**

---

## ✅ **JSON Format Example (for valid resume data)**  

  {
    "status": "positive",
    "score": "82%",
    "overview": "Strong technical foundation, but resume could benefit from enhanced storytelling and ATS optimization.",
    "strengths": [
      "Strong technical expertise in MERN stack.",
      "Well-organized skills section covering multiple technologies.",
      "Professional and engaging tone throughout the resume."
    ],
    "weaknesses": [
      "Lacks measurable impact in projects.",
      "Needs a stronger personal branding statement in summary.",
      "Some sections could be more ATS-friendly."
    ],
    "summary_readability": {
      "score": 70,
      "description": "Summary is concise but lacks specific career goals or unique value proposition."
    },
    "tone_and_professionalism": {
      "score": 92,
      "feedback": "Tone is enthusiastic and professional, yet could be more polished in certain sections."
    },
    "common_mistakes": {
      "spelling_errors": 0,
      "grammar_issues": 3,
      "wordiness": "Some project descriptions are overly brief, lacking depth."
    },
    "ats_compatibility": {
      "score": 78,
      "feedback": "Resume is ATS-friendly but can be improved by adding industry-specific keywords and avoiding excessive formatting elements like tables or images."
    },
    "readability_score": {
      "score": 80,
      "feedback": "The resume is easy to read, but certain sections (e.g., projects) could be simplified for better clarity."
    },
    "recruiter_first_impression": {
      "positive": [
        "Clear and well-structured layout.",
        "Easy to find key information (skills, experience, projects)."
      ],
      "negative": [
        "Objective statement could be more targeted.",
        "Some sections lack strong impact (e.g., achievements)."
      ]
    },
    "job_match": {
      "target_role": "Frontend Developer (React.js)",
      "score": 85,
      "missing_elements": ["Experience with TypeScript", "Familiarity with GraphQL"],
      "feedback": "The resume is well-aligned, but adding experience with TypeScript and GraphQL could improve job match."
    },
    "soft_skills_analysis": {
      "score": 75,
      "detected_skills": ["Problem-solving", "Teamwork", "Adaptability"],
      "missing_skills": ["Leadership", "Communication"],
      "feedback": "You have good teamwork and problem-solving skills, but consider emphasizing leadership and communication."
    },
    "key_insights": {
      "strong_technical_skills": "Impressive list of programming skills and technologies.",
      "enhance_project_impact": "Quantify project achievements and highlight personal contributions.",
      "optimize_for_ats": "Incorporate more industry-specific keywords throughout the resume."
    },
    "action_plan": {
      "day_1": "Refine objective statement to be more targeted.",
      "day_2": "Add impact-based metrics to project descriptions.",
      "day_3": "Improve ATS compatibility by inserting missing industry keywords.",
      "day_4": "Highlight soft skills like leadership and communication.",
      "day_5": "Proofread for grammar and consistency.",
      "day_6": "Run the resume through an ATS scanner to check improvements.",
      "day_7": "Final review and formatting adjustments."
    },
    "human_friendly_feedback": "You have a solid foundation in MERN stack development. To enhance your resume, focus on telling the story behind your projects and achievements, and ensure it's optimized for applicant tracking systems."
  }


 ## ❌ **JSON Format Example (for invalid resume data)**  
{
  "status": "error",
  "message": "Invalid or incomplete resume data provided.",
  "suggestion": "Ensure all required fields are included in the correct format before submitting."
}

🚀 **AI MUST strictly return JSON-formatted responses ONLY. If AI fails to follow this, retry the request.**  

Here is the resume data to analyze:  
${JSON.stringify(resumedata)}
 `;
        } else if (type == 'chatbot' && text) {
            prompt = ` ${JSON.stringify(text)}
🚨 **STRICT INSTRUCTIONS: AI MUST RETURN A VALID JSON RESPONSE ONLY**  
1. **Data must be in JSON format ONLY** – No extra text, markdown, or explanations.  
4. **Use simple, human-friendly language for easy understanding.**  
5. **AI MUST NOT copy words from the example below; it must generate unique and original responses.**  
6. **Explain each properties like in the example data in depth and detailed**
7 **Provide only the roadmap steps and details without any title or heading.**
8 **Generate the JSON output without including 'DevOps Engineer Roadmap' or any extra headings.**
9 **Exclude the title or any introductory text and only return the structured JSON.**
---


## ✅ **JSON Format Example **  


**Example Output:**

json
{
  title : "Software Enginner Road Map"
  "status": "success",
  "response_length": "long",
  "query_type": "career_roadmap",
  "message": "to become an AI Engineer follow these roadmap:",
  "roadmap": {
    "total_steps": 6,
    "steps": [
      {
        "step": 1,
        "title": "Mathematics",
        "details": "Linear Algebra, Probability, aur Statistics seekhein. AI models ko samajhne ke liye yeh zaroori hai."
      },
      {
        "step": 2,
        "title": "Programming",
        "details": "Python aur data structures samjhein. Numpy, Pandas, aur OOP concepts practice karein."
      },
      {
        "step": 3,
        "title": "Machine Learning",
        "details": "Supervised aur unsupervised learning concepts explore karein. Scikit-learn ka istemal karein."
      },
      {
        "step": 4,
        "title": "Deep Learning",
        "details": "Neural networks aur architectures jaise CNN, RNN, Transformer models samjhein. PyTorch ya TensorFlow use karein."
      },
      {
        "step": 5,
        "title": "AI Projects",
        "details": "Kaggle competitions, GitHub projects aur open-source contributions karein. Real-world data sets pe kaam karein."
      },
      {
        "step": 6,
        "title": "Internships & Jobs",
        "details": "AI internships karein aur LinkedIn, Indeed aur job portals pe apply karein. Portfolio aur resume strong banayein."
      }
    ]
  },
  "resources": {
    "books": [
      "Deep Learning with Python - Francois Chollet",
      "Hands-On Machine Learning - Aurélien Géron"
    ],
    "courses": [
      "Machine Learning - Andrew Ng (Coursera)",
      "Deep Learning Specialization - Andrew Ng",
      "Fast.ai Deep Learning Course"
    ],
    "tools": [
      "Jupyter Notebook",
      "Google Colab",
      "TensorFlow",
      "PyTorch"
    ]
  },
  "recommendations": {
    "practice": [
      "Har din coding aur ML models implement karein.",
      "Leetcode aur Codeforces pe data structures aur algorithms practice karein."
    ],
    "networking": [
      "LinkedIn pe AI professionals ko follow karein.",
      "Tech conferences aur webinars me participate karein."
    ],
    "career_tips": [
      "Internships aur freelancing projects karein.",
      "AI research papers padhne ki aadat banayein."
    ]
  }
}


          `;
        } else {
            return next(createHttpError(400, 'Data Invalid'));
        }

        // if ((!jobTitle && !experienceLevel) || !req.files) {
        //     return next(createHttpError(400, "Data Invalid"))
        // }

        try {
            let resp;
            if (type == 'chatbot') {
                resp = await AI.chatbot(prompt);
            } else if (type == 'jobdescription') {
                resp = await AI.generateTextAI('');
            } else {
                resp = await AI.generateTextAI(prompt);
            }
            console.log(resp);

            if (resp && (resp.includes('```json') || resp.includes('```'))) {
                resp = cleanJsonText(resp);
            }
            return res.json({
                data: resp,
            });
        } catch (error) {
            next(error);
        }

        // const uploaded : UploadedFile  = req?.files!.resume as UploadedFile;
        // const filePath = './uploads/' + uploaded.name;

        // // Save the file to disk
        // uploaded.mv(filePath,  async(err : Error) => {
        //   if (err) {
        //     return res.status(500).send(err);
        //   }
        //   try {
        //     // Read and parse the PDF file
        //     const dataBuffer = fs.readFileSync(filePath);
        //     const pdfData = await pdfParse(dataBuffer);

        //     // Extract the raw text from the PDF
        //     const rawText = pdfData?.text;

        //     // Structure the data (e.g., using regex to extract fields)
        //     const structuredData = extractData(rawText);
        //   await  AI.generateTextAI(structuredData)
        //     // Send the structured data as a response
        //   return   res.json(structuredData);
        //   } catch (error) {
        //     res.status(500).send(`Error extracting data from the PDF.${error}`);
        //   }

        // })
    }
    async TestAI(req: Request, res: Response, next: NextFunction) {
        const { text } = req.body;

        try {
            const resp = await AI.generateText(text as string);

            res.json({
                data: resp,
            });
        } catch (error) {
            next(error);
        }
    }
}
