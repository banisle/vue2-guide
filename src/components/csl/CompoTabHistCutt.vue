<template>
  <div :class="dbClckTabYn ? 'px-6' : ''" class="pl-cols">
    <div>
      <template v-if="dbClckTabYn">
        <div class="pl-grid-top pt-2">
          <div class="pl-grid-top-left spacing-wrap sp-16">
          </div>
          <div class="pl-grid-top-utils">
            <span class="pl-counter">전체 <em class="pl-1 is-txt-blue">({{ mixin_convertNumToComma(HIST_CUTT.length) }})</em> 건</span>
            <compo-excel
                  TypeProp="Download"
                  :DataHeaderProp="headers"
                  :DataBodyProp="HIST_CUTT"
                  FileNameProp="상담 현황"
                  SheetNameProp="상담 현황"
                />
          </div>
        </div>
      </template>
      <v-data-table
        class="pl-grid is-hover"
        :headers="headers"
        :items="HIST_CUTT"
        fixed-header
        item-key="index"
        :height="dbClckTabYn?'629px':!detailYn?'calc(100vh - '+gridMinusHeight+'px)':'629px'"
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
        @page-count="pageCount = $event">
        <template v-slot:[`item.${header.value}`]="{ item }" v-for="header in headers">
          <div v-if="header.telYn">
            <span v-if="item[header.value]">{{ mixin_setPhoneNo(item[header.value].replace(/[^0-9]/g, "")) }}</span>
          </div>
          <div v-else>
            <span v-if="header.value === 'REG_DT'">
              {{ mixin_convertDate(item[header.value], 'yyyy-MM-dd HH:mm') }}
            </span>
            <template v-else-if="header.value === 'CALL_TIME'">
              {{ !mixin_isEmpty(item[header.value])?mixin_seconds_toHHMMSS(item[header.value]): '' }}
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
    <div class="is-col-fix ml-2" :style="`width: 30%;${dbClckTabYn?'margin-top: 38px;':''}`">
      <table class="pl-tbl-detail" >
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
            <td>
              <div
                :style="`white-space: pre-wrap; ${dbClckTabYn || detailYn ? 'height:599px !important;' : 'height: calc(100vh - '+(gridMinusHeight+30)+'px) !important;'}`"
                class="pl-txt-area pl-scroll-body flex-grow-1 CompoTabHistCutt"
              >{{ CUTT_CN }}</div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

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
  </div>
</template>

<script>
import CompoManagerInfo from '@/components/CompoManagerInfo.vue';
import CompoAudioWave from '@/components/CompoAudioWave.vue';

  export default {
    name: 'CompoTabHistCutt', //상담 - 이력 정보 - 공통 상담이력 탭(바로처리 제외)
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
        default: '1'
      },
      readOnly: {
        type: Boolean,
        default : false
      },
      detailYn: {
        type: Boolean,
        default : false
      },
      dbClckTabYn: {
        type: Boolean,
        default : false
      },
    },
    components: {
      CompoManagerInfo,
      CompoAudioWave,
    },
    data(){
      return{
        //고객사 ID : 바로처리 : '4'
        CUSTCO_ID: this.$store.getters["userStore/GE_USER_COMPANY"].CUSTCO_ID,

        //고객 ID
        CUST_ID: '',
        //주택번호
        HNO: '',
        //상담 이력
        HIST_CUTT: [],
        //선택된 항목
        SEL_ITEM: {},
        //상담내용
        CUTT_CN: '',
        //mouseover index
        mouseOverIndex: -1,
        //상담내용 잠금 여부 - click:row 시 toggle 처리
        isLockCuttCn: false,

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

        textareaValue: `경기/화성시/화성동탄-단독, 중증장애X, 생계수급, 용인거주
문) 화성동탄 문의(3/14 공고) / 관심지역 알리미 수신
답) 동탄지역 2순위 2024.03.26(화) 1순위 마감여부
확인 후 신청가능 화성지역 2순위 2024.04.02(화)
1순위 마감여부 확인 후 신청가능
`,

        isLoading: false,
        page: 1,
        pageCount: 0,
        perPage: [15,30,50,100],
        ROW_PER_PAGE: 1000,
        headers: [
          { text: '번호', value: 'ROW_NUM', align: 'center', width: '4%', sortable: false },
          { text: '접수일시', value: 'REG_DT', align: 'left', width: '120px' },
          { text: '처리시간', value: 'CALL_TIME', align: 'left', width: '7%', sortable: false  },
          { text: '상담채널', value: 'RE_RCPT_CHN_NM', align: 'left', width: '7%', sortable: false  },
          { text: '접수자', value: 'CUSL_NM', align: 'left', width: '7%', sortable: false  },
          { text: '상담유형', value: 'FULL_CUTT_TYPE_NM', align: 'left', width: '', sortable: false  },
          { text: '상담메모', value: 'CUTT_CN', align: 'left', width: '25%', sortable: false  },
          { text: '동의여부', value: 'PRVC_CLCT_AGRE_YN', align: 'left', width: '7%', sortable: false  },
          { text: '녹취', value: 'REC_YN', align: 'center', width: '6%', sortable: false  },
        ],

        items: [
            {
              index: 1,
              type01: '2024-06-20 09:30',
              type02: '00:05:26',
              type03: 'IN > 전화',
              type04: '최우정',
              type05: '국민임대 > 예비자 모집공고 > 서류/접수방법 > 청약일정',
              type05_1: '경기/화성시/화성동탄-단독, 중증장애X, 생계수급, 용인거주 문) 화성동탄 문의(3/14 공고) / 관심지역 알리미 수신',
              type06: '동의',
              type07: '',
            },
            { index: 2, type01: '2024-06-20 09:30', type02: '00:05:26', type03: 'IN > 전화', type04: '한소미', type05: '주거복지 > 매입인대 > 갱신계약/보조금 전환', type05_1: '경기/화성시/화성동탄-단독, 중증장애X, 생계수급, 용인거주 문) 화성동탄 문의(3/14 공고) / 관심지역 알리미 수신', type06: '미동의', type07: '', },
            { index: 3, type01: '2024-06-20 09:30', type02: '00:05:26', type03: 'IN > 전화', type04: '김경란', type05: '주거복지 > 전세임대 > 해약/퇴거', type05_1: '경기/화성시/화성동탄-단독, 중증장애X, 생계수급, 용인거주 문) 화성동탄 문의(3/14 공고) / 관심지역 알리미 수신', type06: '동의', type07: '', },
            { index: 4, type01: '2024-06-20 09:30', type02: '00:05:26', type03: 'IN > 전화', type04: '최우정', type05: '아파트 임대 > 국민임대 > 분양정보(계획, 공고일정 등)', type05_1: '경기/화성시/화성동탄-단독, 중증장애X, 생계수급, 용인거주 문) 화성동탄 문의(3/14 공고) / 관심지역 알리미 수신', type06: '동의', type07: '', },
            { index: 5, type01: '2024-06-20 09:30', type02: '00:05:26', type03: 'IN > 전화', type04: '정선애', type05: '아파트 입대 > 국민임대 > 예비입주자', type05_1: '경기/화성시/화성동탄-단독, 중증장애X, 생계수급, 용인거주 문) 화성동탄 문의(3/14 공고) / 관심지역 알리미 수신', type06: '동의', type07: '', },
            { index: 6, type01: '2024-06-20 09:30', type02: '00:05:26', type03: 'IN > 전화', type04: '최우정', type05: '아파트 입대 > 행복주택 > 임대차 계약', type05_1: '경기/화성시/화성동탄-단독, 중증장애X, 생계수급, 용인거주 문) 화성동탄 문의(3/14 공고) / 관심지역 알리미 수신', type06: '동의', type07: '', },
            { index: 7, type01: '2024-06-20 09:30', type02: '00:05:26', type03: 'IN > 전화', type04: '최우정', type05: '아파트 입대 > 행복주택 > 임대차 계약', type05_1: '경기/화성시/화성동탄-단독, 중증장애X, 생계수급, 용인거주 문) 화성동탄 문의(3/14 공고) / 관심지역 알리미 수신', type06: '동의', type07: '', },
            { index: 8, type01: '2024-06-20 09:30', type02: '00:05:26', type03: 'IN > 전화', type04: '최우정', type05: '아파트 입대 > 행복주택 > 임대차 계약', type05_1: '경기/화성시/화성동탄-단독, 중증장애X, 생계수급, 용인거주 문) 화성동탄 문의(3/14 공고) / 관심지역 알리미 수신', type06: '동의', type07: '', },
            { index: 9, type01: '2024-06-20 09:30', type02: '00:05:26', type03: 'IN > 전화', type04: '최우정', type05: '아파트 입대 > 행복주택 > 임대차 계약', type05_1: '경기/화성시/화성동탄-단독, 중증장애X, 생계수급, 용인거주 문) 화성동탄 문의(3/14 공고) / 관심지역 알리미 수신', type06: '동의', type07: '', },
            { index: 10, type01: '2024-06-20 09:30', type02: '00:05:26', type03: 'IN > 전화', type04: '최우정', type05: '아파트 입대 > 행복주택 > 임대차 계약', type05_1: '경기/화성시/화성동탄-단독, 중증장애X, 생계수급, 용인거주 문) 화성동탄 문의(3/14 공고) / 관심지역 알리미 수신', type06: '동의', type07: '', },
            { index: 11, type01: '2024-06-20 09:30', type02: '00:05:26', type03: 'IN > 전화', type04: '최우정', type05: '아파트 입대 > 행복주택 > 임대차 계약', type05_1: '경기/화성시/화성동탄-단독, 중증장애X, 생계수급, 용인거주 문) 화성동탄 문의(3/14 공고) / 관심지역 알리미 수신', type06: '동의', type07: '', },
            { index: 12, type01: '2024-06-20 09:30', type02: '00:05:26', type03: 'IN > 전화', type04: '최우정', type05: '아파트 입대 > 행복주택 > 임대차 계약', type05_1: '경기/화성시/화성동탄-단독, 중증장애X, 생계수급, 용인거주 문) 화성동탄 문의(3/14 공고) / 관심지역 알리미 수신', type06: '동의', type07: '', },
            { index: 13, type01: '2024-06-20 09:30', type02: '00:05:26', type03: 'IN > 전화', type04: '최우정', type05: '아파트 입대 > 행복주택 > 임대차 계약', type05_1: '경기/화성시/화성동탄-단독, 중증장애X, 생계수급, 용인거주 문) 화성동탄 문의(3/14 공고) / 관심지역 알리미 수신', type06: '동의', type07: '', },
            { index: 14, type01: '2024-06-20 09:30', type02: '00:05:26', type03: 'IN > 전화', type04: '최우정', type05: '아파트 입대 > 행복주택 > 임대차 계약', type05_1: '경기/화성시/화성동탄-단독, 중증장애X, 생계수급, 용인거주 문) 화성동탄 문의(3/14 공고) / 관심지역 알리미 수신', type06: '동의', type07: '', },
            { index: 15, type01: '2024-06-20 09:30', type02: '00:05:26', type03: 'IN > 전화', type04: '최우정', type05: '아파트 입대 > 행복주택 > 임대차 계약', type05_1: '경기/화성시/화성동탄-단독, 중증장애X, 생계수급, 용인거주 문) 화성동탄 문의(3/14 공고) / 관심지역 알리미 수신', type06: '동의', type07: '', },

        ],

        AudioProp : {},

        gridMinusHeight : 735,
      }
    },
    beforeDestroy(){
      this.$eventBus.$off("reloadHistCutt"); //eventBus 중복방지를 위해 off
    },
    async created() {
      //상담 저장 후 상담이력 새로고침
      this.$eventBus.$on("reloadHistCutt", (CUST_INFO) => {
        this.CUST_ID = CUST_INFO.CUST_ID;
        this.getHistCutt();
      });

      if(this.CustInfoProp && this.CustInfoProp.CUST_ID) {
        this.CUST_ID = this.CustInfoProp.CUST_ID;
      }
      
      if(this.dbClckTabYn) this.getHistCutt();

      this.$store.dispatch("statusStore/AC_FAVORIT_HIDDEN", !this.$store.getters['commonStore/GE_COMMON_CUTT_FAVORIT_HIDE_SHOW']);
      this.gridMinusHeight = !this.FAVORIT_HIDDEN?735:522;
    },
    watch: {
      CustInfoProp() {
        const custId = this.CustInfoProp.CUST_ID;
        if(this.CUST_ID != custId) {
          this.CUST_ID = custId;
          this.getHistCutt();
        }
      },
      TabProp() {
        if(this.TabProp == 0) {
          this.getHistCutt();
        }

        if(!this.FAVORIT_HIDDEN) this.gridMinusHeight = 735;
        else this.gridMinusHeight = 522;
      },
      FAVORIT_HIDDEN(){
        if(!this.FAVORIT_HIDDEN) this.gridMinusHeight = 735;
        else this.gridMinusHeight = 522;
      }
    },
    methods: {
      //상담 이력 조회
      async getHistCutt() {
        this.HIST_CUTT = [];
        this.CUTT_CN = '';
        if(this.CUST_ID && this.CUST_ID != '') {
          let postParam = {
            CUST_ID: this.CUST_ID
            , SCH_CUSTCO_ID : this.SCH_CUSTCO_ID
            , TEST_TXT : 'HEAR'
          };
          let headParam = {head: {}};
          this.isLoading = true;
          const response = await this.common_postCall("/phone-api/cutt/selectCuttHist", postParam, headParam);

          if(response && !response.HEADER.ERROR_FLAG) {
            response.DATA.forEach((item, idx) => {
              item.CUTT_CN = this.mixin_decode(item.CUTT_CN);
              item.RE_RCPT_CHN_NM = (item.DRWI_TYPE_CD ==='OUT'?'OB':item.DRWI_TYPE_CD) + ' > ' + item.RCPT_CHN_NM;
            });
            
            this.HIST_CUTT = response.DATA;
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
      rowMouseover(event) {
        //상담 내용 잠김 상태가 아닐 시
        if(!this.isLockCuttCn) {
          const rowElement = event.target.closest('tr'); // 마우스오버한 tr 찾기
          const index = [...rowElement.parentNode.children].indexOf(rowElement); // 인덱스 계산
          if(index != this.mouseOverIndex && index >= 0) {
            this.mouseOverIndex = index;
            this.CUTT_CN = this.HIST_CUTT[this.mouseOverIndex].CUTT_CN;
          }
        }
      },
      isActiveRow(item) {
        const activeClass = item === this.SEL_ITEM ? "active" : "";
        return activeClass;
      },

      //상담이력 상세보기
      showDetail(){
        // if(this.readOnly){
        //   this.mixin_openWindow( 'LayoutPopup', '800', '850', {compo_name : 'CSL_M0100_CS_TAB01_DETAIL', callback : 'getPopData', title: '상담 상세정보', popData: this.SEL_ITEM, readOnly:true});
        // }else{
        //   this.$eventBus.$emit('showCsDetail', this.SEL_ITEM);
        // }

        this.$eventBus.$emit('setChgCustcoId', this.SEL_ITEM.CUSTCO_ID);
        
        if(this.detailYn){ //상세보기 화면에서의 상담이력 클릭 이벤트
          this.$eventBus.$emit('setCuttDetail', this.SEL_ITEM);
        }else{
          this.mixin_openWindow( 'LayoutPopup', '1600', '850', {compo_name : 'CSL_M0100_DETAIL', callback : 'getPopData', title: '상담이력 상세보기', popData: this.SEL_ITEM, CUSTCO_ID: this.SEL_ITEM.CUSTCO_ID});
        }
      },

      //상담내용 복사
      copyCuttCn(){
        if(this.CUTT_CN){
          navigator.clipboard.writeText(this.CUTT_CN);
          this.showToast({msg: '상담내용을 복사 하였습니다.', class: 'success', hasToastIcon: true, icon: 'mdi-checkbox-marked-circle'});
        }
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