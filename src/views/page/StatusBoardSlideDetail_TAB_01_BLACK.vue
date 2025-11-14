<template>
  <div class="is-mt-s">
    <div class="pl-form-inline-wrap vertical label-80 gap-8">
      <div class="pl-form-inline">
        <span class="pl-label">
          임시 차단일
        </span>
        <div class="pl-desc">
          2024-06-20 16:35:40(한소미  - 마이홈센터 - 마이홈2팀)
        </div>
      </div>
      <div class="pl-form-inline">
        <span class="pl-label">
          차단유형
        </span>
        <div class="pl-desc">
          폭언, 반복억지, 민원요지 불분명
        </div>
      </div>

    </div>

    <div class="pl-form-inline-wrap vertical label-80 gap-8 is-border-sub-top pt-3 is-mt-s">
      <div class="pl-form-inline">
        <span class="pl-label">
          처리 구분
        </span>
        <div class="spacing-wrap sp-8 flex-column">
          <div style="display: grid; grid-template-columns: 240px 1fr; ">
            <v-radio-group
              v-model="radioGroupSelected"
              row
              class="pl-radio-group"
            >
              <v-radio
                v-for="(rad01, index) in radioGroup"
                :key="radioGroup[index].text"
                :label="rad01.text"
                :value="rad01.text"
                class="pl-radio"
              >
              </v-radio>
            </v-radio-group>
            <v-select
              class="pl-form type-middle flex-grow-1"
              placeholder="선택"
            ></v-select>
          </div>
          <div style="display: grid; grid-template-columns: 240px 1fr; ">
            <div class="spacing-wrap sp-8 align-center">
              <v-checkbox
                class="pl-check"
                input-value="true"
                label="휴게부여"
                >
              </v-checkbox>
              <v-text-field
                class="pl-form type-middle is-xs"
                suffix="분"
                value="20"
                />
            </div>
            <v-checkbox
              class="pl-check"
              label="심리상담 진행"
              input-value="false"
            ></v-checkbox>
          </div>
        </div>
      </div>

      <div class="pl-form-inline">
        <span class="pl-label">
          요청자
        </span>
        <div class="pl-desc">
          마이홈1팀 - 나팀장(2024-06-01 04:35:45)
        </div>
      </div>
    </div>
    
    <div class="pl-form-inline-wrap vertical label-80 gap-8 is-border-sub-top pt-3 is-mt-s">
      <div class="pl-form-inline">
        <span class="pl-label">
          처리결과
        </span>
        <div class="pl-desc">
          <span>정식차단 <strong class="is-txt-red">(7일)</strong></span>
          <span class="ml-4">
            <strong>차단기간</strong>(2023-06-21 ~ 2023-06-29)
          </span>
        </div>
      </div>
      <div class="pl-form-inline">
        <span class="pl-label">
          처리자
        </span>
        <div class="pl-desc">
          운영개발팀 - 나운영(2024-06-20 16:35:40)
        </div>
      </div>

      <div class="pl-form-inline">
        <span class="pl-label">
          기안자
        </span>
        <div class="pl-desc">
          <v-text-field
            class="pl-form type-middle"
            disabled
            />
          <v-text-field
            class="pl-form type-middle"
            disabled
            />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StatusBoardSlideDetail_TAB_01_BLACK', //배려고객 현황상세 - 처리정보
  components: {
  },
  data() {
    return {
      radioGroupSelected: "",
      radioGroup: [
        {
          text: "정식차단 요청",
        },
        {
          text: "철회 요청",
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