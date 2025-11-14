<template>
  <div>
      <v-form ref="form">
    <p>상담 메인 화면의 상담도구 관리에서 사용할 내용을 등록하고 관리합니다. 등록할 분류를 선택하신 후 내용을 입력 후 [저장] 버튼을 클릭하십시오.</p>
    <div class="pl-form-inline-wrap vertical label-80 gap-8 is-mt-s">
      <compo-cutt-type-combo
          :DataProp="cuttType"
          :FormSeProp="'REG'"
          :DisabledProp="false"
          @EMIT_CUTT_TYPE="setCuttType"
      />
        <div class="pl-form-inline">
        <span class="pl-label">
          제목
        </span>
          <div class="pl-desc">
            <v-text-field
                class="pl-form type-middle flex-grow-1"
                placeholder="제목 입력"
                v-model="saveParams.title"
                :rules="validateRules.TITLE"
            />
            <v-checkbox
                class="pl-check flex-grow-0"
                label="상단노출"
                v-model="saveParams.topYn"
                @click="mixin_testLog(saveParams.topYn)"
            ></v-checkbox>
          </div>
        </div>

        <div class="pl-form-inline">
        <span class="pl-label">
          상세 내용
        </span>
          <div class="pl-desc">
            <v-textarea
                class="pl-form is-noresize"
                :spellcheck="false"
                placeholder="상담도구 내용을 입력하세요"
                height="150"
                v-model="saveParams.contents"
                :rules="validateRules.CONTENTS"
            />
          </div>
        </div>
        <div class="pl-form-inline">
        <span class="pl-label">
          정렬 순서
        </span>
          <div class="pl-desc">
            <v-text-field
                class="pl-form type-middle is-sm flex-grow-0"
                oninput="javascript: this.value=this.value.replace(/[^-\.0-9]/g,'');"
                v-model="saveParams.sortOrd"
            />
          </div>
        </div>
    </div>
      </v-form>
  </div>
</template>

<script>
import CompoCuttTypeCombo from '@/components/CompoCuttTypeCombo'

export default {
  name: 'CSM_M0500_DIALOG_DETAIL', //상담도구 상세
  components: {
    CompoCuttTypeCombo
  },
  props: {
    TOOL_PROPS: {
      type: Object,
      default: null
    },
    SORT_ORD_PROP: {
      type: Array,
      default: ()=>{
        return []
      }
    },
    SAVE_TRIGGER_PROPS: {
      type: Boolean,
      default: false
    },
    RESET_TRIGGER_PROPS: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return {
      modelYear: '2024',
      validateRules: {
        TITLE: [
          v => !!v || '제목은 필수 입력 항목입니다.',
        ],
        CONTENTS: [
          v => !!v || '내용은 필수 입력 항목입니다.',
        ],
        SORT: [
          v => !!v || '정렬순서는 필수 입력 항목입니다.',
        ]
      },

      saveParams: {
        cuttToolId: '',
        largeType: '',
        middleType: '',
        smallType: '',
        title: '',
        topYn: false,
        contents: '',
        sortOrd: '',
      },
      cuttType: new Array(3),
      headTextProp : ['전체','전체','전체','전체'],
      toolProps: this.TOOL_PROPS,
      sortOrdProps : this.SORT_ORD_PROP

    }
  },
  created() {
    this.setParam(this.TOOL_PROPS);
  },
  mounted() {
    this.toolProps = this.TOOL_PROPS;
  },
  methods: {
    setParam() {
      if (!this.mixin_isEmpty(this.toolProps)) {
        this.saveParams = {
          cuttToolId: this.toolProps.CUTT_TOOL_ID,
          title: this.toolProps.TITLE,
          topYn: this.toolProps.TOP_YN ==='N' ? false : true,
          contents: this.toolProps.CONTENTS,
          sortOrd: this.toolProps.SORT_ORD,
          largeType: this.toolProps.CUTT_LCD,
          middleType: this.toolProps.CUTT_MCD,
          smallType: this.toolProps.CUTT_SCD,
        }

        this.cuttType.forEach((cutt, idx) => {
          this.cuttType[idx] = ''; //초기화
        });
        this.cuttType=[this.toolProps.CUTT_LCD,this.toolProps.CUTT_MCD,this.toolProps.CUTT_SCD];


      } else {
        this.initSaveParam();
      }
    },
    initSaveParam() {
      // this.resetValidation();
      this.saveParams = {
        cuttToolId: '',
        title: '',
        topYn: false,
        contents: '',
        sortOrd: '',
        largeType: '',
        middleType: '',
        smallType: '',
      }
    },
    beforeSave() {
      let action = this.mixin_isEmpty(this.saveParams.cuttToolId) ? '등록' : '수정'
      if (!this.validate()) {
        return this.showToastCaution({msg: '필수 항목을 입력해 주세요'})
      } else if(this.mixin_isEmpty(this.saveParams.smallType)){
        return this.showToastCaution({msg: '상담유형을 선택하세요'})
      }else if( !this.mixin_isEmpty(this.saveParams.sortOrd) ){
        let sort = this.saveParams.sortOrd.toString()
        if(this.sortOrdProps.findIndex(item => item === sort) !== -1 ){
          return this.showToastCaution({msg: '중복된 정렬 순서 입니다.'})
        }else{
          this.showConfirmInfo({msg: `상담도구를 ${action} 하시겠습니까?`, callYes: this.saveTool, callNo: this.closeAlert})
        }
      }else{
        this.showConfirmInfo({msg: `상담도구를 ${action} 하시겠습니까?`, callYes: this.saveTool, callNo: this.closeAlert})
      }
    },
    async saveTool() {
      let saveSe = this.mixin_isEmpty(this.saveParams.cuttToolId) ? 'insert' : 'update';
      let postParam = {
        CUTT_TOOL_ID: saveSe === 'insert' ? '' : this.saveParams.cuttToolId,
        SCD: this.saveParams.smallType,
        TITLE: this.saveParams.title,
        CONTENTS: this.saveParams.contents,
        TOP_YN: this.saveParams.topYn === true ? 'Y' : 'N',
        SORT_ORD: this.mixin_isEmpty(this.saveParams.sortOrd) ? Math.max(...this.sortOrdProps.map(Number)) + 1 : this.saveParams.sortOrd
      }

      let headParam = {
        head: {
          ns: 'lhcs.phone.cuttMng.dao.PhoneCuttToolMngMapper',
          sn: `${saveSe}Tool`
        }
      }
      if (saveSe === 'insert') this.$set(headParam.head, 'seq_key', 'CUTT_TOOL_ID');
      const response = await this.common_postCall(`/api/biz/common/${saveSe}/${saveSe}Tool`, postParam, headParam);
      if (!response.HEADER.ERROR_FLAG) {
        this.showToastInfo({
          msg: '정상 처리 되었습니다.', callAfter: () => {
            this.closeAlert();
            this.initSaveParam();
            this.$emit('getCuttToolList', false)
            this.$emit('hideReg')
          }
        })
      } else {
        this.showAlertCaution({msg: '처리 중 문제가 발생했습니다.'})
      }

    },
    setCuttType(data) {
      this.saveParams.cuttType = data;
      data.forEach((item, idx) => {
        if (idx == 0) this.saveParams.largeType = item
        if (idx == 1) this.saveParams.middleType = item
        if (idx == 2) this.saveParams.smallType = item
      })
    },
    //validate check
    validate () {
      return this.$refs.form.validate();
    },

    //등록 및 상세보기 form 초기화
    resetValidation() {
      this.$refs.form.reset();
    },

  },
  computed: {
  },
  watch: {
    TOOL_PROPS() {
      this.toolProps = this.TOOL_PROPS;
    },
    toolProps(){
      if (!this.mixin_isEmpty(this.toolProps)) {
        this.initSaveParam();
        this.setParam(this.toolProps);
      } else {
        this.initSaveParam();
      }
    },
    SAVE_TRIGGER_PROPS() {
      this.beforeSave();
    },
    RESET_TRIGGER_PROPS() {
      this.cuttType.forEach((cutt, idx) => {
        this.cuttType[idx] = ''; //초기화
      });
      this.resetValidation()
    },
    SORT_ORD_PROP : {
      handler(){
        console.log(this.SORT_ORD_PROP)
        this.sortOrdProps = this.SORT_ORD_PROP
      }
    }
  },
};
</script>

<style lang="scss" scoped>

</style>