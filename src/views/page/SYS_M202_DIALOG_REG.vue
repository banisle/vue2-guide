<template>
  <div style="display: contents;">
    <div class="pl-quick-layer-body" style="flex: 0 0 calc(100% - 217px);">
      <!-- <p>
        사용자 정보 변경 시 수정 이력은 시스템에 자동 기록되어 집니다.<br>
        사용자 초기 비밀번호는 “사용자 ID + 1!”로 설정됩니다.
      </p> -->
      <v-form ref="form">
        <div class="pl-form-inline-wrap label-120 is-mt-m" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px">
          <div class="pl-form-inline" >
            <span class="pl-label">
              성명
            </span>
            <div class="pl-desc">
              <v-text-field
                v-model="dataForm.USER_NM"
                class="pl-form type-middle"
                v-byte-counter="300"
                :rules="validateRules.USER_NM"
              />
            </div>
          </div>
          <div class="pl-form-inline" >
            <span class="pl-label">
              아이디
            </span>
            <div class="pl-desc">
              <v-text-field
                v-model="dataForm.LGN_ID"
                class="pl-form type-middle"
                v-byte-counter="300"
                :disabled="dataForm.USER_ID === '' ? false : true"
              />
              <v-btn
                class="pl-btn is-esp flex-grow-0"
                @click="dpcnChk()"
                :disabled="dataForm.USER_ID == '' ? false : (dataForm.LGN_ID == dataForm.ORG_LGN_ID ? true : false )"
                >중복체크
              </v-btn>
            </div>
          </div>
        </div>
        <!-- 사번 입사일 -->
        <div class="pl-form-inline-wrap label-120 mt-2" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px">
          <div class="pl-form-inline" >
            <span class="pl-label">
              LH주거복지정보 입사일
            </span>
            <div class="pl-desc">
              <compo-date-picker
                DateType="dateInput"
                ClassProp="flex-grow-1 type-middle"
                @dateChange="(event)=>{setTermDt(event,'ENTER_DT')}"
                :DateProp.sync="ENTER_DT"
              />
            </div>
          </div>
          <div class="pl-form-inline" >
            <span class="pl-label">
              LH콜센터 입사일
            </span>
            <div class="pl-desc">
              <compo-date-picker
                DateType="dateInput"
                ClassProp="flex-grow-1 type-middle"
                @dateChange="(event)=>{setTermDt(event,'CALL_DT')}"
                :DateProp.sync="CALL_DT"
              />
            </div>
          </div>
        </div>
        <div class="pl-form-inline-wrap label-120 mt-2" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px">
          <div class="pl-form-inline" >
            <span class="pl-label">
              LH주거복지정보 사번
            </span>
            <div class="pl-desc">
              <v-text-field
                v-model="dataForm.LHCS_EMP_NO"
                class="pl-form type-middle"
                placeholder="" />
            </div>
          </div>
          <div class="pl-form-inline" >
            <span class="pl-label">
              LH포털 사번
            </span>
            <div class="pl-desc">
              <v-text-field
                v-model="dataForm.EMP_NO"
                class="pl-form type-middle"
                placeholder="" />
            </div>
          </div>
        </div>


        <div class="pl-form-inline-wrap label-120 mt-2" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px">
          <!-- <div class="pl-form-inline" >
            <span class="pl-label">
              조직그룹
            </span>
            <div class="pl-desc">
              <v-select
                  class="pl-form type-middle"
                  :items="combo_custco_list"
                  v-model="dataForm.CUSTCO"
                  placeholder="선택"
              />
            </div>

          </div> -->
          <div class="pl-form-inline" >
            <span class="pl-label">
              소속
            </span>
            <div class="pl-desc">
              <v-text-field
                  class="pl-form is-search type-middle"
                  placeholder="선택"
                  :disabled="true"
                  v-model="dataForm.DEPT_NM"
                  :rules="validateRules.DEPT"
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
          <div class="pl-form-inline" v-if="SHOW_MNG_CUSTCO">
            <span class="pl-label">
              담당 센터
            </span>
            <div class="pl-desc">
              <v-select
                  class="pl-form type-middle"
                  :items="combo_custco_list"
                  v-model="dataForm.MNG_CUSTCO_DEPT_ID"
                  placeholder="선택"
              />
            </div>
          </div>
        </div>
        <div class="pl-form-inline-wrap label-120 mt-2" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px">
          <div class="pl-form-inline" >
            <span class="pl-label">
              고용형태
            </span>
            <div class="pl-desc">
              <v-select
                class="pl-form type-middle"
                v-model="dataForm.EPLMT_CD"
                :items="mixin_common_code_get(this.common_code, 'WORK_TP')"
                placeholder="선택"
              />
            </div>
          </div>
          <div class="pl-form-inline" >
            <span class="pl-label">
              직위
            </span>
            <div class="pl-desc">
              <v-select
                class="pl-form type-middle"
                v-model="dataForm.JBPS_CD"
                :items="mixin_common_code_get(this.common_code, 'T203')"
                placeholder="선택"
              />
            </div>
          </div>
        </div>
        <div class="pl-form-inline-wrap label-120 mt-2" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px">
          <div class="pl-form-inline" >
            <span class="pl-label">
              직급
            </span>
            <div class="pl-desc">
              <v-select
                class="pl-form type-middle"
                v-model="dataForm.DUTY_CD"
                :items="mixin_common_code_get(this.common_code, 'T207')"
                placeholder="선택"
              />
            </div>
          </div>
          <div class="pl-form-inline" >
            <span class="pl-label">
              근무형태
            </span>
            <div class="pl-desc">
              <v-select
                  class="pl-form type-middle"
                  v-model="dataForm.WORK_STTS_CD"
                  :items="mixin_common_code_get(this.common_code, 'WRK_TM')"
                  placeholder="선택"
              />
            </div>
          </div>
        </div>
        <div class="pl-form-inline-wrap label-120 mt-2" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px">
          <div class="pl-form-inline" >
            <span class="pl-label">
              근무유형
            </span>
            <div class="pl-desc">
              <v-select
                  class="pl-form type-middle"
                  v-model="dataForm.WORK_TYPE_CD"
                  :items="mixin_common_code_get_global(this.common_code_global, 'WT', dataForm.CUSTCO_ID )"
                  placeholder="선택"
              />
            </div>
          </div>
          <div class="pl-form-inline" >
            <span class="pl-label">
              담당지구
            </span>
            <div class="pl-desc">
              <v-select
                :items="mixin_common_code_get(this.common_code, 'CJT')"
                v-model="dataForm.TKCG_RGN_CD"
                class="pl-form type-middle"
                placeholder="선택"
              />
            </div>
          </div>
        </div>
        <div class="pl-form-inline-wrap label-120 mt-2" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px">
          <div class="pl-form-inline" >
            <span class="pl-label">
              권한그룹
            </span>
            <div class="pl-desc">
              <v-select
                class="pl-form type-middle"
                v-model="dataForm.AUTHRT_GROUP"
                :items="authrt_group_drop"
                placeholder="선택"
                :rules="validateRules.AUTH"
                @change="authrtGroupChg"
              />
            </div>
          </div>
          <div class="pl-form-inline" v-if="SHOW_CUSL_AUTH">
            <span class="pl-label">
              상담사 권한
            </span>
            <div class="pl-desc">
              <v-checkbox
                class="pl-check"
                label="선임 상담사"
                v-model="dataForm.MNG_CUSL_YN"
              ></v-checkbox>
            </div>
          </div>
        </div>

        <div class="pl-form-inline-wrap label-120 mt-3 is-border-sub-top pt-3" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px">
          <div class="pl-form-inline" >
            <span class="pl-label">
              재직여부
            </span>
            <div class="pl-desc">
              <v-select
                :items="mixin_common_code_get(this.common_code, 'USER_STTS_CD')"
                v-model="dataForm.USER_STTS_CD"
                class="pl-form type-middle"
                placeholder="선택"
                :rules="validateRules.STTS"
              />
            </div>
          </div>
          <div class="pl-form-inline" >
            <span class="pl-label">
              퇴사일
            </span>
            <div class="pl-desc">
              <compo-date-picker
                DateType="dateInput"
                ClassProp="flex-grow-1 type-middle"
                :DateProp.sync="dataForm.RSGNTN_YMD"/>
            </div>
          </div>
        </div>
        <div class="pl-form-inline-wrap label-120 mt-2" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px">
          <div class="pl-form-inline" >
            <span class="pl-label">
              소프트폰
            </span>
            <div class="pl-desc">
              <v-radio-group
                v-model="dataForm.SOFT_PHN"
                row
                class="pl-radio-group"
              >
                <v-radio
                  v-for="(rad01, index) in radioGroup"
                  :key="radioGroup[index].text"
                  :label="rad01.text"
                  :value="rad01.value"
                  class="pl-radio"
                >
                </v-radio>
              </v-radio-group>
            </div>
          </div>
          <div class="pl-form-inline" >
            <span class="pl-label">
              호전환
            </span>
            <div class="pl-desc">
              <v-radio-group
                v-model="dataForm.TRANS_PHN"
                row
                class="pl-radio-group"
              >
                <v-radio
                  v-for="(rad01, index) in radioGroup2"
                  :key="radioGroup2[index].text"
                  :label="rad01.text"
                  :value="rad01.value"
                  class="pl-radio"
                >
                </v-radio>
              </v-radio-group>
            </div>
          </div>
        </div>
        <div class="pl-form-inline-wrap label-120 mt-2" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px">
          <div class="pl-form-inline" >
            <span class="pl-label">
              내선번호
            </span>
            <div class="pl-desc">
              <v-text-field
                v-model="dataForm.EXT_NO"
                class="pl-form type-middle"
                hide-spin-buttons
                type="text"
                oninput="javascript: this.value = this.value.replace(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣|a-zA-Z]/g, '' );"
              />
            </div>
          </div>
          <div class="pl-form-inline" >
            <span class="pl-label">
              Agent ID
            </span>
            <div class="pl-desc">
              <v-text-field
                v-model="dataForm.AGENT_ID"
                class="pl-form type-middle"
                :disabled="dataForm.USER_ID === '' ? true : false"
              />
            </div>
          </div>
        </div>
        <div class="pl-form-inline-wrap label-120 mt-2" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px">
          <div class="pl-form-inline" >
            <span class="pl-label">
              ACD Grp
            </span>
            <div class="pl-desc">
              <v-text-field
                  class="pl-form is-search type-middle"
                  placeholder="선택"
                  :disabled="true"
                  v-model="dataForm.ACD_GROUP"
              >
                <template v-slot:append>
                  <v-btn
                      @click="mixin_showDialog('AcdGroupTree')"
                      class="pl-btn has-icon-only"
                  >
                    <span class="pl-icon20 in-search"></span>
                  </v-btn>
                </template>
              </v-text-field>
            </div>
          </div>
          <div class="pl-form-inline" >
            <span class="pl-label">
              발신번호
            </span>
            <div class="pl-desc">
              <v-select
                :items="DSPTCH_NO_LIST"
                v-model="dataForm.DSPTCH_NO"
                class="pl-form type-middle"
                placeholder="선택"
              />
            </div>
          </div>
        </div>
        <div class="pl-form-inline-wrap label-120 vertical mt-2">
          <div class="pl-form-inline" style="gap: 12px;">
            <span class="pl-label">
              특수채널상담
            </span>
            <div class="pl-desc">
              <v-checkbox
                class="pl-check ml-2"
                label="카카오 채팅상담"
                v-model="dataForm.CHT_USE_YN"
              ></v-checkbox>
              <v-checkbox
                class="pl-check ml-2"
                label="문자상담"
                v-model="dataForm.SMS_CUTT_USE_YN"
              ></v-checkbox>
              <v-checkbox
                class="pl-check ml-2"
                label="이메일 상담"
                v-model="dataForm.EML_CUTT_USE_YN"
              ></v-checkbox>
            </div>
          </div>
        </div>
        <div class="pl-form-inline-wrap label-120 mt-3 is-border-sub-top pt-3" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px">
          <div class="pl-form-inline" >
            <span class="pl-label">
              녹취 다운로드
            </span>
            <div class="pl-desc">
              <v-radio-group
                v-model="dataForm.REC_DWNLD_YN"
                row
                class="pl-radio-group"
              >
                <v-radio
                  v-for="(rad01, index) in radioGroup3"
                  :key="radioGroup3[index].text"
                  :label="rad01.text"
                  :value="rad01.value"
                  class="pl-radio"
                >
                </v-radio>
              </v-radio-group>
            </div>
          </div>
          <div class="pl-form-inline" >
            <span class="pl-label">
              STT 엑셀 다운로드
            </span>
            <div class="pl-desc">
              <v-radio-group
                v-model="dataForm.STT_DWNLD_YN"
                row
                class="pl-radio-group"
              >
                <v-radio
                  v-for="(rad01, index) in radioGroup3"
                  :key="radioGroup3[index].text"
                  :label="rad01.text"
                  :value="rad01.value"
                  class="pl-radio"
                >
                </v-radio>
              </v-radio-group>
            </div>
          </div>
        </div>
        <div class="pl-form-inline-wrap label-120 vertical mt-3 is-border-sub-top pt-3" >
          <div class="pl-form-inline" style="gap: 12px;">
            <span class="pl-label">
              담당업무
            </span>
            <div class="pl-desc">
              <v-textarea
                class="pl-form is-noresize"
                :spellcheck="false"
                height="100"
                v-model="dataForm.TKCG_TASK_CN"
                placeholder="담당업무 입력"
              />
            </div>
          </div>
          <div class="pl-form-inline" style="gap: 12px;">
            <span class="pl-label">
              담당업무<br>(EAI)
            </span>
            <div class="pl-desc">
              <v-textarea
                disabled
                class="pl-form is-noresize"
                height="100"
                v-model="dataForm.TKCG_TASK_CN_EAI"
                :spellcheck="false"
              />
            </div>
          </div>
          <div class="pl-form-inline" style="gap: 12px;">
            <span class="pl-label">
              전화번호
            </span>
            <div class="pl-desc" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px">
              <v-text-field
                v-model="TEL_NO_LIST[0]"
                class="pl-form type-middle "
                />
              <v-text-field
                v-model="TEL_NO_LIST[1]"
                class="pl-form type-middle "
                />
              <v-text-field
                v-model="TEL_NO_LIST[2]"
                class="pl-form type-middle "
                />
              <v-text-field
                v-model="TEL_NO_LIST[3]"
                class="pl-form type-middle "
                />
            </div>
          </div>
        </div>
        <div class="pl-form-inline-wrap label-120 vertical mt-3 is-border-sub-top pt-3" >
          <div class="pl-form-inline" style="gap: 12px;">
            <span class="pl-label">
              LH적용일
            </span>
            <div class="pl-desc">
              <v-text-field
                disabled
                v-model="dataForm.LH_APLCN_YMD_DD"
                class="pl-form type-middle"
              />
              <v-checkbox
                class="pl-check"
                label="EAI 예외"
                v-model="dataForm.EAI_EXL"
              ></v-checkbox>
            </div>
          </div>
        </div>
      </v-form>
    </div>
    <div class="pl-quick-layer-footer">
      <div class="pl-btn-wrap ml-auto">
        <v-btn class="pl-btn is-sub" @click="stth">...</v-btn>
        <v-btn class="pl-btn is-trans" @click="close()">닫기</v-btn>
        <v-btn class="pl-btn" @click="strg_btn()" :disabled="dataForm.USER_ID == '' ? (!USER_DPNC_CHK) : (dataForm.LGN_ID == dataForm.ORG_LGN_ID ? false : !USER_DPNC_CHK ) ">저장</v-btn>
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
    <v-dialog
        v-model="dialogAcdGroupTree"
        content-class="dialog-draggable"
        hide-overlay>
        <compo-dialog header-title="ACD 그룹 선택" @hide="mixin_hideDialog('AcdGroupTree')">
          <template slot="body">
            <CompoAcdGroupTree ref="acdGroupDataCompo" :SRCH_DEPT_KEY="dataForm.DEPT_KEY" :ExpandedProp=true @Close="dialogAcdGroupTree = false" />
          </template>
          <template slot="footer">
            <v-btn class="pl-btn is-sub" @click="mixin_hideDialog('AcdGroupTree')">닫기</v-btn>
            <v-btn class="pl-btn" @click="setAcdGroupSubmitData">선택</v-btn>
          </template>
        </compo-dialog>
    </v-dialog>
  </div>
</template>

<script>
import CompoTree from '@/components/CompoTree.vue';
import CompoAcdGroupTree from '@/components/CompoAcdGroupTree.vue';
export default {
  name: 'SYS_M202_DIALOG_REG', // 조직정보 관리 - 직원정보
  props:{
    SRCH_USER_ID: {
      type: String,
    },
    CHK_USER_INFO_ITEM: {
      type: Object,
    },
    USER_DPNC_CHK:{
      type: Boolean,
    },
  },
  components: {
    CompoTree,
    CompoAcdGroupTree
  },
  data() {
    return {
      dialogOrgTree: false,
      dialogAcdGroupTree: false,
      common_code: [],
      common_code_global: [],
      combo_custco_list:[],
      authrt_group_drop: [],  //권한그룹
      dataForm: {},

      ENTER_DT : '',
      CALL_DT : '',

      date_enter_lhcs: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      date_enter_call: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      date_out: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),

      radioGroup: [
        { text: "사용", value: 'Y'},
        { text: "사용안함", value: 'N'},
      ],
      radioGroup2: [
        { text: "호전환 허용", value: 'Y'},
        { text: "호전환 금지", value: 'N'},
      ],
      radioGroup3: [
        { text: "허용", value: 'Y'},
        { text: "금지", value: 'N'},
      ],
      TEL_NO_LIST:['','','',''],//전화번호 리스트

      DSPTCH_NO_LIST : [],

      validateRules: {
        USER_NM: [
          v => !!v || '성명은 필수 입력 항목입니다.'
        ],
        DEPT: [
          v => !!v || '소속은 필수 입력 항목입니다.'
        ],
        AUTH: [
          v => !!v || '권한그룹은 필수 입력 항목입니다.'
        ],
        STTS: [
          v => !!v || '재직여부는 필수 입력 항목입니다.'
        ],
      },

      SHOW_CUSL_AUTH : false, //상담사 권한 필드 노출 여부
      SHOW_MNG_CUSTCO : false, //담당 센터 필드 노출 여부
    }
  },
  async created() {
    //공통코드설정
    let codeName = ['USE_WT', 'WORK_TP'/*고용형태*/, 'T203'/*직위*/, 'T207'/*직급*/, 'CJT'/*담당지구*/, 'USER_STTS_CD'/*사용자재직여부*/, 'WRK_TM'/*근무형태*/, 'DSPTCH_NO'/*대표번호*/ ];
    this.common_code = await this.mixin_common_code_get_all(codeName);

    let codeNameGloal = ['JOB_CL'/*근무유형(CUSTCO별)*/, 'WT'/*근무유형(CUSTCO별)*/];
    this.common_code_global = await this.mixin_common_code_get_all_global( codeNameGloal );

    this.DSPTCH_NO_LIST = [{text: '선택안함', value:''}];

    let dsptchNoList = this.mixin_common_code_get(this.common_code, 'DSPTCH_NO');
    dsptchNoList.forEach((item, idx) => {
      this.DSPTCH_NO_LIST.push(item);
    });

    this.srchAuthrtGroup(); //권한그룹
    this.$eventBus.$off("setOgnzTreeInfo"); //eventBus 중복방지를 위해 off
    this.$eventBus.$on("setOgnzTreeInfo", (ognz) => {
        this.dataForm.DEPT_ID = ognz.DEPT_ID
        this.dataForm.DEPT_NM = ognz.DEPT_NM
        this.dataForm.CUSTCO_ID = ognz.CUSTCO_ID
        this.dataForm.CUSTCO = ognz.CUSTCO_ID
        this.dataForm.UP_DEPT_ID = ognz.UP_DEPT_ID
        this.dataForm.UP_CUSTCO_ID = ognz.UP_CUSTCO_ID

        /*
        9 인재개발팀
        90000008 운영개발팀
        90000009 시스템개발팀
        */
        if(ognz.DEPT_ID === '9' || ognz.DEPT_ID === '90000008' || ognz.DEPT_ID === '90000009') this.SHOW_MNG_CUSTCO = true;
        else this.SHOW_MNG_CUSTCO = false;
    });

    this.$eventBus.$off("setAcdGroupTreeInfo"); //eventBus 중복방지를 위해 off
    this.$eventBus.$on("setAcdGroupTreeInfo", (acdGroupInfo) => {
      console.log('acdGroupInfo : ', acdGroupInfo);
      this.dataForm.ACD_GROUP = acdGroupInfo.GROUP_ID;
      this.dataForm.ACD_GROUP_NM = acdGroupInfo.GROUP_NAME;
    });

    // this.combo_custco_list = await this.mixin_custco_list_combo();

    //조직
    let common_ognz_list = await this.mixin_ognz_list();
    let custcoList = await this.mixin_ognz_list_center(common_ognz_list, 'CUSL', '' );

    custcoList.forEach((item, idx) => {
      this.combo_custco_list.push({text:item.text, value:item.DEPT_ID});
    });
  },
  async mounted() {

    if( this.CHK_USER_INFO_ITEM ) {
      this.mountUser();
    }else {
      this.srchUser( this.SRCH_USER_ID );
    }
  },

  methods: {
    // 사용자 정보 조회
    async mountUser() {
      console.log( "mountUser", this.CHK_USER_INFO_ITEM);
      this.dataForm = this.CHK_USER_INFO_ITEM;
      this.dataForm.DEPT_KEY = this.dataForm.CUSTCO_ID + ""+ this.dataForm.DEPT_ID; //조직선택시 사용.
      if( this.dataForm.EAI_EXL_YN === 'Y' ) {
        this.dataForm.EAI_EXL_YN_BOOL = true;
      }else {
        this.dataForm.EAI_EXL_YN_BOOL = false;
      }

      if(this.CHK_USER_INFO_ITEM.CALL_DT){
        this.CALL_DT = this.CHK_USER_INFO_ITEM.CALL_DT
      }
      if(this.CHK_USER_INFO_ITEM.ENTER_DT){
        this.ENTER_DT = this.CHK_USER_INFO_ITEM.ENTER_DT
      }

      //AUTHOR_GROUP_ID_LIST_ARR
      this.dataForm.AUTHOR_GROUP_ID_LIST_ARR = [];

      if('AUTHOR_GROUP_ID_LIST' in this.dataForm){
        if( this.dataForm.AUTHOR_GROUP_ID_LIST.indexOf(",") > -1 ) {
          var groupsVal = this.dataForm.AUTHOR_GROUP_ID_LIST.split(",");
          for(let i= 0 ; i < groupsVal.length ; i++){
            this.dataForm.AUTHOR_GROUP_ID_LIST_ARR.push({value:groupsVal[i]});
          }
        }else {
          this.dataForm.AUTHOR_GROUP_ID_LIST_ARR.push({value:this.dataForm.AUTHOR_GROUP_ID_LIST});
        }
      }

      this.TEL_NO_LIST = this.CHK_USER_INFO_ITEM.TEL_NO ?this.CHK_USER_INFO_ITEM.TEL_NO.split('#') : [];
      console.log( "TEL_NO_LIST", this.TEL_NO_LIST);

      this.authrtGroupChg(this.dataForm.AUTHRT_GROUP);

      /*
      9 인재개발팀
      90000008 운영개발팀
      90000009 시스템개발팀
      */
      if(this.dataForm.DEPT_ID === '9' || this.dataForm.DEPT_ID === '90000008' || this.dataForm.DEPT_ID === '90000009') this.SHOW_MNG_CUSTCO = true;
      else this.SHOW_MNG_CUSTCO = false;

      // if(this.dataForm.ACD_GROUP){
      //   setTimeout(() => {this.getIpronViewGroupMaster(this.dataForm.ACD_GROUP);}, 1000);
      // }
    },
    async srchUser(userId) {
      // console.log( "srchUser" );
      let sURL = '/api/biz/common/select/selectUserList';
      let postParam = {
        SRCH_USER_ID : userId
      }
      let headParam = {
        head: {
          "ns": 'lhcs.system.user.dao.UserMapper',
        }
      }
      let resData = await this.common_postCall(sURL, postParam, headParam)
      if (!this.mixin_isEmpty(resData)) {
        this.dataForm = resData.DATA[0];
        this.dataForm.DEPT_KEY = this.dataForm.CUSTCO_ID + ""+ this.dataForm.DEPT_ID; //조직선택시 사용.
        if( this.dataForm.EAI_EXL_YN === 'Y' ) {
          this.dataForm.EAI_EXL_YN_BOOL = true;
        }else {
          this.dataForm.EAI_EXL_YN_BOOL = false;
        }
        //AUTHOR_GROUP_ID_LIST_ARR
        this.dataForm.AUTHOR_GROUP_ID_LIST_ARR = [];
        if( this.dataForm.AUTHOR_GROUP_ID_LIST.indexOf(",") > -1 ) {
          var groupsVal = this.dataForm.AUTHOR_GROUP_ID_LIST.split(",");
          for(let i= 0 ; i < groupsVal.length ; i++){
            this.dataForm.AUTHOR_GROUP_ID_LIST_ARR.push({value:groupsVal[i]});
          }
        }else {
          this.dataForm.AUTHOR_GROUP_ID_LIST_ARR.push({value:this.dataForm.AUTHOR_GROUP_ID_LIST});
        }

      }
    },

    async srchAuthrtGroup(){
      let sURL = '/api/setting/system/menu-author-manage/author-group/inqire';
      let postParam = {
      }
      let headParam = {
        head: {
        }
      }

      let resData = await this.common_postCall(sURL,postParam,headParam);
      if(!resData.HEADER.ERROR_FLAG){
        for(let i= 0 ; i < resData.DATA.length ; i++){
          let dropitem ={
            text : resData.DATA[i].AUTHRT_GROUP_NM,
            value : resData.DATA[i].AUTHRT_GROUP_ID,
          };
          this.authrt_group_drop.push(dropitem);
        }
      }
    },
    setOgnzSubmitData() {
      this.$refs.ognzDataCompo.setOgnzSubmitData();
    },
    setAcdGroupSubmitData() {
      this.$refs.acdGroupDataCompo.setAcdGroupSubmitData();
    },
    close(){
      this.$emit('Close')
    },

    dpcnChk(){
      this.$emit('dpcnChk')
    },

    strg_user(){
      // this.dataForm.AGENT_ID = this.dataForm.USER_ID === '' ? this.dataForm.LGN_ID : this.dataForm.AGENT_ID;
      this.CHK_USER_INFO_ITEM = this.dataForm;
      this.$emit('strg_user')
    },

    async getIpronViewGroupMaster(groupId){
      let sURL = '/api/external/iprview/getGroupMaster';
      let postParam = {
        GROUP_ID : groupId
      }
      let headParam = {
        head: {
        }
      }

      let resData = await this.common_postCall(sURL,postParam,headParam);
      if(!resData.HEADER.ERROR_FLAG){
        if(resData.DATA){
          if(resData.DATA.length > 0){
            this.dataForm.ACD_GROUP = resData.DATA[0].GROUP_ID;
            this.dataForm.ACD_GROUP_NM = resData.DATA[0].GROUP_NAME;
          }else{
            this.dataForm.ACD_GROUP_NM = '';
          }
        }else{
          this.dataForm.ACD_GROUP_NM = '';
        }
      }
    },

    //필수값 체크크
    validate() {
      return this.$refs.form.validate();
    },
    // validation 초기화
    resetValidation() {
      this.$refs.form.reset();
    },

    async strg_btn(){
      if(this.validate()){
        if(this.dataForm.EXT_NO){
          if(this.dataForm.EXT_NO.length < 5){
            this.showAlertInfo({msg : '신규 내선번호를 입력해 주세요.'});
            return;
          }else{
            if(this.dataForm.ACD_GROUP){
              let sURL = '/api/external/iprview/getGroupMaster';
              let postParam = {
                GROUP_ID : this.dataForm.ACD_GROUP
              }
              let headParam = {head: {}}

              let resData = await this.common_postCall(sURL,postParam,headParam);
              if(!resData.HEADER.ERROR_FLAG){
                if(resData.DATA){
                  if(resData.DATA.length > 0){
                    this.strg_user();
                  }else{
                    this.showAlertInfo({msg : 'ACD Grp를 선택해 주세요.'});
                    return;
                  }
                }else{
                  this.showAlertInfo({msg : 'ACD Grp를 선택해 주세요.'});
                  return;
                }
              }
            }else{
              this.showAlertInfo({msg : 'ACD Grp를 선택해 주세요.'});
              return;
            }
          }
        }else{
          this.strg_user();
        }
      }else{
        this.showToastCaution({msg : '필수 입력 항목을 확인해 주세요.'})
      }
    },
    setTermDt(event, item){
      console.log(event)
      console.log(item)
      // this.dataForm[item] = this.$moment(event.replaceAll('-','')).format('YYYYMMDD');
      this.$set(this.dataForm, item, event);
    },

    stth() {

      this.showConfirmInfo({msg: '선택한 사용자로 접속하시겠습니까?'
            , callYes : ()=>{
        let srcDlgtUsrId = this.user_id; //위임받은사람
        let srcDlgtLgnId = this.$store.getters['userStore/GE_USER_ROLE'].lgnId;

        let dlgtLgnId = this.dataForm.LGN_ID;
        let dlgtUserId = this.dataForm.USER_ID;
        let dlgtUserNm = this.dataForm.USER_NM;
        let dlgtYn = 'Y';

        this.$store
            .dispatch("authStore/AC_AUTH_LOGIN_DLGT", {
              username: dlgtLgnId,  //위임자
            })
            .then((response) => {
              if (this.mixin_check_repsonse(response) === true) {

                this.closeAlert();

                let __response = response;
                //DLGT_ACCESS_TOKEN
                console.log(">>>>>>>>>" ,  __response.data.toString());
                window.sessionStorage.setItem("token", __response.data.HEADER.DLGT_ACCESS_TOKEN );

                this.$store.dispatch("userStore/INIT_USER_AUTHRT_DLGT_LIST", []); //위임받은 목록 초기화
                let getData = __response.data.DATA[0];//this.$store.getters["authStore/GE_AUTH_LOGIN_DATA"];
                setTimeout(() => {
                this.$store
                    .dispatch("userStore/AC_USER_DETAIL", {
                      data: getData,
                    })
                    .then((response) => {

                        this.$store.dispatch("commonStore/AC_COMMON_DELETE_ALL_TAB", ""); //활성화 탭 모두삭제.

                        //버튼 권한 조회
                        // this.mixin_common_button_auth("20210405154851920KC00302");
                        //사용자 회사정보 조회
                        this.$store
                            .dispatch("userStore/AC_USER_COMPANY_LIST", {
                              user_id: dlgtUserId
                              , lgn_id: dlgtLgnId
                              , custco_id : getData.CUSTCO_ID
                              , author_group_nm_list : getData.AUTHOR_GROUP_NM_LIST

                            })
                            .then((response) => {
                              console.log("responseresponseresponseresponseresponseresponseresponse :: " , this.$store.getters["userStore/GE_USER_COMPANY_LIST"][0]);
                              this.$store.dispatch("userStore/AC_USER_COMPANY", this.$store.getters["userStore/GE_USER_COMPANY_LIST"][0])
                              console.log("responseresponseresponseresponseresponseresponseresponse :: ", JSON.parse(sessionStorage.getItem("vuex")).userStore.user_role.company );
                            });

                        //사용자 메뉴권한 조회
                        this.$store
                            .dispatch("userStore/AC_USER_MENU", {
                              user_id: dlgtUserId
                            })
                            .then((response) => {
                            });
                        let mobile = 'N'

                        this.$store.dispatch("userStore/AC_MOBIE_YN", mobile);

                        this.$store.dispatch("statusStore/AC_CUTT_ING", false);
                        this.$store.dispatch("statusStore/AC_CUST_MODIFY_ING", false);
                        this.$store.dispatch("statusStore/AC_CTI_CALL_STAT", 'stat1');

                        this.$store.dispatch("userConfigStore/AC_SAVE_AFTR_CUST_MAINTAIN", false);
                        this.$store.dispatch("userStore/AC_USER_SHORTCUT", {user_id: dlgtUserId});

                        if(dlgtYn === 'Y') {
                          // 위임받은자 로그인 후 기존본인정보 저장용도.
                          this.$store.dispatch("userStore/AC_SRC_DLGT_USER", {
                            USER_ID: srcDlgtUsrId,
                            LGN_ID: srcDlgtLgnId
                          });
                        }else {
                          //나의 계정으로 돌아가는 경우.
                          this.$store.dispatch("userStore/AC_SRC_DLGT_USER", {
                            USER_ID: '',
                            LGN_ID: ''
                          });
                        }
                        this.$store.dispatch('commonStore/AC_COMMON_LEADER_HOME_TAB', 0); //0번 탭으로 초기화
                        this.$store.dispatch("commonStore/AC_COMMON_ACTIVE_TAB", { num: 0, id: 'home', title: '홈', });

                        setTimeout(() => {
                          this.$router.push("/home");
                          window.location.reload(true);
                        }, 500);



                    });
                }, 500);
              }
            });
        }
        , callNo : this.closeAlert
      });
    },

    authrtGroupChg(AUTHRT_GROUP){
      if(AUTHRT_GROUP === '6') this.SHOW_CUSL_AUTH = true;
      else this.SHOW_CUSL_AUTH = false;
    }

  },
  computed: {
  },
  watch: {
    SRCH_USER_ID() {
      this.srchUser( this.SRCH_USER_ID );
    },
    CHK_USER_INFO_ITEM() {
      this.mountUser();
    },
    TEL_NO_LIST(){
      this.dataForm.TEL_NO = this.TEL_NO_LIST.toString().replaceAll(',','#');
    },
    'dataForm.LGN_ID': function (NEW_LGN_ID, OLD_LGN_ID) {
      console.log('LGN_ID가 변경되었습니다:', OLD_LGN_ID, '→', NEW_LGN_ID);
      if(!this.dataForm.USER_ID) this.dataForm.AGENT_ID = this.dataForm.LGN_ID;
    },
    // ENTER_DT(){
    //     this.dataForm.ENTER_DT = this.ENTER_DT
    // },
    // CALL_DT(){
    //     this.dataForm.CALL_DT = this.CALL_DT
    // }
  },
};
</script>

<style lang="scss" scoped>

</style>