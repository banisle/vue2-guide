<template>
  <v-app class="frame-layout">
    <LayoutTop @drawer="drawer = !drawer"></LayoutTop>
    <LayoutTabs></LayoutTabs>
    <v-main>
      <!-- <LayoutLeft></LayoutLeft> -->
      <!-- 운영지원팀 -->
      <template v-if="computedUserType === 'ETC_ADMIN' && this.$route.path !== '/CSL_M0200'">
        <AdminMenu></AdminMenu>
      </template>
      <!-- 임시 채팅 조건 -->
      <template v-else-if="this.$route.path === '/CSL_M0200'">
        <ChatPanel
          style="flex: 0 0 292px"
        />
      </template>

      <template v-else>
        <StatusBoard></StatusBoard>
      </template>
      <div class="is-layout-center">
        <v-fade-transition mode="out-in">
          <LayoutContent ></LayoutContent>
        </v-fade-transition>
        <!-- <LayoutLeft></LayoutLeft> -->
        <!-- <LayoutRight></LayoutRight> -->
        <SidePanel></SidePanel>
      </div>
      <LayoutMenu v-model="drawer"></LayoutMenu>

    </v-main>
    <!-- 실시간 변경사항을 웹 브라우저에 갱신해줘야 하는 용도 사용. -->
    <CompoStompSSE/>

    <CompoStompSTT/>
  </v-app>
</template>

<script>

import LayoutTop from "./TopArea";
import LayoutTabs from "./MdiArea";
import LayoutLeft from "./LeftArea";
import LayoutRight from "./RightArea";
import LayoutContent from "./ContentsArea";
import LayoutMenu from "./MenuArea";
import StatusBoard from "./StatusBoard";
import SidePanel from "./SidePanel";
import ChatPanel from "./ChatPanel";
import AdminMenu from "./AdminMenu";
import CompoStompSSE from "@/components/socket/CompoStompSSE.vue";
import CompoStompSTT from "@/components/socket/CompoStompSTT.vue";

export default {
  name: "MainLayout",
  components: {
    CompoStompSTT,
    CompoStompSSE,
    LayoutTop,
    LayoutTabs,
    LayoutLeft,
    LayoutRight,
    LayoutContent,
    LayoutMenu,
    StatusBoard,
    SidePanel,
    ChatPanel,
    AdminMenu
  },
  data: () => ({
    drawer: false,
    TEL_CUTT_RSRV_CHK:'',
  }),
  beforeDestroy(){
    this.$eventBus.$off("setStatBoard"); //eventBus 중복방지를 위해 off
    this.$eventBus.$off("setStatBoardOtherUser"); //eventBus 중복방지를 위해 off
  },
  async created() {
    this.$eventBus.$on("setStatBoard", (e) => {
      console.log('e : ', e);
      let result = JSON.parse(e);
      this.$store.dispatch("statusStore/AC_ALL_STAT", {
        TARGET : result.TARGET
        , CUSTCO_ID : this.computedUserCenter // 로그인사용자의 센터 -1:LHCS(공통), 1:마이홈, 2:공가해소 ,3:전세임대 ,4:바로처리 ,5:주택지원센터
        , DEPT_ID : this.computedUserDeptId // 로그인사용자의 부서
        , CENTER_DEPT_ID : this.computedUserCenterDeptId // 로그인사용자의 부서 센터_부서아이디
        , USER_TYPE : this.computedUserType // 로그인사용자의 타입 LEADER: 팀장(부팀장) or 센터장, MANAGER:상담사, ETC_ADMIN : 기타
        , USER_DTL_TYPE : this.computedUserDetailType // TEAM_LEADER: 팀장(부팀장) , CENTER_LEADER:센터장, MANAGER:상담사, SUPER_ADMIN:시스템관리슈퍼관리자, ETC_ADMIN : 기타
        , USER_GROUP_CD : this.computedUserGroupCd // 사용자의 부여된 권한그룹목록 - CNSLT_STAFF,GENERAL_ADMIN,SYS_MANAGER :: 팀장(부팀장), 센터장, 센터운영관리자
        , USER_DUTY_GROUP_CD : this.computedUserDutyGroupCd // 로그인사용자 직무그룹
        , USER_ID : this.user_id // 로그인 사용자 ID
        , USER_CUTT_TASK : this.computedUserDefaultCuttTask //바로처리 상담사 상담업무 현재 선택된 업무
      });

      if(result.TARGET === 'ALL' || result.TARGET === 'CUTT_MONITOR_STAT'){
        this.getRsrvChk();
      }
    });

    //다른 팀/사용자 상담 모니터링 조회 - 바로처리 스케줄러에서 사용, by hjh.
    this.$eventBus.$on("setStatBoardOtherUser", (result) => {
      console.log('setStatBoardOtherUser result : ', result);
      this.$store.dispatch("statusStore/AC_ALL_STAT", {
        TARGET : result.TARGET
        , CUSTCO_ID : this.computedUserCenter // 로그인사용자의 센터 -1:LHCS(공통), 1:마이홈, 2:공가해소 ,3:전세임대 ,4:바로처리 ,5:주택지원센터
        , DEPT_ID : result.DEPT_ID // 로그인사용자의 부서
        , CENTER_DEPT_ID : this.computedUserCenterDeptId // 로그인사용자의 부서 센터_부서아이디
        , USER_TYPE : this.computedUserType // 로그인사용자의 타입 LEADER: 팀장(부팀장) or 센터장, MANAGER:상담사, ETC_ADMIN : 기타
        , USER_DTL_TYPE : this.computedUserDetailType // TEAM_LEADER: 팀장(부팀장) , CENTER_LEADER:센터장, MANAGER:상담사, SUPER_ADMIN:시스템관리슈퍼관리자, ETC_ADMIN : 기타
        , USER_GROUP_CD : this.computedUserGroupCd // 사용자의 부여된 권한그룹목록 - CNSLT_STAFF,GENERAL_ADMIN,SYS_MANAGER :: 팀장(부팀장), 센터장, 센터운영관리자
        , USER_DUTY_GROUP_CD : this.computedUserDutyGroupCd // 로그인사용자 직무그룹
        , USER_ID : result.USER_ID // 로그인 사용자 ID
        , USER_CUTT_TASK : this.computedUserDefaultCuttTask //바로처리 상담사 상담업무 현재 선택된 업무
      });

      if(result.TARGET === 'ALL' || result.TARGET === 'CUTT_MONITOR_STAT'){
        this.getRsrvChk();
      }
    });
  },
  methods: {
    //통화예약 체크
    async getRsrvChk(){
      this.TEL_CUTT_RSRV_CHK = setInterval(() => {
        if(this.CUTT_MONITOR_STAT.length > 0){
          this.CUTT_MONITOR_STAT.forEach((stat, idx) => {
            if(stat.STTS_KEY === 'RCPT_PHN_ID'){
              if(stat.STTS_KEY_CD){
                stat.STTS_KEY_CD.split('_##_').forEach((rsrv, seq) => {
                  console.log(this.$moment().add(5, 'm').format('YYYYMMDDHHmm'), rsrv.split(',')[0].substring(0,12), this.$moment().add(5, 'm').format('YYYYMMDDHHmm') >= rsrv.split(',')[0].substring(0,12));
                  if(this.$moment().add(5, 'm').format('YYYYMMDDHHmm') >= rsrv.split(',')[0].substring(0,12)){
                    this.showToastInfo({
                      msg : '통화 예약건이 있습니다.'
                      ,time : 10000000
                      ,type : 'left'
                      ,close : true
                      ,class : 'info type-mini'
                      ,minWidth : '235px'
                    });
                    this.stopRsrvChk();
                    return;
                  }
                });
              }else{
                this.stopRsrvChk();
              }
              return;
            }
          });
        }
      }, 10000);
    },

    stopRsrvChk(){
      clearInterval(this.TEL_CUTT_RSRV_CHK);
    }
  },
  computed: {
  }

};
</script>

<style></style>
