<template>
  <div>
    <v-data-table
      class="pl-grid is-hover"
      :headers="headers"
      :items="HIST_SEND_ATALK"
      fixed-header
      item-key="index"
      :height="computedGridHeight"
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
    </v-data-table>
    <!-- side panel : 상세 정보-->
    <v-slide-x-reverse-transition>
      <div
        class="pl-quick-layer "
        style="width: 550px"
        v-if=" dialogSmsDetail === true ">
        <div class="pl-quick-layer-header"><h1>알림톡 발송 상세 정보</h1>
          <compo-tooltip-btn
            TitleProp="닫기"
            ClassProp="pl-tooltip-btn ml-1"
            IconProp="pl-icon20 dialog-close"
            TooltipPositionProp="bottom"
            @btnClick="dialogSmsDetail = false"
          ></compo-tooltip-btn>
        </div>
        <!-- component -->
        <CompoSmsLog
          :DataProp="SEL_ROW"
          SmsTypeProp="ATALK"
          :PagingProp="false"
          @Close="closeSlide" />
      </div>
    </v-slide-x-reverse-transition>
  </div>
</template>

<script>
import CompoSmsLog from '@/components/CompoSmsLog.vue'

  export default {
    name: "CompoTabHistSendAtalk", //상담 - 이력 정보 - 알림톡이력 탭
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
        // dialgo
        dialogSmsDetail: false,

        CUST_PHN_NO: '',

        data: {
          PROFILE: {
            name: '한소미',
            img: require('@/assets/img/@manager_profile6.png'),
            part: '마이홈센터 - 마이홈1팀',
            send_date: '2024-06-20 09:30:25',
            send_system: '콜센터',
          },
          SMS_DATA: {
            rcv_phone: '010-1004-1004',
            text: `★ 고객님께서 접수하신 보수 건이 희망건설㈜ 보수담당자에게 배정되었습니다.

▶ 접수번호
   240620-41-00001

▶ 접수내용
    건축 / 현관 / 도어록 / 작동불량

★ 추가 문의사항은 오른쪽 하단 노란색 버튼을 눌러 “카톡상담”을 요청하거나 “바로처리센터 [1670-8572]”로 문의주시면 답변 드리겠습니다.`
          }
        },

        HIST_SEND_ATALK: [],

        SEL_ROW: {},

        // grid
        isLoading: false,
        page: 1,
        pageCount: 0,
        perPage: [15,30,50,100],
        ROW_PER_PAGE: 1000,
        headers: [
          { text: '번호', value: 'ROW_NUMBER', align: 'center', width: '50px', sortable: false },
          { text: '전화번호', value: 'RECEIVER', align: '', width: '140px', sortable: false },
          { text: '성공유무', value: 'RSLT_NM', align: '', width: '100px', sortable: false },
          { text: '제목', value: 'SUBJECT', align: '', width: '18%', sortable: false },
          { text: '내용', value: 'MSG', align: '', width: '', sortable: false },
          { text: '발송 시스템', value: 'REQ_DEPT_NM', align: '', width: '10%', sortable: false },
          { text: '발송일자', value: 'RG_DATE', align: '', width: '10%', sortable: false },
        ],
        items: [
          {
            index: 1,
            type1: '101-1004-1004',
            type2: '성공',
            type3: '담당 배정 알림 ',
            type4: '★ 고객님께서 접수하신 보수 건이 희망건설㈜ 보수담당자에게 배정되었습니다. ▶ 접수번호 240620-41-00001 ▶ 접수내용 건축 / 현관 / 도어록 / 작동불량 ★ 추가 문의사항은 오른쪽 하단 노란색 버튼을 눌러 “카톡상담”을 요청하거나 “바로처리센터 [1670-8572]”로 문의주시면 답변 드리겠습니다. ',
            type5: 'COTIS',
            type6: '2024-06-20 09:30:45',
          },
          {
            index: 2,
            type1: '101-1004-1004',
            type2: '전송성공',
            type3: 'AS 진행정보 조회안내 ',
            type4: '★ 고객님께서 접수하신 보수 건이 희망건설㈜ 보수담당자에게 배정되었습니다. ▶ 접수번호 240620-41-00001 ▶ 접수내용 건축 / 현관 / 도어록 / 작동불량 ★ 추가 문의사항은 오른쪽 하단 노란색 버튼을 눌러 “카톡상담”을 요청하거나 “바로처리센터 [1670-8572]”로 문의주시면 답변 드리겠습니다. ',
            type5: '콜센터',
            type6: '2024-06-20 09:30:45',
          },
          {
            index: 3,
            type1: '101-1004-1004',
            type2: '전송성공',
            type3: 'AS 진행정보 조회안내 ',
            type4: '★ 고객님께서 접수하신 보수 건이 희망건설㈜ 보수담당자에게 배정되었습니다. ▶ 접수번호 240620-41-00001 ▶ 접수내용 건축 / 현관 / 도어록 / 작동불량 ★ 추가 문의사항은 오른쪽 하단 노란색 버튼을 눌러 “카톡상담”을 요청하거나 “바로처리센터 [1670-8572]”로 문의주시면 답변 드리겠습니다. ',
            type5: '콜센터',
            type6: '2024-06-20 09:30:45',
          },
          {
            index: 4,
            type1: '101-1004-1004',
            type2: '전송성공',
            type3: 'AS 진행정보 조회안내 ',
            type4: '★ 고객님께서 접수하신 보수 건이 희망건설㈜ 보수담당자에게 배정되었습니다. ▶ 접수번호 240620-41-00001 ▶ 접수내용 건축 / 현관 / 도어록 / 작동불량 ★ 추가 문의사항은 오른쪽 하단 노란색 버튼을 눌러 “카톡상담”을 요청하거나 “바로처리센터 [1670-8572]”로 문의주시면 답변 드리겠습니다. ',
            type5: '콜센터',
            type6: '2024-06-20 09:30:45',
          },

        ],
      }
    },
    beforeDestroy(){
      this.$eventBus.$off("refreshCompoTabHistSendAtalk"); //eventBus 중복방지를 위해 off
    },
    created() {
      this.$eventBus.$on("refreshCompoTabHistSendAtalk", () => {
        this.getHistSendAtalk();
      });

      if(this.CustInfoProp && this.CustInfoProp.CUST_PHN_NO) {
        this.CUST_PHN_NO = this.CustInfoProp.CUST_PHN_NO;
      }
      this.getHistSendAtalk();
    },
    watch: {
      CustInfoProp() {
        const custPhnNo = this.CustInfoProp.CUST_PHN_NO;
        if(this.CUST_PHN_NO != custPhnNo) {
          this.CUST_PHN_NO = custPhnNo;
          this.getHistSendAtalk();
        }
      },
      TabProp() {
        if(this.TabProp == 6) {
          this.getHistSendAtalk();
        }
      },
    },
    computed: {
      computedGridHeight(){
        let cal_height =  this.computedAsCuttAddRowCnt * 30 || 0
        if(this.detailYn) {
          return `629px`
        } else {
          return `calc(100vh - ${cal_height}px - 735px)`
        }
      }
    },
    methods: {
      //바로처리 상담 이력 조회
      async getHistSendAtalk() {
        if(this.computedUserDefaultCuttTask == 'SHDL' || this.computedUserDefaultCuttTask == 'M_SHDL') {
          //computedAsShdlCallerTel = mixin 에 정의됨. - 스케줄러 접촉정보 연락처 입력값을 받음.
          this.CUST_PHN_NO = this.computedAsShdlCallerTel;
        }
        console.log("bbbbbbbbbbbbbbbbbbbbbbbb", this.computedUserDefaultCuttTask, this.computedAsShdlCallerTel)
        this.HIST_SEND_ATALK = [];
        if(this.CUST_PHN_NO && this.CUST_PHN_NO != '') {
          let postParam = {
            PHONE_NUM: this.CUST_PHN_NO.replace(/[^0-9]/g, '')
          };
          let headParam = {
            head: {
              ns: "lhcs.phone.as.dao.PhoneAsCommonMapper_Atalk",
            }
          };
          this.isLoading = true;
          let response = await this.common_postCall("/api/biz/common/external/select/selectHistSendAtalk", postParam, headParam);

          if(response && !response.HEADER.ERROR_FLAG) {
            response.DATA.map(item => {
              item.RECEIVER = this.mixin_setPhoneNo(item.RECEIVER);
            })
            this.HIST_SEND_ATALK = response.DATA;
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
      closeSlide(){
        this.dialogSmsDetail = false
      },
    },


  }
</script>

<style lang="scss" scoped>

</style>