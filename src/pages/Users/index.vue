<route>
    {
        meta: {
            requiresAuth: true
        }
    }
 </route>

<script setup lang="ts">
import { useQuery } from "@tanstack/vue-query";
import axios from "axios";
import { ResponseListUser } from "../../models/response_list_user";

const getUsers = async () => {
  const response = await axios.get("https://reqres.in/api/users?page=2");
  const list: ResponseListUser = response.data;
  return list.data;
};

const { isLoading, isError, data, error } = useQuery({
  queryKey: ["users"],
  queryFn: getUsers,
});
</script>

<template>
  <template v-if="isLoading">Loading</template>
  <n-grid cols="2" x-gap="10" y-gap="10">
    <n-gi v-for="user in data">
      <n-card @click="$router.push('/users/' + user.id)">
        <n-image :src="user.avatar" />
        <p>{{ user.email }}</p>
        <p>{{ user.first_name }} {{ user.last_name }}</p>
      </n-card>
    </n-gi>
  </n-grid>

  <template v-if="isError">{{ error }}</template>
</template>

<style scoped></style>
