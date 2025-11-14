<template>
  <div>
    <!-- sub top -->
    <div class="pl-form-inline-wrap pl-card-body py-3">
      <div class="pl-form-inline">
        <span class="pl-label">
          검색기간(수정일)
        </span>
        <div class="pl-desc">
          <compo-date-picker
            DateType="dateInput"
            :DateProp.sync="srchParam.srchDt"
            @dateChange="setTermDt"
          />
        </div>
      </div>
      <div class="pl-form-inline">
        <span class="pl-label">
          유형
        </span>
        <div class="pl-desc">
          <v-select
            class="pl-form type-middle"
            :items="mixin_common_code_get(DataProp.commonCode,'IAT', '전체')"
            v-model="srchParam.srchDivCd"
            ref="srchParam.srchDivCd"
            placeholder="전체"
          ></v-select>
        </div>
      </div>
      <div class="pl-form-inline">
        <span class="pl-label">
          센터구분
        </span>
        <div class="pl-desc">
          <v-select
            class="pl-form type-middle"
            :items="DataProp.centerList"
            v-model="srchParam.srchCntrCd"
            placeholder="선택"
          ></v-select>
        </div>
      </div>
      <div class="pl-form-inline">
        <span class="pl-label">
          지역
        </span>
        <compo-cutt-zone-combo
            :FormSeProp="'SRCH'"
            :ClearProp="clearProp"
            @EMIT_CUTT_ZONE="setCuttZone"
        />
      </div>
      <div class="pl-form-inline mr-lg-10">
        <span class="pl-label">
          <v-checkbox
            class="pl-check"
            v-model="srchParam.srchSigunguTrgt"
            label="시/군/구 대상자들 포함"
          ></v-checkbox>
        </span>
      </div>
      <div>
        <v-btn
          class="pl-btn is-icon"
          @click="beforeSrch"
        >
          <span class="pl-icon20 search"></span>
          조회
        </v-btn>
        <compo-tooltip-btn
          TitleProp="초기화"
          ClassProp="pl-tooltip-btn"
          IconProp="pl-icon20 refresh"
          TooltipPositionProp="bottom"
        ></compo-tooltip-btn>
      </div>

    </div>
    <!-- sub content -->
    <div class="is-border-top ">

      <div class="pl-cols fill-height">
        <!-- left -->
        <div class="pl-card-body is-col-fix is-vrt" style="width: 70%;">
          <!-- tab -->
          <div class="is-mt-m">
            <v-tabs
              v-model="activeTab"
              @change="handleTabChange"
              hide-slider
              class="pl-tabs type-fill type-add is-noborder">
              <CompoTabItems :TabsList=tabsList3 >
              </CompoTabItems>
              <span class="pl-counter align-self-center">전체 <em class="pl-1 is-txt-blue">({{ gridTotCnt }})</em> 건</span>
            </v-tabs>

          </div>
          <v-tabs-items v-model="activeTab">
            <div class="fill-height" style="height: calc(100vh - 191px)">
              <v-tab-item>
                <!-- activeTab을 key로 주어 탭이 바뀔 때마다 자식 컴포넌트를 다시 마운트 -->
                <CSM_M0603_IA_TRANS_LIST
                     v-if="activeTab === 0"
                     :key="activeTab"
                     :SrchProp="srchParam"
                     :srchTrigger="srchIaListTrigger"
                     @updateGridLength="handleGridLength" />
              </v-tab-item>
              <v-tab-item>
                <CSM_M0603_IA_LIST_RSRV
                    v-if="activeTab === 1"
                    :key="activeTab"
                    :srchTrigger="srchRsrvListTrigger"
                    @updateGridLength="handleGridLength" />
              </v-tab-item>
            </div>
          </v-tabs-items>
        </div>
        <!-- right -->
        <div class="d-flex flex-column">
          <div style="height: calc(100% - 172px);">
            <div class="pl-card">
              <h2 class="pl-subtit">대량 문자 발송 내용 </h2>
              <div class="pl-subdesc">
                <p>시/도, 시/군/구를  선택 조회하신 후 발송할 문자 내용을 입력하시고 <br> [발송하기] 버튼을 클릭 하십시오. </p>
              </div>
              <!-- 검색 -->
              <strong class="pl-bullet-txt is-blue is-mt-m">발송 설정</strong>
              <div class="pl-rounded-box is-mt-s">
                <div class="pl-form-inline-wrap pa-3">
                  <div class="pl-form-inline">
                    <span class="pl-label">
                      예약 발송
                    </span>
                    <div class="pl-desc">
                      <v-checkbox
                        class="pl-check"
                        label="예약 여부 "
                        v-model="sendParam.sendRsrvYn"
                      ></v-checkbox>
                      <compo-date-picker
                          v-if="sendParam.sendRsrvYn"
                        DateType="dateTime"
                        :DateProp.sync="sendParam.sendDate"
                        :TimesProp.sync='sendParam.sendTime'
                        :NudgeLeftProp=480
                        />
                    </div>
                  </div>
                </div>
                <div class="pl-form-inline-wrap pa-3 is-border-top">
                  <div class="pl-form-inline">
                    <span class="pl-label">
                      분할 발송
                    </span>
                    <div class="pl-desc">
                      <v-checkbox
                        class="pl-check"
                        label="분할 여부 "
                        v-model="sendParam.sendSplitYn"
                      ></v-checkbox>
                      <v-text-field
                          v-if="sendParam.sendSplitYn"
                        class="pl-form is-sm"
                        placeholder=" 조회건수"
                        v-model="sendParam.sendSplitCnt"
                        @change="validateCnt(sendParam.sendSplitCnt)"
                        oninput="javascript: this.value = this.value.replace(/[^0-9]/g, '' );"
                        suffix="건 씩" />
                      <v-select
                          v-if="sendParam.sendSplitYn"
                        class="pl-form type-small is-xs"
                        v-model="sendParam.sendSplitTerm"
                        :items="splitTermItems"
                          item-text="text"
                          item-value="value"
                        placeholder="선택"
                      ></v-select>
                      <span class="pl-unit" v-if="sendParam.sendSplitYn">간격 발송</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <v-form ref="form" class="pl-card pt-0">
              <strong class="pl-bullet-txt is-blue ">발송할 문자 내용</strong>
              <div class="is-mt-s" >
                <v-textarea
                  class="pl-form is-noresize"
                  v-model="sendParam.sendMsg"
                  ref="sendParam.sendMsg"
                  :spellcheck="false"
                  height="250"
                />
              </div>
              <div class="pl-form-inline-wrap vertical label-100 is-mt-s">
                <div class="pl-form-inline">
                  <span class="pl-label">
                    발신자
                  </span>
                  <div class="pl-desc">
<!--                    <v-select-->
<!--                      v-model="sendParam.sendNumber"-->
<!--                      :items="[DataProp.smsSenderNo]"-->
<!--                      class="pl-form type-middle"-->
<!--                      placeholder="발신번호 입력" />-->

                  <v-text-field
                      class="pl-form type-middle"
                      v-model="sendParam.sendNumber"
                      ref="sendParam.sendNumber"
                      maxlength="8"
                      @input="setPhnNum"
                      placeholder="발신번호 입력"
                      oninput="javascript: this.value = this.value.replace(/[^0-9]/g, '' );"
                  />
                  </div>
                </div>
              </div>
            </v-form>
          </div>

          <div class="pl-card is-border text-right">
            <v-btn
              class="pl-btn is-icon"
              @click="beforeSend"
              :disabled="activeTab !== 0 || mixin_isEmpty(srchParam.srchZone[0]) || mixin_isEmpty(srchParam.srchZone[1])"
            >
              <v-icon class="pl-icon20 chat-send-white"></v-icon>
              발송하기
            </v-btn>
          </div>
        </div>
      </div>




    </div>

  </div>
</template>

<script>
import CompoTabItems from '@/components/CompoTabItems.vue';
import CSM_M0603_IA_TRANS_LIST from '@/views/page/CSM_M0603_IA_TRANS_LIST.vue'
import CSM_M0603_IA_LIST_RSRV from '@/views/page/CSM_M0603_IA_LIST_RSRV.vue'
import CompoCuttZoneCombo from "@/components/CompoCuttZoneCombo.vue";

export default {
  name: 'CSM_M0603_IA_TRANS', //관심지역 발송
  components: {
    CompoCuttZoneCombo,
    CompoTabItems,
    CSM_M0603_IA_TRANS_LIST,
    CSM_M0603_IA_LIST_RSRV
  },
  props : {
    DataProp : {
      type : Object,
      default : ()=>{
        return {}
      }
    }
  },
  data() {
    return {
      date2: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),

      // tab
      activeTab: null,
      tabsList3: [
        { title: '관심지역 리스트', content: 'CSM_M0603_IA_TRANS_LIST', badge: false},
        { title: '예약 현황', content: 'CSM_M0603_IA_LIST_RSRV', badge: false},
      ],

      // grid
      gridTotCnt: 0,
      srchIaListTrigger: false,
      srchRsrvListTrigger: false,
      clearProp: false,
      isLoading: false,

      // detail
      sendDate: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      sendTime: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      timeAmpm: '오후',
      splitTermItems : Array.from({ length: 12 }, (_, i) => ({ text: `${(i+1)*10}분`, value: (i+1)*10 })),
      itemsSendPhone: [this.DataProp.smsSenderNo],
      modelSendPhone: this.DataProp.smsSenderNo,

      srchParam: {
        srchDelDt:  this.$moment(new Date()).subtract(1,'years').format('YYYY-MM-DD'),
        srchDt:  this.$moment(new Date()).format('YYYY-MM-DD'),
        srchSigunguTrgt: true,
        srchDivCd: '',
        srchCntrCd: '',
        srchZone : new Array(3),
        srchAllZone: '',
        srchTermType: '',
      },
      sendParam : {
        sendRsrvYn : false,
        sendDate : this.$moment(new Date()).format('YYYY-MM-DD'),
        sendTime : this.$moment(new Date()).format("HH:mm"),
        sendSplitYn : false,
        sendSplitCnt : 0,
        sendSplitTerm : 10,
        sendMsg : '',
        sendNumber : '',
      }
    }
  },
  created() {
    if(!this.mixin_isEmpty(this.srchParam.srchZone[0]) && !this.mixin_isEmpty(this.srchParam.srchZone[1])) {
      this.srchIaListTrigger = !this.srchIaListTrigger
    }
  },
  mounted() {
  },
  methods: {
    handleTabChange(tab) {
    },
    setTermDt(){
      this.srchParam.srchDelDt = this.$moment(this.srchParam.srchDt).subtract(1,'years').format('YYYY-MM-DD');
    },
    handleGridLength(length) {
      this.gridTotCnt = length;
    },
    setCuttZone(data){
      this.srchParam.srchZone = []
      this.srchParam.srchZone = data;
    },
    beforeSrch(){
      if(this.activeTab === 0) {
        if(this.mixin_isEmpty(this.srchParam.srchZone[0]) || this.mixin_isEmpty(this.srchParam.srchZone[1])){
          this.showToastCaution({msg : '시도 / 시군구를 선택해주세요'})
        }else{
          this.srchIaListTrigger = !this.srchIaListTrigger
        }
      }else{
        this.srchRsrvListTrigger = !this.srchRsrvListTrigger
      }
    },
    beforeSend(){
      if(this.mixin_isEmpty(this.sendParam.sendMsg)){
        return this.showToastCaution({msg : '발송할 메시지를 입력하세요.', callAfter : ()=>{
          this.setFocus("sendParam.sendMsg")
          }})
      } else if(this.mixin_isEmpty(this.sendParam.sendNumber)){
        return this.showToastCaution({msg : '발송자 번호를 입력하세요.', callAfter : ()=>{
            this.setFocus("sendParam.sendNumber")
          }})
      } else if(this.mixin_isEmpty(this.srchParam.srchDivCd)){
        return this.showToastCaution({msg : '유형을 선택하세요.', callAfter : ()=>{
            this.setDropDown("srchParam.srchDivCd")
          }})
      }else{
        this.showConfirmInfo({msg : '상단의 검색 조건으로 조회된 모든 고객에게\n 관심지역 알리미 SMS가 발송됩니다. \n발송 하시겠습니까?', callYes : ()=>{
            this.sendInterestAreaSms()
            this.closeAlert()
          },
          callNo : this.closeAlert
        })
      }
    },
    async sendInterestAreaSms(){
      // let sUrl = '/phone-api/cuttMng/interestAreaNotiMng/insertInterestAreaSms'
      let sUrl = '/api/common/sendInterestSmsByMng'
      this.$store.dispatch("commonStore/AC_COMMON_PROGRESS_BAR", true);
      let postParam = {
        SRCH_DT : this.srchParam.srchDt.replaceAll('-',''),
        SRCH_DIV_CD : this.srchParam.srchDivCd,
        SRCH_SIGUNGU_TRGT : this.srchParam.srchSigunguTrgt ? "Y" : "N",
        SIDO_ID : this.srchParam.srchZone[0],
        SIGUNGU_ID : this.srchParam.srchZone[1],
        JIGU_ID : this.srchParam.srchZone[2],
        SRCH_CENTER_CD : this.srchParam.srchCntrCd,
        SEND_RSRV_YN : this.sendParam.sendRsrvYn ? 'Y':'N',
        RSRV_DT : this.sendParam.sendRsrvYn? this.sendParam.sendDate.replaceAll('-','')+this.sendParam.sendTime.replaceAll(':','')+'00' :'',
        SEND_SPLIT_YN : this.sendParam.sendSplitYn ? 'Y':'N',
        SEND_SPLIT_CNT : this.sendParam.sendSplitYn ? this.sendParam.sendSplitCnt : '',
        SEND_SPLIT_TERM: this.sendParam.sendSplitYn ? this.sendParam.sendSplitTerm : '',
        SEND_NUMBER: this.sendParam.sendNumber.replaceAll('-',''),
        SEND_MSG: this.sendParam.sendMsg
      }
      let headParam = {}
      try{
        const response = await this.common_postCall(sUrl, postParam, headParam)
        if (!response.HEADER.ERROR_FLAG) {
          this.showToastSuccess({
            msg: '정상 처리 되었습니다.',
            callAfter: () => {
              this.initSendParam()
              this.srchIaListTrigger = !this.srchIaListTrigger
            }
          })
        } else {
          this.showAlertCaution({msg: '처리 중 문제가 발생했습니다.'})
        }
      }catch(e){
        this.showAlertCaution({msg: '처리 중 문제가 발생했습니다.'})
        this.$store.dispatch("commonStore/AC_COMMON_PROGRESS_BAR", false);
      }
      this.$store.dispatch("commonStore/AC_COMMON_PROGRESS_BAR", false);
    },
    initSendParam(){
      this.sendParam={
        sendRsrvYn : false,
        sendDate : this.$moment(new Date()).format('YYYY-MM-DD'),
        sendTime : this.$moment(new Date()).format("HH:mm"),
        sendSplitYn : false,
        sendSplitCnt : 0,
        sendSplitTerm : 10,
        sendMsg : '',
        sendNumber : this.DataProp.smsSenderNo,
      }
    },
    setPhnNum(text){
      this.sendParam.sendNumber = this.mixin_setPhoneNo(text)
    },
    validateCnt(cnt){

      if(Number(cnt) > Number(this.gridTotCnt)){
        this.showToastCaution({msg:'분할 건 수는 전체 건 수를 초과할 수 없습니다.'})
      }
    }


  },
  computed: {

  },
  watch: {
    activeTab(){
      if(this.activeTab === 0) {
        // if(!this.mixin_isEmpty(this.srchParam.srchZone[0]) && !this.mixin_isEmpty(this.srchParam.srchZone[1])){
        //   this.srchIaListTrigger = !this.srchIaListTrigger
        // }
      }else{
        this.srchRsrvListTrigger = !this.srchRsrvListTrigger
      }
    },
    "DataProp.smsSenderNo" : {
      handler(){
        if(this.DataProp.smsSenderNo){
          this.sendParam.sendNumber = this.DataProp.smsSenderNo
        }
      }
    }

  },
};
</script>

<style lang="scss" scoped>

</style>