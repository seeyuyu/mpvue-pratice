<template>
  <div class="containerpage">
    <!--视频-->
    <div class="video_box" hidden="{{!play_way}}">
        <video class="video_play" id="video_play" poster="{{video_poster}}" show-center-play-btn="false" autoplay="true" bindpause="bindpause" src="{{video_src}}"
                       controls="true" initial-time="{{playstartTime}}" bindended="playend" bindtimeupdate="playtime" bindplay="videoplay" hidden="{{!playvideo}}"></video>
        <div class="video_overview" hidden="{{playvideo}}">
            <img class="video_overview_img" src="../../../images/detail_bg.png">
            <div>该视频为付费视频，试看已结束</div>
            <div class="y_txt">购买后可观看完整视频</div>
        </div>
    </div>
    <img :src="video_poster" class="video_box" wx:else/>
    <!--音频-->
    <div class="audio_bg" hidden="{{play_way}}">
        <img src="../../../images/audio_bg.png" mode="widthFix">
        <div class="audio_con_bg">
            <div class="audio_control_div">
                <div class="audio_perv fl"  @click="audio_before">
                    <img src="../../../images/video_perv.png" mode="widthFix">
                </div>
                <div class="audio_control fl">
                    <img src="../../../images/video_puse.png" mode="widthFix" @click="pauseAudio" hidden="{{v_play}}">
                    <img src="../../../images/video_play.png" mode="widthFix" @click="playAudio" hidden="{{!v_play}}">
                </div>
                <div class="audio_next fr" @click="audio_next">
                    <img src="../../../images/video_next.png" mode="widthFix">
                </div>
            </div>
        </div>
        <!--进度条-->
        <div class="sider_div">
            <div class="fl slider_time"><test>{{pAudiotime}}</test>/<test>{{all_time}}</test></div>
            <slider class="slider_slider" bindchange="hanleSliderChange" bindtouchend="handleSliderMoveEnd" min="0" value='{{audiovalue}}' max="{{all_audiotime}}" activeColor="#FCE76C" isCustom="true" block-size='12'></slider>
        </div>
        <audio id="audioitem" startTime="{{sv}}" :src="audio_src" action="{{audioAction}}" bindended="audioPlayended" bindplay="audioPlayed" bindtimeupdate="audioTimeUpdated" controls></audio>
    </div>
    <div class="speak_div speak_div_f" hidden="{{!speak_div_top}}">
        <div class="speak_left" @click="ispeak">
            <div class="speak_div_icon"></div>
                说点什么吧！
        </div>
        <div class="speak_right">
            <div class="audio_icon fr" @click="listen_audio" wx:if="{{mins}}" hidden="{{!play_way}}"></div>
            <div class="video_icon fr" @click="listen_video" hidden="{{play_way}}"></div>
            <div id="collect" class="fr collect speak_right_icon iscollect" hidden="{{!playDetails_co}}" data-id="{{playDetails.video_info.id}}"></div>
            <div id="collect" class="fr collect speak_right_icon" hidden="{{playDetails_co}}" data-id="{{playDetails.video_info.id}}" @click = "collects"></div>
        </div>
    </div>
    <scroll-view scroll-y style="height: {{pheight}}px;" class="scrv" bindscroll="scrollWhere">
        <div class="video_playFiles video_fff">
            <div class="video_detail ">
                <!--视频信息-->
                <div class="video_bottom">
                    <div id="video_in_h">
                        <div class="detail_title ">{{playDetails.video_info.name}}</div>
                        <div class="detail_tips">
                            <text class="tips1">#  {{playDetails.video_info.channel_second_name}} </text>|
                            <text class="tips2">  {{playDetails.video_info.play_num}} 次观看</text>
                        </div>
                        <!--内容简介-->
                        <div class="content_intr txt_con" id="giveheight" style="height:{{v_height}}rpx" wx:if="{{playDetails.video_info.content}}">
                            {{playDetails.video_info.content}}
                            <div class="zhan_txt" hidden="{{noneShou}}">
                                <div @click="zhan" hidden="{{zhan_show}}">展开</div>
                                <div @click="shou" hidden="{{!zhan_show}}">收起</div>
                            </div>
                        </div>
                    </div>
                    <div class="speak_div_hei">
                        <div class="speak_div" hidden="{{speak_div_top}}">
                            <div class="speak_left" @click="ispeak">
                                <div class="speak_div_icon"></div>
                                说点什么吧！
                            </div>
                            <div class="speak_right">
                                <div class="audio_icon fr" @click="listen_audio" wx:if="{{mins}}" hidden="{{!play_way}}"></div>
                                <div class="video_icon fr" @click="listen_video" hidden="{{play_way}}"></div>
                                <div id="collect" class="fr collect speak_right_icon iscollect" hidden="{{!playDetails_co}}" data-id="{{playDetails.video_info.id}}"></div>
                                <div id="collect" class="fr collect speak_right_icon" hidden="{{playDetails_co}}" data-id="{{playDetails.video_info.id}}" @click = "collects"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <!--选集信息-->
                <div class="video_fff">
                    <div class="choose_title" wx:if="{{mins}}">
                        <div class="fl choose_title_name">选集</div>
                        <div class="fr">更新至{{playDetails.video_info.count}}集</div>
                    </div>
                    <!--新版-->
                    <scroll-view class="choose_video choose_video_s" scroll-x="true">
                        <block wx:for="{{choosevideo}}" wx:key="{{index}}">
                            <div class="scroll_div_new scroll_div {{item.playing==1?'now_play':''}}">
                            <div class="op">
                                <navigator open-type="redirect" class="scroll_div_a" url="../videoDetail/videoDetail?id={{item.id}}&uid={{item.id}}&userid={{item.user_id}}&shop_id={{shop_id}}&share_uid={{share_uid}}">
                                    <div class="choose_video_title">{{item.name}}</div>
                                </navigator>
                                <div class="now_play_icon">{{mins?'正在播':'正在看'}}</div>
                            </div>

                            </div>
                        </block>
                    </scroll-view>
                    <div></div>
                </div>
                <!--老师信息-->
                <div class="teacher_card">
                     <div class="userinfo">
                            <div class="headpic_new">
                                <navigator url="../../detail/teacher/teacher?uid={{playDetails.user.uid}}&shop_id={{shop_id}}&share_uid={{share_uid}}">
                                    <img src="{{playDetails.user.avatar}}">
                                </navigator>
                            </div>
                            <div class="teacherinfo_new">
                                <div class="userdeatils_name">{{playDetails.user.nickname}}</div>
                                <div class="teacherinfo_tip">{{playDetails.user.rank}}</div>
                                <div class="teacherinfo_tip">{{playDetails.user.sign}}</div>
                            </div>
                        <div class="followicon" id="focus"  @click = "follows">
                            <img wx:if="{{followBg}}" src="../../../images/teacher_nofollow.png">
                            <img wx:else src="../../../images/teacher_follow.png">
                        </div>
                    </div>
                </div>
            </div>
            <div class="video_fff video_bottom who_study">
                <div class="study_text_title">谁在学<text class="study_title_num"> · {{playDetails.video_info.learn_count}}人</text></div>
                <div class="watched">
                    <div class="headpic_wrapper" id="headpic_wrapper" >
                        <scroll-view scroll-x="true" scroll-left="" >
                            <div class="see_student" wx:for="{{playDetails.learn}}" wx:for-item="learnItem" wx:key="{{index}}">
                                <div class="see_student_div">
                                    <img :src="learnItem.avatar">
                                </div>
                            </div>
                            <div class="see_student see_students" wx:if="{{playDetails.video_info.learn_count>30}}">
                                <img src="../../../images/who_see.png">
                            </div>
                        </scroll-view>
                    </div>
                </div>
            </div>
            <div class="comm_section video_fff">
                <div class="comment" id="comment">
                    <span>评论</span>
                </div>
                <div wx:if="{{playDetails.comment.length>0}}">
                    <div wx:for="{{playDetails.comment}}" wx:key="{{index}}" wx:for-item="commentItem">
                        <div class="comment-title" >
                            <div class="comm-headpic">
                                <img src="{{commentItem.avatar}}">
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
        <div class="over_bg" wx:if="{{overshow}}">
            <div class="over_tips"  wx:if="{{overshow}}">
                <img src="../../../images/guanbi1.png" mode="aspectFill" @click="close_overtip" class="close_tan">
                <img src="http://test.xlzhao.com/images/tang.png" mode="aspectFill" class="tan_txt">
            </div>
        </div>
    </scroll-view>
            <div class="comm_footer comm_fixed" id="comment_box" wx:if="{{!no_talk}}">
                <div class="quit_speak" @click="quit_talkdiv">取消</div>
                <input type="text" @click="bindButtonTap" bindinput ="eInput" class="textarea" id="content" value="{{textarea}}" focus="{{speak_focus}}" placeholder="留下你伟大的言论~"  cursor-spacing="5px"  name="textarea"/>
                <div class="smile comm_send" id="smile" hover-class="none" data-id="{{playDetails.video_info.id}}" @click="bindFormSubmits">发送</div>
            </div>
            <div wx:if="{{no_talk}}"><!--评论框是否打开-->
                <div wx:if="{{try_video && environment}}"><!--试看或免费-->
                    <div class="new_bottom"  wx:if="{{playDetails.video_info.payment>0 && playDetails.user.is_allow ==0 }}">
                        <div class="new_bottom_left fl">
                            <div class="yellow_txt">￥{{playDetails.video_info.payment}}</div>
                        </div>
                        <navigator class="new_bottom_btn fr" url="../confirm/confirm?id={{playDetails.video_info.id}}&priceVideo={{playDetails.video_info.payment}}&nameVideo={{playDetails.video_info.name}}&bgImg={{bgImg}}&shop_id={{shop_id}}&share_uid={{share_uid}}">购买本集视频</navigator>
                    </div>
                </div>
            </div>
    <div class="last_audio" hidden="{{last_audio}}">已播放至最后一集</div>
    <div class="last_audio last_audio_b" hidden="{{can_audio_tip}}">购买该视频后，即可听音频</div>
    <!--加载-->
    <loading hidden="{{hidden}}">
        加载中...
    </loading>
</div>

</template>
<style>
</style>
<script>
export default {
  data() {
    return {}
  },
  methods: {}
}
</script>
