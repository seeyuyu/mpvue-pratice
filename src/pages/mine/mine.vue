<template>
  <view class="login_no" v-if="weideng">
    <div class="login_no">
      <div class="container loginFile">
        <form :class="selected?'show':'hidden'" @submit="bindLoginCode" data-type="2">
          <div class="top-btn" id="top-btn" @click="countdown" v-if="sendcode">
            <text>获取验证码</text>
          </div>
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
            <div @click="checkoutmi">密码登录</div>
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
            <div class="ovh" @click="checkoutcode">短信快捷登录</div>
          </div>
          <button type="primary" class="sub_btn" form-type="submit">登录</button>
          <div class="loginFile_url ovh pad_lr30"></div>
        </form>
      </div>
    </div>
  </view>
  <view class="login_ok" v-else>
    <view class="newminehead">
      <view class="newmine_mes">
        <view class="newmine_mes_icon fr" @click="none_have"></view>
      </view>
      <view class="newminetxt">
        <view class="mine_headimg">
          <img :src="mine_arl">
        </view>
        <view class="mine_headname">{{mine_nick}}</view>
        <view class="newmine_quit fr" @click="mine_quit">退出登录</view>
      </view>
    </view>
    <view class="newminenav" @click="none_have">
      <view class="newnavlist fl">
        <view class="newnavlistnum">{{mymsg.amount}}</view>
        <view>钱包</view>
      </view>
      <view class="newnavlist fl">
        <view class="newnavlistnum">{{mymsg.gold}}</view>
        <view>金币</view>
      </view>
      <view class="newnavlist fl">
        <view class="newnavlistnum">{{mymsg.follow}}</view>
        <view>关注</view>
      </view>
    </view>
    <view class="newmineul">
      <view class="newmineli" v-if="myidentity.is_teacher>0" @click="none_have">
        <navigator url="###">
          <view class="newmineli_icon newli_icon1 fl"></view>我是老师
        </navigator>
      </view>
      <view class="newmineli">
        <navigator url="../../detail/mystudent/mystudent">
          <view class="newmineli_icon newli_icon2 fl"></view>我是学生
        </navigator>
      </view>
      <view class="newmineli" v-if="myshop">
        <!-- {{isshop}} -->
        <navigator url="../../three/shopindex/shopindex?shop_id=">
          <view class="newmineli_icon newli_icon3 fl"></view>知识小店
        </navigator>
      </view>
      <view class="newmineli" v-if="myidentity.is_agent>0" @click="none_have">
        <navigator url="###">
          <view class="newmineli_icon newli_icon4 fl"></view>小店代理
        </navigator>
      </view>
    </view>
    <!-- <view class="tips_none" hidden="{{non_have}}">暂未开通，请前往App或微信公众号</view> -->
  </view>
</template>
<style>
@import "../../../static/main.css";
@import "../../../static/css/mine.css";
@import "../../../static/css/login.css";
</style>
<script>
var Fly = require("flyio/dist/npm/wx");
var fly = new Fly();
// var reqfn = require('utils/request.js');
import { reqfn } from "../../utils/request.js";
var utilMd5 = require("../../utils/md5.js");
// var token="a9effc31a5da49472991c5d97b8bb48b"
// fly.config.headers={
//   "Content-Type":"application/json",
//   "Authorization":"Bearer "+token
// };
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
      var that = this;
      console.log("onshow");
      reqfn(
        "v1/ucentor/users/count",
        {},
        function(res) {
          console.log(res); //401未登录
          if (res.code == 200) {
            console.log(res);
            that.mymsg = res.data;
          }
        },
        "GET",
        that.globalData.token
      );

      reqfn(
        "v1/ucentor/teachers/identity",
        {},
        function(res) {
          console.log(res); //401未登录
          if (res.code == 200) {
            that.myidentity = res.data;
          }
        },
        "GET",
        that.globalData.token
      );

      reqfn(
        "v3/ucentor/shops",
        {},
        function(res) {
          console.log(res); //401未登录
          if (res.code == 200) {
            that.myshop = true;
            that.isshop = res.data.id;
          }
        },
        "GET",
        that.globalData.token
      );
    },
    //登录页之间切换
    checkoutmi() {
      // console.log("密码登陆");
      this.selected1 = true;
      this.selected = false;
    },
    checkoutcode() {
      // console.log("验证码登陆");
      this.selected1 = false;
      this.selected = true;
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
    // 验证码登录
    bindLoginCode(e) {
      console.log("bindLoginCode");
      var that = this;
      console.log(e);
      var type = e.target.dataset.type;
      var phoneNum = e.target.value.phoneNum;
      var phoneCode = e.target.value.phoneCode;
      var phonePas = e.target.value.phonePas;
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
            that.mine_nick = res.data.info.nickname;
            that.mine_arl = res.data.info.avatar;
            that.weideng = false;
            that.requestmymsg(that);
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
    },
    // 明密文切换
    checkpass() {
      console.log("checkpass");
      this.pass = false;
      this.eyeopen = true;
    },
    checkpassd() {
      console.log("checkpassd");
      this.pass = true;
      this.eyeopen = false;
    },
    // 退出登录
    mine_quit() {
      console.log("退出登录");
      var that = this;
    },
    // 未开放
    none_have() {
      var that = this;
      that.non_have = false;
      setTimeout(function() {
        that.non_have = true;
      }, 2000);
    }
  },
  onLoad() {
    // 调用应用实例的方法获取全局数据
    // this.getData();
    if(this.globalData.token && this.globalData.token!=''){
      console.log(this.globalData.token)
      this.weideng=false
    }else{
      // 未登录
      // console.log(this.globalData.token)
      this.weideng=true
      this.requestmymsg(this)
    }
  },
  onShow() {
    // 调用应用实例的方法获取全局数据
    // this.getData();
    if(this.globalData.token && this.globalData.token!=''){
      console.log(this.globalData.token)
      this.weideng=false
    }else{
      // 未登录
      // console.log(this.globalData.token)
      this.weideng=true
    }
  }
};
</script>

