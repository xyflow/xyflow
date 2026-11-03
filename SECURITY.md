# Security Policy

## Reporting a Vulnerability

To report a vulnerability, please privately report it via the Security tab on the correct GitHub repository ([see documentation](https://docs.github.com/en/code-security/security-advisories/guidance-on-reporting-and-writing-information-about-vulnerabilities/privately-reporting-a-security-vulnerability#privately-reporting-a-security-vulnerability)). Do not open a public issue. Provide:

- A clear description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Potential impact
- A proof of concept if possible
- Affected commit / version (if known)

## Acknowledgment Timeline

We aim to acknowledge receipt of a valid report within 1 week.

## Resolution Timeline

We aim to provide a remediation plan or decision within 4 weeks. Actual fix time may be shorter or longer depending on severity, complexity, and scope.

## Scope & Threat Model

In scope:

- Vulnerabilities introduced by code in this repository
- Supply-chain risks caused by how this repository consumes or distributes its own code (e.g. insecure GitHub Actions)

Out of scope:

- Issues only present in third-party dependencies (please report those upstream)
- Issues that can only be exploited when the underlying platform (browser, server runtime) is compromised
- Denial of service via excessive legitimate use

### Supported Versions

The following versions are currently supported with security updates:

| Package        | Version | Supported              |
| -------------- | ------- | ---------------------  |
| @xyflow/react  | 12.x    | ✅ Fully supported     |
| @xyflow/svelte | 1.x     | ✅ Fully supported     |
| @xyflow/system | 0.x     | ✅ Fully supported     |
| reactflow      | > 11.x  | ⚠ Depends on severity  |
| reactflow      | < 11.x  | ❌ No longer           |

## Disclosure

Please keep reports private until a fix is released and a Security Advisory is public.