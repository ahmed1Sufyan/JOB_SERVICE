/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { NextFunction, Request, Response } from 'express';
import AIservice from '../services/AIservice';

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

        const { jobTitle, experienceLevel } = req.body as {
            jobTitle: string;
            experienceLevel: string;
        };

        try {
            const resp = await AI.generateTextAI({ jobTitle, experienceLevel });
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
}
