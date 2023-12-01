export type VoidFunction = () => void;

export interface MailData {
    name?: string;
    email?: string | string[];
    subject: string;
    message: string;
    cc?: string | string[];
    bcc?: string | string[];
    from?: {
        name: string;
        address: string;
    }
    sender?: {
        name: string;
        address: string;
    }
}

export type MongoResponse = {
    _id: string
    createdAt: Date
    updatedAt: Date
    __v?: number
}

export type UserRoles = "SUDO" | "ADMIN" | "DRIVER" | "HOMEOWNER"

export type Manager = {
    surname: string
    othernames: string
    email: string
    password: string
    phone: string
    token: string | null
    role: "ADMIN" | "SUDO"
    meta: {
        isFirstLogin: boolean
    }
    verification: {
        code: string
        expiresAt: string
    }
}

export type Driver = {
    surname: string
    othernames: string
    email: string
    password: string
    phone: string
    token: string | null
    meta: {
        isFirstLogin: boolean
        isSuspended: boolean
    }
    verification: {
        code: string
        expiresAt: string
    }
    rating: number | 0
    profileImageUrl: string | ""
    gender: "MALE" | "FEMALE"
}

export type Homeowner = {
    surname: string
    othernames: string
    email: string
    password: string
    phone: string
    token: string | null
    meta: {
        isFirstLogin: boolean
        isSuspended: boolean
        isApproved: boolean
        isVerified: boolean
    }
    verification: {
        code: string
        expiresAt: string
    }
    rating: number | 0
    profileImageUrl: string | ""
    gender: "MALE" | "FEMALE"
    residence: string
    identification: {
        idType: "VOTER" | "COUNTRY" | "DRIVER"
        no: string
        imageUrl: string
    }
}



