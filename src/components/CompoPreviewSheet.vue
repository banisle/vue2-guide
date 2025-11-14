<template>
  <div class="pl-examSheet-wrap">
    <div class="pl-examSheet">
      <!-- title -->
      <h1 class="pl-examSheet-title">
        <img src="../assets/img/lhcs_white.png" alt="lh주거복지" style="height: 30px;">
        <span>24년 04월 업무테스트(일반)</span>
        <div class="pl-examSheet-timewrap">
          <div class="d-flex align-center">
            <v-icon class="pl-icon20 timer-white"></v-icon>
            <div class="ml-1" style="line-height: 1.1;">남은 시간</div>
          </div>
          <span class="pl-examSheet-timewrap-time ml-2 font-decimal">00:12:45</span>
          <!-- 닫기 -->
          <v-btn
            @click="close()"
            dark
            min-width="30"
            height="30"
            class="pl-tooltip-btn pl-dialog-header-close ml-2"
            >
            <v-icon
              small
              class="pl-icon20 dialog-close">
            </v-icon>
          </v-btn>
        </div>
      </h1>
      <!-- sheet -->
      <div class="pl-cols" style="height: calc(100vh - 145px)">
        <div class="">
          <div class="pl-examSheet-paper pl-scroll-body">
            <div v-for="item,index in TEST_DATA_LIST" :key="item.id">
              <!-- 문제 -->
              <div class="d-flex pl-examSheet-paper--title">
                <strong style="flex: 0 0 35px;">{{ index + 1}}. </strong>
                <strong style="word-break: keep-all;">{{ item.title }}</strong>
              </div>
              <!-- 보기 -->
              <template v-if="item.example_list">
                <div class="pl-examSheet-paper--sample is-border-all py-3 px-5 pt-5 ma-3 ml-8 spacing-wrap sp-4 flex-column">
                  <div
                    class=""
                    v-for="ex in item.example_list"
                    :key="ex.id">
                    {{ ex.title }}
                  </div>
                </div>
              </template>
              <!-- 정답, 배점 -->
              <template v-if="!preview_mode">
                <div class="spacing-wrap sp-8 ml-9 is-mt-s" style="font-size: 16px;">
                  <div class="d-flex align-center">
                    <strong>정답</strong><strong class="pl-badge is-lg ml-2 px-2 is-txt-black" style="background: rgb(225, 255, 239);">{{ item.correct }}</strong>
                  </div>
                  <div class="d-flex align-center">
                    <strong>배점</strong><strong class="pl-badge is-lg ml-2 px-2 is-txt-black" style="background: rgb(221, 235, 251);">{{ item.point }}</strong>
                  </div>
                </div>
              </template>
              <!-- 문제 보기: 주관식 -->
              <template v-if="item.type === 'answer'">
                <div class="ml-8 is-mt-m">
                  <v-text-field
                    v-model="item.modelAnswer"
                    class="pl-form type-middle"
                    style="width: calc(100% - 12px);"
                  ></v-text-field>
                </div>
              </template>
              <!-- 문제 보기: 객관식: 단일체크 -->
              <template v-else-if="item.type === 'check'">
                <ol class="pl-examSheet-paper--example">
                  <v-radio-group
                    tag="li"
                    class="d-flex ml-4 align-start"
                    v-model="item.radioGroupSelected">
                    <v-radio
                      v-for="(q, qindex) in item.ex"
                      :key="item.ex[qindex].title"
                      :label="q.title"
                      :value="q.value"
                      class="pl-radio"
                      >
                      <template v-slot:label>
                        <span
                          :style="qindex === item.radioGroupSelected ? 'color: #fff; background: #333;' : ''"
                          style="margin: 3px 0 0 0;"
                          class="pl-examSheet-paper--example-num ">{{ qindex + 1}}</span>
                        <template v-if="q.type === 'icon'">
                          <v-icon :class="`ml-2 pl-icon20 ${ q.title }`" style="margin-top: 6px; font-size: 16px;"></v-icon>
                        </template>
                        <template v-else>
                          <span class="ml-2" style="font-size: 16px;">{{ q.title }}</span>
                        </template>
                      </template>
                    </v-radio>
                  </v-radio-group>
                </ol>
              </template>
              <!-- 문제 보기: 객관식: 다중체크 -->
              <template v-else>
                <ol class="pl-examSheet-paper--example">
                  <li
                    v-for="q,qindex in item.ex"
                    :key="q.id"
                    class="d-flex ml-4 align-start">
                    <v-checkbox
                      v-model="q.chk"
                      class="hover-light-bg"
                      >
                      <template v-slot:label>
                        <span
                          :style="q.chk ? 'color: #fff; background: #333;' : ''"
                          style="margin: 3px 0 0 0;"
                          class="pl-examSheet-paper--example-num ">{{ qindex + 1}}</span>
                        <template v-if="q.type === 'icon'">
                          <v-icon :class="`ml-2 pl-icon20 ${ q.title }`" style="margin-top: 6px"></v-icon>
                        </template>
                        <template v-else>
                          <span class="ml-2">{{ q.title }}</span>
                        </template>
                      </template>
                    </v-checkbox>
                  </li>
                </ol>
              </template>
            </div>
          </div>
        </div>

        <!-- right -->
        <div class="is-col-fix pl-examSheet-answer" >
          <div class="pl-examSheet-answer--title">
            <div class="d-flex"><strong style="flex: 0 0 100px">시험시간</strong> <span>{{ TEST_TIME }}</span></div>
            <div class="d-flex"><strong style="flex: 0 0 100px">응시자</strong> <span>{{ USER_NAME }}</span></div>
          </div>
          <!-- correct list -->
          <div class="pl-examSheet-answer--list list-fade-effect">
            <div
              class="d-flex align-center"
              v-for="item, index in TEST_DATA_LIST"
              :key="item.id">
              <div class="is-bg-light pa-3 text-center is-border-right" style="flex: 0 0  50px;">
                {{ index + 1 }}
              </div>
              <!-- 객관식: 다중체크 -->
              <template v-if="!item.type">
                <div
                  v-for="q, qIndex in item.ex"
                  :key="q.id">
                  <template v-if="q.chk !== false">
                    <template v-if="q.type === 'icon'">
                      <v-icon :class="`ml-2 pl-icon20 ${ q.title }`" style=""></v-icon>
                    </template>
                    <template v-else>
                      <span
                        style="color: #0859ff; border-color: #0859ff;"
                        class="pl-examSheet-paper--example-num ml-2 ">{{ qIndex + 1 }}</span>
                    </template>
                  </template>
                </div>
              </template>
              <!-- 주관식 -->
              <template v-else-if="item.type === 'answer'">
                <span class="ml-2 is-ellips">{{ item.modelAnswer }}</span>
              </template>
              <!-- 객관식: 단일체크 -->
              <template v-else-if="item.type === 'check'">
                <span
                  v-if="item.radioGroupSelected !== null"
                  style="color: #0859ff; border-color: #0859ff;"
                  class="pl-examSheet-paper--example-num ml-2 ">{{ item.radioGroupSelected + 1 }}</span>
              </template>
            </div>

          </div>
          <div class="mt-auto px-5 py-5">
            <v-btn class="pl-btn is-esp" style="width: 100%; height: 50px; font-size: 20px;" @click="close()">답안지 제출</v-btn>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { indexOf } from 'lodash';

export default {
  name: 'CompoPreviewSheet', //평가지 미리보기
  components: {
  },
  data() {
    return {
      // info
      TEST_TIME: '08:40 ~ 05:55 (15분)',
      USER_NAME: '우성아 ',
      SELECT_LIST: [],
      preview_mode: false,

      // 문항
      TEST_DATA_LIST: [
        {
          type: 'check', //단일 선택
          radioGroupSelected: null,
          title: '매입임대주택 “가점 항목 체계화” 관련 내용으로 바르지 못한 것은?',
          correct: 4,
          point: 10,
          ex: [
            { value: 0, title: `고령자 매입임대주택 - ‘최근 3년간 국가 또는 지방자치단체가 운영하는 자활사업 프로그램에 참여한 기간 ~’ 에 대한 가점은 삭제되었다. `, },
            { value: 1, title: `일반 매입임대주택 - 종전 '현 거주지의 최저주거기준 미달 여부' 가점은 '주거취약계층 주거지원 업무처리지침 [별지 5]에 따른 비정상거처거주확인서가 교부된 경우'로 변경되었다.`, },
            { value: 2, title: `청년 매입임대주택 - '타 지역 출신 여부' 와 '현재 민간임대주택 전·월세로 6개월 이상 거주 여부' 가점은 삭제되었다.`, },
            { value: 3, title: `다자녀 매입임대주택 - '수급자 등 여부'에서 가점을 받는 자는 생계급여 또는 의료급여 수급자, 차상위계층이다.`, }, ],
        },
        {
          type: 'check', //단일 선택
          radioGroupSelected: null,
          title: '단일 선택 test',
          correct: 4,
          point: 10,
          ex: [
            { value: 0, title: `고령자 매입임대주택 - ‘최근 3년간 국가 또는 지방자치단체가 운영하는 자활사업 프로그램에 참여한 기간 ~’ 에 대한 가점은 삭제되었다. `, },
            { value: 1, title: `일반 매입임대주택 - 종전 '현 거주지의 최저주거기준 미달 여부' 가점은 '주거취약계층 주거지원 업무처리지침 [별지 5]에 따른 비정상거처거주확인서가 교부된 경우'로 변경되었다.`, },
            { value: 2, title: `청년 매입임대주택 - '타 지역 출신 여부' 와 '현재 민간임대주택 전·월세로 6개월 이상 거주 여부' 가점은 삭제되었다.`, },
            { value: 3, title: `다자녀 매입임대주택 - '수급자 등 여부'에서 가점을 받는 자는 생계급여 또는 의료급여 수급자, 차상위계층이다.`, }, ],
        },
        {
          type: 'answer', //주관식
          modelAnswer: null,
          title: '주관식 test',
          example_list: [
            { chk: false, title: `① 혼인으로 구성될 세대 - 신청자 및 예비배우자`},
            { chk: false, title: `②, ③ 주민등록등본상 세대구성원 - 신청자 및 배우자`},
            { chk: false, title: `④ 주민등록등본상 세대구성원 - 신청자 및 자녀`}, ],

        },
        // 다중선택
        { title: '(상담AP 상담지식게시판) 「공공주택 업무처리지침_2024.1.5 일부개정」 재계약 기준 개정사항 관련 내용으로 맞으면 O, 틀리면 X를 "보기"에서 선택하세요. ', example_list: [ { title: `2024. 1. 5 이후 영구임대ㆍ국민임대 재계약 하는 모든 세대는 1회에 한정하여 재계약 허용 시 초과할 수 있는 소득ㆍ자산 요건에서 자동차가 액은 제외하여 시행한다. `}, ], ex: [ { chk: false, title: 'test-circle', type: 'icon' }, { chk: false, select: true, title: 'test-cross', type: 'icon' }, ], },
        { title: '매입임대주택 “가점 항목 체계화” 관련 내용으로 바르지 못한 것은?', ex: [ { chk: false, title: `고령자 매입임대주택 - ‘최근 3년간 국가 또는 지방자치단체가 운영하는 자활사업 프로그램에 참여한 기간 ~’ 에 대한 가점은 삭제되었다. `, }, { chk: false, select: true, title: `일반 매입임대주택 - 종전 '현 거주지의 최저주거기준 미달 여부' 가점은 '주거취약계층 주거지원 업무처리지침 [별지 5]에 따른 비정상거처거주확인서가 교부된 경우'로 변경되었다.`, }, { chk: false, title: `청년 매입임대주택 - '타 지역 출신 여부' 와 '현재 민간임대주택 전·월세로 6개월 이상 거주 여부' 가점은 삭제되었다.`, }, { chk: false, title: `다자녀 매입임대주택 - '수급자 등 여부'에서 가점을 받는 자는 생계급여 또는 의료급여 수급자, 차상위계층이다.`, }, ], },
        { title: '매입임대주택 “가점 항목 체계화” 관련 내용으로 바르지 못한 것은?', example_list: [ { chk: false, title: `① 혼인으로 구성될 세대 - 신청자 및 예비배우자`}, { chk: false, title: `②, ③ 주민등록등본상 세대구성원 - 신청자 및 배우자`}, { chk: false, title: `④ 주민등록등본상 세대구성원 - 신청자 및 자녀`}, ], ex: [ { chk: false, title: `예비신혼부부 - 신청자가 현재 만 33세로 예비배우자가 주택을 처분한 지 2년이 되었다면, 무주택기간은 2년이다.`, }, { chk: false, title: `신혼부부 - 신청자(만 32세 혼인)가 현재 만 33세이고, 배우자가 주택을 처분한 지 2년이 되었다면, 무주택기간은 2년이다.`, }, { chk: false, select: true, title: `신혼부부 - 신청자(만 27세 혼인)가 만 31세이고, 본인 및 배우자가 한 번도 주택을 소유한 적이 없다면, 무주택기간은 4년이다.`, }, { chk: false, title: `한부모 - 신청자(만 28세에 혼인 후 이혼)가 현재 만 32세인 경우, 무주택기간은 4년이다.`, }, ], },
        { title: '(상담AP 상담지식게시판) 「공공주택 업무처리지침_2024.1.5 일부개정」 재계약 기준 개정사항 관련 내용으로 맞으면 O, 틀리면 X를 "보기"에서 선택하세요. ', example_list: [ { title: `2024. 1. 5 이후 영구임대ㆍ국민임대 재계약 하는 모든 세대는 1회에 한정하여 재계약 허용 시 초과할 수 있는 소득ㆍ자산 요건에서 자동차가 액은 제외하여 시행한다. `}, ], ex: [ { chk: false, title: 'test-circle', type: 'icon' }, { chk: false, select: true, title: 'test-cross', type: 'icon' }, ], },
        { title: '매입임대주택 “가점 항목 체계화” 관련 내용으로 바르지 못한 것은?', ex: [ { chk: false, title: `고령자 매입임대주택 - ‘최근 3년간 국가 또는 지방자치단체가 운영하는 자활사업 프로그램에 참여한 기간 ~’ 에 대한 가점은 삭제되었다. `, }, { chk: false, select: true, title: `일반 매입임대주택 - 종전 '현 거주지의 최저주거기준 미달 여부' 가점은 '주거취약계층 주거지원 업무처리지침 [별지 5]에 따른 비정상거처거주확인서가 교부된 경우'로 변경되었다.`, }, { chk: false, title: `청년 매입임대주택 - '타 지역 출신 여부' 와 '현재 민간임대주택 전·월세로 6개월 이상 거주 여부' 가점은 삭제되었다.`, }, { chk: false, title: `다자녀 매입임대주택 - '수급자 등 여부'에서 가점을 받는 자는 생계급여 또는 의료급여 수급자, 차상위계층이다.`, }, ], },
        { title: '매입임대주택 “가점 항목 체계화” 관련 내용으로 바르지 못한 것은?', example_list: [ { chk: false, title: `① 혼인으로 구성될 세대 - 신청자 및 예비배우자`}, { chk: false, title: `②, ③ 주민등록등본상 세대구성원 - 신청자 및 배우자`}, { chk: false, title: `④ 주민등록등본상 세대구성원 - 신청자 및 자녀`}, ], ex: [ { chk: false, title: `예비신혼부부 - 신청자가 현재 만 33세로 예비배우자가 주택을 처분한 지 2년이 되었다면, 무주택기간은 2년이다.`, }, { chk: false, title: `신혼부부 - 신청자(만 32세 혼인)가 현재 만 33세이고, 배우자가 주택을 처분한 지 2년이 되었다면, 무주택기간은 2년이다.`, }, { chk: false, select: true, title: `신혼부부 - 신청자(만 27세 혼인)가 만 31세이고, 본인 및 배우자가 한 번도 주택을 소유한 적이 없다면, 무주택기간은 4년이다.`, }, { chk: false, title: `한부모 - 신청자(만 28세에 혼인 후 이혼)가 현재 만 32세인 경우, 무주택기간은 4년이다.`, }, ], },
        { title: '(상담AP 상담지식게시판) 「공공주택 업무처리지침_2024.1.5 일부개정」 재계약 기준 개정사항 관련 내용으로 맞으면 O, 틀리면 X를 "보기"에서 선택하세요. ', example_list: [ { title: `2024. 1. 5 이후 영구임대ㆍ국민임대 재계약 하는 모든 세대는 1회에 한정하여 재계약 허용 시 초과할 수 있는 소득ㆍ자산 요건에서 자동차가 액은 제외하여 시행한다. `}, ], ex: [ { chk: false, title: 'test-circle', type: 'icon' }, { chk: false, select: true, title: 'test-cross', type: 'icon' }, ], },
        { title: '매입임대주택 “가점 항목 체계화” 관련 내용으로 바르지 못한 것은?', ex: [ { chk: false, title: `고령자 매입임대주택 - ‘최근 3년간 국가 또는 지방자치단체가 운영하는 자활사업 프로그램에 참여한 기간 ~’ 에 대한 가점은 삭제되었다. `, }, { chk: false, select: true, title: `일반 매입임대주택 - 종전 '현 거주지의 최저주거기준 미달 여부' 가점은 '주거취약계층 주거지원 업무처리지침 [별지 5]에 따른 비정상거처거주확인서가 교부된 경우'로 변경되었다.`, }, { chk: false, title: `청년 매입임대주택 - '타 지역 출신 여부' 와 '현재 민간임대주택 전·월세로 6개월 이상 거주 여부' 가점은 삭제되었다.`, }, { chk: false, title: `다자녀 매입임대주택 - '수급자 등 여부'에서 가점을 받는 자는 생계급여 또는 의료급여 수급자, 차상위계층이다.`, }, ], },
      ],

    }
  },
  methods: {
    close(){
      // this.mixin_fullscreen_off()
      this.$emit('ConfirmTest')
    },
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