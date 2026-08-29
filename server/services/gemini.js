const { GoogleGenerativeAI } = require('@google/generative-ai');

/**
 * Clean and parse JSON response from Gemini
 */
function cleanAndParseJSON(text) {
  if (!text) throw new Error('Empty response received from AI model');
  
  // Remove markdown code block wrappers if present
  let cleaned = text.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json/, '').replace(/```$/, '').trim();
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```/, '').replace(/```$/, '').trim();
  }
  
  try {
    return JSON.parse(cleaned);
  } catch (err) {
    console.error('Failed to parse raw JSON from AI output:', cleaned);
    throw new Error('AI output was not valid JSON: ' + err.message);
  }
}

/**
 * Main Gemini AI Optimization Service
 */
async function optimizeResumeWithGemini(rawCVText, jobDescription) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is missing from environment variables');
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  
  // Model priority list ensuring compatibility across API key versions
  const candidateModels = [
    'gemini-3.6-flash',
    'gemini-2.5-flash',
    'gemini-1.5-flash',
    'gemini-flash-latest',
  ];

  const prompt = `
You are an expert Executive Resume Writer, Technical Recruiter, and Applicant Tracking System (ATS) Optimization Specialist.

Analyze the candidate's existing Raw CV/Resume text against the Target Job Description below.

--- RAW CV TEXT ---
${rawCVText || 'Not provided. Generate a high-quality candidate profile tailored to the job description.'}

--- TARGET JOB DESCRIPTION ---
${jobDescription || 'Not provided. Optimize the resume for a high-demand senior tech role.'}

--- INSTRUCTIONS ---
1. Calculate a realistic ATS Match Score (0 to 100) based on keyword overlap, relevant experience match, skill alignment, and standard formatting.
2. Provide a score breakdown for keywords, experience, skills, and format.
3. Identify matched keywords and critical missing keywords/skills from the Job Description.
4. Provide 3 to 5 actionable ATS improvement recommendations.
5. Create a completely rewritten, optimized, 100% ATS-compliant structured resume JSON.
   - Use high-impact action verbs (e.g., Architected, Optimized, Spearheaded, Engineered, Accelerated).
   - Incorporate metrics, percentages, and quantifiable achievements where appropriate.
   - Ensure professional summary directly aligns candidate with the target role.
   - Categorize technical skills cleanly into hardSkills, softSkills, and tools.

Return ONLY a valid JSON object matching EXACTLY this JSON structure:
{
  "atsScore": 85,
  "scoreBreakdown": {
    "keywords": 80,
    "experience": 90,
    "skills": 85,
    "format": 95
  },
  "targetJobTitle": "Extracted Job Title from Job Description",
  "matchedKeywords": ["React", "Node.js", "REST APIs", "TypeScript", "CI/CD"],
  "missingKeywords": ["GraphQL", "Docker", "Kubernetes", "AWS Lambda"],
  "atsRecommendations": [
    "Incorporate GraphQL experience explicitly in project bullet points.",
    "Add cloud deployment tools (AWS, Docker) to hard skills section.",
    "Ensure standard single-column typography is maintained."
  ],
  "optimizedData": {
    "personalInfo": {
      "fullName": "Candidate Name",
      "email": "candidate@example.com",
      "phone": "+1 (555) 019-2834",
      "location": "City, Country or Remote",
      "linkedin": "linkedin.com/in/candidate",
      "github": "github.com/candidate",
      "website": "candidate.dev"
    },
    "summary": "Impact-driven Software Engineer with 5+ years of experience building scalable web applications. Proficient in React, Node.js, and cloud architectures with a proven track record of reducing latency by 40% and deploying enterprise microservices.",
    "workExperience": [
      {
        "jobTitle": "Senior Full-Stack Engineer",
        "company": "Tech Solutions Inc.",
        "location": "San Francisco, CA",
        "startDate": "Jan 2022",
        "endDate": "Present",
        "bulletPoints": [
          "Architected microservices architecture handling 10M+ daily requests, improving system uptime to 99.99%.",
          "Engineered responsive user interfaces with React and Tailwind CSS, reducing page load times by 35%.",
          "Mentored 4 junior developers and led weekly code reviews to enforce software engineering best practices."
        ]
      }
    ],
    "education": [
      {
        "degree": "B.S. in Computer Science",
        "institution": "State University",
        "location": "Boston, MA",
        "graduationYear": "2021",
        "details": "Magna Cum Laude, Dean's List"
      }
    ],
    "skills": {
      "hardSkills": ["JavaScript (ES6+)", "TypeScript", "React.js", "Node.js", "Express", "MongoDB", "RESTful APIs", "SQL"],
      "softSkills": ["Agile/Scrum", "Cross-functional Leadership", "Problem Solving", "Code Review"],
      "tools": ["Git", "Docker", "Postman", "Vite", "Webpack", "Jira"]
    },
    "projects": [
      {
        "name": "E-Commerce Microservices Engine",
        "technologies": "React, Node.js, Express, MongoDB",
        "link": "github.com/candidate/ecommerce-app",
        "bulletPoints": [
          "Developed end-to-end payment pipeline processing 5k+ transactions with zero downtime.",
          "Implemented JWT authentication and RBAC security controls."
        ]
      }
    ],
    "certifications": [
      "AWS Certified Developer - Associate",
      "Meta Front-End Developer Professional Certificate"
    ]
  }
}
`;

  let lastError;
  for (const modelName of candidateModels) {
    try {
      console.log(`[Gemini Pipeline] Trying model: ${modelName}...`);
      const model = genAI.getGenerativeModel({
        model: modelName,
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.2,
        },
      });

      const result = await model.generateContent(prompt);
      const responseText = result.response.text();
      const parsedData = cleanAndParseJSON(responseText);
      console.log(`[Gemini Pipeline] Success with model: ${modelName}!`);
      return parsedData;
    } catch (err) {
      console.warn(`[Gemini Pipeline] Model ${modelName} failed: ${err.message}`);
      lastError = err;
    }
  }

  throw new Error(`Gemini AI Optimization failed across all available models: ${lastError ? lastError.message : 'Unknown error'}`);
}

module.exports = {
  optimizeResumeWithGemini,
};
