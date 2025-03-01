<template>
  <tr>
    <td>
      <v-text-field
        class="mt-2"
        :model-value="labelsText"
        :error="!!errors?.labels"
        :error-messages="errors?.labels"
        variant="outlined"
        dense
        placeholder="Введите метки через ;"
        @update:model-value="handleUpdateLabels"
        @blur="() => validate('labels')"
        maxlength="50"
      ></v-text-field>
    </td>

    <td>
      <v-select
        class="mt-2"
        v-model="formAccount.type"
        :items="['Локальная', 'LDAP']"
        :error="!!errors?.type"
        :error-messages="errors?.type"
        variant="outlined"
        dense
        @update:model-value="handleTypeChange"
      ></v-select>
    </td>

    <td>
      <v-text-field
        class="mt-2"
        v-model="formAccount.login"
        :error="!!errors?.login"
        :error-messages="errors?.login"
        variant="outlined"
        dense
        placeholder="Введите логин"
        @blur="() => validate('login')"
        maxlength="100"
      ></v-text-field>
    </td>

    <td v-if="formAccount.type === 'Локальная'">
      <v-text-field
        class="mt-2"
        v-model="formAccount.password"
        :error="!!errors?.password"
        :error-messages="errors?.password"
        :type="isShowPassword ? 'text' : 'password'"
        variant="outlined"
        dense
        placeholder="Введите пароль"
        append-inner-icon="mdi-eye"
        @click:append-inner="togglePassword"
        @blur="() => validate('password')"
        maxlength="100"
      ></v-text-field>
    </td>
    <td v-else>-</td>
    <td>
      <v-btn
        icon="mdi-trash-can-outline"
        variant="plain"
        @click="remove"
      ></v-btn>
    </td>
  </tr>
</template>

<script setup lang="ts">
import type { Account, AccountType, ErrorsKeysType } from "@/types";
import { storeToRefs } from "pinia";
import { useAccountValidation } from "@/composables/useAccountValidation";
import { useAccountsStore } from "@/store";
import { computed } from "vue";
import { ref } from "vue";

const props = defineProps<{ account: Account }>();

const formAccount = ref<Account>({ ...props.account });

const isShowPassword = ref(false);

const accountsStore = useAccountsStore();
const { accounts } = storeToRefs(accountsStore);
const { addAccount, removeAccount, updateAccount } = accountsStore;
const { errors, validateField, isValidAccount } = useAccountValidation();

const labelsText = computed({
  get() {
    return formAccount.value.labels.map((l) => l.text).join("; ") || "";
  },
  set(value) {
    formAccount.value.labels = value
      .split(";")
      .map((label) => ({ text: label.trim() }));
  },
});

const handleUpdateLabels = (value: string) => {
  formAccount.value.labels = value
    .split(";")
    .map((label: string) => ({ text: label.trim() }));
};

const handleTypeChange = (value: AccountType) => {
  formAccount.value.type = value;
  if (value === "LDAP") {
    validate("type");
    formAccount.value.password = null;
  } else {
    validate("password");
  }
};

const togglePassword = () => {
  isShowPassword.value = !isShowPassword.value;
};

const validate = (field: keyof ErrorsKeysType) => {
  validateField(field, formAccount.value[field], formAccount.value);
  if (isValidAccount(formAccount.value)) {
    const existingAccount = accounts.value.find(
      (account: Account) => account.id === formAccount.value.id
    );
    if (existingAccount) {
      updateAccount(formAccount.value.id, formAccount.value);
    } else {
      addAccount(formAccount.value);
    }
  }
};

const remove = () => {
  removeAccount(formAccount.value.id);
};
</script>
@/types
