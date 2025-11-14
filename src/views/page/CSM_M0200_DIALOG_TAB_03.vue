<template>
  <div class="pl-card pl-scroll-body" style="height: 740px;">
    <div >
      <strong class="pl-bullet-txt is-blue">시스템 장애 </strong>
      <div class="is-mt-s">
        <v-textarea
          class="pl-form is-noresize"
          v-model="DAY_TASK.SYS_DSBLTY_RSN"
          :spellcheck="false"
          v-byte-counter="4000"
          :readonly="DAY_TASK.LAST_RPT_YN == 'Y' || isPreview"
        />
      </div>
    </div>

    <div class="is-mt-l">
      <strong class="pl-bullet-txt is-blue">교육</strong>
      <div class="is-mt-s">
        <v-textarea
          class="pl-form is-noresize"
          style="height: 200px;"
          v-model="DAY_TASK.EDU_CN"
          :spellcheck="false"
          v-byte-counter="4000"
          :readonly="DAY_TASK.LAST_RPT_YN == 'Y' || isPreview"
        />
      </div>
    </div>

  </div>
</template>

<script>
export default {
  name: 'CSM_M0200_DIALOG_TAB_03', //시스템 장애/교육 사항
  components: {
  },
  props:{
    DAY_TASK:{ 
      type: Object,
      default: {}
    },

    isPreview:{
      type:Boolean,
      default: false,
    },
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