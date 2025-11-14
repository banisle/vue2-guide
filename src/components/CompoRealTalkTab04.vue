<template>
  <div class="pl-scroll-body pl-card " style="height: 315px;">
    <div class="pl-cols">
      <!-- 긍정 -->
      <div>
        <span class="pl-badge is-xl is-green">
          <v-icon class="pl-icon20 smile-positive"></v-icon>
          <span class="ml-1" style="line-height: 0;">긍정</span>
        </span>
        <div class="d-flex flex-column is-mt-s">
          <div
            class="d-flex px-3 py-2"
            v-for="item in POS_LIST"
            :key="item.id">
            <img
              :src="item.img"
              style="max-width: 30px; max-height: 30px; border-radius: 50%;" />
            <div class="flex-grow-1  ml-2">
              <div class="d-flex">
                <span class="ml-1 is-txt-sub">{{ item.date }}</span>
              </div>
              <div style="width: calc(100% - 140px)">
                {{ item.text }}
              </div>
            </div>
          </div>

        </div>
      </div>
      <!-- 부정 -->
      <div>
        <span class="pl-badge is-xl is-yellow">
          <v-icon class="pl-icon20 smile-negative"></v-icon>
          <span class="ml-1" style="line-height: 0;">부정</span>
        </span>
        <div class="d-flex flex-column is-mt-s">
          <div
            class="d-flex  px-3 py-2"
            v-for="item in NEG_LIST"
            :key="item.id">
            <img
              :src="item.img"
              style="max-width: 30px; max-height: 30px; border-radius: 50%" />
            <div class="flex-grow-1  ml-2">
              <div style="width: calc(100% - 140px)">
                {{ item.text }}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "CompoRealTalkTab04", //name은 'MENU_' + 파일명 조합
  components: {
  },
  data() {
    return {
      POS_LIST: [
        // { date: '2024-06-10 13:21:05', img: require('@/assets/img/@manager_profile_default.png'), text: '네에, 그렇겠군요. 친절한 안내 감사드립니다.' },
        // { date: '2024-06-10 13:25:38', img: require('@/assets/img/@manager_profile_default.png'), text: '상세한 안내해 주셔서 너무 감사해요' },
        // { date: '2024-06-10 13:25:38', img: require('@/assets/img/@manager_profile_default.png'), text: '너무너무 감사합니다.' },
      ],
      NEG_LIST: [
        { img: require('@/assets/img/@manager_profile_default.png'), text: '불편해서 죽겠어요' },
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