<template>
  <div>
    <!-- 상담사 -->
    <div class="d-flex" style="position: relative;">
      <div style="flex: 0 0 40px">
        <img :src="DataProp.PROFILE.img" :alt="DataProp.PROFILE.name" style="width: 100%; border-radius: 50%;" @error="function(e){e.target.src=require('@/assets/img/@profile_user.png')}">
      </div>
      <div class="ml-4">
        <div >
          <strong style="font-size: 14px">{{ DataProp.PROFILE.name }}</strong>
          <span class="ml-1 is-txt-sub">{{ DataProp.PROFILE.grade }}</span>
          <strong class="ml-1">{{ DataProp.PROFILE.phone }}</strong>
        </div>
        <div class="">
          {{ DataProp.PROFILE.part }}
        </div>
      </div>
    </div>
    <div class="is-border-sub-top is-mt-m pt-3">
      <div>
        <!-- <v-icon class="pl-icon20 selectTool"></v-icon>
        <strong class="ml-1">담당업무</strong>
        <p style="white-space: pre-line;" class="is-mt-s px-5">
          {{ DataProp.desc }}
        </p> -->
        <div class="d-flex">
          <v-icon class="pl-icon20 calendar-place flex-shrink-0"></v-icon>
          <strong class="ml-1">
            {{ DataProp.place }}
          </strong>
        </div>
      </div>
      <!-- 지도 -->
      <div class="is-mt-s">
        <div class="rounded-lg">
          <v-textarea
            disabled
            class="pl-form is-noresize"
            value="주거복지본부장 수도권매입확대전략TFT 단장 (겸무)"
          />
        </div>
      </div>
    </div>
    <div class="pl-btn-wrap is-mt-m">
      <v-btn class="pl-btn is-icon is-line flex-grow-1">
        <v-icon class="pl-icon20 td-in-sms"></v-icon>
        연락처/주소 문자 보내기</v-btn>
    </div>
  </div>
</template>

<script>
export default {
  name: "CompoViewMap", //name은 'MENU_' + 파일명 조합
  components: {
  },
  props: {
    DataProp: {
      type: Object
    }
  },
  data() {
    return {

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