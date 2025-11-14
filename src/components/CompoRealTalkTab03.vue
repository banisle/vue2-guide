<template>
  <div class="pl-scroll-body pl-card " style="height: 315px;">
<!--    <p class="">상담 중 태깅 하신 내역은 상담 종료 후, 일정 시간이 지나면 삭제되오니 참고하시기 바랍니다.</p>-->
    <div class="d-flex flex-column is-mt-s">
      <div
        class="d-flex px-3 py-2"
        v-for="item in TALK_DATA.filter((obj) => obj.isBmk === true)"
        :key="item.id">
        <img
          :src="item.img"
          :alt="item.name"
          style="max-width: 30px; max-height: 30px; border-radius: 50px;" />
        <div class="flex-grow-1  ml-2">
          <div class="d-flex">
            <strong class="">{{ item.name }}</strong>
            <span class="ml-1 is-txt-sub">{{ item.date }}</span>
            <div class="ml-auto">
              <v-icon class="pl-icon20 bookmark-fill"></v-icon>
              <span class="ml-1 is-txt-sub">{{ item.isBmkDate }}에 태깅</span>
            </div>
          </div>
          <div style="width: calc(100% - 140px)">
            {{ item.transcript }}
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  name: "CompoRealTalkTab03", //name은 'MENU_' + 파일명 조합
  components: {
  },
  data() {
    return {
      TALK_LIST: [],

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