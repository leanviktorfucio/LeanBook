import mongoose from 'mongoose';
import { AccountDBSchema, AccountRegisterType, AccountUpdateType } from '../Schema/AccountSchema';

const AccountSchema = new mongoose.Schema(AccountDBSchema);

const AccountsDB = mongoose.model('accounts', AccountSchema);

class AccountDAOModule {
    getAccountById(id: number) {
        return AccountsDB.findById(id);
    }
    
    getAccountByEmail(email: string) {
        return AccountsDB.findOne({ email });
    }
    
    async getAccountByUsername(username: string) {
        return await AccountsDB.findOne({ username })
            .select('-authentication.password')
            .select('-authentication.salt');
    }
    
    async getAccountByUsernameWithAuthentication(username: string) {
        return await AccountsDB.findOne({ username });
    }
    
    async getAccountByUsernameAndPassword(username: string, password: string) {
        return AccountsDB.findOne({ username, 'authentication.password': password })
            .select('-authentication.password')
            .select('-authentication.salt');
    }
    
    registerAccount(account: AccountRegisterType) {
        return new AccountsDB(account).save();
    }
    
    updateAccount(accountId: string, accountNewConfig: AccountUpdateType) {
        return AccountsDB.findByIdAndUpdate(accountId, accountNewConfig);
    }
}

export const AccountDAO = new AccountDAOModule();