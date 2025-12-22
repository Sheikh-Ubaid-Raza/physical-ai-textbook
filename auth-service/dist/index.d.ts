import { Hono } from 'hono';
import { RegistrationData, LoginData, UpdateProfileData } from './models/user';
export interface Variables {
    validatedData: RegistrationData | LoginData | UpdateProfileData;
    userId: string;
}
declare const app: Hono<{
    Variables: Variables;
}, import("hono/types").BlankSchema, "/">;
export default app;
//# sourceMappingURL=index.d.ts.map