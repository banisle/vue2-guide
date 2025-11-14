<template>
  <div class="pl-cols">
    <div>
      <v-data-table
        class="pl-grid is-hover"
        :headers="headers"
        :items="HIST_SEND_SMS"
        fixed-header
        item-key="index"
        :height="!detailYn?'calc(100vh - '+gridMinusHeight+'px)':'629px'"
        :items-per-page="ROW_PER_PAGE"
        hide-default-footer
	      no-data-text="등록된 데이터가 없습니다."
        :item-class="isActiveRow"
        @click:row="rowClick"
        @dblclick:row="showDetail()"
        :loading="isLoading"
        loading-text="조회중입니다."
        :page.sync="page"
        @page-count="pageCount = $event">
        <!-- 상담유형 -->
        <!-- <template v-slot:item.MSG="{item}">
          <v-tooltip content-class="pl-tooltip " bottom>
            <template v-slot:activator="{ on, attrs }">
              <span v-bind="attrs" v-on="on">
                {{ item.MSG }}
              </span>
            </template>
            <span>{{ item.MSG }}</span>
          </v-tooltip>
        </template> -->
      </v-data-table>
    </div>
    <!-- side panel : SMS 발송 상세 정보-->
    <v-slide-x-reverse-transition>
      <div
        class="pl-quick-layer "
        style="width: 550px"
        v-if=" dialogSmsDetail === true ">
        <div class="pl-quick-layer-header"><h1>SMS 발송 상세 정보</h1>
          <!-- <compo-tooltip-btn
            TitleProp="윈도우 팝업 열기"
            ClassProp="pl-tooltip-btn"
            IconProp="pl-icon20 openPop"
            TooltipPositionProp="bottom"
            @btnClick="mixin_openWindow( 'LayoutPopup', '675', '850', {compo_name : 'CompoSmsLog', callback : 'getPopData', title: 'SMS 발송 상세 정보'}), dialogSmsDetail = false"
          ></compo-tooltip-btn> -->
          <compo-tooltip-btn
            TitleProp="닫기"
            ClassProp="pl-tooltip-btn ml-1"
            IconProp="pl-icon20 dialog-close"
            TooltipPositionProp="bottom"
            @btnClick="dialogSmsDetail = false"
          ></compo-tooltip-btn>
        </div>
        <!-- component -->
        <CompoSmsLog :DataProp="SEL_ROW" @Close="closeSlide"/>
      </div>
    </v-slide-x-reverse-transition>


  </div>
</template>

<script>
import CompoSmsLog from '@/components/CompoSmsLog.vue'

export default {
  name: "CompoTabHistSendSms", //상담 - 이력 정보 - SMS이력 탭
  components: {
    CompoSmsLog
  },
  props: {
    TabProp: {
      type: Number,
      default: null,
    },
    CustInfoProp: {
      type: Object,
      default: () => {},
    },
    detailYn: {
      type: Boolean,
      default : false
    },
  },
  data(){
    return{
      // sms profile dialog
      dialogSmsDetail: false,

      CUST_PHN_NO: '',
      HIST_SEND_SMS: [],

      SEL_ROW: {},

      data: {
        PROFILE: {
          name: '한소미',
          img: require('@/assets/img/@manager_profile6.png'),
          part: '마이홈센터 - 마이홈1팀',
          send_date: '2024-06-20 09:30:25',
          send_type: '단순 LMS 발송',
        },
        SMS_DATA: {
          rcv_phone: '010-1004-1004',
          send_phone: '1600-1004',
          text: `안녕하십니까? LH 관심지역 알리미서비스입니다.

▶ 제목 : 광주광역시 지역 국민임대주택 예비입주자 모집 공고
▶ 주택형 :
[광주선운1 : 29~51㎡]
[광주수완2 : 46㎡]
[광주수완3 : 46㎡]
[광주수완4 : 46~51㎡]
[광주수완5 : 46㎡]
[광주수완6 : 46~51㎡]
[광주수완7 : 39~46㎡]
[광주수완8 : 59㎡]
[카이스트빌1 : 34㎡]
[신촌대주파크빌 : 59㎡]
[광주용봉 : 51~59㎡]
[광주연제 : 39~49㎡]
[광주송화2 : 59㎡]
[광주송화4 : 59㎡]
[광주동천1 : 39㎡]
[광주동천6 : 39~51㎡]
[광주용산 : 29㎡]
[광주신가 : 51㎡]
[광주아름마을1: 46~51㎡]

☞ 국민임대 통합공고로 인하여 전화 및 문자상담 폭주로 연결이 어려울 수 있습니다.

☞ 신청자격, 모집일정 등 자세한 사항은 LH청약센터( https://apply.lh.or.kr → 임대주택 → 임대정보) 에서 공고문을 먼저 꼭! 확인하시기 바랍니다.

☎ 수신거부 080-850-8880
`
        }
      },


      isLoading: false,
      page: 1,
      pageCount: 0,
      perPage: [15,30,50,100],
      ROW_PER_PAGE: 1000,
      headers: [
        { text: '번호', value: 'ROW_NUMBER', align: 'center', width: '4%', sortable: false },
        { text: '센터', value: 'CENTER', align: 'left', width: '7%',sortable: true },
        { text: '발송일시', value: 'RG_DATE', align: 'left', width: '140px',sortable: true },
        { text: '발송타입', value: 'TYPE', align: 'left', width: '120px', sortable: false  },
        { text: '발송자', value: 'RG_EMP_NM', align: 'left', width: '6%', sortable: false  },
        { text: '수신자 번호', value: 'RECEIVER', align: 'left', width: '7%', sortable: false  },
        { text: '내용', value: 'MSG', align: 'center text-left-important', width: '', sortable: false  },
      ],
      items: [
        { index: 14, type01: '통합삼담', type02: '2024-06-20 09:30', type03: '관심지역 발송', type04: '김한나', type05: '010-1004-1004', type06: '안녕하십니까? LH 관심지역 알림이 서비스입니다. 제목 : 광주광역시 지역 국민임대주택 예비입주자 모집' },
        { index: 13, type01: '통합삼담', type02: '2024-06-20 09:30', type03: '단순 LMS 발송', type04: '한소미', type05: '010-1004-1004', type06: '안녕하십니까? LH 관심지역 알림이 서비스입니다. 관심지구 알림이 서비스란? 고객님께서 등록하신 관심지' },
        { index: 12, type01: '통합삼담', type02: '2024-06-20 09:30', type03: '관심지역 발송', type04: '김경란', type05: '010-1004-1004', type06: '안녕하십니까? LH 관심지역 알림이 서비스입니다. 관심지구 알림이 서비스란? 고객님께서 등록하신 관심지' },
        { index: 11, type01: '통합삼담', type02: '2024-06-20 09:30', type03: '관심지역 발송', type04: '정선애', type05: '010-1004-1004', type06: '안녕하십니까? LH 광주전남지역 임대 상담입니다. 문자알리미서비스는 공고일로부터 3일 이내(근무일 기준)' },
        { index: 10, type01: '통합삼담', type02: '2024-06-20 09:30', type03: '관심지역 발송', type04: '정선애', type05: '010-1004-1004', type06: '안녕하십니까? LH 관심지역 알림이 서비스입니다. 제목 : 광주광역시 지역 국민임대주택 예비입주자 모집' },
        { index: 9, type01: '통합삼담', type02: '2024-06-20 09:30', type03: '관심지역 발송', type04: '김한나', type05: '010-1004-1004', type06: '안녕하십니까? LH 관심지역 알림이 서비스입니다. 제목 : 광주광역시 지역 국민임대주택 예비입주자 모집' },
        { index: 8, type01: '통합삼담', type02: '2024-06-20 09:30', type03: '관심지역 발송', type04: '김한나', type05: '010-1004-1004', type06: '안녕하십니까? LH 관심지역 알림이 서비스입니다. 제목 : 광주광역시 지역 국민임대주택 예비입주자 모집' },

      ],

      SCH_SMS_TXT : '',

      gridMinusHeight : 735,
    }
  },
  beforeDestroy(){
    this.$eventBus.$off("searchSmsHist"); //eventBus 중복방지를 위해 off
    this.$eventBus.$off("refreshCompoTabHistSendSms"); //eventBus 중복방지를 위해 off
  },
  async created() {
    this.$eventBus.$on("searchSmsHist", (item) => {
      this.SCH_SMS_TXT = item.SCH_SMS_TXT;
      this.getHistSendSms();
    });

    this.$eventBus.$on("refreshCompoTabHistSendSms", () => {
      this.getHistSendSms();
    });

    if(this.CustInfoProp && this.CustInfoProp.CUST_PHN_NO) {
      this.CUST_PHN_NO = this.CustInfoProp.CUST_PHN_NO;
    }
    this.getHistSendSms();

    this.gridMinusHeight = this.computedUserCenter !== '4'?!this.FAVORIT_HIDDEN?735:522:735;
  },
  watch: {
    CustInfoProp() {
      const custPhnNo = this.CustInfoProp.CUST_PHN_NO;
      if(this.CUST_PHN_NO != custPhnNo) {
        this.CUST_PHN_NO = custPhnNo;
        this.getHistSendSms();
      }
    },
    TabProp() {
      if((this.computedUserCenter != "4" && this.TabProp == 2) || (this.computedUserCenter == "4" && this.TabProp == 4)) {
        this.getHistSendSms();
      }

      if(this.computedUserCenter != "4"){
        if(!this.FAVORIT_HIDDEN) this.gridMinusHeight = 735;
        else this.gridMinusHeight = 522;
      }else{
        this.gridMinusHeight = 735;
      }
    },
    FAVORIT_HIDDEN(){
      if(!this.FAVORIT_HIDDEN) this.gridMinusHeight = 735;
      else this.gridMinusHeight = 522;
    }
  },
  computed: {
    computedGridHeight(){
      let cal_height =  this.HIST_SEND_SMS.length * 30 || 0
      if(this.HIST_SEND_SMS.length === 0){
        return `calc(100vh - 735px)`
      }else{
        return ''
      }
    }
  },
  methods: {

    //SMS 이력 조회
    async getHistSendSms() {
      if(this.computedUserDefaultCuttTask == 'SHDL' || this.computedUserDefaultCuttTask == 'M_SHDL') {
        //computedAsShdlCallerTel = mixin 에 정의됨. - 스케줄러 접촉정보 연락처 입력값을 받음.
        this.CUST_PHN_NO = this.computedAsShdlCallerTel;
      }
      console.log("bbbbbbbbbbbbbbbbbbbbbbbb", this.computedUserDefaultCuttTask, this.computedAsShdlCallerTel)
      this.HIST_SEND_SMS = [];
      if(this.CUST_PHN_NO && this.CUST_PHN_NO != '') {
        let postParam = {
          CALLED_NUMBER: this.CUST_PHN_NO.replace(/[^0-9]/g, '')
          , SCH_SMS_TXT: this.SCH_SMS_TXT
        };
        let headParam = {
          head: {
            ns: "lhcs.external_db.sms.dao.ExternalMapper_Sms",
          }
        };
        this.isLoading = true;
        let response = await this.common_postCall("/api/biz/common/external/select/selectHistSendSmsByHp", postParam, headParam);

        if(response && !response.HEADER.ERROR_FLAG) {
          response.DATA.map(item => {
            item.CENTER = item.CENTER == 'as' ? '바로처리' : '통합상담';
            item.TYPE = this.mixin_isEmpty(item.TYPE) ? '단순LMS발송' : '관심지역발송';
            item.RECEIVER = this.mixin_setPhoneNo(item.RECEIVER);
            item.SENDER = this.mixin_setPhoneNo(item.SENDER);
          })
          this.HIST_SEND_SMS = response.DATA;
        }
        this.isLoading = false;
        this.SCH_SMS_TXT = '';
      }
    },

    //로우 클릭시 색상 변경
    isActiveRow(item){
      const activeClass = item === this.SEL_ROW ? "active" : "";
      return activeClass;
    },

    rowClick(item) {
      this.SEL_ROW = item;
    },


    showDetail(){
      this.dialogSmsDetail = true
    },

    getPopData(item){
      console.log('자식창(팝업)에서 받은 메시지 : ', item);
      this.mixin_hideDialog('CsDetail');
      this.windowPopup.close();
    },

    closeSlide(){
      this.dialogSmsDetail = false
    },
  },

}
</script>

<style lang="scss" scoped>

</style>