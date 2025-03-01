import type { Account, AccountType, ErrorsKeysType } from "@/types";
import { reactive } from "vue";

export const useAccountValidation = () => {
  const errors = reactive<Record<keyof ErrorsKeysType, string>>({
    labels: "",
    type: "",
    login: "",
    password: "",
  });

  const validationRules = {
    labels: (value: string[]) => Array.isArray(value) && value.length <= 50,
    type: (value: AccountType) => Boolean(value.trim()),
    login: (value: string) => value.trim() !== "" && value.length <= 100,
    password: (value: string | null, account: Account) => {
      return (
        account.type === "LDAP" ||
        (value?.trim() !== "" && value?.length <= 100)
      );
    },
  };

  const validateField = (
    field: keyof ErrorsKeysType,
    value: unknown,
    account: Account
  ) => {
    if (field === "type") {
      if (value === "LDAP") {
        errors.password = "";
      } else {
        validateField("password", account.password, account);
      }
    }

    if (field === "password" && account.type === "LDAP") {
      errors.password = "";
      return;
    }

    errors[field] = "";

    const validate = validationRules[field];
    if (!validate || !validate(value as any, account)) {
      errors[field] = `Ошибка в поле ${field}: некорректное значение`;
    }
  };

  const isValidAccount = (account: Account) => {
    (Object.keys(errors) as (keyof ErrorsKeysType)[]).forEach((key) => {
      validateField(key, account[key], account);
    });

    return Object.values(errors).every((error) => !error);
  };

  return { errors, validateField, isValidAccount };
};
