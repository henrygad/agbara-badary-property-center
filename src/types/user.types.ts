

type UserTypes = {
    firstName: string
    lastName: string
    authEmail: string
    profileImage?: {
        url: string,
        publicId: string,
    }
    accountType: "Admin" | "Agent"
    bio?: string;
    gender?: "Male" | "Female" | "Other"
    email?: string
    phone?: string
    company?: string;
    role?: string,
    createdAt: Date 
    lastLogin: Date
};


export default UserTypes;