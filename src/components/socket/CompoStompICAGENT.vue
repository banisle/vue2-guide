<template></template>
<script>
import { stompICAGENTUtil } from "@/store/stomp-icagent-util.js";
import { eventBus } from "@/store/eventBus.js";           //Event Bus

let stomeICAGENTReConnectCnt = 10;

export default {
  name: 'CompoStompICAGENT',
  props: {
  },
  data: () => ({
  }),
  created() {
    /*------------------------------------------------------*/
    /* 실시간 변경사항을 웹 브라우저에 갱신해줘야 하는 용도 사용.    */
    /*------------------------------------------------------*/
    this.initConnectICAGENT();
  },
  mounted() {
  },
  computed: {
    leader_home_tab_index: {
      get() {
        return this.$store.getters['commonStore/GE_COMMON_LEADER_HOME_TAB'];
      }
    }
  },
  beforeDestroy() {
  },
  methods: {
    // 실시간으로 REDIS(IC:AGENT) 서버의 AGENT 변경사항을 웹 브라우저에 갱신해줘야 하는 경우 사용예정.
    initConnectICAGENT() {
      let _this = this;

      let geCostcoId = (this.computedUserCenter)?this.computedUserCenter:'-1';
      let geSchemaId = "LHCS";
      let geUserId = this.user_id;
      let geLgnId = this.$store.getters["userStore/GE_USER_ROLE"].lgnId;
      let geIpAddr = this.ip_addr;

      stompICAGENTUtil.token = this.$store.state.messages.token; //SOCKET 연결 시 사용자 SOCKET Token 세팅
      stompICAGENTUtil.userId = geUserId;
      stompICAGENTUtil.lgnId = geLgnId;
      stompICAGENTUtil.roomCenterId = "LHCS_ICAGENT";
      stompICAGENTUtil.custcoId = geCostcoId;
      stompICAGENTUtil.schemaId = geSchemaId;
      stompICAGENTUtil.ipAddr = geIpAddr;

      stompICAGENTUtil.connect(
          () => {
            // 연결성공( 재연결 포함 )
            stomeICAGENTReConnectCnt = 10;
            stompICAGENTUtil.setConnected(true);

            /* ICAGENT 구독 */
            stompICAGENTUtil.subscribe(_this, "/sse-api/v1/sub/room/" + stompICAGENTUtil.roomCenterId, {
              roomId: stompICAGENTUtil.roomCenterId,
              type: 'ICAGENT',
              userId: stompICAGENTUtil.userId,
              ipAddr: stompICAGENTUtil.ipAddr
            });
          },
          (error) => {
            if (error != null) {
              console.log(error);
              stompICAGENTUtil.setConnected(false);
              if( stomeICAGENTReConnectCnt > 0 ) {  // 재연결 시도
                setTimeout(this.initConnectICAGENT, 5000);
                --stomeICAGENTReConnectCnt;
                console.log( "stomeICAGENTReConnectCnt : " + stomeICAGENTReConnectCnt);
              }
            }
          }
      );
    },

  },
  watch:{
  }
};
</script>

<style>

</style>