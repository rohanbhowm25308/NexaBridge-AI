# NexaBridge AI — Integration Architecture Design

**Status:** Prototype architecture and production target design  
**Internship:** Nexever · AI Integration · Task 02  
**Scope:** Email, Drive, Ticketing, CRM, Chat

## 1. Executive summary
NexaBridge AI proposes a controlled integration layer between an enterprise assistant and five company systems. The primary objective is to let employees use authorized information without granting the AI unrestricted system access. The included Flask implementation is an offline demonstration using synthetic records; all real integrations described below are future production designs.

## 2. Architecture and trust boundaries
```text
Employee / Manager / Admin
          |
    Identity provider (OIDC + MFA) [production target]
          |
 API Gateway / Session / Rate Limiting
          |
 Authorization Policy Engine (RBAC + source ACL + purpose)
          |
 Data classification, redaction, DLP and approval gate
          |
 AI Orchestrator (tool allowlist, constrained context)
          |
 Connector adapters + per-user OAuth token broker
    |        |          |          |       |
  Email    Drive     Ticketing     CRM     Chat
          |
 Audit event pipeline --> centralized SIEM [production target]
```
The gateway, policy engine and connectors form a trusted internal boundary. Any external AI provider is a separate data-processing boundary. Only specifically permitted, minimized data may cross it, under a suitable contract and retention policy. For the prototype, no external AI provider is called.

## 3. Five integration contracts
| System | Example platform | Initial permitted operations | Writes | High-risk content |
|---|---|---|---|---|
| Email | Gmail / Outlook | Read own permitted message metadata and selected body text | Draft only with user approval | Private mail, attachments, credentials |
| Drive | Google Drive / SharePoint | Search and read ACL-authorized documents | Disabled by default | HR, legal, confidential folders |
| Ticketing | Jira / Zendesk | Read assigned or permitted tickets | Suggest edits; approval for updates | Vulnerability reports, personal data |
| CRM | Salesforce / HubSpot | Read authorized account fields | Explicit approval for updates | Customer identifiers, financial details |
| Chat | Slack / Teams | Read channels user can access | Draft messages; approval for posting | Private channels, incident discussions |

All connector operations are **deny by default**, independently authenticated, scoped and audited. Never infer authorization merely because an LLM requests a tool call.

## 4. Authentication and authorization
Production target: corporate SSO using OIDC, MFA, short-lived sessions, and OAuth 2.0 Authorization Code + PKCE for user-delegated connectors. Request only documented provider scopes. Store refresh tokens encrypted in a managed secrets vault, rotate/revoke on role changes, and avoid logging tokens. Use per-user delegated access where possible. Validate provider ACLs on every retrieval and re-check permission before any action. Service accounts are exceptional, separately reviewed and tightly scoped.

The demo instead uses local role passwords and Flask sessions. It does not implement OIDC or OAuth.

## 5. Least-privilege matrix
| Role | Email | Drive | Tickets | CRM | Chat | Audit viewer |
|---|---|---|---|---|---|---|
| Employee | Internal only | Internal only | Internal only | Deny | Internal only | Deny |
| Manager | Internal | Internal | Internal | Internal + confidential | Internal | Deny |
| Admin | Internal + confidential | Internal + confidential | Internal + confidential | Internal + confidential | Internal + confidential | Allow |

The demo implements this simplified role policy. Restricted records are blocked for **all** roles, including admins. A production deployment must combine roles with actual provider resource ACLs and explicit purpose restrictions.

## 6. Data that must never leave approved company boundaries
- Authentication secrets, passwords, private keys, signing keys, API tokens and recovery codes.
- HR payroll, medical, disciplinary or protected personnel records without a separately approved lawful workflow.
- Regulated personal or payment data unless there is an explicitly approved compliant processing path.
- Privileged legal communications, unreleased strategic plans, and security incident evidence marked non-exportable.
- Any document classified `restricted`, regardless of user role, for external AI processing.

These are **default prohibitions for the proposed design**, not universal legal categories. A data owner and security/legal team must define the organization's final classification policy. Keep blocked data within the appropriate internal systems; do not send it to third-party model providers, telemetry, logs or analytics.

## 7. Data-flow controls
1. Authenticate the user and verify connector consent.
2. Evaluate role, user ACL, resource classification, requested purpose and tool operation.
3. Retrieve the minimum permitted fields; block restricted documents.
4. Apply robust data-loss prevention, masking and output controls before any model call.
5. Treat retrieved content as untrusted; never execute instructions embedded in email or documents.
6. Require human approval for sending, posting, deleting, exporting or modifying records.
7. Reauthorize actions server-side and record the decision.
8. Return only permitted answers, with citations to source record IDs.

## 8. Audit logging and monitoring
Log UTC timestamp, actor, session/request ID, connector, action, resource ID, policy decision, reason and approval ID where applicable. Never log raw credentials, unrestricted document bodies or full prompts containing personal information. Ship logs to a central tamper-resistant SIEM, protect access, apply retention schedules and alert on unusual bulk access, repeated denials, token abuse and data export. The prototype stores a smaller audit schema in SQLite.

## 9. Threats and mitigations
| Threat | Mitigation |
|---|---|
| Prompt injection from emails or files | Tool isolation, untrusted-context handling, allowlisted actions, approval |
| OAuth token theft | Vault encryption, short lifetimes, rotation and revocation |
| Excessive permissions | Minimum scopes, periodic access reviews, per-resource ACL checks |
| Sensitive data leakage | Classification, minimization, DLP, no-export policies |
| Unauthorized AI write | Server-side approval and per-action authorization |
| Log exfiltration | Redacted structured events, access control and retention |
| Compromised integration | Disable connector, revoke tokens, incident response playbook |

## 10. Implementation roadmap
**Phase 1:** Synthetic Flask demonstration and architecture document (included).  
**Phase 2:** Corporate SSO, identity mapping, role administration and CSRF/rate limiting hardening.  
**Phase 3:** OAuth consent and one read-only live connector in a sanctioned sandbox.  
**Phase 4:** Resource ACL enforcement, enterprise DLP, approval queues, token vault and SIEM.  
**Phase 5:** Security review, penetration tests, privacy review, monitoring, disaster recovery and phased rollout.

## 11. Acceptance criteria
- A user cannot read a resource their provider account cannot access.
- A denied operation cannot be overridden by a prompt.
- Restricted data never reaches the external AI provider or external logs.
- Every connector operation produces a structured audit decision.
- Write operations require explicit user approval and a new server-side policy check.
- Tokens are encrypted, revocable, rotated and absent from logs.
- Incident response can disable a compromised connector promptly.

## 12. Prototype-to-production gap
The supplied app provides synthetic connectors, demo password login, a simple role matrix, local record filtering, deterministic answer generation, a basic regex scanner and SQLite events. It **does not** satisfy production acceptance criteria for real systems. In particular, it has no real provider ACL integration, OAuth, production DLP, model safety boundary, managed audit service or enterprise-grade identity management. Those are design requirements, not implemented features.


### Updated demonstration account onboarding
Public registration provisions only `employee` accounts; no user can select their own elevated role. Password hashes are stored in local SQLite. An optional admin demo account may be provisioned using `DEMO_ADMIN_USERNAME` and `DEMO_ADMIN_PASSWORD` in the local `.env` file. For production, use corporate OIDC/SSO, verified identity, rate limiting, account lifecycle controls and centralized role provisioning.
