

export default interface RequestTypes {
    id?: string,
    propertyId: string,
    referenceId: string,
    propertyTitle: string,
    clientId: string,
    clientName: string,
    clientEmail: string,
    clientPhone: string,
    message: string,   
    status: "Pending" | "Contacted" | "Closed"
    view: boolean
    createdAt: Date,
};