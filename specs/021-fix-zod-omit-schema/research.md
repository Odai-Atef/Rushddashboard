# Research: Zod Omit on Refined Schemas

## Decision
Refactor the auth schema in `src/app/types/auth.ts` to avoid `.omit()` on a refined schema by splitting the registration schema into a shared base and a derived form.

## Rationale
Zod’s `.omit()` method throws at runtime when called on object schemas that contain `.refine()` or `.superRefine()`.

## Alternatives Considered

| Approach | Pros | Cons | Decision |
|---|---|---|---|
| Split base + merge | Minimal change, preserves all types | Requires two schema constants | ✅ Chosen |
| Upgrade Zod version | Could remove limitation | Unknown side effects; not minimal | ❌ Rejected |
| Inline login schema duplication | Simple | Violates DRY; risk of drift | ❌ Rejected |
| Pick fields manually | No runtime risk | Harder to maintain | ❌ Rejected |
