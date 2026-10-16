# Feature: Login

1. User story
As a registered user, I want to log in with my email and password, so that I can receive an httpOnly JWT cookie for secure site access.

Acceptance criteria:
- Given valid credentials, when I POST /api/auth/login, then the server responds with 200 and sets an httpOnly cookie with the JWT.
- Given an invalid email or password, when I POST /api/auth/login, then the server responds with 401 Unauthorized.
- Given a malformed request body, when I POST /api/auth/login, then the server responds with 400.
- Given a missing cookie on a protected route, when the route is accessed, then the server responds with 401.

Failure case included:
- Given a wrong password, the server responds with 401.

2. Pseudocode
- Parse body: { email, password }
- Validate required fields
- Look up the user by email
- If the user does not exist, return 401
- Verify the password against the stored argon2 hash
- If verification fails, return 401
- Create a JWT with the user id and expiry
- Set the JWT in an httpOnly cookie
- Return 200 with the user summary without the password hash

3. Flowchart
```mermaid
flowchart TD
  A[POST /api/auth/login] --> B{Valid body?}
  B -- No --> C[400]
  B -- Yes --> D[DB: find user by email]
  D -- not found --> E[401]
  D -- found --> F[argon2.verify(hash, password)]
  F -- false --> E[401]
  F -- true --> G[Sign JWT]
  G --> H[Set auth_token cookie]
  H --> I[200 { id, email, name }]
```

4. Hand trace
Inputs:
- Happy path: email = ______, password = ______
- Failure path: email = "alice@example.com", password = "wrongpass"

| Step | Line of pseudocode | Variable values | Output |
|---|---:|---|---|
| 1 | Parse body | email=..., password=... | parsed object |
| 2 | Find user by email | email | user / null |
| 3 | Verify password | user.passwordHash, password | true/false |
| 4 | Create JWT | user.id | token |
| 5 | Set cookie | token | Set-Cookie header |
| 6 | Return | user summary | 200 response |

<details>
<summary>Answer key (happy path example)</summary>

Example:
- Input: email = "bob@example.com", password = "Secur3P@ss!"
- DB returns user { id: 42, email: "bob@example.com", passwordHash: "$argon2id$..." }
- argon2.verify -> true
- signJWT -> "eyJ..."
- Set-Cookie -> auth_token=eyJ...; HttpOnly; SameSite=Lax
- Response -> 200 { id: 42, email: "bob@example.com", name: "Bob" }

Failure:
- Wrong password -> verify -> false -> 401 Unauthorized

</details>
