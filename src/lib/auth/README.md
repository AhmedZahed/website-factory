# Authentication foundation

Authentication is intentionally not implemented in Phase 1. The admin pages are public preview shells with no connected records or administrative API operations. Do not add password verification or claim the current interface is protected.

When authentication is added, use a managed identity provider and enforce authorization on the server before reading or changing tenant data. Never store plaintext passwords.
