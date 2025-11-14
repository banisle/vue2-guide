<template>
  <div style="display: contents">
    <div class="pl-quick-layer-body pb-0 px-0" :style="selectedTabIndex !== 2 ? 'flex: 0 0 calc(100% - 150px)' : ''">
      <!-- 상담사 정보 -->
      <div class="px-5">
        <div class="d-flex" style="position: relative;">
          <div style="flex: 0 0 40px">
            <img :src="CUSL_INFO.IMG" :alt="CUSL_INFO.CUSL_NM" style="border-radius: 50%;width: 40px;height:40px;" @error="function(e){e.target.src=require('@/assets/img/@manager_profile_default.png')}" />
          </div>
          <div class="ml-4">
            <div >
              <strong style="font-size: 14px">{{ CUSL_INFO.CUSL_NM }}</strong>
              <span class="ml-1 is-txt-sub">{{ CUSL_INFO.CUSL_CUSTCO_NM + '-' + CUSL_INFO.CUSL_DEPT_NM }}</span>
              <compo-tooltip-btn
                TitleProp="상담내용 보기"
                ClassProp="pl-tooltip-btn ml-1"
                IconProp="pl-icon20 board-docu"
                :MinWidthProp="22"
                :HeightProp="22"
                TooltipPositionProp="bottom"
                @btnClick="showCuttDetail"
                v-if="!mixin_isEmpty(CS_INFO.PHN_CUTT_ID)"
              ></compo-tooltip-btn>
            </div>

            <div class="spacing-wrap sp-16" v-if="!mixin_isEmpty(CS_INFO.CUTT_COACHING_ID)/*코칭이있는경우*/">
              <div>
                <strong>코칭일시</strong>
                <span class="ml-2">{{ COACHING_INFO.COACHING_REG_DT }}</span>
              </div>
              <div>
                <div>
                  <strong v-if="COACHING_INFO.IDNTY_YN ==='Y'?true:false">확인일시</strong>
                  <span class="ml-2" v-if="COACHING_INFO.IDNTY_YN ==='Y'?true:false">{{ COACHING_INFO.INQ_DT }}</span>
                  <span class="pl-badge is-bg-green ml-2" v-if="COACHING_INFO.IDNTY_YN ==='Y'?true:false">확인완료</span>
                  <span class="pl-badge is-bg-red ml-2" v-if="COACHING_INFO.IDNTY_YN ==='N'?true:false">확인안함</span>
                  <span class="pl-badge is-bg-green ml-2" v-if="COACHING_INFO.PRCS_YN ==='Y'?true:false">피드백완료</span>
                  <span class="pl-badge is-cyan ml-2" v-if="COACHING_INFO.OUTSIDE_YN === 'I'">내부</span>
                  <span class="pl-badge is-cyan ml-2" v-if="COACHING_INFO.OUTSIDE_YN === 'E'">외부</span>
                </div>
              </div>
            </div>
            <div class="spacing-wrap sp-16" v-if="!mixin_isEmpty(CS_INFO.CUTT_COACHING_ID)/*코칭이있는경우*/ && COACHING_INFO.OUTSIDE_YN === 'I'"><!--내부-->
              <div>
                <strong>코칭자</strong>
                <span class="ml-2">{{ COACHING_INFO.COACHING_USER_NM + '(' + COACHING_INFO.COACHING_USER_DEPT + ')' }}</span>
              </div>
            </div>
          </div>
          <div style="position: absolute; right: 0; top: 0;">
            <compo-tooltip-btn
              TitleProp="닫기"
              ClassProp="pl-tooltip-btn ml-1"
              IconProp="pl-icon20 dialog-close-black"
              TooltipPositionProp="bottom"
              @btnClick="close()"
            ></compo-tooltip-btn>
          </div>
        </div>
      </div>
      <!-- tabs -->
      <v-tabs class="pl-tabs is-mt-s" v-model="selectedTabIndex">
        <v-tab>코칭 내용</v-tab>
        <v-tab>
          <v-badge v-if="COACHING_INFO.PRCS_YN ==='Y'?true:false" value="true" color="blue" bordered offset-x="-1" offset-y="9" dot>상담사 피드백</v-badge>
          <span v-if="mixin_isEmpty(COACHING_INFO.PRCS_YN) || COACHING_INFO.PRCS_YN ==='N'?true:false">상담사 피드백</span>
        </v-tab>

        <!-- 코칭 내용 및 의견 -->
        <v-tab-item >
          <div class="px-5">
            <!-- 고객 정보 -->
            <div class="pt-4 ">
              <h3 class="pl-subtit ">고객정보</h3>
              <div class="is-mt-m">
                <div class="pl-vertical-list type-2">
                  <div
                    class="pl-vertical-list--unit px-0"
                    v-for="item in CUST_INFO"
                    :key="item.id">
                    <v-icon :class="`pl-icon20 ${ item.icon }`"></v-icon>
                    <strong class="ml-1" style="flex: 0 0 70px">{{ item.title }}</strong>
                    <span class="ml-2">{{ (item.val) ? item.telYn ? mixin_setPhoneNo(item.val) : item.val : '' }}</span>
                  </div>
                </div>
              </div>
            </div>
            <!-- 상담 상세내역 -->
            <div class="is-mt-m pt-4 is-border-sub-top">
              <h3 class="pl-subtit">상담 내용</h3>
              <div class="d-flex align-center is-mt-m" v-if="CS_INFO.CALL_ID">
                <CompoAudioWave :AudioProp=CS_INFO :WidthProp=350 />
              </div>
              <div class="spacing-wrap sp-8 flex-column is-mt-m">
                <div class="d-flex align-center">
                  <v-icon class="pl-icon20 calendar-list"></v-icon>
                  <strong class="ml-1" style="flex: 0 0 80px">상담 유형</strong>
                  <span v-html="CS_INFO.FULL_CUTT_TYPE_NM"></span>
                </div>
                <div class="d-flex align-center">
                  <v-icon class="pl-icon20 calendar-place"></v-icon>
                  <strong class="ml-1" style="flex: 0 0 80px">상담 지역</strong>
                  <span v-if="CS_INFO.CTPV_NM">{{ CS_INFO.CTPV_NM+'>'+CS_INFO.SGG_NM+'>'+CS_INFO.DSTRCT_NM }}</span>
                </div>
                <div class="d-flex ">
                  <v-icon class="pl-icon20 person-part" style="flex: 0 0 20px"></v-icon>
                  <strong class="ml-1" style="flex: 0 0 80px">상담 내용</strong>
                  <p style="white-space: pre-line; width:100%; height: 120px" class="pa-3 is-bg-light pl-scroll-body rounded-lg">
                    {{ CS_INFO.CUTT_CN }}
                  </p>
                </div>
              </div>
            </div>
            <!-- 코칭 내용 및 의견 -->
            <div class=" is-mt-m is-border-sub-top pt-3">
              <div class="d-flex align-center">
                <h3 class="pl-subtit">코칭 내용 및 의견</h3>
                <span class="pl-badge is-bg-green ml-2" v-if="COACHING_INFO.IDNTY_YN ==='Y'?true:false">확인완료 {{ COACHING_INFO.INQ_DT }}</span>
                <div class="pl-form-inline-wrap ml-auto">
                  <div class="pl-form-inline">
                    <span class="pl-label">
                      코칭사유
                    </span>
                    <div class="pl-desc">
                      <v-select
                        class="pl-form type-middle"
                        style="width:180px"
                        v-model="COACHING_INFO.COACHING_RSN_CD"
                        :items="mixin_common_code_get(common_code, 'COACH_TP')"
                        placeholder="선택"
                        :disabled="COACHING_INFO.IDNTY_YN ==='Y'?true:false"
                      ></v-select>
                    </div>
                  </div>
                </div>
              </div>
              <v-textarea
                  height="150"
                  class="pl-form is-noresize is-mt-m "
                  v-model="COACHING_INFO.CN"
                  placeholder="코칭의견 입력"
                  :disabled="COACHING_INFO.IDNTY_YN ==='Y'?true:false"
              />
            </div>
          </div>
        </v-tab-item>
        <!-- 코칭에 따른 상담사 처리결과 -->
        <v-tab-item >
          <div class="px-5 is-mt-m">
            <div class="d-flex align-center">
              <h3 class="pl-subtit">처리결과 내용 </h3>
              <span class="pl-badge is-bg-green ml-2" v-if="COACHING_INFO.PRCS_YN ==='Y'?true:false">피드백완료 {{ COACHING_INFO.PRCS_REG_DT }}</span>
            </div>
            <v-textarea
              height="300"
              class="pl-form is-noresize is-mt-m "
              v-model="COACHING_INFO.PRCS_CN"
              placeholder="피드백 내용입력"
              :disabled="CUSL_INFO.CUSL_ID !== user_id"
            />
          </div>
        </v-tab-item>

      </v-tabs>

    </div>
    <div
      v-if="selectedTabIndex !== 2"
      class="pl-quick-layer-footer">
      <div class="pl-btn-wrap is-left">
        <template v-if='this.computedUserType === "LEADER" || this.computedUserDetailType === "SYS_HUMAN"'>
          <span v-if="(!mixin_isEmpty(CS_INFO.PHN_CUTT_ID)) && mixin_isEmpty(CS_INFO.CUTT_COACHING_ID)">※ 코칭내용및의견 저장 후 감점처리 가능합니다.</span>
          <template v-if="(!mixin_isEmpty(CS_INFO.PHN_CUTT_ID)) && !mixin_isEmpty(COACHING_INFO.CUTT_COACHING_ID)">
          </template>
          <v-btn class="pl-btn" @click="aplcnStrtScore" :disabled="COACHING_INFO.STRT_APLCN_YN === 'Y'">감점적용</v-btn>
          <v-btn class="pl-btn" @click="deleteStrtScore" v-if="COACHING_INFO.STRT_APLCN_YN === 'Y'">감점취소</v-btn>

        </template>
        <template v-if='COACHING_INFO.IDNTY_YN === "N" && COACHING_INFO.CUSL_ID === user_id'>
          <!-- 본인에게 온 코칭정보인 경우 확인여부업데이트 -->
          <v-btn class="pl-btn" @click="updateCuttCoachingIdnty">
            코칭 내용을 확인하였습니다.
          </v-btn>
        </template>
      </div>
      <div class="pl-btn-wrap ml-auto">
        <template>
          <v-btn class="pl-btn is-trans" @click="close()">닫기</v-btn>
        </template>
        <template v-if="selectedTabIndex === 0 &&
          (!mixin_isEmpty(CS_INFO.CUTT_COACHING_ID) && (COACHING_INFO.COACHING_USER_ID === user_id && COACHING_INFO.IDNTY_YN === 'N'?true:false))
          /* 코칭ID 있는경우 내가코칭한거 + 상담사가 확인안한경우 삭제 수정가능 */
          ||(mixin_isEmpty(CS_INFO.CUTT_COACHING_ID) &&  CUSL_INFO.CUSL_ID !== user_id)
          /* 코칭ID 없는경우 상담사가 내가 아닌경우 저장버튼 활성화. */
        ">
          <!-- 코칭정보가 없는경우는 본인이 아닌경우 저장버튼 표시 || 내가 코칭한경우는 상담사 확인전이면 수정버튼 활성화 -->
          <v-btn class="pl-btn is-trans is-icon" @click="deleteCoaching()" v-if="!mixin_isEmpty(CS_INFO.CUTT_COACHING_ID)"> <v-icon class="pl-icon20 trash"></v-icon>삭제</v-btn>
          <v-btn class="pl-btn" @click="saveCoachingInfo()" v-if="!mixin_isEmpty(CS_INFO.CUTT_COACHING_ID)">수정</v-btn>
          <v-btn class="pl-btn" @click="saveCoachingInfo()" v-if="(!mixin_isEmpty(CS_INFO.PHN_CUTT_ID)) && mixin_isEmpty(CS_INFO.CUTT_COACHING_ID)">저장</v-btn>
        </template>
        <template v-if="selectedTabIndex === 1 && COACHING_INFO.PRCS_YN ==='N' && CUSL_INFO.CUSL_ID === user_id/* 상담사피드백탭에서는 상담사본인에게만 저장버튼 활성화. */">
          <v-btn class="pl-btn" @click="saveCoachingFeedback()" v-if="!mixin_isEmpty(CS_INFO.CUTT_COACHING_ID)">저장</v-btn>
        </template>
      </div>
    </div>

    <!-- 감점적용 form.  -->
    <v-dialog
        v-model="dialogAdorsubForm"
        width="480"
        content-class="pl-top-profile-dialog type-center"
        persistent>
      <compo-dialog
          header-title="감점 적용"
          :HideCloseProp=false
          @hide="mixin_hideDialog('AdorsubForm')"
      >
        <template slot="body">
          <!-- 데이터 있을때 -->
          <template >
            <div class="">
              <!-- top -->
              <div class="pl-top-profile-dialog-desc-wrap ml-3">
                <div class="d-flex ">
                <strong style="font-size: 15px">감점 적용</strong>
                <v-btn
                    @click="dialogAdorsubForm = false"
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
              </div>
              <div class=" py-3">
                <div class="is-border-sub-top pt-3">
                  <div class="spacing-wrap sp-8 flex-column">
                    <div class="d-flex align-center">
                      <v-icon class="pl-icon20 document"></v-icon>
                      <strong class="ml-1" style="flex: 0 0 80px">감점항목</strong>
                      <div class="spacing-wrap sp-4">
                        <v-select
                            class="pl-form type-middle"
                            style="flex: 0 0 180px"
                            v-model="ADORSUB.ADORSUB_ARTCL_OBJ"
                            :items="ADORSUB_ITEMS"
                            return-object
                            placeholder="선택"
                            @change="ADORSUB.SCR = ADORSUB.ADORSUB_ARTCL_OBJ.SCR"
                        ></v-select>
                        <span class="pl-label" style="flex: 0 0 40px !important">
                          <span class="ml-1">점수</span>
                        </span>
                        <v-text-field
                            style="flex: 0 0 76px"
                            class="pl-form type-middle"
                            v-model="ADORSUB.SCR"
                            disabled
                        />
                      </div>
                    </div>
                    <div class="is-border-sub-top mt-1 pt-3">
                      <div class="d-flex ">
                        <v-icon class="pl-icon20 tit-paragraph"></v-icon>
                        <span class="ml-1" style="flex: 0 0 80px">내용</span>
                        <v-textarea
                            height="80"
                            class="pl-form is-noresize"
                            v-model="ADORSUB.RSN"
                            placeholder="내용 입력"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </template>
        <template slot="footer">
          <v-btn class="pl-btn is-trans ml-auto" @click="mixin_hideDialog('AdorsubForm')">닫기</v-btn>
          <v-btn class="pl-btn" @click="saveAdorsub">저장</v-btn>
        </template>
      </compo-dialog>
    </v-dialog>
  </div>
</template>

<script>
/*
 * 상담사 + 팀장 + 센터장 + 외부(인재개발) 화면에서 공통으로 사용하는 화면입니다.
 */
import CompoAudioWave from '@/components/CompoAudioWave'

export default {
  name: "HOME_COACHING_DETAIL", //name은 'MENU_' + 파일명 조합
  props: {
    injectionObj: {
      type: Object,
      default:null
    }
  },
  components: {
    CompoAudioWave,
  },
  data() {
    return {
      selectedTabIndex: 0,
      common_code : [],
      SRCH_PHN_CUTT_ID:'',
      SRCH_CUSTCO_ID:'',
      CUST_INFO:[
        { title:'인입번호', icon: 'cs-phone', val: '', telYn : true },
        { title:'휴대전화', val: '', telYn : true },
        { title:'고객 ID', icon: 'cs-black', val: '' },
        { title:'고객명', val: '' },
      ], //고객정보
      CUSL_INFO:{
        IMG:'',
        USER_NM:'',
        CUSL_ID:'',
        CUSL_NM:'',
        CUSL_CUSTCO_NM:'',
        CUSL_DEPT_NM:'',
      },
      //상담사 정보
      CS_INFO : {
        audio:{},  /*오디오*/
        FULL_CUTT_TYPE_NM:'',  /*상담유형*/
        CTPV_NM:'',  /*상담지역*/
        SGG_NM:'',  /*상담지역*/
        DSTRCT_NM:'',  /*상담지역*/
        CUTT_CN:'',  /*상담내용*/
        CUTT_COACHING_ID:'',  /*코칭ID*/
      },
      //상담 정보
      COACHING_INFO: {
        COACHING_REG_DT:'',/*코칭일시*/
        COACHING_USER_ID:'',/*코칭자*/
        COACHING_USER_NM:'',/*코칭자*/
        OUTSIDE_YN:'',/*내부(I),외부(E)*/
        IDNTY_YN:'',/* 상담사 확인(read)여부*/
        INQ_DT:'',/* 상담사 확인일시(read)여부*/
        COACHING_RSN_CD:'',/* 코칭결과코드 */
        CN:'',/* 코칭의견 */
        PRCS_YN:'',/* 처리내용(상담사피드백내용) */
        PRCS_CN:'',/* 처리내용(상담사피드백내용) */
        PRCS_REG_DT:'',/* 처리일시(상담사피드백일시) */
      },

      dialogAdorsubForm:false, /*감점폼.*/
      ADORSUB_ITEMS:[
        {text: "선택", value: '', SCR:''},
        {text: "오안내", value: 'PMP20', SCR:'-0.2'},
        {text: "알리미오등록", value: 'PMP21', SCR:'-1'},
        {text: "업무프로세스미준수1", value: 'PMP3', SCR:'-0.5'},
        {text: "업무프로세스미준수2", value: 'PMP25', SCR:'-0.2'},
      ],
      ADORSUB:{
        ADORSUB_ARTCL_OBJ:'',
        SCR:'',
        RSN:'',
      },

    }
  },
  computed: {
  },
  watch: {
    injectionObj() {
      if( this.injectionObj.PHN_CUTT_ID !== undefined ) { //
        this.SRCH_PHN_CUTT_ID = this.injectionObj.PHN_CUTT_ID ;
        this.SRCH_CUSTCO_ID = this.injectionObj.CUSTCO_ID;
        this.selectCuttDetailInfo(); //코칭정보 조회
      }
    },
  },
  mounted() {
  },
  beforeDestroy(){
  },

  async created() {

    //공통코드설정
    let codeName = ['COACH_TP', 'PMP']; //코칭 결과 유형, 코칭 감점항목
    this.common_code = await this.mixin_common_code_get_all(codeName);

    let adorsubList = this.mixin_common_code_get(this.common_code, 'PMP');

    this.ADORSUB_ITEMS = [{text: '선택', value: '', SCR:'', ord:0}];
    
    adorsubList.forEach((item, idx) => {
      if(item.cd_vl1 === 'COACHING'){
        this.ADORSUB_ITEMS.push({text: item.text, value: item.value, SCR:item.cd_vl4, ord:item.cd_vl2});
      }
    });

    this.ADORSUB_ITEMS.sort((a, b) => a.ord - b.ord);

    if( this.injectionObj != null && this.injectionObj.PHN_CUTT_ID !== undefined ) { //
      this.SRCH_PHN_CUTT_ID = this.injectionObj.PHN_CUTT_ID ;
      this.SRCH_CUSTCO_ID = this.injectionObj.CUSTCO_ID;
      this.selectCuttDetailInfo(); //코칭정보 조회
    }
  },
  methods: {
    close(){
      this.$emit('Close');
    },

    initData() {
      this.CUST_INFO = [
        { title:'인입번호', icon: 'cs-phone', val: '', telYn : true },
        { title:'휴대전화', val: '', telYn : true },
        { title:'고객 ID', icon: 'cs-black', val: '' },
        { title:'고객명', val: '' },
      ];
      this.CUSL_INFO = {
        IMG:'',
        USER_NM:'',
        CUSL_ID:'',
        CUSL_NM:'',
        CUSL_CUSTCO_NM:'',
        CUSL_DEPT_NM:'',
      };
      //상담사 정보
      this.CS_INFO = {
        audio:{},  /*오디오*/
        FULL_CUTT_TYPE_NM:'',  /*상담유형*/
        CTPV_NM:'',  /*상담지역*/
        SGG_NM:'',  /*상담지역*/
        DSTRCT_NM:'',  /*상담지역*/
        CUTT_CN:'',  /*상담내용*/
        CUTT_COACHING_ID:'',  /*코칭ID*/
      };
      //상담 정보
      this.COACHING_INFO = {
        COACHING_REG_DT:'',/*코칭일시*/
        COACHING_USER_ID:'',/*코칭자*/
        COACHING_USER_NM:'',/*코칭자*/
        OUTSIDE_YN:'',/*내부(I),외부(E)*/
        IDNTY_YN:'',/* 상담사 확인(read)여부*/
        INQ_DT:'',/* 상담사 확인일시(read)여부*/
        COACHING_RSN_CD:'',/* 코칭결과코드 */
        CN:'',/* 코칭의견 */
        PRCS_YN:'',/* 처리내용(상담사피드백내용) */
        PRCS_CN:'',/* 처리내용(상담사피드백내용) */
        PRCS_REG_DT:'',/* 처리일시(상담사피드백일시) */
      };
    },

    async selectCuttDetailInfo() {
      this.initData();
      let postParam = {PHN_CUTT_ID : this.SRCH_PHN_CUTT_ID, SCH_CUSTCO_ID: this.SRCH_CUSTCO_ID };
      let headParam = {};
      const response = await this.common_postCall("/phone-api/cutt/selectCuttHistDetail", postParam, headParam);
      if(response && !response.HEADER.ERROR_FLAG) {
        let data = response.DATA[0];
        // 상담사정보
        this.CUSL_INFO = data;
        //상담정보
        this.CS_INFO = data;
        this.CS_INFO.FULL_CUTT_TYPE_NM = data.FULL_CUTT_TYPE_NM.replaceAll("&gt;","");

        // 고객정보
        this.CUST_INFO = [
          { title:'인입번호', icon: 'cs-phone', val: data.CUST_PHN_NO, telYn : true },
          { title:'휴대전화', val: data.CUST_PHN_NO, telYn : true },
          { title:'고객 ID', icon: 'cs-black', val: data.CUST_IDNTF_NO },
          { title:'고객명', val: data.CUST_NM },
        ];

        if( !this.mixin_isEmpty(this.CS_INFO.CUTT_COACHING_ID) ) {
          await this.selectCuttCoachingInfo(this.CS_INFO.CUTT_COACHING_ID);
        }
      }
    },

    async selectCuttCoachingInfo( coachingId ) {
      let sURL = '/api/biz/common/select/selectPhnCuttCoachingList';
      let headParam = {head: {"ns": 'lhcs.phone.cutt.dao.PhoneCuttCoachingMapper'}};
      let postParam = {SRCH_CUTT_COACHING_ID: coachingId };
      const response = await this.common_postCall(sURL, postParam, headParam);
      if(response && !response.HEADER.ERROR_FLAG) {
        this.COACHING_INFO = response.DATA[0];  // 코칭정보
      }
    },

    /* 코칭의견 저장. */
    async saveCoachingInfo() {
      console.log("saveCoachingInfo");
      if( this.mixin_isEmpty(this.COACHING_INFO.COACHING_RSN_CD)  ) {
        this.showAlertCaution({msg : '코칭 사유를 선택하세요.'});
        return;
      }
      if( this.mixin_isEmpty(this.COACHING_INFO.CN) ) {
        this.showAlertCaution({msg : '코칭 내용 및 의견을 입력하세요.'});
        return;
      }
      let msg = '코칭의견을 저장하시겠습니까?';
      if( !this.mixin_isEmpty(this.CS_INFO.CUTT_COACHING_ID) ) msg = '코칭의견을 수정하시겠습니까?';
      this.showConfirmInfo({msg: msg
          , callYes: () => {
            this.saveCoachingInfoProcess();
            this.closeAlert();
          }
          , callNo: this.closeAlert}
      );
    },
    async saveCoachingInfoProcess() {
      let sURL = '/phone-api/cutt/coaching/insertCuttCoaching';
      if( !this.mixin_isEmpty( this.CS_INFO.CUTT_COACHING_ID ) ) {
        sURL = '/phone-api/cutt/coaching/updateCuttCoaching';
      }
      let postParam = this.COACHING_INFO;
      postParam.PHN_CUTT_ID = this.CS_INFO.PHN_CUTT_ID;
      postParam.CUSL_ID = this.CS_INFO.CUSL_ID; //상담사 USRID
      postParam.SRCH_DEPT_ID = this.CS_INFO.RCPT_DEPT_ID; //상담사 부서ID.
      let headParam = {};
      let response = await this.common_postCall(sURL, postParam, headParam);
      if (!response.HEADER.ERROR_FLAG) {
        this.showToastInfo({msg : '정상적으로 처리되었습니다.' , type:'bottom'});
        
        console.log('this.CS_INFO.CUTT_COACHING_ID : ', this.CS_INFO.CUTT_COACHING_ID, response.DATA[0].CUTT_COACHING_ID);
        if( this.mixin_isEmpty(this.CS_INFO.CUTT_COACHING_ID) ) {
          this.mixin_reloadCuttStat('USER_APLY_PROC_STAT');
          this.$eventBus.$emit('refreshCoachingGridList', {PHN_CUTT_ID: this.CS_INFO.PHN_CUTT_ID, CUTT_COACHING_ID: response.DATA[0].CUTT_COACHING_ID } );
          this.CS_INFO.CUTT_COACHING_ID = response.DATA[0].CUTT_COACHING_ID;
        }

        console.log('this.CS_INFO.CUTT_COACHING_ID : ', this.CS_INFO.CUTT_COACHING_ID, response.DATA[0].CUTT_COACHING_ID);
        this.closeAlert();
        this.selectCuttDetailInfo();
      }
    },
    /* 코칭삭제. */
    async deleteCoaching() {
      console.log("deleteCoaching");
      if(this.mixin_isEmpty(this.CS_INFO.CUTT_COACHING_ID)) {
        this.showAlertCaution( {msg: '코칭정보가 없습니다.'} );
        return;
      }else {
        this.showConfirmInfo({
              msg: '코칭내용을 삭제하시겠습니까?\n(확인안한 코칭정보는 삭제할 수 있습니다.)'
              , callYes: this.deleteCoachingProcess
              , callNo: this.closeAlert
            }
        );
      }
    },
    async deleteCoachingProcess() {
      let sURL = '/phone-api/cutt/coaching/deleteCuttCoaching';
      let postParam = {};
      postParam.CUTT_COACHING_ID = this.COACHING_INFO.CUTT_COACHING_ID;
      postParam.CUSL_ID = this.CS_INFO.CUSL_ID; //상담사 USRID
      postParam.SRCH_DEPT_ID = this.CS_INFO.RCPT_DEPT_ID; //상담사 부서ID.
      postParam.ADORSUB_TRGT_CD = 'CUTT_COACHING';
      postParam.ADORSUB_TRGT_VL = this.COACHING_INFO.CUTT_COACHING_ID;
      let headParam = {};
      let response = await this.common_postCall(sURL, postParam, headParam);
      if (!response.HEADER.ERROR_FLAG) {
        this.showToastInfo({msg : '정상적으로 삭제되었습니다.' , callAfter : ()=>{
            if( this.mixin_isEmpty(this.CS_INFO.CUTT_COACHING_ID) ) {
              this.mixin_reloadCuttStat('USER_APLY_PROC_STAT');
            }
            this.COACHING_INFO = {};
            this.closeAlert();
            this.selectCuttDetailInfo();
            this.$eventBus.$emit('refreshCoachingGridList');
          }});
      }
    },

    // 본인에게 온 코칭정보인 경우 확인여부업데이트
    async updateCuttCoachingIdnty() {
      let sURL = '/phone-api/cutt/coaching/updateCuttCoachingIdnty';
      let postParam = this.COACHING_INFO;
      let headParam = {};
      let response = await this.common_postCall(sURL, postParam, headParam);
      if (!response.HEADER.ERROR_FLAG) {
        this.selectCuttCoachingInfo( postParam.CUTT_COACHING_ID );
        this.mixin_reloadCuttStat('BOARD_STAT');  // 미니전광판(긴급+공지+팀공지+코칭) 리로드
      }
    },

    /* 코칭피드백 저장. */
    async saveCoachingFeedback() {
      console.log("saveCoachingFeedback");
      if(this.mixin_isEmpty(this.CS_INFO.CUTT_COACHING_ID)) {
        this.showAlertCaution( {msg: '코칭정보가 없습니다.'} );
        return;
      }else {
        if (this.mixin_isEmpty(this.COACHING_INFO.PRCS_CN)) {
          this.showAlertCaution({msg: '피드백 처리결과 내용을 입력하세요.'});
          return;
        }
        this.showConfirmInfo({
              msg: '피드백 내용을 저장하시겠습니까?\n주의) 저장한 피드백내용은 수정이 불가합니다.'
              , callYes: this.saveCoachingFeedbackProcess
              , callNo: this.closeAlert
            }
        );
      }
    },
    async saveCoachingFeedbackProcess() {
      let sURL = '/phone-api/cutt/coaching/updateCuttCoachingFeedback';
      let postParam = this.COACHING_INFO;
      postParam.CUSL_ID = this.CS_INFO.CUSL_ID; //상담사 USRID
      postParam.SRCH_DEPT_ID = this.CS_INFO.RCPT_DEPT_ID; //상담사 부서ID.
      let headParam = {};
      let response = await this.common_postCall(sURL, postParam, headParam);
      if (!response.HEADER.ERROR_FLAG) {
        this.showToastInfo({msg : '정상적으로 처리되었습니다.' , callAfter : ()=>{
            if( this.mixin_isEmpty(this.CS_INFO.CUTT_COACHING_ID) ) {
              this.mixin_reloadCuttStat('USER_APLY_PROC_STAT');
            }
            this.closeAlert();
            this.selectCuttDetailInfo();
          }});
      }
    },

    //감점적용.
    async aplcnStrtScore() {
      if(this.mixin_isEmpty(this.CS_INFO.CUTT_COACHING_ID)) {
        this.showAlertCaution( {msg: '코칭내용및 의견을 먼저 저장 후 감점정보를 입력할 수 있습니다. '} );
        return;
      }
      this.ADORSUB = { ADORSUB_ARTCL_OBJ:'', SCR:'', RSN:'', };
      this.mixin_showDialog('AdorsubForm');
    },
    async deleteStrtScore() {
      this.showConfirmInfo({
            msg: '감점 취소 하시겠습니까?'
            , callYes: this.deleteStrtScoreProcess
            , callNo: this.closeAlert
          }
      );
    },

    async deleteStrtScoreProcess() {
      let sURL = '/api/biz/common/update/deleteUserAdorsubHstryTRGT';
      let postParam = {};
      let headParam = {head: {"ns": 'lhcs.system.user.dao.AdorsubMapper',}}
      postParam.ADORSUB_TRGT_CD = 'CUTT_COACHING';
      postParam.ADORSUB_TRGT_VL = this.CS_INFO.CUTT_COACHING_ID;
      let response  =  await this.common_postCall(sURL, postParam, headParam);
      if (!response.HEADER.ERROR_FLAG){
        sURL = '/api/biz/common/update/updateCuttCoachingStrtAplcnYn';
        postParam = {};
        headParam = {head: {"ns": 'lhcs.phone.cutt.dao.PhoneCuttCoachingMapper',}}
        postParam.STRT_APLCN_YN = 'N'
        postParam.CUTT_COACHING_ID = this.CS_INFO.CUTT_COACHING_ID;
        await this.common_postCall(sURL, postParam, headParam);
        this.closeAlert();
        this.selectCuttDetailInfo();
      }
    },



    async saveAdorsub() {
      if(this.mixin_isEmpty(this.ADORSUB.ADORSUB_ARTCL_OBJ.value)) {
        this.showAlertCaution( {msg: '감점항목을 선택하세요.'} );
        return;
      }
      if(this.mixin_isEmpty(this.ADORSUB.RSN)) {
        this.showAlertCaution( {msg: '내용을 입력해주세요.'} );
        return;
      }
      this.showConfirmInfo({
            msg: '가감점에 선택한 감점을 추가 하시겠습니까?'
            , callYes: () => {
              this.saveAdorsubProcess();
              this.closeAlert();
            }
            , callNo: this.closeAlert
          }
      );
    },
    async saveAdorsubProcess() {
      let sURL = '/phone-api/cutt/coaching/saveAdorsub';
      let headParam = {};
      let postParam = {};
      postParam.CUTT_COACHING_ID = this.CS_INFO.CUTT_COACHING_ID;
      postParam.SRCH_USER_ID = this.CUSL_INFO.CUSL_ID;  /*대상자*/
      postParam.ADORSUB_ARTCL_CD = this.ADORSUB.ADORSUB_ARTCL_OBJ.value;
      postParam.ADORSUB_TRGT_CD = 'CUTT_COACHING';
      postParam.ADORSUB_TRGT_VL = this.CS_INFO.CUTT_COACHING_ID;
      postParam.SCR = this.ADORSUB.SCR;
      postParam.RSN = this.ADORSUB.RSN;
      postParam.APLCN_YMD = this.$moment(new Date()).format('YYYYMMDD');
      postParam.EXEC_USER_ID = this.user_id;
      let response  = await this.common_postCall(sURL, postParam, headParam);
      if (!response.HEADER.ERROR_FLAG){
        this.showToastInfo({msg : '정상 처리 되었습니다.'})
        
        this.mixin_hideDialog('AdorsubForm');
        this.closeAlert();
        this.selectCuttDetailInfo();
      }
      this.$store.commit("alertStore/hideAlert");

    },

    // 상담이력 상세보기 팝업 호출
    showCuttDetail(){
      this.mixin_openWindow( 'LayoutPopup', '1600', '850', {compo_name : 'CSL_M0100_DETAIL', callback : 'getPopData', title: '상담이력 상세보기', popData: this.CS_INFO, CUSTCO_ID: this.CS_INFO.CUSTCO_ID});
    },  
  },
};
</script>

<style lang="scss" scoped>

</style>