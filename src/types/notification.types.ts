type NotificationTypes = {
    id?: string
    type: "Contact"
    | "New Account"
    | "Listed Property"
    | "Request"
    | "Listing Approved" 
    | "Listing Reviewing"
    | "Listing Rejected"
    | "Account Approved" 
    | "Account Reviewing"
    | "Account Rejected"   
    to: string   
    title: string,
    message: string
    viewed: boolean
    createdAt: Date
}

export default NotificationTypes;