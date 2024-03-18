import { contractRequestHttp as http } from '../request';

export async function getAccounts() {
  const accounts = await http.get<string[]>('/xfans/api/user/getAccounts');
  return accounts;
}

export async function getBalance() {
  // 后端是不是应该返回 string?
  const balance = await http.get<number>('/xfans/api/user/getBalance');
  return balance;
}
