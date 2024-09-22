import mongoose from 'mongoose';
import { AccountDBSchema, AccountRegisterType, AccountUpdateType } from '../Schema/AccountSchema';

const AccountSchema = new mongoose.Schema(AccountDBSchema);

export const AccountsDB = mongoose.model('accounts', AccountSchema);

class AccountDAOModule {
    getAccountById(id: number) {
        return AccountsDB.findById(id);
    }
    
    getAccountByEmail(email: string) {
        return AccountsDB.findOne({ email });
    }
    
    async getAccountByUsername(username: string) {
        return await AccountsDB.findOne({ username });
    }
    
    getAccountByUsernameAndPassword(username: string, password: string) {
        return AccountsDB.findOne({ username, authentication: { password }});
    }
    
    registerAccount(account: AccountRegisterType) {
        return new AccountsDB(account).save();
    }
    
    updateAccount(accountId: string, AccountUpdateSchema: AccountUpdateType) {
        return AccountsDB.findByIdAndUpdate(accountId, AccountUpdateSchema);
    }
}

export const AccountDAO = new AccountDAOModule();