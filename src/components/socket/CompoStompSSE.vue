<template></template>
<script>
import { stompSseUtil } from "@/store/stomp-sse-util.js";
import { eventBus } from "@/store/eventBus.js";           //Event Bus
// let stomeSseReConnectCnt = 36;
let stomeSseReConnectCnt = 10;


export default {
  name: 'CompoStompSSE',
  props: {
  },
  data: () => ({
  }),
  created() {
    /*------------------------------------------------------*/
    /* 실시간 변경사항을 웹 브라우저에 갱신해줘야 하는 용도 사용.    */
    /*------------------------------------------------------*/
    this.initConnectSSE();

    if(this.computedUserType !== 'ETC_ADMIN'){
      //로그인 이후 최초 전광판 전체 데이터 조회
      this.$eventBus.$emit('setStatBoard', '{"TARGET": "ALL"}');
    }
  },
  mounted() {
  },
  beforeDestroy() {
  },
  methods: {
    // 실시간으로 서버의 변경사항을 웹 브라우저에 갱신해줘야 하는 경우 사용예정.
    initConnectSSE() {
      let _this = this;

      let geCostcoId = (this.computedUserCenter)?this.computedUserCenter:'-1';
      let geSchemaId = "LHCS";
      let geUserId = this.user_id;
      let geLgnId = this.$store.getters["userStore/GE_USER_ROLE"].lgnId;
      let geIpAddr = this.ip_addr;

      stompSseUtil.token = this.$store.state.messages.token; //SOCKET 연결 시 사용자 SOCKET Token 세팅
      stompSseUtil.userId = geUserId;
      stompSseUtil.lgnId = geLgnId;
      stompSseUtil.roomCenterId = geSchemaId + "_"+ geCostcoId;
      stompSseUtil.roomTeamId = geSchemaId + "_"+ this.computedUserDeptId;
      stompSseUtil.roomId = geSchemaId + "_ONE";
      stompSseUtil.custcoId = geCostcoId;
      stompSseUtil.schemaId = geSchemaId;
      stompSseUtil.ipAddr = geIpAddr;

      stompSseUtil.connect(
          () => {
            // 연결성공( 재연결 포함 )
            stomeSseReConnectCnt = 10;
            stompSseUtil.setConnected(true);

            /* CENTER 구독 */
            stompSseUtil.subscribe(_this, "/sse-api/v1/sub/room/" + stompSseUtil.roomCenterId, {
              roomId: stompSseUtil.roomCenterId,
              type: 'CENTER',
              userId: stompSseUtil.userId,
              ipAddr: stompSseUtil.ipAddr
            });

            /* TEAM 구독 */
            stompSseUtil.subscribe(_this, "/sse-api/v1/sub/room/" + stompSseUtil.roomTeamId, {
              roomId: stompSseUtil.roomTeamId,
              type: 'TEAM',
              userId: stompSseUtil.userId,
              ipAddr: stompSseUtil.ipAddr
            });

            /* 개인용 구독 */
            stompSseUtil.subscribe(_this, "/user/sse-api/v1/sub/room/" + stompSseUtil.roomId, {
              roomId: stompSseUtil.roomId,
              type: 'ONE',
              userId: stompSseUtil.userId,
              ipAddr: stompSseUtil.ipAddr
            });
          },
          (error) => {
            if (error != null) {
              console.log(error);
              stompSseUtil.setConnected(false);
              if( stomeSseReConnectCnt > 0 ) {  // 재연결 시도
                setTimeout(this.initConnectSSE, 5000);
                --stomeSseReConnectCnt;
                console.log( "stomeSseReConnectCnt : " + stomeSseReConnectCnt);
              }
            }
          }
      );
    },

    //강제로그아웃
    forceLogout(msg) {

      this.$eventBus.busStompDisconnect();
      this.$store
          .dispatch("authStore/AC_AUTH_LOGOUT", { id: this.userId })
          .then((response) => {
            if (this.mixin_check_repsonse(response) === true) {
              console.log("######### 로그아웃 성공");
            }

            this.$store.commit("alertStore/INIT");
            this.$store.commit("toastStore/INIT");

            //API가 정상처리 되지 않아도 세션 삭제 후 로그인 페이지로 이동 시킨다
            window.sessionStorage.clear();
            if( msg == undefined ) msg = "";
            this.$router.push("/login?m="+msg);
            window.location.reload(true);
          })
          .catch((err) => {
            window.sessionStorage.clear();
            this.$router.push("/login");
            window.location.reload(true);
            console.log("######### 로그아웃 에러");
          });
    },

    //강제새로고침
    forceRefresh(){
      document.location.href = window.location.href;
    },
  }
};
</script>

<style>

</style>