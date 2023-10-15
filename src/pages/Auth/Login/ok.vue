<template>
  <n-layout>
    <n-layout-content>
      <n-grid :cols="2" responsive item-style="width:500px">
        <n-grid-item>
          <n-card content-style="padding:0px">
            <n-space class="form-card" vertical justify="center" align="center">
              <n-form ref="formRef" :model="model" :rules="rules">
                <n-form-item path="age" label="Age">
                  <n-input v-model:value="model.age" @keydown.enter.prevent />
                </n-form-item>
                <n-form-item path="password" label="Password">
                  <n-input
                    v-model:value="model.password"
                    type="password"
                    @input="handlePasswordInput"
                    @keydown.enter.prevent
                  />
                </n-form-item>
                <n-form-item
                  ref="rPasswordFormItemRef"
                  first
                  path="reenteredPassword"
                  label="Re-enter Password"
                >
                  <n-input
                    v-model:value="model.reenteredPassword"
                    :disabled="!model.password"
                    type="password"
                    @keydown.enter.prevent
                  />
                </n-form-item>
                <n-row :gutter="[0, 24]">
                  <n-col :span="24">
                    <div style="display: flex; justify-content: flex-end">
                      <n-button
                        :disabled="model.age === null"
                        round
                        type="primary"
                        @click="handleValidateButtonClick"
                      >
                        Validate
                      </n-button>
                    </div>
                  </n-col>
                </n-row>
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

interface ModelType {
  age: string | null;
  password: string | null;
  reenteredPassword: string | null;
}

export default defineComponent({
  setup() {
    const formRef = ref<FormInst | null>(null);
    const rPasswordFormItemRef = ref<FormItemInst | null>(null);
    const message = useMessage();
    const modelRef = ref<ModelType>({
      age: null,
      password: null,
      reenteredPassword: null,
    });
    function validatePasswordStartWith(
      rule: FormItemRule,
      value: string
    ): boolean {
      return (
        !!modelRef.value.password &&
        modelRef.value.password.startsWith(value) &&
        modelRef.value.password.length >= value.length
      );
    }
    function validatePasswordSame(rule: FormItemRule, value: string): boolean {
      return value === modelRef.value.password;
    }
    const rules: FormRules = {
      age: [
        {
          required: true,
          validator(rule: FormItemRule, value: string) {
            if (!value) {
              return new Error("Age is required");
            } else if (!/^\d*$/.test(value)) {
              return new Error("Age should be an integer");
            } else if (Number(value) < 18) {
              return new Error("Age should be above 18");
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
      reenteredPassword: [
        {
          required: true,
          message: "Re-entered password is required",
          trigger: ["input", "blur"],
        },
        {
          validator: validatePasswordStartWith,
          message: "Password is not same as re-entered password!",
          trigger: "input",
        },
        {
          validator: validatePasswordSame,
          message: "Password is not same as re-entered password!",
          trigger: ["blur", "password-input"],
        },
      ],
    };
    return {
      formRef,
      rPasswordFormItemRef,
      model: modelRef,
      rules,
      handlePasswordInput() {
        if (modelRef.value.reenteredPassword) {
          rPasswordFormItemRef.value?.validate({ trigger: "password-input" });
        }
      },
      handleValidateButtonClick(e: MouseEvent) {
        e.preventDefault();
        formRef.value?.validate(
          (errors: Array<FormValidationError> | undefined) => {
            if (!errors) {
              message.success("Valid");
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
