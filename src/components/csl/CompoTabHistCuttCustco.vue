<template>
  <div class="pl-cols">
    <div>
      <v-data-table
        class="pl-grid is-hover"
        :headers="headers"
        :items="HIST_CUTT_CUSTCO"
        fixed-header
        item-key="index"
        :height="!detailYn?'calc(100vh - '+gridMinusHeight+'px)':'629px'"
        :items-per-page="ROW_PER_PAGE"
        :item-class="isActiveRow"
        hide-default-footer
	      no-data-text="등록된 데이터가 없습니다."
        @click:row="rowClick"
        @dblclick:row="showDetail"
        @mouseover:row="rowMouseover"
        :loading="isLoading"
        loading-text="조회중입니다."
        :page.sync="page"
        @page-count="pageCount = $event"
        >
        <template v-slot:[`item.${header.value}`]="{ item }" v-for="header in headers">
          <div v-if="header.telYn">
            <span v-if="item[header.value]">{{ mixin_setPhoneNo(item[header.value].replace(/[^0-9]/g, "")) }}</span>
          </div>
          <div v-else>
            <span v-if="header.value === 'REG_DT'">
              <!-- {{ mixin_convertDate(item[header.value], 'yyyy-MM-dd HH:mm') }} -->
              {{ item[header.value] }}
            </span>
            <template v-else-if="header.value === 'CALL_TIME'">
              {{ !mixin_isEmpty(item[header.value])?mixin_seconds_toHHMMSS(item[header.value]): '' }}
            </template>
            <template v-else-if="header.value === 'RCPT_CHN_NM'">
              <span> {{ item['DRWI_TYPE_CD'] }} &gt; {{ item[header.value] }}</span>
            </template>
            <span v-else-if="header.value === 'REC_YN'">
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
            </span>
            <span v-else-if="header.value === 'FULL_CUTT_TYPE_NM'">
              <v-tooltip content-class="pl-tooltip " bottom>
                <template v-slot:activator="{ on, attrs }">
                  <span v-bind="attrs" v-on="on">
                    {{ mixin_decode(item[header.value]).replace(/>/g, '') }}
                  </span>
                </template>
                <span>{{ mixin_decode(item[header.value]).replace(/>/g, '') }}</span>
              </v-tooltip>
            </span>
            <span v-else>{{ item[header.value] }}</span>
          </div>
        </template>
      </v-data-table>
    </div>
    <div class="is-col-fix ml-2" style="width: 30%;">
      <table class="pl-tbl-detail" >
        <thead>
          <tr>
            <th class="text-left">
              <div class="d-flex align-center">
                <v-icon class="pl-icon20 tit-paragraph"></v-icon>
                <span class="ml-2">상담내용 </span>
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
            <td>
              <div
                :style="`white-space: pre-wrap; ${detailYn ? 'height:599px !important;' : 'height: calc(100vh - '+(gridMinusHeight+30)+'px)!important;'}`"
                class="pl-txt-area pl-scroll-body flex-grow-1 CompoTabHistCuttCustco"
                >{{ CUTT_CN }}</div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- side panel : 상담 상세정보-->
    <v-slide-x-reverse-transition>
      <div
        class="pl-quick-layer type-main"
        :style="tempCenterStyle"
        v-if=" dialogCsDetail === true ">
        <div class="pl-quick-layer-header"><h1>상담 상세정보</h1>
          <compo-tooltip-btn
            TitleProp="윈도우 팝업 열기"
            ClassProp="pl-tooltip-btn"
            IconProp="pl-icon20 openPop"
            TooltipPositionProp="bottom"
            @btnClick="mixin_openWindow( 'LayoutPopup', '675', '850', {compo_name : 'CSL_M0100_CS_TAB01_DETAIL', callback : 'getPopData', title: '상담 상세정보'}), dialogCsDetail = false"
          ></compo-tooltip-btn>
          <compo-tooltip-btn
            TitleProp="닫기"
            ClassProp="pl-tooltip-btn ml-1"
            IconProp="pl-icon20 dialog-close"
            TooltipPositionProp="bottom"
            @btnClick="dialogCsDetail = false"
          ></compo-tooltip-btn>
        </div>
        <CSL_M0100_CS_TAB01_DETAIL />
      </div>
    </v-slide-x-reverse-transition>
    <!-- dialog: 녹취파일 듣기 -->
    <v-dialog
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
                :AudioProp=AudioProp
              />
            </div>
          </div>
        </template>
      </compo-dialog>
    </v-dialog>
    <!-- side panel : 대화록 보기-->
    <v-slide-x-reverse-transition>
      <div
        class="pl-quick-layer type-main "
        :style="tempCenterStyle"
        v-if=" dialogTalkLog === true ">
        <div class="pl-quick-layer-header is-noborder">
          <div class="d-flex align-center">
            <h1>[성명미상]님과의 대화록</h1>
            <span class="ml-2">010-1004-1004</span>
            <span
              style="width: 54px"
              class="ml-2 pl-badge is-green">상담완료</span>
          </div>
          <compo-tooltip-btn
            TitleProp="상세"
            ClassProp="pl-tooltip-btn ml-auto"
            IconProp="pl-icon20 detail"
            TooltipPositionProp="bottom"
            @btnClick=""
          ></compo-tooltip-btn>
          <compo-tooltip-btn
            TitleProp="윈도우 팝업 열기"
            ClassProp="pl-tooltip-btn ml-1"
            IconProp="pl-icon20 openPop"
            TooltipPositionProp="bottom"
            @btnClick=""
          ></compo-tooltip-btn>
          <compo-tooltip-btn
            TitleProp="닫기"
            ClassProp="pl-tooltip-btn ml-1"
            IconProp="pl-icon20 dialog-close"
            TooltipPositionProp="bottom"
            @btnClick="dialogTalkLog = false"
          ></compo-tooltip-btn>
        </div>
        <!-- component -->
        <CompoTalkLog :DataProp="talk_data" @Close="dialogTalkLog = false" />
      </div>
    </v-slide-x-reverse-transition>

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
            :DataProp="{CUST_ID: SEL_ITEM.CUST_ID, FLW_DTL_FULL_SN: SEL_ITEM.FLW_DTL_FULL_SN, SURVEY_DSTN_NO: SEL_ITEM.SURVEY_DSTN_NO}"
            :ReadOnlyProp="true"
            @setDialogTitle="setHappycallDialogTitle"
            @closeDialog="mixin_hideDialog('HappyCallSurvey')"
          />
        </template>
        <template slot="footer">
          <v-btn class="pl-btn is-trans" @click="mixin_hideDialog('HappyCallSurvey')">닫기</v-btn>
        </template>
      </compo-dialog>
    </v-dialog>
  </div>
</template>

<script>
import CSL_M0100_CS_TAB01_DETAIL from '@/views/page/CSL_M0100_CS_TAB01_DETAIL.vue'
import CompoManagerInfo from '@/components/CompoManagerInfo.vue'
import CompoAudioWave from '@/components/CompoAudioWave.vue'
import CompoTalkLog from '@/components/CompoTalkLog.vue'
import CompoAsHappyCallSurvey from '@/components/CompoAsHappyCallSurvey.vue'

  export default {
    name: 'CompoTabHistCuttCustco', //상담 - 이력 정보 - 타센터 상담이력 탭
    components: {
      CSL_M0100_CS_TAB01_DETAIL,
      CompoManagerInfo,
      CompoAudioWave,
      CompoTalkLog,
      CompoAsHappyCallSurvey
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
      SCH_CUSTCO_ID: {
        type: String,
        default: '',
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
    data(){
      return{
        //고객사 ID : 바로처리 : '4'
        CUSTCO_ID: this.$store.getters["userStore/GE_USER_COMPANY"].CUSTCO_ID,

        //고객 정보
        CUST_INFO: {},

        //타센터 상담 이력
        HIST_CUTT_CUSTCO: [],
        //선택된 항목
        SEL_ITEM: {},
        //상담내용
        CUTT_CN: '',
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

        textareaValue: `광주/광산구-수완(국임)
문) 문자 알림 서비스 등록 문의
답) 이미 문자 알림 서비스 등록 되어 있음 안내
`,

        isLoading: false,
        page: 1,
        pageCount: 0,
        perPage: [15,30,50,100],
        ROW_PER_PAGE: 1000,
        headers: [
          { text: '번호', value: 'ROW_NUM', align: 'center', width: '4%', sortable: false },
          { text: '센터', value: 'CUSTCO_NM', align: 'left', width: '120px',sortable: false },
          { text: '접수일시', value: 'REG_DT', align: 'left', width: '120px' },
          { text: '처리시간', value: 'CALL_TIME', align: 'left', width: '80px', sortable: false  },
          { text: '상담채널', value: 'RCPT_CHN_NM', align: 'left', width: '10%', sortable: false  },
          { text: '접수자', value: 'CUSL_NM', align: 'left', width: '7%', sortable: false  },
          { text: '상담유형', value: 'FULL_CUTT_TYPE_NM', align: 'left', width: '', sortable: false  },
          { text: '상담메모', value: 'CUTT_CN', align: 'left', width: '20%', sortable: false  },
          { text: '녹취', value: 'REC_YN', align: 'center', width: '6%', sortable: false  },
        ],
        items: [
          { index: 8, type01: '마이홈센터', type02: '2024-06-20 09:30', type03: '00:05:26', type04: 'IN > 전화', type05: '김한나', type06: '아파트 임대 > 국민임대 > 임대차보호법', type07: '광주/광산구-수완(국임) 문) 문자 알림 서비스 등록 문의 답) 이미 문자 알림 서비스 등록 되어 있음 안내 ', type08: '' },
          { index: 9, type01: '마이홈센터', type02: '2024-06-20 09:30', type03: '00:05:26', type04: 'IN > 전화', type05: '김한나', type06: '아파트 임대 > 국민임대 > 임대차보호법', type07: '광주 - 예비자 모집 일정 문의', type08: '' },
          { index: 10, type01: '마이홈센터', type02: '2024-06-20 09:30', type03: '00:05:26', type04: 'IN > 전화', type05: '정선애', type06: '아파트 임대 > 국민임대 > 예비입주자', type07: '광주/광산구-수완(국임) 문) 문자 알림 서비스 등록 문의 답) 이미 문자 알림 서비스 등록 되어 있음 안내 ', type08: '' },
          { index: 11, type01: '마이홈센터', type02: '2024-06-20 09:30', type03: '00:05:26', type04: 'IN > 전화', type05: '김한나', type06: '아파트 임대 > 국민임대 > 분양정보', type07: '광주 - 5월 국임공고 문-공고 광주광역시 국민임대주택 면적완화 예비입주자 모집(2024.07.15)', type08: '' },
          { index: 12, type01: '바로처리센터', type02: '2024-06-20 09:30', type03: '00:05:26', type04: 'OB > 전화', type05: '김경란', type06: '접촉관리  > 고객요청  > 통화성공', type07: '인터폰 업체가 금일 고객 연락하기로 했습니다', type08: '' },
          { index: 13, type01: '바로처리센터', type02: '2024-06-20 09:30', type03: '00:05:26', type04: 'OB > 전화', type05: '한소미', type06: '접촉관리  > 고객요청  > 통화성공', type07: '[무응 1회] - 인터폰 업체가 금방 연락합니다', type08: '' },
          { index: 14, type01: '바로처리센터', type02: '2024-06-20 09:30', type03: '00:05:26', type04: 'OB > 전화', type05: '김한나', type06: '접촉관리  > 고객요청  > 통화성공', type07: '인터폰 업체가 금일 고객 연락', type08: '' },

        ],

        // dialog
        dialogCsDetail : false,
        dialogHappyCallSurvey : false,
        happycallDialogTitle: '',
        isDisableHappycallSaveBtn : false,

        AudioProp : {},

        gridMinusHeight : 735,
      }
    },
    created() {
      console.log("CompoTabHistCuttCustco created", this.CustInfoProp)
      if(this.CustInfoProp ) {
        this.CUST_INFO = this.CustInfoProp;
        this.getHistCuttCustco();
      }

      this.gridMinusHeight = this.computedUserCenter !== '4'?!this.FAVORIT_HIDDEN?735:522:735;
    },
    watch: {
      CustInfoProp() {
        if(this.CustInfoProp && (this.CUST_INFO.CUST_ID != this.CustInfoProp.CUST_ID)) {
          this.CUST_INFO = this.CustInfoProp;
          this.getHistCuttCustco();
        }
      },
      TabProp() {
        if(this.CustInfoProp && (this.CUSTCO_ID != "4" && this.TabProp == 1) || (this.CUSTCO_ID == "4" && this.TabProp == 3)) {
          this.getHistCuttCustco();
        }

        if(this.computedUserCenter != "4"){
          if(!this.FAVORIT_HIDDEN) this.gridMinusHeight = 735;
          else this.gridMinusHeight = 522;
        }else{
          this.gridMinusHeight = 735;
        }
      },
      FAVORIT_HIDDEN(){
        if(!this.FAVORIT_HIDDEN) this.gridMinusHeight = 735;
        else this.gridMinusHeight = 522;
      }
    },
    methods: {
      //타센터 상담 이력 조회
      async getHistCuttCustco() {
        this.HIST_CUTT_CUSTCO = [];
        this.CUTT_CN = '';
        if(this.CUST_INFO.CUST_ID) {
          this.CUST_INFO.CUST_PHN_NO = this.CUST_INFO.CUST_PHN_NO ? this.CUST_INFO.CUST_PHN_NO : '';
          this.CUST_INFO.CUST_PHN_NO1 = this.CUST_INFO.CUST_PHN_NO1 ? this.CUST_INFO.CUST_PHN_NO1 : '';
          this.CUST_INFO.CUST_PHN_NO2 = this.CUST_INFO.CUST_PHN_NO2 ? this.CUST_INFO.CUST_PHN_NO2 : '';
          this.CUST_INFO.CUST_PHN_NO3 = this.CUST_INFO.CUST_PHN_NO3 ? this.CUST_INFO.CUST_PHN_NO3 : '';

          console.log("this.CUST_INFO", this.CUST_INFO, [this.CUST_INFO.CUST_PHN_NO, this.CUST_INFO.CUST_PHN_NO1, this.CUST_INFO.CUST_PHN_NO2, this.CUST_INFO.CUST_PHN_NO3])
          let phnNoArr = '';
          //바로처리는 CUST_PHN_NO3은 제외함.
          if(this.SCH_CUSTCO_ID == "4") {
            phnNoArr = [this.CUST_INFO.CUST_PHN_NO.replace(/-/gi, ""), this.CUST_INFO.CUST_PHN_NO1.replace(/-/gi, ""), this.CUST_INFO.CUST_PHN_NO2.replace(/-/gi, "")].filter(phnNo => {
              return !!phnNo && (phnNo.length === 10 || phnNo.length === 11) && (phnNo !== '01000000000')
            }).join(",")
          } else {
            //공통은 CUST_PHN_NO3 포함.
            phnNoArr = [this.CUST_INFO.CUST_PHN_NO.replace(/-/gi, ""), this.CUST_INFO.CUST_PHN_NO1.replace(/-/gi, ""), this.CUST_INFO.CUST_PHN_NO2.replace(/-/gi, ""), this.CUST_INFO.CUST_PHN_NO3.replace(/-/gi, "")].filter(phnNo => {
              return !!phnNo && (phnNo.length === 10 || phnNo.length === 11) && (phnNo !== '01000000000')
            }).join(",")
          }
          let postParam = {
            CUST_ID: this.CUST_INFO.CUST_ID,
            PHN_NO_ARR: phnNoArr
            , SCH_CUSTCO_ID: this.SCH_CUSTCO_ID
          };
          let headParam = {head: {}};
          console.log("getHistCuttCustco postParam", postParam)
          this.isLoading = true;
          const response = await this.common_postCall("/phone-api/cutt/selectCuttCustcoHist", postParam, headParam);

          if(response && !response.HEADER.ERROR_FLAG) {
            response.DATA.forEach((item, idx) => {
              item.CUTT_CN = this.mixin_decode(item.CUTT_CN);
            });
            
            this.HIST_CUTT_CUSTCO = response.DATA;
          }
          this.isLoading = false;
        }
      },

      rowClick(item) {
        if(this.SEL_ITEM.ROW_NUM == item.ROW_NUM) {
          this.isLockCuttCn = !this.isLockCuttCn;
        } else {
          this.isLockCuttCn = true;
        }
        this.SEL_ITEM = item;
        this.CUTT_CN = item.CUTT_CN;
      },
      
      showDetail(item) {
        if(this.detailYn || this.readOnly){
          // this.showAlertInfo({msg : '팝업창에서 타센터 상담이력 보기 팝업을 지원하지 않습니다.<br>부모창의 타센터 상담이력에서 이용해 주시기 바랍니다.'});
          return;
        }else{
          this.$eventBus.$emit('setChgCustcoId', this.SEL_ITEM.CUSTCO_ID);
          if(this.SEL_ITEM.CUSTCO_ID !== '4'){ //타센터 상담이 바로처리가 아닌 경우
            // if(this.detailYn){ //상세보기 화면에서의 상담이력 클릭 이벤트
            //   this.$eventBus.$emit('setCuttDetail', this.SEL_ITEM);
            // }else{
              this.mixin_openWindow( 'LayoutPopup', '1600', '850', {compo_name : 'CSL_M0100_DETAIL', callback : 'getPopData', title: '상담이력 상세보기', popData: this.SEL_ITEM, CUSTCO_ID: this.SEL_ITEM.CUSTCO_ID});
            // }
          }else{//타센터 상담이 바로처리인 경우
            //상담유형이 해피콜일 시, 해피콜 다이얼로그 출력
            // if(this.SEL_ITEM.FLW_DTL_FULL_SN != "" && this.SEL_ITEM.CUTT_TYPE_ID && this.SEL_ITEM.CUTT_TYPE_ID.indexOf('0801') > -1) {
            //   //해피콜 다이얼로그
            //   this.dialogHappyCallSurvey = true;
            // }else{
              // if(this.detailYn){ //상세보기 화면에서의 상담이력 클릭 이벤트
              //   this.$eventBus.$emit('setCuttDetail', this.SEL_ITEM);
              // }else{
                this.mixin_openWindow( 'LayoutPopup', '1600', '850', {compo_name : 'CSL_M0100_DETAIL', callback : 'getPopData', title: '상담이력 상세보기', popData: this.SEL_ITEM, CUSTCO_ID: this.SEL_ITEM.CUSTCO_ID});
              // }
            // }
          }
        }
      },

      setHappycallDialogTitle(title) {
        this.happycallDialogTitle = title;
      },

      rowMouseover(event) {
        //상담 내용 잠김 상태가 아닐 시
        if(!this.isLockCuttCn) {
          const rowElement = event.target.closest('tr'); // 마우스오버한 tr 찾기
          const index = [...rowElement.parentNode.children].indexOf(rowElement); // 인덱스 계산
          if(index != this.mouseOverIndex && index >= 0) {
            this.mouseOverIndex = index;
            this.CUTT_CN = this.HIST_CUTT_CUSTCO[this.mouseOverIndex].CUTT_CN;
          }
        }
      },

      isActiveRow(item) {
        const activeClass = item === this.SEL_ITEM ? "active" : "";
        return activeClass;
      },

      //상담내용 복사
      copyCuttCn(){
        if(this.CUTT_CN){
          navigator.clipboard.writeText(this.CUTT_CN);
          this.showToast({msg: '상담내용을 복사 하였습니다.', class: 'success', hasToastIcon: true, icon: 'mdi-checkbox-marked-circle'});
        }
      },

      getPopData(item){
        console.log('자식창(팝업)에서 받은 메시지 : ', item);
        this.mixin_hideDialog('CsDetail');
        this.windowPopup.close();
      },

      //녹취 듣기
      showListenAudio(item){
        if(this.detailYn || this.readOnly || this.dbClckTabYn){
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
        if(!this.FAVORIT_HIDDEN){
          return `calc(100vh - 735px)`
        }else{
          return `calc(100vh - 522px)`
        }
      },
      computedTextareaHeight(){
        if(!this.FAVORIT_HIDDEN){
          return `calc(100vh - 765px)`
        }else{
          return `calc(100vh - 552px)`
        }
      }
    },
  }
</script>

<style lang="scss" scoped>

</style>