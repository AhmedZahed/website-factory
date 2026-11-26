# Tenant boundary

Tenant-aware application operations are not implemented in Phase 1. When they are added, derive the active tenant from an authenticated server-side identity, then scope every read and write to that tenant. Never trust a tenant ID supplied by a browser as authorization.
