<template>
  <div class="py-5">
    <div class="px-5 pt-0">
      <!-- search -->
      <div class="pl-rounded-box">
        <div class="px-5 py-3">
          <div class="pl-form-inline-wrap label-80">
            <div class="pl-form-inline" style="width: 100%;">
              <span class="pl-label">
                평가지
              </span>
              <div class="pl-desc">
                <v-select
                  :items="evalPlanListSelBox"
                  item-text="EVAL_TITLE"       
                  item-value="EVAL_ID"
                  v-model="selectEvalId"
                  class="pl-form type-middle is-auto"
                ></v-select>
              </div>
              <v-btn class="pl-btn" @click="selectTodayEvalPlanCustList">조회</v-btn>
            </div>
          </div>
        </div>
        <div class=" px-5 py-3 is-border-top">
          <div class="spacing-wrap sp-16">
            <span class="pl-counter ml-0" @click="filterS('0')">전체 <em class="">({{ evalPlanCustStatCnt[0].TOTAL_CNT }})</em></span>
            <span class="pl-counter ml-0" @click="filterS('1')">응시중 <em class=" is-txt-blue">({{ evalPlanCustStatCnt[0].ING_CNT }})</em></span>
            <span class="pl-counter ml-0" @click="filterS('2')">응시완료 <em class=" is-txt-green">({{ evalPlanCustStatCnt[0].OK_CNT }})</em></span>
            <span class="pl-counter ml-0" @click="filterS('3')">미응시 <em class=" is-txt-org">({{ evalPlanCustStatCnt[0].FAIL_CNT }})</em></span>
          </div>
        </div>
      </div>
    </div>
    <!-- list top -->
    <div class="d-flex align-center is-mt-s px-5" style="height: 30px;">
      <span class="pl-label">전체 (<span class="is-txt-blue">{{ evalPlanCustList.length }}</span>)건</span>
    </div>
    <!-- list -->
    <div
      style="height: 620px;"
      class="is-mt-s pl-notice-list no-link is-border-top pl-scroll-body">
      <div
        :class="`pl-notice-list--unit ${ item.active ? 'selected' : ''}`"
        v-for="item in evalPlanCustList"
        :key="item.id">
        <div class="d-flex align-center">
          <img :src="item.IMG" :alt="item.EVAL_EMP_NM" style="max-width: 35px; max-height: 35px ;border-radius: 50%;" @error="function(e){e.target.src=require('@/assets/img/@manager_profile_default.png')}">
          <div class="ml-3">
            <div>
              <strong style="font-size: 14px">{{ item.EVAL_EMP_NM }}</strong>
              <span class="ml-2 is-txt-sub">{{ item.CENTER_NM }}-{{ item.EVAL_DEPT_NM }}</span>
            </div>
            <div >
              <span>답안 제출일 &bull; {{ item.PROC_YN_NM === '미응시' || item.PROC_YN_NM === '응시중' ? '미제출' : item.LAST_SBMSN_DT }} </span>
            </div>
          </div>
          <div class="ml-auto mt-2">
            <span
              style="width: 50px;"
              :class="`pl-badge ${ mixin_displayStatus(item.PROC_YN_NM, 'STAT_LIST') }`">
              {{ item.PROC_YN_NM }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomeSideExamStatus', //평가 진행 현황
  components: {
  },
  data() {
    return {
      selectModel01: '24년 08월 업무테스트(일반)',
      monitorStat: {
        total: 170,
        test: 3,
        done: 3,
        un_test: 3,
      },
      TESTER_LIST: [
        { img: require('@/assets/img/@manager_profile4.png'), name: '김한나', center: '마이홈센터 - 마이홈1팀', date: '2024-06-20 09:35:02', stat: '응시완료' },
        { img: require('@/assets/img/@manager_profile.png'), name: '한소미', center: '마이홈센터 - 마이홈1팀', date: '미제출', stat: '미응시' },
        { img: require('@/assets/img/@manager_profile2.png'), name: '김경란', center: '마이홈센터 - 마이홈1팀', date: '미제출', stat: '응시중' },
        { img: require('@/assets/img/@manager_profile3.png'), name: '정선애', center: '마이홈센터 - 마이홈1팀', date: '미제출', stat: '응시중' },
        { img: require('@/assets/img/@manager_profile4.png'), name: '우성아', center: '마이홈센터 - 마이홈1팀', date: '미제출', stat: '응시중' },
        { img: require('@/assets/img/@manager_profile5.png'), name: '김미정', center: '마이홈센터 - 마이홈1팀', date: '미제출', stat: '응시중' },
        { img: require('@/assets/img/@manager_profile6.png'), name: '권지연', center: '마이홈센터 - 마이홈1팀', date: '미제출', stat: '응시중' },
        { img: require('@/assets/img/@manager_profile2.png'), name: '양세라', center: '마이홈센터 - 마이홈1팀', date: '미제출', stat: '응시중' },
        { img: require('@/assets/img/@manager_profile_default.png'), name: '김연희', center: '마이홈센터 - 마이홈1팀', date: '미제출', stat: '응시중' },
        { img: require('@/assets/img/@manager_profile2.png'), name: '박영숙', center: '마이홈센터 - 마이홈1팀', date: '2024-06-20 09:35:02', stat: '응시완료' },
        { img: require('@/assets/img/@manager_profile4.png'), name: '김한나', center: '마이홈센터 - 마이홈1팀', date: '미제출', stat: '응시중' },
      ],
      STAT_LIST: [
        { code: '응시완료', value: 'is-green'},
        { code: '미응시', value: 'is-org'},
        { code: '응시중', value: 'is-blue'},
      ],

      evalPlanCustList:[],
      evalPlanCustList_org:[],
      evalPlanListSelBox:[],
      selectEvalId:'',
      evalPlanCustStatCnt:[],
    }
  },
  methods: {

    filterS(sort){
      if (sort === '1') {
        this.evalPlanCustList = this.evalPlanCustList_org.filter(item => item.PROC_YN_NM === '응시중');
      } else if (sort === '2') {
        this.evalPlanCustList = this.evalPlanCustList_org.filter(item => item.PROC_YN_NM === '응시완료');
      } else if (sort === '3') {
        this.evalPlanCustList = this.evalPlanCustList_org.filter(item => item.PROC_YN_NM === '미응시');
      } else  {
        this.evalPlanCustList = this.evalPlanCustList_org;
      }
    },

    // 평가참여 현황
    async selectTodayEvalPlanList(){
      this.selectEvalId = '';
      let sUrl = '/phone-api/qt/selectTodayEvalPlanList';
      let postParam = {        
         CENTER_ID: this.computedUserCenter
        , DEPT_ID: this.computedUserDetailType != "CENTER_LEADER" ? this.computedUserDeptId : ""     
      };
      let headParam = {};
      let response  = await this.common_postCall(sUrl, postParam, headParam);      
      this.evalPlanListSelBox = [];       
      if (!this.mixin_isEmpty(response)) {               
        this.evalPlanListSelBox = response.DATA ;              
        this.selectEvalId = this.evalPlanListSelBox[0].EVAL_ID;
        this.selectTodayEvalPlanCustList();       
      }else {        
        this.showAlert(this.MESSAGE.ERROR.ERROR);
      }              
    },

    async selectTodayEvalPlanCustList(){
      let sUrl = '/phone-api/qt/selectTodayEvalPlanCustList';
      let postParam = {        
         EVAL_ID: this.selectEvalId
         , CENTER_ID: this.computedUserCenter   
         , DEPT_ID: this.computedUserDetailType != "CENTER_LEADER" ? this.computedUserDeptId : ""     
      };
      let headParam = {};
      let response  = await this.common_postCall(sUrl, postParam, headParam);      
      this.evalPlanCustList = [];       
      if (!this.mixin_isEmpty(response)) {               
        //this.evalPlanCustList = response.DATA ;        
        this.evalPlanCustList = response.DATA.map((row) => {
              if (row.ICON_IMG_URI !== "/")
                  row.IMG = "/upload/" + row.ICON_IMG_URI;
              else
                  row.IMG = require("@/assets/img/@manager_profile_default.png");
              return row;
          }); 
         this.evalPlanCustList_org = this.evalPlanCustList;
         this.selectEvalPlanCustStatCnt();
      }else {        
        this.showAlert(this.MESSAGE.ERROR.ERROR);
      }              
    },

    async selectEvalPlanCustStatCnt(){
      let sUrl = '/phone-api/qt/selectEvalPlanCustStatCnt';
      let postParam = {        
        EVAL_ID: this.selectEvalId    
        , CENTER_ID: this.computedUserCenter
        , DEPT_ID: this.computedUserDetailType != "CENTER_LEADER" ? this.computedUserDeptId : ""     
      };
      let headParam = {};
      let response  = await this.common_postCall(sUrl, postParam, headParam);      
      this.evalPlanCustStatCnt = [];       
      if (!this.mixin_isEmpty(response)) {               
        this.evalPlanCustStatCnt = response.DATA ;                
      }else {        
        this.showAlert(this.MESSAGE.ERROR.ERROR);
      }              
    },
  },
  mounted() {
    this.selectTodayEvalPlanList();
  },
  created() {
  },
  computed: {
  },
  watch: {
  },
};
</script>

<style lang="scss" scoped>
.pl-counter {
  cursor: pointer; 

  &:hover {
    background-color: rgba(240, 240, 240, 0.7);  // #f0f0f0; 
    color: #007bff; 
    transition: background-color 0.3s, color 0.3s; 
  }
}
</style>