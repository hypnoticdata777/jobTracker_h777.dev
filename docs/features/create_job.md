# Feature: Create Job

1. User story
As an authenticated user, I want to create a new job record, so that I can capture roles I am interested in and track them later.

Acceptance criteria:
- Given an authenticated user and valid job details, when I POST /api/jobs, then the job is created and returns 201 with the saved record.
- Given missing required fields (title or company), when I POST /api/jobs, then the server responds with 400.
- Given an unauthenticated request, when I POST /api/jobs, then the server responds with 401.
- Given a URL that is malformed, when I POST /api/jobs, then the server responds with 400.
- Given an invalid request body, when I POST /api/jobs, then the server responds with 400.

Failure case included:
- Given no auth cookie, the server rejects with 401.

2. Pseudocode
- Confirm that the request is authenticated and req.user exists
- Read body fields: title, company, location, description, url
- Validate required fields and URL format
- Create a job using the current user id as createdBy
- Save it to the database
- Return 201 with the created job object

3. Flowchart
```mermaid
flowchart TD
  A[POST /api/jobs] --> B[Auth middleware: req.user?]
  B -- No --> C[401 Unauthorized]
  B -- Yes --> D{Validate body}
  D -- invalid --> E[400 Validation errors]
  D -- valid --> F[DB: insert job with createdBy=req.user.id]
  F --> G[201 Created { job }]
```

4. Hand trace
Inputs:
- Happy path: title = ______, company = ______, userId = ______
- Failure path: title = "", company = "Acme"

| Step | Line of pseudocode | Variable values | Output |
|---|---:|---|---|
| 1 | Auth middleware | req.cookies.auth_token -> userId | req.user |
| 2 | Parse body | title, company, location | parsed object |
| 3 | Validate | title, company | pass/fail |
| 4 | Insert job | title, company, createdBy | job row |
| 5 | Return | created record | 201 response |

<details>
<summary>Answer key (happy path example)</summary>

Example:
- title = "Frontend Engineer", company = "Acme", userId = 42
- Validation passes
- DB insert creates row { id: 101, title: "Frontend Engineer", company: "Acme", createdBy: 42 }
- Response -> 201 { id: 101, title: "Frontend Engineer", company: "Acme", createdBy: 42 }

Failure:
- title = ""
- validation -> fail -> 400 { error: ["Title is required"] }

</details>
