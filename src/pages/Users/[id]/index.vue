<route>
    {
        meta: {
            requiresAuth: true
        }
    }
 </route>

<script setup lang="ts">
import axios from "axios";
import { useRoute } from "vue-router";
import { useQuery } from "@tanstack/vue-query";
import { User } from "../../../models/response_list_user";

const router = useRoute();

const getDetailUser = async () => {
  const response = await axios.get(
    "https://reqres.in/api/users/" + router.params.id
  );
  const user: User = response.data.data;
  return user;
};

const {
  isLoading,
  isError,
  data: user,
  error,
} = useQuery({
  queryKey: ["user"],
  queryFn: getDetailUser,
});
</script>

<template>
  <template v-if="isLoading">Loading</template>
  <template v-if="isError">{{ error }}</template>
  <n-card :title="user?.email">
    <template #cover>
      <img :src="user?.avatar" />
    </template>
    {{ user?.first_name }} {{ user?.last_name }}
  </n-card>
</template>

<style scoped>
.n-card {
  max-width: 300px;
}
</style>
