import { ACCOUNTS_LS_KEY } from "@/constants/constants";
import type { Account } from "@/types";
import { defineStore } from "pinia";
import { ref, watch } from "vue";

export const useAccountsStore = defineStore("accounts", () => {
  const accounts = ref(
    JSON.parse(localStorage.getItem(ACCOUNTS_LS_KEY) || "[]") || []
  );

  const addAccount = (account: Account) => {
    accounts.value.push(account);
  };

  const updateAccount = (accountId: string, account: Account) => {
    const accountIdx = accounts.value.findIndex(
      (acc: Account) => acc.id === accountId
    );

    accounts.value[accountIdx] = account;
  };

  const removeAccount = (accountId: string) => {
    accounts.value = accounts.value.filter(
      (acc: Account) => acc.id !== accountId
    );
  };

  watch(
    accounts,
    (newAccounts) =>
      localStorage.setItem(ACCOUNTS_LS_KEY, JSON.stringify(newAccounts)),
    { deep: true }
  );

  return { accounts, addAccount, removeAccount, updateAccount };
});
