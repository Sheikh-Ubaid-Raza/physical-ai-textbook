import { Context } from 'hono';
export declare const validateRegistration: (c: Context, next: () => Promise<void>) => Promise<(Response & import("hono").TypedResponse<{
    error: string;
}, 400, "json">) | undefined>;
export declare const validateLogin: (c: Context, next: () => Promise<void>) => Promise<(Response & import("hono").TypedResponse<{
    error: string;
}, 400, "json">) | undefined>;
export declare const validateUpdateProfile: (c: Context, next: () => Promise<void>) => Promise<(Response & import("hono").TypedResponse<{
    error: string;
}, 400, "json">) | undefined>;
export declare const requireAuth: (c: Context, next: () => Promise<void>) => Promise<(Response & import("hono").TypedResponse<{
    error: string;
}, 401, "json">) | undefined>;
//# sourceMappingURL=validation.d.ts.map