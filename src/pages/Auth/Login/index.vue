<router>
    {
      name: "Login"
    }
</router>
<template>
  <n-layout>
    <n-layout-content>
      <n-grid :cols="2" responsive item-style="width:500px">
        <n-grid-item>
          <n-card content-style="padding:0px">
            <n-space class="form-card" vertical justify="center" align="center">
              <n-form ref="formRef" :model="model" :rules="rules">
                <n-form-item path="email" label="Email">
                  <n-input
                    class="form"
                    v-model:value="model.email"
                    @keydown.enter.prevent
                  />
                </n-form-item>
                <n-form-item path="password" label="Password">
                  <n-input
                    class="form"
                    v-model:value="model.password"
                    type="password"
                    @keydown.enter.prevent
                  />
                </n-form-item>

                <n-button type="primary" @click="handleValidateButtonClick"
                  >Login</n-button
                >
              </n-form>
            </n-space>
          </n-card>
        </n-grid-item>
        <n-grid-item>
          <n-image
            class="image"
            object-fit="cover"
            src="https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2024&q=80"
          />
        </n-grid-item>
      </n-grid>
    </n-layout-content>
  </n-layout>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import {
  FormInst,
  FormItemInst,
  FormItemRule,
  FormValidationError,
  useMessage,
  FormRules,
} from "naive-ui";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "vue-router";

interface ModelType {
  email: string | null;
  password: string | null;
}

interface ResponseToken {
  token: string | null;
}

export default defineComponent({
  setup() {
    const router = useRouter();
    const formRef = ref<FormInst | null>(null);
    const rPasswordFormItemRef = ref<FormItemInst | null>(null);
    const message = useMessage();
    const modelRef = ref<ModelType>({
      email: "eve.holt@reqres.in",
      password: "cityslicka",
    });

    const handleLogin = async () => {
      try {
        const response = await axios.post("https://reqres.in/api/login", {
          email: modelRef.value.email,
          password: modelRef.value.password,
        });
        const token: ResponseToken = response.data;
        Cookies.set("token", token.token!);
        router.push("/users");
      } catch (error) {
        console.log(error);

        message.error("error");
      }
    };

    const rules: FormRules = {
      email: [
        {
          required: true,
          validator(rule: FormItemRule, value: string) {
            const emailRegex =
              /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
            if (!emailRegex.test(value)) {
              return new Error("Please enter a valid email address");
            } else if (value.endsWith("@example.com")) {
              return new Error("Emails from example.com are not allowed");
            }
            return true;
          },
          trigger: ["input", "blur"],
        },
      ],
      password: [
        {
          required: true,
          message: "Password is required",
        },
      ],
    };
    return {
      formRef,
      rPasswordFormItemRef,
      model: modelRef,
      rules,
      handleValidateButtonClick(e: MouseEvent) {
        e.preventDefault();
        formRef.value?.validate(
          (errors: Array<FormValidationError> | undefined) => {
            if (!errors) {
              handleLogin();
            } else {
              console.log(errors);
              message.error("Invalid");
            }
          }
        );
      },
    };
  },
});
</script>

<style scoped>
.image {
  height: 500px;
  width: 500px;
}
.form-card {
  height: 500px;
}
.form {
  width: 300px;
  text-align: left;
}
</style>
