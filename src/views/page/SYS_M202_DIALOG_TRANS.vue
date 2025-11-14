<template>
  <div class="">
    <!-- top -->
    <div class="d-flex ">
      <h3 style="font-size: 16px">부서이동</h3>
      <v-btn
        @click="$emit('Close')"
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
    <div class="pt-3">
      <div class="is-border-sub-top pt-3 ">
        <p>이동할 부서와 이동할 부서에서 근무를 시작하는 일자를 선택 후 [부서이동] 버튼을 클릭하십시오.</p>
        <div class="pl-form-inline-wrap vertical label-80 is-mt-m gap-8">
          <div class="pl-form-inline">
            <span class="pl-label">
              현재  부서
            </span>
            <div class="pl-desc">
              <v-text-field
                disabled
                v-model="DEPT_NM"
                class="pl-form type-middle"
              />
            </div>
          </div>
          <div class="pl-form-inline">
            <span class="pl-label">
              이동  부서
            </span>
            <div class="pl-desc">
              <v-text-field
                  class="pl-form is-search type-middle"
                  placeholder="선택"
                  readonly
                  v-model="dataForm.DEPT_NM"
              >
                <template v-slot:append>
                  <v-btn
                      @click="mixin_showDialog('OrgTree')"
                      class="pl-btn has-icon-only"
                  >
                    <span class="pl-icon20 in-search"></span>
                  </v-btn>
                </template>
              </v-text-field>
            </div>
          </div>
          <div class="pl-form-inline">
            <span class="pl-label">
              근무 시작일
            </span>
            <div class="pl-desc">
              <compo-date-picker
                ClassProp="type-middle flex-grow-1"
                DateType="dateInput"
                :DateProp.sync="WORK_BGNG_YMD"/>
            </div>
          </div>
        </div>
      </div>
    </div>
    <v-dialog
        v-model="dialogOrgTree"
        content-class="dialog-draggable"
        hide-overlay>
        <compo-dialog header-title="조직 선택" @hide="mixin_hideDialog('OrgTree')">
          <template slot="body">
            <CompoTree ref="ognzDataCompo" :SRCH_DEPT_KEY="dataForm.DEPT_KEY" :ExpandedProp=true @Close="dialogOrgTree = false" />
          </template>
          <template slot="footer">
            <v-btn class="pl-btn is-sub" @click="mixin_hideDialog('OrgTree')">닫기</v-btn>
            <v-btn class="pl-btn" @click="setOgnzSubmitData">선택</v-btn>
          </template>
        </compo-dialog>
    </v-dialog>
  </div>
</template>

<script>
import CompoTree from '@/components/CompoTree.vue';
export default {
  name: 'SYS_M202_DIALOG_TRANS', //부서이동
  props:{
    USER_DEPT:{
      type: Object,
    },
    TRAN_USER_DEPT:{
      type: Object,
    },
  },
  components: {
    CompoTree
  },
  data() {
    return {
      WORK_BGNG_YMD: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      DEPT_ID: '',
      DEPT_NM: '',

      dataForm: {},

      dialogOrgTree: false
    }
  },
  methods: {
    setOgnzSubmitData() {
      this.$refs.ognzDataCompo.setOgnzSubmitData();
    },
  },
  mounted() {
    this.DEPT = this.USER_DEPT.DEPT;
    this.DEPT_NM = this.USER_DEPT.DEPT_NM;
    // this.WORK_BGNG_YMD = this.USER_DEPT.WORK_BGNG_YMD.substr(0, 4) + '-' + this.USER_DEPT.WORK_BGNG_YMD.substr(4, 2) + '-' + this.USER_DEPT.WORK_BGNG_YMD.substr(6, 2);
    this.TRAN_USER_DEPT.WORK_BGNG_YMD = this.WORK_BGNG_YMD;
  },
  created() {
    this.$eventBus.$off("setOgnzTreeInfo"); //eventBus 중복방지를 위해 off
    this.$eventBus.$on("setOgnzTreeInfo", (ognz) => {
      this.dataForm.DEPT_ID = ognz.DEPT_ID
      this.dataForm.DEPT_NM = ognz.DEPT_NM
      this.dataForm.CUSTCO_ID = ognz.CUSTCO_ID
      this.dataForm.UP_DEPT_ID = ognz.UP_DEPT_ID
      this.dataForm.UP_CUSTCO_ID = ognz.UP_CUSTCO_ID

      this.TRAN_USER_DEPT.CUSTCO_ID = ognz.CUSTCO_ID;
      this.TRAN_USER_DEPT.DEPT_ID = ognz.DEPT_ID;
      this.TRAN_USER_DEPT.DEPT_NM = ognz.DEPT_NM;
    });
  },
  computed: {
  },
  watch: {
    USER_DEPT(){
      this.DEPT_ID = this.USER_DEPT.DEPT_ID;
      this.DEPT_NM = this.USER_DEPT.DEPT_NM;
      this.WORK_BGNG_YMD = this.USER_DEPT.WORK_BGNG_YMD.substr(0, 4) + '-' + this.USER_DEPT.WORK_BGNG_YMD.substr(4, 2) + '-' + this.USER_DEPT.WORK_BGNG_YMD.substr(6, 2);

      this.dataForm = {};
    },
    WORK_BGNG_YMD(){
      this.TRAN_USER_DEPT.WORK_BGNG_YMD = this.WORK_BGNG_YMD.replaceAll('-','');
    },
  },
};
</script>

<style lang="scss" scoped>

</style>