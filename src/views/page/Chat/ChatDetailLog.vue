<template>
  <div style="display: content">
    <!-- 헤더 -->
    <div class="pl-quick-layer-header">
      <div class="d-flex align-center">
        <v-icon :class="`pl-icon30 mainchat-${ CHAT_DATA.CHNL_CL }`"></v-icon>
        <div class="ml-3">
          <div>
            <strong style="font-size: 15px">{{CHAT_DATA.CUST_NM}} </strong>
            <span v-if="CHAT_DATA?.CHN_CLSF_CD == 'MO'">({{ CHAT_DATA.CHT_USER_KEY.split('_')[1] }})</span>
            님과의
            <strong>{{ mixin_displayStatus(CHAT_DATA.CHNL_CL, 'STAT_LIST_CH') }}</strong>
            <!-- 즐겨찾기 버튼 -->
            <div
              @click="bmkStrg"
              class="d-inline-block"
              style="position: relative; cursor: pointer;">
              <vLottiePlayer
                name="lottieFavorite"
                :autoplay=false
                width="60px"
                height="60px"
                style="position: absolute; top: -35px; left: -13px;"
                :animationData="require('@/assets/lottie/animation_favorite.json')"
                @animControl="anim => (lottieFavorite = anim)"
              />
            </div>
          </div>
          <div >
            <span
              style="width: 55px"
              :class="`pl-badge is-${ mixin_displayStatus(CHAT_DATA.CUTT_STTS_CD, 'STAT_LIST' ) }`">
              {{ CHAT_DATA.CUTT_STTS_CD_NM }}
            </span>
            <span class="ml-2">요청일시</span>
            <span class="ml-1">{{ CHAT_DATA.CUTT_BGNG_DT }}</span>
            <template v-if="CHAT_DATA.center">
              <span class="mx-1 is-txt-bull">&bull;</span>
              <span class="is-txt-sub">{{ CHAT_DATA.CHNL_NM }}</span>
            </template>
          </div>
        </div>
      </div>
      <div class="ml-auto pl-btn-wrap align-self-start">
        <!-- 시스템 메시지 전송 -->
        <v-tooltip content-class="pl-tooltip " bottom >
          <template v-slot:activator="{ on, attrs }">
            <div v-bind="attrs" v-on="on">
              <v-switch
                v-model="SYSTEM_MSG_STAT"
                @click="sysMsgOnOff()"
                :disabled="CHAT_STAT == 'ING' && CHAT_DATA?.CHN_CLSF_CD != 'MO' ? false : true"
              >
              </v-switch>
            </div>
          </template>
          <span>시스템메시지 발송 상태를 {{ SYSTEM_MSG_STAT ? 'OFF' : 'ON'}}으로 설정합니다</span>
        </v-tooltip>
        <!-- 엑셀다운로드 -->
        <compo-excel
          TypeProp="DownloadChat"
        ></compo-excel>
        <!-- 새로고침 -->
        <compo-tooltip-btn
          TitleProp="새로고침"
          ClassProp="pl-tooltip-btn"
          IconProp="pl-icon20 refresh"
          TooltipPositionProp="bottom"
          @btnClick="chatHstSrch"
        ></compo-tooltip-btn>

        <compo-tooltip-btn
          TitleProp="채팅창 숨기기"
          ClassProp="pl-tooltip-btn"
          IconProp="pl-icon20 side-close"
          TooltipPositionProp="bottom"
          @btnClick="closeModal"
        ></compo-tooltip-btn>
      </div>
    </div>
    <!-- content -->
    <div
      class="pl-quick-layer-body pa-0">
      <v-tabs class="pl-tabs" >
        <v-tab @click="[isPrevChatLog = false, chtHstry('now')]">상담 내용</v-tab>
        <v-tab @click="[isPrevChatLog = true, selectChtHstry()]">이전 채팅 내용</v-tab>
      </v-tabs>
      <div class="d-flex flex-column ">
        <!-- 이메일  -->
        <template v-if="CHAT_DATA.CHNL_CL === 'email'">
          <!-- 이메일 내용 -->
           <ComponentEmailDetail
            :DataProp=CHAT_DATA.email_content
           />
          <!-- 하단 이메일 발송 -->
          <div class="pl-chat-input mx-4 is-mt-m">
            <div class="pl-btn-wrap pa-3">
              <!-- 이메일 발송 버튼 -->
              <!-- bug: 컴포넌트 툴팁 사용시 채널 목록 채팅에서 이메일 선택하면, 하단 버튼의 위치와 표시 문제 -->
              <!-- <compo-tooltip-btn
                TitleProp="답변 이메일 발송"
                ClassProp="pl-tooltip-btn"
                IconProp="pl-icon20 email-send"
                TooltipPositionProp="top"
                @btnClick="sideEmailSend = true"
              ></compo-tooltip-btn> -->

              <v-tooltip content-class="pl-tooltip " top>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    v-bind="attrs" v-on="on"
                    @click="sideEmailSend = true"
                    class="pl-tooltip-btn"
                    min-width=30
                    height=30
                    plain
                    >
                      <v-icon small class="pl-icon20 email-send"></v-icon>
                  </v-btn>
                </template>
                <span>답변 이메일 발송</span>
              </v-tooltip>

              <v-btn
                class="pl-btn ml-auto"
              >상담종료</v-btn>

            </div>
          </div>

        </template>
        <!-- 채팅  -->
        <template v-if="CHAT_DATA.CHNL_CL === 'kakao' || CHAT_DATA.CHNL_CL === 'sms'">
          <!-- 채팅 내역 -->
          <ComponentChatLog
            :ChatLogProp=CHAT_LOG
            :ChtUserKey=CHAT_DATA.CHT_USER_KEY
            :ChtCuttId=CHAT_DATA.CHT_CUTT_ID
            :HeightProp="isPrevChatLog ? 'calc(100vh - 302px)' : 'calc(100vh - 402px)'"
          />
          <!-- 하단 채팅창 입력 -->
          <div class="pl-chat-input mx-4" v-if="!isPrevChatLog">
            <div class="pl-chat-input-text-wrap">
              <v-textarea
                v-model="CHAT_INPUT.textarea"
                ref="chatInput"
                class="pl-form is-noresize"
                placeholder="여기에 메시지를 입력하세요"
                @keydown="keyDown"
                :disabled="CHAT_STAT == 'ING' ? false : true"
                :spellcheck="false"
              />
              <!-- 채팅 보내기 버튼 -->
              <compo-tooltip-btn
                TitleProp="채팅 보내기"
                ClassProp="pl-tooltip-btn"
                IconProp="pl-icon30 chat-send-clr"
                TooltipPositionProp="bottom"
                @btnClick="CHAT_DATA.CHN_CLSF_CD == 'MO' ? sendMo() : sendMsg('msg')"
                :DisabledProp="CHAT_STAT == 'ING' ? false : true"
              ></compo-tooltip-btn>
            </div>
            <div class="pl-chat-input-bottom mt-auto" >
              <div class="pl-btn-wrap">
                <!-- 이미지전송 버튼 -->
                <!--<compo-tooltip-btn
                  TitleProp="이미지전송"
                  ClassProp="pl-tooltip-btn"
                  IconProp="pl-icon20 pick-img"
                  TooltipPositionProp="top"
                  @btnClick="clickAddFiles"
                  :DisabledProp="CHAT_STAT == 'ING' ? false : true"
                ></compo-tooltip-btn>-->
                <!-- 이미지 직접 전송 버튼 -->
                <compo-tooltip-btn
                  TitleProp="이미지 전송"
                  ClassProp="pl-tooltip-btn"
                  IconProp="pl-icon20 pick-img"
                  TooltipPositionProp="top"
                  @btnClick="sendImg"
                  :DisabledProp="CHAT_STAT == 'ING' && CHAT_DATA?.CHN_CLSF_CD == 'KAKAO' ? false : true"
                ></compo-tooltip-btn>
                <input ref="fileUpload" type="file" @change="handleFileUpload('IMG')" style="display: none" />
                <!-- 파일첨부 버튼 -->
                <compo-tooltip-btn
                  v-if="CHAT_DATA?.CHN_CLSF_CD == 'KAKAO'"
                  TitleProp="파일첨부"
                  ClassProp="pl-tooltip-btn"
                  IconProp="pl-icon20 file-add"
                  TooltipPositionProp="top"
                  @btnClick="sendFile"
                  :DisabledProp="CHAT_STAT == 'ING' ? false : true"
                ></compo-tooltip-btn>
                <input ref="fileSend" type="file" @change="handleFileUpload('FILE')" style="display: none" />
                <!-- 전달 버튼 -->
                <compo-tooltip-btn
                  TitleProp="전달"
                  ClassProp="pl-tooltip-btn"
                  IconProp="pl-icon20 pass-msg"
                  TooltipPositionProp="top"
                  @btnClick="tranUserSrch()"
                ></compo-tooltip-btn>
                <div 
                  class="pl-btn-wrap"
                  v-if="CHT_TRAN"
                >
                  <v-select
                    class="pl-form type-middle is-auto type-arrow2"
                    :items="TRAN_USER_LIST"
                    v-model="TRAN_USER"
                    placeholder="전달할 상담원 선택"
                    no-data-text="대기중인 상담원이 없습니다"
                  >
                  </v-select>
                  <v-btn
                    class="pl-btn"
                    @click="showAlert(MESSAGE.CONFIRM.TRAN)"
                    >전달</v-btn>
                </div>

                <!-- 종료링크 전송 버튼 -->
                <compo-tooltip-btn
                  v-if="CHAT_DATA?.CHN_CLSF_CD == 'KAKAO'"
                  TitleProp="종료링크 전송"
                  ClassProp="pl-tooltip-btn"
                  IconProp="pl-icon20 endlink-msg"
                  TooltipPositionProp="top"
                  @btnClick="sendMsg('endLink')"
                  :DisabledProp="CHAT_STAT == 'ING' ? false : true"
                ></compo-tooltip-btn>

                <div 
                  class="ml-auto pl-btn-wrap"
                  v-if="CHAT_STAT == 'ING' ? true : false"
                >
                  <v-btn
                    v-if="CHAT_DATA?.CHN_CLSF_CD == 'KAKAO'"
                    class="pl-btn is-esp"
                    @click="sendCustInfo()"
                    >고객정보 요청</v-btn>
                  <!-- <v-btn
                    v-if="CHAT_DATA?.CHN_CLSF_CD == 'MO'"
                    class="pl-btn is-esp"
                    @click="searchCust()"
                    >고객정보 조회</v-btn> -->
                  <v-btn
                    class="pl-btn"
                    @click="selectChatList()"
                    >상담종료</v-btn>
                </div>
              </div>
            </div>
          </div>
          <!-- 이전 대화내용 보기 -->
          <div class="pl-btn-wrap px-5 py-4 is-border-top" v-else>
            <strong class="ml-auto">{{ NOW_CHT_CNT }}/{{ TOT_CHT_CNT }}</strong>
            <v-btn 
              class="pl-btn is-icon is-trans ml-2"
              @click="chtHstry('next')"
              :disabled="NOW_CHT_CNT <= 1 ? true : false"
            >
              <span class="pl-icon20 arrow-up"></span>
              다음 상담 내용
            </v-btn>
            <v-btn 
              class="pl-btn is-icon is-trans"
              @click="chtHstry('before')"
              :disabled="NOW_CHT_CNT == TOT_CHT_CNT ? true : false"
            >
              <span class="pl-icon20  arrow-down"></span>
              이전 상담 내용
            </v-btn>
          </div>

        </template>
      </div>
    </div>

    <!-- slide: 이메일 발송 -->
    <v-slide-x-reverse-transition>
      <div
        v-if=" sideEmailSend === true "
        style="width: 800px"
        class="pl-quick-layer">
        <div class="pl-quick-layer-header"><h1>답변 이메일 발송</h1>
          <compo-tooltip-btn
            TitleProp="닫기"
            ClassProp="pl-tooltip-btn ml-1"
            IconProp="pl-icon20 dialog-close"
            TooltipPositionProp="bottom"
            @btnClick="sideEmailSend = false"
          ></compo-tooltip-btn>
        </div>
        <div class="pl-quick-layer-body pa-0" style="flex: 0 0 calc(100% - 217px);">
          <CompoSendEmailWrite
            :DataProp=CHAT_DATA.email_content
           />
        </div>
        <div class="pl-quick-layer-footer pl-btn-wrap">
          <v-btn class="pl-btn is-trans ml-auto" @click="sideEmailSend = false">취소</v-btn>
          <v-btn class="pl-btn" >보내기</v-btn>
        </div>
      </div>
    </v-slide-x-reverse-transition>
  </div>
</template>

<script>
import ComponentChatLog from './ComponentChatLog'
import ComponentEmailDetail from './ComponentEmailDetail'
import CompoSendEmailWrite from './CompoSendEmailWrite'

import { stompUtil } from "@/store/stomp-util.js";

import axios from "axios";

export default {
  name: "ChatDetailLog", //name은 'MENU_' + 파일명 조합
  components: {
    ComponentChatLog,
    ComponentEmailDetail,
    CompoSendEmailWrite
  },
  props: {
    PropData: {
      type: Object
    },
    StatData: {
      type: Array,
    },
    ChatStat: {
      type: String,
    }
  },
  data() {
    return {
      // 이전 대화내용 보기
      isPrevChatLog: false,

      STAT_LIST: this.StatData,
      SYSTEM_MSG_STAT: true,
      STAT_LIST_CH: [
        { code: 'kakao', value: '카카오톡 대화' },
        { code: 'email', value: '이메일 상담' },
        { code: 'sms', value: '문자 대화' },
      ],
      // 북마크 ani
      lottieFavorite: null,
      favToggle: false,

      // 이메일
      sideEmailSend: false,
      
      // [채팅 log]
      NOW_CHAT : '',
      CHAT_DATA:{},
      CHAT_STAT: '',      //상담 버튼 및 메시지 제어를 위한 상태
      BFR_CHAT_LOG: [],   //이전채팅 내역 => 챗봇내역때문에 이전채팅내역이 꼬이는일이 발생하여 변수 새로 생성
      CHAT_LOG: [],       //채팅 내역
      CHBT_USER: {},      //챗봇고객정보
      CHBT_INFO: [],      //고객챗봇이력

      CHAT_INPUT: {
        textarea: ''
      },
      KEYDOWN:'',         //메시지 입력창 키입력 감지

      NEW_CHAT_LIST:[],   //신규채팅(확인안한채팅) 리스트

      CHT_TRAN:false,    //채팅 전달폼
      TRAN_USER_LIST:[],  //전달상담원 리스트
      TRAN_USER:'',       //전달상담원 정보

      FBDWD_YN:'',      //금칙어 적용여부
      SHOW_QSTN:'', //고객이 선택한 문의유형 보기 여부

      IMG_EXTN_LIST:['jpg','png','gif'],        //카카오톡 이미지 지원 형식 리스트
      FILE_EXTN_LIST:['doc','docx','hwp','txt','rtf','xml','pdf','wks','wps','xps','md','odf','odt','ods'
        ,'odp','csv','tsv','xls','xlsx','ppt','pptx','pages','key','numbers','show','ce'
        ,'zip','gz','bz2','rar','7z','lzh','alz'],        //카카오톡 파일 지원 형식 리스트
      AUDIO_EXTN_LIST:['mp3','wav','flac','tta','tak','aac','wma','ogg','m4a'],        //카카오톡 오디오 지원 형식 리스트
      VIDEO_EXTN_LIST:['mp4','m4v','avi','asf','wmv','mkv','ts','mpg','mpeg','mov','flv','ogv'],  //카카오톡 비디오 지원 형식 리스트

      NOW_CHT_CNT:0,    //현재 채팅
      TOT_CHT_CNT:0,    //총 채팅
      CUST_CHT_HSTRY:[],  //고객 채팅 내역

      //알림창 메시지
      MESSAGE : {
        CONFIRM : {
          TRAN : {alertDialogToggle: true, msg: '상담을 전달하시겠습니까?', iconClass: 'is-info', type: 'confirm', callYes: this.chatTran, callNo: this.closeMsg}
          , CLBK : {alertDialogToggle: true, msg: '콜백을 등록하시겠습니까?', iconClass: 'is-info', type: 'confirm', callYes: this.cuttSave, callNo: this.closeMsg}
          , SAVE : {alertDialogToggle: true, msg: '상담을 저장하시겠습니까?', iconClass: 'is-info', type: 'confirm', callYes: this.cuttSave, callNo: this.closeMsg}
          , SAVE_BAT : {alertDialogToggle: true, msg: '상담을 일괄저장하시겠습니까?', iconClass: 'is-info', type: 'confirm', callYes: this.cuttBatSave, callNo: this.closeMsg}
          , TEMP_SAVE : {alertDialogToggle: true, msg: '상담을 임시저장하시겠습니까?', iconClass: 'is-info', type: 'confirm', callYes: this.cuttSave, callNo: this.closeMsg}
          , END : {alertDialogToggle: true, msg: '상담을 종료하시겠습니까?', iconClass: 'is-info', type: 'confirm', callYes: this.unStngUserConfirm, callNo: this.closeMsg}
        },
        ALERT : {
          SYS_MSG_ON_SUCCESS : {alertDialogToggle: true, msg: '시스템메시지가 발송됩니다', iconClass: 'is-info', type: 'default'}
          , SYS_MSG_ON_SUCCESS_TOAST: {  msg: '시스템메시지가 발송됩니다', class: 'success', hasToastIcon: true, icon: 'mdi-checkbox-marked-circle', time: 4000 }  //토스트알림
          , SYS_MSG_OFF_SUCCESS : {alertDialogToggle: true, msg: '시스템메시지를 발송하지 않습니다', iconClass: 'is-info', type: 'default'}
          , SYS_MSG_OFF_SUCCESS_TOAST: {  msg: '시스템메시지를 발송하지 않습니다', class: 'success', hasToastIcon: true, icon: 'mdi-checkbox-marked-circle', time: 4000 }  //토스트알림
          , BMK_ON_SUCCESS : {alertDialogToggle: true, msg: '책갈피가 추가되었습니다', iconClass: 'is-info', type: 'default'}
          , BMK_ON_SUCCESS_TOAST: {  msg: '책갈피가 추가되었습니다', class: 'success', hasToastIcon: true, icon: 'mdi-checkbox-marked-circle', time: 4000 }  //토스트알림
          , BMK_OFF_SUCCESS : {alertDialogToggle: true, msg: '책갈피가 삭제되었습니다', iconClass: 'is-info', type: 'default'}
          , BMK_OFF_SUCCESS_TOAST: {  msg: '책갈피가 삭제되었습니다', class: 'success', hasToastIcon: true, icon: 'mdi-checkbox-marked-circle', time: 4000 }  //토스트알림
          , TRAN_SUCCESS : {alertDialogToggle: true, msg: '채팅 전달이 완료되었습니다', iconClass: 'is-info', type: 'default'}
          , CLBK_SUCCESS : {alertDialogToggle: true, msg: '콜백이 등록되었습니다', iconClass: 'is-info', type: 'default'}
          , SAVE_SUCCESS : {alertDialogToggle: true, msg: '상담이 저장되었습니다', iconClass: 'is-info', type: 'default'}
          , SET_SUCCESS : {alertDialogToggle: true, msg: '설정이 변경되었습니다', iconClass: 'is-info', type: 'default'}
          , VALID : {alertDialogToggle: true, msg: '필수항목 확인 후<br>재시도 해주세요', iconClass: 'is-info', type: 'default'}
          , CANT_CHAT : {alertDialogToggle: true, msg: '상담이 가능한 상태가 아닙니다', iconClass: 'is-info', type: 'default'}
          , CHT_WAIT: {  msg: '채팅상담이 준비되었습니다', class: 'success', hasToastIcon: true, icon: 'mdi-checkbox-marked-circle', time: 4000 }  //토스트알림
          , CHT_END: {  msg: '더이상 신규채팅을 받지 않습니다', class: 'success', hasToastIcon: true, icon: 'mdi-checkbox-marked-circle', time: 4000 }  //토스트알림
          , CHT_CANT: {  msg: '채팅상담이 종료되었습니다', class: 'success', hasToastIcon: true, icon: 'mdi-checkbox-marked-circle', time: 4000 }  //토스트알림
          , SUMMARY_CUTT_CN: {alertDialogToggle: true, msg: '상담 내용이 없습니다.', iconClass: 'is-info', type: 'default'}
          , APPLY_CUTT_CN: {alertDialogToggle: true, msg: '상담 저장 화면 오픈 후 실행해 주세요.', iconClass: 'is-info', type: 'default'}
          , MAX_FILE_TOAST: {  msg: '이미지는 한개씩 발송 가능합니다', class: 'warning', hasToastIcon: true, icon: 'mdi-checkbox-marked-circle', time: 4000 }  //토스트알림
          , CHK_CUTT_TYPE: {alertDialogToggle: true, msg: '상담유형을 다시선택해주세요', iconClass: 'is-info', type: 'default'}
          , EMPTY_TRAN_USER: {alertDialogToggle: true, msg: '전달할 상담원을 선택해주세요', iconClass: 'is-info', type: 'default'}
        },
        INFO : {
          SHORTCUT_USER_CHT_STAT : { msg: '채팅ON 상태 변경 후 이용해 주세요.', class: 'info', hasToastIcon: true, icon: 'mdi-information-outline', time: 4000 },
          SHORTCUT_CHAT_STAT : { msg: '상담중인 대화 선택 후 이용해 주세요.', class: 'info', hasToastIcon: true, icon: 'mdi-information-outline', time: 4000 },
        },
        ERROR : {
          ERROR : {alertDialogToggle: true, msg: '일시적인 장애이거나 네크워크 문제일 수 있습니다.잠시 후 다시 이용해주세요.<br><br>계속하여 동일 메시지가 발생하면 시스템관리자에게 문의해 주십시오.', iconClass: 'is-caution', type: 'default'}
        },
        TOAST:{
         SUCCESS: {  msg: '상담이 저장되었습니다', class: 'success', hasToastIcon: true, icon: 'mdi-checkbox-marked-circle', time: 4000 }  //토스트알림
          ,TRAN_SUCCESS: {  msg: '채팅 전달이 완료되었습니다', class: 'success', hasToastIcon: true, icon: 'mdi-checkbox-marked-circle', time: 4000 }  //토스트알림
          ,CLBK_SUCCESS: {  msg: '콜백이 등록되었습니다', class: 'success', hasToastIcon: true, icon: 'mdi-checkbox-marked-circle', time: 4000 }  //토스트알림
          ,SAVE_SUCCESS: {  msg: '상담이 저장되었습니다', class: 'success', hasToastIcon: true, icon: 'mdi-checkbox-marked-circle', time: 4000 }  //토스트알림
          ,SET_SUCCESS: {  msg: '설정이 변경되었습니다', class: 'success', hasToastIcon: true, icon: 'mdi-checkbox-marked-circle', time: 4000 }  //토스트알림
        },

      },
    }
  },
  methods: {
    closeModal(){
      this.$emit('Close')
    },
    // favorite animation
    aniFavorite(flag){
      const PLAYBACK_RANGE = [30, 119];
      const lottieFavorite = this.lottieFavorite;

      if (flag) {
        lottieFavorite.playSegments(PLAYBACK_RANGE, true);
      } else {
        lottieFavorite.goToAndStop(0, true);
      }
    },
    //temp 북마크
    async bmkStrg(){
      if(this.favToggle){
        this.aniFavorite( false )
        this.favToggle = false
      } else{
        this.aniFavorite( true )
        this.favToggle = true
      }

      let sUrl = '/chat-api/main/markup/regist';
      let postParam = {
        CHT_CUTT_ID: this.CHAT_DATA.CHT_CUTT_ID,
        BMK_YN: this.favToggle ? 'Y' : 'N'
      }
      let headParam = {
        head: {
        }
      }

      let resData = await this.common_postCall(sUrl, postParam, headParam)
      if(!resData.HEADER.ERROR_FLAG){
        this.$store.commit("alertStore/hideAlert");
        if(this.favToggle){
          this.showToast(this.MESSAGE.ALERT.BMK_ON_SUCCESS_TOAST);
        } else {
          this.showToast(this.MESSAGE.ALERT.BMK_OFF_SUCCESS_TOAST);
        }
        this.$eventBus.chtListSrch();
      }
    },

    // 이미지 전송
    clickAddFiles() {
      this.qstnTreeSrch();
      this.mixin_showDialog('ImgSend')
    },
    
    //고객정보요청
    sendCustInfo(){
      this.sendMsg('custInfo');
    },

    // 상담종료 선택
    selectChatList() {
      //상담종료버튼 클릭
      let chnClsfCd = this.CHAT_DATA.CHN_CLSF_CD;
      if(chnClsfCd !== 'EMAIL' && chnClsfCd !== 'BBS') {
        this.sendMsg('end');
      }

      //상담유형이 있으면 상담유형 세팅
      if(this.CHAT_DATA.CUTT_TYPE_ID){
        this.selCuttTypeSrch();
      } else {
        this.cuttTypeSrch();
        this.CUTT_TYPE_ID='';          //선택 상담유형
      }
      
    },

    //상담유형 가져오기
    async selCuttTypeSrch(){
      let sUrl = '/chat-api/main/selCuttTypeSrch';
      let postParam = {
        CUTT_TYPE_ID:this.CHAT_DATA.CUTT_TYPE_ID,
        CUTT_TYPE_LMT_LVL_CD: this.CUTT_TYPE_LMT_LVL_CD,
      }
      let headParam = {
        head : {
        }
      }

      let resData  = await this.common_postCall(sUrl, postParam, headParam);
      if (!resData.HEADER.ERROR_FLAG){
        //json형태로 선택한 상담유형과 상위 상담유형정보를 가져옴
        let selCuttTypeObj = resData.DATA[0];
        let selCuttTypeLeng = Object.keys(selCuttTypeObj).length;
        console.log("selCuttTypeObj", selCuttTypeObj);

        //json형태의 상담유형정보를 array로 만들어줌
        let selCuttTypeArr = [];
        //마지막 데이터는 고객사 기본데이터이기 때문에 불필요
        for(let i=0;i<selCuttTypeLeng-1;i++){
          console.log("i", i);
          selCuttTypeArr[i] = selCuttTypeObj[i];
          console.log("selCuttTypeObj[i]", selCuttTypeObj[i]);
        }
        selCuttTypeArr.reverse();

        console.log("selCuttTypeArr", selCuttTypeArr);
        //상담유형정보 세팅
        let leng = selCuttTypeArr.length
        for(let n=0;n<leng;n++){
          this.CUTT_TYPE_VMODEL_ARR[n] = selCuttTypeArr[n];
          console.log("this.CUTT_TYPE_VMODEL_ARR[n]", this.CUTT_TYPE_VMODEL_ARR[n]);
          this.changeCuttTypeItems(n)
        }
      }
    },

    //상담유형 목록 조회
    async cuttTypeSrch() {
      let sUrl = '/api/setting/cuttType/cuttTypeTreeList';
      let postParam = {
      }

      let headParam = {
        head : {
        }
      }

      let resData  = await this.common_postCall(sUrl, postParam, headParam);
      if (!resData.HEADER.ERROR_FLAG){
        //상담유형 정보
        if(resData.CUTT_TYPE_SETTING){
          this.ITGRT_USE_YN = resData.CUTT_TYPE_SETTING[0].ITGRT_USE_YN;
          this.CUTT_TYPE_LMT_LVL_CD = resData.CUTT_TYPE_SETTING[0].CUTT_TYPE_LMT_LVL_CD;
          this.TRANS_USE_YN = resData.CUTT_TYPE_SETTING[0].TRANS_USE_YN;
          this.STT_USE_YN = resData.CUTT_TYPE_SETTING[0].STT_USE_YN;
        }

        this.CUTT_ITEMS = resData.DATA;

        for(let i=0;i<parseInt(this.CUTT_TYPE_LMT_LVL_CD);i++){
          this.CUTT_TYPE_VMODEL_ARR[i] = '';//초기화
        }
      }
    },

    //상담유형 하위 item 가져오기
    getChildCuttTypeItems(idx, parentItem) {
      let arrCuttType = [];

      if(idx === 0){
        parentItem = this.CUTT_ITEMS[0].CUTT_TYPE_ID;
        this.CUTT_ITEMS.map(function(row){
          if(row.UP_CUTT_TYPE_ID === parentItem)
            if(row) arrCuttType.push(row);
        });
      }else{
        if(parentItem){
          this.CUTT_ITEMS.map(function(row){
            if(row.UP_CUTT_TYPE_ID === parentItem)
              if(row) arrCuttType.push(row);
          });
        }
      }

      return arrCuttType || [];
    },

    //상담유형 변경 이벤트
    changeCuttTypeItems(idx){
      this.CUTT_TYPE_ID = this.CUTT_TYPE_VMODEL_ARR[idx];
      for(let k=0; k<this.CUTT_TYPE_VMODEL_ARR.length; k++){
        if(k > idx) this.CUTT_TYPE_VMODEL_ARR[k] = '';//초기화
      }
    },
    

    //엔터키로 채팅 보내기(줄바꿈 해제)
    //Shift + Enter 는 줄바꿈 textarea 기본 이벤트 적용
    keyDown(e) {
      if(!e.shiftKey && e.key == 'Enter'){
        e.preventDefault();
        if(this.CHAT_DATA.CHN_CLSF_CD == 'MO'){
          this.sendMo();
        } else {
          this.sendMsg('msg');
        }
      }
    },

    //채팅 보내기
    sendMsg(type, item){
      console.log("CHAT_DATA", this.CHAT_DATA);
      console.log("item", item);
      let chatStat = this.$store.getters["userStore/GE_CHAT_STAT"];
      if(chatStat == 'CANT_CHAT' || chatStat == 'CHT_CANT' || chatStat == null || chatStat == undefined){
        this.showAlert(this.MESSAGE.ALERT.CANT_CHAT);
        return;
      }

      let msgcopy = this.CHAT_INPUT.textarea;
      let MSG_INFO = [];
      let chatmsg = {};

      if(type == 'msg'){
        if (msgcopy.replace(/(?:\r\n|\r|\n)/g, "").length === 0) {
          return false;
        }
        if(msgcopy.length < 1000){
          MSG_INFO[0] = {
            msg: msgcopy,
            message_type: "TX",
            SNDRCV_CD: "SND",
            type: "message",
          };
        } else if(msgcopy.length >= 1000){
          let ARR_NUM = (msgcopy.length / 1000);
          for(let i=0;i<ARR_NUM;i++){
            MSG_INFO[i] = {
              msg: msgcopy.substring((i*1000), (i*1000)+1000),
              message_type: "TX",
              SNDRCV_CD: "SND",
              type: "message",
            };
          }
        }
      } else if(type == 'endLink'){
        MSG_INFO[0] = {
          msg: '종료버튼 메시지는 시스템 메시지에서 가져옴',
          message_type: "LI",
          SNDRCV_CD: "SND",
          type: "chatClose",
        };
      } else if(type == 'img'){
        for(let i=0;i<item.length;i++){
          MSG_INFO[i] = {
            message_type : 'IM'
            , SNDRCV_CD: 'SND'
            , type : 'image'
            , image : this.CHAT_DATA.CHN_CLSF_CD == 'NTT' ? process.env.VUE_APP_API_URL + "/upload/" + item[i].FILE_PATH + "/" + item[i].STRG_FILE_NM : item[i].FILE_PATH + "/" + item[i].STRG_FILE_NM
            , msg : item[i].FILE_PATH + "/" + item[i].STRG_FILE_NM
            , CONTENT : item[i].FILE_PATH + "/" + item[i].STRG_FILE_NM
            , IMAGE_TALK_PATH : item[i].FILE_PATH + "/" + item[i].STRG_FILE_NM
            , FILE_GROUP_KEY : item[i].FILE_GROUP_KEY
            , FILE_KEY : item[i].FILE_KEY
          };
        }
      } else if(type == 'file'){
        for(let i=0;i<item.length;i++){
          MSG_INFO[i] = {
            message_type : item[i].FILE_TYPE
            , SNDRCV_CD: 'SND'
            , type : item[i].FILE_TYPE=='AU' ? 'audio' : (item[i].FILE_TYPE=='VI' ? 'video' : 'file')
            , file : this.CHAT_DATA.CHN_CLSF_CD == 'NTT' ? process.env.VUE_APP_API_URL + "/upload/" + item[i].FILE_PATH + "/" + item[i].STRG_FILE_NM : item[i].FILE_PATH + "/" + item[i].STRG_FILE_NM
            , msg : item[i].FILE_PATH + "/" + item[i].STRG_FILE_NM
            , CONTENT : item[i].FILE_PATH + "/" + item[i].STRG_FILE_NM
            , IMAGE_TALK_PATH : item[i].FILE_PATH + "/" + item[i].STRG_FILE_NM
            , FILE_GROUP_KEY : item[i].FILE_GROUP_KEY
            , FILE_KEY : item[i].FILE_KEY
            , FILE_NM : item[i].ACTL_FILE_NM
          };
        }
      } else if(type == 'end'){
        MSG_INFO[0] = {
          message_type : 'TX'
          , SNDRCV_CD: 'SND'
          , type : 'message'
          , msg : '상담 종료'
          , consultEnd : 'Y'
        };
      } else if(type == 'custInfo'){
        MSG_INFO[0] = {
          message_type : 'LI'
          , SNDRCV_CD: 'SND'
          , type : 'custInfo'
          , msg : '고객정보요청 메시지는 시스템 메시지에서 가져옴'
        };
      }

      let CHAT_INFO = {
        SEND_USER_NM: this.$store.getters["userStore/GE_USER_ROLE"].userName,
        token: this.$store.state.messages.token,
        userId: this.$store.getters["userStore/GE_USER_ROLE"].userId,
        chtCuttId: this.CHAT_DATA.CHT_CUTT_ID,
        sndrKey: this.CHAT_DATA.SNDR_KEY,
        chnClsfCd: this.CHAT_DATA.CHN_CLSF_CD,
        custcoId: this.$store.getters["userStore/GE_USER_ROLE"].company.CD,
        sndrUserNm: this.CHAT_DATA.CUST_NM,
        custId: this.CHAT_DATA.CUST_ID,
        chtUserKey: this.CHAT_DATA.CHT_USER_KEY
      };

      let msgObj = this.$store.getters["messages/GE_CONTACT_MSG"]({
        chtCuttId: CHAT_INFO.chtCuttId,
      });

      for(let n=0;n<MSG_INFO.length;n++){
        chatmsg[n] = this.$store.getters["messages/GE_MSG_OBJ"]({
          user_key: CHAT_INFO.custId,
          sndrcv_cd: "snd",
          type: MSG_INFO[n].message_type,
          content: MSG_INFO[n].msg,
          chtCuttId: CHAT_INFO.chtCuttId,
          IMAGE_TALK_PATH:
          MSG_INFO[n].IMAGE_TALK_PATH != "" ? MSG_INFO[n].IMAGE_TALK_PATH : "",
          FILE_GROUP_KEY:
          MSG_INFO[n].FILE_GROUP_KEY != "" ? MSG_INFO[n].FILE_GROUP_KEY : "",
          FILE_KEY: MSG_INFO[n].FILE_KEY != "" ? MSG_INFO[n].FILE_KEY : "",
          FILE_BLOB: MSG_INFO[n].FILE_BLOB != "" ? MSG_INFO[n].FILE_BLOB : "",
          FILE_EXTS: MSG_INFO[n].FILE_EXTS != "" ? MSG_INFO[n].FILE_EXTS : "",
          //, SEND_USER_NM : Vue.prototype.store.state.messages.userNm
          SEND_USER_NM: CHAT_INFO.sndrUserNm,
          SEND_USER_SHORT_NM: "나",
          consultEnd: MSG_INFO[n].consultEnd,
          CUSTCO_ID: CHAT_INFO.custcoId,
        });

        stompUtil.sendMessage(MSG_INFO[n], CHAT_INFO, chatmsg[n], msgObj);
      }

      // this.$eventBus.chtListSrch();
      // this.chatHstSrch();

      this.CHAT_INPUT.textarea ='';

      this.BFR_CHT_PROP = false
    },

    //MO메시지 전송
    async sendMo(){
      let chatStat = this.$store.getters["userStore/GE_CHAT_STAT"];
      if(chatStat == 'CANT_CHAT' || chatStat == 'CHT_CANT' || chatStat == null || chatStat == undefined){
        this.showAlert(this.MESSAGE.ALERT.CANT_CHAT);
        return;
      }

      let msgcopy = this.CHAT_INPUT.textarea;

      let sUrl = '/chat-api/main/sendMo';
      let postParam = {
        CHT_CUTT_ID: this.CHAT_DATA.CHT_CUTT_ID
        , SND_MSG: msgcopy
        , USED_CD: msgcopy.length < 1000 ? '00'/*'SMS'*/ : '10'/*'LMS'*/
        , RESERVED_FG: '00'
        , CHT_USER_KEY: this.CHAT_DATA.SNDR_KEY
        , SNDR_KEY: this.CHAT_DATA.SNDR_KEY
        , CUST_ID: this.CHAT_DATA.CUST_ID
      }
      let headParam = {
        head: {
        }
      }

      let resData = await this.chat_postCall(sUrl, postParam, headParam)
      if(resData.code == '0'){
        this.CHAT_INPUT.textarea ='';
        this.chatHstSrch();
      } else {
        this.showAlert(this.MESSAGE.ALERT.ERROR);
      }
    },
    
    // 채팅 이미지전송
    sendImg() {
      this.$refs.fileUpload.click();
    },

    // 채팅 파일전송
    sendFile(){
      this.$refs.fileSend.click();
    },

    // 파일을 서버에 업로드하는 부분
    handleFileUpload(type){
      let file = null;
      if(type == 'IMG'){
        file = this.$refs.fileUpload.files;
        console.log( file );
        if (file.length > 0 && this.isValidImgFiles(file)) {
          // 파일 업로드
          this.uploadFiles(file, type);
        }
      } else {
        file = this.$refs.fileSend.files;
        console.log( file );
        if (file.length > 0 && this.isValidKakaoFiles(file)) {
          // 파일 업로드
          this.uploadFiles(file, type);
        }
      }
    },

    //파일개수 제한(파일개수 체크)
    isValidImgFiles(files) {
      // 파일 개수 제한을 설정
      const maxFileCount = 5;
      if (files.length > maxFileCount) {
        alert(`최대 ${maxFileCount}개의 파일까지 업로드할 수 있습니다.`);
        return false;
      }

      // 파일 크기 및 형식을 설정 (대소문자 구분)
      const allowedFileTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
      const maxFileSize = 5 * 1024 * 1024; // 5MB
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!allowedFileTypes.includes(file.type)) {
          alert('지원하지 않는 파일 형식입니다.');
          return false;
        }
        if (file.size > maxFileSize) {
          alert('파일 크기가 허용 범위를 초과합니다.');
          return false;
        }
      }

      return true;
    },

    isValidKakaoFiles(files) {
      // 파일 개수 제한을 설정
      const maxFileCount = 5;
      if (files.length > maxFileCount) {
        alert(`최대 ${maxFileCount}개의 파일까지 업로드할 수 있습니다.`);
        return false;
      }

      // 파일 크기 및 형식을 설정 (대소문자 구분)
      const allowedFileTypes = ['video/mp4', 'video/x-m4v', 'video/x-msvideo', 'video/x-ms-asf'
        ,'video/x-ms-wmv','video/x-matroska','video/mp2t','video/mpeg','video/mpeg','video/quicktime'
        ,'video/x-flv','video/ogg'  //비디오 파일
        ,'audio/mpeg','audio/wav','audio/flac','audio/tta','audio/tak','audio/aac','audio/x-ms-wma'
        ,'audio/ogg','audio/mp4'    //오디오 파일
        ,'application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ,'application/x-hwp','text/plain','application/rtf','application/xml','application/pdf'
        ,'application/vnd.ms-works','application/vnd.ms-works','application/vnd.ms-xpsdocument'
        ,'text/markdown','application/vnd.oasis.opendocument.text','application/vnd.oasis.opendocument.text'
        ,'application/vnd.oasis.opendocument.spreadsheet','application/vnd.oasis.opendocument.presentation'
        ,'text/csv','text/tab-separated-values','application/vnd.ms-excel'
        ,'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet','application/vnd.ms-powerpoint'
        ,'application/vnd.openxmlformats-officedocument.presentationml.presentation','application/x-pages'
        ,'application/x-keynote','application/x-numbers','application/vnd.ms-powerpoint'
        ,'application/octet-stream'   //문서 파일
        ,'application/zip','application/gzip','application/x-bzip2','application/x-rar-compressed'
        ,'application/x-7z-compressed','application/x-lzh-compressed','application/x-alz-compressed'   //압축 파일
      ];
      const maxFileSize = 5 * 1024 * 1024; // 5MB
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!allowedFileTypes.includes(file.type)) {
          alert('지원하지 않는 파일 형식입니다.');
          return false;
        }
        if (file.size > maxFileSize) {
          alert('파일 크기가 허용 범위를 초과합니다.');
          return false;
        }
      }

      return true;
    },

    //파일 업로드
    uploadFiles(files, type) {
      let busiType = 'chat';
      let pathType = type=='IMG' ? 'images' : 'files';
      let uploadUrl = "/api/file/"+ busiType +"/"+ pathType +"/uploads";

      //파일 제한 체크 (빽엔드에서 체크 후 업로드 실패)
      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {

        formData.append('action', uploadUrl);
        formData.append('method', "post");
        formData.append('custcoId', this.$store.getters['userStore/GE_USER_ROLE'].company.CD);                 //회사구분 : 1은 시스템(가이드)
        formData.append('userfiles', files[i]);           //파일(바이너리)
        formData.append('userId', this.$store.getters['userStore/GE_USER_ROLE'].userId);                   //사용자 ID : 2는 시스템(가이드)

        for (let key of formData.keys()) {
          // console.log("formData key",key);
        }

        /* value 확인하기 */
        for (let value of formData.values()) {
          // console.log("formData val",value);
        }

        axios
            .post(uploadUrl, formData, {headers:{Authorization: "bearer " + window.sessionStorage.getItem("token")}})
            .then(response => {
              // 파일 업로드 성공 시 처리
              let leng = response.data.data.length
              let fileList = [];
              for(let n=0;n<leng;n++){
                console.log("response.data.data[n]", response.data.data[n]);
                fileList.push({
                  index : i
                  , FILE_PATH : response.data.data[n].filePath
                  , STRG_FILE_NM : response.data.data[n].strgFileNm
                  , FILE_GROUP_KEY : response.data.data[n].fileGroupKey
                  , FILE_KEY : response.data.data[n].fileKey
                  , ACTL_FILE_NM : response.data.data[n].actlFileNm
                  , FILE_TYPE : this.IMG_EXTN_LIST.includes(response.data.data[n].fileExtn) ? 'IM'
                    : (this.AUDIO_EXTN_LIST.includes(response.data.data[n].fileExtn) ? 'AU'
                    : (this.VIDEO_EXTN_LIST.includes(response.data.data[n].fileExtn) ? 'VI'
                    : 'FI'))
                });
              }
              if(type == 'IMG'){
                this.sendUploadImg(fileList);
              } else {
                this.sendUploadFile(fileList);
              }
            })
            .catch(error => {
              // 파일 업로드 실패 시 처리
              console.error(error);
              this.$store.commit("alertStore/hideAlert");
            });
      }
      // 서버로 파일 업로드 요청을 보냅니다.
    },

    // 실제 이미지 발송
    sendUploadImg(fileList){
      this.sendMsg('img',fileList);
    },

    // 실제 파일 발송
    sendUploadFile(fileList){
      this.sendMsg('file',fileList);
    },


    //채팅 내역 조회
    async chatHstSrch(chat){
      //대기중인 채팅 클릭 시 고객 정보 요청전송
      // if(this.CHAT_DATA.CUTT_STTS_CD == 'TRAN_WAIT'|| this.CHAT_DATA.CUTT_STTS_CD == 'WAIT'|| this.CHAT_DATA.CUTT_STTS_CD == 'CLBK_WAIT'){
      // if(this.CHAT_DATA.CUTT_STTS_CD == 'WAIT'){
      //   this.sendCustInfo();
      // }
      let sUrl = '/chat-api/main/cnslt-cn/inqire';
      let postParam = {
        CHT_CUTT_ID: chat == 'BFR' ? (this.BFR_CHAT_LOG.length != 0 ? this.BFR_CHAT_LOG[0].BFR_CHT : this.CHAT_LOG[0].BFR_CHT) : (chat == 'AFTR' ? this.CHAT_LOG[this.CHAT_LOG.length-1].AFTR_CHT : this.CHAT_DATA.CHT_CUTT_ID),
        CUST_ID: this.CHAT_DATA.CUST_ID,
        CUTT_STTS_CD: this.CHAT_DATA.CUTT_STTS_CD,
        CHT_RDY_ID: this.CHAT_DATA.CUTT_STTS_CD.indexOf('WAIT') != -1 ? this.CHAT_DATA.CHT_RDY_ID : '',
        CHT_USER_KEY : this.CHAT_DATA.CHT_USER_KEY,
        SNDR_KEY : this.CHAT_DATA.SNDR_KEY,
        CHN_CLSF_CD : this.CHAT_DATA.CHN_CLSF_CD,
      }
      let headParam = {
        head: {
        }
      }

      let resData = await this.chat_postCall(sUrl, postParam, headParam)
      if(!resData.header.ERROR_FLAG){
        //채팅 모드 초기화
        this.CHAT_CUTT_MODE = 'CHAT';
        let msgTypeCd = '';

        if(chat == 'BFR' || chat == 'AFTR'){
          let nowChat = [];
          if(chat == 'BFR'){
            nowChat = this.BFR_CHAT_LOG;
          } else {
            nowChat = this.CHAT_LOG;
          }
          let chatLog = [];
          let leng = resData.data.length;
          for(let i=0;i<leng;i++){
            let chatDate = this.mixin_convertDate(resData.data[i]["REG_DT"], 'yyyy-MM-dd HH:mm:ss')
            if(this.SHOW_QSTN == 'Y'){
              if(resData.data[i]["MSG_TYPE_CD"] == 'INFOMSG' && msgTypeCd != 'INFOMSG'){
                chatLog.push(
                  {
                    TYPE: resData.data[i+1]["MSG_TYPE_CD"],
                    SNDRCV_CD: resData.data[i+1]["RCPTN_DSPTCH_CD"],
                    SNDRCV_NM: resData.data[i+1]["CD_NM"],
                    IMAGE_URL: resData.data[i+1]["RCPTN_DSPTCH_CD"] == 'SND' ? "/upload/" + resData.data[i+1]["RCPTN_DSPTCH_MSG"] : resData.data[i+1]["RCPTN_DSPTCH_MSG"],
                    CONTENT: this.FBDWD_YN == 'Y' && resData.data[i]["MSG_TYPE_CD"] != 'FI' && resData.data[i]["MSG_TYPE_CD"] != 'AU'
                      ? (this.HIGHLIGHT ? resData.data[i+1]["CHG_RCPTN_DSPTCH_MSG"].replaceAll(this.KEYWORD,'<mark>'+this.KEYWORD+'</mark>') : resData.data[i+1]["CHG_RCPTN_DSPTCH_MSG"])
                      : (this.HIGHLIGHT ? resData.data[i+1]["RCPTN_DSPTCH_MSG"].replaceAll(this.KEYWORD,'<mark>'+this.KEYWORD+'</mark>') : resData.data[i+1]["RCPTN_DSPTCH_MSG"]),
                    CHAT_DATE: chatDate,
                    BFR_CHT: resData.header.BFR_CHT,
                    AFTR_CHT: resData.header.AFTR_CHT,
                    QSTN_TYPE_NM: resData.data[i+1]["QSTN_TYPE_NM"],
                    QSTN_TYPE_MSG: resData.data[i+1]["QSTN_TYPE_MSG"],
                    QSTN_BTN_LIST: resData.data[i+1]["BTN_LIST"].split('||')
                  },
                )
                msgTypeCd = 'INFOMSG';
              } else if (resData.data[i]["MSG_TYPE_CD"] == 'QSTN' && msgTypeCd == 'INFOMSG') {
                chatLog.push(
                  {
                    TYPE: resData.data[i-1]["MSG_TYPE_CD"],
                    SNDRCV_CD: resData.data[i-1]["RCPTN_DSPTCH_CD"],
                    SNDRCV_NM: resData.data[i-1]["CD_NM"],
                    IMAGE_URL: resData.data[i-1]["RCPTN_DSPTCH_CD"] == 'SND' ? "/upload/" + resData.data[i-1]["RCPTN_DSPTCH_MSG"] : resData.data[i-1]["RCPTN_DSPTCH_MSG"],
                    CONTENT: this.FBDWD_YN == 'Y' && resData.data[i]["MSG_TYPE_CD"] != 'FI' && resData.data[i-1]["MSG_TYPE_CD"] != 'AU'
                      ? (this.HIGHLIGHT ? resData.data[i-1]["CHG_RCPTN_DSPTCH_MSG"].replaceAll(this.KEYWORD,'<mark>'+this.KEYWORD+'</mark>') : resData.data[i-1]["CHG_RCPTN_DSPTCH_MSG"])
                      : (this.HIGHLIGHT ? resData.data[i-1]["RCPTN_DSPTCH_MSG"].replaceAll(this.KEYWORD,'<mark>'+this.KEYWORD+'</mark>') : resData.data[i-1]["RCPTN_DSPTCH_MSG"]),
                    CHAT_DATE: chatDate,
                    BFR_CHT: resData.header.BFR_CHT,
                    AFTR_CHT: resData.header.AFTR_CHT,
                    QSTN_TYPE_NM: resData.data[i-1]["QSTN_TYPE_NM"],
                    QSTN_TYPE_MSG: resData.data[i-1]["QSTN_TYPE_MSG"],
                    QSTN_BTN_LIST: resData.data[i-1]["BTN_LIST"].split('||')
                  },
                )
                msgTypeCd = '';
              } else {
                chatLog.push(
                  {
                    TYPE: resData.data[i]["MSG_TYPE_CD"],
                    SNDRCV_CD: resData.data[i]["RCPTN_DSPTCH_CD"],
                    SNDRCV_NM: resData.data[i]["CD_NM"],
                    IMAGE_URL: resData.data[i]["RCPTN_DSPTCH_CD"] == 'SND' ? "/upload/" + resData.data[i]["RCPTN_DSPTCH_MSG"] : resData.data[i]["RCPTN_DSPTCH_MSG"],
                    //CONTENT: resData.data[i]["RCPTN_DSPTCH_MSG"],
                    CONTENT: this.FBDWD_YN == 'Y' && resData.data[i]["MSG_TYPE_CD"] != 'FI' && resData.data[i]["MSG_TYPE_CD"] != 'AU'
                      ? (this.HIGHLIGHT ? resData.data[i]["CHG_RCPTN_DSPTCH_MSG"].replaceAll(this.KEYWORD,'<mark>'+this.KEYWORD+'</mark>') : resData.data[i]["CHG_RCPTN_DSPTCH_MSG"])
                      : (this.HIGHLIGHT ? resData.data[i]["RCPTN_DSPTCH_MSG"].replaceAll(this.KEYWORD,'<mark>'+this.KEYWORD+'</mark>') : resData.data[i]["RCPTN_DSPTCH_MSG"]),
                    CHAT_DATE: chatDate,
                    BFR_CHT: resData.header.BFR_CHT,
                    AFTR_CHT: resData.header.AFTR_CHT,
                    QSTN_TYPE_NM: resData.data[i]["QSTN_TYPE_NM"],
                    QSTN_TYPE_MSG: resData.data[i]["QSTN_TYPE_MSG"],
                    QSTN_BTN_LIST: resData.data[i]["BTN_LIST"].split('||'),
                    LNK_INFO: resData.data[i]["LNK_INFO"]
                  },
                )
              }
              if(i==leng-1){
                if(chat == 'BFR'){
                  //이전채팅 구분선
                  if(resData.data[i]["MSG_TYPE_CD"] == 'INFOMSG' && msgTypeCd != 'INFOMSG'){
                    chatLog.push(
                      {
                        TYPE: 'CHT_SE',
                        SNDRCV_CD: resData.data[i+1]["RCPTN_DSPTCH_CD"],
                        SNDRCV_NM: resData.data[i+1]["CD_NM"],
                        IMAGE_URL: resData.data[i+1]["RCPTN_DSPTCH_CD"] == 'SND' ? "/upload/" + resData.data[i+1]["RCPTN_DSPTCH_MSG"] : resData.data[i+1]["RCPTN_DSPTCH_MSG"],
                        CONTENT: '----- 이전채팅 구분 -----',
                        CHAT_DATE: chatDate,
                        BFR_CHT: resData.header.BFR_CHT,
                        AFTR_CHT: resData.header.AFTR_CHT,
                        QSTN_TYPE_NM: resData.data[i+1]["QSTN_TYPE_NM"],
                        QSTN_TYPE_MSG: resData.data[i+1]["QSTN_TYPE_MSG"],
                        QSTN_BTN_LIST: resData.data[i+1]["BTN_LIST"].split('||')
                      }
                    )
                    msgTypeCd = 'INFOMSG';
                  } else if (resData.data[i]["MSG_TYPE_CD"] == 'QSTN' && msgTypeCd == 'INFOMSG') {
                    chatLog.push(
                      {
                        TYPE: 'CHT_SE',
                        SNDRCV_CD: resData.data[i-1]["RCPTN_DSPTCH_CD"],
                        SNDRCV_NM: resData.data[i-1]["CD_NM"],
                        IMAGE_URL: resData.data[i-1]["RCPTN_DSPTCH_CD"] == 'SND' ? "/upload/" + resData.data[i-1]["RCPTN_DSPTCH_MSG"] : resData.data[i-1]["RCPTN_DSPTCH_MSG"],
                        CONTENT: '----- 이전채팅 구분 -----',
                        CHAT_DATE: chatDate,
                        BFR_CHT: resData.header.BFR_CHT,
                        AFTR_CHT: resData.header.AFTR_CHT,
                        QSTN_TYPE_NM: resData.data[i-1]["QSTN_TYPE_NM"],
                        QSTN_TYPE_MSG: resData.data[i-1]["QSTN_TYPE_MSG"],
                        QSTN_BTN_LIST: resData.data[i-1]["BTN_LIST"].split('||')
                      }
                    )
                    msgTypeCd = '';
                  } else{
                    chatLog.push(
                      {
                        TYPE: 'CHT_SE',
                        SNDRCV_CD: resData.data[i]["RCPTN_DSPTCH_CD"],
                        SNDRCV_NM: resData.data[i]["CD_NM"],
                        IMAGE_URL: resData.data[i]["RCPTN_DSPTCH_CD"] == 'SND' ? "/upload/" + resData.data[i]["RCPTN_DSPTCH_MSG"] : resData.data[i]["RCPTN_DSPTCH_MSG"],
                        //CONTENT: resData.data[i]["RCPTN_DSPTCH_MSG"],
                        CONTENT: '----- 이전채팅 구분 -----',
                        CHAT_DATE: chatDate,
                        BFR_CHT: resData.header.BFR_CHT,
                        AFTR_CHT: resData.header.AFTR_CHT,
                        QSTN_TYPE_NM: resData.data[i]["QSTN_TYPE_NM"],
                        QSTN_TYPE_MSG: resData.data[i]["QSTN_TYPE_MSG"],
                        QSTN_BTN_LIST: resData.data[i]["BTN_LIST"].split('||'),
                        LNK_INFO: resData.data[i]["LNK_INFO"]
                      }
                    )
                  }
                } else if (chat == 'AFTR'){
                  chatLog.unshift(
                  {
                    TYPE: 'CHT_SE',
                    SNDRCV_CD: resData.data[i]["RCPTN_DSPTCH_CD"],
                    SNDRCV_NM: resData.data[i]["CD_NM"],
                    IMAGE_URL: resData.data[i]["RCPTN_DSPTCH_CD"] == 'SND' ? "/upload/" + resData.data[i]["RCPTN_DSPTCH_MSG"] : resData.data[i]["RCPTN_DSPTCH_MSG"],
                    //CONTENT: resData.data[i]["RCPTN_DSPTCH_MSG"],
                    CONTENT: '----- 이후채팅 구분 -----',
                    CHAT_DATE: chatDate,
                    BFR_CHT: resData.header.BFR_CHT,
                    AFTR_CHT: resData.header.AFTR_CHT,
                  })
                }
              }
            } else {
              if(resData.data[i]["MSG_TYPE_CD"] != 'QSTN'){
                chatLog.push(
                  {
                    TYPE: resData.data[i]["MSG_TYPE_CD"],
                    SNDRCV_CD: resData.data[i]["RCPTN_DSPTCH_CD"],
                    SNDRCV_NM: resData.data[i]["CD_NM"],
                    IMAGE_URL: resData.data[i]["RCPTN_DSPTCH_CD"] == 'SND' ? "/upload/" + resData.data[i]["RCPTN_DSPTCH_MSG"] : resData.data[i]["RCPTN_DSPTCH_MSG"],
                    //CONTENT: resData.data[i]["RCPTN_DSPTCH_MSG"],
                    CONTENT: this.FBDWD_YN == 'Y' && resData.data[i]["MSG_TYPE_CD"] != 'FI' && resData.data[i]["MSG_TYPE_CD"] != 'AU'
                      ? (this.HIGHLIGHT ? resData.data[i]["CHG_RCPTN_DSPTCH_MSG"].replaceAll(this.KEYWORD,'<mark>'+this.KEYWORD+'</mark>') : resData.data[i]["CHG_RCPTN_DSPTCH_MSG"])
                      : (this.HIGHLIGHT ? resData.data[i]["RCPTN_DSPTCH_MSG"].replaceAll(this.KEYWORD,'<mark>'+this.KEYWORD+'</mark>') : resData.data[i]["RCPTN_DSPTCH_MSG"]),
                    CHAT_DATE: chatDate,
                    BFR_CHT: resData.header.BFR_CHT,
                    AFTR_CHT: resData.header.AFTR_CHT,
                    LNK_INFO: resData.data[i]["LNK_INFO"]
                  },
                )
                if(i==leng-1){
                  if(chat == 'BFR'){
                    //이전채팅 구분선
                    chatLog.push(
                    {
                      TYPE: 'CHT_SE',
                      SNDRCV_CD: resData.data[i]["RCPTN_DSPTCH_CD"],
                      SNDRCV_NM: resData.data[i]["CD_NM"],
                      IMAGE_URL: resData.data[i]["RCPTN_DSPTCH_CD"] == 'SND' ? "/upload/" + resData.data[i]["RCPTN_DSPTCH_MSG"] : resData.data[i]["RCPTN_DSPTCH_MSG"],
                      //CONTENT: resData.data[i]["RCPTN_DSPTCH_MSG"],
                      CONTENT: '----- 이전채팅 구분 -----',
                      CHAT_DATE: chatDate,
                      BFR_CHT: resData.header.BFR_CHT,
                      AFTR_CHT: resData.header.AFTR_CHT
                    })
                  } else if (chat == 'AFTR'){
                    chatLog.unshift(
                    {
                      TYPE: 'CHT_SE',
                      SNDRCV_CD: resData.data[i]["RCPTN_DSPTCH_CD"],
                      SNDRCV_NM: resData.data[i]["CD_NM"],
                      IMAGE_URL: resData.data[i]["RCPTN_DSPTCH_CD"] == 'SND' ? "/upload/" + resData.data[i]["RCPTN_DSPTCH_MSG"] : resData.data[i]["RCPTN_DSPTCH_MSG"],
                      //CONTENT: resData.data[i]["RCPTN_DSPTCH_MSG"],
                      CONTENT: '----- 이후채팅 구분 -----',
                      CHAT_DATE: chatDate,
                      BFR_CHT: resData.header.BFR_CHT,
                      AFTR_CHT: resData.header.AFTR_CHT,
                    })
                  }
                }
              }
            }
          }
          if(chat == 'BFR'){
            for(let n=0;n<nowChat.length;n++){
              chatLog.push(nowChat[n]);
            }
            // this.CHAT_LOG = chatLog;
            this.BFR_CHAT_LOG = chatLog;

          } else {
            for(let n=0;n<chatLog.length;n++){
              nowChat.push(chatLog[n]);
            }
            this.CHAT_LOG = nowChat;
          }
        } else {
          if(this.CHAT_DATA.CUTT_STTS_CD == 'TRAN_WAIT'|| this.CHAT_DATA.CUTT_STTS_CD == 'WAIT'|| this.CHAT_DATA.CUTT_STTS_CD == 'CLBK_WAIT'){ //전달,대기,콜백건 클릭 시
            this.CHAT_DATA.CUTT_STTS_CD = 'ING';
            this.CHAT_DATA.STTS_CD = 'cs';
            this.CHAT_DATA.CUTT_STTS_CD_NM = '상담중';

            this.CHAT_STAT = this.CHAT_DATA.CUTT_STTS_CD
            // this.CHAT_OFF_LIST = [
            //   { text: "상담종료", active: 'slideChatOff', icon: 'chat-off'},
            //   { text: "임시저장", active: 'slideChatTemp', icon: 'chat-temp'},
            // ]
          } else if(this.CHAT_DATA.CUTT_STTS_CD == 'ING'){
            this.CHAT_STAT = this.CHAT_DATA.CUTT_STTS_CD
            // this.CHAT_OFF_LIST = [
            //   { text: "상담종료", active: 'slideChatOff', icon: 'chat-off'},
            //   { text: "임시저장", active: 'slideChatTemp', icon: 'chat-temp'},
            // ]
          } else {
            this.CHAT_STAT = this.CHAT_DATA.CUTT_STTS_CD
            // this.CHAT_OFF_LIST = [
            //   { text: "상담저장", active: 'slideChatSave', icon: 'chat-save'},
            // ]
          }

          if(chat == 'ING'){
            let nowChat = this.CHAT_LOG;
            let leng = nowChat.length
            let nowChatCnt = 0
            for(let i=0;i<leng;i++){
              if(nowChat[i].BFR_CHT == resData.header.BFR_CHT){
                nowChatCnt = nowChatCnt+1;
              }
            }
            let inChat = [];
            let lengIn = resData.data.length;
            for(let n=0;n<lengIn;n++){
              let chatDate = this.mixin_convertDate(resData.data[n]["REG_DT"], 'yyyy-MM-dd HH:mm:ss')
              if(this.SHOW_QSTN == 'Y'){
                if(resData.data[n]["MSG_TYPE_CD"] != 'EMAIL' && resData.data[n]["MSG_TYPE_CD"] != 'BBS'){
                  if(resData.data[n]["MSG_TYPE_CD"] == 'INFOMSG' && msgTypeCd != 'INFOMSG'){
                    inChat.push(
                      {
                        TYPE: resData.data[n+1]["MSG_TYPE_CD"],
                        SNDRCV_CD: resData.data[n+1]["RCPTN_DSPTCH_CD"],
                        SNDRCV_NM: resData.data[n+1]["CD_NM"],
                        IMAGE_URL: resData.data[n+1]["RCPTN_DSPTCH_CD"] == 'SND' ? "/upload/" + resData.data[n+1]["RCPTN_DSPTCH_MSG"] : resData.data[n+1]["RCPTN_DSPTCH_MSG"],
                        CONTENT: this.FBDWD_YN == 'Y'
                          ? (this.HIGHLIGHT ? resData.data[n+1]["CHG_RCPTN_DSPTCH_MSG"].replaceAll(this.KEYWORD,'<mark>'+this.KEYWORD+'</mark>') : resData.data[n+1]["CHG_RCPTN_DSPTCH_MSG"])
                          : (this.HIGHLIGHT ? resData.data[n+1]["RCPTN_DSPTCH_MSG"].replaceAll(this.KEYWORD,'<mark>'+this.KEYWORD+'</mark>') : resData.data[n+1]["RCPTN_DSPTCH_MSG"]),
                        CHAT_DATE: chatDate,
                        BFR_CHT: resData.header.BFR_CHT,
                        AFTR_CHT: resData.header.AFTR_CHT,
                        QSTN_TYPE_NM: resData.data[n+1]["QSTN_TYPE_NM"],
                        QSTN_TYPE_MSG: resData.data[n+1]["QSTN_TYPE_MSG"],
                        QSTN_BTN_LIST: resData.data[n+1]["BTN_LIST"].split('||')
                      },
                    )
                    msgTypeCd = 'INFOMSG';
                  } else if(resData.data[n]["MSG_TYPE_CD"] == 'QSTN' && msgTypeCd == 'INFOMSG'){
                    inChat.push(
                      {
                        TYPE: resData.data[n-1]["MSG_TYPE_CD"],
                        SNDRCV_CD: resData.data[n-1]["RCPTN_DSPTCH_CD"],
                        SNDRCV_NM: resData.data[n-1]["CD_NM"],
                        IMAGE_URL: resData.data[n-1]["RCPTN_DSPTCH_CD"] == 'SND' ? "/upload/" + resData.data[n-1]["RCPTN_DSPTCH_MSG"] : resData.data[n-1]["RCPTN_DSPTCH_MSG"],
                        CONTENT: this.FBDWD_YN == 'Y'
                          ? (this.HIGHLIGHT ? resData.data[n-1]["CHG_RCPTN_DSPTCH_MSG"].replaceAll(this.KEYWORD,'<mark>'+this.KEYWORD+'</mark>') : resData.data[n-1]["CHG_RCPTN_DSPTCH_MSG"])
                          : (this.HIGHLIGHT ? resData.data[n-1]["RCPTN_DSPTCH_MSG"].replaceAll(this.KEYWORD,'<mark>'+this.KEYWORD+'</mark>') : resData.data[n-1]["RCPTN_DSPTCH_MSG"]),
                        CHAT_DATE: chatDate,
                        BFR_CHT: resData.header.BFR_CHT,
                        AFTR_CHT: resData.header.AFTR_CHT,
                        QSTN_TYPE_NM: resData.data[n-1]["QSTN_TYPE_NM"],
                        QSTN_TYPE_MSG: resData.data[n-1]["QSTN_TYPE_MSG"],
                        QSTN_BTN_LIST: resData.data[n-1]["BTN_LIST"].split('||')
                      },
                    )
                    msgTypeCd = '';
                  } else {
                    inChat.push(
                      {
                        TYPE: resData.data[n]["MSG_TYPE_CD"],
                        SNDRCV_CD: resData.data[n]["RCPTN_DSPTCH_CD"],
                        SNDRCV_NM: resData.data[n]["CD_NM"],
                        IMAGE_URL: resData.data[n]["RCPTN_DSPTCH_CD"] == 'SND' ? "/upload/" + resData.data[n]["RCPTN_DSPTCH_MSG"] : resData.data[n]["RCPTN_DSPTCH_MSG"],
                        CONTENT: this.FBDWD_YN == 'Y'
                          ? (this.HIGHLIGHT ? resData.data[n]["CHG_RCPTN_DSPTCH_MSG"].replaceAll(this.KEYWORD,'<mark>'+this.KEYWORD+'</mark>') : resData.data[n]["CHG_RCPTN_DSPTCH_MSG"])
                          : (this.HIGHLIGHT ? resData.data[n]["RCPTN_DSPTCH_MSG"].replaceAll(this.KEYWORD,'<mark>'+this.KEYWORD+'</mark>') : resData.data[n]["RCPTN_DSPTCH_MSG"]),
                        CHAT_DATE: chatDate,
                        BFR_CHT: resData.header.BFR_CHT,
                        AFTR_CHT: resData.header.AFTR_CHT,
                        QSTN_TYPE_NM: resData.data[n]["QSTN_TYPE_NM"],
                        QSTN_TYPE_MSG: resData.data[n]["QSTN_TYPE_MSG"],
                        QSTN_BTN_LIST: resData.data[n]["BTN_LIST"].split('||'),
                        LNK_INFO: resData.data[n]["LNK_INFO"]
                      },
                    )
                  }
                } else if(resData.data[n]["MSG_TYPE_CD"] == 'EMAIL') {
                  this.changeEmailCuttMode(resData.data[n]);
                } else if(resData.data[n]["MSG_TYPE_CD"] == 'BBS') {
                  this.changeBbsCuttMode(resData.data[n]);
                }
              } else {
                if(resData.data[n]["MSG_TYPE_CD"] != 'QSTN' && resData.data[n]["MSG_TYPE_CD"] != 'EMAIL' && resData.data[n]["MSG_TYPE_CD"] != 'BBS'){
                  inChat.push(
                    {
                      TYPE: resData.data[n]["MSG_TYPE_CD"],
                      SNDRCV_CD: resData.data[n]["RCPTN_DSPTCH_CD"],
                      SNDRCV_NM: resData.data[n]["CD_NM"],
                      IMAGE_URL: resData.data[n]["RCPTN_DSPTCH_CD"] == 'SND' ? "/upload/" + resData.data[n]["RCPTN_DSPTCH_MSG"] : resData.data[n]["RCPTN_DSPTCH_MSG"],
                      //CONTENT: resData.data[n]["RCPTN_DSPTCH_MSG"],
                      CONTENT: this.FBDWD_YN == 'Y'
                        ? (this.HIGHLIGHT ? resData.data[n]["CHG_RCPTN_DSPTCH_MSG"].replaceAll(this.KEYWORD,'<mark>'+this.KEYWORD+'</mark>') : resData.data[n]["CHG_RCPTN_DSPTCH_MSG"])
                        : (this.HIGHLIGHT ? resData.data[n]["RCPTN_DSPTCH_MSG"].replaceAll(this.KEYWORD,'<mark>'+this.KEYWORD+'</mark>') : resData.data[n]["RCPTN_DSPTCH_MSG"]),
                      CHAT_DATE: chatDate,
                      BFR_CHT: resData.header.BFR_CHT,
                      AFTR_CHT: resData.header.AFTR_CHT,
                      LNK_INFO: resData.data[n]["LNK_INFO"]
                    },
                  )
                } else if(resData.data[n]["MSG_TYPE_CD"] == 'EMAIL') {
                  this.changeEmailCuttMode(resData.data[n]);
                } else if(resData.data[n]["MSG_TYPE_CD"] == 'BBS') {
                  this.changeBbsCuttMode(resData.data[n]);
                }
              }
            }
            let lengAdd = inChat.length
            for(let j=nowChatCnt;j<lengAdd;j++){
              this.CHAT_LOG.push(inChat[j]);
            }
          } else {
            this.CHAT_LOG = [];
            this.BFR_CHAT_LOG = [];
            let leng = resData.data.length;
            for(let i=0;i<leng;i++){
              let chatDate = this.mixin_convertDate(resData.data[i]["REG_DT"], 'yyyy-MM-dd HH:mm:ss')
              if(this.SHOW_QSTN == 'Y'){
                if(resData.data[i]["MSG_TYPE_CD"] != 'EMAIL' && resData.data[i]["MSG_TYPE_CD"] != 'BBS'){
                  if(resData.data[i]["MSG_TYPE_CD"] == 'INFOMSG' && msgTypeCd != 'INFOMSG'){
                    this.CHAT_LOG.push(
                      {
                        TYPE: resData.data[i+1]["MSG_TYPE_CD"],
                        SNDRCV_CD: resData.data[i+1]["RCPTN_DSPTCH_CD"],
                        SNDRCV_NM: resData.data[i+1]["CD_NM"],
                        IMAGE_URL: resData.data[i+1]["RCPTN_DSPTCH_CD"] == 'SND' ? "/upload/" + resData.data[i+1]["RCPTN_DSPTCH_MSG"] : resData.data[i+1]["RCPTN_DSPTCH_MSG"],
                        CONTENT: this.FBDWD_YN == 'Y'
                          ? (this.HIGHLIGHT ? resData.data[i+1]["CHG_RCPTN_DSPTCH_MSG"].replaceAll(this.KEYWORD,'<mark>'+this.KEYWORD+'</mark>') : resData.data[i+1]["CHG_RCPTN_DSPTCH_MSG"])
                          : (this.HIGHLIGHT ? resData.data[i+1]["RCPTN_DSPTCH_MSG"].replaceAll(this.KEYWORD,'<mark>'+this.KEYWORD+'</mark>') : resData.data[i+1]["RCPTN_DSPTCH_MSG"]),
                        CHAT_DATE: chatDate,
                        BFR_CHT: resData.header.BFR_CHT,
                        AFTR_CHT: resData.header.AFTR_CHT,
                        QSTN_TYPE_NM: resData.data[i+1]["QSTN_TYPE_NM"],
                        QSTN_TYPE_MSG: resData.data[i+1]["QSTN_TYPE_MSG"],
                        QSTN_BTN_LIST: resData.data[i+1]["BTN_LIST"].split('||')
                      },
                    )
                    msgTypeCd = 'INFOMSG';
                  } else if (resData.data[i]["MSG_TYPE_CD"] == 'QSTN' && msgTypeCd == 'INFOMSG') {
                    this.CHAT_LOG.push(
                      {
                        TYPE: resData.data[i-1]["MSG_TYPE_CD"],
                        SNDRCV_CD: resData.data[i-1]["RCPTN_DSPTCH_CD"],
                        SNDRCV_NM: resData.data[i-1]["CD_NM"],
                        IMAGE_URL: resData.data[i-1]["RCPTN_DSPTCH_CD"] == 'SND' ? "/upload/" + resData.data[i-1]["RCPTN_DSPTCH_MSG"] : resData.data[i-1]["RCPTN_DSPTCH_MSG"],
                        CONTENT: this.FBDWD_YN == 'Y'
                          ? (this.HIGHLIGHT ? resData.data[i-1]["CHG_RCPTN_DSPTCH_MSG"].replaceAll(this.KEYWORD,'<mark>'+this.KEYWORD+'</mark>') : resData.data[i-1]["CHG_RCPTN_DSPTCH_MSG"])
                          : (this.HIGHLIGHT ? resData.data[i-1]["RCPTN_DSPTCH_MSG"].replaceAll(this.KEYWORD,'<mark>'+this.KEYWORD+'</mark>') : resData.data[i-1]["RCPTN_DSPTCH_MSG"]),
                        CHAT_DATE: chatDate,
                        BFR_CHT: resData.header.BFR_CHT,
                        AFTR_CHT: resData.header.AFTR_CHT,
                        QSTN_TYPE_NM: resData.data[i-1]["QSTN_TYPE_NM"],
                        QSTN_TYPE_MSG: resData.data[i-1]["QSTN_TYPE_MSG"],
                        QSTN_BTN_LIST: resData.data[i-1]["BTN_LIST"].split('||')
                      },
                    )
                    msgTypeCd = '';
                  } else {
                    this.CHAT_LOG.push(
                      {
                        TYPE: resData.data[i]["MSG_TYPE_CD"],
                        SNDRCV_CD: resData.data[i]["RCPTN_DSPTCH_CD"],
                        SNDRCV_NM: resData.data[i]["CD_NM"],
                        IMAGE_URL: resData.data[i]["RCPTN_DSPTCH_CD"] == 'SND' ? "/upload/" + resData.data[i]["RCPTN_DSPTCH_MSG"] : resData.data[i]["RCPTN_DSPTCH_MSG"],
                        CONTENT: this.FBDWD_YN == 'Y'
                          ? (this.HIGHLIGHT ? resData.data[i]["CHG_RCPTN_DSPTCH_MSG"].replaceAll(this.KEYWORD,'<mark>'+this.KEYWORD+'</mark>') : resData.data[i]["CHG_RCPTN_DSPTCH_MSG"])
                          : (this.HIGHLIGHT ? resData.data[i]["RCPTN_DSPTCH_MSG"].replaceAll(this.KEYWORD,'<mark>'+this.KEYWORD+'</mark>') : resData.data[i]["RCPTN_DSPTCH_MSG"]),
                        CHAT_DATE: chatDate,
                        BFR_CHT: resData.header.BFR_CHT,
                        AFTR_CHT: resData.header.AFTR_CHT,
                        QSTN_TYPE_NM: resData.data[i]["QSTN_TYPE_NM"],
                        QSTN_TYPE_MSG: resData.data[i]["QSTN_TYPE_MSG"],
                        QSTN_BTN_LIST: resData.data[i]["BTN_LIST"].split('||'),
                        LNK_INFO: resData.data[i]["LNK_INFO"]
                      },
                    )
                  }
                } else if(resData.data[i]["MSG_TYPE_CD"] == 'EMAIL') {
                  this.changeEmailCuttMode(resData.data[i]);
                } else if(resData.data[i]["MSG_TYPE_CD"] == 'BBS') {
                  this.changeBbsCuttMode(resData.data[i]);
                }
              } else {
                if(resData.data[i]["MSG_TYPE_CD"] != 'QSTN' && resData.data[i]["MSG_TYPE_CD"] != 'EMAIL'&& resData.data[i]["MSG_TYPE_CD"] != 'BBS'){
                  this.CHAT_LOG.push(
                    {
                      TYPE: resData.data[i]["MSG_TYPE_CD"],
                      SNDRCV_CD: resData.data[i]["RCPTN_DSPTCH_CD"],
                      SNDRCV_NM: resData.data[i]["CD_NM"],
                      IMAGE_URL: resData.data[i]["RCPTN_DSPTCH_CD"] == 'SND' ? "/upload/" + resData.data[i]["RCPTN_DSPTCH_MSG"] : resData.data[i]["RCPTN_DSPTCH_MSG"],
                      //CONTENT: resData.data[i]["RCPTN_DSPTCH_MSG"],
                      CONTENT: this.FBDWD_YN == 'Y'
                        ? (this.HIGHLIGHT ? resData.data[i]["CHG_RCPTN_DSPTCH_MSG"].replaceAll(this.KEYWORD,'<mark>'+this.KEYWORD+'</mark>') : resData.data[i]["CHG_RCPTN_DSPTCH_MSG"])
                        : (this.HIGHLIGHT ? resData.data[i]["RCPTN_DSPTCH_MSG"].replaceAll(this.KEYWORD,'<mark>'+this.KEYWORD+'</mark>') : resData.data[i]["RCPTN_DSPTCH_MSG"]),
                      CHAT_DATE: chatDate,
                      BFR_CHT: resData.header.BFR_CHT,
                      AFTR_CHT: resData.header.AFTR_CHT,
                      LNK_INFO: resData.data[i]["LNK_INFO"]
                    },
                  )
                } else if(resData.data[i]["MSG_TYPE_CD"] == 'EMAIL') {
                  this.changeEmailCuttMode(resData.data[i]);
                }else if(resData.data[i]["MSG_TYPE_CD"] == 'BBS') {
                  this.changeBbsCuttMode(resData.data[i]);
                }
              }
            }
          }

          this.BFR_CHT_PROP = false;
        }
      }
    },

    //시스템 메시지 발송, 미발송
    async sysMsgOnOff(){
      let chatStat = this.$store.getters["userStore/GE_CHAT_STAT"];
      if(chatStat == 'CANT_CHAT' || chatStat == 'CHT_CANT' || chatStat == null || chatStat == undefined){
        this.showAlert(this.MESSAGE.ALERT.CANT_CHAT);
        //스위치가 다시 되돌아오지 않음
        setTimeout(() => {
          this.SYSTEM_MSG_STAT = !this.SYSTEM_MSG_STAT;
        }, 1 * 10); // 1밀리초
        return;
      }
      let MSGSKIP_YN = "";
      if (this.CHAT_DATA.SYS_MSG_SKIP_YN == 'N') {
        MSGSKIP_YN = "Y";
        this.SYSTEM_MSG_STAT = true;
      } else {
        MSGSKIP_YN = "N";
        this.SYSTEM_MSG_STAT = false;
      }
      let sUrl = '/chat-api/main/un-rspns-mssage-sndng-setup/process';
      let postParam = {
        CHT_CUTT_ID: this.CHAT_DATA.CHT_CUTT_ID,
        SYS_MSG_SKIP_YN: MSGSKIP_YN,
        RCPTN_DSPTCH_MSG: MSGSKIP_YN == "N" ? this.MESSAGE.ALERT.SYS_MSG_OFF_SUCCESS_TOAST.msg : this.MESSAGE.ALERT.SYS_MSG_ON_SUCCESS_TOAST.msg
      }
      let headParam = {
        head: {
        }
      }

      let resData = await this.chat_postCall(sUrl, postParam, headParam)
      if(!resData.header.ERROR_FLAG){
        this.CHAT_DATA.SYS_MSG_SKIP_YN = MSGSKIP_YN;
        if(MSGSKIP_YN == 'N'){
          this.showToast(this.MESSAGE.ALERT.SYS_MSG_OFF_SUCCESS_TOAST);
        } else {
          this.showToast(this.MESSAGE.ALERT.SYS_MSG_ON_SUCCESS_TOAST);
        }
        this.$eventBus.chtListSrch();
        this.chatHstSrch();
      }

    },

    //상담 대기상담사 조회(전달 상담사 조회)
    async tranUserSrch(){
      if(!this.CHT_TRAN){
        this.CHT_TRAN = true;
      } else {
        this.CHT_TRAN = false;
        return;
      }
      let sUrl = '/chat-api/common-vue/chaton-agents/list';
      let postParam = {
        CHN_CLSF_CD : this.CHAT_DATA.CHN_CLSF_CD
      }
      let headParam = {
        head: {
        }
      }

      let resData = await this.chat_postCall(sUrl, postParam, headParam)
      if(resData.code == '0'){
        for(let i=0;i<resData.data.length;i++){
          this.TRAN_USER_LIST[i]["text"] = resData.data[i].DEPT_NM + '/' + resData.data[i].USER_NM
          this.TRAN_USER_LIST[i]["value"] = resData.data[i].USER_ID
        }
      } else {
        this.showAlert(this.MESSAGE.ALERT.ERROR);
      }
    },

    //채팅 전달
    async chatTran(){
      //전달컴포넌트와 저장 컴포넌트 공통이기때문에 필수값 체크에서 겹치는 문제발생
      //validateRules미사용
      if(this.TRAN_USER == ''){
        this.$store.commit("alertStore/hideAlert");
        this.showAlert(this.MESSAGE.ALERT.EMPTY_TRAN_USER);
        return;
      }

      let sUrl = '/api/stomp/chat/agent/forwarding';
      let postParam = {
        CHT_CUTT_ID:this.CHAT_DATA.CHT_CUTT_ID,
        TRAN_USER: this.TRAN_USER,
        CLBK_YN: 'N',
        CLBK_YMD: '',
        CLBK_BGNG_DT: '',
        PRCS_RSLT_CD: "CMPL_TRAN",      //처리상태(전달 후 해당 상담 상태)
        CUTT_STTS_CD: "TRAN_WAIT",       //상담상태(전달 후 전달된 상담 상태)
        CUTT_TYPE_ID: this.CUTT_TYPE_ID,
        CUST_ID: this.CHAT_DATA.CUST_ID,
        CUST_NM: this.CHAT_DATA.CUST_NM,
        CUTT_CN: '',
        CHT_USER_KEY: this.CHAT_DATA.CHT_USER_KEY
      }
      let headParam = {
        head: {
        }
      }

      let resData = await this.chat_postCall(sUrl, postParam, headParam)
      if(resData.code == '0'){
        this.CHAT_DATA.CUTT_STTS_CD = 'CMPL_TRAN'
        this.CHT_TRAN = false;
        this.closeMsg();
        this.showToast(this.MESSAGE.TOAST.TRAN_SUCCESS);

        this.$eventBus.chtListSrch();
        this.chatHstSrch();
      } else {
        this.showAlert(this.MESSAGE.ALERT.ERROR);
      }
    },

    //고객정보 조회
    searchCust(){
      this.$eventBus.$emit("searchCustInfo",this.CHAT_DATA.CHT_USER_KEY.split('_')[1],this.CHAT_DATA.CHT_USER_KEY,this.CHAT_DATA.CHN_CLSF_CD,this.CHAT_DATA.CHT_CUTT_ID);
    },

    //고객채팅내역
    async selectChtHstry(){
      let sUrl = '/api/biz/common/select';
      let postParam = {
        CUST_ID: this.CHAT_DATA.CUST_ID
      }
      let headParam = {
        head: {
          ns : 'palette3.chat.main.dao.ChatMainMapper'
          , sn : 'selectCustChtHstry'
        }
      }

      let resData = await this.common_postCall(sUrl,postParam,headParam)
      if(!resData.HEADER.ERROR_FLAG){
        this.CUST_CHT_HSTRY = resData.DATA;
        let leng = resData.DATA.length
        this.TOT_CHT_CNT = leng;
        for(let i=0;i<leng;i++){
          if(resData.DATA[i].CHT_CUTT_ID == this.NOW_CHAT){
            this.NOW_CHT_CNT = i+1;
          }
        }
      }
    },

    //이전채팅,다음채팅 내역역
    chtHstry(view){
      let nowChtCnt = this.NOW_CHT_CNT;
      if(view == 'next'){
        nowChtCnt = nowChtCnt-1
        this.CHAT_DATA.CHT_CUTT_ID = this.CUST_CHT_HSTRY[nowChtCnt].CHT_CUTT_ID;
        this.chatHstSrch();
      } else if(view == 'before'){
        nowChtCnt = nowChtCnt+1
        this.CHAT_DATA.CHT_CUTT_ID = this.CUST_CHT_HSTRY[nowChtCnt].CHT_CUTT_ID;
        this.chatHstSrch();
      } else {
        this.CHAT_DATA.CHT_CUTT_ID = this.NOW_CHAT;
        this.chatHstSrch();
      }
      this.NOW_CHT_CNT = nowChtCnt;
    }
  },
  mounted() {
    this.$eventBus.chtListSrch();
  },
  async created() {
    this.FBDWD_YN = await this.mixin_getChtStng('PROHIBITE_APPLY_YN');
    this.SHOW_QSTN = await this.mixin_getChtStng('INQRY_SHOW_YN');

    /**
     * 채팅 메시지 전송
     */
    this.$eventBus.$on("userchatMessage", (message) => {
      this.$store.dispatch("messages/AC_USER_CHAT_MESSAGE", message);
      //chatStore.userchatMessage(message);
    });

    /**
     * 채팅 내역 조회
     * clickChat : 컴포넌트로 클릭하기 전 채팅의 id가 남아있어 따로 클릭한 채팅의 id를 넘겨줘야함
     */
    this.$eventBus.$on("chatHstSrch", (chat,clickChat) => {
      if(clickChat.CHT_CUTT_ID != this.PropData.CHT_CUTT_ID){
        this.CHAT_DATA = clickChat;
      }
      this.chatHstSrch(chat);
    });

    this.CHAT_DATA = this.PropData;
    this.NOW_CHAT = this.PropData.CHT_CUTT_ID;
    if(this.PropData){
      this.favToggle = this.PropData.BMK_YN == 'Y' ? true : false
      this.SYSTEM_MSG_STAT = this.PropData.SYS_MSG_SKIP_YN == 'N' ? false : true;
    }
    this.chatHstSrch();
  },
  computed: {
  },
  watch: {
    ChatStat(){
      this.CHAT_STAT = this.ChatStat;
    },
    PropData(){
      this.CHAT_DATA = this.PropData;
      
      this.favToggle = this.PropData.BMK_YN == 'Y' ? true : false
      this.SYSTEM_MSG_STAT = this.PropData.SYS_MSG_SKIP_YN == 'N' ? false : true;
    },
    favToggle(){
      this.aniFavorite( this.favToggle );
    },
  },
};
</script>

<style lang="scss" scoped>

</style>