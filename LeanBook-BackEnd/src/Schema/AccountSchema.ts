export const AccountDBSchema = {
    _id: { type: String, required: true },
    username: { type: String, required: true },
    email: { type: String, required: true },
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    authentication: { 
        password: { type: String, required: true, select: false },
        salt: { type: String, required: true, select: false },
    },
    rememberKey: { type: String},
    forgotPasswordKey: { type: Number},
    createddatetime: { type: Date, required: true, default: Date.now },
    lastlogindatetime: { type: Date }
};

export interface AccountRegisterType {
    _id: string,
    username: string,
    email: string,
    firstname: string,
    lastname: string,
    authentication: {
        password: string,
        salt: string
    }
}

export interface AccountUpdateType {
    username: string,
    email: string,
    firstname: string,
    lastname: string
}