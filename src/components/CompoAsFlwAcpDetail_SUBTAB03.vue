<template>
  <div>
    <!-- header -->
    <div class="d-flex align-center">
      <div class="pl-header is-no-boredr">
        <v-icon class="pl-icon20 square-title" style="margin-top: 2px;"></v-icon>
        <div class="pl-subtit ml-1">세대 특이사항 현황</div>
      </div>
      <div class="pl-btn-wrap ml-auto">
        <!-- 특이사항 등록 -->
        <v-menu
          v-model="dialogEspReg"
          min-width="350"
          bottom
          left
          content-class="pl-menu-drop"
          :close-on-content-click=false
          offset-y
        >
          <template v-slot:activator="{attrs: menuAttrs }">
            <v-btn
              v-bind="menuAttrs"
              class="pl-btn is-sub is-sm"
              @click="openForm">특이사항 등록</v-btn>
          </template>
          <!-- 특이사항 등록 v-menu -->
          <div class="px-3 py-2">
            <v-form ref="hshMmoForm">
              <!-- header -->
              <div class="d-flex">
                <h3 style="font-size: 16px">세대 특이사항</h3>
                <v-btn
                  @click="dialogEspReg = false"
                  plain
                  min-width="22"
                  height="22"
                  class="pl-tooltip-btn ml-auto"
                  >
                  <v-icon
                    small
                    class="pl-icon20 dialog-close-black">
                  </v-icon>
                </v-btn>
              </div>
              <!-- form -->
              <v-textarea
                v-model="CTS"
                height="120"
                class="pl-form is-noresize is-mt-s"
                :spellcheck="false"
                placeholder="특이사항 입력"
                :rules="validateRules.CTS"
              />
              <div class="pl-btn-wrap is-mt-m">
                <v-btn
                  class="pl-btn is-trans ml-auto"
                  @click="btnCancel">취소</v-btn>
                <v-btn class="pl-btn" @click="btnSave">저장</v-btn>
              </div>
            </v-form>
          </div>
        </v-menu>
      </div>
    </div>
    <!-- grid -->
    <v-data-table
      class="pl-grid is-mt-s"
      :headers="headers"
      :items="HSH_MMO_LIST"
      fixed-header
      item-key="ROW_NUMBER"
      height="331px"
      :items-per-page="ROW_PER_PAGE"
      hide-default-footer
      no-data-text="등록된 데이터가 없습니다.">
    </v-data-table>

  </div>
</template>

<script>
export default {
  name: "CompoAsFlwAcpDetail_SUBTAB03", //세대 특이사항
  components: {
  },
  props: {
    TabProp: {
      type: Number,
      default: null,
    },
    DataProp: {
      type: Object,
    },
    FlwAcpInfoProp: {
      type: Object,
    }
  },
  data() {
    return {
      dialogEspReg: false,

      HSH_MMO_LIST: [],

      ARA_HDQ_CD: '',
      MGOF_CD: '',
      HNO: '',
      CTS: '',

      FLW_ACP_INFO: {},


      // grid
      ROW_PER_PAGE: -1,
      headers: [
        { text: '번호', value: 'ROW_NUMBER', align: 'center', width: '50px', sortable: false},
        { text: '세대 특이사항 ', value: 'CTS', align: '', width: '', sortable: false },
        { text: '작성자 ', value: 'RGPR', align: '', width: '120px', sortable: false },
        { text: '작성일 ', value: 'WOU_DT', align: '', width: '120px', sortable: false },
      ],
      items: [
      ],


      validateRules: {
        CTS: [
          v => !!v || '특이사항은 필수 항목 입니다.',
        ],
      },


      //알림창 메시지
      MESSAGE : {
        CONFIRM : {
          REG : {alertDialogToggle: true, msg: '저장하시겠습니까?', iconClass: 'is-info', type: 'confirm', callYes: this.hshMmoSave, callNo: this.closeMsg}
        },
        ALERT : {
          SUCCESS : {alertDialogToggle: true, msg: '정상 처리 되었습니다.', iconClass: 'is-info', type: 'default'}
          , REQUIRED_V_FLW_ACP_SN: {alertDialogToggle: true, msg: 'AS접수 내역을 선택해주세요.', iconClass: 'is-info', type: 'default'}
          , INVALID_LCLS_CD: {alertDialogToggle: true, msg: '시설구분이 세대별일 경우에만 특이사항 등록이 가능합니다.', iconClass: 'is-info', type: 'default'}
        },
      }

    }
  },
  mounted() {
  },
  created() {
    
    if(this.DataProp && this.DataProp.HNO) {
      this.ARA_HDQ_CD = this.DataProp.ARA_HDQ_CD;
      this.MGOF_CD = this.DataProp.MGOF_CD;
      this.HNO = this.DataProp.HNO;
      this.getHshMmoList();
    }
    if(this.FlwAcpInfoProp) {
      this.FLW_ACP_INFO = this.FlwAcpInfoProp;
    }
  },
  computed: {
    
  },
  watch: {
    DataProp() {
      console.log("watch", this.DataProp)
      if(this.DataProp && this.DataProp.HNO && this.HNO != this.DataProp.HNO) {
        this.ARA_HDQ_CD = this.DataProp.ARA_HDQ_CD;
        this.MGOF_CD = this.DataProp.MGOF_CD;
        this.HNO = this.DataProp.HNO;
        this.getHshMmoList();
      }
    },
    FlwAcpInfoProp() {
      if(this.FlwAcpInfoProp) {
        this.FLW_ACP_INFO = this.FlwAcpInfoProp
      }
      console.log("watch FlwAcpInfoProp", this.FLW_ACP_INFO, this.FlwAcpInfoProp)
    }
  },
  methods: {
    async getHshMmoList() {
        const postParam = {
          ARA_HDQ_CD: this.ARA_HDQ_CD,
          MGOF_CD: this.MGOF_CD,
          HNO: this.HNO
        };
        const headParam = {head: {
          ns: 'lhcs.phone.as.dao.PhoneAsFlwAcpMapper_Cotis'
        }};
        const response = await this.common_postCall("/api/biz/common/external/select/selectHshMmoList", postParam, headParam);
        if(!response.HEADER.ERROR_FLAG) {
          this.HSH_MMO_LIST = response.DATA;
        }
    },
    
    //특이사항 등록 폼 열기.
    openForm() {
      console.log("openForm", this.FLW_ACP_INFO, this.HNO )
      if (this.FLW_ACP_INFO && this.FLW_ACP_INFO.V_FLW_ACP_SN && this.FLW_ACP_INFO.V_FLW_ACP_SN == "") {
        this.showAlert(this.MESSAGE.ALERT.REQUIRED_V_FLW_ACP_SN);
        return
      }
      if(this.HNO == '' || this.HNO == "0" || this.HNO == 0) {
        this.showAlertInfo({msg: "세대 정보가 없습니다."});
        return
      }

      if (this.FLW_ACP_INFO && this.FLW_ACP_INFO.LCLS_CD && this.FLW_ACP_INFO.LCLS_CD != "3") {
        this.showAlert(this.MESSAGE.ALERT.INVALID_LCLS_CD);
        return
      }
      this.dialogEspReg = true;
    },

    btnSave() {
      if(!this.$refs.hshMmoForm.validate()) {
        return false;
      };

      this.showAlert(this.MESSAGE.CONFIRM.REG);
    },

    //세대특이사항 저장.
    async hshMmoSave() {
      const postParam = {
          ARA_HDQ_CD: this.ARA_HDQ_CD,
          MGOF_CD: this.MGOF_CD,
          HNO: this.HNO,
          CTS: this.CTS
        };
        const headParam = {head: {}};
        const response = await this.common_postCall("/phone-api/as/flwacp/insertCotisHshMmo", postParam, headParam);
        if(!response.HEADER.ERROR_FLAG) {
          this.getHshMmoList();
          this.btnCancel();
          this.closeMsg();
          this.showToastInfo({msg: '정상 처리되었습니다.'})
        }
    },

    //취소 버튼
    btnCancel() {
      this.CTS = '';
      this.dialogEspReg = false;
    },

    //메시지창 종료
    closeMsg(){
      this.$store.commit('alertStore/hideAlert');
    },
  },
};
</script>

<style lang="scss" scoped>

</style>