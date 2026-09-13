# xionsgroup.com — GoDaddy cutover preparation

Public DNS snapshot, 2026-09-12. No DNS records were changed.

| Name / type | Observed value |
|---|---|
| NS | ns71.domaincontrol.com; ns72.domaincontrol.com |
| Apex A | 76.223.105.230; 13.248.243.5 |
| www CNAME | xionsgroup.com |
| MX | 0 xionsgroup-com.mail.protection.outlook.com |
| SPF TXT | v=spf1 include:spf.protection.outlook.com -all |

The authoritative nameservers point to GoDaddy and mail routing points to Microsoft 365. This is a partial public snapshot, not a full DNS export; other records, including verification/DKIM entries, must be preserved.

1. Finish GitHub-linked Netlify production, dev branch and PR deployments.
2. Record the actual Netlify site URL and IDs; verify the approved production output there.
3. Sign in to the company GoDaddy domain account; open xionsgroup.com → DNS. Export/record the full zone, including any AAAA, CAA and mail records.
4. In Netlify Domain management, add xionsgroup.com and www.xionsgroup.com, choose the primary domain and read the project-specific pending DNS instructions.
5. Replace only the necessary web A/ALIAS and www CNAME records with the values Netlify actually supplies. Review conflicting web AAAA records if present. Keep the current nameservers and all mail/verification records.
6. Verify DNS, HTTPS, root/www redirection, website, mail send/receive and contact behavior.
7. Record the successful production commit/deploy. Roll back website records to the captured values if necessary; a DNS rollback is separate from a Netlify deployment rollback.

Actual replacement values are pending creation of the correct company Netlify project. Do not guess a Netlify project hostname or change DNS now.
