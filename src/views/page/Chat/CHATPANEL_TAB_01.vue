<template>
  <div>
    <!-- grid top -->
    <div class="d-flex align-center px-4 ">
      <span
        class="pl-counter ml-0">{{ popData.selectedFilterTitle ? popData.selectedFilterTitle : '전체' }}
        <em class="pl-1">({{ popData.CH_LIST.length }})</em> 건
      </span>
      <div class="pl-btn-wrap ml-auto">
        <!-- 상세 검색 버튼 -->
        <div>
          <compo-tooltip-btn
            TitleProp="상세 검색"
            ClassProp="pl-tooltip-btn"
            IconProp="pl-icon20 filter"
            TooltipPositionProp="bottom"
            @btnClick="dropFilter = !dropFilter"
          ></compo-tooltip-btn>
          <!-- 상세 검색 모달 -->
          <v-slide-y-transition>
            <div class="pl-drop-layer" v-if="dropFilter === true" >
              <div class="pl-drop-layer-body">
                <div class="pl-form-inline-wrap vertical type-auto gap-8">
                  <div class="pl-form-inline">
                    <span class="pl-label">
                      조회 시작일자
                    </span>
                    <div class="pl-desc">
                      <compo-date-picker
                        DateType="dateInput"
                        :DateProp.sync="date2"/>
                    </div>
                  </div>
                  <div class="pl-form-inline">
                    <span class="pl-label">
                      조회 종료일자
                    </span>
                    <div class="pl-desc">
                      <compo-date-picker
                        DateType="dateInput"
                        :DateProp.sync="date3"/>
                    </div>
                  </div>
                </div>
                <div class="pl-drop-layer-footer justify-end">
                  <v-btn class="pl-btn is-trans" @click="dropFilter=false">닫기</v-btn>
                  <v-btn class="pl-btn" @click="[dropFilter=false, chtListSrchDtl()]">조회</v-btn>
                </div>
              </div>
            </div>
          </v-slide-y-transition>
        </div>
        <!-- 새로고침 버튼 -->
        <compo-tooltip-btn
          TitleProp="새로고침"
          ClassProp="pl-tooltip-btn"
          IconProp="pl-icon20 refresh"
          TooltipPositionProp="bottom"
          @btnClick="chtListSrch"
        ></compo-tooltip-btn>
      </div>
    </div>

    <!-- list -->
    <div class="px-3 is-mt-s">
      <div class="pl-rounded-box is-bg-white  ">
        <div class="list-fade-effect py-2">
          <div
            style="height: 490px"
            class="spacing-wrap flex-column pl-scroll-body my-1">
            <div
              @click="selectedFilterItem(item, index)"
              class="d-flex hover-light-bg pa-3"
              :class="`${ selectedFilterIndex === item.CHT_CUTT_ID ? 'is-bg-light-main' : '' } ${index !== 0 ? 'is-border-sub-top' : ''}`"
              v-for="item,index in popData.CH_LIST"
              :key="item.id">
              <v-badge left color="red" overlap dot :value=item.NEW_CHAT>
                <v-icon :class="`pl-icon30 mainchat-${ item.CHNL_CL }`"></v-icon>
              </v-badge>
              <div class="ml-2" style="overflow: hidden; flex: 1 1 0px;">
                <strong>{{item.CUST_NM}} ({{ item.CHNL_NM }})</strong>
                <div class="is-ellips">
                  {{ item.RECENT_MSG.length > 18 ? item.RECENT_MSG.substr(0,17)+'...' : item.RECENT_MSG }}
                </div>
                <div>
                  <span
                    style="width: 55px"
                    :class="`pl-badge is-${ mixin_displayStatus(item.CUTT_STTS_CD, 'STAT_LIST') }`">
                    {{ item.CUTT_STTS_CD_NM }}
                  </span>
                  <span class="ml-1">{{ mixin_displayStatus(item.CHNL_CL, 'STAT_LIST_CH') }}</span>
                  <span class="mx-1 is-txt-bull">&bull;</span>
                  <span class="">{{ item.currentTime }}</span>
                </div>

              </div>
            </div>

          </div>
        </div>
      </div>

    </div>
    <!-- detail modal -->
    <v-slide-x-transition>
      <div
        style="position: fixed; z-index: 11; top: 90px; left: 290px; width: 710px;"
        class="pl-quick-layer type-left"
        v-if=" slideChatDetail === true ">
      <ChatDetailLog
        :PropData="selectedItem"
        :StatData="STAT_LIST"
        :ChatStat="CHAT_STAT"
        @Close="closeSlide"
      />

      </div>
    </v-slide-x-transition>
  </div>
</template>

<script>
import ChatDetailLog from './ChatDetailLog'

export default {
  name: "CHATPANEL_TAB_01", //name은 'MENU_' + 파일명 조합
  props: {
    popData: {
      type: Object,
    }
  },
  components: {
    ChatDetailLog
  },
  data() {
    return {
      // drop
      dropFilter: false,
      date2: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      date3: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),

      STAT_LIST: [
        { code: 'ING', value: 'green' },
        { code: 'WAIT', value: 'org' },
        { code: 'TRAN_WAIT', value: 'org' },
        { code: 'CLBK_WAIT', value: 'org' },
        { code: 'AFTPRCS', value: 'cyan' },
        { code: 'TEMP_SAVE', value: 'cyan' },
        { code: 'CMPL', value: 'black' },
      ],

      STAT_LIST_CH: [
        { code: 'kakao', value: '카카오톡' },
        { code: 'email', value: '이메일' },
        { code: 'sms', value: 'SMS' },
      ],
      selectedFilterIndex: null,

      selectedItem: null,

      // dialog
      slideChatDetail: false,

      // [채팅 log]
      NOW_CHAT : '',
      CHAT_STAT: '',      //상담 버튼 및 메시지 제어를 위한 상태
      BFR_CHAT_LOG: [],   //이전채팅 내역 => 챗봇내역때문에 이전채팅내역이 꼬이는일이 발생하여 변수 새로 생성
      CHAT_LOG: [],       //채팅 내역
      CHBT_USER: {},      //챗봇고객정보
      CHBT_INFO: [],      //고객챗봇이력

      NEW_CHAT_LIST:[],   //신규채팅(확인안한채팅) 리스트
    }
  },
  methods: {
    selectedFilterItem(item, index) {
      this.selectedItem = null
      this.selectedFilterIndex = item.CHT_CUTT_ID;
      this.slideChatDetail = true
      this.selectedItem = item
      //채팅 내역 조회
      // this.$eventBus.chatHstSrch();
      this.chatDtlSrch('',this.selectedItem);

      //채팅상담 저장데이터 전달
      if(this.computedUserCenter === '4'){
        this.$eventBus.searchCustInfoNewCutt_4(item.CHT_USER_KEY,item.CHN_CLSF_CD,item.CHT_CUTT_ID);
      } else {
        this.$eventBus.searchCustInfoNewCutt(item.CHT_USER_KEY,item.CHN_CLSF_CD,item.CHT_CUTT_ID);
        this.$eventBus.newCuttOnCsInfoTable(item.CHT_USER_KEY,item.CHN_CLSF_CD,item.CHT_CUTT_ID);
      }
    },
    closeSlide(){
      this.slideChatDetail = false
      this.selectedFilterIndex = null
    },
    chtListSrch(){
      this.$eventBus.chtListSrch();
    },
    chtListSrchDtl(){
      this.$eventBus.chtListSrch('DTL','',{SRCH_ST_DATE:this.date2,SRCH_END_DATE:this.date3});
    },

    //채팅리스트 클릭 시 이벤트
    chatDtlSrch(){
      for(let n=0;n<this.NEW_CHAT_LIST.length;n++){
        if(this.selectedItem.CHT_CUTT_DTL_ID == this.NEW_CHAT_LIST[n]){
          this.NEW_CHAT_LIST.splice(n,1);
        }
      }
      if(this.NOW_CHAT != this.selectedItem.CHT_CUTT_ID || (this.NOW_CHAT == this.selectedItem.CHT_CUTT_ID && this.selectedItem.STTS_CD == 'wait')){
        //같은 채팅을 클릭한것이 아닐 때
        this.$eventBus.chatHstSrch('',this.selectedItem);

        //챗봇으로 들어온 채팅일 때
        this.CHBT_USER = {};      //챗봇고객 정보
        this.CHBT_INFO = [];      //챗봇상담 내역
        if(this.selectedItem.CHBT_YN == 'Y'){
          this.getChbtUserData();
          this.getChbtData();
        }
      } else if(this.NOW_CHAT == this.selectedItem.CHT_CUTT_ID && this.selectedItem.CUTT_STTS_CD == 'ING'){
        //현재 진행중인 채팅방을 클릭하고있을 때
        this.$eventBus.chatHstSrch('ING',this.selectedItem);
      }
      this.NOW_CHAT = this.selectedItem.CHT_CUTT_ID
      // 채팅 인입시 고객정보,상담이력 깜빡임=>따로 처리
      // this.getCustDefaultInfo();

      //상담 저장폼이 열려있고 진행중인 상담을 클릭했을 때 저장폼 닫아주기
      //완료된 상담일때도 닫아주기
      //대기중인 상담을 클릭했을 때도 닫아주기
      if(this.slideChat && (this.selectedItem.CUTT_STTS_CD == 'ING'|| this.selectedItem.CUTT_STTS_CD.indexOf("WAIT") != -1 || this.selectedItem.CUTT_STTS_CD.indexOf("CMPL") != -1)){
        this.slideChat = false;
      }
      this.CHNL_CL = this.selectedItem.CHN_CLSF_CD;

      this.SYSTEM_MSG_STAT = this.selectedItem.SYS_MSG_SKIP_YN == 'N' ? false : true;

      //전달 또는 콜백으로 상담유형이나 내용이 이미 있으면 세팅
      this.CUTT_CN = this.selectedItem.CUTT_CN;
      if(this.selectedItem.CUTT_TYPE_CD != ''){
        this.selCuttTypeSrch();
      } else {
        this.CUTT_TYPE_ID='';          //선택 상담유형
      }
    },
  },
  mounted() {
  },
  created() {
    /**
     * 채팅 메시지 인입
     */
     this.$eventBus.$on("busInoutCallback", (message) => {
      let recvJson = JSON.parse(message.body);
      let telewebJsonString = JSON.parse(recvJson.telewebJsonString);
      let destArray = message.headers.destination.split("/")
      let newChatId = telewebJsonString.DATA[0].CHT_CUTT_DTL_ID
      if(telewebJsonString.DATA[0].hasOwnProperty('CHT_CUTT_ID')){
        //CHT_CUTT_ID가 있으면 발송메시지임
      } else {
        this.NEW_CHAT_LIST.push(newChatId);
      }

      this.$eventBus.chtListSrch('',this.NEW_CHAT_LIST); //채팅 리스트 가져오기 (이 과정에서 상담 구독 진행 => 구독을 맺어야 웹소켓 정상 작동)

      //클릭 데이터가 없으면 상담 채팅이력 조회 불가(오류)
      // console.log("this.chat_list_data", this.chat_list_data);
      if(this.selectedItem != '' && this.selectedItem != null && this.selectedItem != undefined){
        if(recvJson.userKey == this.selectedItem.CHT_USER_KEY){
          //클릭 데이터가 있고 상담 종료를 받았을 때
          if(recvJson.chatEvent == "EXPIRED_SESSION_CUST"){
            this.selectedItem["CUTT_STTS_CD"] = 'AFTPRCS'
            this.selectedItem["STTS_CD"] = 'after'
            this.selectedItem["CUTT_STTS_CD_NM"] = '후처리'

            this.CHAT_STAT = 'CMPL';
            //상담저장폼이 닫혀있고 진행중인 상담이 종료되었을 때 저장폼 보여주기
            if(!this.slideChat && this.selectedItem.CUTT_STTS_CD == 'AFTPRCS'){
              this.slideChat = true;
            }
          }
          this.chatDtlSrch();
        }
      }
    });
  },
  computed: {
  },
  watch: {
  },
};
</script>

<style lang="scss" scoped>

</style>