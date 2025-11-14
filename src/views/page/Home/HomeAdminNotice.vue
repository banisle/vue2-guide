<template>
  <div>
    <div class="d-flex align-center">
      <strong class="pl-card-intop--title">공지사항</strong>
      <div class="d-flex align-center ml-auto">
        <compo-tooltip-btn
          TitleProp="더보기"
          ClassProp="pl-tooltip-btn ml-1"
          IconProp="pl-icon20 plus"
          TooltipPositionProp="bottom"
          :MinWidthProp=22
          :HeightProp=22
        ></compo-tooltip-btn>
      </div>
    </div>
    <div class="pl-rounded-box is-mt-s pr-5 pl-3 py-3" style="height: 155px;">
      <ul class="pl-list-dot is-no-border spacing-wrap sp-8 flex-column mt-0">
        <li
          @click="slideDaily = true"
          v-for="item in NOTICE_LIST"
          class="d-flex align-center hover-bold"
          :key="item.id">
          <span class="is-ellips" style="width: auto;">{{ item.subject }}</span>
          <span
            v-if="item.type_new"
            class="pl-badge is-new">N</span>
        </li>
      </ul>
    </div>

  </div>
</template>

<script>
export default {
  name: 'HomeAdminNotice', //공지사항
  components: {
  },
  data() {
    return {
      NOTICE_LIST: [
        { subject: '관심지역 알리미 등록 관련', type_new: true, },
        { subject: '정읍시 행복주택 예비입주자 모집_현장접 정읍시 행복주택 예비입주자 모집_현장접', type_new: true, },
        { subject: '정읍시 행복주택 예비입주자 모집_현장접 정읍시 행복주택 예비입주자 모집_현장접', type_new: false, },
        { subject: '정읍시 행복주택 예비입주자 모집_현장접 정읍시 행복주택 예비입주자 모집_현장접', type_new: false, },
        { subject: '정읍시 행복주택 예비입주자 모집_현장접', type_new: false, },
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