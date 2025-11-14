<template>
  <div class="">
    <v-tabs
      v-model="tabsProp"
      hide-slider
      class="pl-tabs type-fill tab-grow">
      <v-tab>미처리</v-tab>
      <v-tab>통화예약</v-tab>
      <v-tab>콜백</v-tab>
    </v-tabs>
    <v-tabs-items v-model="tabsProp">
      <!-- 미처리 -->
      <v-tab-item >
        <!-- list top -->
        <div class="d-flex align-center is-mt-s ">
          <span class="pl-label">전체 (<span class="is-txt-blue">{{ gridTotalCnt }}</span>)건</span>
          <compo-tooltip-btn
            TitleProp="새로고침"
            ClassProp="pl-tooltip-btn ml-auto"
            IconProp="pl-icon20 refresh"
            TooltipPositionProp="bottom"
            @btnClick="cuttUnProcList"
          ></compo-tooltip-btn>
        </div>
        <!-- list -->
        <v-data-table
          class="pl-grid is-mt-s is-hover"
          :headers="headers"
          :items="items"
          fixed-header
          item-key="RNUM"
          height="652px"
          :items-per-page="-1"
          @click:row="setCustCuttInfo"
          hide-default-footer
	        no-data-text="등록된 데이터가 없습니다."
          :loading="loading"
          loading-text="조회중입니다."
          >
          <!-- :items-per-page="pagination[0].rowsPerPage" -->
          <template v-slot:[`item.${header.value}`]="{ item }" v-for="header in headers">
            <template v-if="header.telYn">
              <template v-if="item[header.value]">{{ mixin_setPhoneNo(item[header.value].replace(/[^0-9]/g, "")) }}</template>
            </template>
            <template v-else>
              <template v-if="header.value === 'REG_DT'">
                {{ mixin_convertDate(item[header.value], 'yyyy-MM-dd HH:mm:ss') }}
              </template>
              <template v-else>{{ item[header.value] }}</template>
            </template>
          </template>
        </v-data-table>

      </v-tab-item>
      <!-- 통화예약 -->
      <v-tab-item >
        <!-- list top -->
        <div class="d-flex align-center is-mt-s ">
          <span class="pl-label">전체 (<span class="is-txt-blue">{{ gridTotalCnt1 }}</span>)건</span>
          <compo-tooltip-btn
            TitleProp="새로고침"
            ClassProp="pl-tooltip-btn ml-auto"
            IconProp="pl-icon20 refresh"
            TooltipPositionProp="bottom"
            @btnClick="rsrvList"
          ></compo-tooltip-btn>
        </div>
        <!-- list -->
        <v-data-table
          class="pl-grid is-mt-s is-hover"
          :headers="headers1"
          :items="items1"
          fixed-header
          item-key="index"
          height="652px"
          :items-per-page="-1"
          @click:row="setCustCuttInfo"
          hide-default-footer
	        no-data-text="등록된 데이터가 없습니다."
          :loading="loading1"
          loading-text="조회중입니다."
          >
          <template v-slot:[`item.${header.value}`]="{ item }" v-for="header in headers1">
            <template v-if="header.telYn">
              <template v-if="item[header.value]">{{ mixin_setPhoneNo(item[header.value].replace(/[^0-9]/g, "")) }}</template>
            </template>
            <template v-else>
              <template v-if="header.value === 'REG_DT' || header.value === 'RSRV_DT'">
                {{ mixin_convertDate(item[header.value], 'yyyy-MM-dd HH:mm:ss') }}
              </template>
              <template v-else>{{ item[header.value] }}</template>
            </template>
          </template>
        </v-data-table>

      </v-tab-item>
      <!-- 콜백 -->
      <v-tab-item >
        <!-- list top -->
        <div class="d-flex align-center is-mt-s ">
          <span class="pl-label">전체 (<span class="is-txt-blue">{{ gridTotalCnt2 }}</span>)건</span>
          <compo-tooltip-btn
            TitleProp="새로고침"
            ClassProp="pl-tooltip-btn ml-auto"
            IconProp="pl-icon20 refresh"
            TooltipPositionProp="bottom"
            @btnClick="callBackList"
          ></compo-tooltip-btn>
        </div>
        <!-- list -->
        <v-data-table
          class="pl-grid is-mt-s is-hover"
          :headers="headers"
          :items="items2"
          fixed-header
          item-key="index"
          height="652px"
          :items-per-page="-1"
          @click:row="setCustCuttInfo"
          hide-default-footer
	        no-data-text="등록된 데이터가 없습니다."
          :loading="loading2"
          loading-text="조회중입니다."
          >
          <template v-slot:[`item.${header.value}`]="{ item }" v-for="header in headers">
            <template v-if="header.telYn">
              <template v-if="item[header.value]">{{ mixin_setPhoneNo(item[header.value].replace(/[^0-9]/g, "")) }}</template>
            </template>
            <template v-else>
              <template v-if="header.value === 'REG_DT'">
                {{ mixin_convertDate(item[header.value], 'yyyy-MM-dd HH:mm:ss') }}
              </template>
              <template v-else>{{ item[header.value] }}</template>
            </template>
          </template>
        </v-data-table>

      </v-tab-item>
    </v-tabs-items>
  </div>
</template>

<script>
export default {
  name: "StatusBoardMyhomeUndone", // 마이홈 - 미처리
  components: {
  },
  props:{
    TabProp: {
      type: Number,
      default: null,
    }
  },
  data() {
    return {
      tabsProp: 0,
      //미처리, 통화예약, 콜백
      MON_Q_TASK_LIST: ['TEMP','RSRV','CALLBACK'],  
      
      headers: [
        { text: '번호', value: 'RNUM', align: 'center', width: '50px', sortable: false },
        { text: '접수일', value: 'REG_DT', align: 'center', width: '' },
        { text: '전화번호', value: 'TEL_NO', align: '', width: '40%', telYn : true, sortable: false },
      ],

      headers1: [
        { text: '번호', value: 'RNUM', align: 'center', width: '50px', sortable: false },
        // { text: '접수일', value: 'REG_DT', align: 'center', width: '' },
        { text: '예약일시', value: 'RSRV_DT', align: 'center', width: '' },
        { text: '전화번호', value: 'TEL_NO', align: '', width: '40%', telYn : true, sortable: false },
      ],

      loading : false,
      loading1 : false,
      loading2 : false,

      pagination : [
        {page: 1, rowsPerPage: 10, sortBy: "", descending: ""}
        ,{page: 1, rowsPerPage: 10, sortBy: "", descending: ""}
        ,{page: 1, rowsPerPage: 10, sortBy: "", descending: ""}
      ],//그리드 페이지속성정의

      nextDisabled:true,  //검색건수가 페이지 제한 건수보다 많을 때 사용하는 다음버튼
      nextDisabled1:true,  //검색건수가 페이지 제한 건수보다 많을 때 사용하는 다음버튼
      nextDisabled2:true,  //검색건수가 페이지 제한 건수보다 많을 때 사용하는 다음버튼

      items: [],
      items1: [],
      items2: [],

      gridTotalCnt : 0,
      gridTotalCnt1 : 0,
      gridTotalCnt2 : 0,
    }
  },
  computed: {
  },
  watch: {
    TabProp() {
      this.tabsProp = this.TabProp-1;
    },
    tabsProp() {
      if(this.tabsProp === 0){
        this.cuttUnProcList('');//상담 미처리 목록
      }else if(this.tabsProp === 1){
        this.rsrvList('');//통화예약 목록
      }else if(this.tabsProp === 2){
        this.callBackList('');//콜백 목록
      }
    }
  },
  mounted() {
  },
  beforeDestroy(){
  },
  created() {
    this.tabsProp = this.TabProp - 1;
    if(this.tabsProp === 0){
      this.cuttUnProcList('');//상담 미처리 목록
    }else if(this.tabsProp === 1){
      this.rsrvList('');//통화예약 목록
    }else if(this.tabsProp === 2){
      this.callBackList('');//콜백 목록
    }
  },
  methods: {
    //상담 미처리 목록
    async cuttUnProcList(next){
      let postParam = {
        TEAM_YN : 'N' //팀 여부(개인)
        , RSRV_YN : 'N' //통화예약이 아닌 미처리
      };

      //다음버튼 클릭 유무
      // if (next == 'next'){
      // } else {
      //   this.items = [];
      //   this.pagination[0].page = 1; //페이징 처리 초기화
      //   this.nextDisabled = true;  //버튼 비활성화
      // }

      let headParam = {
        head: {
          // ROW_CNT : this.pagination[0].rowsPerPage,
          // PAGES_CNT : this.pagination[0].page,
          // PAGING : 'Y',
          ns: "lhcs.phone.cutt.dao.PhoneCuttMapper",
          sn: "cuttUnProcList"
        }
      };

      this.loading = true;
      const response = await this.common_postCall("/api/biz/common/select/cuttUnProcList", postParam, headParam);
      
      if (!response.HEADER.ERROR_FLAG){
        this.items = response.DATA;
        // let tempDataText = response.DATA;
        // this.items = [...this.items, ...tempDataText];

        // if(response.HEADER.next !== null && response.HEADER.next !== undefined){
        //   if(response.HEADER.next === true){
        //     this.nextDisabled = false //버튼 활성화
        //   }else{
        //     this.nextDisabled = true  //버튼 비활성화
        //   }
        // }
        if(this.items.length > 0) this.gridTotalCnt = response.HEADER.TOT_COUNT;
        else this.gridTotalCnt = 0;

        // this.pagination[0].page += 1;
      }
      this.loading = false;
    },

    //통화예약 목록
    async rsrvList(next){
      let postParam = {
        TEAM_YN : 'N'//팀 여부(개인)
        , RSRV_YN : 'Y' //통화예약인 미처리
      };

      //다음버튼 클릭 유무
      // if (next == 'next'){
      // } else {
      //   this.items = [];
      //   this.pagination[1].page = 1; //페이징 처리 초기화
      //   this.nextDisabled1 = true;  //버튼 비활성화
      // }

      let headParam = {
        head: {
          // ROW_CNT : this.pagination[1].rowsPerPage,
          // PAGES_CNT : this.pagination[1].page,
          // PAGING : 'Y',
          ns: "lhcs.phone.cutt.dao.PhoneCuttMapper",
          sn: "cuttUnProcList"
        }
      };

      const response = await this.common_postCall("/api/biz/common/select/cuttUnProcList", postParam, headParam);
      
      if (!response.HEADER.ERROR_FLAG){
        response.DATA.forEach((item, idx) => {
          item.TEL_NO = item.RSRV_TEL_NO;
        });
        this.items1 = response.DATA;
        // let tempDataText = response.DATA;
        // this.items1 = [...this.items1, ...tempDataText];

        // if(response.HEADER.next !== null && response.HEADER.next !== undefined){
        //   if(response.HEADER.next === true){
        //     this.nextDisabled1 = false //버튼 활성화
        //   }else{
        //     this.nextDisabled1 = true  //버튼 비활성화
        //   }
        // }
        if(this.items1.length > 0) this.gridTotalCnt1 = response.HEADER.TOT_COUNT;
        else this.gridTotalCnt1 = 0;

        // this.pagination[1].page += 1;
      }
    },

    //콜백 목록
    async callBackList(next){
      let postParam = {
      };

      //다음버튼 클릭 유무
      // if (next == 'next'){
      // } else {
      //   this.items = [];
      //   this.pagination[2].page = 1; //페이징 처리 초기화
      //   this.nextDisabled2 = true;  //버튼 비활성화
      // }

      let headParam = {
        head: {
          // ROW_CNT : this.pagination[2].rowsPerPage,
          // PAGES_CNT : this.pagination[2].page,
          // PAGING : 'Y',
          ns: "lhcs.phone.cutt.dao.PhoneCuttMapper",
          sn: "callBackUnProcList"
        }
      };

      const response = await this.common_postCall("/api/biz/common/select/callBackUnProcList", postParam, headParam);
      
      if (!response.HEADER.ERROR_FLAG){
        this.items2 = response.DATA;
        // let tempDataText = response.DATA;
        // this.items2 = [...this.items2, ...tempDataText];

        // if(response.HEADER.next !== null && response.HEADER.next !== undefined){
        //   if(response.HEADER.next === true){
        //     this.nextDisabled2 = false //버튼 활성화
        //   }else{
        //     this.nextDisabled2 = true  //버튼 비활성화
        //   }
        // }
        if(this.items2.length > 0) this.gridTotalCnt2 = response.HEADER.TOT_COUNT;
        else this.gridTotalCnt2 = 0;

        // this.pagination[2].page += 1;
      }
    },

    setCustCuttInfo(item){
      if(Number(this.CTI_CALL_STAT.replace('stat', '')) === 5){
        this.showAlertInfo({msg : '대기 중에는 다른 업무를 수행할 수 없습니다.'});
        return;
      }else if(Number(this.CTI_CALL_STAT.replace('stat', '')) === 6){
        this.showAlertInfo({msg : '콜 상담 중에는 다른 업무를 수행할 수 없습니다.<br>상담을 먼저 처리해주세요.'});
        return;
      }else{
        //전화상담탭이 있는지 확인
        let m0100 = false;
        if(this.$store.getters['commonStore/GE_COMMON_ACTIVE_TAB'].id === 'CSL_M0100') m0100 = true;

        if(!m0100) this.mixin_set_active_tab({PATH_NM:'/CSL_M0100', NODE_TITLE:'전화상담'});
        setTimeout(() => {
          item.MON_Q_TASK = this.MON_Q_TASK_LIST[this.tabsProp];//미처리
          item.RSRV_CUTT_YN = 'Y'; //통화예약
          item.CTI_INFO = {};
          item.CTI_INFO.PHN_NO = item.TEL_NO;
          item.CALL_DATE = item.REG_DT?item.REG_DT.substr(0, 8):'';
          this.$eventBus.$emit('setCuttUnProcCustInfo', item);
        }, !m0100?1000:10);
      }
    }
  },
};
</script>

<style lang="scss" scoped>

</style>