# Security Policy

We take the security of this website and its users seriously.

If you discover a security vulnerability, please report it responsibly using the process below. Please **do not open a public GitHub issue for security vulnerabilities**.

---

## Supported Versions

Security updates are provided only for actively maintained releases.

| Version                     | Supported |
| --------------------------- | --------- |
| Latest production release   | ✅         |
| Previous maintained release | ✅         |
| Older releases              | ❌         |

Users should upgrade to the latest available version whenever possible.

---

# Reporting a Vulnerability

## Preferred Method

Please report vulnerabilities privately using:

**GitHub → Security → Report a vulnerability**

If GitHub Private Vulnerability Reporting is not enabled for this repository, contact:

`security@example.com`

> Replace this email address with the appropriate project security contact before publishing this file.

Do not include vulnerability details in:

* Public GitHub issues
* Pull requests
* Discussions
* Social media posts
* Public forums

---

## Information to Include

A useful vulnerability report should contain:

* A clear description of the vulnerability
* The affected page, API endpoint, feature, or component
* Steps to reproduce the issue
* Expected behavior
* Actual behavior
* Potential security impact
* Browser, device, or environment details where relevant
* Proof-of-concept code or screenshots where appropriate
* Suggested remediation, if known

Please avoid sending real credentials, private customer information, or unnecessary personal data.

---

# Response Timeline

We aim to:

* Acknowledge reports within **3 business days**
* Provide an initial assessment within **7 business days**
* Keep the reporter informed about meaningful progress
* Prioritize remediation based on severity and exploitability

Complex vulnerabilities may require additional investigation and testing.

---

# In-Scope Security Issues

Security reports are especially welcome for vulnerabilities involving the areas below.

## Authentication and Authorization

Examples include:

* Authentication bypass
* Unauthorized account access
* Privilege escalation
* Broken access control
* Session hijacking
* Insecure password-reset flows
* Authentication token leakage
* Improper authorization between users or roles

---

## API Security

Examples include:

* Unauthorized API access
* Missing authorization checks
* Insecure direct object references (IDOR)
* Excessive data exposure
* API key leakage
* Authentication bypass
* Mass assignment vulnerabilities
* Improper API rate limiting
* Server-side request forgery (SSRF)

API responses should expose only the minimum information required by the client.

---

## Injection Vulnerabilities

Reports involving injection attacks are considered high priority.

Examples include:

* SQL injection
* NoSQL injection
* Command injection
* Template injection
* LDAP injection
* Header injection
* Server-side code injection

All untrusted input should be validated and parameterized appropriately.

---

## Cross-Site Scripting

Examples include:

* Stored XSS
* Reflected XSS
* DOM-based XSS
* Unsafe HTML rendering
* Improper sanitization of user-generated content

User-controlled HTML, JavaScript, URLs, and rich-text content should be treated as untrusted.

---

## Cross-Site Request Forgery

State-changing requests should be protected where appropriate against Cross-Site Request Forgery (CSRF).

Examples include:

* Changing account information
* Updating passwords
* Submitting administrative actions
* Modifying stored customer information
* Deleting resources

---

# Secrets and Credentials

Secrets must never be committed directly to the repository.

This includes:

* API keys
* Database passwords
* Authentication secrets
* OAuth client secrets
* Private keys
* Access tokens
* JWT signing secrets
* SMTP credentials
* Cloud credentials
* Third-party service credentials

Secrets should instead be provided through:

* Environment variables
* Hosting-provider secret configuration
* CI/CD secret stores
* Dedicated secrets-management services

Files containing production secrets should never be committed, even temporarily.

Examples of files that normally should not be committed include:

```text
.env
.env.local
.env.production
.env.*.local
*.pem
*.key
credentials.json
service-account.json
```

An `.env.example` file may be included as long as it contains placeholders rather than real credentials.

Example:

```text
DATABASE_URL=
AUTH_SECRET=
API_KEY=
```

---

# Environment Variables

Client-side and server-side environment variables must be treated differently.

Sensitive values must never be exposed through variables that are bundled into browser-side JavaScript.

For example, environment variables using conventions such as:

```text
NEXT_PUBLIC_
VITE_
PUBLIC_
```

may become visible to website visitors depending on the framework.

Only values intentionally safe for public exposure should use public environment-variable prefixes.

---

# Authentication Secrets

Authentication-related secrets should:

* Be cryptographically random
* Be sufficiently long
* Be stored only in secure environment variables
* Never be exposed to browser code
* Be rotated if compromise is suspected

Passwords must never be stored in plaintext.

If the application manages passwords directly, passwords should be stored using a modern password-hashing algorithm such as:

* Argon2
* bcrypt
* scrypt

---

# Session Security

Authentication sessions should use appropriate security protections.

Where applicable:

* Cookies should use `HttpOnly`
* Cookies should use `Secure` in production
* Appropriate `SameSite` settings should be configured
* Session identifiers should not appear in URLs
* Sessions should expire appropriately
* Authentication tokens should be rotated where supported

---

# Database Security

Database access should follow the principle of least privilege.

Production database credentials should not provide unnecessary administrative permissions.

Application queries should:

* Use parameterized queries
* Avoid string concatenation for SQL
* Validate input
* Enforce authorization independently of client requests

The application must not rely solely on hidden UI controls for authorization.

---

# User Input

All user-controlled input should be considered untrusted.

Examples include:

* Contact forms
* Login forms
* Search fields
* URL parameters
* Query strings
* Headers
* File uploads
* Form fields
* JSON API payloads
* Rich-text editors

Validation should occur on the server even when client-side validation exists.

Client-side validation is primarily a usability feature and must not be treated as a security boundary.

---

# File Upload Security

If the website permits file uploads, uploaded files must be handled carefully.

Recommended protections include:

* Restricting permitted file types
* Validating MIME types
* Validating file extensions
* Limiting file size
* Generating server-side filenames
* Preventing directory traversal
* Storing uploads outside executable directories
* Preventing uploaded scripts from executing
* Malware scanning where appropriate

User-provided filenames must not be trusted directly.

---

# Contact Forms and Public Forms

Public forms should include appropriate abuse protections.

Depending on the application, this may include:

* Server-side validation
* Rate limiting
* Spam filtering
* CAPTCHA or bot detection
* Request-size limits
* Duplicate-submission protection

Form submissions should never allow arbitrary HTML or scripts to be executed.

---

# Rate Limiting

Sensitive and publicly accessible endpoints should be protected against automated abuse.

Examples include:

* Login
* Password reset
* Account registration
* Contact forms
* Search endpoints
* Email verification
* OTP requests
* Expensive API operations
* AI or LLM endpoints

Rate limiting should be enforced on the server rather than relying on frontend logic.

---

# Third-Party APIs

Third-party integrations should receive only the permissions required to operate.

API keys should be:

* Restricted where supported
* Scoped to minimum required permissions
* Rotated periodically
* Revoked immediately if exposed

Third-party responses should also be treated as untrusted input where appropriate.

---

# Dependency Security

Dependencies should be kept reasonably up to date.

The repository should use automated tooling where possible, such as:

* GitHub Dependabot
* GitHub dependency alerts
* npm audit
* pnpm audit
* yarn audit

Critical vulnerabilities in production dependencies should be reviewed promptly.

Lockfiles should normally be committed so that deployments use reproducible dependency versions.

Examples include:

```text
package-lock.json
pnpm-lock.yaml
yarn.lock
```

---

# GitHub Security

The repository should enable appropriate GitHub security functionality when available.

Recommended features include:

* Dependabot alerts
* Dependabot security updates
* Secret scanning
* Push protection
* Code scanning
* Private vulnerability reporting
* Branch protection rules

Production branches should require appropriate review before deployment.

---

# CI/CD Security

Deployment workflows should follow the principle of least privilege.

CI/CD pipelines should:

* Avoid printing secrets to logs
* Use encrypted repository or environment secrets
* Minimize token permissions
* Pin or review third-party GitHub Actions
* Separate production and development environments
* Require approval for sensitive production deployments where appropriate

Secrets should not be passed through command-line arguments when they may appear in logs.

---

# Production and Development Environments

Development, staging, and production environments should be logically separated.

Production credentials should not be reused in local development.

Where possible, use separate:

* Databases
* API keys
* Authentication applications
* Storage buckets
* Email providers
* Third-party integrations

Development data should not contain real customer information unless specifically required and appropriately protected.

---

# HTTPS

Production deployments must use HTTPS.

HTTP traffic should be redirected to HTTPS.

Sensitive information must never be transmitted over unencrypted HTTP connections.

---

# Security Headers

Production deployments should use appropriate browser security headers where practical.

Examples include:

```text
Content-Security-Policy
Strict-Transport-Security
X-Content-Type-Options
Referrer-Policy
Permissions-Policy
```

Frame restrictions should also be configured if the website should not be embedded by third-party sites.

---

# CORS

Cross-Origin Resource Sharing should be configured explicitly.

Avoid unrestricted configurations such as:

```text
Access-Control-Allow-Origin: *
```

for APIs containing private or authenticated information.

Only trusted origins should be permitted when credentials or sensitive resources are involved.

---

# Logging

Application logs should provide enough information to investigate security incidents without exposing sensitive data.

Logs should not intentionally contain:

* Passwords
* Authentication tokens
* API keys
* Private encryption keys
* Full credit-card information
* Session cookies

Sensitive personal data should also be minimized.

---

# Error Handling

Production error messages should not expose internal implementation details.

Avoid returning:

* Stack traces
* Database credentials
* SQL queries containing sensitive values
* Internal file paths
* Environment variables
* API secrets
* Infrastructure information

Detailed errors may be written to secure server logs while users receive generic error messages.

---

# Personal Data

The application should collect only personal data necessary for its intended functionality.

Personal information should not be:

* Publicly exposed unintentionally
* Included in URLs unnecessarily
* Stored in client-side logs
* Written to analytics systems without justification
* Included in error messages

Any privacy policy provided by the website should accurately describe the data being collected and how it is used.

---

# Analytics

Analytics and tracking services should not be given sensitive information unnecessarily.

Avoid transmitting:

* Passwords
* Authentication tokens
* Sensitive form contents
* Private customer information

URLs and page titles should also be reviewed to ensure they do not expose sensitive information through analytics platforms.

---

# AI-Generated Code

Parts of this project may be created or modified using AI-assisted development tools such as Codex.

AI-generated code must be treated the same as any other code contribution.

Before production deployment, generated code should be reviewed for:

* Authentication and authorization issues
* Secret exposure
* Injection vulnerabilities
* Incorrect trust assumptions
* Missing server-side validation
* Unsafe dependencies
* Insecure API endpoints
* Excessive permissions
* Client-side exposure of server secrets

AI-generated code should never be deployed solely because it compiles or passes basic functional testing.

---

# Security Review Before Deployment

Before deploying the website to production, maintainers should verify:

* No secrets are committed to Git
* Production environment variables are configured securely
* Authentication works as expected
* Protected routes enforce authorization server-side
* Input validation exists on API endpoints
* Database queries are parameterized
* File-upload restrictions are implemented where applicable
* HTTPS is enabled
* Security headers are configured
* CORS is appropriately restricted
* Rate limiting is enabled for abuse-prone endpoints
* Dependency vulnerabilities have been reviewed
* Production error messages do not expose internals
* Debug or development modes are disabled
* Administrative routes are protected
* GitHub security alerts are enabled

---

# Out-of-Scope Reports

The following are generally not considered vulnerabilities unless they demonstrate meaningful security impact:

* Missing security headers without a practical exploit
* Missing `autocomplete` attributes
* Self-XSS
* Clickjacking on pages containing no sensitive actions
* Logout CSRF without additional impact
* Username or email enumeration with negligible impact
* Version disclosure without a demonstrated vulnerability
* Vulnerabilities requiring physical access to an unlocked device
* Attacks requiring access to the victim's own authentication credentials
* Automated scanner reports without evidence of exploitability
* Denial-of-service attacks requiring unrealistic resources
* Vulnerabilities affecting unsupported versions only

We may still review these reports, but they may not receive the same priority as exploitable security vulnerabilities.

---

# Prohibited Security Testing

Please do not:

* Perform denial-of-service attacks
* Send excessive automated traffic
* Access another user's account or data
* Destroy or modify production data
* Upload malware
* Perform social-engineering attacks
* Attempt physical attacks against infrastructure or employees
* Exfiltrate more information than necessary to demonstrate a vulnerability
* Disrupt the availability of the website

Testing should stop immediately once sufficient evidence of a vulnerability has been obtained.

---

# Responsible Disclosure

Security researchers acting in good faith should:

1. Report vulnerabilities privately.
2. Provide enough information for us to reproduce the issue.
3. Avoid accessing unnecessary user information.
4. Avoid modifying or deleting production data.
5. Give us reasonable time to investigate and remediate the issue.
6. Coordinate public disclosure with the maintainers.

We will make reasonable efforts not to pursue legal action against researchers who follow this policy and conduct security research in good faith.

---

# Accepted Reports

If a vulnerability is confirmed, we may:

* Assign a severity level
* Develop and test a fix
* Release a security patch
* Notify affected users where appropriate
* Publish a GitHub Security Advisory
* Request a CVE where appropriate
* Credit the reporter if they wish to be acknowledged

Reporter credit is optional and will only be provided with the reporter's permission.

---

# Declined Reports

If we determine that a submission does not represent a security vulnerability, we will explain the decision whenever reasonably possible.

A declined report does not prevent the issue from being treated as a normal software bug.

---

# Security Updates

Security-related updates may be communicated through:

* GitHub Security Advisories
* GitHub Releases
* Release notes
* Project documentation

Users are encouraged to watch the repository and enable GitHub security notifications.

---

# Security Contact

For security-related concerns:

**GitHub:** Use the repository's private vulnerability reporting feature.

**Email:** `security@example.com`

Please replace the placeholder email before publishing this policy.

---

Thank you for helping keep this project and its users secure.
