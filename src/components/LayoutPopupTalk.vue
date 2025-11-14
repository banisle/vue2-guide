<template>
  <div>
    <div class="pl-quick-layer-header"><h1>{{ item.title }}</h1>
      <compo-tooltip-btn
        TitleProp="닫기"
        ClassProp="pl-tooltip-btn ml-1"
        IconProp="pl-icon20 dialog-close"
        TooltipPositionProp="bottom"
        @btnClick="closePopup()"
      ></compo-tooltip-btn>
    </div>
    <component
      :is="item.compo_name"
      :SCH_CUSTCO_ID="mixin_isEmpty(item.CUSTCO_ID) ?this.computedUserCenter:item.CUSTCO_ID"
      :DataProp="item"
      :popData="item.popData"
      :injectionObj="item.injectionObj"
      :CustInfoProp="item.CustInfoProp"
      :dbClckTabYn="item.dbClckTabYn"
      :readOnly="item.readOnly"
      :isPopProp="item.isPop"
      @sendDataToParent="sendDataToParent(item.callback)"
      @Close="closePopup"
    ></component>
    <!-- <v-btn @click="sendDataToParent(callback)">부모 창 메서드 호출{{ item }}</v-btn> -->
  </div>
</template>

<script>
import CSL_M0100_CS_TAB01_DETAIL from '@/views/page/CSL_M0100_CS_TAB01_DETAIL.vue';
import CSL_M0100 from '@/views/page/CSL_M0100.vue';
import CSL_M0100_DETAIL from '@/views/page/CSL_M0100_DETAIL.vue';
import CompoAsFlwAcpDetail from '@/components/CompoAsFlwAcpDetail.vue';
import StatusBoardNotice from '@/views/page/StatusBoardNotice.vue'
import CompoSmsLog from '@/components/CompoSmsLog.vue';
import RightJobParts from '@/views/page/right_jobparts.vue';
import RightRentalManage from '@/views/page/RightRentalManage'
import RightKnInfo from '@/views/page/RightKnInfo.vue';
import RightAssetStat from '@/views/page/RightAssetStat.vue';
import CompoTalkLog from '@/components/CompoTalkLog.vue';
import CTM_M0300_TAB_02_DETAIL from '@/views/page/CTM_M0300_TAB_02_DETAIL.vue';
import STA_M1600_DIALOG from "@/views/page/STA_M1600_DIALOG.vue";
import CompoTabHistAsFlwAcp from '@/components/csl/CompoTabHistAsFlwAcp.vue' // 신 AS 접수이력
import CompoTabHistAsCutt from '@/components/csl/CompoTabHistAsCutt.vue' // 바로처리 상담이력
import CompoTabHistCutt from '@/components/csl/CompoTabHistCutt.vue' // 상담이력

export default {
  components: {
    CSL_M0100_CS_TAB01_DETAIL,
    CSL_M0100,
    CSL_M0100_DETAIL,
    CompoAsFlwAcpDetail,
    CompoSmsLog,
    RightJobParts,
    StatusBoardNotice,
    RightRentalManage,
    RightKnInfo,
    RightAssetStat,
    CompoTalkLog,
    CTM_M0300_TAB_02_DETAIL,
    STA_M1600_DIALOG,
    CompoTabHistAsFlwAcp,
    CompoTabHistAsCutt,
    CompoTabHistCutt
  },
  data() {
    return {
      item: {}, //부모창으로 부터 전달 받은 Data
      rtnItem: {}, //부모창으로 전달할 Data
      originTabId : '', //팝업호출 TAB ID
      originTabNm : '', //팝업호출 TAB 명
      callback : '',
    };
  },
  watch: {
    item: {
      deep: true,
      handler(newValue) {
        sessionStorage.setItem('popupTalkItem', JSON.stringify(newValue));
      }
    }
  },
  beforeDestroy() {
    window.removeEventListener('message', this.receiveData, false);
  },
  created() {
    window.addEventListener('message', this.receiveData, false);

    // 부모 창의 존재 여부 확인
    if (window.opener) {
      // 부모 창의 상태 주기적으로 체크
      const checkParentInterval = setInterval(() => {
        if (!window.opener || window.opener.closed) {
          clearInterval(checkParentInterval);
          // 부모 창이 닫혔으므로 팝업 창도 닫기
          window.close();
        }
      }, 1000);
    } else {
      // 부모 창이 닫혔으므로 팝업 창도 닫기
      window.close();
    }

    this.loadState();
  },
  mounted() {
  },
  methods: {
    loadState() {
      const savedItem = sessionStorage.getItem('popupTalkItem');
      if (savedItem) {
        this.item = JSON.parse(savedItem);
      } else if (window.opener && window.opener.item) {
        this.item = window.opener.item;
        sessionStorage.setItem('popupTalkItem', JSON.stringify(this.item));
      }
    },
    receiveData(event) {
      this.originTabId = this.$route.params.menuId;
      this.originTabNm = JSON.parse(window.sessionStorage.getItem("vuex")).commonStore.active_tab.title;

      // 이벤트의 출처를 확인하여 보안상 안전한지 확인
      if (event.origin !== window.location.origin) {
        return;
      }

      // 부모 창에서 보낸 데이터 수신
      if (event.data) {
        if(event.data.key === 'message'){
          this.showAlert({alertDialogToggle: true, msg: event.data.val, iconClass: 'is-info', type: 'default'});
        }else{
          if(event.data.item){
            this.item = event.data.item;
            console.log("LayoutPopup.vue >>>>>>>>>>>>>>" ,  this.item );
            this.callback = event.data.item.callback;
            if(this.callback) this.rtnItem = this.item;
          }else{
            sessionStorage.setItem('popupTalkItem', JSON.stringify(this.item));
          }
        }
      }
    },

    //부모창 메소드 호출 및 데이터 전달
    sendDataToParent(methodName){
      if (window.opener && window.opener.parentVueInstance) {
        window.opener.parentVueInstance.mixin_parentSessionStorage(); //부모창 sessionStorage 변경 값 확인을 위해 재주입
        if(this.originTabId === JSON.parse(window.sessionStorage.getItem("vuex")).commonStore.active_tab.id){ //팝업창 오픈한 Tab 활성 여부
          const parentInstance = window.opener.parentVueInstance;
          if (typeof parentInstance[methodName] === 'function') {
            if(this.rtnItem){
              parentInstance[methodName](this.rtnItem);
            }else{
              parentInstance[methodName];
            }
          } else {
            this.showAlert({alertDialogToggle: true, msg: '<font color="red"><b>'+ this.originTabNm + '</b></font> 메뉴로 이동 후 이용해 주시기 바랍니다.', iconClass: 'is-info', type: 'default'});
            return;
          }
        }else{
          this.showAlert({alertDialogToggle: true, msg: '<font color="red"><b>'+ this.originTabNm + '</b></font> 메뉴로 이동 후 이용해 주시기 바랍니다.', iconClass: 'is-info', type: 'default'});
          return;
        }
      } else {
        this.showAlert({alertDialogToggle: true, msg: '<font color="red"><b>'+ this.originTabNm + '</b></font> 메뉴로 이동 후 이용해 주시기 바랍니다.', iconClass: 'is-info', type: 'default'});
        return;
      }
    },

    // closePopup
    closePopup(){
      window.close();
    }
  },
};
</script>