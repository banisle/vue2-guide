<!-- eslint-disable vue/no-mutating-props -->
<template>
  <div class="pl-card " style="height: 300px;">
    <v-textarea
      class="pl-form is-noresize"
      :spellcheck="false"
      placeholder="해설을 입력 하세요"
      style="height: calc(100% - 20px)"
      v-model="DataProp[0].QSTN_EXPLAIN"
    />
    <ul class="pl-list-info">
      <li>해설은 4,000Byte(한글 2,000자) 까지 입력할 수 있습니다.</li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'QTM_M0100_DIALOG_MANAGE_TAB_02', //평가지 문항 관리 - 해설
  props:{
    DataProp: {
      type: Object
    },
    
  },
  components: {
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