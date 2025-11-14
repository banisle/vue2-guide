<template>
  <div class="pl-scroll-body pl-card pt-0 spacing-wrap sp-8 flex-column" style="height: 315px;">
    <div

      class="pl-alarm-list-wrap is-noicon hover-blue"
      style="border-top: 0;">
      <div
        v-for="item in TALK_DATA_SEARCH_KMS"
        :key="item.kms_conts_id"
        class="pl-alarm-list pl-5"
        @click="$eventBus.$emit('openKnowledgeSlide', item.kms_conts_id)"
        >
        <div style="width: calc(100% - 50px);">
          <span class="pl-alarm-list-title">{{ item.kms_conts_nm }}</span>
          <span class="pl-alarm-list-desc">
            <div class="d-flex align-center">
              <v-icon class="pl-icon20 category-group"></v-icon> {{ item.kms_clsf_path }}
              <v-icon class="pl-icon20 date-simple ml-1"></v-icon> {{ mixin_convertDate(item.mdfcn_dt, 'yyyy-MM-dd') }}
            </div>
          </span>
        </div>
        <div>
          <v-icon class="pl-icon20 arrow-link"></v-icon>
        </div>
      </div>
    </div>
    <!-- no data -->
    <template v-if="TALK_DATA_SEARCH_KMS.length == 0">
      <div class="pl-list-nodata">
        <span>검색 결과가 없습니다.</span>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  name: "CompoRealTalkTab02", //name은 'MENU_' + 파일명 조합
  components: {
  },
  props: {
    KeywordProp: {
      type: Number,
    }
  },
  data() {
    return {
      KMS_LIST: []
    }
  },
  methods: {
  },
  mounted() {
  },
  beforeDestroy(){

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