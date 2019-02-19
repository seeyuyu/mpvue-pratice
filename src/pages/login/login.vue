<template>
  <div class="login_no">
    <div class="container loginFile">
      <!-- {{selected?'show':'hidden'}} -->
      <form :class="selected?'show':'hidden'" @submit="bindLoginCode" data-type="2">
        <div class="top-btn" id="top-btn" @click="countdown" v-if="sendcode">
          <text>获取验证码</text>
        </div>
        <!-- {{second?'show':'hidden'}} -->
        <div class="bot-btn" :class="second?'show':'hidden'" id="bot-btn" v-else>{{second}}s后重新获取</div>
        <div class></div>
        <input
          type="number"
          class="bor_bot"
          name="phoneNum"
          v-on:input="bindblurPhoneNum"
          maxlength="11"
          placeholder="请输入手机号"
        >
        <input
          type="number"
          class="bor_bot"
          name="phoneCode"
          @blur="bindblurPhoneCode"
          placeholder="验证码"
        >
        <div class="login_tab ovh">
          <div @click="selected1">密码登录</div>
        </div>
        <button class="sub_btn" type="primary" form-type="submit" @click="login_code">登录</button>
        <div class="loginFile_cue"></div>
      </form>
      <!-- {{selected1?'show':'hidden'}} -->
      <form :class="selected1?'show':'hidden'" @submit="bindLoginCode" data-type="1">
        <input type="number" name="phoneNum" maxlength="11" class="bor_bot" placeholder="输入手机号">
        <div class="pass_div">
          <input :password="pass" name="phonePas" class="bor_bot" placeholder="输入密码">
        </div>
        <div class="login_tab ovh">
          <div class="ovh" @click="selected">短信快捷登录</div>
        </div>
        <button type="primary" class="sub_btn" form-type="submit">登录</button>
        <div class="loginFile_url ovh pad_lr30"></div>
      </form>
    </div>
  </div>
</template>
<style>
@import "../../../static/main.css";
@import "../../../static/css/login.css";
</style>
<script>
import { reqfn } from "../../utils/request.js"; //记得带上{}花括号
export default {
  data() {
    return {
      vipList: [],
      videList: [],
      historyList: [],
      token: "",
      mine_nick: "",
      mine_arl: "",
      isshop: "",
      mymsg: {},
      myidentity: {},
      phoneNum: 0,
      second: 0,
      sendcode: true,
      selected: true,
      selected1: false,
      weideng: true,
      pass: true,
      eyeopen: false,
      non_have: true,
      myshop: false
    };
  },
  methods: {
    requestmymsg() {
      console.log("onshow");
      app.func.req(
        "v1/ucentor/users/count",
        {},
        function(res) {
          console.log(res); //401未登录
          if (res.code == 200) {
            that.setData({
              mymsg: res.data
            });
          }
        },
        "get",
        app.globalData.token
      );
      app.func.req(
        "v1/ucentor/teachers/identity",
        {},
        function(res) {
          console.log(res); //401未登录
          if (res.code == 200) {
            that.setData({
              myidentity: res.data
            });
          }
        },
        "get",
        app.globalData.token
      );
      app.func.req(
        "v3/ucentor/shops",
        {},
        function(res) {
          console.log(res); //401未登录
          if (res.code == 200) {
            that.setData({
              myshop: true,
              isshop: res.data.id
            });
          }
        },
        "get",
        app.globalData.token
      );
    },
    // 登录相关
    bindblurPhoneNum(e) {
      console.log(e.target.value);
      var that = this;
      that.phoneNum = e.target.value;
    },
    // 倒计时
    countdown() {
      console.log("countdown");
      var that = this;
      var phoneNum = that.phoneNum;
      var re = /^1\d{10}$/;
      if (!re.test(phoneNum)) {
        wx.showToast({
          title: "手机号不正确",
          icon: "loading"
        });
        return;
      }
      reqfn(
        "v1/sms",
        {
          type: 1,
          mobile: phoneNum
        },
        function(res) {
          console.log(res);
          if (res.code == 200) {
            that.sendcode = false;
            that.second = 60;
            // that.countDown(that);
          } else {
            var _data = res.message;
            wx.showToast({
              title: _data,
              icon: "loading"
            });
          }
        },
        "POST",
        that.globalData.token
      );
    },
    bindLoginCode(e) {
      console.log("bindLoginCode");
      var that = this;
      console.log(e);
      var type = e.target.dataset.type;
      var phoneNum = e.detail.value.phoneNum;
      var phoneCode = e.detail.value.phoneCode;
      var phonePas = e.detail.value.phonePas;
      if (phonePas) {
        phonePas = utilMd5.hexMD5(phonePas);
      }
      var re = /^1\d{10}$/;
      if (!re.test(phoneNum)) {
        wx.showToast({
          title: "手机号不正确",
          icon: "loading"
        });
        return;
      }
      var reCode = /^[0-9]*$/;
      if (type == 2) {
        if (!reCode.test(phoneCode)) {
          wx.showToast({
            title: "验证码不正确",
            icon: "loading"
          });
          return;
        }
      }
      console.log(type, phoneNum, phoneCode, phonePas);
      reqfn(
        "v1/logins/login",
        {
          type: type,
          mobile: phoneNum,
          password: phonePas,
          code: phoneCode
        },
        function(res) {
          console.log(res);
          if (res.code == 200) {
            that.globalData.token = res.data.token;
            console.log(res.data.info.uid);
            that.globalData.fid = res.data.info.uid;
            that.globalData.mine_nick = res.data.info.nickname;
            that.globalData.mine_arl = res.data.info.avatar;
            (that.weideng = false), requestmymsg(that);
          } else {
            wx.showToast({
              title: res.message,
              icon: "loading"
            });
          }
        },
        "POST",
        that.globalData.token
      );
    },

    bindLoginPas() {
      console.log("bindLoginPas");
      // console.log(e);
    },
    //登录页之间切换
    selected() {
      console.log("selected");
      this.selected1 = false;
      this.selected = true;
      // this.setData({
      //   selected1: false,
      //   selected: true
      // });
    },
    selected1() {
      console.log("selected1");
      this.selected1 = true;
      this.selected = false;
      // this.setData({
      //   selected: false,
      //   selected1: true
      // });
    },
    // 明密文切换
    checkpass() {
      console.log("checkpass");
      this.pass = false;
      this.eyeopen = true;
      // this.setData({
      //   pass: false,
      //   eyeopen: true
      // });
    },
    checkpassd() {
      console.log("checkpassd");
      this.pass = true;
      this.eyeopen = false;
      // this.setData({
      //   pass: true,
      //   eyeopen: false
      // });
    },
    // 退出登录
    mine_quit() {
      console.log("退出登录");
      var that = this;
      // app.func.req(
      //   "v1/ucentor/users/logout",
      //   {},
      //   function(res) {
      //     console.log(res); //401未登录
      //     if (res.code !== 200) {
      //       wx.navigateTo({
      //         url: "../login/login?"
      //       });
      //     } else {
      //       app.globalData.token = "";
      //       app.globalData.mine_arl = "";
      //       app.globalData.mine_nick = "";
      //       that.setData({
      //         weideng: true,
      //         mine_arl: app.globalData.mine_arl,
      //         mine_nick: app.globalData.mine_nick
      //       });
      //     }
      //   },
      //   "POST",
      //   app.globalData.token
      // );
    },
    // 未开放
    none_have() {
      var that = this;
      that.non_have = false;
      // that.setData({
      //   non_have: false
      // });
      setTimeout(function() {
        that.non_have = true;
        // that.setData({
        //   non_have: true
        // });
      }, 2000);
    }
  }
};
</script>
