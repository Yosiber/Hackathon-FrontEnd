import { type FieldErrors } from "react-hook-form"

export const getFirstFormError = (errors: FieldErrors, serverError: string | null): string | null => {
    const errorKeys = Object.keys(errors) as Array<keyof typeof errors>;
    if (errorKeys.length > 0) {
        return errors[errorKeys[0]]?.message as string;
    } else if (serverError !== null) {
        return serverError;
    }
    return null;
}