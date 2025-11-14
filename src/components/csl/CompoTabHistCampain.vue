<template>
  <div>
    <v-data-table
      class="pl-grid"
      :headers="headers"
      :items="items"
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
            <template v-if="header.value === 'CALL_STARTTIME'">
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
    name: 'CompoTabHistCampain', //상담 - 이력 정보 - 캠페인 탭
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

        //고객 전화 번호
        CUST_PHN_NO: '',
        //캠페인 이력
        items: [],
        //선택된 항목
        SEL_ITEM: {},

        isLoading: false,
        page: 1,
        pageCount: 0,
        perPage: [15,30,50,100],
        ROW_PER_PAGE: 1000,
        headers: [
          { text: '번호', value: 'RNUM', align: 'center', width: '50px', sortable: false },
          { text: '센터', value: 'CENTER_NAME', align: 'left', width: '140px', sortable: false },
          { text: '상담일시', value: 'CALL_STARTTIME', align: 'center', width: '140px', sortable: false },
          { text: '상담타입', value: 'SERVICE_TYPE_NAME', align: 'left', width: '10%', sortable: false },
          { text: '발송자', value: 'WORK_USER_NAME', align: 'center', width: '100px', sortable: false },
          { text: '수신자번호', value: 'CONTACT_PHONE', align: 'center', width: '10%', sortable: false, telYn: true },
          { text: '내용', value: 'CONSUL_RESULT', align: 'left', width: '', sortable: false },
        ],

        gridMinusHeight : 735,
      }
    },
    created() {
      console.log("CompoTabHistCampain created", this.CustInfoProp);
      if(this.CustInfoProp && this.CustInfoProp.CUST_PHN_NO) {
        this.CUST_PHN_NO = this.CustInfoProp.CUST_PHN_NO;
      }
      this.getHistCampain();

      this.gridMinusHeight = !this.FAVORIT_HIDDEN?735:522;
    },
    watch: {
      CustInfoProp() {
        const custPhnNo = this.CustInfoProp.CUST_PHN_NO;
        if(this.CUST_PHN_NO != custPhnNo) {
          this.CUST_PHN_NO = custPhnNo;
          this.getHistCampain();
        }
      },
      TabProp() {
        if((this.CUSTCO_ID != "4" && this.TabProp == 7)) {
          this.getHistCampain();
        }

        if(!this.FAVORIT_HIDDEN) this.gridMinusHeight = 735;
        else this.gridMinusHeight = 522;
      },
      FAVORIT_HIDDEN(){
        if(!this.FAVORIT_HIDDEN) this.gridMinusHeight = 735;
        else this.gridMinusHeight = 522;
      }
    },
    computed: {
      computedGridHeight(){
        let cal_height =  this.items.length * 30 || 0
        if(this.items.length === 0){
          return `calc(100vh - 735px)`
        }else{
          return ''
        }
      }
    },
    methods: {
      //캠페인 이력 조회
      async getHistCampain() {
        this.items = [];
        if(this.CUST_PHN_NO && this.CUST_PHN_NO != '') {
          let postParam = {
            CONTACT_PHONE: this.CUST_PHN_NO.replace(/[^0-9]/g, '')
          };
          let headParam = {head: {}};

          this.isLoading = true;
          const response = await this.common_postCall("/api/external/iprview/getHistCampain", postParam, headParam);

          if(response && !response.HEADER.ERROR_FLAG) {
            this.items = response.DATA;
          }
          this.isLoading = false;
        }
      },
    }

  }
</script>

<style lang="scss" scoped>

</style>