<!--07-24UI改版-->
<template>
  <div class="container">
    <!--07-24UI改版-->
    <div class="header02" v-if="resData.user_info">
      <div class="head_bigpic">
        <img class="headpic" :src="resData.user_info.background">
        <div class="headpic_bg"></div>
      </div>
      <div class="head_title">
        <div class="head_title_left fl">
          <div class="head_title_name one_line">{{resData.user_info.nickname}}</div>
          <div class="one_line">{{resData.user_info.sign}}</div>
        </div>
        <navigator
          class="share_sth2 fr"
          :url="'../../three/material/material?teacher_id='+resData.user_info.uid+'&shop_id='+shop_id+'&mine_id='+mine_id+'&share_uid='+share_uid"
        >分享素材</navigator>
      </div>
    </div>
    <!--导航-->
    <div class="teacher_nav">
      <div class="teacher_nav_div" :class="ding?'ding':''">
        <div class="nav_text" :class="inum == 1?'cur':''" data-nav="1" @click="teacher_all">栏目
          <div class="nav_border"></div>
        </div>
        <div class="nav_text" :class="inum == 0?'cur':''" data-nav="0" @click="teacher_all">评价
          <div class="speak_icon"></div>
          <div class="nav_border"></div>
        </div>
      </div>
    </div>
    <!--下面是视频详情页列表的形式-->
    <div class="video_playFiles" :class="is_show?'hidden':'show'" data-nav="0" v-if="inum == 1">
      <!--7-25UI改版-->
      <div class="list_all" v-if="listVideo">
        <div class="list_wrapper02" v-for="videosList in listVideo" :key="videosList">
          <navigator :url="'/pages/videoDetail/main?id='+videosList.id+'&uid='+videosList.id+'&userid='+userid+'&shop_id='+shop_id+'&share_uid='+share_uid">
            <div class="fl list_num">{{index+1}}.</div>
            <div class="list_num_title">
              <div class="two_line">
                <span class="try_icon" v-if="videosList.payment==0">试看</span>
                {{videosList.name}}
              </div>
              <div class="list_duration">时长{{videosList.duration}}</div>
            </div>
            <div class="lock_icon" v-if="videosList.payment>0 && videosList.is_buy==0"></div>
          </navigator>
        </div>
      </div>
      <div v-if="have_video">
        <div class="no_bird">
          <img src="http://m.xlzhao.com/images/bird.png" mode="widthFix">
          <div>该作者暂无相关作品</div>
        </div>
      </div>
      <div v-if="resDatanum.count>4">
        <navigator
          :url="'../../detail/teacherAll/teacherAll?uid='+op_uid+'&shop_id='+shop_id+'&share_uid='+share_uid"
          class="see_more_class"
        >查看全部课程</navigator>
      </div>
      <!--7-25改版 简介-->
      <div>
        <div class="class_intro_title">课程简介</div>
        <div class="template_div">
          <!-- <template is="wxParse" data="{{wxParseData:tell_article.nodes}}"/> -->
          <!-- <wxParse :content="tell_article.nodes" @preview="preview" @navigate="navigate" /> -->
          <!-- <template> -->
          <!-- <div> -->
          <wxParse :content="tell_article" @preview="preview" @navigate="navigate"/>
          <!-- </div> -->
          <!-- </template> -->
        </div>
        <div v-if="have" class="no_bird">
          <img src="http://m.xlzhao.com/images/bird.png" mode="widthFix">
          <div>该老师还没有完善个人简介哦~</div>
        </div>
      </div>
      <!--下面是底部-->
      <div v-if="environment">
        <div class="vip_footer" :class="price_bottom?'vip_ok':'vip_none'" v-if="allbottom">
          <div class="fl vip_footer_guan alguan" v-if="isfollow==1" @click="nofollow">
            <i class="alguan_icon"></i>已关注
          </div>
          <div class="fl vip_footer_guan" @click="ifollow" v-else>
            <i class="guan_icon"></i>关注
          </div>
          <navigator
            class="link2_vip vip_none1" id="link2_vip" :url="'../confirm/confirm?priceVideo='+class_p+'&op_uid='+op_uid+'&videocon='+videocon+'&nameVideo='+nameVideo+'&bgImg='+bgImg+'&shop_id='+shop_id+'&share_uid='+share_uid">
            <div class="be-vip">
              <span id="span1_vip">¥ {{class_all}}订阅栏目</span>
            </div>
          </navigator>
          <div class="link2_vip vip_none2" id="link2_vip">
            <div class="be-vip">
              <span id="span2_vip" class="span2_txt">{{surplus_days}}天后到期</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--评论-->
    <div class="video_intro" v-if="inum == 0">
      <div class="speak_tip">
        <div class="speak_tip_txt fl" @click="pop1">{{tips_txt}}</div>
        <div class="fr anwer_icon" @click="what"></div>
      </div>
      <div class="tag_all">
        <div v-for="item in comment.tags" :key="item" class="speak_tag" :class="item.type==1?'':'color666'">{{item.tag}}({{item.count}})</div>
      </div>
      <div class="comm_section video_fff">
        <div class="comment" id="comment">
          <span>
            全部评论
            <span class="colorff7a2e">({{comment.count}})</span>
          </span>
        </div>
        <div v-if="comments.length>0">
          <div v-for="commentItem in comments" :key="commentItem">
            <div class="comment-title">
              <div class="comm-headpic">
                <img :src="commentItem.avatar">
              </div>
              <span class="comm-username">{{commentItem.nickname}}</span>
              <span class="comm-time">{{commentItem.created_at}}</span>
            </div>
            <div class="comm-main">{{commentItem.content}}</div>
          </div>
          <div class="list_none" v-if="list_none">到底啦~</div>
        </div>
        <div v-else>
          <img src="http://static1.xlzhao.com/frontend/images/icon_no_comment.png" mode="widthFix" class="comm_bird">
          <div class="comm_txt">抱歉，该老师的学员好像都很懒</div>
          <div class="comm_txt">什么都没留下噢！</div>
        </div>
      </div>
    </div>
    <div class="evaluate_bg" v-show="!isevaluate"></div>
    <div v-if="evaluateCon">
      <div class="evaluate_detail" v-show="!isevaluate">
        <div class="close_evaluate" @click="close_evalute"></div>
        <div class="evaluate_detail_title" v-if="evaluateCon">点评奖{{evaluateCon.gold}}金币</div>
        <div class="evaluate_detail_tip">您已评价</div>
        <div class="evaluate_tag_div">
          <div class="evaluate_detail_tag fl" v-for="item in evaluateCon.tags" :key="item">{{item}}</div>
        </div>
        <div class="evaluate_detail_con">{{evaluateCon.comment}}</div>
      </div>
    </div>
    <!--加载-->
    <loading v-show="!hidden">加载中...</loading>
  </div>
</template>
<style>
@import url("~mpvue-wxparse/src/wxParse.css");
</style>
<style src="../../../static/main.css"></style>
<style src="../../../static/css/teacher.css">
/* @import "../../../static/css/homepage.css"; */
</style>
<script>
import { reqfn } from "../../utils/request.js";
// var WxParse = require('../../../wxParse/wxParse.js');
import wxParse from "mpvue-wxparse";

var hb_con = "";
var all_uid = "";
var class_name = "";
var video_page = 1;
var sort = "";
var shop_id = "";
var class_name_img = "";
var list_video = [];
var flag = false;
var canreach = false;
var talk_list = false;
var canscroll = false;
var class_all = "";
var share_uid = "";
var pagenum = 1;
export default {
  components: {
    wxParse
  },
  data() {
    return {
      is_show: false,
      is_charge: 2,
      isfollow: true,
      canreach: false,
      list_none: false,
      have_video: false,
      overshow: false,
      hidden: false,
      price_bottom: false,
      allbottom: false,
      tokee: true,
      ding: false,
      have: false,
      isevaluate: true,
      mins: false,
      environment: false,
      inum: 1,
      sort_num: 1,
      pop1: "popdiv",
      tips_txt: "订阅栏目后点评赢金币！（金币可兑换现金）",
      userid: "",
      followText: "",
      surplus_days: "",
      class_all: "",
      resData: {},
      listVideo: [],
      op_uid: "",
      resDatanum: "",
      mine_id: "",
      tell_article: ""
    };
  },
  methods: {
    //    格式化秒数 换成： 00:00:00
    formatSeconds: function(value) {
      var seconds = parseInt(value); // 秒
      var minutes = 0; // 分
      var hours = 0; // 小时
      var result;
      if (seconds > 60) {
        minutes = parseInt(seconds / 60);
        seconds = parseInt(seconds % 60);
        if (minutes > 60) {
          hours = parseInt(minutes / 60);
          minutes = parseInt(minutes % 60);
        }
      }
      if (seconds < 10) {
        result = "0" + parseInt(seconds);
      } else {
        result = "" + parseInt(seconds);
      }
      if (minutes > 0) {
        if (minutes < 10) {
          result = "0" + parseInt(minutes) + "：" + result;
        } else {
          result = "" + parseInt(minutes) + "：" + result;
        }
      }
      if (hours > 0) {
        if (hours < 10) {
          result = "0" + parseInt(hours) + "：" + result;
        } else {
          result = "" + parseInt(hours) + "：" + result;
        }
      }
      return result;
    },
    firstload: function(that, sort) {
      reqfn(
        "v1/videos/video-part/" + all_uid + "?sort=asc&is_limit=1&page=1",
        {},
        function(res) {
          console.log(res.code);
          if (res.code == 200) {
            list_video = res.data.videos;
            if (res.data.count == 0) {
              console.log("没有数据");
              that.have_video = true;
              that.hidden = true;
              return false;
            }
            console.log(res.data.videos);
            that.listVideo = list_video;
            that.resDatanum = res.data;
            that.hidden = true;
            console.log(that.listVideo);
            console.log(that.flag);
            if (that.flag) {
              order(that);
            }
          } else {
            that.hidden = true;
            wx.showToast({
              title: res.message,
              icon: "loading"
            });
          }
        },
        "GET",
        that.globalData.token
      );
    },
    list_show: function() {
      var that = this;
      if (that.data.is_show) {
        that.is_show = false;
      } else {
        that.is_show = true;
      }
    },
    teacher_all: function(e) {
      var that = this;
      console.log(e);
      that.inum = e.target.dataset.nav;
      if (e.target.dataset.nav == 0) {
        talk_list = true;
      } else {
        talk_list = false;
      }
    },
    ifollow: function() {
      var that = this;
      var type = "POST";
      // app.func.req(
      //   "v1/ucentor/follows",
      //   {
      //     fid: all_uid
      //   },
      //   function(res) {
      //     if (res.code == 200) {
      //       that.setData({
      //         followBg: false,
      //         isfollow: 1
      //       });
      //       wx.showToast({
      //         title: "已关注",
      //         icon: "success",
      //         duration: 1500
      //       });
      //     } else if (res.code == 401) {
      //       wx.navigateTo({
      //         url: "../../tabBar/login/login"
      //       });
      //     }
      //   },
      //   type,
      //   app.globalData.token
      // ); //delete
      reqfn(
        "v1/ucentor/users/count",
        {
          fid: all_uid
        },
        function(res) {
          if (res.code == 200) {
            that.followBg = false;
            that.isfollow = 1;
            wx.showToast({
              title: "已关注",
              icon: "success",
              duration: 1500
            });
          } else if (res.code == 401) {
            wx.navigateTo({
              url: "../../tabBar/login/login"
            });
          }
        },
        "POST",
        that.globalData.token
      );
    },
    mine_page: function() {},
    // 排序
    // video_sort: function(e) {
    //   var that = this;
    //   if (e.target.dataset.sort == 1) {
    //     that.setData({
    //       sort_num: 2
    //     });
    //     sort = "asc";
    //     video_page = 1;
    //     firstload(that, sort);
    //   } else if (e.target.dataset.sort == 2) {
    //     that.setData({
    //       sort_num: 1
    //     });
    //     sort = "desc";
    //     video_page = 1;
    //     firstload(that, sort);
    //   }
    // },
    close_overtip: function() {
      var that = this;
      that.overshow = false;
    },
    open_overtip: function() {
      var that = this;
      that.overshow = true;
    },
    // 弹窗
    popdiv: function() {
      wx.showModal({
        content: "付费用户才可评价栏目",
        confirmText: "知道了",
        confirmColor: "#2A90D7",
        showCancel: false,
        success: function(res) {
          if (res.confirm) {
            console.log("用户点击确定");
          } else {
            console.log("用户点击取消");
          }
        }
      });
    },
    popnav: function() {
      wx.navigateTo({
        url:
          "../../detail/evaluate/evaluate?shop_id=" +
          shop_id +
          "&all_uid=" +
          all_uid
      });
    },
    // 已经评价过
    popalready: function() {
      var that = this;
      that.isevaluate = false;
    },
    close_evalute: function() {
      var that = this;
      that.isevaluate = true;
    },
    what: function() {
      wx.showModal({
        content: "可在“我的-金币”中将金币兑换成现金",
        confirmText: "知道了",
        confirmColor: "#2A90D7",
        showCancel: false,
        success: function(res) {
          if (res.confirm) {
            // console.log('用户点击确定')
          } else {
            // console.log('用户点击取消')
          }
        }
      });
    }
  },
  onLoad(navi) {
    //  这里要非常注意，微信的scroll-view必须要设置高度才能监听滚动事件，所以，需要在页面的onLoad事件中给scroll-view的高度赋值
    var that = this;
    console.log(navi);
    console.log(that.globalData.mins);
    sort = "";
    if (navi.shop_id) {
      shop_id = navi.shop_id;
      that.shop_id = shop_id;
      that.mins = that.globalData.mins;
      // app.func.req(
      //   "v1/shops/" + shop_id,
      //   {},
      //   function(res) {
      //     wx.setNavigationBarTitle({
      //       title: res.data.shop_name
      //     });
      //   },
      //   "GET",
      //   app.globalData.token
      // );
      reqfn(
        "v1/shops/" + shop_id,
        {},
        function(res) {
          console.log(res);
          wx.setNavigationBarTitle({
            title: res.data.shop_name
          });
        },
        "GET",
        that.globalData.token
      );
    } else {
      shop_id = 0;
      that.mins = that.globalData.mins;
      wx.setNavigationBarTitle({
        title: "学两招"
      });
    }
    if (navi.share_uid && navi.share_uid != that.globalData.fid) {
      share_uid = navi.share_uid;
    }
    console.log(share_uid);
    that.share_uid = share_uid;
    console.log(share_uid);
    all_uid = navi.uid;
    video_page = 1;
    wx.getSystemInfo({
      success: function(res) {
        if (res.platform == "ios") {
          that.environment = false;
        } else if (res.platform == "android") {
          that.environment = true;
        } else {
          that.environment = true;
        }
        that.scrollHeight = res.windowHeight;
      }
    });

    // 新
    reqfn(
      "v1/users/user-info/" + navi.uid,
      {},
      function(res) {
        console.log(res.data.user_info.background);
        if (res.code == 200) {
          that.resData = res.data;
          console.log(that.resData);
          that.list_none = false;
          that.isfollow = res.data.user_info.is_follow;
          that.userid = res.data.user_info.uid;
          that.op_uid = navi.uid;
          that.bgImg = res.data.user_info.avatar;
          that.nameVideo = res.data.user_info.nickname;
          that.videocon = res.data.user_info.sign;

          class_name = res.data.user_info.nickname;
          class_name_img = res.data.user_info.avatar;
        } else {
          wx.showToast({
            title: res.message,
            icon: "loading"
          });
        }
      },
      "GET",
      that.globalData.token
    );
    // 新
    that.firstload(that, sort);
    // 栏目简介
    reqfn(
      "v1/lanmus/" + navi.uid,
      {},
      function(res) {
        if (res.code == 200) {
          hb_con = res.data.info;
          var tell_imgCount = 10;
          var tell_article = hb_con;
          console.log("?????");
          console.log(res.data.info);
          that.tell_article = hb_con;
          // WxParse.wxParse("tell_article", "html", tell_article, that, 0);
        } else {
          that.have = true;
        }
      },
      "GET",
      that.globalData.token
    );
    // 新
    reqfn(
      "v1/users/teacher-price/" + navi.uid,
      {},
      function(res) {
        var data = res.data;
        if (data) {
          if (data.year !== "0.00") {
            that.allbottom = true;
            that.class_all = data.year + "/年";
            that.class_p = data.year;
          } else if (data.halt_year !== "0.00") {
            that.allbottom = true;
            that.class_all = data.halt_year + "/半年";
            that.class_p = data.year;
          } else if (data.month !== "0.00") {
            that.allbottom = true;
            that.class_all = data.month + "/月";
            that.class_p = data.year;
          }
        }
      },
      "GET",
      that.globalData.token
    );
    // 评论
    reqfn(
      "v1/comment-teachers/assessed/" + navi.uid + "?page=1",
      {},
      function(res) {
        if (res.code == 200) {
          that.comment = res.data;
          that.comments = res.data.comments;
          if (res.data.is_buy == 1) {
            if (res.data.status == 0) {
              var tips_txt =
                "去点评，赢" +
                res.data.gold +
                "金币！(当前汇率" +
                res.data.rmb_to_gold +
                "金币=1元）";
              (that.tips_txt = tips_txt), (that.pop1 = "popnav");
            } else {
              that.tips_txt = "亲，您已评价过！";
              that.pop1 = "popalready";
              // app.func.req(
              //   "v1/ucentor/comment-teachers/already-ass/" + navi.uid,
              //   {},
              //   function(res) {
              //     if (res.data) {
              //       that.setData({
              //         evaluateCon: res.data
              //       });
              //     }
              //   },
              //   "GET",
              //   app.globalData.token
              // );
              reqfn(
                "v1/ucentor/comment-teachers/already-ass/" + navi.uid,
                {},
                function(res) {
                  if (res.data) {
                    that.evaluateCon = res.data;
                  }
                },
                "GET",
                that.globalData.token
              );
            }
          }
          if (res.data.pageCount > pagenum) {
            canscroll = true;
          }
        } else {
          that.have = true;
        }
      },
      "GET",
      that.globalData.token
    );
  },
  onPageScroll(e) {
    var that = this;
    if (e.scrollTop > 330) {
      that.ding = true;
    } else if (e.scrollTop < 330) {
      that.ding = false;
    }
  },
  // 上拉加载
  onReachBottom() {
    var that = this;
    if (talk_list) {
      if (canscroll) {
        canscroll = false;
        that.hidden = false;
        pagenum++;
        reqfn(
          "v1/comment-teachers/assessed/" + all_uid + "?page=" + pagenum,
          {},
          function(res) {
            if (res.code == 200) {
              that.comments = that.data.comments.concat(res.data.comments);
              that.hidden = true;
              if (res.data.pageCount > pagenum) {
                canscroll = true;
              }
            }
          },
          "GET",
          that.globalData.token
        );
      } else {
        that.list_none = true;
        // that.list_none = true;
      }
    }
  },
  onShareAppMessage(res) {
    if (res.from === "button") {
      // 来自页面内转发按钮
    } else {
      var nowid = "";
      if (that.globalData.token) {
        nowid = that.globalData.fid;
      }
      return {
        title: "干货短视频：" + class_name + "，跟TA学两招",
        path:
          "/pages/detail/teacher/teacher?uid=" +
          all_uid +
          "&shop_id=" +
          shop_id +
          "&share_uid=" +
          nowid,
        success: function(res) {
          // 转发成功
        },
        fail: function(res) {
          // 转发失败
        }
      };
    }
  }
};
</script>

