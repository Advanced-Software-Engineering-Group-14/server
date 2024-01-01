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
    bins: Bin[]
    package: BinPackage
}


export type BinPackage = {
    name: string
    price: number
    binNum: number
    isCustom: boolean
}



export type Payment = {
    paymentType: "pickup" | "bin"
    pickup?: Pickup
    binPackage?: BinPackage
    paymentMethod: "card" | "mobile_money" | "bank"
    response: "success" | "failure"
    totalAmount: number
    refNumber: string
    homeowner: Homeowner
}

export type Bin = {
    category: "recycling" | "trash"
    status: "full" | "empty"
    price: number
}

export type Pickup = {
    date: Date
    status: "pending" | "assigned" | "ongoing" | "completed" | "cancelled"
    bins: Bin[]
    homeowner: Homeowner
    driver: Driver
}

export type EducationalContent = {
    title: string
    description: string
    content: string
    author: Manager
}

export type SupportTicket = {
    homeowner: Homeowner
    status: "pending" | "ongoing" | "resolved" | "cancelled"
    title: string
    description: string
}


export type Issue = {
    title: string
    description: string
    driver: Driver
}

