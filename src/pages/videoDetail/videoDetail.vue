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
        bindpause="bindpause"
        :src="video_src"
        controls="true"
        :initial-time="playstartTime"
        bindended="playend"
        bindtimeupdate="playtime"
        bindplay="videoplay"
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
          <test>{{pAudiotime}}</test>/
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
    <scroll-view scroll-y class="scrv" bindscroll="scrollWhere">
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
          <div class="study_text_title">谁在学
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
<style>
</style>
<script>
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

  },
  onLoad: function (options) {
        // op_userid=options.userid
        // console.log(options)
        can_audio = false;
        share_id = options.id;
        // share_id=options.id;
        shop_id = options.shop_id;
        startvideo = false;
        if (app.globalData.shop_name) {
            wx.setNavigationBarTitle({
                title: app.globalData.shop_name
            })
        }
        var that = this;
        if (shop_id) {
            console.log(shop_id)
            // shop_id=options.shopid;
            if (shop_id == 1810) {
                that.setData({
                    mins: false,
                    shop_id: shop_id
                })
            } else {
                that.setData({
                    mins: true,
                    shop_id: shop_id
                })
            }
            // app.func.req('v1/shops/' + shop_id, {},
            //     function (res) {
            //         wx.setNavigationBarTitle({
            //             title: res.data.shop_name
            //         })
            //     }, "GET", app.globalData.token);
            reqfn("v1/shops/" + shop_id, {},
        function(res) {
          wx.setNavigationBarTitle({
                        title: res.data.shop_name
            })
        },
        "GET",
        that.globalData.token
      );
        } else {
            shop_id = 0;
            that.setData({
                mins: true
            })
            wx.setNavigationBarTitle({
                title: '学两招'
            })
        }
        wx.getSystemInfo({
            success: function (res) {
                if (res.platform == 'ios') {
                    that.setData({
                        environment: false
                    })
                } else if (res.platform == 'android') {
                    that.setData({
                        environment: true
                    })
                } else {
                    that.setData({
                        environment: true
                    })
                }
                that.setData({
                    scrollHeight: res.windowHeight
                });
            }
        });
        is_audio = 0;
        if (options.is_audio) {
            is_audio = options.is_audio;
            console.log(options.is_audio)
            that.setData({
                play_way: false
            })
            // audioContext.play();
        }
        if (options.share_uid && options.share_uid != app.globalData.fid) {
            share_uid = options.share_uid;
        }
        that.setData({
            share_uid: share_uid
        })
        console.log(share_uid);
        var pheight = wx.getSystemInfoSync().windowHeight - 210;
        // console.log(pheight)
        wx.showToast({
            title: "加载中",
            icon: 'loading'
        });
        that.setData({
            options: options,
            op_userid: options.userid,
            shop_id: shop_id,
            pheight: pheight,
            activitydata: {
                "name": "视频详情页" + options.id
            }
        });
        //getData(that);
        app.func.req('v2/videos/more' + options.uid, {},
            function (res) {
                var moreList = res.data.item;
                that.setData({
                    moreList: moreList,
                });
            });
        // wx.setNavigationBarTitle({
        //     title: that.data.activitydata.name
        // })
        if (app.globalData.token) {
            console.log("已登录")
            app.func.req('v1/ucentor/histories', {
                    video_id: share_id
                },
                function (res) {
                    console.log("历史记录了");
                }, "POST", app.globalData.token);
        }
        // var that=this;
        // 更新进度条
        backgroundAudioManager.onTimeUpdate(function () {
            // console.log(backgroundAudioManager.currentTime);
            // backgroundAudioManager.currentTime
            audiotime = backgroundAudioManager.currentTime.toFixed(0);
            var pAudiotime = secondTransferTime(audiotime);
            that.setData({
                pAudiotime: pAudiotime,
                all_audiotime: all_audiotime,
                audiovalue: audiotime
            })
        })
        // 音频暂停
        backgroundAudioManager.onPause(function () {
            console.log("暂停了呢");
            audiotime = backgroundAudioManager.currentTime.toFixed(0);
            var pAudiotime = secondTransferTime(audiotime);
            that.setData({
                v_play: true,
            })
        })
        // 音频开始播放
        backgroundAudioManager.onPlay(function () {
            console.log("开始了");
            videoContext.pause();
            that.setData({
                v_play: false,
                hidden: true
            })
        })
    },
};
</script>
