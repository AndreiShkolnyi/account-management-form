<template>
  <v-app>
    <v-main class="main">
      <v-container>
        <v-card>
          <v-card-title class="d-flex align-center ga-2">
            <span class="text-h6">Учётные записи</span>
            <v-btn class="rounded" icon="mdi-plus" @click="addAccount"> </v-btn>
          </v-card-title>

          <v-card-text>
            <v-alert type="info" variant="flat" class="mb-6 mt-4">
              Для указания нескольких меток для одной пары логин/пароль
              используйте разделитель ;
            </v-alert>

            <v-data-table
              :items="listAccounts"
              :headers="headers"
              class="elevation-1"
              hide-default-footer
            >
              <template v-slot:item="{ item }">
                <AccountRow :account="item" />
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { v4 as uuidv4 } from "uuid";
import { ref } from "vue";
import { useAccountsStore } from "@/store";
import { storeToRefs } from "pinia";
import type { Account } from "@/types";
import { watch } from "vue";

const accountStore = useAccountsStore();
const { accounts } = storeToRefs(accountStore);

const listAccounts = ref<Account[]>([...accounts.value]);

const headers = [
  { title: "Метки", key: "labels", align: "start" },
  { title: "Тип записи", key: "type", align: "start" },
  { title: "Логин", key: "login", align: "start" },
  { title: "Пароль", key: "password", align: "start" },
  { title: "", key: "actions", align: "center", sortable: false },
];

const addAccount = () => {
  listAccounts.value.push({
    labels: [],
    type: "Локальная",
    login: "",
    password: "",
    id: uuidv4(),
  });
};

watch(
  () => accounts.value,
  (newAccounts: Account[]) => {
    listAccounts.value = [...newAccounts];
  }
);
</script>
