<template>
  <div class="">
    <!-- tab -->
    <div class="is-border-bottom">
      <v-tabs
        v-model="tabs1"
        slider-size="2"
        class="pl-tabs type-subtab is-noborder">
        <CompoTabItems :TabsList=tabsList :RESET_ABLE="RESET_ABLE" :CUST_INFO="CUST_INFO">
        </CompoTabItems>
        <!-- 버튼 -->
        <v-btn
          v-if="!readOnly && ((SCH_CUSTCO_ID == '4' && tabs1 == 1) ||  (SCH_CUSTCO_ID != '4' && tabs1 == 0)) && !detailYn"
          @click="mixin_showDialog('CustExpctnCn')"
          :disabled="editAble ? false : true"
          class="pl-btn is-sm is-sub ml-auto">등록</v-btn>
      </v-tabs>
    </div>
    <v-tabs-items
      v-model="tabs1"
      style="height: 99px;"
      >
      <div class="fill-height" >
        <template v-for="(item, index) in tabsList" >
          <v-tab-item :key="index" transition="fade-transition">
            <div
              :class="`fill-height tab-contents`">
              <component 
                :is="item.content" 
                :RESET_ABLE="RESET_ABLE"
                :CUST_INFO="CUST_INFO"
                :SCH_CUSTCO_ID="SCH_CUSTCO_ID"
                :detailYn="detailYn">
              </component>
            </div>
          </v-tab-item>
        </template>
      </div>
    </v-tabs-items>
    <!-- dialog: 등록 특이사항 -->
    <v-dialog
      v-model="dialogCustExpctnCn"
      content-class="dialog-draggable"
      hide-overlay>
      <div class="draggable-area">drag area</div>
      <compo-dialog
        header-title="특이사항 등록"
        @hide="mixin_hideDialog('CustExpctnCn')"
        @submit="submitDialog('CustExpctnCn')"
      >
        <template slot="body">
          <div class="pl-form-inline-wrap vertical label-80">
            <div class="pl-form-inline">
              <span class="pl-label">
                휴대전화
              </span>
              <div class="pl-desc">
                <v-text-field
                  v-model="CUST_INFO.CUST_PHN_NO"
                  class="pl-form type-middle"
                  disabled
                />
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">
                고객ID
              </span>
              <div class="pl-desc">
                <v-text-field
                  v-model="CUST_INFO.CUST_IDNTF_NO"
                  class="pl-form type-middle"
                  disabled
                />
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">
                특이사항
              </span>
              <div class="pl-desc">
                <v-textarea
                  v-model="EXCPTN_CN"
                  class="pl-form is-noresize"
                  :spellcheck="false"
                  placeholder="특이사항 내용 입력"
                />
              </div>
            </div>
          </div>
        </template>
        <template slot="footer">
          <v-btn class="pl-btn is-trans" @click="mixin_hideDialog('CustExpctnCn')">닫기</v-btn>
          <v-btn class="pl-btn" @click="custExpctnCnValid">저장</v-btn>
        </template>
      </compo-dialog>
    </v-dialog>

  </div>
</template>

<script>
import CompoTabItems from '@/components/CompoTabItems.vue';
import CompoInfoAsContract_TAB01 from '@/components/csl/CompoInfoAsContract_TAB01'
import CompoInfoAsContract_TAB02 from '@/components/csl/CompoInfoAsContract_TAB02'

export default {
  name: "CompoInfoAsContract", //상담 - 바로처리 계약정보 영역

  components: {
    CompoTabItems,
    CompoInfoAsContract_TAB01,
    CompoInfoAsContract_TAB02,

  },
  props: {
    SCH_CUSTCO_ID: {
      type: String,
      default : ''
    },
    RESET_ABLE: {
      type: Boolean,
      default : false
    },
    readOnly: {
      type: Boolean,
      default : false
    },
    detailYn: {
      type: Boolean,
      default : false
    },
  },
  data() {
    return {
      //tab
      tabs1: null,
      tabsList: [
        { title: '계약정보', content: 'CompoInfoAsContract_TAB01', badge: false,},
        { title: '특이사항', content: 'CompoInfoAsContract_TAB02', badge: false},
      ],
      // dialog
      dialogCustExpctnCn: false,
      editAble : false,

      CUST_INFO: {}, //고객 정보
      EXCPTN_CN: '', //특이사항 내용
      
    }
  },
  computed: {
  },
  watch: {
    RESET_ABLE() {
      this.editAble = false;
      this.CUST_INFO = {};
    },
    tabs1(){
      if(this.CUST_INFO.CUST_ID){
        this.editAble = true;
      }else{
        this.editAble = false;
      }
    }
  },
  mounted() {
  },
  beforeDestroy(){
    this.$eventBus.$off("setExpctnCnCustInfo"); //eventBus 중복방지를 위해 off
    this.$eventBus.$off("expctnBdgView"); //eventBus 중복방지를 위해 off
  },
  async created() {
    // this.SCH_CUSTCO_ID = this.SCH_CUSTCO_ID?this.SCH_CUSTCO_ID:this.computedUserCenter;
    //고객정보
    this.$eventBus.$on("setExpctnCnCustInfo", (CUST_INFO) => {
      this.CUST_INFO = CUST_INFO;
      this.editAble = true;
      //특이사항 건수 조회하여 뱃지 표시
      this.getCustExcptnCount();
    });
    
    //특이사항 벳지
    this.$eventBus.$on("expctnBdgView", (flag) => {
      this.tabsList[this.computedUserCenter !== '4'?0:1].badge = flag;
    });

    if(this.SCH_CUSTCO_ID !== '4'){
      let tempTab = this.tabsList;
      this.tabsList = [];
      tempTab.forEach((item, idx) => {
        if(idx > 0) this.tabsList.push(item);
      });
    }

    
  },
  methods: {
    custExpctnCnValid(){
      if(this.mixin_isEmpty(this.EXCPTN_CN.trim())){
        this.showAlertInfo({msg:'특이사항 내용을 입력해 주세요.'});
        return;
      }

      this.showConfirmInfo({
        msg:'저장 하시겠습니까?'
        , callYes : () => {
          this.custExpctnCnProc();
        }
        , callNo : this.closeAlert
      });
    },

    async custExpctnCnProc(){
      let postParam = {
        CUST_ID : this.CUST_INFO.CUST_ID
        , EXCPTN_CN : this.EXCPTN_CN
      };
      let headParam = {head: {}};
      const response = await this.common_postCall("/api/cust/custExcptnCnProc", postParam, headParam);

      if(response && !response.HEADER.ERROR_FLAG) {
        this.showAlertInfo({msg : '처리 되었습니다.'});
        this.EXCPTN_CN = '';
        this.mixin_hideDialog('CustExpctnCn');
        this.$emit('setChgData', this.PropData);
        
        if(this.computedUserDetailType === 'MANAGER'){
          this.mixin_reloadCuttStat('USER_APLY_PROC_STAT');
        }else{
          this.$eventBus.$emit('reloadCustExcptnList');//고객 특이사항 목록 조회
        }

        return;
      }
    },

    //고객 특이사항 건수 조회하여 뱃지 출력
    async getCustExcptnCount() {
      if(this.CUST_INFO.CUST_ID){
        this.items = [];
        let postParam = {
          CUST_ID : this.CUST_INFO.CUST_ID
          , SCH_STTS_CD : 'RCAP1' //승인
        };

        let headParam = {
          head: {
            ns: "lhcs.cust.dao.CustMapper"
          }
        };
        const response = await this.common_postCall("/api/biz/common/select/custExcptnCount", postParam, headParam);
        
        if (!response.HEADER.ERROR_FLAG){
          const count = response.DATA[0].COUNT;

          if(parseInt(count) > 0) {
            this.tabsList[this.computedUserCenter !== '4'?0:1].badge = true;
          } else {
            this.tabsList[this.computedUserCenter !== '4'?0:1].badge = false;
          }
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>

</style>