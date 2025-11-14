<template>
  <div class="pl-quick-layer-body" style="flex: 0 0 calc(100% - 190px);">
    <div class="spacing-wrap sp-32 align-center">
      <span class="spacing-wrap sp-4 align-center">
        <v-icon class="pl-icon20 date-fill"></v-icon>
        <span class="pl-label">이의제기 기간</span>
        <span>{{ REJECTION_DATA.date }}</span>
      </span>
      <span class="spacing-wrap sp-4 align-center">
        <v-icon class="pl-icon20 time-fill"></v-icon>
        <span class="pl-label">이의제기 종결일</span>
        <span>{{ REJECTION_DATA.end_date }}</span>
        <!-- 뱃지 -->
        <span :class="`ml-1 pl-badge is-${mixin_displayStatus(REJECTION_DATA.stat, 'STAT_LIST')}`">{{ REJECTION_DATA.stat }}</span>
      </span>
    </div>
    <!-- list -->
    <div class="is-mt-m pl-notice-list no-link no-hover is-border-top pl-scroll-body" style="height: 540px; ">
      <div
        class="pl-notice-list--unit d-flex align-center px-0"
        v-for="item in REJECTION_DATA.list"
        :key="item.id">
        <img :src="item.img" :alt="item.name" style="width: 35px; height: 35px" class="align-self-start" @error="function(e){e.target.src=require('@/assets/img/@profile_user.png')}">

        <div class="ml-3">
          <div>
            <strong style="font-size: 14px">{{ item.name }}</strong>
            <span class="ml-2 is-txt-sub">{{ item.date }}</span>
          </div>
          <div >
            {{ item.txt }}
          </div>
        </div>
      </div>
    </div>
    <div class="is-mt-m">
      <v-textarea
        height="70"
        class="pl-form is-noresize"
        :value="REJECTION_DATA.textarea"
        :spellcheck="false"
        placeholder="여기에 내용을 입력하신 후 [글 남기기] 버튼을 클릭 하세요."
      />
      <div class="d-flex align-cente is-mt-m">
        <ul class="pl-list-info">
          <li>평가가 <strong>마감</strong> 또는 <strong>이의제기 기간 종료 후</strong>에는 글을 남길 수 없습니다. </li>
        </ul>
        <!-- btn -->
        <div class="pl-btn-wrap ml-auto">
          <v-btn class="pl-btn is-esp" v-if="!isPreview"> 이의제기 취소 </v-btn>
          <v-btn class="pl-btn " v-if="!isPreview"> 글 남기기</v-btn>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'QAM_M0500_CS_DETAIL_04', //평가실행관리 - 이의제기
  components: {
  },
  props:{
    qaBaseData:{
      type: Object,
      default: ()=>{}
    },
    qaObjHistList:{
      type: Array,
      default: ()=>[]
    }
  },
  data() {
    return {
      // 이의 제기
      REJECTION_DATA: {
        date: '2024-06-28 17:00',
        end_date: '2024-06-28 15:35:45',
        stat: '종결',
        list: [
          { img: require('@/assets/img/@manager_profile.png'), name: '김미정', date: '2024-06-25 13:20:45', txt: `2번 문제의 정답이 3번인데 질문의 내용과 의도를 보았을 때 4번도 정답이 맞는 듯 합니다.
이번 2024년 06월 22일 정정 공고된 공고문의 32페이지의 내용을 보면 4번도 정답으로 판단됩니다.
확인 요청 드려요.` },
          { img: require('@/assets/img/@profile_blue_default.png'), name: '평가자', date: '2024-06-25 17:05:35', txt: `안녕하세요. 해당 공고문의 정정 공고문을 확인 해 보았을 때, 해석의 기준을 어떻게 하는지에 따라  기준이 좀 다르다고
판단됩니다. 하여 공고의 정확한 판단을 위해 해당 담당자와 확인 중에 있습니다.
결과가 나오면 다시 안내 드리도록 하겠습니다.` },
          { img: require('@/assets/img/@profile_blue_default.png'), name: '평가자', date: '2024-06-25 17:05:35', txt: `안녕하세요. 해당 공고문 해석 결과 김미정 상담사 님의 말씀처럼 4번도 정답으로 판명되어 정답 처리해 드리겠습니다.
평가 문제와 결과에 혼선을 드려 죄송합니다. ^^
` },
          { img: require('@/assets/img/@manager_profile.png'), name: '김미정', date: '2024-06-26 16:21:18', txt: `네에~ 감사합니다. 수고 하십시오.` },
        ],
        textarea: null,
      },
      // 상태 컬러
      STAT_LIST: [
        { code: '종결', value: 'green'},
        { code: '진행', value: 'cyan'},
      ],

      isPreview: false,
    }
  },
  methods: {
  },
  mounted() {
    this.isPreview = this.qaBaseData.isPreview;
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