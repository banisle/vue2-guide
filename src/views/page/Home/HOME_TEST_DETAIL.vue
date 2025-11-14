<template>
  <div style="display: contents">
    <div class="pl-quick-layer-header flex-column pb-0">
      <div class="d-flex" style="position: relative; width: 100%">
        <div style="flex: 0 0 40px">
          <img :src="data.PROFILE.img" :alt="data.PROFILE.name" style="width: 100%; max-height: 40px; border-radius: 50%;" @error="function(e){e.target.src=require('@/assets/img/@profile_user.png')}">
        </div>
        <div class="ml-4">
          <div >
            <strong style="font-size: 14px">{{ data.PROFILE.name }}</strong>
            <span class="ml-2 is-txt-sub">{{ data.PROFILE.part }}</span></div>
          <div class="spacing-wrap sp-16">
            <div>
              <strong>평가일시</strong>
              <span class="ml-2">{{ data.PROFILE.test_date }}</span>
            </div>
            <div>
              <strong class="ml-1">평가상태</strong>
              <span class="ml-2">{{ data.PROFILE.test_stat }}</span>
            </div>
            <div>
              <strong class="ml-1">평가적용</strong>
              <span class="ml-2">{{ data.PROFILE.test_assign }}</span>
            </div>
          </div>
        </div>
        <compo-tooltip-btn
          TitleProp="닫기"
          ClassProp="pl-tooltip-btn ml-auto"
          IconProp="pl-icon20 dialog-close"
          StyleProp="position: absolute; right: 0; top: 0;"
          TooltipPositionProp="bottom"
          @btnClick="close()"
        ></compo-tooltip-btn>
      </div>
      <!-- tab -->
      <v-tabs class="pl-tabs is-mt-s is-noborder" v-model="tabs2">
        <v-tab>평가결과</v-tab>
        <v-tab>
          <v-badge
            value="true"
            color="#0073ce"
            bordered
            offset-x="-1"
            offset-y="9"
            dot
          >
          이의제기
          </v-badge>
        </v-tab>
      </v-tabs>
    </div>
    <div class="pl-quick-layer-body pa-0" style="flex: 0 0 calc(100% - 190px);">
      <!-- tab content -->
      <v-tabs-items v-model="tabs2">
        <!-- 평가결과 -->
        <v-tab-item>
          <div class="pa-5">
            <!-- grid -->
            <div class="pl-grid-top">
              <div class="pl-grid-top-left">
                <span class="pl-subtit">{{ TEST_DATA.subject }}</span>
              </div>
            </div>
            <table class="pl-tbl-detail is-mt-s">
              <thead>
                <tr>
                  <th
                    v-for="item in headers"
                    :width="item.width"
                    :key="item.id">
                    {{ item.text }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in items" :key="index">
                  <td
                    :class="`text-center ${key === 'type07' ? 'font-weight-bold' : ''}`"
                    v-for="(value, key) in item"
                    :key="key">

                    <template v-if="key === 'type07'">
                      {{ value }} 점
                    </template>
                    <template v-else-if="key === 'type05'">
                      <strong class="pl-badge ml-2 px-2 is-txt-black" style="background: #E1FFEF">{{ value }}</strong>
                    </template>
                    <template v-else-if="key === 'type06'">
                      <strong class="pl-badge ml-2 px-2 is-txt-black" style="background: #DDEBFB">{{ value }}</strong>
                    </template>
                    <template v-else>{{ value }}</template>
                  </td>
                </tr>
              </tbody>
            </table>
            <!-- test list -->
            <div class="is-mt-l">
              <span class="pl-subtit">평가 문항 및 제출 답안</span>
              <div class="is-mt-m is-border-top pt-4 spacing-wrap sp-64 flex-column">
                <div v-for="item,index in TEST_DATA.list" :key="item.id">
                  <!-- 제목 -->
                  <div class="d-flex" style="position: relative; font-size: 15px;">
                    <strong style="flex: 0 0 20px;">{{ index + 1}}. </strong>
                    <strong style="word-break: keep-all;">{{ item.title }}
                      <!-- 점수 -->
                      <span class="is-txt-blue ml-2">
                        [정답 {{ item.correct_point }}] [배점 {{ item.assign_point }}]
                      </span>
                    </strong>
                    <v-icon
                      style="width: 90px; height: 90px; position: absolute; top: -28px; left: -12px;"
                      :class="`pl-icon20 ${ item.correct ? 'correct-true' : 'correct-false'}`"></v-icon>


                  </div>
                  <!-- 보기 -->
                  <template v-if="item.example_list">
                    <div class="pl-test-sample is-border-all py-3 px-5 pt-5 ma-3 mt-5 spacing-wrap sp-4 flex-column">
                      <div
                        class=""
                        v-for="ex in item.example_list"
                        :key="ex.id">
                        {{ ex.title }}
                      </div>
                    </div>
                  </template>

                  <!-- 시험지 -->
                  <ol class="is-mt-s spacing-wrap sp-8 flex-column" style="font-size: 14px;">
                    <li
                      v-for="q,qindex in item.ex"
                      :key="q.id"
                      :style="q.select ? '' : ''"
                      class="d-flex ml-4 align-start">
                      <span
                        style="flex: 0 0 16px; margin-top: 3px; border-radius: 50%; border: 1px solid rgb(110 110 110); display: inline-flex; width: 16px; height: 16px; text-align: center; justify-content: center; font-size: 12px; align-items: center;"
                        :style="q.select ? 'color: #fff; background: #333;' : ''">
                        {{ qindex + 1}}
                        </span>
                      <template v-if="q.type === 'icon'">
                        <v-icon :class="`ml-2 pl-icon20 ${ q.title }`" style="margin-top: 3px"></v-icon>
                      </template>
                      <template v-else>
                        <span class="ml-2">{{ q.title }}</span>
                      </template>
                    </li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </v-tab-item>
        <!-- 이의 제기 -->
        <v-tab-item>
          <CompoObjectionRequest />
        </v-tab-item>
      </v-tabs-items>
    </div>
  </div>
</template>

<script>
import CompoObjectionRequest from '@/components/CompoObjectionRequest'


export default {
  name: "HOME_TEST_DETAIL", //name은 'MENU_' + 파일명 조합
  props: {
    popData : {
      type: Object,
    },
  },
  components: {
    CompoObjectionRequest
  },
  data() {
    return {
      tabs2: null,
      data: {
        PROFILE: {
          name: '김미정',
          img: require('@/assets/img/@manager_profile5.png'),
          part: '바로처리센터 - 마이홈1팀',
          test_date: '2024-06-20 09:30:25',
          test_stat: '평가완료',
          test_assign: '적용',
        },
      },
      // grid
      headers: [
        { text: '평가일', value: 'type01', align: 'center', width: '15%', sortable: false, },
        { text: '평가시간', value: 'type02', align: 'center', width: '', sortable: false, },
        { text: '답안 제출 시간', value: 'type03', align: 'center', width: '16%', sortable: false, },
        { text: '배점', value: 'type04', align: 'center', width: '12%', sortable: false, },
        { text: '맞은 문항 수', value: 'type05', align: 'center', width: '13%', sortable: false, },
        { text: '틀린 문항 수', value: 'type06', align: 'center', width: '13%', sortable: false, },
        { text: '총점', value: 'type07', align: 'center', width: '12%', sortable: false, },
      ],
      items: [
        {
          type01: '2024-06-20',
          type02: '08:30 ~ 08:45',
          type03: '08:42:45',
          type04: 100,
          type05: 9,
          type06: 1,
          type07: 90,
        },
      ],
      //평가결과
      TEST_DATA: {
        subject: '2024년 (6월) 업무평가 테스트 결과표',
        list: [
          {
            correct: true,
            title: '매입임대주택 “가점 항목 체계화” 관련 내용으로 바르지 못한 것은?',
            correct_point: 2,
            assign_point: 10,
            ex: [
              { title: `고령자 매입임대주택 - ‘최근 3년간 국가 또는 지방자치단체가 운영하는 자활사업 프로그램에 참여한 기간 ~’ 에 대한 가점은 삭제되었다. `, },
              { select: true, title: `일반 매입임대주택 - 종전 '현 거주지의 최저주거기준 미달 여부' 가점은 '주거취약계층 주거지원 업무처리지침 [별지 5]에 따른 비정상거처거주확인서가 교부된 경우'로 변경되었다.`, },
              { title: `청년 매입임대주택 - '타 지역 출신 여부' 와 '현재 민간임대주택 전·월세로 6개월 이상 거주 여부' 가점은 삭제되었다.`, },
              { title: `다자녀 매입임대주택 - '수급자 등 여부'에서 가점을 받는 자는 생계급여 또는 의료급여 수급자, 차상위계층이다.`, },
            ],
          },
          {
            correct: false,
            title: '매입임대주택 “가점 항목 체계화” 관련 내용으로 바르지 못한 것은?',
            correct_point: 2,
            assign_point: 10,
            example_list: [
              { title: `① 혼인으로 구성될 세대 - 신청자 및 예비배우자`},
              { title: `②, ③ 주민등록등본상 세대구성원 - 신청자 및 배우자`},
              { title: `④ 주민등록등본상 세대구성원 - 신청자 및 자녀`},
            ],
            ex: [
              { title: `예비신혼부부 - 신청자가 현재 만 33세로 예비배우자가 주택을 처분한 지 2년이 되었다면, 무주택기간은 2년이다.`, },
              {  title: `신혼부부 - 신청자(만 32세 혼인)가 현재 만 33세이고, 배우자가 주택을 처분한 지 2년이 되었다면, 무주택기간은 2년이다.`, },
              { select: true, title: `신혼부부 - 신청자(만 27세 혼인)가 만 31세이고, 본인 및 배우자가 한 번도 주택을 소유한 적이 없다면, 무주택기간은 4년이다.`, },
              { title: `한부모 - 신청자(만 28세에 혼인 후 이혼)가 현재 만 32세인 경우, 무주택기간은 4년이다.`, },
            ],
          },
          {
            correct: true,
            correct_point: 2,
            assign_point: 10,
            title: '(상담AP 상담지식게시판) 「공공주택 업무처리지침_2024.1.5 일부개정」 재계약 기준 개정사항 관련 내용으로 맞으면 O, 틀리면 X를 "보기"에서 선택하세요.',
            example_list: [
              { title: `2024. 1. 5 이후 영구임대ㆍ국민임대 재계약 하는 모든 세대는 1회에 한정하여 재계약 허용 시 초과할 수 있는 소득ㆍ자산 요건에서 자동차가 액은 제외하여 시행한다. `},
            ],
            ex: [
              { title: 'test-circle', type: 'icon' },
              { select: true, title: 'test-cross', type: 'icon' },
            ],
          },
        ]
      },

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


    }
  },
  methods: {
    close(){
      this.$emit('Close')
    }
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