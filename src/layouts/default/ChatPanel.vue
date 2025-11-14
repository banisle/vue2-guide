<template>
  <div class="pl-chat-panel">
    <!-- profile -->
    <div class="d-flex px-4 pt-4">
      <div style="flex: 0 0 60px">
        <img
          :src="PROFILE.img"
          :alt="PROFILE.name"
          style="width: 100%; max-height: 60px; border-radius: 50%;">
      </div>
      <div class="ml-4">
        <div style="font-size: 16px; font-weight: 700;">
          {{ PROFILE.name }} <span class="">{{ PROFILE.grade }}</span>
        </div>
        <div>{{ PROFILE.center }}</div>
        <div>{{ PROFILE.ip }} (내선 {{ PROFILE.inphone_num }})</div>
      </div>
    </div>
    <!-- chat stat -->
    <div class="is-mt-m px-4 ">
      <v-select
        class="pl-form type-middle is-auto type-arrow2"
        :items="mixin_common_code_get(COMM_CD_DROP_LIST, 'CHAT_ST')"
        v-model="USER_CHT_STAT"
        placeholder="채팅상태를 선택하세요."
        @change="setChatUserInfo()"
      >
        <template v-slot:selection="{ item }">
          <!-- 아이콘 명 on, off, hold로 나오게 -->
          <v-icon :class="`pl-chat-stat-${item.value == 'CHT_WAIT' ? 'on' : ( item.value == 'CHT_CANT' ? 'off' : 'hold')}`"></v-icon>
          <strong class="ml-2">{{ item.text }}</strong>
        </template>
      </v-select>
    </div>

    <!-- filter -->
    <div class="px-4 py-4 is-border-top is-mt-l">
      <div class="d-flex justify-space-between">
        <div
          @click="selectedFilterItem(item, index)"
          class="d-flex flex-column align-center"
          v-for="item,index in FILTER_LIST"
          :key="index">
          <span>{{ item.title }}</span>
          <strong
            :class="{ active: selectedFilterIndex === index }"
            class="pl-badge is-count mt-1 hover-bg font-decimal">
            {{ tabs2 == 0 ? item.cnt : item.bmk_cnt }}
          </strong>
        </div>
      </div>
    </div>

    <!-- tab -->
    <v-tabs v-model="tabs2" slider-size="2" class="pl-tabs is-trans">
      <CompoTabItems :TabsList=tabsList2 />
    </v-tabs>

    <!-- tab items -->
    <v-tabs-items v-model="tabs2">
      <CompoTabContent
        :TabsList=tabsList2
        :DataProp=CHAT_PROP />
    </v-tabs-items>

  </div>
</template>

<script>
import CompoTabItems from '@/components/CompoTabItems.vue';
import CompoTabContent from '@/components/CompoTabContent.vue';

import { stompUtil } from "@/store/stomp-util.js";
import { eventBus } from "@/store/eventBus.js";

let stomeReConnectCnt = 36;

export default {
  name: "ChatPanel", //name은 'MENU_' + 파일명 조합
  components: {
    CompoTabItems,
    CompoTabContent,
  },
  data() {
    return {
      //공통코드
      COMM_CD_USE_LIST:[],                //사용할 공통코드 리스트 ==> 변수명 이미 사용중이기 떄문에 변경해주었음 (COMM_CD_LIST->COMM_CD_USE_LIST)
      COMM_CD_DROP_LIST:[],               //공통코드로 생성된 드롭박스 리스트

      // 프로필
      PROFILE: {
        img: require('@/assets/img/@manager_profile.png'),
        name: '',
        grade: '',
        center: '',
        ip: '',
        inphone_num: '',
      },

      // 채널 선택
      USER_CHT_STAT: 'CHT_CANT',
    //   dropChatStat: [
    //     {text: '채팅 ON',  icon: 'chat'},
    //     {text: '채팅 OFF', icon: 'off'},
    //     {text: '배정중지', icon: 'init'},
    //   ],

      // 필터
      FILTER_LIST: [
        { title: '전체', cnt: 0, bmk_cnt: 0 },
        { title: '대기', cnt: 0, bmk_cnt: 0 },
        { title: '상담중', cnt: 0, bmk_cnt: 0 },
        { title: '완료', cnt: 0, bmk_cnt: 0 },
        { title: '후처리', cnt: 0, bmk_cnt: 0 },
      ],
      selectedFilterIndex: 0,

      // tabs
      tabs2: null,
      tabsList2: [
        { title: '채널 목록', content: 'CHATPANEL_TAB_01', badge: false},
        { title: '책갈피', content: 'CHATPANEL_TAB_02', badge: false},
      ],

      // 채널 리스트
      CH_DATA: {
        selectedFilterTitle: '전체',
        CH_ALL_LIST: [
        ],
        CH_WAIT_LIST: [
        ],
        CH_ING_LIST: [
        ],
        CH_CMPL_LIST: [
        ],
        CH_AFTPRCS_LIST: [
        ],
      },

      // 채널 리스트
      CH_BMK_DATA: {
        selectedFilterTitle: '전체',
        CH_ALL_LIST: [
        ],
        CH_WAIT_LIST: [
        ],
        CH_ING_LIST: [
        ],
        CH_CMPL_LIST: [
        ],
        CH_AFTPRCS_LIST: [
        ],
      },
      CHAT_PROP:{},

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
    selectedFilterItem(item, index) {
      this.selectedFilterIndex = index;

      let chat = {
        selectedFilterTitle:'',
        CH_LIST:[]
      }
      chat.selectedFilterTitle = item.title;
      switch (index) {
        case 0:
          if(this.tabs2 == 0 ){
            chat.CH_LIST = this.CH_DATA.CH_ALL_LIST
          } else if(this.tabs2 == 1){
            chat.CH_LIST = this.CH_BMK_DATA.CH_ALL_LIST
          }
          break;
        case 1:
          if(this.tabs2 == 0 ){
            chat.CH_LIST = this.CH_DATA.CH_WAIT_LIST
          } else if(this.tabs2 == 1){
            chat.CH_LIST = this.CH_BMK_DATA.CH_WAIT_LIST
          }
          break;
        case 2:
          if(this.tabs2 == 0 ){
            chat.CH_LIST = this.CH_DATA.CH_ING_LIST
          } else if(this.tabs2 == 1){
            chat.CH_LIST = this.CH_BMK_DATA.CH_ING_LIST
          }
          break;
        case 3:
          if(this.tabs2 == 0 ){
            chat.CH_LIST = this.CH_DATA.CH_CMPL_LIST
          } else if(this.tabs2 == 1){
            chat.CH_LIST = this.CH_BMK_DATA.CH_CMPL_LIST
          }
          break;
        default :
          if(this.tabs2 == 0 ){
            chat.CH_LIST = this.CH_DATA.CH_AFTPRCS_LIST
          } else if(this.tabs2 == 1){
            chat.CH_LIST = this.CH_BMK_DATA.CH_AFTPRCS_LIST
          }
      }
      this.CHAT_PROP = chat;
    },

    //챗 사용자정보 세팅 =>
    async setChatUserInfo() {
      let sUrl = '/api/stomp/chat/userinfo';
      let postParam = {
        USER_NM: this.$store.getters["userStore/GE_USER_ROLE"].userName
      }
      let headParam = {
        head: {
        }
      }
      let resData = await this.chat_postCall(sUrl, postParam, headParam)
      if(resData.error != "-999"){
        this.$store.state.messages.token = resData.token;
        this.$store.state.messages.userId = resData.id;
        this.$store.state.messages.userNm = resData.name;
        this.userChtStatChg();
      } else {
        this.showAlert(this.MESSAGE.ALERT.ERROR);
      }
    },

    //사용자 상담 상태 변경
    async userChtStatChg(){
      let sUrl = '/chat-api/main/cnslr-sttus/regist';
      let postParam = {
        USER_CHT_STAT: this.USER_CHT_STAT,
      }
      let headParam = {
        head: {
        }
      }

      let resData = await this.chat_postCall(sUrl, postParam, headParam);
      if(!resData.header.ERROR_FLAG){
        this.$store.commit("userStore/MU_CHAT_STAT",this.USER_CHT_STAT)
        if (this.USER_CHT_STAT == "CHT_WAIT") {
          if (stompUtil.isConnected()) {
            //이미 웹소켓이 연결되어있다면 그대로 사용
            this.showToast(this.MESSAGE.ALERT.CHT_WAIT);
            return;
          } else {
            this.connect(); // ready websocket 연결
            this.showToast(this.MESSAGE.ALERT.CHT_WAIT);
          }
        } else if (this.USER_CHT_STAT == "CHT_END") {
          if (stompUtil.isConnected()) {
            //이미 웹소켓이 연결되어있다면 그대로 사용
            this.showToast(this.MESSAGE.ALERT.CHT_END);
            return;
          } else {
            this.connect(); // ready websocket 연결
            this.showToast(this.MESSAGE.ALERT.CHT_END);
          }
        } else {
          // this.disconnect(); // ready websocket 연결
          this.showToast(this.MESSAGE.ALERT.CHT_CANT);
        }
      }
    },

    /**
     * websocket connect
     * @param connectCallback   연결 성공 콜백
     * @param errorCallback     연결 실패 콜백 ( 재연결 시도 )
     */
     connect() {
      let geUserId = this.$store.getters["userStore/GE_USER_ROLE"].userId;

      //const subScribeUrl = this.baseSocketUrl + "queue/ready/" + geUserId;                //"http://local.hkpalette.com:8443/queue/ready/"
      let subScribeUrl = "/queue/ready/" + geUserId;

      let chatMessage = {
        chatType: "READY",
        userId: geUserId,
        userName: geUserId,
        userNickname: geUserId,
      };

      stompUtil.token = this.$store.state.messages.token; //SOCKET 연결 시 사용자 SOCKET Token 세팅
      stompUtil.userId = geUserId;
      stompUtil.custcoId = this.$store.getters["userStore/GE_USER_ROLE"].company.CD;
      stompUtil.lgnId = this.$store.getters["userStore/GE_USER_ROLE"].lgnId;

      const chtListSrch = this.chtListSrch();

      stompUtil.connect(
        () => {
          console.log("con!");
          stomeReConnectCnt = 36;
          // 연결성공( 재연결 포함 )
          stompUtil.setConnected(true);
          stompUtil.subscribe(subScribeUrl, chatMessage); // ready uri sub
          chtListSrch;  //해당 function이 있어야 정상적인 실시간 웹소켓 연결 완료
        },
        (error) => {
          //연결실패
          console.log("discon?", error);
          if (error != null) {
            // console.log(error);
            stompUtil.setConnected(false);

            if( stomeReConnectCnt > 0 ) {  // 재연결 시도
              // 재연결 시도
              setTimeout(this.connect, 5000);
              --stomeReConnectCnt;
            }
          }
        }
      );
    },

    /**
     * 웹소켓 연결종료
     * Stomp / Socket-Io
     */
    disconnect() {
      if (stompUtil.isConnected()) {
        stompUtil.setConnected(false);
        stompUtil.disconnect();
      }
    },

    /**
     * ready callback 함수
     */
    readyCallback(message) {
      console.log("readyCallback message", message);
      if (typeof message.body !== "undefined") {
        let recvJson = JSON.parse(message.body);
        let data = JSON.parse(recvJson.telewebJsonString);
        let uri = message.headers.destination;
        if (
          recvJson.chatType == "READY" &&
          recvJson.chatEvent == "AGENT_READY"
        ) {
          let sessionId = recvJson.sessionId;
          this.$store.state.messages.simsessionId = sessionId;
        }

        //사용자 배정 시
        //고객정보요청
        //파라미터 부족
        if (recvJson.chatType == "READY" && recvJson.chatEvent == "READY_ALRAM") {
          for(let i=0;i<data.DATA.length;i++){
            //고객정보요청을 하지 않은 배정건에 고객 정보 요청
            //1. 카카오톡 상담
            //2. 고객정보요청을 하지 않은 상담
            //3. 배정완료(WAIT)상태인 상담
            if(data.DATA[i].CUST_INFO == '0' && data.DATA[i].CHN_TYPE_CD == 'KAKAO' && data.DATA[i].ALTMNT_STTS_CD == 'WAIT'){
              let MSG_INFO = {
                message_type : 'LI'
                , SNDRCV_CD: 'SND'
                , type : 'custInfo'
                , msg : '고객정보요청 메시지는 시스템 메시지에서 가져옴'
              };
              let CHAT_INFO = {
                SEND_USER_NM: this.$store.getters["userStore/GE_USER_ROLE"].userName,
                token: this.$store.state.messages.token,
                userId: this.$store.getters["userStore/GE_USER_ROLE"].userId,
                chtCuttId: data.DATA[i].CHT_CUTT_ID,
                sndrKey: data.DATA[i].SNDR_KEY,
                chnClsfCd: data.DATA[i].CHN_TYPE_CD,
                custcoId: data.DATA[i].CUSTCO_ID,
                sndrUserNm: data.DATA[i].CUST_NM,
                custId: data.DATA[i].CUST_ID,
                chtUserKey: data.DATA[i].CHT_USER_KEY
              };
              let chatmsg = this.$store.getters["messages/GE_MSG_OBJ"]({
                user_key: data.DATA[i].CUST_ID,
                sndrcv_cd: "snd",
                type: MSG_INFO.message_type,
                content: MSG_INFO.msg,
                chtCuttId: CHAT_INFO.chtCuttId,
                IMAGE_TALK_PATH: "",
                FILE_GROUP_KEY: "",
                FILE_KEY: "",
                FILE_BLOB: "",
                FILE_EXTS: "",
                //, SEND_USER_NM : Vue.prototype.store.state.messages.userNm
                SEND_USER_NM: CHAT_INFO.sndrUserNm,
                SEND_USER_SHORT_NM: "나",
                consultEnd: "",
                CUSTCO_ID: CHAT_INFO.custcoId,
              });
              let msgObj = this.$store.getters["messages/GE_CONTACT_MSG"]({
                chtCuttId: CHAT_INFO.chtCuttId,
              });
              stompUtil.sendMessage(MSG_INFO, CHAT_INFO, chatmsg, msgObj);
            }
          }
        }

        // console.log("data.DATA", data.DATA);
        if (data.DATA != null && data.DATA.length > 0) {
          let i = 0;
          let dataLen = data.DATA.length;

          for (; i < dataLen; i++) {
            let custId = data.DATA[i].CUST_ID;
            let userKey = data.DATA[i].user_key;

            if (
              dataLen > 0 &&
              ((custId != null && custId) ||
                (userKey != null && userKey))
            ) {
              // 상담종료 메시지 보여줌. unsubscription ( 필요없음 redis 삭제 되므로.)
              if (recvJson.chatEvent == "EXPIRED_SESSION_CUST") {
                data.DATA[i].uri = uri;

                this.$store
                  .dispatch("messages/AC_SPICE_TALKER", data.DATA[i])
                  .then(() => {
                    // this.$store.dispatch(
                    //   "messages/AC_CHANGE_TALK_PROCESS_INFO",
                    //   {
                    //     selected_stat: "",
                    //     userId: this.$store.getters["userStore/GE_USER_ROLE"].userId,
                    //     custcoId: this.$store.getters["userStore/GE_USER_ROLE"].company.CD,
                    //   }
                    // );
                    console.log("AC_CHANGE_TALK_PROCESS_INFO");
                  }); // 목록 삭제 (구독해제 포함)
              } else {
                data.DATA[i].TALK_STAT_NM = this.mixin_get_talk_statnm(
                  data.DATA[i].CUTT_STTS_CD
                );
                data.DATA[i].USER_ID = recvJson.userId;
                data.DATA[i].AUTO_GREETING_YN =
                  data.DATA[i].CUTT_STTS_CD == "WAIT" ||
                  data.DATA[i].CUTT_STTS_CD == "TRAN_WAIT"
                    ? "N"
                    : "Y";

                this.$store
                  .dispatch("messages/AC_UN_SHIFT_TALKER", data.DATA[i])
                  .then(() => {
                    // this.$store.dispatch(
                    //   "messages/AC_CHANGE_TALK_PROCESS_INFO",
                    //   {
                    //     selected_stat: "",
                    //     userId: this.$store.getters["userStore/GE_USER_ROLE"].userId,
                    //     custcoId: this.$store.getters["userStore/GE_USER_ROLE"].company.CD,
                    //   }
                    // );
                  });
              }
            }
          }
          if(recvJson.chatEvent != "AGENT_READY"){
            this.$store.dispatch(
              "messages/AC_CHANGE_TALK_PROCESS_INFO",
              {
                selected_stat: "",
                userId: this.$store.getters["userStore/GE_USER_ROLE"].userId,
                custcoId: this.$store.getters["userStore/GE_USER_ROLE"].company.CD,
              }
            );
            this.chtListSrch();
          }
        }
      }
    },

    //상담내역 조회
    async chtListSrch(detail,newchat,date){
      if(!newchat){
        newchat = [];
      }
      if(detail == 'KEYWORD' && this.SRCH_WORD != ''){
        eventBus.srchChatKeyWord(true, this.SRCH_WORD);
      } else if(detail == 'DTL' && this.SRCH_WORD != ''){
        eventBus.srchChatKeyWord(true, this.SRCH_WORD);
      }else {
        eventBus.srchChatKeyWord(false, '');
      }

      // let sUrl = (detail == 'KEYWORD' || detail == 'DTL') && this.SRCH_WORD != '' ? '/chat-api/main/cutt/detail' : '/chat-api/main/cnslt/inqire';
      let sUrl = '/chat-api/main/cnslt/inqire';
      let postParam = {
        // CHN_CLSF_CD : detail == 'DTL' ? this.SRCH_CHN_CLSF_CD : '',
        CHN_CLSF_CD : '',
        ST_DATE : detail == 'DTL' ? date.SRCH_ST_DATE.replaceAll('-', '')+'000000' : '',
        END_DATE : detail == 'DTL' ? date.SRCH_END_DATE.replaceAll('-', '')+'235959' : '',
        // WORD : (detail == 'KEYWORD' || detail == 'DTL') && this.SRCH_WORD != '' ? this.SRCH_WORD : '',
        WORD : '',
      }
      let headParam = {
        head: {
        }
      }

      let resData = await this.chat_postCall(sUrl, postParam, headParam)
      if(!resData.header.ERROR_FLAG){
        this.CH_DATA.CH_ALL_LIST=[];
        this.CH_DATA.CH_WAIT_LIST=[];
        this.CH_DATA.CH_ING_LIST=[];
        this.CH_DATA.CH_CMPL_LIST=[];
        this.CH_DATA.CH_AFTPRCS_LIST=[];
        this.CH_BMK_DATA.CH_ALL_LIST=[];
        this.CH_BMK_DATA.CH_WAIT_LIST=[];
        this.CH_BMK_DATA.CH_ING_LIST=[];
        this.CH_BMK_DATA.CH_CMPL_LIST=[];
        this.CH_BMK_DATA.CH_AFTPRCS_LIST=[];
        for(let n=0;n<this.FILTER_LIST.length;n++){
          this.FILTER_LIST[n].cnt = 0;
          this.FILTER_LIST[n].bmk_cnt = 0;
        }
        let leng = resData.data.length

        for(let i=0;i<leng;i++){
          //상태값 정리
          let contents = this.FBDWD_YN == 'Y'
            ? resData.data[i]["CHG_RCPTN_DSPTCH_MSG"]
            : resData.data[i]["RCPTN_DSPTCH_MSG"]

          let stts = resData.data[i]["CUTT_STTS_CD"]
          let bmk = resData.data[i]["BMK_YN"]
          this.FILTER_LIST[0].cnt++;
          if(bmk == 'Y'){
            this.FILTER_LIST[0].bmk_cnt++;
          }
          switch(stts){
            case 'ING' :
              stts = 'cs';
              this.FILTER_LIST[2].cnt++;
              if(bmk == 'Y'){
                this.FILTER_LIST[2].bmk_cnt++;
              }
              break;
            case 'WAIT' :
            case 'TRAN_WAIT' :
            case 'CLBK_WAIT' :
              stts = 'wait';
              this.FILTER_LIST[1].cnt++;
              if(bmk == 'Y'){
                this.FILTER_LIST[1].bmk_cnt++;
              }
              break;
            case 'AFTPRCS' :
              stts = 'after';
              this.FILTER_LIST[4].cnt++;
              if(bmk == 'Y'){
                this.FILTER_LIST[4].bmk_cnt++;
              }
              break;
            default :
              stts = 'done';
              this.FILTER_LIST[3].cnt++;
              if(bmk == 'Y'){
                this.FILTER_LIST[3].bmk_cnt++;
              }
          }

          let icon = resData.data[i]["CHN_CLSF_CD"]
          let beanId = this.mixin_isEmpty(resData.data[i]["BEAN_ID"]) ? null : resData.data[i]["BEAN_ID"];

          switch(icon){
            case 'KAKAO' :
              icon = 'kakao';
              break;
            case 'TTALK' :
              icon = 'teletalk';
              break;
            case 'NTT' :
              icon = 'ntalk';
              break;
            case 'EMAIL' :
              icon = 'email';
              break;
            case 'MO' :
              icon = 'sms';
              break;
            case 'BBS' :
              switch(beanId){
                case 'NAVER' :
                  icon = 'nstore';
                  break;
                case 'COUPANG' :
                  icon = 'coupang';
                  break;
              }
              break;
            default :
              icon = 'kakao';
          }
          let chat = {
            CHNL_CL: icon, //채팅 채널에 따른 아이콘
            CHN_CLSF_CD: resData.data[i]["CHN_CLSF_CD"],
            CHN_CLSF_CD_NM: resData.data[i]["CHN_CLSF_CD_NM"],
            CHT_USER_KEY: resData.data[i]["CHT_USER_KEY"],           //채팅 고객 키
            CUST_ID: resData.data[i]["CUST_ID"],                //고객ID
            CUST_NM: resData.data[i]["CUST_NM"],                //고객명
            CHNL_NM: resData.data[i]["DSPTCH_PRF_NM"],          //채널명
            RECENT_MSG:
              (detail == 'KEYWORD' || detail == 'DTL') && this.SRCH_WORD != ''
              ? contents.replaceAll(this.SRCH_WORD,'<mark>'+this.SRCH_WORD+'</mark>')
              : contents,    //최근 메시지
            STTS_CD: stts,                                      //상담 상태 표시
            CUTT_STTS_CD: resData.data[i]["CUTT_STTS_CD"],       //상담 상태 코드
            CUTT_STTS_CD_NM: resData.data[i]["CUTT_STTS_CD_NM"], //상담 상태 이름
            BMK_YN: bmk,                  //책갈피 여부
            RECENT_TIME: resData.data[i]["REG_DT"],             //최근 채팅 시간
            CHT_CUTT_ID: resData.data[i]["CHT_CUTT_ID"],        //채팅ID
            CHT_RDY_ID: resData.data[i]["CHT_RDY_ID"],          //채팅대기ID
            CUTT_BGNG_DT: this.mixin_convertDate(resData.data[i]["CUTT_BGNG_DT"], 'yyyy-MM-dd HH:mm:ss'),      //채팅 시작일시
            SYS_MSG_SKIP_YN: resData.data[i]["SYS_MSG_SKIP_YN"],  //시스템메시지 전송여부
            SNDR_KEY: resData.data[i]["SNDR_KEY"],              //발신프로필 키
            DSPTCH_PRF_KEY: resData.data[i]["DSPTCH_PRF_KEY"],              //발신프로필 키
            CLBK_YMD: this.mixin_convertDate(resData.data[i]["CLBK_YMD"], 'yyyy-MM-dd HH:mm:ss'),             //콜백요청시간
            CUTT_TYPE_ID: resData.data[i]["CUTT_TYPE_ID"],      //상담유형코드
            CUTT_TYPE: resData.data[i]["CUTT_TYPE"],            //상담유형명(트리)
            CUTT_TYPE_CD: resData.data[i]["CUTT_TYPE_CD"],      //상담유형ID(트리)(ID이지만 이름 중복으로 CD로 대체)
            CUTT_CN: resData.data[i]["CUTT_CN"],                //상담내용
            QSTN_TYPE: resData.data[i]["QSTN_TYPE"],            //문의유형명(트리)
            currentTime: null,
            CHT_CUTT_DTL_ID: resData.data[i]["CHT_CUTT_DTL_ID"],            //문의유형명(트리)
            NEW_CHAT: false,
            CHBT_YN: resData.data[i]["CHBT_YN"],                //챗봇 여부
            BEAN_ID : resData.data[i]["BEAN_ID"]                // 연동 BEAN_ID
          }
          for(let n=0;n<newchat.length;n++){
            if(newchat[n] == resData.data[i]["CHT_CUTT_DTL_ID"]){
              chat.NEW_CHAT = true;
              break;
            }
          }
          //콜백건이 아닐때
          // if(resData.data[i]["CLBK_YN"] != 'Y'){
          //   this.DataProp["arr_ch"].push(chat)
          // } else {
          //   this.DataProp["arr_callbak"].push(chat)
          // }
          //책갈피 데이터
          if(resData.data[i]["BMK_YN"] == 'Y'){
            switch(stts){
              case 'cs' :
                this.CH_DATA.CH_ALL_LIST.push(chat);
                this.CH_DATA.CH_ING_LIST.push(chat);
                this.CH_BMK_DATA.CH_ALL_LIST.push(chat);
                this.CH_BMK_DATA.CH_ING_LIST.push(chat);
                break;
              case 'wait' :
                this.CH_DATA.CH_ALL_LIST.push(chat);
                this.CH_DATA.CH_WAIT_LIST.push(chat);
                this.CH_BMK_DATA.CH_ALL_LIST.push(chat);
                this.CH_BMK_DATA.CH_WAIT_LIST.push(chat);
                break;
              case 'after' :
                this.CH_DATA.CH_ALL_LIST.push(chat);
                this.CH_DATA.CH_AFTPRCS_LIST.push(chat);
                this.CH_BMK_DATA.CH_ALL_LIST.push(chat);
                this.CH_BMK_DATA.CH_AFTPRCS_LIST.push(chat);
                break;
              default :
                this.CH_DATA.CH_ALL_LIST.push(chat);
                this.CH_DATA.CH_CMPL_LIST.push(chat);
                this.CH_BMK_DATA.CH_ALL_LIST.push(chat);
                this.CH_BMK_DATA.CH_CMPL_LIST.push(chat);
            }
          } else {
            switch(stts){
              case 'cs' :
                this.CH_DATA.CH_ALL_LIST.push(chat);
                this.CH_DATA.CH_ING_LIST.push(chat);
                break;
              case 'wait' :
                this.CH_DATA.CH_ALL_LIST.push(chat);
                this.CH_DATA.CH_WAIT_LIST.push(chat);
                break;
              case 'after' :
                this.CH_DATA.CH_ALL_LIST.push(chat);
                this.CH_DATA.CH_AFTPRCS_LIST.push(chat);
                break;
              default :
                this.CH_DATA.CH_ALL_LIST.push(chat);
                this.CH_DATA.CH_CMPL_LIST.push(chat);
            }
          }
        }

        //구독 리스트에 있어야 메시지 받았을 때 해당 채팅방 정상 조회 가능
        this.$store
          .dispatch("messages/AC_INIT_TALK_LIST", resData.data)
          .then(() => {
          });

        this.recentTime();

        let selIndex = this.selectedFilterIndex
        if(this.tabs2 == 0 ){
          switch(selIndex){
            case 0 :
              this.CHAT_PROP.CH_LIST = this.CH_DATA.CH_ALL_LIST;
              break;
            case 1 :
              this.CHAT_PROP.CH_LIST = this.CH_DATA.CH_WAIT_LIST;
              break;
            case 2 :
              this.CHAT_PROP.CH_LIST = this.CH_DATA.CH_ING_LIST;
              break;
            case 3 :
              this.CHAT_PROP.CH_LIST = this.CH_DATA.CH_CMPL_LIST;
              break;
            default :
              this.CHAT_PROP.CH_LIST = this.CH_DATA.CH_AFTPRCS_LIST;
          }
        } else if(this.tabs2 == 1){
          switch(selIndex){
            case 0 :
              this.CHAT_PROP.CH_LIST = this.CH_BMK_DATA.CH_ALL_LIST;
              break;
            case 1 :
              this.CHAT_PROP.CH_LIST = this.CH_BMK_DATA.CH_WAIT_LIST;
              break;
            case 2 :
              this.CHAT_PROP.CH_LIST = this.CH_BMK_DATA.CH_ING_LIST;
              break;
            case 3 :
              this.CHAT_PROP.CH_LIST = this.CH_BMK_DATA.CH_CMPL_LIST;
              break;
            default :
              this.CHAT_PROP.CH_LIST = this.CH_BMK_DATA.CH_AFTPRCS_LIST;
          }
        }
      }
    },

    //최근 채팅 시간 계산 (mixin사용시 속도문제)
    async recentTime(){
      let now = this.mixin_convertDate(await this.mixin_getSvrDate("YYYYMMDDHH24MISS"), 'yyyy-MM-dd HH:mm:ss');
      let nowDate = new Date(now);

      let beforeDate = ''
      for(let n=0;n<5;n++){
        let list = ''
        if(n==0){
          list = 'CH_ALL_LIST';
        } else if(n==1) {
          list = 'CH_WAIT_LIST';
        } else if(n==2) {
          list = 'CH_ING_LIST';
        } else if(n==3) {
          list = 'CH_CMPL_LIST';
        } else if(n==4) {
          list = 'CH_AFTPRCS_LIST';
        }
        let lengCh = this.CH_DATA[list].length
        for(let i=0;i<lengCh;i++){
          beforeDate = new Date(this.mixin_convertDate(this.CH_DATA[list][i]["RECENT_TIME"], 'yyyy-MM-dd HH:mm:ss'));
          let milliSeconds = nowDate - beforeDate

          let seconds = milliSeconds / 1000
          let minutes = seconds / 60
          let hours = minutes / 60
          let days = hours / 24
          let weeks = days / 7
          let months = days / 30
          let years = days / 365

          if (seconds < 60) {
            this.CH_DATA[list][i]["currentTime"] = '방금 전'
          } else if (minutes < 60) {
            this.CH_DATA[list][i]["currentTime"] = `${Math.floor(minutes)}분 전`
          } else if (hours < 24) {
            this.CH_DATA[list][i]["currentTime"] = `${Math.floor(hours)}시간 전`
          } else if (days < 7) {
            this.CH_DATA[list][i]["currentTime"] = `${Math.floor(days)}일 전`
          } else if (weeks < 5) {
            this.CH_DATA[list][i]["currentTime"] = `${Math.floor(weeks)}주 전`
          } else if (months < 12) {
            this.CH_DATA[list][i]["currentTime"] = `${Math.floor(months)}개월 전`
          } else if (years >= 1) {
            this.CH_DATA[list][i]["currentTime"] = `${Math.floor(years)}년 전`
          }
        }
        let lengCb = this.CH_BMK_DATA[list].length
        for(let n=0;n<lengCb;n++){
          beforeDate = new Date(this.mixin_convertDate(this.CH_BMK_DATA[list][n]["RECENT_TIME"], 'yyyy-MM-dd HH:mm:ss'));
          let milliSeconds = nowDate - beforeDate

          let seconds = milliSeconds / 1000
          let minutes = seconds / 60
          let hours = minutes / 60
          let days = hours / 24
          let weeks = days / 7
          let months = days / 30
          let years = days / 365

          if (seconds < 60) {
            this.CH_BMK_DATA[list][n]["currentTime"] = '방금 전'
          } else if (minutes < 60) {
            this.CH_BMK_DATA[list][n]["currentTime"] = `${Math.floor(minutes)}분 전`
          } else if (hours < 24) {
            this.CH_BMK_DATA[list][n]["currentTime"] = `${Math.floor(hours)}시간 전`
          } else if (days < 7) {
            this.CH_BMK_DATA[list][n]["currentTime"] = `${Math.floor(days)}일 전`
          } else if (weeks < 5) {
            this.CH_BMK_DATA[list][n]["currentTime"] = `${Math.floor(weeks)}주 전`
          } else if (months < 12) {
            this.CH_BMK_DATA[list][n]["currentTime"] = `${Math.floor(months)}개월 전`
          } else if (years >= 1) {
            this.CH_BMK_DATA[list][n]["currentTime"] = `${Math.floor(years)}년 전`
          }
        }
      }
    },
  },
  mounted() {
  },
  async created() {
    //공통코드 목록 => 사용할 공통코드 리스트에 넣기
    this.COMM_CD_USE_LIST = [
      "CHAT_ST"      //채팅 상태
    ];
    //공통코드별 드롭박스 만들기
    this.COMM_CD_DROP_LIST = await this.mixin_common_code_get_all(this.COMM_CD_USE_LIST);

    //상담원 정보 세팅
    this.PROFILE.img = this.$store.getters['userStore/GE_USER_ROLE'].IMG
    this.PROFILE.name = this.$store.getters['userStore/GE_USER_ROLE'].userName;
    this.PROFILE.grade = this.$store.getters['userStore/GE_USER_ROLE'].DUTY_CD_NM;
    this.PROFILE.center = this.$store.getters['userStore/GE_USER_ROLE'].DEPT_NM_FULL_PATH.substr(9);
    this.PROFILE.ip = this.$store.getters['userStore/GE_USER_ROLE'].CNTN_IP;
    this.PROFILE.inphone_num = this.$store.getters['userStore/GE_USER_ROLE'].EXT_NO;

    //채팅 상담원 초기 세팅
    this.$store.commit("userStore/MU_CHAT_STAT","CHT_CANT")

    //채팅목록 세팅
    this.chtListSrch();

    /**
     *
     * 상담사 채팅 리스트 조회
    */
    this.$eventBus.$on("chtListSrch", (message,newchat,date) => {
      this.chtListSrch(message,newchat,date);
    });

    /**
     * 상담원 대기 구독 메시지 인입
     */
    this.$eventBus.$on("busReadyCallback", (message) => {
      this.readyCallback(message);
    });
  },
  computed: {
  },
  watch: {
    tabs2(){
      this.selectedFilterItem(this.FILTER_LIST, 0);
    }
  },
};
</script>

<style lang="scss" scoped>

</style>