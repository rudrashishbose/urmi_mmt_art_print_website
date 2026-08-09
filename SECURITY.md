# Security Policy

We take the security of this project seriously and appreciate responsible reports from the security community.

## Supported Versions

Security updates are currently provided for the following versions:

| Version | Supported |
| ------- | --------- |
| 5.1.x   | ✅         |
| 5.0.x   | ❌         |
| 4.0.x   | ✅         |
| < 4.0   | ❌         |

Users are strongly encouraged to run a currently supported version of the project.

## Reporting a Vulnerability

If you discover a potential security vulnerability, please report it privately rather than opening a public GitHub issue.

### Preferred Reporting Method

Use **GitHub's private vulnerability reporting / Security Advisories** feature for this repository.

If private vulnerability reporting is unavailable, contact the project maintainers at:

`security@example.com`

Replace this address with the appropriate security contact before publishing this policy.

Please include as much of the following information as possible:

* A description of the vulnerability
* The affected version or component
* Steps required to reproduce the issue
* Proof-of-concept code or screenshots, if applicable
* The potential security impact
* Any suggested mitigation or fix
* Your preferred contact information

Please avoid including sensitive information, credentials, API keys, customer data, or other secrets unless they are strictly necessary to demonstrate the vulnerability.

## What to Expect

After receiving a security report, we aim to:

1. **Acknowledge the report within 3 business days.**
2. **Provide an initial assessment within 7 business days.**
3. Keep the reporter informed while the issue is being investigated.
4. Develop and test a fix where appropriate.
5. Coordinate disclosure once affected users have had a reasonable opportunity to update.

Resolution timelines may vary depending on the complexity and severity of the vulnerability.

## Accepted Vulnerabilities

If a report is confirmed as a security vulnerability, we will:

* Determine its severity and affected versions.
* Work on an appropriate remediation.
* Release a security update where necessary.
* Publish a security advisory when appropriate.
* Credit the reporter in the advisory or release notes if they wish to be acknowledged.

Please allow us reasonable time to investigate and remediate the issue before publicly disclosing vulnerability details.

## Declined Reports

If we determine that a report does not represent a security vulnerability, we will explain our reasoning whenever possible.

Examples that may not qualify as security vulnerabilities include:

* Bugs without a meaningful security impact
* Issues affecting unsupported versions
* Social engineering attacks
* Denial-of-service attacks requiring excessive or unrealistic resources
* Missing security headers without a demonstrated security impact
* Reports generated solely by automated scanners without evidence of exploitability

## Responsible Disclosure

We ask security researchers to:

* Make a good-faith effort to avoid privacy violations, data destruction, and service disruption.
* Access only the data necessary to demonstrate the vulnerability.
* Do not exploit vulnerabilities beyond what is necessary to confirm their existence.
* Do not publicly disclose vulnerability details before remediation or coordinated disclosure.
* Do not attempt to access accounts or data belonging to other users.

We will make a reasonable effort not to pursue legal action against researchers who follow this policy and act in good faith.

## Security Best Practices

Users of this project should:

* Keep the project and its dependencies updated.
* Never commit passwords, API keys, tokens, or other credentials to the repository.
* Store secrets using environment variables or an appropriate secrets-management system.
* Follow the principle of least privilege when configuring access.
* Review security advisories and dependency alerts regularly.

## Security Updates

Security fixes may be communicated through:

* GitHub Security Advisories
* Release notes
* Repository releases
* Relevant project documentation

We recommend watching this repository and enabling GitHub security notifications to stay informed about important security updates.
