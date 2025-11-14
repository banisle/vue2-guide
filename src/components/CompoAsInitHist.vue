<template>
  <div :class="isPopup ? 'pl-quick-layer-body pb-0' : ''">
    <!-- search form -->
    <div class="pl-grid-top">
      <div class="pl-form-inline-wrap">
        <div class="pl-form-inline">
          <span class="pl-label">
            지역본부
          </span>
          <div class="pl-desc">
            <v-select
              v-model="ARA_HDQ_CD"
              :items="ARA_HDQ_CD_LIST"
              disabled
              class="pl-form type-middle is-md"
              placeholder="선택"
            ></v-select>
          </div>
        </div>
        <div class="pl-form-inline">
          <span class="pl-label">
            단지명
          </span>
          <div class="pl-desc">
            <v-text-field
              v-model="MGOF_NM"
              disabled
              class="pl-form type-middle is-lg"
              placeholder="단지명 입력">
            </v-text-field>
          </div>
        </div>
        <div class="pl-form-inline">
          <span class="pl-label">
            동
          </span>
          <div class="pl-desc">
            <v-text-field
              v-model="BLDG_NO"
              class="pl-form type-middle is-xss"
              placeholder=""
              @keyup.enter="searchInitHist">
            </v-text-field>
          </div>
        </div>
        <div class="pl-form-inline">
          <span class="pl-label">
            AS 내용
          </span>
          <div class="pl-desc">
            <v-text-field
              v-model="FLW_CTS"
              class="pl-form type-middle is-lg"
              placeholder=""
              @keyup.enter="searchInitHist">
            </v-text-field>
          </div>
        </div>
        <div class="spacing-wrap sp-4">
          <v-btn class="pl-btn is-icon flex-grow-0" 
            @click="searchInitHist"
          >
            <span class="pl-icon20 search"></span>
            조회
          </v-btn>
          <!-- 툴팁 버튼 -->
          <compo-tooltip-btn
            TitleProp="동번호를 삭제 하시고 조회하시면 단지별 공용이력이 조회됩니다."
            ClassProp="pl-tooltip-btn"
            IconProp="pl-icon20 question"
            TooltipPositionProp="bottom"
          ></compo-tooltip-btn>
        </div>
      </div>
    </div>

    <!-- tabs -->
    <div class="is-border-bottom ">
      <v-tabs
        v-model="tabs1"
        class="pl-tabs is-noborder is-mt-s">
        <CompoTabItems :TabsList=tabsList1 class="mt-0" />
      </v-tabs>
    </div>
    <!-- content -->
    <div style="height: 100%" >
      <v-tabs-items
        v-model="tabs1"
        class="fill-height"
        style="background: transparent"
        >
        <div class="fill-height">
          <v-tab-item>
            <div
              :class="`fill-height tab-contents mt-2 TAB_NAME_CompoAsInitHist_TAB01`">
              <CompoAsInitHist_TAB01
                ref="refNewInitHist"
                :DataProp="{ARA_HDQ_CD: ARA_HDQ_CD, MGOF_CD: MGOF_CD, BLDG_NO: BLDG_NO, FLW_CTS: FLW_CTS}"
              />
            </div>
          </v-tab-item>
          <v-tab-item>
            <div
              :class="`fill-height tab-contents mt-2 TAB_NAME_CompoAsInitHist_TAB02`">
              <CompoAsInitHist_TAB02
                ref="refOldInitHist"
                :DataProp="{ARA_HDQ_CD: ARA_HDQ_CD, MGOF_CD: MGOF_CD, BLDG_NO: BLDG_NO, FLW_CTS: FLW_CTS}"
              />
            </div>
          </v-tab-item>
        </div>
      </v-tabs-items>
    </div>


  </div>
</template>

<script>
import CompoTabItems from '@/components/CompoTabItems.vue';
import CompoAsInitHist_TAB01 from '@/components/CompoAsInitHist_TAB01.vue'
import CompoAsInitHist_TAB02 from '@/components/CompoAsInitHist_TAB02.vue'

export default {
  name: 'CompoAsInitHist',
  components: {
    CompoTabItems,
    CompoAsInitHist_TAB01,
    CompoAsInitHist_TAB02,
  },
  props: {
    DataProp: {
      type: Object,
      default: () => {
        return {}
      }
    },
    isPopup: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {

      tabs1: 0,

      // tabsList1
      tabsList1: [
        { title: '(신)공용부 이력', content: 'CompoAsInitHist_TAB01', badge: true},
        { title: '(구)공용부 이력', content: 'CompoAsInitHist_TAB02', badge: false},
      ],


      ARA_HDQ_CD_LIST: [],

      ARA_HDQ_CD: '', //지역본부코드
      MGOF_CD: '',  //단지코드
      MGOF_NM: '',  //단지명
      BLDG_NO: '',  //동
      FLW_CTS: '',  //AS내용


    }
  },
  mounted() {
    if(this.ARA_HDQ_CD != '' && this.MGOF_CD != '') {
      this.searchInitHist();
    }
  },
  async created() {
    this.ARA_HDQ_CD = this.DataProp && this.DataProp.ARA_HDQ_CD ? this.DataProp.ARA_HDQ_CD : '';  //지역본부코드
    this.MGOF_CD = this.DataProp && this.DataProp.MGOF_CD ? this.DataProp.MGOF_CD : '';  //단지코드
    this.MGOF_NM = this.DataProp && this.DataProp.MGOF_NM ? this.DataProp.MGOF_NM : '';  //단지명
    this.BLDG_NO = this.DataProp && this.DataProp.BLDG_NO ? this.DataProp.BLDG_NO : ''; //동
    this.HS_NO = this.DataProp && this.DataProp.HS_NO ? this.DataProp.HS_NO : '';  //호

    this.mixinAsGetAsAraHdqCdList();
  },
  computed: {
  },
  watch: {
    tabs1() {
      setTimeout(() => {
        if(this.ARA_HDQ_CD != '' && this.MGOF_CD != '') {
          this.searchInitHist();
        }
      }, 200);
      
    }
  },
  methods: {
    getResponseData (response, strHeadText = '선택') {
      let responseData = [];
      if(!response.HEADER.ERROR_FLAG) {
          response.DATA.map(item => {
              responseData.push({text: item.CD_NM, value: item.CD})
          });
      }

      //전체, 선택 등 값이 있다면 추가.
      if (strHeadText != "" && strHeadText != undefined) {
          responseData.unshift({ text: strHeadText, value: "" });
      }
      return responseData;
    },


    //지역본부 목록 조회
    async getAsAraHdqCdList() {
        const postParam = {
        };
        const headParam = {head: {
          ns: 'lhcs.phone.as.dao.PhoneAsCommonMapper_Cotis'
        }};
        const response = await this.common_postCall("/api/biz/common/external/select/selectCotisAraHdqCdList", postParam, headParam);
        const responseData = this.getResponseData(response);
        return responseData;
    },

    searchInitHist() {
      if(this.tabs1 == 0) {
        this.$refs.refNewInitHist.searchNewInitHist();
      } else {
        this.$refs.refOldInitHist.searchOldInitHist();
      }
    }
  },
};
</script>

<style lang="scss" scoped>

</style>