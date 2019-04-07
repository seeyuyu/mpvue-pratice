<template>
  <div class="containerpage">
    <!--视频-->
    <div class="video_box" v-show="play_way">
      <video
        class="video_play"
        id="video_play"
        :poster="video_poster"
        show-center-play-btn="false"
        autoplay="true"
        @pause="bindpause"
        :src="video_src"
        controls="true"
        :initial-time="playstartTime"
        @ended="playend"
        @timeupdate="playtime"
        @play="videoplay"
        v-show="playvideo"
      ></video>
      <div class="video_overview" v-show="!playvideo">
        <img class="video_overview_img" src="../../../static/images/detail_bg.png">
        <div>该视频为付费视频，试看已结束</div>
        <div class="y_txt">购买后可观看完整视频</div>
      </div>
    </div>
    <img :src="video_poster" class="video_box" v-show="!play_way">
    <!--音频-->
    <div class="audio_bg" v-show="!play_way">
      <img mode="widthFix" src="../../../static/images/audio_bg.png">
      <div class="audio_con_bg">
        <div class="audio_control_div">
          <div class="audio_perv fl" @click="audio_before">
            <!-- src="../../../images/video_perv.png" -->
            <img mode="widthFix">
          </div>
          <div class="audio_control fl">
            <!-- src="../../../images/video_puse.png" -->
            <img mode="widthFix" @click="pauseAudio" v-show="!v_play">
            <!-- src="../../../images/video_play.png" -->
            <img mode="widthFix" @click="playAudio" v-show="v_play">
          </div>
          <div class="audio_next fr" @click="audio_next">
            <!-- src="../../../images/video_next.png" -->
            <img mode="widthFix">
          </div>
        </div>
      </div>
      <!--进度条-->
      <div class="sider_div">
        <div class="fl slider_time">
          <test>{{pAudiotime}}</test>
          <test>{{all_time}}</test>
        </div>
        <slider
          class="slider_slider"
          bindchange="hanleSliderChange"
          bindtouchend="handleSliderMoveEnd"
          min="0"
          :value="audiovalue"
          :max="all_audiotime"
          activeColor="#FCE76C"
          isCustom="true"
          block-size="12"
        ></slider>
      </div>
      <audio
        id="audioitem"
        :startTime="sv"
        :src="audio_src"
        :action="audioAction"
        bindended="audioPlayended"
        bindplay="audioPlayed"
        bindtimeupdate="audioTimeUpdated"
        controls
      ></audio>
    </div>
    <div class="speak_div speak_div_f" v-show="speak_div_top">
      <div class="speak_left" @click="ispeak">
        <div class="speak_div_icon"></div>说点什么吧！
      </div>
      <div class="speak_right">
        <div class="audio_icon fr" @click="listen_audio" v-if="mins" v-show="play_way"></div>
        <div class="video_icon fr" @click="listen_video" v-show="!play_way"></div>
        <div
          id="collect"
          class="fr collect speak_right_icon iscollect"
          v-show="playDetails_co"
          :data-id="playDetails.video_info.id"
        ></div>
        <div
          id="collect"
          class="fr collect speak_right_icon"
          v-show="!playDetails_co"
          :data-id="playDetails.video_info.id"
          @click="collects"
        ></div>
      </div>
    </div>
    <!-- style="height: {{pheight}}px;" -->
    <scroll-view style="height:300px;" scroll-y class="scrv" @bindscroll="scrollWhere">
      <div class="video_playFiles video_fff">
        <div class="video_detail">
          <!--视频信息-->
          <div class="video_bottom">
            <div id="video_in_h">
              <div class="detail_title">{{playDetails.video_info.name}}</div>
              <div class="detail_tips">
                <text class="tips1"># {{playDetails.video_info.channel_second_name}}</text>|
                <text class="tips2">{{playDetails.video_info.play_num}} 次观看</text>
              </div>
              <!--内容简介-->
              <!-- style='height:{{v_height}}rpx' -->
              <div
                class="content_intr txt_con"
                id="giveheight"
                v-if="playDetails.video_info.content"
              >
                {{playDetails.video_info.content}}
                <div class="zhan_txt" v-show="!noneShou">
                  <div @click="zhan" v-show="!zhan_show">展开</div>
                  <div @click="shou" v-show="zhan_show">收起</div>
                </div>
              </div>
            </div>
            <div class="speak_div_hei">
              <div class="speak_div" v-show="!speak_div_top">
                <div class="speak_left" @click="ispeak">
                  <div class="speak_div_icon"></div>说点什么吧！
                </div>
                <div class="speak_right">
                  <div class="audio_icon fr" @click="listen_audio" v-if="mins" v-show="play_way"></div>
                  <div class="video_icon fr" @click="listen_video" v-show="!play_way"></div>
                  <div
                    id="collect"
                    class="fr collect speak_right_icon iscollect"
                    v-show="playDetails_co"
                    :data-id="playDetails.video_info.id"
                  ></div>
                  <div
                    id="collect"
                    class="fr collect speak_right_icon"
                    v-show="!playDetails_co"
                    :data-id="playDetails.video_info.id"
                    @click="collects"
                  ></div>
                </div>
              </div>
            </div>
          </div>
          <!--选集信息-->
          <div class="video_fff" v-if="playDetails.video_info">
            <div class="choose_title" v-if="playDetails.video_info">
              <div class="fl choose_title_name">选集</div>
              <div class="fr">更新至{{playDetails.video_info.count}}集</div>
            </div>
            <!--新版-->
            <scroll-view class="choose_video choose_video_s" scroll-x="true">
              <div v-for="item in choosevideo">
                <div class="scroll_div_new scroll_div" :class="item.playing==1?'now_play':''">
                  <div class="op">
                    <a
                      open-type="redirect"
                      class="scroll_div_a"
                      :href="'../videoDetail/videoDetail?id='+item.id+'&uid='+item.id+'&userid='+item.user_id+'&shop_id='+shop_id+'&share_uid='+share_uid"
                    >
                      <div class="choose_video_title">{{item.name}}</div>
                    </a>
                    <div class="now_play_icon">{{mins?'正在播':'正在看'}}</div>
                  </div>
                </div>
              </div>
            </scroll-view>
            <div></div>
          </div>
          <!--老师信息-->
          <div class="teacher_card">
            <div class="userinfo">
              <div class="headpic_new">
                <a
                  :href="'../../detail/teacher/teacher?uid='+playDetails.user.uid+'&shop_id='+shop_id+'&share_uid='+share_uid"
                >
                  <img :src="playDetails.user.avatar">
                </a>
              </div>
              <div class="teacherinfo_new">
                <div class="userdeatils_name">{{playDetails.user.nickname}}</div>
                <div class="teacherinfo_tip">{{playDetails.user.rank}}</div>
                <div class="teacherinfo_tip">{{playDetails.user.sign}}</div>
              </div>
              <div class="followicon" id="focus" @click="follows">
                <img v-if="followBg" src="../../../static/images/teacher_nofollow.png">
                <img v-else src="../../../static/images/teacher_follow.png">
              </div>
            </div>
          </div>
        </div>
        <div class="video_fff video_bottom who_study" v-if="playDetails.video_info">
          <div class="study_text_title">
            谁在学
            <text class="study_title_num">· {{playDetails.video_info.learn_count}}人</text>
          </div>
          <div class="watched">
            <div class="headpic_wrapper" id="headpic_wrapper">
              <scroll-view scroll-x="true" scroll-left>
                <div class="see_student" v-for="learnItem in playDetails.learn" :key="index">
                  <div class="see_student_div">
                    <img :src="learnItem.avatar">
                  </div>
                </div>
                <div class="see_student see_students" v-if="playDetails.video_info.learn_count>30">
                  <img src="../../../static/images/who_see.png">
                </div>
              </scroll-view>
            </div>
          </div>
        </div>
        <div class="comm_section video_fff">
          <div class="comment" id="comment">
            <span>评论</span>
          </div>
          <div v-if="playDetails.comment.length>0">
            <div v-for="commentItem in playDetails.comment" :key="index">
              <div class="comment-title">
                <div class="comm-headpic">
                  <img :src="commentItem.avatar">
                </div>
                <text class="comm-username">{{commentItem.nickname}}</text>
                <text class="comm-time">{{commentItem.add_time}}</text>
              </div>
              <div class="comm-main">{{commentItem.content}}</div>
            </div>
          </div>
          <div wx:else>
            <div class="comm_txt">留下你伟大的评论吧</div>
            <img src="http://test.xlzhao.com/images/bird.png" mode="widthFix" class="comm_bird">
          </div>
        </div>
      </div>
      <div class="over_bg" v-if="overshow">
        <div class="over_tips" v-if="overshow">
          <img
            src="../../../static/images/guanbi1.png"
            mode="aspectFill"
            @click="close_overtip"
            class="close_tan"
          >
          <img src="http://test.xlzhao.com/images/tang.png" mode="aspectFill" class="tan_txt">
        </div>
      </div>
    </scroll-view>
    <div class="comm_footer comm_fixed" id="comment_box" v-if="!no_talk">
      <div class="quit_speak" @click="quit_talkdiv">取消</div>
      <input
        type="text"
        @click="bindButtonTap"
        bindinput="eInput"
        class="textarea"
        id="content"
        :value="textarea"
        :focus="speak_focus"
        placeholder="留下你伟大的言论~"
        cursor-spacing="5px"
        name="textarea"
      >
      <div
        class="smile comm_send"
        id="smile"
        hover-class="none"
        :data-id="playDetails.video_info.id"
        @click="bindFormSubmits"
      >发送</div>
    </div>
    <div v-if="no_talk">
      <!--评论框是否打开-->
      <div v-if="try_video && environment">
        <!--试看或免费-->
        <div
          class="new_bottom"
          v-if="playDetails.video_info.payment>0 && playDetails.user.is_allow ==0 "
        >
          <div class="new_bottom_left fl">
            <div class="yellow_txt">￥{{playDetails.video_info.payment}}</div>
          </div>
          <a
            class="new_bottom_btn fr"
            :href="'../confirm/confirm?id='+playDetails.video_info.id+'&priceVideo='+playDetails.video_info.payment+'&nameVideo='+playDetails.video_info.name+'&bgImg='+bgImg+'&shop_id='+shop_id+'&share_uid='+share_uid"
          >购买本集视频</a>
        </div>
      </div>
    </div>
    <div class="last_audio" v-show="!last_audio">已播放至最后一集</div>
    <div class="last_audio last_audio_b" v-show="!can_audio_tip">购买该视频后，即可听音频</div>
    <!--加载-->
    <loading v-show="!hidden">加载中...</loading>
  </div>
</template>
<style src="../../../static/main.css"></style>
<style src="../../../static/css/videodetail.css"></style>
<script>
import { reqfn } from "../../utils/request.js";
var vuid = "";
var next_video = "";
var before_video = "";
var op_userid = "";
var share_id = "";
var share_uid = "";
// var share_id='';
var video_name = "";
var shop_id = "";
var imageUrl = "";
var et = "";
var free_time = "";
var try_video = true;
var can_audio = false;
var dong = 87;
var now_play = 0;
var audiotime = 0;
var dong_y = "";
var startvideo = false;
var videoContext = {};
const backgroundAudioManager = wx.getBackgroundAudioManager();
var all_audiotime = "";
var is_audio = 0;
var minss = false;
var audiobg = "";
var audios = false;
// 音频播放结束--下一音频
backgroundAudioManager.onEnded(function() {
  console.log("音频自然结束");
  var that = this;
  // 有下一条音频
  if (next_video != 0) {
    // 可以播放
    if (can_audio) {
      wx.redirectTo({
        url:
          "../videoDetail/videoDetail?id=" +
          next_video +
          "&uid=" +
          next_video +
          "&userid=" +
          op_userid +
          "&is_audio=1&shop_id=" +
          shop_id
      });
    } else {
      wx.redirectTo({
        url:
          "../videoDetail/videoDetail?id=" +
          next_video +
          "&uid=" +
          next_video +
          "&userid=" +
          op_userid +
          "&shop_id=" +
          shop_id
      });
    }
  }
});
export default {
  data() {
    return {
      token: "",
      options: {},
      activitydata: {},
      playDetails: {},
      moreList: {},
      choosevideo: {},
      video_src: "",
      bgImg: "",
      op_userid: "",
      bad_src: "../../images/bad-hui@3x.png",
      good_src: "../../images/good-hui@3x.png",
      followText: "关注",
      followBg: true,
      hidden: false,
      popcom: false,
      overshow: false,
      no_talk: true,
      speak_focus: false,
      talk_div: true,
      try_video: true,
      playvideo: true,
      zhan_show: false,
      tip_hidden: true,
      noneShou: true,
      play_way: true,
      last_audio: true,
      none_check: true,
      textarea: "",
      pheight: "",
      speak_div_top: false,
      can_audio_tip: true,
      playDetails_co: 0,
      v_height: "",
      v_play: true,
      minss: false,
      mins: false,
      vauto: true,
      environment: false,
      audio_src: "",
      sequence_no: 1,
      playstartTime: 0,
      sv: 0,
      all_audiotime: 0,
      audiovalue: 0,
      pAudiotime: "00:00",
      all_time: "00:00",
      audioAction: {
        method: "pause"
      }
    };
  },
  methods: {
    getData: function(that) {
      reqfn(
        "v3/videos/detail/" + that.options.id,
        {},
        function(res) {
          op_userid = res.data.user.uid;
          free_time = res.data.video_info.free_time;
          reqfn(
            "v3/videos/more/" + op_userid + "/" + that.options.uid,
            {},
            function(res) {
              that.choosevideo = res.data;
              that.hidden = true;
              that.op_userid = op_userid
            },
            "GET",
            that.globalData.token
          );
          audiobg = res.data.video_info.audio_url;
          if (audios) {
            videoContext.pause();
            // backgroundAudioManager.src=audiobg;
          }
          backgroundAudioManager.coverImgUrl = res.data.video_info.cover;
          backgroundAudioManager.title = res.data.video_info.name;
          var playDetails = res.data;
          vuid = playDetails.user.uid;
          next_video = playDetails.video_info.next;
          before_video = playDetails.video_info.before;
          video_name = res.data.video_info.name;
          imageUrl = res.data.video_info.cover;
          // all_audiotime=res.data.video_info.duration;
          // var all_time=secondTransferTime(all_audiotime);
          var all_time = res.data.video_info.duration;
          var min = all_time.split(":")[0];
          var sec = all_time.split(":")[1];
          all_audiotime = Number(min * 60) + Number(sec);
          for (var i = 0; i < playDetails.comment.length; i++) {
            var timestr = playDetails.comment[i].add_time;
            playDetails.comment[i].add_time = timestr.substring(0, 8);
            // console.log(timestr);
          }
            that.playDetails = playDetails
            that.playDetails_co = playDetails.user.is_collect
            that.bgImg = escape(playDetails.video_info.cover)
            that.video_poster = playDetails.video_info.cover
            that.video_src = playDetails.video_info.file_url
            that.audio_src = res.data.video_info.audio_url
            that.all_audiotime = all_audiotime
            that.all_time = all_tim
          if (playDetails.video_info.payment > 0) {
            // 收费
            if (playDetails.user.is_allow == 1) {
              // 已购买或已兑换
              try_video = false;
              can_audio = true;
              that.try_video = false
            } else if (playDetails.video_info.free_time < 1) {
              // 没有试看时长
              try_video = false;
              that.video_src = ""
            } else {
              try_video = true;
            }
          } else {
            //免费
            try_video = false;
            can_audio = true;
          }
          if (!can_audio) {
            // audioContext.pause();
            that.play_way = true
            videoContext.play();
          } else {
            if (is_audio > 0) {
              backgroundAudioManager.src = audiobg;
              that.vauto = false
              videoContext.pause();
            }
          }
          // if (playDetails.user.is_collect) {
          //     that.setData({
          //         collect_src: '../../images/shoucang_red@3x.png'
          //     });
          // }
          var is_follow = playDetails.user.is_follow;
          if (is_follow) {
            that.followText = "已关注"
            that.followBg = false
          }
          that.token = that.globalData.token
          // 展开和收起
          //创建节点选择器
          dong = 87;
          if (playDetails.video_info.content) {
            var query = wx.createSelectorQuery();
            console.log(query);
            //选择id
            query.select("#giveheight").boundingClientRect();
            console.log(query);
            query.exec(function(res) {
              //res就是 所有标签为mjltest的元素的信息 的数组
              //取高度
              // console.log(res[0].height);
              dong_y = res[0].height;
              if (res[0].height > 24) {
                that.v_height = 48
                that.noneShou = false
              } else {
                that.noneShou = true
              }
            });
            dong = 84 + 42;
          }
        },
        "GET",
        that.globalData.token
      );
    },
    // 播放结束
    playend: function() {
      var that = this;
      if (next_video != 0) {
        wx.navigateTo({
          url:
            "../videoDetail/videoDetail?id=" +
            next_video +
            "&uid=" +
            next_video +
            "&userid=" +
            op_userid +
            "&shop_id=" +
            shop_id
        });
      }
    },
    playtime: function(e) {
      var that = this;
      if (try_video) {
        console.log("--------------------------------------")
        console.log(e)
        console.log(e.timeStamp);
        console.log(free_time)
        if (e.detail.currentTime > free_time) {
          // var videoContext = wx.createVideoContext('video_play');
          // console.log(videoContext)
          videoContext.pause();
          that.playvideo = false
        }
      } else {
        now_play = e.detail.currentTime;
      }
    },
    bindpause: function() {
      console.log(now_play);
      this.sv = now_play
    },
    // 视频开始播放
    videoplay: function() {
      startvideo = true;
      console.log("开始播放视频");
      backgroundAudioManager.stop();
    },
    bindpause: function() {
      console.log(now_play);
      this.sv = now_play
    },
    scrollWhere: function (e) {
        var that = this;
        // console.log(e.detail.scrollTop)
        // console.log("高度："+dong)
        if (e.detail.scrollTop > dong) {
            that.speak_div_top = true
        } else {
            that.speak_div_top = false
        }
  },
    //   点赞和倒赞
    loves: function (e) {
        var that = this;
        var type = e.target.dataset.type;
        app.func.req('v1/ucentor/loves', {
                video_id: e.target.dataset.id,
                type: type
            },
            function (res) {
                //console.log(res);//401未登录
                if (res.code == 200) {
                    var obj = that.data.playDetails;
                    that.playDetails = obj
                } else if (res.code == 401) {
                    wx.navigateTo({
                        url: '../../tabBar/login/login'
                    });
                } else if (res.code !== 200) {
                    wx.showModal({
                        title: '提示',
                        content: res.message,
                        showCancel: false,
                        confirmText: '好'
                    });
                }
            }, "POST", app.globalData.token);
    },
    //    收藏
    collects: function (e) {
        var that = this;
        app.func.req('v1/ucentor/collects', {
                video_id: e.target.dataset.id
            },
            function (res) {
                console.log(res); //401未登录
                if (res.code == 200) {
                    that.playDetails_co = 1
                    wx.showToast({
                        title: '已收藏',
                        icon: 'success',
                        duration: 1500
                    })
                } else if (res.code == 401) {
                    wx.navigateTo({
                        url: '../../tabBar/login/login'
                    });
                } else if (res.code !== 200) {
                    wx.showModal({
                        title: '提示',
                        content: res.message,
                        showCancel: false,
                        confirmText: '好'
                    });
                }
            }, "POST", app.globalData.token); //delete
    },
    //    关注
    follows: function (e) {
        var that = this;
        var is_follow = that.data.playDetails.user.is_follow;
        if (is_follow) {
            var type = "DELETE";
            that.followText = "已关注"
            that.followBg = false
        } else {
            type = "POST";
        }
        app.func.req('v1/ucentor/follows', {
                fid: that.data.playDetails.user.uid
            },
            function (res) {
                console.log(res); //401未登录
                if (res.code == 200) {
                    that.followText = "已关注"
                    that.followBg = false
                    wx.showToast({
                        title: '已关注',
                        icon: 'success',
                        duration: 1500
                    })
                } else if (res.code == 401) {
                    wx.navigateTo({
                        url: '../../tabBar/login/login'
                    });
                }
            }, type, app.globalData.token); //delete
    },
    // 打开评论框
    ispeak: function () {
        var that = this;
        console.log("点到了啊")
        if (!that.data.token) {
            wx.navigateTo({
                url: '../../tabBar/login/login'
            });
        } else {
          that.no_talk = false
          that.talk_div = true
          that.speak_focus = true
        }

    },
    quit_talkdiv: function () {
        var that = this;
        that.no_talk = true
        that.talk_div = false
    },
    //    评论
    //     bindFormSubmit: function (e) {
    //         var that = this;
    //         console.log(e.detail.value.textarea);
    //         app.func.req('v1/ucentor/comments', {
    //                 video_id: that.data.options.id,
    //                 content: e.detail.value.textarea,
    //                 client_type: 3
    //             },
    //             function (res) {
    //                 console.log(res);//401未登录
    //                 if (res.code == 401) {
    //                     wx.navigateTo({
    //                         url: '../../tabBar/login/login'
    //                     });
    //                 } else if (res.code == 200) {
    //                     that.setData({
    //                         textarea: ""
    //                     });
    //                     getData(that);
    //                 }
    // //                var moreList = res.data.item;
    //                 that.setData({
    // //                    moreList:moreList
    //                 });
    //             }, "POST", app.globalData.token);//delete
    //     },
    zhan: function () {
        this.setData({
            v_height: 'auto',
            zhan_show: true
        })
        dong = 84 + dong_y;
    },
    shou: function () {
        this.setData({
            v_height: 48,
            zhan_show: false
        })
        dong = 42 + 84;
    },
    eInput: function (e) {
        et = e.detail.value;
    },
    bindFormSubmits: function (e) {
        var that = this;
        app.func.req('v1/ucentor/comments', {
                video_id: that.data.options.id,
                content: et,
                client_type: 3
            },
            function (res) {
                console.log(res); //401未登录
                if (res.code == 401) {
                    wx.navigateTo({
                        url: '../../tabBar/login/login'
                    });
                } else if (res.code == 200) {
                    that.textarea = ""
                    getData(that);
                }
            }, "POST", app.globalData.token); //delete
    },
    popcomment: function () {
        var that = this;
        if (that.data.token) {
            that.popcom = true
        } else {
            wx.navigateTo({
                url: '../../tabBar/login/login'
            });
        }
    },
    close_overtip: function () {
        var that = this;
        that.overshow = false
    },
    open_overtip: function () {
        var that = this;
        console.log(that.data.token);
        if (!that.data.token) {
            console.log("未登录");
            // loginBuy(that,e);
        } else if (that.data.flag) {
            console.log("已登陆");
        }
        // that.setData({
        //     overshow:true
        // });
    },
    //退出登录
    loginOut: function () {
        var that = this;
        app.func.req('v1/ucentor/users/logout', {},
            function (res) {
                console.log(res); //401未登录
                if (res.code !== 200) {
                    wx.navigateTo({
                        url: '../../tabBar/login/login?'
                    });
                } else {
                    app.globalData.token = "";
                }
            }, "POST", app.globalData.token);
    },
    // 音频start
    // 切换到视频
    listen_video: function () {
        var that = this;
        // console.log(backgroundAudioManager.duration)
        // console.log(backgroundAudioManager.currentTime)
        // console.log(audiotime);
        audiotime = backgroundAudioManager.currentTime;
        videoContext.seek(audiotime);
        backgroundAudioManager.stop();
        // audioContext.pause();
        videoContext.play()
        that.play_way = true
    },
    // 切换到音频
    listen_audio: function () {
      console.log("11111111111111111111111111111111111111111111111111111111")
        var that = this;
        if (startvideo) {
            if (can_audio) {
                videoContext.pause();
                backgroundAudioManager.src = audiobg;
                backgroundAudioManager.coverImgUrl = imageUrl;
                backgroundAudioManager.title = video_name;
                setTimeout(function () {
                    backgroundAudioManager.seek(now_play);
                }, 300)

                // backgroundAudioManager.play();
                // var all_time=secondTransferTime(all_audiotime)
                that.play_way = false
                that.hidden = false
                backgroundAudioManager.onCanplay(() => {
                    console.log("开始了");
                    that.hidden = true
                });
                backgroundAudioManager.onWaiting(() => {
                    that.hidden = false
                });

            } else {
                that.can_audio_tip = false
                setTimeout(function () {
                    that.can_audio_tip = true
                }, 1500)
            }
        } else {
            that.none_check = false
            setTimeout(function () {
                that.none_check = true
            }, 1500)
        }
    },
    // 播放音频
    playAudio: function () {
        backgroundAudioManager.play();
        this.setData({
            v_play: false
        });
    },
    // 暂停音频
    pauseAudio: function () {
        backgroundAudioManager.pause();
        this.setData({
            v_play: true
        });
    },
    // 下一个音频
    audio_next: function () {
        var that = this;
        if (next_video != 0) {
            if (can_audio) {
                // console.log('../videoDetail/videoDetail?id=' + next_video + '&uid=' + next_video + '&userid=' + op_userid + '&is_audio=1&shop_id=' + shop_id + '&share_uid=' + share_uid)
                wx.redirectTo({
                    url: '../videoDetail/videoDetail?id=' + next_video + '&uid=' + next_video + '&userid=' + op_userid + '&is_audio=1&shop_id=' + shop_id + '&share_uid=' + share_uid
                })
            } else {
                wx.redirectTo({
                    url: '../videoDetail/videoDetail?id=' + next_video + '&uid=' + next_video + '&userid=' + op_userid + '&shop_id=' + shop_id + '&share_uid=' + share_uid
                })
            }
        } else {
            // 没有下一条音频
            that.last_audio = false
            setTimeout(function () {
                that.last_audio = true
            }, 1500)
        }
    },
    // 上一个视频
    audio_before: function () {
        var that = this;
        if (before_video != 0) {
            if (can_audio) {
                wx.redirectTo({
                    url: '../videoDetail/videoDetail?id=' + before_video + '&uid=' + before_video + '&userid=' + op_userid + '&is_audio=1&shop_id=' + shop_id + '&share_uid=' + share_uid
                })
            } else {
                wx.redirectTo({
                    url: '../videoDetail/videoDetail?id=' + before_video + '&uid=' + before_video + '&userid=' + op_userid + '&shop_id=' + shop_id + '&share_uid=' + share_uid
                })
            }
            // wx.navigateTo({
            //     url: '../videoDetail/videoDetail?id='+before_video+'&uid='+before_video+'&userid='+op_userid+'&is_audio=1'
            // })
        }
    },
    // 音频播放结束
    audioPlayended: function () {
        var that = this;
        if (next_video != 0) {
            if (can_audio) {
                wx.redirectTo({
                    url: '../videoDetail/videoDetail?id=' + next_video + '&uid=' + next_video + '&userid=' + op_userid + '&is_audio=1&shop_id=' + shop_id + '&share_uid=' + share_uid
                })
            } else {
                wx.redirectTo({
                    url: '../videoDetail/videoDetail?id=' + next_video + '&uid=' + next_video + '&userid=' + op_userid + '&shop_id=' + shop_id + '&share_uid=' + share_uid
                })
            }
        } else {
            // 没有下一条音频
            that.last_audio = false
            setTimeout(function () {
                that.last_audio = true
            }, 1500)
        }
    },
    //音频end
    //slider拖动
    hanleSliderChange: function (e) {
        console.log(e.detail.value);
        backgroundAudioManager.seek(e.detail.value)
    },
    //slider拖动结束
    handleSliderMoveEnd: function (e) {
        console.log(e);
        // audioContext.seek()
    },
    // 点击slider时调用
    sliderTap: function (e) {
        console.log("sliderTap")
        //this.seek()
    }
  },
  onLoad: function(options) {
    // op_userid=options.userid
    console.log(options);
    can_audio = false;
    share_id = options.id;
    // share_id=options.id;
    shop_id = options.shop_id;
    startvideo = false;
    // if (app.globalData.shop_name) {
    //     wx.setNavigationBarTitle({
    //         title: app.globalData.shop_name
    //     })
    // }
    var that = this;
    // if (shop_id) {
    //   console.log(shop_id);
    //   // shop_id=options.shopid;
    //   if (shop_id == 1810) {
    //     that.mins = false;
    //     tha.shop_id = shop_id;
    //   } else {
    //     that.mins = true;
    //     that.shop_id = shop_id;
    //   }
    //   // app.func.req('v1/shops/' + shop_id, {},
    //   //     function (res) {
    //   //         wx.setNavigationBarTitle({
    //   //             title: res.data.shop_name
    //   //         })
    //   //     }, "GET", app.globalData.token);
    //   reqfn(
    //     "v1/shops/" + shop_id,
    //     {},
    //     function(res) {
    //       wx.setNavigationBarTitle({
    //         title: res.data.shop_name
    //       });
    //     },
    //     "GET",
    //     that.globalData.token
    //   );
    // } else {
    shop_id = 0;
    that.mins = true;
    wx.setNavigationBarTitle({
      title: "学两招"
    });
    // }
    wx.getSystemInfo({
      success: function(res) {
        if (res.platform == "ios") {
          that.environment = false;
        } else if (res.platform == "android") {
          that.environment = true;
        } else {
          that.environment = true;
        }
        console.log(res.windowHeight)
        that.scrollHeight = res.windowHeight
      }
    });
    is_audio = 0;
    if (options.is_audio) {
      is_audio = options.is_audio;
      console.log(options.is_audio);
      that.play_way = false;
      // audioContext.play();
    }
    if (options.share_uid && options.share_uid != that.globalData.fid) {
      share_uid = options.share_uid;
    }
    that.share_uid = share_uid;
    console.log(share_uid);
    var pheight = wx.getSystemInfoSync().windowHeight - 210;
    // console.log(pheight)
    wx.showToast({
      title: "加载中",
      icon: "loading"
    });
    that.options = options;
    that.op_userid = options.userid;
    that.shop_id = shop_id;
    that.pheight = pheight;
    // that.activitydata: {
    //     "name": "视频详情页" + options.id
    // }
    //getData(that);
    // app.func.req('v2/videos/more' + options.uid, {},
    //     function (res) {
    //         var moreList = res.data.item;
    //         that.moreList = moreList
    //     });
    reqfn(
      "v2/videos/more" + options.uid,
      {},
      function(res) {
        var moreList = res.data.item;
        that.moreList = moreList;
      },
      "GET",
      that.globalData.token
    );
    // wx.setNavigationBarTitle({
    //     title: that.data.activitydata.name
    // })
    if (that.globalData.token) {
      console.log("已登录");
      // app.func.req(
      //   "v1/ucentor/histories",
      //   {
      //     video_id: share_id
      //   },
      //   function(res) {
      //     console.log("历史记录了");
      //   },
      //   "POST",
      //   app.globalData.token
      // );
      reqfn(
        "v1/ucentor/histories",
        {
          video_id: share_id
        },
        function(res) {
          console.log("历史记录了");
        },
        "POST",
        that.globalData.token
      );
    }
    // var that=this;
    // 更新进度条
    backgroundAudioManager.onTimeUpdate(function() {
      // console.log(backgroundAudioManager.currentTime);
      // backgroundAudioManager.currentTime
      audiotime = backgroundAudioManager.currentTime.toFixed(0);
      var pAudiotime = secondTransferTime(audiotime);
      that.pAudiotime = pAudiotime;
      that.all_audiotime = all_audiotime;
      that.audiovalue = audiotime;
    });
    // 音频暂停
    backgroundAudioManager.onPause(function() {
      console.log("暂停了呢");
      audiotime = backgroundAudioManager.currentTime.toFixed(0);
      var pAudiotime = secondTransferTime(audiotime);
      that.v_play = true;
    });
    // 音频开始播放
    backgroundAudioManager.onPlay(function() {
      console.log("开始了");
      videoContext.pause();
      that.v_play = false;
      that.hidden = true;
    });
  },
  onReady: function() {
    // 页面渲染完成时
    console.log("页面加载完成");
    videoContext = wx.createVideoContext("video_play");
    wx.hideToast();
    // if(is_audio>0){
    //     audioContext.play();
    // }
  },
  onShow: function() {
    // 页面显示时
    var that = this;
    that.getData(that);
  },
  onHide: function() {
    // 页面隐藏时
    videoContext.pause();
    // innerAudioContext.pause();
    console.log("页面隐藏");
  },
  onUnload: function() {
    // 页面卸载时
    videoContext.pause();
  },


};
</script>
