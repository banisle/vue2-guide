<template>
  <div>
    <div v-if="!mixin_isEmpty(item.title)" class="pl-quick-layer-header"><h1>{{ item.title }}</h1>
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
      :DataProp="item.popData"
      :popData="item.popData"
      :isPopup="true"
      :PROPS_TAB_INDEX="item.PROPS_TAB_INDEX"
      :PROPS_USER_INFO="item.PROPS_USER_INFO"
      @sendDataToParent="sendDataToParent"
      @Close="closePopup"
    ></component>
    <!-- <v-btn @click="sendDataToParent(callback)">부모 창 메서드 호출{{ item }}</v-btn> -->
  </div>
</template>

<script>
import CompoFindAsAdr from '@/components/CompoFindAsAdr.vue';
import CompoAsMgofInfo from '@/components/CompoAsMgofInfo.vue';
import CompoAsInitHist from '@/components/CompoAsInitHist.vue';
import CompoFindAsAdmFrm from '@/components/CompoFindAsAdmFrm.vue';

import CompoFindAsBldgAdr from '@/components/CompoFindAsBldgAdr.vue';
import CompoFindAsIcpr from '@/components/CompoFindAsIcpr.vue';
import CompoFindAsBldgNo from '@/components/CompoFindAsBldgNo.vue';
import CompoFindAsMntnFlwCs from '@/components/CompoFindAsMntnFlwCs.vue';
import CompoFindAsHsNo from '@/components/CompoFindAsHsNo.vue';

import HOME_TEAM_TAB01_DETAIL from '@/views/page/Home/HOME_TEAM_TAB01_DETAIL.vue'


export default {
  components: {
    CompoFindAsAdr,
    CompoAsMgofInfo,
    CompoAsInitHist,
    CompoFindAsAdmFrm,
    CompoFindAsBldgAdr,
    CompoFindAsBldgNo,
    CompoFindAsHsNo,
    CompoFindAsMntnFlwCs,
    CompoFindAsIcpr,
    HOME_TEAM_TAB01_DETAIL,
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
        sessionStorage.setItem('popupItem', JSON.stringify(newValue));
      }
    }
  },
  beforeDestroy() {
    window.removeEventListener('message', this.receiveData, false);
    this.$eventBus.$off("closeSearchPopup"); //eventBus 중복방지를 위해 off
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

    //팝업 닫기
    this.$eventBus.$on("closeSearchPopup", () => {
      this.closePopup();
    });

    this.loadState();
  },
  mounted() {
  },
  methods: {
    loadState() {
      const savedItem = sessionStorage.getItem('popupItem');
      if (savedItem) {
        this.item = JSON.parse(savedItem);
      } else if (window.opener && window.opener.item) {
        this.item = window.opener.item;
        sessionStorage.setItem('popupItem', JSON.stringify(this.item));
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
            sessionStorage.setItem('popupItem', JSON.stringify(this.item));
          }
        }
      }
    },

    //부모창 메소드 호출 및 데이터 전달
    sendDataToParent(rtnItem){
      if (window.opener && window.opener.parentVueInstance) {
        window.opener.parentVueInstance.mixin_parentSessionStorage(); //부모창 sessionStorage 변경 값 확인을 위해 재주입
        if(this.originTabId === JSON.parse(window.sessionStorage.getItem("vuex")).commonStore.active_tab.id){ //팝업창 오픈한 Tab 활성 여부
          const parentInstance = window.opener.parentVueInstance;
          console.log('this.item.callback ======> ', this.item.callback, rtnItem);
          if (typeof parentInstance[this.item.callback] === 'function') {
            if(rtnItem){
              parentInstance[this.item.callback](rtnItem);
            }else{
              parentInstance[this.item.callback];
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