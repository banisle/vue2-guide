<template>
  <div>
    <p>평가계획은 센터를 기준으로 수립할 수 있으며, 평가 계획에 설정한 문항 개수와 총점은 평가지에 문항 등록 시 적용됩니다. 평가 시행 후에는 수정/삭제할 수 없습니다. </p>
    
    <v-form ref="form">
      <div class="pl-form-inline-wrap vertical label-80 gap-8 is-mt-s">
        <div class="pl-form-inline">
          <span class="pl-label">
            평가지 제목
          </span>
          <div class="pl-desc">
            <v-text-field
              class="pl-form type-middle"
              placeholder="평가지명 입력"
              :rules="validateRules.PAPER_TITLE"
              v-model="QT_INFO.PAPER_TITLE"
              ref="tessss"
            />
          </div>
        </div>
        <div class="pl-form-inline">
          <span class="pl-label">
            평가 종류
          </span>
          <div class="pl-desc">
            <v-select
              class="pl-form type-middle"
              placeholder="선택"
            ></v-select>
          </div>
          <span class="pl-label">
            문제 배열
          </span>
          <div class="pl-desc">
            <v-select
              class="pl-form type-middle"
              placeholder="선택"
            ></v-select>
          </div>
        </div>
        <div class="pl-form-inline">
          <span class="pl-label">
            문항 개수
          </span>
          <div class="pl-desc">
            <v-text-field
              class="pl-form type-middle"
              type="number"
              :rules="validateRules.QSTN_CNT"
              v-model="QT_INFO.QSTN_CNT"
            />
          </div>
          <span class="pl-label">
            총 점수
          </span>
          <div class="pl-desc">
            <v-text-field
              class="pl-form type-middle"
              type="number"
              :rules="validateRules.TOT_SCORE"
              v-model="QT_INFO.TOT_SCORE"
            />
          </div>
        </div>
        <div class="pl-form-inline">
          <span class="pl-label">
            평가지 설명
          </span>
          <div class="pl-desc">
            <v-textarea
              class="pl-form is-noresize"
              :spellcheck="false"
              placeholder="평가지 설명 입력"
              height="150"
              :rules="validateRules.RMRK"
              v-model="QT_INFO.RMRK"
            />
          </div>
        </div>
      </div>
    </v-form> 
    
  </div>  
</template>

<script>

export default {
  name: 'QTM_M0100_DIALOG_DETAIL', //평가지 정보
  components: {
  },
  data() {
    return {
      modelYear: '2024',
      itemsYear: ['2024'],

    }
  },

  methods: {

  },
  mounted() {

    // 화면 


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