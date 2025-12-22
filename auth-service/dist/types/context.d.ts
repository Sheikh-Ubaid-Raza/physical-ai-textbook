import { Context } from 'hono';
import { RegistrationData, LoginData, UpdateProfileData } from '../models/user';
export type CustomContext = Context & {
    get: <T extends keyof CustomContextVariables>(key: T) => CustomContextVariables[T];
    set: <T extends keyof CustomContextVariables>(key: T, value: CustomContextVariables[T]) => void;
};
export interface CustomContextVariables {
    validatedData: RegistrationData | LoginData | UpdateProfileData;
    userId: string;
}
//# sourceMappingURL=context.d.ts.map