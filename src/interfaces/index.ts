export interface IErrorResponse {
  success: boolean
  message: string
  stack?: string
}

export interface IMessageResponse {
  message: string
}

export interface IMailUser {
  fullName: string,
  email: string,
}

export interface IMailUserWithPasswordWithPosition extends IMailUser {
  password: string
  position: string
}



export interface IMailData {
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