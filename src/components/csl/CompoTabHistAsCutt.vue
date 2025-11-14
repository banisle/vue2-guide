<template>
  <div
  :class="isPopup && 'px-5'">
    <!-- grid top -->
    <div
      v-if="isPopup"
      class="pl-grid-top is-border-top pt-2" >
      <div class="pl-grid-top-left spacing-wrap sp-16">
       &nbsp;
      </div>
      <div class="pl-grid-top-utils">
        <compo-excel
            TypeProp="Download"
            :DataHeaderProp="headersExcel"
            :DataBodyProp="HIST_AS_CUTT"
            :FileNameProp="'상담이력'+this.$moment(new Date()).format('YYYYMMDDHHmmss')"
            SheetNameProp="상담이력"
          />
      </div>
    </div>
    <div class="pl-cols">
      <div>
        <v-data-table
          class="pl-grid is-hover"
          :headers="headers"
          :items="HIST_AS_CUTT"
          fixed-header
          item-key="index"
          :height="isPopup ? '629px' : computedGridHeight"
          :items-per-page="ROW_PER_PAGE"
          :item-class="isActiveRow"
          hide-default-footer
          no-data-text="등록된 데이터가 없습니다."
          @click:row="rowClick"
          @dblclick:row="showCuttDtl()"
          @mouseover:row="rowMouseover"
          :loading="isLoading"
          loading-text="조회중입니다."
          :page.sync="page"
          @page-count="pageCount = $event">
          <!-- 녹취 -->
          <template v-slot:item.HAPPYCALL_YN="{ item }">
            <compo-tooltip-btn
              v-if="item.HAPPYCALL_YN == 'Y'"
              TitleProp="대화록 보기"
              ClassProp="pl-tooltip-btn ml-1"
              IconProp="pl-icon20 board-docu"
              TooltipPositionProp="bottom"
              :MinWidthProp=20
              :HeightProp=20
              @btnClick="showHappycall(item)"
            ></compo-tooltip-btn>
          </template>
          <!-- 녹취 -->
          <template v-slot:item.REC_YN="{ item }">
            <!-- <compo-tooltip-btn
              TitleProp="녹취 듣기"
              ClassProp="pl-tooltip-btn ml-1"
              IconProp="pl-icon20 audioControl"
              TooltipPositionProp="bottom"
              :MinWidthProp=20
              :HeightProp=20
              :DisabledProp="computedUserDetailType === 'MANAGER' ? (item['CUSL_ID'] === user_id ? false : true) : false"
              @btnClick="mixin_showListenAudio(item)"
            ></compo-tooltip-btn>
            <compo-tooltip-btn
              TitleProp="대화록 보기"
              ClassProp="pl-tooltip-btn ml-1"
              IconProp="pl-icon20 sts"
              TooltipPositionProp="bottom"
              :MinWidthProp=20
              :HeightProp=20
              :DisabledProp="computedUserDetailType === 'MANAGER' ? (item['CUSL_ID'] === user_id ? false : true) : false"
              @btnClick="mixin_showTalkLog(item)"
            ></compo-tooltip-btn> -->
            <template v-if="item['CALL_ID'] && (item['CALL_ID'].startsWith('CO') === false) "><!-- 콜아이디가 신형인경우만. 추후 마이그레이션 데이터에 대한 처리 필요함.  -->
              <compo-tooltip-btn
                TitleProp="녹취 듣기"
                ClassProp="pl-tooltip-btn ml-auto"
                IconProp="pl-icon20 audioControl"
                TooltipPositionProp="bottom"
                :MinWidthProp=20
                :HeightProp=20
                :DisabledProp="computedUserDetailType === 'MANAGER' ? (item['CUSL_ID'] === user_id ? false : true) : false"
                @btnClick="showListenAudio(item)"
              ></compo-tooltip-btn>
              <compo-tooltip-btn
                v-if="item['STT_YN'] === 'Y'"
                TitleProp="대화록 보기"
                ClassProp="pl-tooltip-btn ml-1"
                IconProp="pl-icon20 sts"
                TooltipPositionProp="bottom"
                :MinWidthProp=20
                :HeightProp=20
                :DisabledProp="computedUserDetailType === 'MANAGER' ? (item['CUSL_ID'] === user_id ? false : true) : false"
                @btnClick="mixin_showTalkLog(item)"
              ></compo-tooltip-btn>
            </template>
            <template v-if="item['CALL_ID'] && (item['CALL_ID'].startsWith('CO') === true) && !mixin_isEmpty(item['RECORD_KEY']) ">
              <compo-tooltip-btn
                TitleProp="녹취 듣기"
                ClassProp="pl-tooltip-btn ml-auto"
                IconProp="pl-icon20 audioControl"
                TooltipPositionProp="bottom"
                :MinWidthProp=20
                :HeightProp=20
                :DisabledProp="computedUserDetailType === 'MANAGER' ? (item['CUSL_ID'] === user_id ? false : true) : false"
                @btnClick="showListenAudio(item)"
              ></compo-tooltip-btn>
            </template>
          </template>
          <!-- 발신 -->
          <template v-slot:item.SEND_BTN_YN="{ item }">
            <compo-tooltip-btn
              v-if="item.SEND_BTN_YN == 'Y'"
              TitleProp="전화 걸기"
              ClassProp="pl-tooltip-btn ml-auto"
              IconProp="pl-icon20 td-in-call"
              TooltipPositionProp="bottom"
              :MinWidthProp=20
              :HeightProp=20
              @btnClick="btnSendCall(item)"
            ></compo-tooltip-btn>
          </template>

          <!-- 정보보기 -->
          <template v-slot:item.type_info="{ item }">
            <compo-tooltip-btn
              TitleProp="정보 보기"
              ClassProp="pl-tooltip-btn ml-1"
              IconProp="pl-icon20 preview"
              TooltipPositionProp="bottom"
              :MinWidthProp=20
              :HeightProp=20
              @btnClick="mixin_showDialog('Preview')"
            ></compo-tooltip-btn>
          </template>


          <!-- 상담유형 -->
          <!-- <template v-slot:item.FULL_CUTT_TYPE_NM="{item}">
            <v-tooltip content-class="pl-tooltip " bottom>
              <template v-slot:activator="{ on, attrs }">
                <span v-bind="attrs" v-on="on">
                  {{ item.FULL_CUTT_TYPE_NM }}
                </span>
              </template>
              <span>{{ item.FULL_CUTT_TYPE_NM }}</span>
            </v-tooltip>
          </template> -->
          <template v-slot:item.FULL_CUTT_TYPE_NM="{ item }">
            <v-tooltip content-class="pl-tooltip " bottom>
              <template v-slot:activator="{ on, attrs }">
                <span v-bind="attrs" v-on="on">
                  {{ mixin_decode(item['FULL_CUTT_TYPE_NM']).replace(/>/g, '') }}
                </span>
              </template>
              <span>{{ mixin_decode(item['FULL_CUTT_TYPE_NM']).replace(/>/g, '') }}</span>
            </v-tooltip>
          </template>
        </v-data-table>
      </div>
      <!-- 상담내용 -->
      <div class="is-col-fix ml-2" style="width: 30%">
        <table class="pl-tbl-detail fill-height" >
          <thead>
            <tr>
              <th class="text-left">
                <div class="d-flex align-center">
                  <v-icon class="pl-icon20 tit-paragraph"></v-icon>
                  <span class="ml-2">상담내용</span>
                  <div class="ml-auto spacing-wrap sp-4">
                    <!-- <compo-tooltip-btn
                      TitleProp="확대"
                      ClassProp="pl-tooltip-btn ml-auto"
                      IconProp="pl-icon20 expand"
                      TooltipPositionProp="bottom"
                      :MinWidthProp=22
                      :HeightProp=22
                    ></compo-tooltip-btn> -->
                    <compo-tooltip-btn
                      TitleProp="복사하기"
                      ClassProp="pl-tooltip-btn ml-auto"
                      IconProp="pl-icon20 copyPaste"
                      TooltipPositionProp="bottom"
                      :MinWidthProp=22
                      :HeightProp=22
                      @btnClick="copyCuttCn"
                    ></compo-tooltip-btn>
                    <compo-tooltip-btn
                      :TitleProp="!isLockCuttCn?'잠금':'해제'"
                      ClassProp="pl-tooltip-btn ml-auto"
                      IconProp="pl-icon20 lock"
                      TooltipPositionProp="bottom"
                      :MinWidthProp=22
                      :HeightProp=22
                      @btnClick="isLockCuttCn = !isLockCuttCn"
                    ></compo-tooltip-btn>
                  </div>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="vertical-align: top;">
                <div
                  :style="`overflow-y: scroll; white-space: pre-wrap; height: ${computedTextareaHeight} !important;`"
                  class="pl-txt-area pl-scroll-body flex-grow-1 CompoTabHistAsCutt"
                  >{{ CUTT_CN_VIEW }}</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>


    <!-- dialog: 해피콜 -->
    <v-dialog
      v-if="dialogHappyCallSurvey"
      v-model="dialogHappyCallSurvey"
      content-class="dialog-draggable is-lg is-maxHeight"
      hide-overlay>
      <div class="draggable-area">drag area</div>
      <compo-dialog
        :header-title="`만족도 조사(${happycallDialogTitle})`"
        @hide="mixin_hideDialog('HappyCallSurvey')"
      >
        <template slot="body">
          <CompoAsHappyCallSurvey
            ref="happycall"
            :DataProp="{CUST_ID: HAPPYCALL.CUST_ID, FLW_DTL_FULL_SN: HAPPYCALL.FLW_DTL_FULL_SN, SURVEY_DSTN_NO: HAPPYCALL.SURVEY_DSTN_NO}"
            :ReadOnlyProp="computedUserCenter === '4' ? false : true"
            @setDialogTitle="setHappycallDialogTitle"
            @disableSaveBtn="disableHappycallSaveBtn"
            @closeDialog="mixin_hideDialog('HappyCallSurvey')"
          />
        </template>
        <template slot="footer">
          <v-btn class="pl-btn is-trans" @click="mixin_hideDialog('HappyCallSurvey')">닫기</v-btn>
          <v-btn
            v-if="computedUserCenter === '4'"
            class="pl-btn"
            @click="$refs.happycall.btnSave()"
            :disabled="isDisableHappycallSaveBtn">저장</v-btn>
        </template>
      </compo-dialog>
    </v-dialog>
    <!-- 녹취 재생 -->
    <v-dialog
        v-if="dialogListenAudio"
        v-model="dialogListenAudio"
        content-class="dialog-draggable"
        hide-overlay>
      <div class="draggable-area">drag area</div>
      <compo-dialog
          header-title="녹취 재생"
          @hide="mixin_hideDialog('ListenAudio')"
          @submit="submitDialog('ListenAudio')"
      >
        <template slot="body">
          <CompoManagerInfo/>
          <!-- 상담 상세내역 -->
          <div class="is-mt-m is-border-sub-top">
            <div class="d-flex align-center is-mt-m">
              <CompoAudioWave
                  :WidthProp=250
                  :AudioProp="AudioProp"
              />
            </div>
          </div>
        </template>
      </compo-dialog>
    </v-dialog>

    <!-- 정보 보기 -->
    <v-dialog
      v-model="dialogPreview"
      content-class="dialog-draggable"
      hide-overlay>
      <div class="draggable-area">drag area</div>
      <compo-dialog
        header-title="정보 보기"
        @hide="mixin_hideDialog('Preview')"
      >
        <template slot="body">
          <CompoTabHistAsCuttPreview />
        </template>
      </compo-dialog>
    </v-dialog>

  </div>
</template>

<script>
  import CompoManagerInfo from '@/components/CompoManagerInfo.vue';
  import CompoAudioWave from '@/components/CompoAudioWave.vue';
  import CompoAsHappyCallSurvey from '@/components/CompoAsHappyCallSurvey.vue'
  import CompoTabHistAsCuttPreview from '@/components/csl/CompoTabHistAsCuttPreview.vue'

  export default {
    name: 'CompoTabHistAsCutt', //상담 - 이력 정보 - 바로처리 상담이력 탭
    components: {
      CompoManagerInfo,
      CompoAudioWave,
      CompoAsHappyCallSurvey,
      CompoTabHistAsCuttPreview
    },
    props: {
      TabProp: {
        type: Number,
        default: null,
      },
      CustInfoProp: {
        type: Object,
        default: () => {},
      },
      injectionObj: {
        type: Object,
        default: null,
      },
      readOnly: {
        type: Boolean,
        default : false
      },
      detailYn: {
        type: Boolean,
        default : false
      },
      SCH_CUSTCO_ID: {
        type: String,
        default : "4"
      }
    },
    data(){
      return{
        // dialog: 정보보기
        dialogPreview: false,

        //고객사 ID : 바로처리 : '4'
        CUSTCO_ID: this.$store.getters["userStore/GE_USER_COMPANY"].CUSTCO_ID,

        isPopup : false,

        //주택번호
        HNO: '',
        //고객 ID
        CUST_ID: '',

        //바로처리 상담 이력
        HIST_AS_CUTT: [],
        //선택된 항목
        SEL_ITEM: {},
        //상담내용
        CUTT_CN_VIEW: '',
        //해피콜 호출 정보
        HAPPYCALL : {},

        //mouseover index
        mouseOverIndex: -1,
        //상담내용 잠금 여부 - click:row 시 toggle 처리
        isLockCuttCn: false,

        // 대화록
        dialogTalkLog: false,
        talk_data: [
          {
            img: require('@/assets/img/@leader_portrait.png'),
            name: '우성아',
            date: '2024-06-10 13:20:45',
            text: '안녕하십니까. 마이홈센터 우성아입니다. 무엇을 도와드릴까요?',
            type: 'manager'
          },
          {
            img: require('@/assets/img/@manager_profile_default.png'),
            name: '고객',
            date: '2024-06-10 13:20:58',
            text: '네 국민임대주택에 대해 문의 드립니다.',
            type: 'cs'
          },
          {
            img: require('@/assets/img/@leader_portrait.png'),
            name: '우성아',
            date: '2024-06-10 13:21:02',
            text: '네, 그러시군요. 그럼 어느 지역의 국민임대 주택을 안내해 드릴까요?',
            type: 'manager'
          },
          {
            img: require('@/assets/img/@manager_profile_default.png'),
            name: '고객',
            date: '2024-06-10 13:21:05',
            text: '음... 화성시 비봉이요.',
            type: 'cs'
          },
          {
            img: require('@/assets/img/@leader_portrait.png'),
            name: '우성아',
            date: '2024-06-10 13:21:09',
            text: '네에, 그러 시군요 잠시만 기다려 주시면 해당 지역 공고 확인 후 곧바로 안내해 드리겠습니다.',
            type: 'manager'
          },
          {
            img: require('@/assets/img/@leader_portrait.png'),
            name: '우성아',
            date: '2024-06-10 13:21:17',
            text: '기다려 주셔서 감사합니다. 조금전에 문의 주신 화성시 비봉 국민임대주택에 대해 안내 드리기에 앞서 죄송 하오나, 안내전에 몇가지 질문 후 도와드리도록 하겠습니다.',
            type: 'manager'
          },
        ],

        // 녹취
        dialogListenAudio: false,
        data: {
          PROFILE: {
            name: '김한나',
            img: require('@/assets/img/@manager_profile4.png'),
            part: '마이홈센터 - 마이홈1팀',
            rcv_date: '2024-06-20 09:30:25',
            exc_date: '2024-06-20 09:38:05',
            excuter: '김한나',
            status: '상담완료',
            statusColor: 'is-bg-green',
          },
          CUS_INFO: [
            { title:'인입번호', icon: 'cs-phone', val: '010-5303-4545' },
            { title:'휴대전화', val: '010-5303-4545' },
            { title:'전화번호1', val: '02-1234-8975' },
            { title:'전화번호2', val: '02-9876-2826' },
            { title:'전화번호3', val: '02-1234-8975' },
            { title:'이메일', val: 'Heons@hkcloud.co.kr' },
            { title:'고객 ID', icon: 'cs-black', val: 'CT169776487781660258' },
            { title:'고객명', val: '나고객' },
          ],
          CS_INFO: {
            audio: { audioSrc: require('@/assets/file_example_MP3_700KB.mp3'), } ,
          },
        },

        // 전화걸기
        dialogOutCall: false,
        OUT_CALL_DATA: {
          dropItems: ['마이홈센터'],
          dropItems2: [],
          CUST_PHN_NO: '010-5303-0000',
        },

        textareaValue: `상담번호: 510247758
통화자/연락처: 송우섭/01089480026
AS접수번호: 231227-44-00909

[개인정보동의]
AS접수 1건
-주방 수전 사용시 헤드부분 누수`,

        // grid
        isLoading: false,
        page: 1,
        pageCount: 0,
        perPage: [15,30,50,100],
        ROW_PER_PAGE: 1000,
        //header - 발신은 created에서 팝업이 아닌 경우에 추가함.
        headers: [
          { text: '번호', value: 'ROW_NUM', align: 'center', width: '4%', sortable: false },
          { text: '접수일시', value: 'REG_DT', align: 'center', width: '120px',sortable: false },
          { text: '상담사', value: 'CUSL_NM', align: 'center', width: '70px', sortable: false  },
          { text: '경로', value: 'DRWI_TYPE_CD', align: 'center', width: '5%', sortable: false  },
          { text: '채널', value: 'RCPT_CHN_NM', align: 'center', width: '5%', sortable: false  },
          { text: '처리방법', value: 'PRCS_CHN_NM', align: 'center', width: '9%', sortable: false  },
          { text: '상담유형', value: 'FULL_CUTT_TYPE_NM', align: 'center text-left-important', width: '', sortable: false  },
          { text: '동의여부', value: 'PRVC_CLCT_AGRE_YN', align: 'center', width: '6%', sortable: false  },
          { text: '해피콜', value: 'HAPPYCALL_YN', align: 'center', width: '5%', sortable: false  },
          { text: '녹취', value: 'REC_YN', align: 'center', width: '6%', sortable: false  },
          { text: 'AS정보', value: 'FLAW_CNT', align: 'center', width: '6%', sortable: false  },
          { text: '접촉횟수', value: 'CONTACT_CNT', align: 'center', width: '6%', sortable: false  },
          // { text: '정보', value: 'type_info', align: 'center', width: '6%', sortable: false  },
        ],

        headersExcel: [
          { text: '번호', value: 'ROW_NUM', align: 'center', width: '70', sortable: false },
          { text: '접수일시', value: 'REG_DT', align: 'center', width: '150',sortable: false },
          { text: '상담사', value: 'CUSL_NM', align: 'center', width: '90', sortable: false  },
          { text: '경로', value: 'DRWI_TYPE_CD', align: 'center', width: '60', sortable: false  },
          { text: '채널', value: 'RCPT_CHN_NM', align: 'center', width: '80', sortable: false  },
          { text: '처리방법', value: 'PRCS_CHN_NM', align: 'center', width: '130', sortable: false  },
          { text: '상담유형', value: 'FULL_CUTT_TYPE_NM', align: 'left', width: '450', sortable: false  },
          { text: '동의여부', value: 'PRVC_CLCT_AGRE_YN', align: 'center', width: '80', sortable: false  },
          { text: 'AS정보', value: 'FLAW_CNT', align: 'center', width: '80', sortable: false  },
          { text: '접촉횟수', value: 'CONTACT_CNT', align: 'center', width: '85', sortable: false  },
          { text: '상담내용', value: 'CUTT_CN_VIEW', align: 'left', width: '800', sortable: false  },
        ],

        //해피콜 다이얼로그
        dialogHappyCallSurvey: false,
        happycallDialogTitle: '',
        isDisableHappycallSaveBtn : false,
      }
    },
    beforeDestroy() {
      this.$eventBus.$off("refreshHistAsCutt");
    },
    created() {
      console.log("CompoTabHistAsCutt created", this.CustInfoProp)
      //상담 상세 팝업에서 수정 시 상담이력 새로고침
      this.$eventBus.$on("refreshHistAsCutt", () => {
        this.getHistAsCutt();
      });

      if(this.injectionObj != null && this.injectionObj.TabProp > -1) {
        this.TabProp = this.injectionObj.TabProp
        this.CustInfoProp = this.injectionObj.CustInfoProp
        this.isPopup = true;
      } else {
        //팝업이 아닌 경우 발신 헤더 추가함.
        //조회전용 팝업에서는 추가 안함.
        if(!this.readOnly && !this.detailYn) {
          this.headers.push({ text: '발신', value: 'SEND_BTN_YN', align: 'center', width: '5%', sortable: false})
        }
      }

      if(this.CustInfoProp && this.CustInfoProp.HO_ADM_NO) {
        this.HNO = this.CustInfoProp.HO_ADM_NO;
        this.CUST_ID = this.CustInfoProp.CUST_ID
      }

      this.getHistAsCutt();
    },
    watch: {
      CustInfoProp() {
        console.log("CustInfoProp", this.CustInfoProp)
        const hno = this.CustInfoProp.HO_ADM_NO;
        const custId = this.CustInfoProp.CUST_ID;
        if(this.HNO != hno || this.CUST_ID != custId) {
          this.HNO = hno;
          this.CUST_ID = custId;
          this.getHistAsCutt();
        }
      },
      TabProp() {
        if(this.TabProp == 2) {
          this.getHistAsCutt();
        }
      },
    },
    methods: {
      //바로처리 상담 이력 조회
      async getHistAsCutt() {
        this.HIST_AS_CUTT = [];
        this.CUTT_CN_VIEW = '';
        this.mouseOverIndex = -1;
        let postParam = {
            SCH_CUSTCO_ID: this.SCH_CUSTCO_ID,
            HNO: this.HNO,
            CUST_ID: this.CUST_ID
        };
        let headParam = {head: {}};
        this.isLoading = true;
        const response = await this.common_postCall("/phone-api/as/cutt/selectAsCuttHist", postParam, headParam);

        if(response && !response.HEADER.ERROR_FLAG) {
          this.HIST_AS_CUTT = response.DATA;

          this.HIST_AS_CUTT.map(item => {
            let top_cn = "상담번호 : " + item.PHN_CUTT_ID + "\n" +
              "통화자/연락처 : " + item.CALLER_NM + "/" + item.CALLER_TEL + "\n" +
              "AS접수번호 : " + item.SHOW_FLW_ACP_SN + "\n";
              //if (add_cnslt_cd != "") top_cn += "티켓아이디 : " + add_cnslt_cd + "\n";
            item.CUTT_CN_VIEW = top_cn + "\n\n" + item.CUTT_CN;

          })
        }
        this.isLoading = false;
      },

      rowClick(item) {
        if(this.SEL_ITEM.ROW_NUM == item.ROW_NUM) {
          this.isLockCuttCn = !this.isLockCuttCn;
        } else {
          this.isLockCuttCn = true;
        }
        this.SEL_ITEM = item;
        this.CUTT_CN_VIEW = item.CUTT_CN_VIEW;
      },
      rowMouseover(event) {
        //상담 내용 잠김 상태가 아닐 시
        if(!this.isLockCuttCn) {
          const rowElement = event.target.closest('tr'); // 마우스오버한 tr 찾기
          const index = [...rowElement.parentNode.children].indexOf(rowElement); // 인덱스 계산
          if(index != this.mouseOverIndex && index >= 0) {
            this.mouseOverIndex = index;
            this.CUTT_CN_VIEW = this.HIST_AS_CUTT[this.mouseOverIndex].CUTT_CN_VIEW;
          }
        }
      },

      showCuttDtl(){
        //상담상세에서는 팝업을 띄우지 않는다.
        if(!this.detailYn) {
          this.mixin_openWindow( 'LayoutPopup', '1600', '850', {compo_name : 'CSL_M0100_DETAIL', callback : 'getPopData', title: '상담이력 상세보기', popData: this.SEL_ITEM, CUSTCO_ID: this.SEL_ITEM.CUSTCO_ID});
        }
      },

      showHappycall(item) {
        //상담유형이 해피콜일 시, 해피콜 다이얼로그 출력
        if(item.HAPPYCALL_YN == 'Y') {
          //해피콜 다이얼로그
          this.HAPPYCALL = {
            CUST_ID: item.CUST_ID,
            FLW_DTL_FULL_SN: item.FLW_DTL_FULL_SN,
            SURVEY_DSTN_NO: item.SURVEY_DSTN_NO
          }
          this.dialogHappyCallSurvey = true
        }
      },
      setHappycallDialogTitle(title) {
        this.happycallDialogTitle = title;
      },
      disableHappycallSaveBtn(val) {
        this.isDisableHappycallSaveBtn = val;
      },

      isActiveRow(item) {
        const activeClass = item === this.SEL_ITEM ? "active" : "";
        return activeClass;
      },

      //상담내용 복사
      copyCuttCn(){
        if(this.CUTT_CN_VIEW){
          navigator.clipboard.writeText(this.CUTT_CN_VIEW);
          this.showToast({msg: '상담내용을 복사 하였습니다.', class: 'success', hasToastIcon: true, icon: 'mdi-checkbox-marked-circle'});
        }
      },

      getPopData(item) {
        console.log('자식창(팝업)에서 받은 메시지 : ', item);
        this.mixin_hideDialog('CsDetail');
        this.windowPopup.close();
      },

      //고객 전화번호 전화걸기 버튼 이벤트
      custPhnNoOutCall(lastPhnNo){
        if(this.CUTT_ING){
          this.showAlertInfo({msg : '상담 중에는 통화를 할 수 없습니다.<br>상담을 먼저 저장하세요.'});
          return;
        }else{
          this.$eventBus.$emit('topOutCall', {CUST_PHN_NO : lastPhnNo});
        }
      },


      async btnSendCall(item) { //cust_no, out_cnslt_seq_no, caller_nm, caller_tel)
        if(this.CUTT_ING) {
          this.showAlertInfo({msg : '상담 중에는 발신을 선택할 수 없습니다.<br>상담을 먼저 저장하세요.'});
          return;
        }

        const postParam = {
          PHN_CUTT_ID : item.PHN_CUTT_ID,
        };
        const headParam = {
            head: {
                ns: 'lhcs.phone.as.dao.PhoneAsCuttMapper'
            }
        };
        const response = await this.common_postCall("/api/biz/common/select/selectAsOutboundAbleYn", postParam, headParam);
        if(!response.HEADER.ERROR_FLAG) {
          const ableYn = response.DATA[0] ? response.DATA[0].ABLE_YN : 'N';

          if(ableYn == "Y"){
            item.MON_Q_TASK = "OB";//미대상
            //item.CUST_PHN_NO = item.LAST_PHN_NO
            item.CUST_NO = item.CUST_ID
            item.LAST_PRVC_CLCT_AGRE_YN = response.DATA[0].LAST_PRVC_CLCT_AGRE_YN
            this.$eventBus.$emit('setCuttUnProcCustInfo', item);
          }
          else{
            msgStart("아웃바운드를 진행할 수 없습니다.");
          }
        }
      },

      //녹취 듣기
      showListenAudio(item){
        if(this.detailYn || this.readOnly){
          this.mixin_showDialog('ListenAudio');
          this.AudioProp = item;
          setTimeout(() => {
            this.$eventBus.$emit('setCuslCustInfo', item); //상담사 및 고객 상세정보 Data
          }, 100);
        }else{
          this.mixin_showListenAudio(item);
        }
      }
    },
    computed: {
      reversedItems() {
        return this.items.slice().reverse();
      },
      computedGridHeight(){
        let cal_height =  this.computedAsCuttAddRowCnt * 30 || 0
        if(this.detailYn) {
          return `629px`
        } else {
          return `calc(100vh - ${cal_height}px - 735px)`
        }
      },
      computedTextareaHeight(){
        let cal_height =  this.computedAsCuttAddRowCnt * 30 || 0
        if(this.isPopup || this.detailYn) {
          return "100%";
        } else {
          return `calc(100vh - ${cal_height}px - 770px)`
        }

      }
    },
  }
</script>

<style lang="scss" scoped>

</style>