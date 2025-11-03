export type RegisterTypes = {
    firstName: string,
    lastName: string,
    email: string,
    phoneCode: string,
    phone: string,
    password: string,
    confirmPassword: string,
    agreeToTerms: boolean,
    accountType: "Admin" | "Agent"
    accountStatus: "Pending" | "Approved" | "Rejected" | "Suspended"
}
export type LoginTypes = {   
    email: string,   
    password: string,  
    rememberMe: boolean,
}