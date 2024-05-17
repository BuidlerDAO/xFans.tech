import { contractRequestHttp as http } from '../request';

export async function getAccounts() {
  const accounts = await http.get<{ accounts: string[]; balance: string; weth_balance: string }>(
    '/xfans/api/user/accounts'
  );
  return accounts;
}
// todo: 建议删除,后端暂时没删除
// export async function getBalance() {
//   const balance = await http.get<string>('/xfans/api/user/getBalance');
//   return balance;
// }
