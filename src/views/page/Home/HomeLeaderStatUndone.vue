<template>
  <div class=" " >
    <!-- 상담사 상태 현황 -->
    <h3 class="pl-subtit is-h3 is-mt-l">
      <strong class="pl-card-intop--title ">상담사 현황</strong>
      <compo-tooltip-btn
          TitleProp="새로고침"
          ClassProp="pl-tooltip-btn ml-auto"
          IconProp="pl-icon20 refresh"
          TooltipPositionProp="bottom"
          :MinWidthProp=22
          :HeightProp=22
          @btnClick="selectUserAgentMonitor"
      ></compo-tooltip-btn>
    </h3>
    <div class="is-mt-s d-flex flex-column pl-rounded-box px-5 py-4" style="gap: 8px">
      <div class="d-flex align-center">
        <span style="flex: 0 0 60px">통화중</span>
        <div class="pl-monitor-progress">
          <div class="pl-monitor-progress-bar is-bg-blue" :style="`width: ${ STAT_50 / STAT_TOT * 100 }%`"></div>
        </div>
        <strong style="flex: 0 0 30px" class="ml-auto text-right">{{ STAT_50 }}</strong>
      </div>
      <div class="d-flex align-center">
        <span style="flex: 0 0 60px">대기</span>
        <div class="pl-monitor-progress">
          <div class="pl-monitor-progress-bar is-bg-blue" :style="`width: ${ STAT_40 / STAT_TOT * 100 }%`"></div>
        </div>
        <strong style="flex: 0 0 30px" class="ml-auto text-right">{{ STAT_40 }}</strong>
      </div>
      <div class="d-flex align-center">
        <span style="flex: 0 0 60px">후처리</span>
        <div class="pl-monitor-progress">
          <div class="pl-monitor-progress-bar is-bg-blue" :style="`width: ${ STAT_60 / STAT_TOT * 100 }%`"></div>
        </div>
        <strong style="flex: 0 0 30px" class="ml-auto text-right">{{ STAT_60 }}</strong>
      </div>
      <div class="d-flex align-center">
        <span style="flex: 0 0 60px">이석</span>
        <div class="pl-monitor-progress">
          <div class="pl-monitor-progress-bar is-bg-blue" :style="`width: ${ STAT_30 / STAT_TOT * 100 }%`"></div>
        </div>
        <strong style="flex: 0 0 30px" class="ml-auto text-right">{{ STAT_30 }}</strong>
      </div>
      <div class="d-flex align-center">
        <span style="flex: 0 0 60px">로그아웃</span>
        <div class="pl-monitor-progress">
          <div class="pl-monitor-progress-bar is-bg-blue" :style="`width: ${ STAT_LOGOUT / STAT_TOT * 100 }%`"></div>
        </div>
        <strong style="flex: 0 0 30px" class="ml-auto text-right">{{ STAT_LOGOUT }}</strong>
      </div>
    </div>
    <!-- 평가일정 -->
    <HomeSideExam />

  </div>
</template>

<script>
import HomeSideExam from '@/views/page/Home/HomeSideExam'
export default {
  name: "HomeLeaderStatUndone", //name은 'MENU_' + 파일명 조합
  components: {
    HomeSideExam
  },
  data() {
    return {

      USER_LIST:[],

      STAT_TOT:0,
      STAT_50:0, //상담중
      STAT_40:0, //대기
      STAT_60:0, //후처리
      STAT_30:0, //이석
      STAT_LOGOUT:0, //로그아웃

    }
  },
  methods: {
    async initStat() {
      this.STAT_TOT = 0;
      this.STAT_50 = 0; //상담중
      this.STAT_40 = 0; //대기
      this.STAT_60 = 0; //후처리
      this.STAT_30 = 0; //이석
      this.STAT_LOGOUT = 0; //로그아웃
    },

    async selectUserAgentMonitor() {
      this.initStat();
      let postParam = {};
      postParam.SRCH_TYPE = 'CUSL';
      if( this.computedUserType === 'LEADER' ) {
        if (this.computedUserDetailType.indexOf("CENTER_LEADER") > -1) {
          postParam.SRCH_GROUP_ID = this.computedUserCenterDeptId;
        } else {
          postParam.SRCH_DEPT_ID = this.computedUserDeptId;
        }
      }else {
        return;
      }

      let headParam = {head: {"ns": 'lhcs.system.user.dao.UserMapper'}};
      let resData = await this.common_postCall('/api/biz/common/select/selectUserList', postParam, headParam)
      if (!this.mixin_isEmpty(resData)) {

        this.USER_LIST = resData.DATA;
        this.STAT_TOT = resData.HEADER.TOT_COUNT;
        let response = await this.common_postCall("/api/itf/ipron/swat/redisAgentMonitor", {}, {});
        if (!response.HEADER.ERROR_FLAG) {
          let responseData = response.DATA;
          let i = 0;
          responseData.map(agentItem => {
            let item = this.USER_LIST.find((item) => (item.AGENT_ID === agentItem.AGENT_LOGIN_ID ));
            if( item != undefined ) {
              item.FINAL_TALK_ANI = agentItem.FINAL_TALK_ANI;
              item.STATUS_TIME = agentItem.STATUS_TIME;

              if( agentItem.AGENT_STATUS === 30 ) { //이석
                item.AGENT_STATUS = '이석'; this.STAT_30++;
              }else if( agentItem.AGENT_STATUS === 40 ) { //대기
                item.AGENT_STATUS = '대기'; this.STAT_40++;
              }else if( agentItem.AGENT_STATUS === 50 ) { //통화중
                item.AGENT_STATUS = '통화중'; this.STAT_50++;
              }else if( agentItem.AGENT_STATUS === 51 ) { //벨울림중
                item.AGENT_STATUS = '벨울림중'; this.STAT_50++;
              }else if( agentItem.AGENT_STATUS === 52 ) { //다이얼링중
                item.AGENT_STATUS = '다이얼링중'; this.STAT_50++;
              }else if( agentItem.AGENT_STATUS === 60 ) { //후처리
                item.AGENT_STATUS = '후처리'; this.STAT_60++;
              }else {
                item.AGENT_STATUS = '로그아웃';
              }
            }
          });
          this.STAT_LOGOUT = this.STAT_TOT - ( this.STAT_30 + this.STAT_40 + this.STAT_50 + this.STAT_60 );
        }
      }
    },
  },
  mounted() {
  },
  created() {
    this.selectUserAgentMonitor();
  },
  computed: {
  },
  watch: {
  },
};
</script>

<style lang="scss" scoped>

</style>