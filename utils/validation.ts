// utils/validation.ts

/**
 * Validates the email format.
 * @param email - The email to validate.
 * @returns true if the email is valid, false otherwise.
 */
export const validateEmail = (email: string): boolean => {
    // Regular expression for email validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
};

/**
 * Validates the password strength.
 * @param password - The password to validate.
 * @returns true if the password is strong, false otherwise.
 */
export const validatePassword = (password: string): boolean => {
    // Password should have at least:
    // - 8 characters
    // - 1 uppercase letter
    // - 1 lowercase letter
    // - 1 digit
    // - 1 special character
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
    return passwordRegex.test(password);
};
