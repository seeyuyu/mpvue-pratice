<template>
  <!--顶部导航-->
  <div class="body">
    <!--搜索框-->
    <div class="false_search_div" @click="show_search">
      <div class="false_search fl" @click="show_search">
        <div class="search_icon"></div>搜索你喜欢的用户.视频.栏目
      </div>
      <div class="see_history fr" bindtap="go_history">历史</div>
    </div>
    <div class="content_body">
      <!--轮播图-->
      <div class="content_changeimg">
        <swiper class="swiper_box" interval="5000" duration="800" circular="true">
          <block v-for="items in imgUrls" :key="items">
            <navigator url="../../detail/teacher/teacher?uid=">
              <swiper-item>
                <div class="swiper_slid">
                  <img :src="items.pic" class="slide-image slide_image_center">
                </div>
              </swiper-item>
            </navigator>
          </block>
        </swiper>
      </div>
      <!--头条-->
      <div class="top_news">
        <div class="top_title_div">
          <div class="fl">头条</div>
        </div>
        <div v-for="items in tips_new" :key="items" class="tips_txt_list">
          <navigator>
            <i class="top_icon fl"></i>
            <div class="one_line top_new_list">{{items.title}}</div>
          </navigator>
        </div>
      </div>
      <!--专栏推荐-->
      <div class="good_teacher">
        <div class="top_title top_left">专栏推荐</div>
        <div class="goods_lists">
          <!-- <teacherli teacherarr="{{goodTeacher}}" environment="{{environment}}"></teacherli> -->
          <view class="goods_list" v-for="item in goodTeacher" :key="item">
            <!-- {{item.uid}} -->
            <navigator open-type="switchTab" :url="'/pages/teacher/main?uid='+item.uid" class="goods_list_a">
              <view class="goods_list_img fl">
                <img :src="item.avatar">
              </view>
              <view class="good_con fl">
                <view class="good_title">{{item.nickname}}</view>
                <view class="good_sign">{{item.rank}}</view>
                <view>{{item.sign}}</view>
                <view class="good_price">
                  <view class="fl">
                    <text class="pricecolor">￥{{item.price}}</text>
                    | {{item.episode_num}}节
                  </view>
                  <!-- <text  class="novip fl">非会员</text> -->
                </view>
              </view>
            </navigator>
          </view>
        </div>
        <!-- <navigator class="all_top_course" open-type="switchTab" url="../subscribe/subscribe?share_uid={{share_uid}}">查看全部</navigator> -->
      </div>
      <!--新课推荐-->
      <view class="special_class_div" v-if="goodCourse.length>0">
        <view class="special_class_txt">新课推荐</view>
        <scroll-view
          scroll-x="true"
          style=" white-space: nowrap; display: flex"
          class="bigclass_scroll"
        >
          <view
            class="bigclass_view"
            style=" width: 160rpx; height: 320rpx; display: inline-block; margin-left:30rpx"
            v-for="item in goodCourse"
            :key="item"
          >
            <!-- {{item.id}} -->
            <navigator url="../../detail/teacher/teacher?uid=" class="special_class_a">
              <view class="fl">
                <view class="bigclass_view_image">
                  <img lazy-load="true" :src="item.avatar">
                </view>
                <view class="bigclass_view_txt">{{item.nickname}}</view>
              </view>
            </navigator>
          </view>
        </scroll-view>
      </view>
      <!--专题推荐-->
      <view class="top_subject">
        <view class="special_class_txt">专题推荐</view>
        <scroll-view
          scroll-x="true"
          style=" white-space: nowrap; display: flex"
          class="subject_scrolldiv"
        >
          <view class="subject_false"></view>
          <view
            v-for="item in goodSubject"
            :key="item"
            :data-id="item.id"
            :data-inde="index"
            class="subject_scroll"
            :class="_sub==index?'subactive':''"
            bindtap="subchectout"
          >{{item.name}}</view>
          <view class="subject_false"></view>
        </scroll-view>
        <view class="goods_lists spe_subject">
          <!-- <teacherli teacherarr="{{subjectList}}" environment="{{environment}}"></teacherli> -->
          <view class="goods_list" v-for="item in subjectList" :key="item">
            <!-- {{item.uid}} -->
            <navigator url="../../detail/teacher/teacher?uid=" class="goods_list_a">
              <view class="goods_list_img fl">
                <img :src="item.avatar">
              </view>
              <view class="good_con fl">
                <view class="good_title">{{item.nickname}}</view>
                <view class="good_sign">{{item.rank}}</view>
                <view>{{item.sign}}</view>
                <view class="good_price">
                  <view class="fl">
                    <text class="pricecolor">￥{{item.price}}</text>
                    | {{item.episode_num}}节
                  </view>
                  <!-- <text  class="novip fl">非会员</text> -->
                </view>
              </view>
            </navigator>
          </view>
        </view>
        <!-- <navigator
          url="../../detail/subjectlist/subjectlist?subid={{showId}}&share_uid={{share_uid}}"
          class="subject_more"
        >查看该专题中所有栏目</navigator>-->
      </view>
      <!-- 猜你喜欢 -->
      <view class="yourlike" v-if="guseeArr.length>1">
        <view class="top_title top_left">猜你喜欢</view>
        <view class="like_divlist">
          <view class="like_div" v-for="item in guseeArr" :key="item">
            <!-- {{item.uid}} -->
            <navigator url="../../detail/teacher/teacher?uid=">
              <view class="like_div_image fl">
                <img :src="item.avatar">
              </view>
              <view class="like_div_txt fl">
                <view class="like_div_title">{{item.nickname}}</view>
                <view>{{item.sign}}</view>
              </view>
              <view class="fr like_div_money">
                <view class="like_div_price pricecolor">{{item.price>0?'¥'+item.price:''}}</view>
                <view>共{{item.episode_num}}节</view>
              </view>
            </navigator>
          </view>
        </view>
      </view>
    </div>
  </div>
</template>
<style>
@import "../../../static/main.css";
@import "../../../static/teacherli.css";
@import "../../../static/css/homepage.css";
</style>
<script>
var Fly = require("flyio/dist/npm/wx");
var fly = new Fly();
var subjectarr = {};
export default {
  data() {
    return {
      imgUrls: [],
      navList: [],
      subList: [],
      hotList: [],
      aboutUser: [],
      aboutVideo: [],
      history_search: [],
      spacial: [],
      searchvalue: "",
      inputValue: "",
      shop_name: "",
      shop_id: "",
      tips_new: [],
      tips_new_first: [],
      classList: [],
      newList: [],
      goodatr: [],
      goodTeacher: [],
      subjectList: [],
      goodCourse: [],
      goodSubject: [],
      adv: [],
      guseeArr:[],
      navShow: false,
      navShownum: 1,
      showId: 0,
      showAll: true,
      indicatorDots: true,
      autoplay: true,
      _num: 0,
      _sub: 0,
      searchPage: false,
      searchResult: true,
      hidden: true,
      content_body: true,
      list_none: false,
      goreach: false,
      mins: false,
      environment: false
    };
  },
  methods: {
    // 打开搜索
    show_search() {
      wx.navigateTo({
        url: "../../detail/search/search?shop_id=" + shop_id
      });
    },
    getData() {
      var that = this;
      // banner
      fly
        .get("https://h.xlzhao.com/v1/ads/1?v=2", {})
        .then(function(res) {
          that.imgUrls = res.data.data;
        })
        .catch(function(error) {
          console.log(error);
        });

      //头条
      fly
        .get("https://h.xlzhao.com/v1/news/hot", {})
        .then(function(res) {
          // for (var i = 0; i < 3; i++) {
          //   if (Number(res.data.item[i].type) == 1) {
          //     res.data.item[i].url = '../../detail/teacher/teacher?uid=' + res.data.item[i].unifie_id + '&shop_id=' + shop_id + '&share_uid=' + share_uid;
          //     res.data.item[i].icon = 'teacher_icon';
          //   } else if (Number(res.data.item[i].type) == 2) {
          //     res.data.item[i].url = '../../detail/active/active?acid=' + res.data.item[i].unifie_id + '&shop_id=' + shop_id + '&share_uid=' + share_uid;
          //     res.data.item[i].icon = 'teacher_icon';
          //   } else if (Number(res.data.item[i].type) == 3) {
          //     res.data.item[i].url = '../../detail/videoDetail/videoDetail?id=' + res.data.item[i].unifie_id + '&uid=' + res.data[i].unifie_id + '&shop_id=' + shop_id + '&share_uid=' + share_uid;
          //     res.data.item[i].icon = 'teacher_icon';
          //   } else if (Number(res.data.item[i].type) == 0) {
          //     res.data.item[i].url = '../../detail/article/article?aid=' + res.data.item[i].id + '&shop_id=' + shop_id + '&share_uid=' + share_uid;
          //     res.data.item[i].icon = 'teacher_icon';
          //   }
          // }
          that.tips_new = res.data.data.item;
        })
        .catch(function(error) {
          console.log(error);
        });

      // 专栏
      fly
        .get("https://h.xlzhao.com/v1/recommends/vip", {})
        .then(function(res) {
          that.goodTeacher = res.data.data.first;
        })
        .catch(function(error) {
          console.log(error);
        });

      // 新课精选
      fly
        .get("https://h.xlzhao.com/v2/subscribes/index-new", {})
        .then(function(res) {
          that.goodCourse = res.data.data;
        })
        .catch(function(error) {
          console.log(error);
        });

      // 专题推荐
      fly
        .get("https://h.xlzhao.com/v1/topics/index-topic", {})
        .then(function(res) {
          for (var i = 0; i < res.data.data.length; i++) {
            var sub_id = res.data.data[i].id;
            subjectarr[sub_id] = res.data.data[i].teacher_info;
          }
          // console.log(res.data.data);
          that.goodSubject = res.data.data;
          that.subjectList = res.data.data[0].teacher_info;
        })
        .catch(function(error) {
          console.log(error);
        });

      // 猜你喜欢
      fly
        .get("https://h.xlzhao.com/v1/customs/guess-teacher", {})
        .then(function(res) {
          that.guseeArr = res.data.data;
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    clickHandle(msg, ev) {
      console.log("clickHandle:", msg, ev);
    }
  },

  created() {
    // 调用应用实例的方法获取全局数据
    this.getData();
  }
};
</script>
