export const createError = (code: number, message: string) => {
    const error = new Error() as any;
    error.success = false;
    error.message = message;
    error.statusCode = code;
    return error;
}