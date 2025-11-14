<template>
  <div>
    <table class="pl-tbl-detail">
      <colgroup>
        <col width="127px" />
        <col width="" />
      </colgroup>
      <tbody>
        <tr>
          <th scope="row">
            <span class="pl-label">
              고객정보
            </span>
          </th>
          <td>
            <strong class="pl-value-txt">{{ PLAN_INFO.CUST_INFO }}</strong>
          </td>
        </tr>
        <tr>
          <th scope="row">
            <span class="pl-label">
              인사말 1 <br>(보수완료 시)
            </span>
          </th>
          <td class="py-1 px-2">
            <span class="pl-value-txt" v-html="PLAN_INFO.OPEN_COMMENT"></span>
          </td>
        </tr>
        <tr>
          <th scope="row">
            <span class="pl-label">
              인사말 2 <br>(보수확인 시)
            </span>
          </th>
          <td class="py-1 px-2">
            <span class="pl-value-txt" v-html="PLAN_INFO.OPEN_COMMENT2"></span>
          </td>
        </tr>
        <tr>
          <th scope="row">
            <span class="pl-label">
              문항지
            </span>
          </th>
          <td class="py-1 px-2">
            <div class="spacing-wrap flex-column">
              <div
                v-for="item,index in QSTN_LIST"
                :class="`py-3 ${ index !== 0 && 'is-border-sub-top' }`"
                :key="item.QSTN_NO">
                <div class="d-flex">
                  <strong class="pl-subtit" style="flex: 0 0 40px">설문 {{ index + 1 }}</strong>
                  <strong class="pl-subtit">{{ item.QSTN_ANSW }}</strong>
                  <v-btn
                    @click="resetSelect(item)"
                    class="pl-btn is-sm is-esp ml-2">초기화</v-btn>
                </div>
                <div 
                  v-if="item.ANSW_TYPE == 'S'"
                  class="is-mt-s ml-10">
                  <v-radio-group
                    v-model="item.ANSW"
                    row
                    class="pl-radio-group"
                    :readonly="ReadOnlyProp"
                  >
                    <v-radio
                      v-for="(rad01) in item.EXPM_LIST"
                      :key="rad01.EXMP_SEQ_NO"
                      :label="rad01.EXMP_WORD"
                      :value="rad01.EXMP_SEQ_NO"
                      class="pl-radio"
                    >
                    </v-radio>
                  </v-radio-group>
                </div>
              </div>
            </div>
          </td>
        </tr>
        <tr>
          <th scope="row">
            <span class="pl-label">
              맺음말 1 <br>(비교적 만족)
            </span>
          </th>
          <td>
            <span class="pl-value-txt" v-html="PLAN_INFO.CLOSE_COMMENT"></span>
          </td>
        </tr>
        <tr>
          <th scope="row">
            <span class="pl-label">
              맺음말 2 <br>(비교적 불만)
            </span>
          </th>
          <td>
            <span class="pl-value-txt" v-html="PLAN_INFO.CLOSE_COMMENT2"></span>
          </td>
        </tr>
        <tr>
          <th scope="row">
            <span class="pl-label">
              불만코드
            </span>
          </th>
          <td>
            <v-select
              v-model="HAPPY_CMPL_CD"
              :items="mixin_common_code_get(this.common_code, 'HC', '선택')"
              class="pl-form"
              placeholder="선택"
            ></v-select>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'CompoHappyCallSurvey', //만족도 조사
  components: {
  },
  props: {
    DataProp: {
      type: Object,
      default: () => {},
    },
    ReadOnlyProp: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      CUST_ID: '', 
      FLW_DTL_FULL_SN: '', 
      SURVEY_DSTN_NO: '',

      common_code : [],


      PLAN_INFO: {},
      QSTN_LIST: [],
      HAPPY_CMPL_CD: '',


      TABLE_DATA: {
        CUS_INFO: '안광일 / 010-2937-1556 / 화성동탄2 A24블럭(4단지X국임/영구) 403동 1108호',
        //INTRO_MSG1: '<strong>[처리결과_보수처리중]</strong> 안녕하십니까? LH바로처리센터 스케쥴러 ○○○입니다. 실례지만 ○○○고객님 맞으십니까? ○○○하자 건으로 보수여부 확인차 연락드렸습니다. (보수여부 확인) 보수완료 건에 대해 만족도조사를 진행하고 있는데 약 1~2분 정도 소요 예정입니다. 잠시 통화가능하십니까? (예) 시간내 주셔서 갑사합니다. 설문은 총 5가지 항목이며 1점부터 5점까지 점수로 평가 부탁드립니다.',
        //INTRO_MSG2: '<strong>[처리결과_완료로 상태값 변경]</strong> 안녕하십니까? LH바로처리센터 스케쥴러 ○○○입니다. 실례지만 ○○○고객님 맞으십니까? (대략적인 접수일) 콜센터(또는 관리소)로 접수하셨던 ○○○하자 건이 보수완료로 확인되어 만족도조사차 확인차 연락드렸습니다. 설문은 약 1~2분 정도 소요 예정으로 잠시 통화가능하십니까? (예) 시간내 주셔서 갑사합니다. 설문은 총 5가지 항목이며 1점부터 5점까지 점수로 평가 부탁드립니다.',
        TEST_SHEET: [
          {
            q: '(방문약속이행) 기사가 일정에 맞추어 방문하였습니까? 몇 점 주시겠습니까?',
            a_selected: '',
            a_list: [
              { text: '매우만족' },
              { text: '만족' },
              { text: '보통' },
              { text: '불만족' },
              { text: '매우불만족' },
            ],
          },
          {
            q: '(방문약속이행) 기사가 일정에 맞추어 방문하였습니까? 몇 점 주시겠습니까?',
            a_selected: '',
            a_list: [
              { text: '매우만족' },
              { text: '만족' },
              { text: '보통' },
              { text: '불만족' },
              { text: '매우불만족' },
            ],
          },
          {
            q: '(방문약속이행) 기사가 일정에 맞추어 방문하였습니까? 몇 점 주시겠습니까?',
            a_selected: '',
            a_list: [
              { text: '매우만족' },
              { text: '만족' },
              { text: '보통' },
              { text: '불만족' },
              { text: '매우불만족' },
            ],
          },
          {
            q: '(방문약속이행) 기사가 일정에 맞추어 방문하였습니까? 몇 점 주시겠습니까?',
            a_selected: '',
            a_list: [
              { text: '매우만족' },
              { text: '만족' },
              { text: '보통' },
              { text: '불만족' },
              { text: '매우불만족' },
            ],
          },
          {
            q: '(방문약속이행) 기사가 일정에 맞추어 방문하였습니까? 몇 점 주시겠습니까?',
            a_selected: '',
            a_list: [
              { text: '네' },
              { text: '아니오' },
              { text: '보통' },
            ],
          },
        ],
        //CLOSE_MENT1: '<span class="is-txt-blue">[모든 항목 4점 이상]</span> 소중한 말씀 감사합니다. 앞으로도 만족하실 수 있도록 최선을 다하겠습니다. 행복한 하루 보내세요~ 스케쥴러 ○○○이었습니다.',
        //CLOSE_MENT2: '<span class="is-txt-red">[3점 이하]</span> 소중한 말씀 감사합니다. 앞으로는 개선되는 모습을 보여드릴 수 있는 LH가 되도록 최선을 다하겠습니다. 행복한 하루 보내세요~ 스케쥴러 ○○○이었습니다.',
        UNSATISFIED_CODE: ''

      }

    }
  },
  methods: {
    resetSelect(selected){
      selected.ANSW = ''
    },

    //해피콜 설문 계획 조회(인사말, 맺음말)
    async getSurveyPlan() {
      const postParam = {
        CUST_ID: this.CUST_ID, 
        FLW_DTL_FULL_SN: this.FLW_DTL_FULL_SN, 
        SURVEY_DSTN_NO: this.SURVEY_DSTN_NO,
      };
      const headParam = {
          head: {
              ns: 'lhcs.phone.as.dao.PhoneAsHappycallMapper'
          }
      };
      const response = await this.common_postCall("/api/biz/common/select/selectSurveyPlan", postParam, headParam);
      if(!response.HEADER.ERROR_FLAG) {
        this.PLAN_INFO = response.DATA[0] ? response.DATA[0] : {};
        if(this.PLAN_INFO.CUST_NM) {
          this.PLAN_INFO.CUST_INFO = this.PLAN_INFO.CUST_NM + " / " + this.mixin_setPhoneNo(this.PLAN_INFO.MOBILE) + " / " + this.PLAN_INFO.CUST_ADDR;
          this.$emit("setDialogTitle", this.PLAN_INFO.SURVEY_TITLE);
        }
      }
    },


    //해피콜 설문 문항 정보 조회
    async getSurveyQstnList() {
      const postParam = {
        SURVEY_ID: this.PLAN_INFO.SURVEY_ID,
      };
      const headParam = {
          head: {
              ns: 'lhcs.phone.as.dao.PhoneAsHappycallMapper'
          }
      };
      const response = await this.common_postCall("/api/biz/common/select/selectSurveyQstnList", postParam, headParam);
      if(!response.HEADER.ERROR_FLAG) {
        if(response.DATA.length > 0) {
          let tmpQstnList = []
          response.DATA.map((item, idx) => {
            if(idx == 0 || (idx > 0 && item.QSTN_NO != response.DATA[idx-1].QSTN_NO)) {
              let tmpQstn = {
                QSTN_ANSW: item.QSTN_ANSW,
                ANSW_TYPE: item.ANSW_TYPE,
                ANSW_CNT: item.ANSW_CNT,
                MULTI_YN: item.MULTI_YN,
                MULTI_CNT: item.MULTI_CNT,
                QSTN_NO: item.QSTN_NO,
                ANSW: '',
              }
              tmpQstnList.push(tmpQstn)
            }
          })

          tmpQstnList.map(item => {
            item.EXPM_LIST = response.DATA.filter(expmItem => { return expmItem.QSTN_NO == item.QSTN_NO } )
          })

          this.QSTN_LIST = tmpQstnList ;

          console.log("this.QSTN_LIST", this.QSTN_LIST)
        }
      }
    },

    btnSave() {
      if(this.PLAN_INFO.EMP_NO && this.PLAN_INFO.EMP_NO != '') {
        // if(this.computedUserType  == "ETC_ADMIN") {
          this.saveSurvey('MOD');
        // } 
      } else {
        this.saveSurvey('REG');
      }
    },

    //설문결과 조회
    async getSurveyAnswList() {
      const postParam = {
        FLW_DTL_FULL_SN: this.FLW_DTL_FULL_SN,
      };
      const headParam = {
          head: {
              ns: 'lhcs.phone.as.dao.PhoneAsHappycallMapper'
          }
      };
      const response = await this.common_postCall("/api/biz/common/select/selectSurveyAnswList", postParam, headParam);
      if(!response.HEADER.ERROR_FLAG) {
        this.HAPPY_CMPL_CD = response.DATA[0] && response.DATA[0].HAPPY_CMPL_CD ? response.DATA[0].HAPPY_CMPL_CD : '';
        response.DATA.map((item, index) => {
          this.QSTN_LIST[index].ANSW = item.ANSW
        })
        console.log("this.QSTN_LIST", this.QSTN_LIST)
      }
    },

    async saveSurvey(procMode) {
      console.log("saveSurvey procMode", procMode)
      let answerList = [] 
      this.QSTN_LIST.map(item => {
        answerList.push({QSTN_NO: item.QSTN_NO, ANSW: item.ANSW})
      });
      const postParam = {
        PROC_MODE: procMode,
        SURVEY_ID: this.PLAN_INFO.SURVEY_ID,
        FLW_DTL_FULL_SN: this.FLW_DTL_FULL_SN,
        HAPPY_CMPL_CD: this.HAPPY_CMPL_CD,
        CNTCT_RSLT_CD: "ISMACTRT005",
        ANSWER_LIST: answerList
      };
      if(procMode == "MOD") {
        postParam.SURVEY_DSTN_NO = this.SURVEY_DSTN_NO;
      }
      
      const headParam = {head: {}};
      console.log("saveSurvey postParam", postParam)
      const response = await this.common_postCall("/phone-api/as/happycall/procSurvey", postParam, headParam);
      if(!response.HEADER.ERROR_FLAG) {
        console.log("response.DATA[0]", response.DATA[0])
        this.showToastSuccess({msg : '정상 처리되었습니다.'});
        this.$emit("closeDialog", response.DATA[0].SURVEY_DSTN_NO);
      }
    },

  },

  mounted() {
  },
  async created() {
    this.CUST_ID = this.DataProp.CUST_ID ? this.DataProp.CUST_ID : '';
    this.FLW_DTL_FULL_SN = this.DataProp.FLW_DTL_FULL_SN ? this.DataProp.FLW_DTL_FULL_SN : '';
    this.SURVEY_DSTN_NO = this.DataProp.SURVEY_DSTN_NO ? this.DataProp.SURVEY_DSTN_NO : '';
    console.log("CompoHappyCallSurvey created", this.DataProp)
    await this.getSurveyPlan();
    
    //공통코드설정
    let codeName = ['HC'];
    this.common_code = await this.mixin_common_code_get_all(codeName);

    await this.getSurveyQstnList();
    if(this.PLAN_INFO.EMP_NO && this.PLAN_INFO.EMP_NO != '') {
      //설문 결과 내역 조회
      this.getSurveyAnswList();
      if(this.computedIsContainAdminGroup || (this.PLAN_INFO.TODAY_YN == 'Y' && this.PLAN_INFO.EMP_NO == this.user_id)) {
        this.$emit("disableSaveBtn", false);
      } else {
        this.$emit("disableSaveBtn", true);
      }
    } else {
      this.$emit("disableSaveBtn", false);
    }
    
  },
  computed: {
  },
  watch: {
  },
};
</script>

<style lang="scss" scoped>

</style>