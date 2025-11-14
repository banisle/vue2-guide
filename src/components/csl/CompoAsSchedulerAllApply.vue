<template>
    <div>
      <div class="pl-drop-layer-header">
            <h2>일괄적용</h2>
            <v-btn
                @click="close()"
                plain
                min-width="22"
                height="22"
                class="pl-tooltip-btn ml-auto "
                >
                <v-icon
                small
                class="pl-icon20 dialog-close-black">
                </v-icon>
            </v-btn>
        </div>
        <div class="pl-drop-layer-body">
            <div class="pl-form-inline-wrap vertical label-80 gap-8">
                <div class="pl-form-inline">
                <span class="pl-label">
                    <v-checkbox
                      v-model="RCV_SCHEDULER_STATUS.RSRV_YMD_YN"
                      class="pl-check"
                      disabled
                    ></v-checkbox>
                    <span class="ml-1">통화예약</span>
                </span>
                <div class="pl-desc">
                    <compo-date-picker
                    DateType="dateInput"
                    :DateProp.sync="RCV_SCHEDULER_STATUS.RSRV_YMD"
                    @dateChange="changeRsrvYmd"/>
                </div>
                </div>
                <div class="pl-form-inline">
                <span class="pl-label">
                    <v-checkbox
                      v-model="RCV_SCHEDULER_STATUS.VISIT_YMD_YN"
                      class="pl-check"
                      disabled
                    ></v-checkbox>
                    <span class="ml-1">방문확정일</span>
                </span>
                <div class="pl-desc">
                    <div class="spacing-wrap sp-8 align-center">
                    <compo-date-picker
                      DateType="dateInput"
                      :DateProp.sync="RCV_SCHEDULER_STATUS.VISIT_YMD"
                      @dateChange="changeVisitYmd"
                      :DisabledProp="RCV_SCHEDULER_STATUS.DEL_YN ? true : false"
                    />
                    <v-select
                      v-model="RCV_SCHEDULER_STATUS.VISIT_S_H"
                      :items="HOUR_LIST"
                      class="pl-form type-middle is-xs"
                      :disabled="RCV_SCHEDULER_STATUS.DEL_YN ? true : false"
                      placeholder="선택"
                    ></v-select>
                    <span class="pl-unit">~</span>
                    <v-select
                      v-model="RCV_SCHEDULER_STATUS.VISIT_E_H"
                      :items="HOUR_LIST"
                      class="pl-form type-middle is-xs"
                      :disabled="RCV_SCHEDULER_STATUS.DEL_YN ? true : false"
                      placeholder="선택"
                    ></v-select>
                    <v-checkbox
                      v-model="RCV_SCHEDULER_STATUS.DEL_YN"
                      class="pl-check"
                      label="(삭제)"
                      input-value=""
                      @change="changeSchedulerStatusDelYn"
                    ></v-checkbox>
                  </div>
                </div>
                </div>
                <div class="pl-form-inline">
                  <span class="pl-label">
                      <v-checkbox
                        v-model="RCV_SCHEDULER_STATUS.SCH_STAT_TYPE_YN"
                        class="pl-check"
                        disabled
                      ></v-checkbox>
                      <span class="ml-1">완료유형</span>
                  </span>
                  <div class="pl-desc">
                      <v-select
                        v-model="RCV_SCHEDULER_STATUS.SCH_STAT_TYPE"
                        :items="SCH_STAT_TYPE_LIST"
                        class="pl-form type-middle flex-grow-0"
                        @change="changeSchStatType"
                      />
                  </div>
                </div>
                <div class="pl-form-inline">
                  <span class="pl-label">
                      <v-checkbox
                        v-model="RCV_SCHEDULER_STATUS.WORK_TYPE_YN"
                        class="pl-check"
                        disabled
                      ></v-checkbox>
                      <span class="ml-1">제외유형</span>
                  </span>
                  <div class="pl-desc">
                      <v-select
                        v-model="RCV_SCHEDULER_STATUS.WORK_TYPE"
                        :items="WORK_TYPE_LIST"
                        class="pl-form type-middle flex-grow-0"
                        :disabled="disabledWorkType"
                        @change="changeWorkType"
                      />
                  </div>
                </div>
                <div class="pl-form-inline">
                  <span class="pl-label">
                      <v-checkbox
                        v-model="RCV_SCHEDULER_STATUS.RSRV_CNTNT_YN"
                        class="pl-check"
                      ></v-checkbox>
                      <span class="ml-1">메모</span>
                  </span>
                  <div class="pl-desc">
                      <v-text-field
                        v-model="RCV_SCHEDULER_STATUS.RSRV_CNTNT"
                        class="pl-form type-middle"
                      />
                  </div>
                </div>
            </div>
        </div>
        <div class="pl-drop-layer-footer">
            <v-btn
                class="pl-btn is-trans ml-auto"
                @click="close()">닫기</v-btn>
            <v-btn class="pl-btn" @click="btnSave()">저장</v-btn>
        </div>
    </div>
  </template>
  
  <script>

  export default {
    name: 'CompoAsSchedulerAllApply', //일괄적용
    props: {
      DataProp: {
        type: Array ,
        default: () => []
      },
    },
    data() {
      return {
        RCV_SCHEDULER_STATUS: {
          RSRV_YMD_YN: false,
          RSRV_YMD: '',
          VISIT_YMD_YN: false,
          VISIT_YMD: '',
          VISIT_S_H: '',
          VISIT_E_H: '',
          DEL_YN: false,
          RSRV_CNTNT_YN: false,
          RSRV_CNTNT: '',
          SCH_STAT_TYPE_YN: false,
          SCH_STAT_TYPE: '',
          WORK_TYPE_YN: false,
          WORK_TYPE: '',
        },

        //시간 목록
        HOUR_LIST: [{text: "선택", value: ""},
          {text: "1시", value: "01"}, {text: "2시", value: "02"}, {text: "3시", value: "03"}, {text: "4시", value: "04"}, {text: "5시", value: "05"}, {text: "6시", value: "06"},
          {text: "7시", value: "07"}, {text: "8시", value: "08"}, {text: "9시", value: "09"}, {text: "10시", value: "10"}, {text: "11시", value: "11"}, {text: "12시", value: "12"}, 
          {text: "13시", value: "13"}, {text: "14시", value: "14"}, {text: "15시", value: "15"}, {text: "16시", value: "16"}, {text: "17시", value: "17"}, {text: "18시", value: "18"}, 
          {text: "19시", value: "19"}, {text: "20시", value: "20"}, {text: "21시", value: "21"}, {text: "22시", value: "22"},  {text: "23시", value: "23"}, 
        ],

        SCH_STAT_TYPE_LIST: [],
        WORK_TYPE_LIST: [],
        disabledWorkType: true,
      }
    },
    methods: {
      async getCommonCodeList() {
        const codeName = ['SST9', 'WP'];
        this.common_code = await this.mixin_common_code_get_all(codeName);
        this.SCH_STAT_TYPE_LIST = this.mixin_common_code_get(this.common_code, 'SST9', '선택');
        this.WORK_TYPE_LIST = this.mixin_common_code_get(this.common_code, 'WP', '선택');
      },

      //진행현황 - 방문예정익 삭제 체크박스 변경 이벤트 
      changeSchedulerStatusDelYn() {
        if(this.RCV_SCHEDULER_STATUS.DEL_YN) {
          this.RCV_SCHEDULER_STATUS.VISIT_YMD = '';
          this.RCV_SCHEDULER_STATUS.VISIT_S_H = '';
          this.RCV_SCHEDULER_STATUS.VISIT_E_H = '';
          this.RCV_SCHEDULER_STATUS.VISIT_YMD_YN = false;
        }
      },

      //통화예약일 변경 이벤트
      changeRsrvYmd() {
        console.log("this.RCV_SCHEDULER_STATUS.RSRV_YMD", this.RCV_SCHEDULER_STATUS.RSRV_YMD)
        if(this.RCV_SCHEDULER_STATUS.RSRV_YMD && this.RCV_SCHEDULER_STATUS.RSRV_YMD != '') {
          //통화예약과 완료유형은 함께 설정할 수 없다. 통화예약 설정 시 완료유형 초기화
          this.RCV_SCHEDULER_STATUS.SCH_STAT_TYPE = '';
          this.RCV_SCHEDULER_STATUS.SCH_STAT_TYPE_YN = false;
          this.$set(this.RCV_SCHEDULER_STATUS, 'WORK_TYPE', '');
          this.RCV_SCHEDULER_STATUS.WORK_TYPE_YN = false;
          this.RCV_SCHEDULER_STATUS.RSRV_CNTNT_YN = false;
          this.RCV_SCHEDULER_STATUS.RSRV_CNTNT = "";
          this.disabledWorkType = true;

          //통화예약 체크박스 활성화
          this.RCV_SCHEDULER_STATUS.RSRV_YMD_YN = true;
          
        } else {
          this.RCV_SCHEDULER_STATUS.RSRV_YMD_YN = false;
        }
      },

      //방문확정일 변경 이벤트
      changeVisitYmd() {
        if(this.RCV_SCHEDULER_STATUS.VISIT_YMD && this.RCV_SCHEDULER_STATUS.VISIT_YMD != '') {
          this.RCV_SCHEDULER_STATUS.VISIT_YMD_YN = true;
        } else {
          this.RCV_SCHEDULER_STATUS.VISIT_YMD_YN = false;
        }
      },

      //완료유형 변경 이벤트
      changeSchStatType() {
        if(this.RCV_SCHEDULER_STATUS.SCH_STAT_TYPE && this.RCV_SCHEDULER_STATUS.SCH_STAT_TYPE != '') {
          //통화예약과 완료유형은 함께 설정할 수 없다. 완료유형 설정 시 통화예약 초기화
          this.RCV_SCHEDULER_STATUS.RSRV_YMD = '';
          this.RCV_SCHEDULER_STATUS.RSRV_YMD_YN = false;

          this.RCV_SCHEDULER_STATUS.SCH_STAT_TYPE_YN = true;
          //완류유형이 '제외'일 경우만 제외유형 활성화.
          if(this.RCV_SCHEDULER_STATUS.SCH_STAT_TYPE == "SST93") {
            this.disabledWorkType = false;
            this.RCV_SCHEDULER_STATUS.RSRV_CNTNT = "";
          } else {
            //this.RCV_SCHEDULER_STATUS.WORK_TYPE = '';
            this.$set(this.RCV_SCHEDULER_STATUS, 'WORK_TYPE', '');
            this.RCV_SCHEDULER_STATUS.WORK_TYPE_YN = false;
            this.RCV_SCHEDULER_STATUS.RSRV_CNTNT_YN = true;
            this.disabledWorkType = true;
            this.RCV_SCHEDULER_STATUS.RSRV_CNTNT = '';
            if(this.RCV_SCHEDULER_STATUS.SCH_STAT_TYPE == "SST91") {
              this.RCV_SCHEDULER_STATUS.RSRV_CNTNT = "해피콜완료";
            } else if(this.RCV_SCHEDULER_STATUS.SCH_STAT_TYPE == "SST92") {
              this.RCV_SCHEDULER_STATUS.RSRV_CNTNT = "60일 이상 종결";
            } else if(this.RCV_SCHEDULER_STATUS.SCH_STAT_TYPE == "SST94") {
              this.RCV_SCHEDULER_STATUS.RSRV_CNTNT = "일정비협조";
            }
          }
        } else {
          this.RCV_SCHEDULER_STATUS.SCH_STAT_TYPE_YN = false;
          this.$set(this.RCV_SCHEDULER_STATUS, 'WORK_TYPE', '');
          this.RCV_SCHEDULER_STATUS.WORK_TYPE_YN = false;
          this.RCV_SCHEDULER_STATUS.RSRV_CNTNT_YN = false;
          this.RCV_SCHEDULER_STATUS.RSRV_CNTNT = "";
          this.disabledWorkType = true;
        }
      },


      //제외유형 변경 이벤트
      changeWorkType() {
        if(this.RCV_SCHEDULER_STATUS.WORK_TYPE && this.RCV_SCHEDULER_STATUS.WORK_TYPE != '') {
          this.RCV_SCHEDULER_STATUS.WORK_TYPE_YN = true;
          this.RCV_SCHEDULER_STATUS.RSRV_CNTNT_YN = true;
          const selectedWorkType = this.WORK_TYPE_LIST.filter(item => { return item.value == this.RCV_SCHEDULER_STATUS.WORK_TYPE })[0].text;
          this.$set(this.RCV_SCHEDULER_STATUS, 'RSRV_CNTNT', selectedWorkType);
        } else {
          this.RCV_SCHEDULER_STATUS.WORK_TYPE_YN = false;
          this.RCV_SCHEDULER_STATUS.RSRV_CNTNT_YN = false;
          this.RCV_SCHEDULER_STATUS.RSRV_CNTNT = '';
        }
      },

      //저장 버튼(진행현황 등록)
      btnSave() {

        // 통화예약/완료유형 중복 체크
        if (this.RCV_SCHEDULER_STATUS.RSRV_YMD != "" && this.RCV_SCHEDULER_STATUS.SCH_STAT_TYPE != "") {
          this.showAlertInfo({msg: "통화예약과 완료유형을 중복 선택할 수 없습니다."});
          return false;
        }
        // 방문확정일 입력 시 시작시간 종료시간 입력 여부 체크
        if (this.RCV_SCHEDULER_STATUS.VISIT_YMD.trim() != "" && (this.RCV_SCHEDULER_STATUS.VISIT_S_H == "" || this.RCV_SCHEDULER_STATUS.VISIT_E_H == "")) {
          this.showAlertInfo({msg: "방문확정일 입력 시 시작/종료 시간은 필수입니다."});
          return false;
        }
        // 방문확정일 입력 시 시작시간 종료시간 유효성 체크
        if (this.RCV_SCHEDULER_STATUS.VISIT_YMD.trim() != "" && parseInt(this.RCV_SCHEDULER_STATUS.VISIT_S_H) > parseInt(this.RCV_SCHEDULER_STATUS.VISIT_E_H)) {
          this.showAlertInfo({msg: "방문확정 시작/종료 시간을 확인해주세요."});
          return false;
        }
        // 방문확정일이 없으면 시작시간, 종료시간도 초기화
        if (this.RCV_SCHEDULER_STATUS.VISIT_YMD == "") {
          this.RCV_SCHEDULER_STATUS.VISIT_S_H = "";
          this.RCV_SCHEDULER_STATUS.VISIT_E_H = "";
        }
        // 방문확정일 삭제 체크했을 경우 통화예약/완료유형 둘중 하나는 선택
        if (this.RCV_SCHEDULER_STATUS.DEL_YN && (this.RCV_SCHEDULER_STATUS.RSRV_YMD == "" && this.RCV_SCHEDULER_STATUS.SCH_STAT_TYPE == "")) {
          this.showAlertInfo({msg: "방문확정일 삭제 시 통화예약이나 완료유형 중 하나를 선택하셔야 합니다."});
          return false;
        }
        // 모든 항목을 입력 안했을 경우
        if (!this.RCV_SCHEDULER_STATUS.WORK_TYPE_YN && this.RCV_SCHEDULER_STATUS.RSRV_YMD == "" && this.RCV_SCHEDULER_STATUS.VISIT_YMD == "" && !this.RCV_SCHEDULER_STATUS.DEL_YN  && !this.RCV_SCHEDULER_STATUS.RSRV_CNTNT_YN && this.RCV_SCHEDULER_STATUS.SCH_STAT_TYPE == "") {
          this.showAlertInfo({msg: "진행현황 정보가 없습니다."});
          return false;
        }
   
			  // 완료유형 제외 선택 시 제외유형 필수 선택 ('SST91' => 완료, 'SST92' => 종결, 'SST93' => 제외) 2020-12-12
        if (this.RCV_SCHEDULER_STATUS.SCH_STAT_TYPE == "SST93" && this.RCV_SCHEDULER_STATUS.WORK_TYPE == "") {
          this.showAlertInfo({msg: "완료유형 제외 선택 시 제외유형은 필수 선택 입니다."});
          return false;
        }

        this.showConfirmInfo({
          msg: '일괄적용 하시겠습니까?'
          , callYes : ()=>{  this.save(); }
          , callNo : this.closeAlert
        })
      },

      //통화예약 등록(다건)
      async save() {
        let flwDtlFullSnList = [];
        let araHdqCdList = [];
        let flwRgsDtList = [];
        let flwAcpSnList = [];
        let flwDtlSnList = [];
        let newYnList = [];
        this.DataProp.map(item => {
          flwDtlFullSnList.push(item.FLW_DTL_FULL_SN);
          araHdqCdList.push(item.ARA_HDQ_CD);
          flwRgsDtList.push(item.FLW_RGS_DT);
          flwAcpSnList.push(item.FLW_ACP_SN);
          flwDtlSnList.push(item.FLW_DTL_SN);
          newYnList.push(item.NEW_YN);
        })

        const rsrvYmdYn = this.RCV_SCHEDULER_STATUS.RSRV_YMD_YN ? "Y" : "N"; // 통화예약 체크박스
        const rsrvYmd = this.RCV_SCHEDULER_STATUS.RSRV_YMD ? this.RCV_SCHEDULER_STATUS.RSRV_YMD.replace(/-/gi, '') : ''; //통화예정일
        const visitYmd = this.RCV_SCHEDULER_STATUS.VISIT_YMD ? this.RCV_SCHEDULER_STATUS.VISIT_YMD.replace(/-/gi, '') : ''; // 방문확정일
        const visitSH = (visitYmd != "" && this.RCV_SCHEDULER_STATUS.VISIT_S_H) ? this.RCV_SCHEDULER_STATUS.VISIT_S_H : ""; // 방문확정시작시간
        const visitEH = (visitYmd != "" && this.RCV_SCHEDULER_STATUS.VISIT_E_H) ? this.RCV_SCHEDULER_STATUS.VISIT_E_H : ""; // 방문확정종료시간

        const schStatTypeYn = this.RCV_SCHEDULER_STATUS.SCH_STAT_TYPE_YN ? "Y" : "N"; // 완료유형 체크박스
        const schStatType = this.RCV_SCHEDULER_STATUS.SCH_STAT_TYPE ? this.RCV_SCHEDULER_STATUS.SCH_STAT_TYPE : ''; // 완료유형 (SST91:완료, SST93:제외, SST92:종결)
        const schStatCd = (schStatType != "") ? "SST9" : ""; // 완료여부
        const schStatNm = (schStatType != "") ? "완료" : ""; // 완료여부
        const rsrvDelYn = (schStatTypeYn == "Y" && rsrvYmdYn == "N") ? "Y": "N"; // 통화예약일 삭제 여부 (완료유형이 선택되고 통화예약 정보가 없으면 삭제)
        
        const headParam = {head : {}} 

        const postParam = {
          FLW_DTL_FULL_SN_LIST: flwDtlFullSnList.join(","),
          ARA_HDQ_CD_LIST: araHdqCdList.join(","),
          FLW_RGS_DT_LIST: flwRgsDtList.join(","),
          FLW_ACP_SN_LIST: flwAcpSnList.join(","),
          FLW_DTL_SN_LIST: flwDtlSnList.join(","),
          NEW_YN_LIST: newYnList.join(","),
          RSRV_YMD: rsrvYmd,
          RSRV_DEL_YN: rsrvDelYn,
          VISIT_YMD: visitYmd, //방문확정일
          VISIT_S_H: visitSH, //시작일
          VISIT_E_H: visitEH, //종료일
          DEL_VISIT_YMD_YN: this.RCV_SCHEDULER_STATUS.DEL_YN ? "Y" : "N",
          RSRV_CNTNT_YN: this.RCV_SCHEDULER_STATUS.RSRV_CNTNT_YN ? "Y" : "N",
          RSRV_CNTNT: this.RCV_SCHEDULER_STATUS.RSRV_CNTNT ? this.RCV_SCHEDULER_STATUS.RSRV_CNTNT : '', //메모
          SCH_STAT_TYPE: this.RCV_SCHEDULER_STATUS.SCH_STAT_TYPE ? this.RCV_SCHEDULER_STATUS.SCH_STAT_TYPE : '', // 완료유형
          SCH_STAT_CD: schStatCd,
          WORK_TYPE_YN: this.RCV_SCHEDULER_STATUS.WORK_TYPE_YN ? "Y" : "N",
          WORK_TYPE: this.RCV_SCHEDULER_STATUS.WORK_TYPE ? this.RCV_SCHEDULER_STATUS.WORK_TYPE : '',
        }


        this.$store.dispatch("commonStore/AC_COMMON_PROGRESS_BAR", true);
        const response = await this.common_postCall("/phone-api/as/scheduler/registRcvSchedulerStatusList", postParam, headParam);

        if (!response.HEADER.ERROR_FLAG) {
          this.$store.dispatch("commonStore/AC_COMMON_PROGRESS_BAR", false);
          
          this.$emit("afterAllApply", this.RCV_SCHEDULER_STATUS, schStatNm)
          this.showAlertInfo({msg: "정상 처리되었습니다."});
          this.close();
        }
      },

      close() {
        this.$emit("close");
      }
    },
    mounted() {
    },
    created() {
      this.getCommonCodeList();
    },
    computed: {
    },
    watch: {
    },
  };
  </script>
  
  <style lang="scss" scoped>
  
  </style>