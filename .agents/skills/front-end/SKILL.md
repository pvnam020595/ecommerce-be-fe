---

name: front-end
description: Implement front-end development best practices and standards for React, TypeScript, and Redux in a Laravel 12 API context. Use this skill ensure that all development, review code, refactoring, and testing adheres to the specified rules and conventions.
--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
# Strict Rule
Before implementing any front end coding, ensure that the following rules are strictly followed:
1. Read all content in the .agents/rules/front-end/coding.md file and ensure that all coding adheres to the specified rules and conventions.
2. Read code front end in the path front-end/src and brainstorm the best approach to implement reque
3. If file rule missing please report it. Do not create any file rule or anounce alrady read it.
4. Apply all the rules related to file, react components, redux, typescript, and laravel api conventions as specified in the .agents/rules/front-end/coding.md file.

# Workflow
1. Read the user request and understand the requirements.
## step 1 Understand the requirements
  - Brainstorm the best approach for implement and write the result analyze into the folder .agents/brainstorm/front-end. 
  - Identify the specific frontend task or feature requested by the user.
  - Determine affected components, page, functions, or modules in the front-end codebase.
  - Clear the requirements with the user if any ambiguity exists.
## step 2 Read and verrify the coding rules
  - Read the rule in the path .agents/rules/front-end/coding.md and ensure that all coding adheres to the specified rules and conventions.
  - If any rule is missing, report it to the user. Do not create any new rule or announce already read rules.
  - Identify rule relevanted to the requested change
## step 3 Implement the code
  - Explode codebase in path `front-end/src`.
  - Trace components, pages, function and data flow related to the requested change.
  - Check existing components, pages, function, redux state, actions, reducers, and API integrations for reusability.
  - Implement the requested change following the coding rules and conventions.
## Step 4 Implement
  - Flow the existing project's architecture and coding standards.
  - Reuse existing components and styles where appropriate.
  - Folow rule code in path .agents/rules/front-end/coding.md and implement the requested change.
  - Folow rule code responsive SP, Tablet, PC in path .agents/rules/front-end/responsive-ui-implementation.md and implement the requested change.\
## Step 5 Test
  - Test the implemented change across SP, Tablet, and PC to ensure responsive behavior.
  - Verify that the change does not introduce any regressions or break existing functionality.
  - Ensure that all new code is covered by unit tests and integration tests as appropriate.
## Step 6 Review
  - `ALWAYS` run command `npm run lint`
  - `ALWAYS` run command  `npm run dev` for local development and testing.
## Step 7 Report
  - Report the implementation details, testing results, and any issues encountered during the process to the user.
  
