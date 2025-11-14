<template>
  <div>
    <!-- search -->
    <div class="pl-card pb-0 px-6">
      <div class="pl-rounded-box">
        <div class="pl-form-inline-wrap px-5 pt-3">
          <div class="pl-form-inline">
            <span class="pl-label">
              등록일
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
              유형
            </span>
            <div class="pl-desc">
              <v-select
                class="pl-form type-middle is-sm"
                placeholder="전체"
              ></v-select>
            </div>
          </div>
        </div>
        <div class="pl-form-inline-wrap px-5 py-3 is-border-top">
          <div class="pl-form-inline">
            <span class="pl-label">
              센터
            </span>
            <div class="pl-desc">
              <v-select
                class="pl-form type-middle"
                placeholder="전체"
              ></v-select>
              <v-text-field
                class="pl-form type-middle is-sm"
                placeholder="등록자"
              ></v-text-field>
              <v-text-field
                class="pl-form type-middle"
                placeholder="제목/내용"
              ></v-text-field>
            </div>
          </div>
          <v-btn class="pl-btn">조회</v-btn>
        </div>
      </div>
    </div>
    <!-- list top -->
    <div class="d-flex align-center is-mt-s px-6">
      <span class="pl-label">전체 (<span class="is-txt-blue">{{ DAILY_LIST.length }}</span>)건</span>
      <compo-tooltip-btn
        TitleProp="데일리 등록"
        ClassProp="pl-tooltip-btn ml-auto"
        IconProp="pl-icon20 circle-plus"
        TooltipPositionProp="bottom"
        @btnClick="mixin_showDialog('WriteNotice')"
      ></compo-tooltip-btn>
      <compo-tooltip-btn
        TitleProp="새로고침"
        ClassProp="pl-tooltip-btn ml-1"
        IconProp="pl-icon20 refresh"
        TooltipPositionProp="bottom"
      ></compo-tooltip-btn>
    </div>
    <!-- list -->
    <div
      style="height: 615px;"
      class="is-mt-s pl-notice-list type-acco is-border-top pl-scroll-body">
      <div
        class="pl-notice-list--unit"
        v-for="item in DAILY_LIST"
        :key="item.id">
        <div
          @click="item.active = !item.active"
          :class="`d-flex align-center acco-title active-${item.active}`">
          <div class="">
            <div class="d-flex align-center">
              <strong >{{ item.subject }}</strong>
              <span
                v-if="item.type_new"
                class="pl-badge is-new ml-1">Today</span>
            </div>
            <div class="d-flex align-center is-txt-sub mt-1" style="font-size: 12px; gap: 4px">
              <span v-if="item.category01">{{ item.category01 }}</span>
              <span v-if="item.category02">&bull; {{ item.category02 }}</span>
              <span v-if="item.date">&bull; {{ item.date }}</span>
              <span v-if="item.writer">&bull; ({{ item.writer }})</span>
              <span v-if="item.view_cnt">&bull; 조회수 {{ item.view_cnt }}</span>
              <span v-if="item.file">&bull;  <v-icon class="pl-icon20 file"></v-icon></span>
            </div>
          </div>
        </div>
        <div v-if="item.active"
          class="pl-notice-list--content d-flex flex-column is-mt-s py-3 pr-4"
          >
          <div style="white-space: pre-wrap;">{{ item.desc }}</div>
          <div class="pl-btn-wrap pt-2 ">
            <!-- 수정 버튼 -->
            <compo-tooltip-btn
              TitleProp="수정"
              ClassProp="pl-tooltip-btn ml-auto"
              IconProp="pl-icon20 edit"
              TooltipPositionProp="bottom"
            ></compo-tooltip-btn>
            <!-- 삭제 버튼 -->
            <compo-tooltip-btn
              TitleProp="삭제"
              ClassProp="pl-tooltip-btn"
              IconProp="pl-icon20 trash"
              TooltipPositionProp="bottom"
            ></compo-tooltip-btn>
          </div>
        </div>
      </div>
      <!-- 더보기 -->
      <div class="d-flex justify-center is-mt-m pb-3">
        <v-btn class="pl-btn is-round is-sub px-4">더보기</v-btn>
      </div>
    </div>
    <!-- dialog: 데일리 등록 -->
    <v-dialog
      v-model="dialogWriteNotice"
      width="900"
      content-class="dialog-draggable is-maxHeight"
      hide-overlay>
      <div class="draggable-area">drag area</div>
      <compo-dialog
        header-title="데일리 등록"
        @hide="mixin_hideDialog('WriteNotice')"
        @submit="submitDialog('WriteNotice')"
      >
        <template slot="body">
          <CompoNoticeWrtie
            TypeProp="daily"
          />
        </template>
        <template slot="footer">
          <v-btn class="pl-btn is-trans" @click="mixin_hideDialog('WriteNotice')">닫기</v-btn>
          <v-btn class="pl-btn" @click="mixin_hideDialog('WriteNotice')">저장</v-btn>
        </template>
      </compo-dialog>
    </v-dialog>
  </div>
</template>

<script>
import CompoNoticeWrtie from '@/components/CompoNoticeWrtie'
export default {
  name: "HomeSideDaily", //name은 'MENU_' + 파일명 조합
  components: {
    CompoNoticeWrtie,
  },
  data() {
    return {
      // search
      date2: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      date3: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),

      // 공지 등록
      dialogWriteNotice: false,

      // list
      DAILY_LIST: [
        {
          subject: '관심지역 알리미 등록관련',
          type_new: true,
          category01: '관심지역알리미',
          category02: '마이홈센터',
          date: '2024-06-10',
          writer: '윤지영',
          view_cnt: 228,
          file: false,
          desc: `※ 공고문에는 만 65세 이상의 고령자 및 장애인 중 인터넷 접수가 어려우신 분에 한하여
현장접수가 가능으로 되어 있지만 이번 공고는
제한업이 현장접수 가능합니다.

상담 시 참고 하시기 바랍니다.

★ 전북남부권주거복지지사 063-570-2322 확인.`,
          active: false,
        },
        {
          subject: '(06/18) 정읍시 행복주택 예비입주자 모집_현장접수 대상자 관련',
          type_new: true,
          category01: '예비입주자 모집',
          category02: '전체',
          date: '2024-06-10',
          writer: '윤지영',
          view_cnt: 177,
          file: true,
          desc: `※ 공고문에는 만 65세 이상의 고령자 및 장애인 중 인터넷 접수가 어려우신 분에 한하여
현장접수가 가능으로 되어 있지만 이번 공고는
제한업이 현장접수 가능합니다.

상담 시 참고 하시기 바랍니다.

★ 전북남부권주거복지지사 063-570-2322 확인.`,
          active: false,
        },
        {
          subject: '2024년 7월 행복주택 예비입주자 통합 정례모집 사전 안내문',
          type_new: false,
          category01: '예비입주자 모집',
          category02: '마이홈센터',
          date: '2024-06-10',
          writer: '윤지영',
          view_cnt: 228,
          file: true,
          desc: `※ 공고문에는 만 65세 이상의 고령자 및 장애인 중 인터넷 접수가 어려우신 분에 한하여
현장접수가 가능으로 되어 있지만 이번 공고는
제한업이 현장접수 가능합니다.

상담 시 참고 하시기 바랍니다.

★ 전북남부권주거복지지사 063-570-2322 확인.`,
          active: false,
        },
        {
          subject: '(5/16) 순천시, 광양시 국민임대주택 예비입주자 전례모집_서류제출 시간 관련',
          type_new: false,
          category01: '국민임대주택',
          category02: '마이홈센터',
          date: '2024-06-10',
          writer: '나팀장',
          view_cnt: 183,
          file: true,
          desc: `※ 공고문에는 만 65세 이상의 고령자 및 장애인 중 인터넷 접수가 어려우신 분에 한하여
현장접수가 가능으로 되어 있지만 이번 공고는
제한업이 현장접수 가능합니다.

상담 시 참고 하시기 바랍니다.

★ 전북남부권주거복지지사 063-570-2322 확인.`,
          active: false,
        },
        {
          subject: '(6/19) 양주 옥정 A8BL 영구임대주택 입주자격완화 예비입주자 모집공고',
          type_new: false,
          category01: '예비입주자 모집',
          category02: '마이홈센터',
          date: '2024-06-10',
          writer: '나팀장',
          view_cnt: 228,
          file: true,
          desc: `※ 공고문에는 만 65세 이상의 고령자 및 장애인 중 인터넷 접수가 어려우신 분에 한하여
현장접수가 가능으로 되어 있지만 이번 공고는
제한업이 현장접수 가능합니다.

상담 시 참고 하시기 바랍니다.

★ 전북남부권주거복지지사 063-570-2322 확인.`,
          active: false,
        },
        {
          subject: '[부천권(광명시/부천시)_카카오톡 / 모바일 고지서 발송 공유의 건]',
          type_new: false,
          category01: '모바일 고지서',
          category02: '전체',
          date: '2024-06-10',
          writer: '나팀장',
          view_cnt: 115,
          file: true,
          desc: `※ 공고문에는 만 65세 이상의 고령자 및 장애인 중 인터넷 접수가 어려우신 분에 한하여
현장접수가 가능으로 되어 있지만 이번 공고는
제한업이 현장접수 가능합니다.

상담 시 참고 하시기 바랍니다.

★ 전북남부권주거복지지사 063-570-2322 확인.`,
          active: false,
        },
        {
          subject: '(06/18) 정읍시 행복주택 예비입주자 모집_현장접수 대상자 관련',
          type_new: false,
          category01: '예비입주자 모집',
          category02: '전체',
          date: '2024-06-10',
          writer: '윤지영',
          view_cnt: 177,
          file: true,
          desc: `※ 공고문에는 만 65세 이상의 고령자 및 장애인 중 인터넷 접수가 어려우신 분에 한하여
현장접수가 가능으로 되어 있지만 이번 공고는
제한업이 현장접수 가능합니다.

상담 시 참고 하시기 바랍니다.

★ 전북남부권주거복지지사 063-570-2322 확인.`,
          active: false,
        },
        {
          subject: '2024년 7월 행복주택 예비입주자 통합 정례모집 사전 안내문',
          type_new: false,
          category01: '예비입주자 모집',
          category02: '마이홈센터',
          date: '2024-06-10',
          writer: '윤지영',
          view_cnt: 228,
          file: true,
          desc: `※ 공고문에는 만 65세 이상의 고령자 및 장애인 중 인터넷 접수가 어려우신 분에 한하여
현장접수가 가능으로 되어 있지만 이번 공고는
제한업이 현장접수 가능합니다.

상담 시 참고 하시기 바랍니다.

★ 전북남부권주거복지지사 063-570-2322 확인.`,
          active: false,
        },
        {
          subject: '(5/16) 순천시, 광양시 국민임대주택 예비입주자 전례모집_서류제출 시간 관련',
          type_new: false,
          category01: '국민임대주택',
          category02: '마이홈센터',
          date: '2024-06-10',
          writer: '나팀장',
          view_cnt: 183,
          file: true,
          desc: `※ 공고문에는 만 65세 이상의 고령자 및 장애인 중 인터넷 접수가 어려우신 분에 한하여
현장접수가 가능으로 되어 있지만 이번 공고는
제한업이 현장접수 가능합니다.

상담 시 참고 하시기 바랍니다.

★ 전북남부권주거복지지사 063-570-2322 확인.`,
          active: false,
        },
        {
          subject: '(6/19) 양주 옥정 A8BL 영구임대주택 입주자격완화 예비입주자 모집공고',
          type_new: false,
          category01: '예비입주자 모집',
          category02: '마이홈센터',
          date: '2024-06-10',
          writer: '나팀장',
          view_cnt: 228,
          file: true,
          desc: `※ 공고문에는 만 65세 이상의 고령자 및 장애인 중 인터넷 접수가 어려우신 분에 한하여
현장접수가 가능으로 되어 있지만 이번 공고는
제한업이 현장접수 가능합니다.

상담 시 참고 하시기 바랍니다.

★ 전북남부권주거복지지사 063-570-2322 확인.`,
          active: false,
        },
        {
          subject: '[부천권(광명시/부천시)_카카오톡 / 모바일 고지서 발송 공유의 건]',
          type_new: false,
          category01: '모바일 고지서',
          category02: '전체',
          date: '2024-06-10',
          writer: '나팀장',
          view_cnt: 115,
          file: true,
          desc: `※ 공고문에는 만 65세 이상의 고령자 및 장애인 중 인터넷 접수가 어려우신 분에 한하여
현장접수가 가능으로 되어 있지만 이번 공고는
제한업이 현장접수 가능합니다.

상담 시 참고 하시기 바랍니다.

★ 전북남부권주거복지지사 063-570-2322 확인.`,
          active: false,
        },
      ],
    }
  },
  methods: {
  },
  mounted() {
  },
  created() {
  },
  computed: {
  },
  watch: {
  },
};
</script>

<style lang="scss" scoped>

</style>