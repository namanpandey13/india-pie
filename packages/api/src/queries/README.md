# Supabase Query Boundary

Only files in this folder should call `client.from(...)`.

Services in `packages/api/src/services` should compose product use cases, map rows to shared DTOs, and return `ApiResult<T>`. Table names, select strings, filters, and mutation query shapes live here so the Supabase adapter remains easy to edit without touching screens or feature hooks.
