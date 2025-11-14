<template>
  <div class="pl-cols">
    <div>
      <v-data-table
        class="pl-grid is-hover"
        :headers="headers"
        :items="HIST_SEND_SMS"
        fixed-header
        item-key="RNUM"
        :height="!detailYn?'calc(100vh - '+gridMinusHeight+'px)':'629px'"
        :items-per-page="-1"
        hide-default-footer
	      no-data-text="등록된 데이터가 없습니다."
        :item-class="isActiveRow"
        @click:row="rowClick"
        @dblclick:row="showDetail()"
        :loading="isLoading"
        loading-text="조회중입니다."
        :page.sync="page"
        @page-count="pageCount = $event"
        >
        <template v-slot:[`item.${header.value}`]="{ item }" v-for="header in headers">
          <template v-if="header.telYn">
            <template v-if="item[header.value]">{{ mixin_setPhoneNo(item[header.value].replace(/[^0-9]/g, "")) }}</template>
          </template>
          <template v-else>
            <template v-if="header.value === 'SNDNG_DT'">
              {{ mixin_convertDate(item[header.value], 'yyyy-MM-dd HH:mm:ss') }}
            </template>
            <template v-else>{{ item[header.value] }}</template>
          </template>
        </template>
      </v-data-table>
    </div>
    <!-- side panel : SMS 발송 상세 정보-->
    <v-slide-x-reverse-transition>
      <div
        class="pl-quick-layer "
        style="width: 550px"
        v-if=" dialogSmsDetail === true ">
        <div class="pl-quick-layer-header"><h1>SMS 발송 상세 정보</h1>
          <compo-tooltip-btn
            TitleProp="닫기"
            ClassProp="pl-tooltip-btn ml-1"
            IconProp="pl-icon20 dialog-close"
            TooltipPositionProp="bottom"
            @btnClick="dialogSmsDetail = false"
          ></compo-tooltip-btn>
        </div>
        <!-- component -->
        <CompoSmsLog :DataProp="SEL_ROW" @Close="closeSlide" SmsTypeProp="SMS"/>
      </div>
    </v-slide-x-reverse-transition>


  </div>
</template>

<script>
import CompoSmsLog from '@/components/CompoSmsLog.vue'

export default {
  name: "CompoTabHistSendSmsEx", //상담 - 이력 정보 - SMS이력 탭
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

      CUST_ID : '',
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
        { text: '번호', value: 'RNUM', align: 'center', width: '4%', sortable: false },
        { text: '센터', value: 'CUSTCO_NM', align: 'left', width: '7%',sortable: false },
        { text: '발송일시', value: 'SNDNG_DT', align: 'left', width: '140px' },
        { text: '발송자', value: 'SNDNG_USER_NM', align: 'left', width: '6%', sortable: false  },
        { text: '수신자 번호', value: 'RCPTN_PHN_NO', align: 'left', width: '7%', sortable: false, telYn : true  },
        { text: '내용', value: 'CN', align: 'left', width: '', sortable: false  },
      ],

      gridMinusHeight : 735,
    }
  },
  created() {
    if(this.CustInfoProp && this.CustInfoProp.CUST_ID) {
      this.CUST_ID = this.CustInfoProp.CUST_ID;
    }
    this.getHistSendSms();

    this.gridMinusHeight = this.computedUserCenter !== '4'?!this.FAVORIT_HIDDEN?735:522:735;
  },
  watch: {
    CustInfoProp() {
      const custId = this.CustInfoProp.CUST_ID;
      if(this.CUST_ID != custId) {
        this.CUST_ID = custId;
        this.getHistSendSms();
      }
    },
    TabProp() {
      if((this.computedUserCenter != "4" && this.TabProp == 3) || (this.computedUserCenter == "4" && this.TabProp == 5)) {
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

    //SMS 이력(고객외) 조회
    async getHistSendSms() {
      this.HIST_SEND_SMS = [];
      if(this.CUST_ID && this.CUST_ID != '') {
        let postParam = {
          CUST_ID: this.CUST_ID
        };
        let headParam = {
          head: {
            ns: "lhcs.cust.dao.CustMapper",
          }
        };
        this.isLoading = true;
        let response = await this.common_postCall("/api/biz/common/select/custExpSmsHstyList", postParam, headParam);

        if(response && !response.HEADER.ERROR_FLAG) {
          response.DATA.map(item => {
            item.CENTER = item.CUSTCO_NM;
            item.TYPE = '단순LMS발송';
            item.RECEIVER = this.mixin_setPhoneNo(item.RCPTN_PHN_NO);
            item.RG_DATE = this.mixin_convertDate(item.SNDNG_DT, 'yyyy-MM-dd HH:mm:ss');
            item.MSG = item.CN;
            item.RG_EMP_NO = item.SNDNG_USER_ID;
            item.USER_NM = item.SNDNG_USER_NM;
          })
          this.HIST_SEND_SMS = response.DATA;
        }
        this.isLoading = false;
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