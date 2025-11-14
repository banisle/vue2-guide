<template>
  <button class="anim-btn raise" :style="StyleProp" @click="trigger()">
    <template v-if="!!DataProp.preIcon">
      <v-icon :class="DataProp.preIcon"></v-icon>
    </template>
    <span :class="!!DataProp.preIcon ? 'ml-2' : ''">{{ DataProp.title }}</span>
    <template v-if="!!DataProp.appendIcon">
      <v-icon :class="`${DataProp.appendIcon} ml-2`"></v-icon>
    </template>
  </button>
</template>

<script>
export default {
  name: "CompoAnimBtn", //name은 'MENU_' + 파일명 조합
  components: {
  },
  props: {
    StyleProp: {
      type: String,
    },
    DataProp: {
      type: Object,
    }
  },
  data() {
    return {

    }
  },
  methods: {
    trigger(){
      this.$emit('TriggerEvt')
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
};
</script>

<style lang="scss" scoped>
.anim-btn{
  position: relative;
  padding: 0 8px;
  background: #ff0771cf;
  border-radius: 4px;
  height: 30px;
  width: 120px;
  display: flex;
  align-items: center;
  color: #FFF;
  transition: 0.25s;
  box-shadow: 0 5px 5px -0.4em rgba(0,0,0,.3);

  &.raise:hover,
  &.raise:focus {
    box-shadow: 0 5px 5px -0.4em red;
    transform: translateY(-0.25em);
  }

  &:after{
    content: "";
    position: absolute;
    top: 1px;
    left: 1px;
    right: 1px;
    bottom: 1px;
    background: linear-gradient(90deg, white 50%, transparent 50%), linear-gradient(90deg, white 50%, transparent 50%), linear-gradient(0deg, white 50%, transparent 50%), linear-gradient(0deg, white 50%, transparent 50%);
    background-repeat: repeat-x, repeat-x, repeat-y, repeat-y;
    background-size: 8px 1px, 8px 1px, 1px 8px, 1px 8px;
    padding: 0 8px;
    border-radius: 4px;
    animation: border-dance 4s infinite linear;
  }
}
@keyframes border-dance {
  0% {
    background-position: 0px 0px, 116px 27px, 0px 27px, 116px 0px;
  }
  100% {
    background-position: 116px 0px, 0px 27px, 0px 0px, 116px 27px;
  }
}
</style>