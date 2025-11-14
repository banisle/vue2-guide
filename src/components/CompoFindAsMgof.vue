<template>
  <div>
    <!-- search form -->
    <div class="pl-grid-top">
      <div class="pl-form-inline-wrap">
        <div class="pl-form-inline">
          <span class="pl-label">
            단지명
          </span>
          <div class="pl-desc">
            <v-text-field
              v-model="MGOF_NM"
              class="pl-form type-middle is-lg"
              placeholder="단지명 입력"
              @keydown.enter="searchMgofList()"
              >
            </v-text-field>
          </div>
        </div>
      </div>
      <div class="is-right spacing-wrap sp-4">
        <v-btn class="pl-btn is-icon flex-grow-0" 
        @click="searchMgofList()">
          <span class="pl-icon20 search"></span>
          조회
        </v-btn>
      </div>
    </div>
    <!-- temp grid -->
    <v-data-table
      class="pl-grid is-mt-s is-hover"
      :headers="headers"
      :items="MGOF_LIST"
      fixed-header
      item-key="index"
      height="330px"
      :items-per-page="ROW_PER_PAGE"
      @click:row="rowClick"
      @dblclick:row="rowDblClick"
      hide-default-footer
      no-data-text="등록된 데이터가 없습니다."
      >
      <!-- 단지 명 -->
      <template v-slot:item.FIELD_MGOF_NM="{ item }">
        <v-tooltip content-class="pl-tooltip " bottom>
          <template v-slot:activator="{ on, attrs }">
            <span
              v-bind="attrs"
              v-on="on">
            {{ item.FIELD_MGOF_NM }}</span>
          </template>
          <span>{{ item.FIELD_MGOF_NM }}</span>
        </v-tooltip>
      </template>

      <!-- COTIS 단지명 -->
      <template v-slot:item.COTIS_MGOF_NM="{ item }">
        <v-tooltip content-class="pl-tooltip " bottom>
          <template v-slot:activator="{ on, attrs }">
            <span
              v-bind="attrs"
              v-on="on">
            {{ item.COTIS_MGOF_NM }}</span>
          </template>
          <span>{{ item.COTIS_MGOF_NM }}</span>
        </v-tooltip>
      </template>

    </v-data-table>

  </div>
</template>

<script>
export default {
  name: 'CompoFindAsMgof',
  components: {
  },
  data() {
    return {
      MGOF_NM: '',
      MGOF_LIST: [],
      SEL_ROW: {},

      ROW_PER_PAGE: -1, //페이징 없이 전체 화면 뿌릴때
      // ROW_PER_PAGE: 14, //페이징 없이 전체 화면 뿌릴때

      headers: [
        { text: '번호', value: 'ROW_NUM', align: 'center', width: '50px', sortable: false },
        { text: '단지유형', value: 'MGOF_TP', align: 'center', width: '70px', sortable: false },
        { text: '단지코드', value: 'MGOF_CD',  width: '80px', sortable: false },
        { text: '현장단지명', value: 'FIELD_MGOF_NM',  width: '33%',sortable: false },
        { text: 'COTIS 단지명', value: 'COTIS_MGOF_NM',  width: '', sortable: false },
      ],
      items: [
        {
          index: 10,
          type1: '분양',
          type2: 'B21013008',
          type3: '',
          type4: '파주운정A28(한빛마을8)',
        },
        { index: 9, type1: '분양', type2: 'B10082526', type3: '가람마을', type4: '파주운정A28(한빛마을8)',  },
        { index: 8, type1: '분양', type2: 'B10082526', type3: '가람마을12단지 / 별숲오르트', type4: '파주운정A39BL(가람14)',  },
        { index: 7, type1: '분양', type2: 'B10082526', type3: '가람마을12단지 / 별숲오르트', type4: '파주운정A39BL(가람14)',  },
        { index: 6, type1: '분양', type2: 'B10082526', type3: '가람마을12단지 / 별숲오르트', type4: '파주운정A39BL(가람14)',  },
        { index: 5, type1: '분양', type2: 'B10082526', type3: '가람마을12단지 / 별숲오르트', type4: '파주운정A39BL(가람14)',  },
        { index: 4, type1: '분양', type2: 'B10082526', type3: '가람마을12단지 / 별숲오르트', type4: '파주운정A39BL(가람14)',  },
        { index: 3, type1: '분양', type2: 'B10082526', type3: '가람마을12단지 / 별숲오르트', type4: '파주운정A39BL(가람14)',  },
        { index: 2, type1: '분양', type2: 'B10082526', type3: '가람마을12단지 / 별숲오르트', type4: '파주운정A39BL(가람14)',  },
        { index: 1, type1: '분양', type2: 'B10082526', type3: '가람마을12단지 / 별숲오르트', type4: '파주운정A39BL(가람14)',  },
      ],

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
  methods: {
    //단지명 조회
    async searchMgofList() {
      this.MGOF_LIST = [];
      
      let postParam = {
        MGOF_NM : this.MGOF_NM,
      };
      let headParam = {head: {
        ns: 'lhcs.phone.as.dao.PhoneAsCommonMapper'
      }};
      const response = await this.common_postCall("/api/biz/common/select/selectMgofList", postParam, headParam);

      if (!response.HEADER.ERROR_FLAG) {
        this.MGOF_LIST = response.DATA;
      }
    },

    rowClick(item) {
      this.SEL_ROW = item;
    },

    //로우 더블클릭
    rowDblClick() {
      this.$emit("setItem", this.SEL_ROW);
    }
  },
};
</script>

<style lang="scss" scoped>

</style>