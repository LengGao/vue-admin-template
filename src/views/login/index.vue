<template>
  <div class="login-container">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" autocomplete="on" label-position="left">

      <div class="title-container">
        <h3 class="title">登录</h3>
      </div>

      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="username"
          v-model="loginForm.username"
          placeholder="Username"
          name="username"
          type="text"
          tabindex="1"
        />
      </el-form-item>

      <el-tooltip v-model="capsTooltip" content="Caps lock is On" placement="right" manual>
        <el-form-item prop="password">
          <span class="svg-container">
            <svg-icon icon-class="password" />
          </span>
          <el-input
            :key="passwordType"
            ref="password"
            v-model="loginForm.password"
            :type="passwordType"
            placeholder="Password"
            name="password"
            tabindex="2"
            autocomplete="on"
            @keyup.native="checkCapslock"
            @blur.prevent="capsTooltip = false"
            @keyup.enter.native="handleLogin"
          />
          <span class="show-pwd" @click="showPwd">
            <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
          </span>
        </el-form-item>
      </el-tooltip>

      <div class="footer">
        <el-button type="primary" @click.native.prevent="handleResgister">注册</el-button>
        <el-button :loading="loading"  type="primary" @click.native.prevent="handleLogin">登录</el-button>
      </div>
    </el-form>

    <el-dialog title="注册" :visible.sync="show" :show-close="false" class="resgister">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="120px" style="width: 400px; margin-left:50px;">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="temp.name" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="temp.password" placeholder="请输入" maxlength="18" />
        </el-form-item>
        <el-form-item label="身份证" prop="IDcard">
          <el-input v-model.number="temp.IDcard" placeholder="请输入" maxlength="18"  />
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-select v-model="temp.gender" class="filter-item" placeholder="请选择">
            <el-option v-for="(item, index) in genders" :key="item" :label="item" :value="index" />
          </el-select>
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-select v-model="temp.type" class="filter-item" placeholder="请选择">
            <el-option v-for="item in typeOptions" :key="'t_' + item" :label="typeOptionsTest[item]" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="联系方式" prop="tel">
          <el-input v-model="temp.tel" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="职位" prop="position">
          <el-input v-model="temp.position" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="薪资" prop="pay_charge">
          <el-input v-model.number="temp.pay_charge" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="入职时间" prop="buy_timestamp">
          <el-date-picker v-model="temp.buy_timestamp" type="date" value-format="yyyy-MM-dd" placeholder="请选择" />
        </el-form-item>
        <el-form-item label="离职时间" prop="use_timestamp">
          <el-date-picker v-model="temp.use_timestamp" type="date" value-format="yyyy-MM-dd" placeholder="请选择" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model  ="temp.status" class="filter-item" placeholder="请选择">
            <el-option v-for="item in statusOptions" :key="item" :label="statusOptionsTest[item]" :value="item" />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="show = false">
          取消
        </el-button>
        <el-button type="primary" @click="createData()">
          确定
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import SocialSign from './components/SocialSignin'
import { regsiter } from '@/api/user'

export default {
  name: 'Login',
  components: { SocialSign },
  data() {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      loginRules: {
        // username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        // password: [{ required: true, trigger: 'blur', validator: validatePassword }]
        username: [{ required: true, trigger: 'blur'}],
        password: [{ required: true, trigger: 'blur'}]
      },
      passwordType: 'password',
      capsTooltip: false,
      loading: false,
      showDialog: false,
      redirect: undefined,
      otherQuery: {},
      show: false,
      typeOptions: ['one', 'two'],
      typeOptionsTest: { one: '业主', two: '物业' },      
      unitOptions: [1, 2, 3, 4, 5, 6],
      floorsOptions: [1, 2, 3, 4, 5, 6, 7, 8 , 9, 10],
      buildingOptions: [1, 2, 3, 4, 5, 6, 7, 8 , 9, 10],
      statusOptions: ['published', 'draft'],
      statusOptionsTest: { published: '在职', draft: '离职'},
      typeOptions: ['one', 'two'],
      typeOptionsTest: { one: '业主', two: '物业' },
      genders: ['女', '男'],
      temp: {
        uid: undefined,
        IDcard: '',
        type: '',
        name: '',
        password: '',
        gender: '',
        tel: '',
        position: '',
        pay_charge: '',
        buy_timestamp: '',
        use_timestamp: '',
        status: ''
      },
      rules: {        
        type: [{ required: true, message: 'gender is required', trigger: 'change' }],
        IDcard: [{ required: true, message: 'IDcard is required', trigger: 'blur'}],
        name: [{ required: true, message: 'name is required', trigger: 'blur' }],
        password: [{ required: true, message: 'password is required', trigger: 'blur' }],
        tel: [{ required: true, message: 'tel is required', trigger: 'blur' }],
        gender: [{ required: true, message: 'gender is required', trigger: 'change' }],
        status: [{ required: true, message: 'status is required', trigger: 'change' }]
      },
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        const query = route.query
        if (query) {
          this.redirect = query.redirect
          this.otherQuery = this.getOtherQuery(query)
        }
      },
      immediate: true
    }
  },
  created() {
    // window.addEventListener('storage', this.afterQRScan)
  },
  mounted() {
    // if (this.loginForm.username === '') {
    //   this.$refs.username.focus()
    // } else if (this.loginForm.password === '') {
    //   this.$refs.password.focus()
    // }
  },
  destroyed() {
    // window.removeEventListener('storage', this.afterQRScan)
  },
  methods: {
    handleResgister() {
      this.show = true
    },
    checkCapslock(e) {
      const { key } = e
      this.capsTooltip = key && key.length === 1 && (key >= 'A' && key <= 'Z')
    },
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
          this.$store.dispatch('user/login', this.loginForm)
            .then((response) => {
              this.$router.push({ path: this.redirect || '/', query: this.otherQuery })
              this.loading = false
              console.log(this.$router);
              this.$notify({
                message: `欢迎${response.data.name}登录本系统`,
                type: 'success',
                duration: 2000,
              })
            })
            .catch(() => {
              this.loading = false
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    },
    resetTemp() {
      this.temp = {
        uid: undefined,
        name: '',
        password: '',
        type: '',
        tel: '',
        gender: '',
        IDcard: '',
        position: '',
        pay_charge: '',
        buy_timestamp: '',
        use_timestamp: '',
        status: ''
      }
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.uid = parseInt(Math.random() * 100) + 1024 // mock a uid
          regsiter(this.temp).then(() => {
            this.$notify({
              
              message: 'T添加成功',
              type: 'success',
              duration: 2000,
            })
            this.show = false
          })
        }
      })
    },
    formatJson(filterVal) {
      return this.list.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg:#283443;
$light_gray:#fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .login-form .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
   .login-form {
       .el-input {
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
   }
}
</style>

<style lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

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

  .thirdparty-button {
    position: absolute;
    right: 0;
    bottom: 6px;
  }

  @media only screen and (max-width: 470px) {
    .thirdparty-button {
      display: none;
    }
  }
}

.footer {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom:30px;
  button {
    width: 50%;
  }
}

.resgister {
  position: relative;
  top: -500px;
}

</style>
