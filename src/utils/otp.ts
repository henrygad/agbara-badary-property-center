import { v4 as uuidv4 } from "uuid";

export function generateOTP(): string {
    // Generate UUID, remove non-digits, and pick first 6 digits
    const digits = uuidv4().replace(/\D/g, ""); // extract only numbers
    return digits.slice(0, 6).padEnd(6, "0"); // always ensure 6 digits
}

export function generateOTPWithExpiry(minutes = 15) {
    const otp = generateOTP();
    const expiresAt = Date.now() + minutes * 60 * 1000;
    return { otp, expiresAt };
}
