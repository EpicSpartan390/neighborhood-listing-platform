# Lab 5 reflection and individual contribution — draft for review

**Student:** Pedro Chavez-Luna  
**Assigned partner:** Anderson Mejia Sanchez  
**Repository:** https://github.com/EpicSpartan390/neighborhood-listing-platform  
**Branch:** `feature/database`

## Reflection

For Lab 5, I worked with AI assistance to build on the database and API already present in my neighborhood listing project. Reusing those files kept the work focused on missing requirements instead of creating a second implementation. The five related tables store user profiles, property listings, sponsors, sponsor connections, and inquiries.

One important correction was the owner's deletion rule. Ownership alone had allowed an owner to delete an approved listing. The new migration adds a draft-or-rejected status requirement while retaining the ownership and property-owner role checks. Keeping this correction in a new numbered file preserves the earlier migration history. I applied the saved files and verified the final policy in Supabase.

The testing also distinguishes different kinds of denial. A request can successfully return no visible or editable rows, or it can return a specific permission error. A network failure does not prove that an access rule worked. The Lab 5 audit captures the actual responses, checks protected records, and verifies restoration of fictional fixtures. Its 23 live checks passed on my development project. The separate 13 offline seed/audit tests and 43 application tests also passed; lint, TypeScript, and the production build completed successfully.

The webpage now loads approved listings through the existing API rather than importing the static listing array. I compared the returned values with the cards and checked favorites, details, filtering, the blocked-request error, and retry. A separate clean Supabase project successfully ran all three saved migrations and returned the expected five RLS-enabled tables and 16 policies. This checks schema reconstruction separately from live access behavior.

## My individual contribution

I created the `feature/database` branch, verified that my local environment file was ignored, obtained a Gemini Flash-Lite review through AI Studio, and used ChatGPT/Codex to evaluate and adapt the recommendations. I reviewed the prepared draft files in my own project, applied the migrations in Supabase, ran the seed and test commands on my laptop, and supplied the real results for inspection. I also provided the API response and homepage screenshot, confirmed the requested browser interactions, ran the credential-pattern/history checks, and performed the clean-project migration rebuild.

ChatGPT/Codex drafted the follow-up SQL, seed/audit scripts, UI integration, tests, and documentation. Gemini Flash-Lite supplied an independent schema/security review; its exact model version was not supplied. These tools assisted with implementation and review. The recorded test and database results came from my executions, not invented AI output.

Anderson Mejia Sanchez is my assigned partner. No completed Lab 5 contribution or PR-review evidence from Anderson has been supplied yet.
## Evidence and submission status

| Item | Evidence or status |
| --- | --- |
| Design and reviewed decisions | [database-design.md](database-design.md) |
| Original AI review input | [lab5-ai-review-prompt.txt](lab5-ai-review-prompt.txt) |
| AI use, accepted/rejected suggestions, actual verification | [ai-log.md](ai-log.md); associated Lab 5 commit pending |
| Role matrix and captured denial examples | [security-audit.md](security-audit.md) |
| 23 live role checks and fixture restoration | [lab5-live-evidence.json](lab5-live-evidence.json) |
| Seed and offline safety checks | [lab5-database-verification.md](lab5-database-verification.md) |
| 43 application tests, build, and browser checks | [lab5-ui-verification.md](lab5-ui-verification.md) |
| Clean schema rebuild | [lab5-rebuild-evidence.md](lab5-rebuild-evidence.md) |
| Lab 5 pull request | Pending creation and actual URL |
| Partner review/contribution | Pending actual evidence |
| Lab 5 deployment or demonstration URL | Pending; localhost was demonstrated, but no shareable Lab 5 URL is verified |
