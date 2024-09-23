import { ErrorParams, NotFoundError } from "../Errors/Error";
import { AccountDAO } from "../DAO/AccountDAO";
import { AccountUpdateType } from "../Schema/AccountSchema";

class AccountServiceModule {
    getAccountByUsername = async (username: string, isThrowError: boolean = true) => {
        const account = await AccountDAO.getAccountByUsername(username);
    
        if (!account && isThrowError) {
            throw new NotFoundError({
                message: `Account with username: ${username} not found`,
                metadata: {
                    username
                }
              } as ErrorParams);
        }

        return account;
    }

    getAccountByUsernameWithAuthentication = async (username: string) => {
        const account = await AccountDAO.getAccountByUsernameWithAuthentication(username);
    
        if (!account) {
            throw new NotFoundError({
                message: `Account with username: ${username} not found`,
                metadata: {
                    username
                }
              } as ErrorParams);
        }

        return account;
    }

    getAccountByUsernameAndPassword = async (username: string, password: string) => {
        const account = await AccountDAO.getAccountByUsernameAndPassword(username, password);

        if (!account) {
            throw new NotFoundError({
                message: `Account with username: ${username} and a password not found`,
                metadata: {
                    username,
                    password: null
                }
              } as ErrorParams);
        }
    
        return account;
    }

    updateAccount = async (accountId: string, accountNewConfig: AccountUpdateType) => {
        const account = await AccountDAO.updateAccount(accountId, accountNewConfig);
    
        return account;
    }
}

export const AccountService = new AccountServiceModule();