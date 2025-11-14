<template>
  <div style="flex: 1 1 calc(10%);">
    <slot name="title">
      <h3 v-if="TitleProp"
        class="pl-subtit is-h3">상담사 근무 현황</h3>
    </slot>
    <div
      :class="`${TitleProp ? 'is-mt-m' : ''}`"
      >
      <ul class="pl-list-info4">
        <li
          @click="selectPanel(index)"
          v-for="item,index in STAT"
          style="cursor: pointer; min-height: auto;"
          class="pt-0 pb-2"
          :class="{ active: selectedIndex === index }"
          :key="item.id">
          <span class="pl-list-info-title">
            <v-icon :class="`pl-icon20 ${ item.icon} `"></v-icon>
            <span class="ml-1">{{ item.title }}</span>
          </span>
          <div class="pl-list-info-desc mt-0">
            <strong>{{ item.count }}</strong>
            <span
              v-if="TypeProp === 'Dashboard'"
              style="font-weight: 400; font-size: 13px;">{{ item.per }} %</span>
          </div>

        </li>
      </ul>
    </div>

  </div>
</template>

<script>
export default {
  name: "HomeLeaderStatManager", //name은 'MENU_' + 파일명 조합
  components: {
  },
  props:{
    TitleProp: {
      type: Boolean,
      default: true
    },
    TypeProp: {
      Type: String,
      default: 'Dashboard'
    }
  },
  data() {
    return {
      STAT: [
        { active: false, title: '전체', count: 142, per: 59.1, icon: 'confirm2' },
        { active: false, title: '상담중', count: 42, per: 59.1, icon: 'manager-stat-cs' },
        { active: false, title: '대기중', count: 7, per: 3.4, icon: 'manager-stat-wait' },
        { active: false, title: '후처리', count: 59, per: 29.1, icon: 'manager-stat-work' },
        { active: false, title: '이석', count: 17, per: 8.3, icon: 'manager-stat-leave' },
        { active: false, title: '로그아웃', count: 35, per: 14.7, icon: 'manager-stat-logout' },
      ],
      selectedIndex: null,

    }
  },
  methods: {
    selectPanel(index){
      this.selectedIndex = index;
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