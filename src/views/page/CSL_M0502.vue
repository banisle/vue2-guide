<template>
  <div class="pl-container">
    <div class="pl-card-wrap">
      <!-- sub top -->
      <compo-sub-layout-top  >
        <template slot="search">
          <div class="pl-search-form is-mt-m flex-column align-start pb-0">
            <div class="pl-form-inline-wrap ">
              <div class="pl-form-inline">
                <span class="pl-label">
                  조회기간
                </span>
                <div class="pl-desc">
                  <compo-date-range-picker
                    ParentStyleProp="width: 300px"
                    :StartDayProp.sync="date2"
                    :EndDayProp.sync="date3"
                    @startDayChange="mixin_testLog(date2)"
                    @endDayChange="mixin_testLog(date3)"
                  />
                </div>
              </div>
              <div class="pl-form-inline">
                <span class="pl-label">
                  소속/상담사
                </span>
                <div class="pl-desc">
                  <v-select
                    class="pl-form type-middle is-sm"
                    placeholder="전체"
                  ></v-select>
                  <v-select
                    class="pl-form type-middle"
                    placeholder="전체"
                  ></v-select>
                </div>
              </div>
              <div class="pl-form-inline">
                <span class="pl-label">
                  상담채널
                </span>
                <div class="pl-desc">
                  <v-select
                    class="pl-form type-middle is-sm"
                    placeholder="전체"
                  ></v-select>
                  <v-select
                    class="pl-form type-middle"
                    placeholder="전체"
                  ></v-select>
                </div>
              </div>
              <div class="pl-form-inline">
                <span class="pl-label">
                  처리방법
                </span>
                <div class="pl-desc">
                  <v-select
                    class="pl-form type-middle"
                    placeholder="전체"
                  ></v-select>
                </div>
              </div>
            </div>
            <div class="pl-form-inline-wrap is-mt-s" style="width: 100%">
              <div class="pl-form-inline">
                <span class="pl-label">
                  상담유형
                </span>
                <div class="pl-desc">
                  <div class="spacing-wrap sp-8">
                    <v-select
                      class="pl-form type-middle "
                      placeholder="선택"
                    ></v-select>
                    <v-select
                      class="pl-form type-middle "
                      placeholder="선택"
                    ></v-select>
                    <v-select
                      class="pl-form type-middle "
                      placeholder="선택"
                    ></v-select>
                    <v-select
                      class="pl-form type-middle flex-grow-1"
                      style="width: 190px"
                      placeholder="상담유형 검색"
                    ></v-select>
                  </div>
                </div>
              </div>
              <div class="pl-form-inline flex-grow-1">
                <span class="pl-label">
                  단지/동명
                </span>
                <div class="pl-desc">
                  <v-text-field
                    class="pl-form is-search type-middle"
                    disabled
                    @keydown.enter="mixin_testLog('search btn')"
                    >
                    <template v-slot:append>
                      <v-btn
                        @click="mixin_testLog('search btn')"
                        class="pl-btn has-icon-only">
                        <span class="pl-icon20 in-search"></span>
                      </v-btn>
                    </template>
                  </v-text-field>
                </div>
              </div>
              <!-- 버튼 -->
              <div>
                <v-btn class="pl-btn is-icon">
                  <span class="pl-icon20 search"></span>
                  조회
                </v-btn>
                <!-- 상세  -->
                <v-tooltip content-class="pl-tooltip bottom" bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-menu
                      min-width="450"
                      bottom
                      left
                      offset-y
                      :close-on-content-click=false
                      content-class="pl-menu-drop pa-0"
                      v-model="dropDetail"
                    >
                      <template v-slot:activator="{ on: menuOn, attrs: menuAttrs }">
                        <v-btn
                          v-bind="menuAttrs"
                          v-on="menuOn"
                          class="pl-tooltip-btn ml-1"
                          min-width="30"
                          height="30"
                          plain
                          >
                          <v-icon
                            v-bind="attrs"
                            v-on="on"
                            class="pl-icon20 detail"></v-icon>
                        </v-btn>
                      </template>
                      <div class="">
                        <!-- header -->
                        <div class="d-flex align-center pl-card">
                          <div class="pl-subtit">상세 검색</div>
                          <v-btn
                            @click="dropDetail = false"
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
                        <!-- content -->
                        <div class="pl-card">
                          <div class="pl-form-inline-wrap vertical gap-8 label-80">
                            <div class="pl-form-inline">
                              <span class="pl-label">
                                인입번호
                              </span>
                              <div class="pl-desc">
                                <v-text-field
                                  class="pl-form type-middle"
                                  placeholder="전화번호 입력"
                                />
                              </div>
                            </div>
                            <div class="pl-form-inline">
                              <span class="pl-label">
                                고객 ID
                              </span>
                              <div class="pl-desc">
                                <v-text-field
                                  class="pl-form type-middle"
                                  placeholder="고객 ID 입력"
                                />
                              </div>
                            </div>
                            <div class="pl-form-inline">
                              <span class="pl-label">
                                상담번호
                              </span>
                              <div class="pl-desc">
                                <v-select
                                  class="pl-form type-middle"
                                  placeholder="상담번호 입력"
                                ></v-select>
                              </div>
                            </div>
                            <div class="pl-form-inline ">
                              <span class="pl-label">
                                티켓 ID
                              </span>
                              <div class="pl-desc">
                                <v-select
                                  class="pl-form type-middle"
                                  placeholder="티켓 ID 입력"
                                ></v-select>
                              </div>
                            </div>

                          </div>
                        </div>
                        <!-- footer -->
                        <div class="is-border-top pl-btn-wrap pl-card ">
                          <v-btn class="pl-btn is-trans ml-auto" @click="dropDetail = false">닫기</v-btn>
                          <v-btn class="pl-btn">검색</v-btn>
                        </div>

                      </div>
                    </v-menu>
                  </template>
                  <span>상세</span>
                </v-tooltip>
                <compo-tooltip-btn
                  TitleProp="초기화"
                  ClassProp="pl-tooltip-btn"
                  IconProp="pl-icon20 refresh"
                  TooltipPositionProp="bottom"
                ></compo-tooltip-btn>
              </div>
            </div>
          </div>
        </template>
      </compo-sub-layout-top>
      <!-- sub content -->
      <div class="pl-card-body">
        <!-- grid top -->
        <div class="pl-grid-top pt-2">
          <div class="pl-grid-top-left spacing-wrap sp-16 ">
            <div class="spacing-wrap sp-8">
              <div>
                <span class="pl-bullet-txt is-blue">총 상담건수</span>
                <strong class="pl-badge ml-2 px-2 is-txt-black" style="background: #E1FFEF">9,467</strong>
              </div>
              <div>
                <span class="pl-bullet-txt is-green">통화시간</span>
                <strong class="pl-badge ml-2 px-2 is-txt-black" style="background: #DDEBFB">566:01:41</strong>
              </div>
            </div>
          </div>
          <div class="pl-grid-top-utils">
            <span class="pl-counter">전체 <em class="pl-1 is-txt-blue">({{ items.length }})</em> 건</span>
            <!-- 엑셀 다운로드 버튼 -->
            <compo-tooltip-btn
              TitleProp="엑셀 다운로드"
              ClassProp="pl-tooltip-btn "
              IconProp="pl-icon20 exceldown"
              TooltipPositionProp="bottom"
              @btnClick="mixin_testLog('엑셀 다운로드')"
            ></compo-tooltip-btn>
          </div>
        </div>
        <!-- grid -->
        <v-data-table
          class="pl-grid is-mt-s is-hover"
          :headers="headers"
          :items="reversedItems"
          fixed-header
          item-key="index"
          height="calc(-345px + 100vh)"
          :items-per-page="ROW_PER_PAGE"
          hide-default-footer
	  no-data-text="등록된 데이터가 없습니다."
          @dblclick:row="showDetail()"
          :page.sync="page"
          @page-count="pageCount = $event">
          <template v-slot:item.type11>
            <compo-tooltip-btn
              TitleProp="녹취 듣기"
              ClassProp="pl-tooltip-btn ml-auto"
              IconProp="pl-icon20 audioControl"
              TooltipPositionProp="bottom"
              :MinWidthProp=20
              :HeightProp=20
              @btnClick="mixin_showDialog('ListenAudio')"
            ></compo-tooltip-btn>
            <compo-tooltip-btn
              TitleProp="대화록 보기"
              ClassProp="pl-tooltip-btn ml-1"
              IconProp="pl-icon20 sts"
              TooltipPositionProp="bottom"
              :MinWidthProp=20
              :HeightProp=20
              @btnClick="dialogTalkLog = true"
            ></compo-tooltip-btn>
          </template>
          <template v-slot:item.type09="{ item }">
            <strong :class="mixin_displayStatus(item.type09, 'STAT_LIST')">{{ item.type09 }}</strong>
          </template>
        </v-data-table>
        <div class="pl-pager">
          <div class="pl-pager-row">
            <span>페이지당 항목 수</span>
            <v-select
              class="pl-form"
              :value="ROW_PER_PAGE"
              :items="perPage"
              :item-text="toString(ROW_PER_PAGE)"
              @change="ROW_PER_PAGE = parseInt($event, 10);"
            ></v-select>
          </div>
          <v-pagination
            v-model="page"
            :length="pageCount"
            circle
            :total-visible="7">
          </v-pagination>

          <!-- 더보기 다음 있을때만 노출 -->
          <span class="pl-pager-period">
            보기 {{ mixin_getPagePeriod(items, page) }} / {{ items.length }}
            <compo-tooltip-btn
              TitleProp="다음 검색"
              ClassProp="pl-tooltip-btn is-line"
              IconProp="pl-icon20 arrow-next-paging"
              TooltipPositionProp="bottom"
            ></compo-tooltip-btn>
          </span>
        </div>
      </div>

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
        <CompoCsDetail @Close="dialogCsDetail = false"/>
      </div>
    </v-slide-x-reverse-transition>

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
          <CompoManagerInfo
            :DataProp="data"
          />
          <!-- 상담 상세내역 -->
          <div class="is-mt-m is-border-sub-top">
            <div class="d-flex align-center is-mt-m">
              <CompoAudioWave
                :AudioProp=data.CS_INFO.audio
              />
            </div>
          </div>
        </template>
      </compo-dialog>
    </v-dialog>
 </div>
</template>

<script>
import CompoManagerInfo from '@/components/CompoManagerInfo'
import CompoAudioWave from '@/components/CompoAudioWave'
import CompoTalkLog from '@/components/CompoTalkLog'
import CompoCsDetail from '@/components/CompoCsDetail'


export default {
  name: "MENU_CSL_M0502", //상담이력 조회 (바로처리)
  components: {
    CompoManagerInfo,
    CompoAudioWave,
    CompoTalkLog,
    CompoCsDetail,
  },
  data() {
    return {
      // search
      date2: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      date3: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      dropDetail: false,

      // grid
      page: 1,
      pageCount: 0,
      perPage: [15,30,50,100],
      ROW_PER_PAGE: 30,
      headers: [
        { text: '번호', value: 'index', align: 'center', width: '60px', sortable: false },
        { text: '접수일시', value: 'type01', align: 'left', width: '140px' },
        { text: '고객명', value: 'type02', align: 'left', width: '8%', sortable: false },
        { text: '지역본부', value: 'type03', align: 'left', width: '10%', sortable: false },
        { text: '단지명', value: 'type04', align: 'left', width: '', sortable: false },
        { text: '상담사', value: 'type05', align: 'left', width: '6%', sortable: false },
        { text: '경로', value: 'type06', align: 'left', width: '6%', sortable: false },
        { text: '채널', value: 'type07', align: 'left', width: '6%', sortable: false },
        { text: '상담유형', value: 'type08', align: 'left', width: '17%', sortable: false },
        { text: 'AS정보', value: 'type09', align: 'center', width: '6%', sortable: false },
        { text: '접촉횟수', value: 'type10', align: 'center', width: '6%', sortable: false },
        { text: '녹취', value: 'type11', align: 'center', width: '80px', sortable: false },
      ],
      items: [
        {
          index: 11975,
          type01: '2024-06-20 15:47:12',
          type02: '카카오톡 고객',
          type03: '충북지역본부',
          type04: '매입다가구(충북청주시)',
          type05: '우성아',
          type06: 'In',
          type07: '카카오톡',
          type08: '고객응대 > 단순문의 > 수신/통화불량',
          type09: 0,
          type10: 0,
          type11: true,
        },
        {
          index: 11976,
          type01: '2024-06-20 15:47:12',
          type02: '허유진',
          type03: '인천지역본부',
          type04: '인천부평1',
          type05: '우성아',
          type06: 'Out',
          type07: '전화',
          type08: '협업사후처리 > 본부확인요청 > 통화실패',
          type09: 0,
          type10: 0,
          type11: true,
        },
      ],

      // 상태 컬러
      STAT_LIST: [
        { code: '미동의', value: 'is-txt-red'},
        { code: '동의', value: 'is-txt-black'},
      ],

      // dialog
      dialogCsDetail : false,

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

    }
  },
  methods: {
    showDetail(){
      this.dialogCsDetail = true
    },
  },
  mounted() {
  },
  created() {
  },
  computed: {
    reversedItems() {
      return this.items.slice().reverse();
    },
  },
  watch: {
  },
};
</script>

<style lang="scss" scoped>

</style>