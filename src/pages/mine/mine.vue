<template>
  <view class="login_ok">
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
</style>
<script>
var Fly = require("flyio/dist/npm/wx");
var fly = new Fly();
var token="a9effc31a5da49472991c5d97b8bb48b"
fly.config.headers={
  "Content-Type":"application/json",
  "Authorization":"Bearer "+token
};
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
    getData() {
      var that = this;
      // banner
      fly
        .get("https://h.xlzhao.com/v1/ucentor/vips/buy?page=1", {})
        .then(function(res) {
          console.log(res.data);
          if (res.data.code == 200) {
            // that.mine_arl=app.globalData.mine_arl
            // that.mine_nick=app.globalData.mine_nick
          } else if (res.data.code == 401) {
            that.weideng=true
          } else {
            wx.showModal({
              title: "提示",
              content: res.data.message,
              showCancel: false,
              confirmText: "好"
            });
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    }
  },
  created() {
    // 调用应用实例的方法获取全局数据
    this.getData();
  }
};
</script>

