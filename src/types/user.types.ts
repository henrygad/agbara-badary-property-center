import { RegisterTypes } from "./auth.types"

interface UserTypes extends RegisterTypes {
    id?: string,
    profileImage?: {
        url: string,
        publicId: string,
    }
    bio?: string;
    gender?: "Male" | "Female" | "Other"   
    company?: string;     

    emailIsVerified: boolean
    emailVerificationOtp?: string,
    emailVerificationOtpExpireingTime?: number,

    resetPasswordVerificationOtp?: string,
    resetPasswordVerificationOtpExpireingTime?: number,
    
    rememberMe: boolean,
    lastLogin: Date | string,

    createdAt: Date

    resetToken?: {
        token: string,
        expiresAt: number
    }

};


export default UserTypes;