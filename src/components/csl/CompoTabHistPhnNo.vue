<template>
  <div>
    <v-data-table
      class="pl-grid"
      :headers="headers"
      :items="HIST_PHN_NO"
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
    name: "CompoTabHistPhnNo", //상담 - 이력 정보 - 전화번호변경이력 탭
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
        //상담 이력
        HIST_PHN_NO: [],
        //선택된 항목
        SEL_ITEM: {},

        isLoading: false,
        page: 1,
        pageCount: 0,
        perPage: [15,30,50,100],
        ROW_PER_PAGE: 1000,
        headers: [
          { text: '번호', value: 'ROW_NUM', align: 'center', width: '50px', sortable: false },
          { text: '변경일자', value: 'REG_DT', align: '', width: '140px', sortable: false },
          { text: '변경자', value: 'RGTR_NM', align: '', width: '100px', sortable: false },
          { text: '소속', value: 'FULL_DEPT_NM', align: '', width: '18%', sortable: false },
          { text: '변경 항목', value: 'PHN_SE_NM', align: '', width: '17%', sortable: false },
          { text: '변경 내용', value: 'PHN_NO', align: '', width: '', sortable: false },
          { text: '대표 여부', value: 'RPRS_YN', align: '', width: '5%', sortable: false },
        ],
        items: [

          {
            index: 1,
            type1: '2023-12-19 13:24:23',
            type2: '김미정',
            type3: '마이홈센터 - 바로처리3팀',
            type4: '휴대전화 번호',
            type5: '010-1004-1004',
            type6: '예',
          },
          {
            index: 2,
            type1: '2024-06-20 09:30:45',
            type2: '우성아',
            type3: '마이홈센터 - 바로처리1팀',
            type4: '휴대전화 번호',
            type5: '010-1004-1004',
            type6: '예',
          },
        ],

        gridMinusHeight : 735,
      }
    },
    created() {
      console.log("CompoTabHistPhnNo created", this.CustInfoProp)
      if(this.CustInfoProp && this.CustInfoProp.CUST_ID) {
        this.CUST_ID = this.CustInfoProp.CUST_ID;
      }
      this.getHistPhnNo();

      this.gridMinusHeight = this.computedUserCenter !== '4'?!this.FAVORIT_HIDDEN?735:522:735;
    },
    watch: {
      CustInfoProp() {
        const custId = this.CustInfoProp.CUST_ID;
        if(this.CUST_ID != custId) {
          this.CUST_ID = custId;
          this.getHistPhnNo();
        }
      },
      TabProp() {
        if((this.CUSTCO_ID != "4" && this.TabProp == 3) || (this.CUSTCO_ID == "4" && this.TabProp == 7)) {
          this.getHistPhnNo();
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
        let cal_height =  this.HIST_PHN_NO.length * 30 || 0
        if(this.HIST_PHN_NO.length === 0){
          return `calc(100vh - 735px)`
        }else{
          return ''
        }
      }
    },
    methods: {
      //바로처리 상담 이력 조회
      async getHistPhnNo() {
        this.HIST_PHN_NO = [];
        if(this.CUST_ID && this.CUST_ID != '') {
          let postParam = {
            CUST_ID: this.CUST_ID
          };
          let headParam = {
            head: {
              ns: "lhcs.phone.cutt.dao.PhoneCuttMapper",
              sn: "selectPhnNoHist"
            }
          };
          this.isLoading = true;
          const response = await this.common_postCall("/api/biz/common/select/selectPhnNoHist", postParam, headParam);

          if(response && !response.HEADER.ERROR_FLAG) {
            this.HIST_PHN_NO = response.DATA;
            console.log("this.HIST_PHN_NO", this.HIST_PHN_NO)
          }
          this.isLoading = false;
        }
      },
    }
  }
</script>

<style lang="scss" scoped>

</style>