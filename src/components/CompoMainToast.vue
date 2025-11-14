<template>
  <div class="mainToastWrap">
    <transition-group name="slide-y-reverse-transition" appear style="display: flex; flex-direction: column; gap: 8px">
      <div
        :class="`mainToast ${notification.class}`"
        v-for="(notification, index) in maintoast"
        :key="index"
        >
        <template >
          <v-icon style="margin-right: 10px;" dark>{{ notification.icon }}</v-icon>
        </template>
        {{ notification.msg }}
        <v-btn
          @click="closeMainToast(notification.id)"
          plain
          min-width="30"
          height="30"
          class="pl-tooltip-btn pl-dialog-header-close"
          style="margin-left: auto;"
          >
          <v-icon
            small
            class="pl-icon20 dialog-close">
          </v-icon>
        </v-btn>
      </div>
    </transition-group>
  </div>
</template>
<script>
import { mapState, mapMutations } from "vuex";
export default {
  name: "CompMainToast",
  data: () => ({}),
  computed: {
    ...mapState({
      maintoast: (state) => state.maintoastStore.maintoast,
    }),
  },
  methods: {
    closeMainToast(toastId) {
      this.$store.commit("maintoastStore/MU_DELTOAST", toastId);
    },
  },
};
</script>
<style lang="scss">
.mainToastWrap {
  position: fixed;
  top: 50px;
  right: 50px;
  z-index: 100;
}
.mainToast {
  width: 100%;
  min-width: 299px;
  display: flex;
  align-items: center;
  box-shadow: 0px 3px 5px -1px rgba(0, 0, 0, 0.2), 0px 6px 10px 0px rgba(0, 0, 0, 0.14), 0px 1px 18px 0px rgba(0, 0, 0, 0.12);
  border-radius: 25px !important;
  /* animation: slideUp 0.5s ease; */
  font-size: 15px;
  color: #FFF;
  background-color: #3f51b5;
  &.info{
    background-color: rgba(63 81 181 / 1);
  }
  &.success{
    background-color: rgb(26, 158, 86);
  }
  &.warning{
    background-color: rgba(255 45 16/ 1);
  }
}

.mainToastWrap .mainToast {
  padding: 9px 19px;
  border: 2px solid inherit;
  box-sizing: border-box;
}

@keyframes slideUp {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}
.slide-y-reverse-transition-enter-active,
.slide-y-reverse-transition-leave-active {
  transition: .3s cubic-bezier(.25, .8, .5, 1) !important
}
.slide-y-reverse-transition-move {
  transition: transform .6s
}
.slide-y-reverse-transition-enter,
.slide-y-reverse-transition-leave-to {
  opacity: 0;
  transform: translateY(15px)
}</style>