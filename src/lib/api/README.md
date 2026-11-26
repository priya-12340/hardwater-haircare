# Frontend API layer

All storefront data access should go through the resource modules in this folder.
Mock mode is enabled unless `NEXT_PUBLIC_USE_MOCK=false`.

## Force mock errors

The exported `setMockApiFailure(true)` helper stores the flag in `localStorage`
as `hw-mock-api-fail`. Use it from a client-side test component. To switch it off,
call `setMockApiFailure(false)` or remove the key in browser storage:

```js
localStorage.removeItem('hw-mock-api-fail');
```

You can also set `NEXT_PUBLIC_MOCK_API_FORCE_ERROR=true` in the environment.

## Backend integration

When `NEXT_PUBLIC_USE_MOCK=false`, resource methods call `apiRequest()` in its
not-implemented mode and return a clear 501 error. No endpoint paths or payloads
are assumed. Replace the TODO guards with documented `apiRequest()` calls after
the backend API documentation is supplied.
