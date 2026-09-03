# AI Collaboration Log



This document records how AI suggestions were evaluated, used, rejected, and verified during development.



## Stack Explanation Prompt



> Explain this proposed technology stack in plain language for a student with no previous web-development experience:

>

> Next.js App Router, React, TypeScript, Tailwind CSS, accessible HTML, ESLint, Node.js, npm, Git, GitHub, and Vercel.

>

> Explain what each technology does and how they work together. Do not provide code, terminal commands, installation steps, credentials, or invented results.



## Comparison



1\. Gemini organized the technologies into three categories: visual building blocks, support and engine room, and collaboration and deployment. ChatGPT explained the technologies in a single connected description.



2\. Gemini used beginner-friendly comparisons such as "engine room," "digital library," and "watch your back." ChatGPT used more direct descriptions, including how the App Router connects web addresses to pages.



## Work Log



| Tool | Prompt | Output used | Output rejected | Verification | Commit |

|---|---|---|---|---|---|

| ChatGPT | Plain-language stack explanation shown above | Used the descriptions of Next.js, React, TypeScript, Tailwind CSS, accessible HTML, ESLint, Node.js, npm, Git, GitHub, and Vercel. | Did not use unrelated setup instructions as part of the stack explanation. | Compared every named technology against the professor's required stack. No commands or credentials were claimed. | Document ChatGPT and Gemini stack comparison |

| Gemini | Same plain-language stack explanation prompt | Used its three-category organization and beginner-friendly comparisons. | Rejected the implication that TypeScript and ESLint make code completely error-free because they can catch some problems but cannot guarantee a program has no errors. | Confirmed that the response covered every required technology and did not contain code, commands, credentials, or invented results. | Document ChatGPT and Gemini stack comparison |

