<template>
  <div class="login-container">
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      auto-complete="on"
      label-position="left"
    >
      <div class="title-container">
        <h3 class="title">合同管理工具</h3>
      </div>

      <el-form-item prop="username">
        <span class="svg-container">
          <i class="iconfont icon-people_fill"></i>
        </span>
        <el-input
          ref="username"
          v-model="loginForm.username"
          placeholder="用户名"
          name="username"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
          <i class="iconfont icon-lock_fill"></i>
        </span>
        <el-input
          :key="passwordType"
          ref="password"
          v-model="loginForm.password"
          :type="passwordType"
          placeholder="密码"
          name="password"
          tabindex="2"
          auto-complete="on"
          @keyup.enter.native="handleLogin"
        />
        <span class="show-pwd" @click="showPwd">
          <i
            class="iconfont"
            :class="
              passwordType === 'password' ? 'icon-eye-close' : 'icon-eye-open'
            "
          ></i>
        </span>
      </el-form-item>

      <el-button
        :loading="loading"
        type="primary"
        style="width:100%;margin-bottom:30px;"
        @click.native.prevent="handleLogin"
        >登录</el-button
      >
    </el-form>
    <el-dialog
      class="change-pwd-dialog"
      title="密码修改"
      :visible.sync="passwordDialog"
      :close-on-click-modal="false"
      :show-close="false"
      width="500px"
    >
      <el-form label-width="70px" :model="passwordForm" class="clearfix">
        <el-form-item label="新密码" class="change-pwd-item">
          <el-input
            class="cpwd-input"
            type="text"
            v-model="passwordForm.password"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item label="确认密码" class="change-pwd-item">
          <el-input
            class="cpwd-input"
            v-model="passwordForm.newpassword"
            show-password
          ></el-input>
        </el-form-item>
        <span class="fl tip"
          >检测到您的密码或存在风险，为了您的账号安全，请先修改密码</span
        >
        <el-button
          type="primary"
          class="login-btn fr"
          :loading="pwdLoading"
          @click="apiUpdateUser"
          >确定</el-button
        >
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { setToken, setUser, clearUserInfo } from '@/utils/cache' // get token from cookie
import { login, updateUser } from '@/api/user'
export default {
  name: 'Login',
  data() {
    return {
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      loginRules: {
        username: [
          { required: true, trigger: 'blur', message: '请输入用户名' }
        ],
        password: [{ required: true, trigger: 'blur', message: '请输入密码' }]
      },
      loading: false,
      pwdLoading: false,
      passwordType: 'password',
      redirect: undefined,
      passwordDialog: false,
      userId: 0,
      passwordForm: {
        password: '',
        newpassword: ''
      }
    }
  },
  methods: {
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.apiLogin()
        } else {
          return false
        }
      })
    },
    apiLogin() {
      const data = {
        du_: 'asdadsda',
        id: 1,
        userInfoBO: {
          account: 'admin',
          name: '管理员'
        }
      }
      setToken(data.du_)
      setUser(data)
      this.$router.push('/')
      return
      const params = {
        account: this.loginForm.username.trim(),
        pwd: this.loginForm.password
      }
      login(params)
        .then(async res => {
          if (res.data && res.data.userInfoBO) {
            // 需要强制修改密码
            if (res.data.userInfoBO.editPwd === 1) {
              this.loading = false
              this.userId = res.data.userInfoBO.id
              setToken(res.data.du_) // 为了请求头中带入token
              this.passwordDialog = true
            } else {
              setToken(res.data.du_)
              setUser(res.data)
              this.$router.push('/')
            }
          }
        })
        .catch(() => {
          this.loading = false
        })
    },
    apiUpdateUser() {
      if (!this.userId) {
        return false
      }
      if (!this.passwordForm.password) {
        return false
      }
      if (!this.passwordForm.newpassword) {
        return false
      }
      if (
        this.passwordForm.password.length < 6 ||
        this.passwordForm.password.length > 20
      ) {
        this.$message.warning('密码长度只能在6-20个字符之间')
        return false
      }
      if (!/^[a-zA-Z0-9_ ]*$/.test(this.passwordForm.password)) {
        this.$message.warning('密码只能是数字英文下划线')
        return false
      }
      if (this.passwordForm.password != this.passwordForm.newpassword) {
        this.$message.warning('密码不一致')
        return false
      }
      this.pwdLoading = true
      const params = {
        password: this.passwordForm.password,
        oldPassword: this.loginForm.password
      }
      // 请求更新密码接口
      updateUser(params)
        .then(res => {
          clearUserInfo()
          this.$message.success('密码修改成功,请重新登录')

          this.loginForm.password = ''
          this.passwordForm.password = ''
          this.passwordForm.newpassword = ''
          this.passwordDialog = false
          this.pwdLoading = false
        })
        .catch(() => {
          this.pwdLoading = false
        })
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input:not(.cpwd-input) input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input:not(.cpwd-input) {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
  .change-pwd-dialog .el-dialog {
    margin-top: 240px !important;
    .tip {
      font-size: 12px;
      color: red;
      line-height: 36px;
    }
    .change-pwd-item {
      background: #fff;
      .el-form-item__label {
        line-height: 49px;
      }
      .el-input .el-input__inner {
        border: 1px solid #dcdfe6;
        border-radius: 4px;
      }
    }
  }
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
