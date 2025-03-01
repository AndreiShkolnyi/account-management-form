export type AccountType = "Локальная" | "LDAP";
export type AccountLabels = { text: string }[];

export interface Account {
  id: string;
  labels: AccountLabels;
  type: AccountType;
  login: string;
  password: string | null;
}

export type ErrorsKeysType = Omit<Account, "id">;
