<script setup lang="ts">
import { NMessageProvider } from "naive-ui";
</script>

<template>
  <div id="app">
    <n-message-provider>
      <router-view />
    </n-message-provider>
  </div>
</template>
