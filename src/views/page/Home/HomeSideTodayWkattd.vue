<template>
  <div>
    <!-- top -->
    <div class="d-flex align-center is-mt-s px-5">
      <span class="pl-la">총원 <strong class="is-txt-blue">({{ GRID.ITEMS_TOT_CNT }})</strong>명</span>
      <div class="d-flex align-center ml-auto">
        <v-select
            class="pl-form type-middle"
            :items="wkattdList"
            v-model="SRCH_PARAMS_TOP.SRCH_WKATTD_ARTCL_CLSF_CD"
            placeholder="선택하세요"
            :filter="calFilter"
            @change="selectGridList"
        />
        <compo-tooltip-btn
          TitleProp="새로고침"
          ClassProp="pl-tooltip-btn ml-2"
          IconProp="pl-icon20 refresh"
          TooltipPositionProp="bottom"
          @btnClick="selectGridList"
        ></compo-tooltip-btn>
      </div>
    </div>
    <!-- list -->
    <div style="height: calc(100vh - 210px);" class="is-mt-s pl-notice-list no-link is-border-top pl-scroll-body">
      <div
        class="pl-notice-list--unit"
        v-for="item in GRID.ITEMS">
        <div class="d-flex align-center">
          <img :src="item.IMG" :alt="item.USER_NM" style="width: 30px; max-height: 35px; border-radius: 50%;" @error="function(e){e.target.src=require('@/assets/img/@profile_user.png')}">
          <div class="ml-3">
            <div>
              <strong style="font-size: 14px">{{ item.USER_NM }}</strong>
              <span class="ml-2 is-txt-sub">{{ item.CUSTCO_NM_DISP }}-{{item.DEPT_NM}}</span>
            </div>
            <div >
              <template v-if="!mixin_isEmpty( item.WKATTD_ARTCL_CLSF_CD )">
                <strong>{{ item.WKATTD_ARTCL_CLSF_CD_NM }}</strong>
                <template v-if="!mixin_isEmpty( item.LGN_TIME_HH24MISS )">
                  <span class="unit px-1">&bull;</span><span>{{ item.LGN_TIME_HH24MISS }}(로그인)</span>
                </template>
              </template>
            </div>
          </div>
          <div class="ml-auto mt-2">
            <template v-if="!mixin_isEmpty( item.WKATTD_ARTCL_CLSF_CD )">
              <span style="min-width: 38px;" :class="`pl-badge ${ displayStatus(item.WKATTD_ARTCL_CLSF_CD_NM, 'STAT_LIST') }`"> {{ item.WKATTD_ARTCL_CLSF_CD_NM }}</span>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "HomeSideTodayWkattd", //name은 'MENU_' + 파일명 조합
  props: {
    calendarProp : {
      type : Object,
      default : ()=>{
        return {}
      }
    },
  },
  components: {
  },
  data() {
    return {
      common_code: [],
      wkattdList : [],
      SRCH_PARAMS_TOP:{
        SRCH_WKATTD_ARTCL_CLSF_CD: '',
      },
      GRID: {
        ITEMS:[],
        ITEMS_TOT_CNT:0,
      },
      STAT_LIST: [
        { code: '출근', value: 'is-green'},
        { code: '휴가', value: 'is-blue'},
        { code: '지각', value: 'is-yellow'},
      ],

    }
  },
  methods: {
    displayStatus(stat, statList) {
      let returnVal = "is-balack";
      let arrStatList = this[`${statList}`];
      for (let i = 0; i < arrStatList.length; i++) {
        if (arrStatList[i].code === stat) {
          returnVal = arrStatList[i].value;
        }
      }
      return returnVal;
    },
    async selectGridList() {
      this.GRID.ITEMS = [];
      if(this.computedUserDetailType === 'TEAM_LEADER' || this.computedUserDetailType === 'CENTER_LEADER' || this.calendarProp.CAl_YN) {
        //센터장 또는 팀장인경우만.
        // 2025.01.20 캘린더에서 휴가자 확인인 경우 추가 by.jy_na

        let sURL = '/api/lhcs/system/user/selectLeaderMyTodayWkattdInfo';
        let postParam = {};
        if (this.computedUserDetailType === 'TEAM_LEADER' || (this.calendarProp.CAl_YN && this.computedUserDetailType ==='MANAGER')) {
          postParam.SRCH_DEPT_ID = this.computedUserDeptId;
        } else {
          postParam.SRCH_GROUP_ID = this.computedUserCenterDeptId;
        }
        postParam.SRCH_WKATTD_ARTCL_CLSF_CD = this.SRCH_PARAMS_TOP.SRCH_WKATTD_ARTCL_CLSF_CD;
        if(!this.mixin_isEmpty(this.calendarProp.SRCH_APLCN_YMD)){
          postParam.SRCH_APLCN_YMD = this.calendarProp.SRCH_APLCN_YMD;
        }
        let headParam = {};
        let resData = await this.common_postCall(sURL, postParam, headParam)
        if (!this.mixin_isEmpty(resData)) {
          //개선사항 반영
          let response = [];
          if(this.calendarProp.CAl_YN){
            resData.DATA.forEach((item, idx) => {
              console.log(item.WKATTD_ARTCL_CLSF_CD);
              if(['VCTN','HFAD','ANUL'].includes(item.WKATTD_ARTCL_CLSF_CD)) response.push(item);
            });
          }else{
            response = resData.DATA;
          }

          let i = 0;
          response.map(item => {
            if (item.ICON_IMG_URI !== '/') {
              response[i]["IMG"] = '/upload/' + item.ICON_IMG_URI;
            } else {
              response[i]["IMG"] = require('@/assets/img/@manager_profile_default.png');
            }
            return i++;
          });
          this.GRID.ITEMS = [...this.GRID.ITEMS, ...response];
          // this.GRID.ITEMS_TOT_CNT = resData.HEADER.TOT_COUNT;
          //개선사항 반영
          this.GRID.ITEMS_TOT_CNT = this.GRID.ITEMS.length;
        } else {
          this.GRID.ITEMS = [];
        }
      }
    },
    calFilter(){
      // if(this.calendarProp.CAl_YN)this.wkattdList.filter(item=>['VCTN','HFAD','ANUL'].includes(item.value))
    }
  },
  mounted() {



  },
  async created() {
    let codeName = ['ATDC_TP'/* 근태그룹코드 */];
    this.common_code = await this.mixin_common_code_get_all(codeName);
    this.wkattdList = await this.mixin_common_code_get(this.common_code, 'ATDC_TP', '전체')
    console.log(this.wkattdList)
    if(this.calendarProp.CAl_YN){
      //개선사항 반영
      let arrWkattdList = this.wkattdList;
      this.wkattdList = [];

      this.wkattdList.push({text:'전체', value:''});
      arrWkattdList.forEach((item, idx) => {
        if(['VCTN','HFAD','ANUL'].includes(item.value)){
          this.wkattdList.push(item);
        }
      });

      // this.wkattdList.map(item=>{
      //   if(['VCTN','HFAD','ANUL'].includes(item.value)){
      //     item.disabled = false
      //     this.SRCH_PARAMS_TOP.SRCH_WKATTD_ARTCL_CLSF_CD = item.value
      //   }else{
      //     item.disabled = true
      //   }
      // })
    }

    if(!this.mixin_isEmpty(this.calendarProp.SRCH_WKATTD_ARTCL_CLSF_CD)){
      this.SRCH_PARAMS_TOP.SRCH_WKATTD_ARTCL_CLSF_CD = 'VCTN'
    }
    this.selectGridList();



  },
  beforeDestroy() {
    console.log("HomeSideTodayWkattd.beforeDestroy");
    this.GRID.ITEMS = [];
    this.GRID.ITEMS_TOT_CNT = 0;

  },
  computed: {
    countByStat() {
      const statCount = this.GRID.ITEMS.reduce((acc, item) => {
        if (item.WKATTD_ARTCL_CLSF_CD_NM === '출근' || item.WKATTD_ARTCL_CLSF_CD_NM === '지각' ) acc['출근']++;
        else acc['기타']++;
        return acc;
      }, { 출근: 0, 기타: 0 });
      return statCount;
    },
  },
  watch: {
    "calendarProp.SRCH_APLCN_YMD" : {
      handler(){
        this.selectGridList();
      }
    }
  },
};
</script>

<style lang="scss" scoped>

</style>