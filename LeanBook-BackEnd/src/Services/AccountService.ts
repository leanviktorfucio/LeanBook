import { ErrorParams, NotFoundError } from "../Errors/Error";
import { AccountDAO } from "../DAO/AccountDAO";

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
}

export const AccountService = new AccountServiceModule();