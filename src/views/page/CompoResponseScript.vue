<template>
  <div>
    <div class="pl-card">
      <!-- header -->
      <h1 class="text-center">산업안전보건법 41조</h1>
      <div class="text-right">
        <span >“감정노동자 보호 제도의 근거 조항”</span>
      </div>
      <!-- content -->
      <div class="pl-rounded-box is-bg-esp pa-3 is-mt-s">
        <h3 class="is-txt-white font-weight-light text-center">
          “당사는 산업안전보건법 제41조에 따라<br>고객응대 근로자를 보호하기 위한 제도를<br>시행하고 있습니다.”
        </h3>
        <div class="pl-rounded-box py-3 px-5 is-bg-white is-mt-s">
          <div class="d-flex">
            <div class="is-border-right col-6 pa-0">
              <h4 >산업안전보건법 제41조 제1항</h4>
              <p class="is-mt-s" style="font-size: 18px;">
                사업주는 고객응대근로자에 대하여<br>
                고객의 폭언, 폭행, 그 밖에 적정범위를 벗어난<br>
                신체적, 정신적 고통을 유발하는 행위로 인한<br>
                건강 장애를 예방하기 위하여<br>
                고용노도부령으로 정하는 바에 따라<br>
                필요한 조치를 하여야 한다.
              </p>
            </div>
            <div class="ml-6">
              <h4 >산업안전보건법 제41조 제2항</h4>
              <p class="is-mt-s" style="font-size: 18px;">
                사업주는 폭언 등으로 근로자에게<br>
                건강장해가 발생하거나<br>
                발생할 현저한 우려가 있는 경우에는<br>
                업무의 일시적 중단 또는 전환 등<br>
                대통령령으로 정하는 필요한 조치를 해야 한다.
              </p>
            </div>
          </div>
        </div>
      </div>
      <!-- caution -->
      <div class="d-flex justify-center align-center is-mt-s">
        <v-icon class="pl-icon20 caution-fill"></v-icon>
        <div class="ml-1" style="font-size: 17px;">경고 구사는 절차서 상에 명기된 <span class="is-txt-red ml-1">표준 멘트</span>가 구사되어야 함.</div>
      </div>
      <!-- tabs -->
      <v-tabs
        v-model="tabs1"
        class="pl-tabs is-mt-s">
        <CompoTabItems :TabsList=tabsList1 class="mt-0" />
      </v-tabs>
      <!-- content -->
      <div style="height: 100%" >
        <v-tabs-items
          v-model="tabs1"
          class="fill-height"
          style="background: transparent"
          >
          <v-tab-item
            v-for="item in STEP_LIST_TAB"
            :key="item.id">
            <div class="fill-height tab-contents is-mt-m" >
              <div class="d-flex align-start">
                <v-icon class="pl-icon20 ai-script"></v-icon>
                <div
                  class="pl-subtit is-lg ml-1 font-weight-light" style="font-size: 17px;">경고 멘트 및 구사 횟수 :
                  <strong class="is-txt-red ml-1 font-weight-bold">{{item.count}}회</strong> <strong
                  class="font-weight-bold ml-1">구사 후 ARS 전환</strong>
                  <template v-if="item.id === 0">
                    (생략 후 ARS 전환 가능)
                  </template>
                  <template v-else>
                    (성희롱 외 <span class="is-txt-blue ml-1">복합유형 3회 구사</span>)
                  </template>
                </div>
              </div>
              <div class="step-wrap spacing-wrap sp-8 flex-column is-mt-m">
                <div
                  class="d-flex align-center"
                  v-for="tab, index in item.list"
                  :key="tab.id">
                  <span class="step-badge">STEP <span class="ml-1">{{ index + 1 }}</span></span>
                  <div class="d-flex justify-center ml-8 flex-column">
                    <p style="font-size: 16px;">{{ tab.text }}</p>
                    <span
                      v-if="tab.caution"
                      class="is-txt-blue"
                      style="font-size: 16px;">{{ tab.caution }}</span>
                  </div>
                </div>
              </div>
            </div>
          </v-tab-item>
        </v-tabs-items>

      </div>

    </div>
  </div>
</template>

<script>
import CompoTabItems from '@/components/CompoTabItems.vue';
export default {
  name: 'CompoResponseScript', //블랙컨슈머 응대 스크립트
  components: {
    CompoTabItems
  },
  data() {
    return {
      tabs1: null,
      tabsList1: [
        { title: '성희롱', content: '', badge: false},
        { title: '욕설 폭언', content: '', badge: false},
        { title: '반복억지', content: '', badge: false},
        { title: '민원요지 불분명', content: '', badge: false},
        { title: '사유 없는 콜백요청', content: '', badge: false},
        { title: '반말', content: '', badge: false},
      ],
      STEP_LIST_TAB: [
        // 성희롱
        {
          id: 0,
          count: 1,
          list: [
            { text: '고객님의 발언은 성희롱에 해당하므로 상담을 종료하고 ARS로 연결하겠습니다.', caution: '※ 경고 멘트 생략 후 ARS 전환 가능 ',},
          ]
        },
        // 욕설/폭언
        {
          count: 2,
          list: [
            { text: '고객님, 욕설(폭언)을 삼가하여 주십시오. 폭언(욕설)을 하실 경우 상담을 도와드리기 어렵습니다.', caution: ''},
            { text: '반복하여 폭언(욕설)하였으므로 상담을 종료하고 ARS로 연결하겠습니다. ', caution: '※ [욕설] 대신 사용가능한 단어 : 폭언, 비하발언, 모욕에 해당되는 발언, 협박에 해당하는 발언'}
          ]
        },
        // 반복억지
        {
          count: 3,
          list: [
            { text: '고객님, 문의하신 내용에 대해 앞서 모두 안내 드렸으며, 동일한내용 문의 시 상담을 도와드리기 어렵습니다. ', caution: ''},
            { text: '고객님, 문의하신 부분에 대해 추가로 안내드릴 사항은 없습니다.', caution: ''},
            { text: '문의하신 부분에 대해 더 이상 안내를 도와드리기 어려워 상담을 종료하고 ARS로 연결하겠습니다. ', caution: ''}
          ]
        },
        // 민원요지 불분명
        {
          count: 3,
          list: [
            { text: '고객님, 문의내용을 파악하기 어려운 경우 상담을 도와드리기 어렵습니다. 문의내용을 정확하게 말씀해 주십시오. ', caution: ''},
            { text: '다시한번 말씀드립니다. 고객님, 문의 내용을 정확히 말씀해주십시오.', caution: ''},
            { text: '정확한 문의 내용을 파악하기 어려워 상담을 종료하고 ARS로 연결하겠습니다.', caution: ''}
          ]
        },
        // 사유 없는 콜백요청
        {
          count: 3,
          list: [
            { text: '고객님, 문의내용 없이 콜백만 요청하실 경우 상담을 도와드리기 어렵습니다. ', caution: ''},
            { text: '다시한번 말씀드립니다. 고객님, 문의 내용이 없을 경우에는 콜백을 진행하기 어렵습니다. ', caution: ''},
            { text: '앞서 충분히 안내 드렸으므로 상담을 종료하고 ARS로 연결하겠습니다.', caution: ''}
          ]
        },
        // 반말
        {
          count: 3,
          list: [
            { text: '고객님, 반말을 삼가하여 주십시오. 반말을 하실 경우 상담을 도와드리기 어렵습니다. ', caution: ''},
            { text: '다시한번 말씀드립니다. 고객님, 반말을 삼가하여 주십시오. ', caution: ''},
            { text: '지속적으로 반말을 사용하였으므로 상담을 종료하고 ARS로 연결하겠습니다.', caution: ''}
          ]
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