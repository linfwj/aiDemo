<script setup lang="ts">
import { ref, computed } from "vue";
import type { FormInstance, FormRules } from "element-plus";
import { useRegisterStore } from "@/views/system/register/register";

const store = useRegisterStore();
const form = store.form;
const countdown = ref(store.countdown);
const formRef = ref<FormInstance>();
const dialogVisible = ref(false);

const validatePassword = (_rule: any, value: string, callback: Function) => {
  const pattern =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,12}$/;
  if (!pattern.test(value)) {
    callback(new Error("密码应为8~12位大、小写英文字母、阿拉伯数字和特殊字符"));
    return;
  }
  callback();
};

const validateConfirmPassword = (_rule: any, value: string, callback: Function) => {
  if (value !== form.password) {
    callback(new Error("两次密码不一致"));
    return;
  }
  callback();
};

const rules = computed<FormRules>(() => ({
  username: [
    { required: true, message: "用户名不能为空", trigger: "blur" },
    {
      pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,10}$/,
      message: "用户名为6~10位英文和数字",
      trigger: "blur",
    },
  ],
  phone: [
    { required: true, message: "手机号不能为空", trigger: "blur" },
    {
      pattern: /^1[3-9]\d{9}$/,
      message: "请输入正确的手机号",
      trigger: "blur",
    },
  ],
  code: [{ required: true, message: "请输入验证码", trigger: "blur" }],
  password: [
    { required: true, message: "密码不能为空", trigger: "blur" },
    { validator: validatePassword, trigger: "blur" },
  ],
  confirmPassword: [
    { required: true, message: "请再次输入密码", trigger: "blur" },
    { validator: validateConfirmPassword, trigger: "blur" },
  ],
}));

const register = async () => {
  if (!formRef.value) return;
  const valid = await formRef.value.validate();
  if (valid) {
    await store.register();
  }
};

const sendCode = async () => {
  await store.sendCode();
};
</script>

<template>
  <div class="register-container">
    <div class="top-nav">
      <span class="nav-item">返回</span>
      <span class="nav-item disabled">当前位置：快速注册</span>
      <span class="nav-item">登录</span>
    </div>
    <div class="register-content">
      <div class="register-header">
        <h2>欢迎注册</h2>
      </div>
      <el-form ref="formRef" :model="form" :rules="rules" label-position="top">
        <el-form-item prop="username">
          <el-input v-model="form.username" placeholder="请输入用户名" />
        </el-form-item>

        <el-form-item prop="phone">
          <el-input v-model="form.phone" placeholder="请输入手机号" />
        </el-form-item>

        <el-form-item prop="code">
          <div class="verification-code-wrapper">
            <el-input v-model="form.code" placeholder="请输入验证码" />
            <el-button
              plain
              :disabled="!form.phone || countdown > 0"
              class="code-button"
              @click="sendCode"
            >
              {{ countdown > 0 ? `${countdown}s` : "获取验证码" }}
            </el-button>
          </div>
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            v-model="form.password"
            type="password"
            placeholder="请输入密码"
            show-password
          />
        </el-form-item>

        <el-form-item prop="confirmPassword">
          <el-input
            v-model="form.confirmPassword"
            type="password"
            placeholder="请确认密码"
            show-password
          />
        </el-form-item>

        <el-form-item class="agreement">
          <el-checkbox v-model="form.agreement">
            阅读《
            <span class="agreement-link" style="color: #1913ff" @click="dialogVisible = true">
              用户服务协议
            </span>
            》
          </el-checkbox>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" class="register-btn" @click="register">注册</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-dialog
      v-model="dialogVisible"
      title="用户服务协议"
      width="500px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <div class="agreement-content">
        <h3>服务协议条款</h3>
        <p>1. 总则</p>
        <p>欢迎您使用我们的服务。本协议是您与我们之间关于使用我们服务所订立的协议。</p>
        <p>2. 服务内容</p>
        <p>我们将为您提供安全、稳定、可靠的服务，并持续改进技术与服务质量。</p>
        <p>3. 用户义务</p>
        <p>用户在使用本服务时必须遵守中华人民共和国相关法律法规。</p>
        <p>4. 隐私保护</p>
        <p>我们重视用户的隐私保护，承诺对您的个人信息进行保护。</p>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">关闭</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.top-nav {
  display: flex;
  justify-content: space-between;
  padding: 12px 24px;
  background: #fff;
  border-bottom: 1px solid #eee;

  .nav-item {
    font-size: 14px;
    color: #333;
    cursor: pointer;

    &.disabled {
      color: #999;
      cursor: default;
    }
  }
}

.register-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100vh;
  background-color: #fff;

  .register-content {
    width: 100%;
    max-width: 360px;
    padding: 0;
    margin: 60px auto;

    .register-header {
      margin-bottom: 24px;
      text-align: center;

      h2 {
        margin: 0;
        font-size: 24px;
        color: #333;
      }
    }

    .register-form {
      .verification-code-wrapper {
        display: flex;
        gap: 8px;
        align-items: center;

        .el-input {
          flex: 1;
        }

        .code-button {
          min-width: 120px;
          height: 32px;
          padding: 0;
          margin-left: 8px;
          white-space: nowrap;
        }
      }

      :deep(.el-button--primary) {
        width: 100%;
        height: 32px;
        font-size: 14px;
        color: #fff;
        background-color: #0043a7;
        border-color: #0043a7;

        &:hover {
          background-color: #0047b3;
          border-color: #0047b3;
        }
      }

      :deep(.el-form-item) {
        margin-bottom: 16px;
      }

      :deep(.el-input__wrapper) {
        height: 32px;
        box-shadow: 0 0 0 1px #dcdfe6;

        &:hover {
          box-shadow: 0 0 0 1px #c0c4cc;
        }

        &.is-focus {
          box-shadow: 0 0 0 1px #409eff;
        }
      }

      :deep(.el-checkbox) {
        display: flex;
        align-items: center;
        height: 32px;

        .el-checkbox__label {
          font-size: 14px;
          color: #606266;
        }

        .el-checkbox__inner {
          width: 14px;
          height: 14px;
          border-color: #dcdfe6;
        }
      }

      .agreement-link {
        cursor: pointer;
      }
    }
  }
}

.agreement-content {
  max-height: 400px;
  padding: 20px;
  overflow-y: auto;
  line-height: 1.6;
}

.register-btn {
  background-color: #023399;
}

.code-button {
  color: white;
  background-color: #023399;
}
</style>
