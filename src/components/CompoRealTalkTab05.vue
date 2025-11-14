<template>
  <div class="pl-scroll-body  d-flex flex-column" style="height: 309px;">
    <div class="pl-cols flex-grow-1">
      <!-- 상담 내용 요약 -->
      <div class="is-col-fix pl-card" style="width: 50%">
        <span
          style="width: fit-content; height: 22px;"
          class="pl-round-chip is-bg-main is-txt-white ">상담 내용 요약 </span>
        <div
          style="white-space: pre-line; height: 154px"
          class="pl-rounded-box is-bg-light is-mt-m pa-3 pl-scroll-body">
          {{ SUMMARY }}
        </div>
      </div>
      <!-- 상담유형 자동 추천 -->
      <div class=" pl-scroll-body pl-card" style="height: 225px;">
        <span
          style="width: fit-content; height: 22px;"
          class="pl-round-chip is-bg-main is-txt-white ">상담유형 자동 추천
        </span>
        <div class="is-mt-m">
          <v-radio-group v-model="radioGroupSelected" class="is-mt-m">
            <v-radio
              v-for="(rad01, index) in TALK_DATA_SEARCH_CUTT"
              :value="rad01.id"
              class="pl-radio type-box"
            >
              <template v-slot:label>
                <span class="is-txt-main">추천{{ index+1 }}</span>
                <span class="ml-1">{{ rad01.text }}</span>
              </template>
            </v-radio>
          </v-radio-group>
        </div>
      </div>
    </div>
    <!-- btn  -->

     <div class="pl-btn-wrap is-border-sub-top py-2 mx-2 ">
       <v-btn class="pl-btn is-esp ml-md-0" @click="setSttAutoCuttInfo(1)">상담메모에 요약적용</v-btn>
       <v-btn class="pl-btn is-esp ml-auto" @click="setSttAutoCuttInfo(2)">상담유형에 추천유형적용</v-btn>
     </div>
  </div>
</template>

<script>
export default {
  name: "CompoRealTalkTab05", //name은 'MENU_' + 파일명 조합
  components: {
  },
  data() {

    return {
      SUMMARY: `
        문)
        답)
      `,
      modelCate01: '아파트임대',
      modelCate02: '국민임대',
      modelCate03: '분양정보(계획,공고일정 등)',

      radioGroupSelected: null,
      radioGroup: [],
    }
  },
  methods: {
    setSummary() {
      if( this.TALK_DATA_SEARCH_R1_SUMMARIZE !== undefined) {
        this.SUMMARY = '';
        if( !this.mixin_isEmpty(this.TALK_DATA_SEARCH_R1_NAME) ) this.SUMMARY = this.TALK_DATA_SEARCH_R1_NAME;
        if( !this.mixin_isEmpty(this.TALK_DATA_SEARCH_R1_PHONE) ) this.SUMMARY += ' ' + this.TALK_DATA_SEARCH_R1_PHONE;
        this.SUMMARY += '\n문) ' + this.TALK_DATA_SEARCH_R1_SUMMARIZE + '\n답) ' + this.TALK_DATA_SEARCH_T1_SUMMARIZE;
        console.log("this.SUMMARY::", this.SUMMARY);
      }
    },
    setSttAutoCuttInfo(tp) {
      let _this = this;

      if( tp == 2) {  //자동추천유형
        if (!this.mixin_isEmpty(this.radioGroupSelected)) {
          this.$eventBus.$emit('setSttAutoCuttInfo', {
            ALL_CUTT_TYPE: (this.radioGroupSelected).split(">")
          });
          this.showToastInfo({
            msg: '상담유형에 적용 하였습니다.', type: 'bottom', callAfter: () => {
              _this.$emit("Hide");
            }
          });
        } else {
          this.showToastCaution({msg: '추천상담 유형을 선택하세요.'});
        }
      }else { //상담요약 정보
        this.$eventBus.$emit('setSttAutoCuttInfo', {
          CUTT_CN: this.SUMMARY
        });
        this.showToastInfo({
          msg: '상담메모에 적용 하였습니다.', type: 'bottom', callAfter: () => {
            _this.$emit("Hide");
          }
        });
      }
    }

  },
  mounted() {
  },
  created() {
    this.setSummary();
  },
  computed: {
  },
  watch: {
    TALK_DATA_SEARCH_R1_SUMMARIZE() {
      this.setSummary();
    },
    TALK_DATA_SEARCH_T1_SUMMARIZE() {
      this.setSummary();
    },
  },
};
</script>

<style lang="scss" scoped>

</style>