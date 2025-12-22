import { z } from 'zod';
export declare const UserSchema: z.ZodObject<{
    id: z.ZodString;
    email: z.ZodString;
    name: z.ZodString;
    password_hash: z.ZodString;
    software_background: z.ZodEnum<["Beginner", "Intermediate", "Advanced"]>;
    hardware_background: z.ZodEnum<["None", "Arduino", "RaspberryPi"]>;
    learning_goal: z.ZodOptional<z.ZodString>;
    created_at: z.ZodString;
    updated_at: z.ZodString;
    is_active: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    id: string;
    email: string;
    name: string;
    password_hash: string;
    software_background: "Beginner" | "Intermediate" | "Advanced";
    hardware_background: "None" | "Arduino" | "RaspberryPi";
    created_at: string;
    updated_at: string;
    is_active: boolean;
    learning_goal?: string | undefined;
}, {
    id: string;
    email: string;
    name: string;
    password_hash: string;
    software_background: "Beginner" | "Intermediate" | "Advanced";
    hardware_background: "None" | "Arduino" | "RaspberryPi";
    created_at: string;
    updated_at: string;
    learning_goal?: string | undefined;
    is_active?: boolean | undefined;
}>;
export type User = z.infer<typeof UserSchema>;
export declare const RegistrationDataSchema: z.ZodObject<{
    email: z.ZodString;
    name: z.ZodString;
    password: z.ZodString;
    software_background: z.ZodEnum<["Beginner", "Intermediate", "Advanced"]>;
    hardware_background: z.ZodEnum<["None", "Arduino", "RaspberryPi"]>;
    learning_goal: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    email: string;
    name: string;
    software_background: "Beginner" | "Intermediate" | "Advanced";
    hardware_background: "None" | "Arduino" | "RaspberryPi";
    password: string;
    learning_goal?: string | undefined;
}, {
    email: string;
    name: string;
    software_background: "Beginner" | "Intermediate" | "Advanced";
    hardware_background: "None" | "Arduino" | "RaspberryPi";
    password: string;
    learning_goal?: string | undefined;
}>;
export type RegistrationData = z.infer<typeof RegistrationDataSchema>;
export declare const LoginDataSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
}, {
    email: string;
    password: string;
}>;
export type LoginData = z.infer<typeof LoginDataSchema>;
export declare const UpdateProfileSchema: z.ZodObject<{
    software_background: z.ZodOptional<z.ZodEnum<["Beginner", "Intermediate", "Advanced"]>>;
    hardware_background: z.ZodOptional<z.ZodEnum<["None", "Arduino", "RaspberryPi"]>>;
    learning_goal: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    software_background?: "Beginner" | "Intermediate" | "Advanced" | undefined;
    hardware_background?: "None" | "Arduino" | "RaspberryPi" | undefined;
    learning_goal?: string | undefined;
}, {
    software_background?: "Beginner" | "Intermediate" | "Advanced" | undefined;
    hardware_background?: "None" | "Arduino" | "RaspberryPi" | undefined;
    learning_goal?: string | undefined;
}>;
export type UpdateProfileData = z.infer<typeof UpdateProfileSchema>;
//# sourceMappingURL=user.d.ts.map