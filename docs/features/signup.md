# Feature: Signup (Register)

1. User story
As a new user, I want to create an account with my email and password, so that I can store and manage my job applications securely.

Acceptance criteria:
- Given a valid email and password, when I POST /api/auth/register, then a new user is created and a 201 response returns the user id and email (no password).
- Given an email already in use, when I POST /api/auth/register, then I receive a 409 conflict with an appropriate error message.
- Given an invalid password (too short), when I POST /api/auth/register, then I receive a 400 validation error.
- Given malformed request body, when I POST /api/auth/register, then I receive a 400 error.
- Given missing fields, when I POST /api/auth/register, then the server responds with a 400 listing missing fields.

Failure case included:
- Given an email that already exists, the server rejects with 409.

2. Pseudocode
- Parse body: { email, password, name? }
- Validate email format and password length
- Check if a user record exists for the email
- If a user exists, return 409 conflict
- Hash the password with argon2id
- Save the user record to the database
- Return a 201 response with id, email, and name only

3. Flowchart
```mermaid
flowchart TD
  A[POST /api/auth/register] --> B{Valid JSON?}
  B -- No --> C[400 Bad Request]
  B -- Yes --> D{Email valid and password strong?}
  D -- No --> E[400 Validation Error]
  D -- Yes --> F[DB: find user by email]
  F -- exists --> G[409 Conflict]
  F -- not exists --> H[Hash password with argon2id]
  H --> I[DB: create user]
  I --> J[201 Created { id, email, name }]
```

4. Hand trace
Pick two concrete inputs:
- Happy path: email = ______, password = ______, name = ______
- Failure path: email = "alice@example.com", password = "short", name = "Alice"

| Step | Line of pseudocode | Variable values | Output |
|---|---:|---|---|
| 1 | Parse body | email=..., password=..., name=... | parsed object |
| 2 | Validate | email, password | pass/fail |
| 3 | Find user by email | email | userExists? |
| 4 | Hash password | password | hash value |
| 5 | Create user | email, hash, name | new user row |
| 6 | Return | created user | 201 response |

<details>
<summary>Answer key (happy path example)</summary>

Happy path example:
- Input: email = "bob@example.com", password = "Secur3P@ss!", name = "Bob"

Step outputs:
1) parsed object -> { email: "bob@example.com", password: "Secur3P@ss!", name: "Bob" }
2) validation -> pass
3) find user -> no rows
4) argon2.hash -> "$argon2id$..."
5) insert -> DB row with id = 42
6) response -> 201 { id: 42, email: "bob@example.com", name: "Bob" }

Failure case:
- email = "alice@example.com", password = "short"
- validation -> fail -> 400 { error: ["Password must be at least 8 characters long"] }

</details>
