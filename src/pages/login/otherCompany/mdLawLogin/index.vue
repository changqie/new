<!-- 曼德法规网 登录页 -->
<template>
  <div class="cloud-login v-class">
    <div class="ie-tips" v-if="showIETips">检测到您使用的是IE浏览器,建议您更换为谷歌浏览器或火狐浏览器</div>
    <div class="logo"></div>
    <div class="login-form" @keyup.enter="signin">
      <div class="login-form-title">欢迎登录法规智库</div>
      <div class="login-form-wrapper">
        <div class="login-form-content">
          <div class="login-form-input">
            <el-input v-model="username" placeholder="用户名" :maxlength="20" />
          </div>
          <div class="login-form-input">
            <el-input v-model="password" type="password" placeholder="请输入密码" :maxlength="30" />
          </div>
          <div class="login-form-control">
            <span><el-checkbox v-model="isRemember">记住密码</el-checkbox></span>
            <span @click="contactManager"><i class="el-icon-question" title="忘记密码?"/>忘记密码</span>
          </div>
          <div class="login-form-submit" @click="signin">登&nbsp;&nbsp;&nbsp;&nbsp;录</div>
          <loading :loading="loading">正在登录...</loading>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapActions } from 'vuex'
export default {
  name: 'Login',
  data () {
    return {
      username: this.$store.state.laws_urm || '', // 用户名
      password: this.$store.state.laws_prm || '', // 密码
      loading: false,
      isRemember: false, // 记住密码
      showIETips: false
    }
  },
  methods: {
    // 点击忘记密码事件
    contactManager () {
      this.$http.get('/forgetPassword', {}, {_this: this}, res => {
        this.$Message.warning('请联系系统管理员，联系方式：' + res.data)
      }, e => {
      })
    },
    // 点击登录按钮事件
    signin () {
      if (this.username === '') {
        this.$message.warning('用户名不能为空')
      } else if (this.password === '') {
        this.$message.warning('密码不能为空')
      } else {
        this.loginUser(this.username, this.password)
      }
    },
    // 登录事件
    loginUser (userName, PWD) {
      this.loading = true
      // 用户名密码加密
      userName = this.$base64(userName)
      PWD = this.$base64(PWD)
      this.$http.post('login',
        {
          username: userName,
          password: PWD
        }, {
          _this: this,
          loading: 'loading'
        }, res => {
          this.loading = false
          if (res.ok) {
            const JSESSIONID = document.cookie
            this.setJESSCookie(JSESSIONID)
            if (res.data.orgId === null || res.data.orgId === '') {
              this.$message.warning('未分配组织机构,请联系管理员分配后重新登录')
              return
            }
            let Base64 = require('js-base64').Base64
            let userInfoStr = Base64.decode(res.data)
            let userInfoObj = JSON.parse(userInfoStr)
            this.setToken(userInfoObj.usid) // vuex存储token
            this.getByUserInfoCode().then((userInfo) => {
              if (userInfo !== '' && userInfo !== null) {
                userInfo.workNum = userInfoObj.workNum
                if (userInfo.userPic !== null) {
                  this.getUserPic(userInfo.userPic).then((userPic) => {
                    // 把图片信息挂到用户信息中
                    userInfo.avator = 'uploadPath' + userPic.filePath + userPic.fileName
                    this.setUserInfo((JSON.stringify(userInfo)))
                    this.resetTime()
                    if (this.isRemember) {
                      this.rememberPwd({
                        username: this.username,
                        password: this.password
                      })
                    } else {
                      this.rememberPwd({
                        username: '',
                        password: ''
                      })
                    }
                    // 获取用户菜单
                    this.getMenu().then((menuList) => {
                      let hasHomeMenu = false
                      menuList.map((menuItem) => {
                        if (menuItem.id === 'G72J4WNFM8') {
                          hasHomeMenu = true
                        }
                      })
                      if (hasHomeMenu) {
                        this.setMenu(JSON.stringify(menuList)).then(res => {
                          this.$router.push('/home')
                        }, e => {
                          this.$message.warning('未获取到菜单')
                        })
                      } else {
                        this.$http.get('/logout', {}, {}, res => {
                          this.$message.warning({
                            content: '无权访问',
                            duration: 3
                          })
                        }, e => {})
                      }
                    })
                  }, e => {
                    this.$notify.error('用户信息拉取失败')
                  })
                } else {
                  this.setUserInfo((JSON.stringify(userInfo)))
                  this.resetTime()
                  if (this.isRemember) {
                    this.rememberPwd({
                      username: this.username,
                      password: this.password
                    })
                  } else {
                    this.rememberPwd({
                      username: '',
                      password: ''
                    })
                  }
                  // 获取用户菜单
                  this.getMenu().then((menuList) => {
                    let hasHomeMenu = false
                    menuList.map((menuItem) => {
                      if (menuItem.id === 'G72J4WNFM8') {
                        hasHomeMenu = true
                      }
                    })
                    if (hasHomeMenu) {
                      this.setMenu(JSON.stringify(menuList)).then(res => {
                        this.$router.push('/home')
                      }, e => {
                        this.$message.warning('未获取到菜单')
                      })
                    } else {
                      this.$http.get('/logout', {}, {}, res => {
                        this.$message.warning({
                          content: '无权访问',
                          duration: 3
                        })
                      }, e => {})
                    }
                  })
                }
              } else {
                let userInfo = {}
                for (let key in userInfoObj) {
                  if (key !== 'uname') {
                    userInfo[key] = userInfoObj[key]
                  } else {
                    userInfo.uName = userInfoObj[key]
                  }
                }
                this.setUserInfo(JSON.stringify((userInfo)))
                this.resetTime()
                if (this.isRemember) {
                  this.rememberPwd({
                    username: this.username,
                    password: this.password
                  })
                } else {
                  this.rememberPwd({
                    username: '',
                    password: ''
                  })
                }
                // 获取用户菜单
                this.getMenu().then((menuList) => {
                  let hasHomeMenu = false
                  menuList.map((menuItem) => {
                    if (menuItem.id === 'G72J4WNFM8') {
                      hasHomeMenu = true
                    }
                  })
                  if (hasHomeMenu) {
                    this.setMenu(JSON.stringify(menuList)).then(res => {
                      this.$router.push('/home')
                    }, e => {
                      this.$message.warning('未获取到菜单')
                    })
                  } else {
                    this.$http.get('/logout', {}, {}, res => {
                      this.$message.warning({
                        content: '无权访问',
                        duration: 3
                      })
                    }, e => {})
                  }
                })
              }
            }, e => {})
          } else if (res.respCode === 'r0012') {
            this.$message.error(res.message)
          } else {}
        }, e => {
          this.$notify.error({
            title: '错误',
            message: '请求超时,请重新登录'
          })
        })
    },
    // 获取用户信息
    getByUserInfoCode () {
      return new Promise((resolve, reject) => {
        this.$http.get('person/userInfo/getByUserInfoCode', {
        }, {
          _this: this
        }, res => {
          resolve(res.data)
        }, e => {
          reject(e)
        })
      })
    },
    // 获取用户头像
    getUserPic (attId) {
      return new Promise((resolve, reject) => {
        this.$http.get('/att/attFile/' + attId, {}, {_this: this}, res => {
          resolve(res.data)
        }, e => {
          reject(e)
        })
      })
    },
    /**
       * @description: 获取菜单
       * @author: chenxiaoxi
       * @date: 2018/11/11 13:42:14
       */
    getMenu () {
      return new Promise((resolve, reject) => {
        this.$http.get('userMenu', {}, {
          _this: this
        }, res => {
          if (res.ok) {
            resolve(res.data)
          }
        }, e => {
          reject(e)
        })
      })
    },
    ...mapMutations(['setToken', 'setUserInfo', 'resetTime', 'rememberPwd', 'setJESSCookie']),
    ...mapActions(['setMenu'])
  },
  computed: {
  },
  mounted () {
    if (this.$store.state.laws_urm !== '') {
      this.isRemember = true
    }
    const UA = navigator.userAgent.toLocaleLowerCase()
    if (UA.match(/msie/) != null || UA.match(/trident/) != null) {
      this.showIETips = true
    }
  }
}
</script>

<style lang="less">
  @import '~@/assets/styles/mixins';
  @import '~@/assets/styles/style';
  .cloud-login{
    position: relative;
    height: 100%;
    background: url("~@/assets/images/mdlaw_login.png") no-repeat center;
    background-size: 100%;
    .ie-tips{
      padding: 5px 0;
      color: #FFF;
      text-align: center;
      font-size: 14px;
    }
    @media screen and (max-width: 1366px) {
      .logo{
        position: absolute;
        top: 5.8vh;
        left: 9vw;
        width: 480px;
        height: 50px;
        background: url("~@/assets/images/mdlaw_logo.png") no-repeat center;
        background-position: center left;
      }
      .login-form {
        position: absolute;
        top: 50%;
        left: 50%;
        margin-top: -205px;
        margin-left: -205px;
        padding: 40px 40px 28px 40px;
        width: 410px;
        height: 410px;
        border-radius: 8px;
        background: rgba(41,98,154, .35);
        .login-form-title{
          position: relative;
          height: 60px;
          text-align: center;
          font-size: 30px;
          color: #FFF;
          .un-select();
          border-bottom: 1px solid #FFF;
        }
        .login-form-wrapper{
          margin-top: 40px;
          .flex();
          justify-content: center;
          height: 270px;
          .login-form-content{
            width: 100%;
            height: 100%;
            .login-form-input{
              margin-bottom: 24px;
              height: 48px;
              &:nth-child(2){
                margin-bottom: 0;
                .el-input__inner{
                  background-image: url("~@/assets/images/password.png") !important;
                }
              }
              .el-input{
                .flex();
                align-items: center;
                height: 100%;
                .el-input__inner{
                  padding: 0 25px 0 50px;
                  height: inherit;
                  font-size: 16px;
                  border-radius: 70px;
                  background: #EEF8FA;
                  background-image: url("~@/assets/images/user.png");
                  background-repeat: no-repeat;
                  background-position: 18px center;
                  background-size: 18px;
                  border: 1px solid transparent;
                }
              }
            }
            .login-form-control{
              margin-top: 16px;
              padding: 0 5px;
              .flex();
              justify-content: space-between;
              & > span{
                color: #fff;
                font-size: 14px;
                .el-checkbox{
                  color: #fff;
                  &:hover{
                    cursor: pointer;
                    color: rgba(248,181,81,1);
                  }
                  .is-checked{
                    .el-checkbox__inner{
                      background-color: #f8b551;
                      border-color: #f8b551;
                    }
                  }
                }
                .is-checked{
                  .el-checkbox__label{
                    color: #f8b551;
                  }
                }
                &:hover{
                  cursor: pointer;
                  color: rgba(248,181,81,1);
                }
              }
            }
            .login-form-submit{
              position: relative;
              margin-top: 30px;
              height: 48px;
              line-height: 48px;
              text-align: center;
              color: #FFF;
              font-size: 20px;
              background: rgba(248,181,81,1);
              border-radius: 50px;
              /*box-shadow: #171717 2px 2px 13px 5px;*/
              &::before{
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                display: none;
                width: 100%;
                height: 100%;
                background: rgba(255,255,255,.25);
                border-radius: 50px;
                transition: all .2s linear;
              }
              &:hover{
                cursor: pointer;
                &::before{
                  display: block;
                }
              }
            }
          }
        }
      }
    }
    @media screen and (min-width: 1367px) {
      .logo{
        position: absolute;
        top: 5.8vh;
        left: 9.3vw;
        width: 25vw;
        height: 8.3vh;
        background: url("~@/assets/images/mdlaw_logo.png") no-repeat center;
        background-size: 100%;
      }
      .login-form{
        position: absolute;
        top: 50%;
        left: 50%;
        padding: 6.5vh 0;
        margin-top: -27.6vh;
        margin-left: -13.25vw;
        width: 26.5vw;
        height: 55.2vh;
        border-radius: 8px;
        background: rgba(41,98,154, .35);
        transition: box-shadow 0.3s linear;
        box-shadow: rgba(0,0,0,.25) 0 0 5px;
        .login-form-title{
          position: relative;
          text-align: center;
          font-size: 30px;
          color: #FFF;
          .un-select();
        }
        .login-form-wrapper{
          .flex();
          justify-content: center;
          margin-top: 2.9vh;
          height: 33.8vh;
          .login-form-content{
            padding-top: 4.5vh;
            width: 22vw;
            height: 100%;
            border-top: 1px solid #FFF;
            .login-form-input{
              margin-bottom: 3.5vh;
              height: 6.25vh;
              &:nth-child(2){
                margin-bottom: 0;
                .el-input__inner{
                  background-image: url("~@/assets/images/password.png") !important;
                }
              }
              .el-input{
                height: 100%;
                .flex();
                align-items: center;
                .el-input__inner{
                  height: inherit;
                  border-radius: 70px;
                  background: #EEF8FA;
                  font-size: 16px;
                  padding: 0 25px 0 50px;
                  background-image: url("~@/assets/images/user.png");
                  background-repeat: no-repeat;
                  background-position: 18px center;
                  background-size: 18px;
                  border: 1px solid transparent;
                }
              }
            }
            .login-form-control{
              margin-top: 2.5vh;
              padding: 0 5px;
              .flex();
              justify-content: space-between;
              & > span{
                color: #fff;
                font-size: 14px;
                .el-checkbox{
                  color: #fff;
                  &:hover{
                    cursor: pointer;
                    color: rgba(248,181,81,1);
                  }
                  .is-checked{
                    .el-checkbox__inner{
                      background-color: #f8b551;
                      border-color: #f8b551;
                    }
                  }
                }
                .is-checked{
                  .el-checkbox__label{
                    color: #f8b551;
                  }
                }
                &:hover{
                  cursor: pointer;
                  color: rgba(248,181,81,1);
                }
              }
            }
            .login-form-submit{
              position: relative;
              margin-top: 2.2vh;
              height: 8.3vh;
              line-height: 5.5vh;
              color: #FFF;
              font-size: 20px;
              text-align: center;
              background: rgba(248,181,81,1);
              border-radius: 70px;
              &::before{
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                border-radius: 70px;
                background: rgba(255,255,255,.25);
                display: none;
              }
              &:hover{
                cursor: pointer;
                &::before{
                  display: block;
                }
              }
            }
          }
        }
      }
    }
  }
</style>
