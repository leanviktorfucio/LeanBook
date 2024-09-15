import mongoose from 'mongoose';

const AccountSchema = new mongoose.Schema({
    uuid: { type: String, required: true },
    username: { type: String, required: true },
    email: { type: String, required: true },
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    password: { type: String, required: true, select: false },
    rememberKey: { type: String},
    forgotPasswordKey: { type: Number},
    salt: { type: String, required: true },
    createddatetime: { type: Date, required: true, default: Date.now },
    lastlogindatetime: { type: Date }
});

export const AccountModel = mongoose.model('accounts', AccountSchema);

export const getAccountById = (id: number) => {
    AccountModel.findById(id);
};

export const getAccountByEmail = (email: string) => AccountModel.findOne({ email });

export const getAccountByUsername = (username: string) => AccountModel.findOne({ username });

export const getAccountByUsernameAndPassword = (username: string, password: string) => AccountModel.findOne({ username, password });

export const registerAccount = (accountModel: any) => {
    let account = null;
    account = new AccountModel(accountModel).save().then((account: any) => account.toObject())
    return account;
};

export const updateAccount = (AccountModel: any) => {
    AccountModel.findByIdAndUpdate(AccountModel.id, AccountModel);
};