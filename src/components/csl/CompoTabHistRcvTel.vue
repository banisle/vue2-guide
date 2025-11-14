<template>
  <div>
    <v-data-table
      class="pl-grid"
      :headers="headers"
      :items="HIST_RCV_TEL"
      fixed-header
      item-key="index"
      :height="!detailYn?'calc(100vh - '+gridMinusHeight+'px)':'629px'"
      :items-per-page="ROW_PER_PAGE"
      hide-default-footer
      no-data-text="등록된 데이터가 없습니다."
      :loading="isLoading"
      loading-text="조회중입니다."
      :page.sync="page"
      @page-count="pageCount = $event">
    </v-data-table>
  </div>
</template>

<script>
  export default {
    name: "CompoTabHistRcvTel", //상담 - 이력 정보 - 통화예약현황 탭
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
        //고객사 ID : 바로처리 : '4'
        CUSTCO_ID: this.$store.getters["userStore/GE_USER_COMPANY"].CUSTCO_ID,

        //고객 ID
        CUST_ID: '',
        //통화예약현황
        HIST_RCV_TEL: [],
        //선택된 항목
        SEL_ITEM: {},

        isLoading: false,
        page: 1,
        pageCount: 0,
        perPage: [15,30,50,100],
        ROW_PER_PAGE: 1000,
        headers: [
          { text: '번호', value: 'ROW_NUM', align: 'center', width: '50px', sortable: false },
          { text: '예약일시', value: 'RSRV_DT', align: '', width: '140px', sortable: false },
          { text: '예약 전화번호', value: 'RSRV_TEL_NO', align: '', width: '140px', sortable: false },
          { text: '예약내용', value: 'RSRV_CNTNT', align: 'center text-left-important', width: '', sortable: false },
          { text: '처리여부', value: 'PROC_NM', align: '', width: '6%', sortable: false },
          { text: '등록일시', value: 'REG_DT', align: '', width: '140px', sortable: false },
          { text: '예약자', value: 'EMP_NM', align: '', width: '10%', sortable: false },
          { text: '소속', value: 'FULL_DEPT_NM', align: '', width: '20%', sortable: false },
        ],
        items: [
          {
            index: 2,
            type1: '2024-06-20 09:30:45',
            type2: '010-1004-1004',
            type3: '예약내용 입니다.',
            type4: '미처리',
            type5: '2024-06-20 09:30:45',
            type6: '우성아',
            type7: '마이홈센터 – 바로처리1팀',
          },
          {
            index: 1,
            type1: '2023-12-19 13:24:23',
            type2: '010-1004-1004',
            type3: '여기에 예약 내용이 조회됩니다.',
            type4: '미처리',
            type5: '2024-06-20 09:30:45',
            type6: '최혜미',
            type7: '마이홈센터 - 바로처리1팀',
          },

        ],

        gridMinusHeight : 735,
      }
    },
    created() {
      console.log("CompoTabHistRcvTel created", this.CustInfoProp)
      if(this.CustInfoProp && this.CustInfoProp.CUST_ID) {
        this.CUST_ID = this.CustInfoProp.CUST_ID;
      }
      this.getHistRcvTel();

      this.gridMinusHeight = this.computedUserCenter !== '4'?!this.FAVORIT_HIDDEN?735:522:735;
    },
    watch: {
      CustInfoProp() {
        const custId = this.CustInfoProp.CUST_ID;
        if(this.CUST_ID != custId) {
          this.CUST_ID = custId;
          this.getHistRcvTel();
        }
      },
      TabProp() {
        if((this.CUSTCO_ID != "4" && this.TabProp == 4) || (this.CUSTCO_ID == "4" && this.TabProp == 8)) {
          this.getHistRcvTel();
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
        let cal_height =  this.HIST_RCV_TEL.length * 30 || 0
        if(this.HIST_RCV_TEL.length === 0){
          return `calc(100vh - 735px)`
        }else{
          return ''
        }
      }
    },
    methods: {
      //통화예약현황 조회
      async getHistRcvTel() {
        this.HIST_RCV_TEL = [];
        if(this.CUST_ID && this.CUST_ID != '') {
          let postParam = {
            CUST_ID: this.CUST_ID
          };
          let headParam = {
            head: {
              ns: "lhcs.phone.cutt.dao.PhoneCuttMapper",
              sn: "selectRcvTelHist"
            }
          };
          this.isLoading = true;
          const response = await this.common_postCall("/api/biz/common/select/selectRcvTelHist", postParam, headParam);

          if(response && !response.HEADER.ERROR_FLAG) {
            this.HIST_RCV_TEL = response.DATA;
            console.log("this.HIST_RCV_TEL", this.HIST_RCV_TEL)
          }
          this.isLoading = false;
        }
      },
    }

  }
</script>

<style lang="scss" scoped>

</style>