<template>
  <div>
    <v-data-table
      class="pl-grid"
      :headers="headers"
      :items="HIST_CAUTION"
      fixed-header
      item-key="RNUM"
      :height="!detailYn?'calc(100vh - '+gridMinusHeight+'px)':'629px'"
      :items-per-page="-1"
      hide-default-footer
      no-data-text="등록된 데이터가 없습니다."
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
            <template v-if="header.value === 'REG_DT'">
              {{ mixin_convertDate(item[header.value], 'yyyy-MM-dd HH:mm:ss') }}
            </template>
            <template v-else-if="header.value === 'CUTOFF_BGNG_DT' || header.value === 'CUTOFF_END_DT'">
              {{ mixin_convertDate(item[header.value], 'yyyy-MM-dd') }}
            </template>
            <template v-else>{{ item[header.value] }}</template>
          </template>
        </template>
    </v-data-table>
  </div>
</template>

<script>
  export default {
    name: 'CompoTabHistCaution', //상담 - 이력 정보 - 배려고객이력 탭
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
        //배려고객 이력
        HIST_CAUTION: [],
        //선택된 항목
        SEL_ITEM: {},

        isLoading: false,
        page: 1,
        pageCount: 0,
        perPage: [15,30,50,100],
        ROW_PER_PAGE: 1000,
        headers: [
          { text: '번호', value: 'RNUM', align: 'center', width: '50px', sortable: false },
          { text: '센터', value: 'CUSTCO_NM', align: 'left', width: '140px', sortable: false },
          { text: '등록일자', value: 'REG_DT', align: 'center', width: '140px', sortable: false },
          { text: '주의 메모', value: 'CAUTION_CN', align: 'center text-left-important', width: '', sortable: false },
          { text: '상태', value: 'CAUTION_CUST_STTS_NM', align: 'center', width: '100px', sortable: false },
          { text: '차단 시작일', value: 'CUTOFF_BGNG_DT', align: 'center', width: '10%', sortable: false },
          { text: '차단 종료일', value: 'CUTOFF_END_DT', align: 'center', width: '10%', sortable: false },
        ],

        gridMinusHeight : 735,
      }
    },
    created() {
      console.log("CompoTabHistCaution created", this.CustInfoProp)
      if(this.CustInfoProp && this.CustInfoProp.CUST_ID) {
        this.CUST_ID = this.CustInfoProp.CUST_ID;
      }
      this.getHistCaution();

      this.gridMinusHeight = this.computedUserCenter !== '4'?!this.FAVORIT_HIDDEN?735:522:735;
    },
    watch: {
      CustInfoProp() {
        const custId = this.CustInfoProp.CUST_ID;
        if(this.CUST_ID != custId) {
          this.CUST_ID = custId;
          this.getHistCaution();
        }
      },
      TabProp() {
        if((this.CUSTCO_ID != "4" && this.TabProp == 5) || (this.CUSTCO_ID == "4" && this.TabProp == 9)) {
          this.getHistCaution();
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
        let cal_height =  this.HIST_CAUTION.length * 30 || 0
        if(this.HIST_CAUTION.length === 0){
          return `calc(100vh - 735px)`
        }else{
          return ''
        }
      }
    },
    methods: {
      //배려고객 이력 조회
      async getHistCaution() {
        this.HIST_CAUTION = [];
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
          const response = await this.common_postCall("/api/biz/common/select/custCautionHstryList", postParam, headParam);

          if(response && !response.HEADER.ERROR_FLAG) {
            this.HIST_CAUTION = response.DATA;
          }
          this.isLoading = false;
        }
      },
    }

  }
</script>

<style lang="scss" scoped>

</style>