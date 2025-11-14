<template>
<div class="pl-dialog-wrap">
  <slot name="header">
    <div class="pl-dialog-header">
      <h1>
        <img src="@/assets/img/lh_logo.png" alt="LH 주거복지정보">
        <span class="ml-2" v-html="headerTitle"></span>
      </h1>
      <div class="is-right">
        <template v-if="OpenPopProp">
          <compo-tooltip-btn
            TitleProp="윈도우 팝업"
            ClassProp="pl-tooltip-btn mr-1"
            IconProp="pl-icon20 openPop"
            TooltipPositionProp="bottom"
            @btnClick="mixin_openWindow( 'LayoutPopup', OpenPopEvt.width, OpenPopEvt.height , OpenPopEvt.callback )"
          ></compo-tooltip-btn>
        </template>
        <v-btn
          v-if="ForceProp"
          @click="$emit('hide')"
          plain
          min-width="30"
          height="30"
          class="pl-tooltip-btn pl-dialog-header-close"
          >
          <v-icon
            small
            class="pl-icon20 dialog-close-black">
          </v-icon>
        </v-btn>
      </div>
    </div>
  </slot>
  <div class="pl-dialog-search" v-if="SearchProp">
    <slot name="search">
      search
    </slot>
  </div>
  <div :class="`pl-dialog-body ${BodyClassProp}`" :style="BodyStyleProp">
    <slot name="body">
      body
    </slot>
  </div>
  <div class="pl-dialog-footer" v-if="FooterProp">
    <slot name="footer">
      <v-btn class="pl-btn is-trans" @click="$emit('hide')">닫기</v-btn>

    </slot>

  </div>
</div>
</template>

<script>
export default {
  name: 'CompoDialog',
  props: {
    SearchProp: {
      type: Boolean,
      default: false,
    },
    headerTitle: {
      type: String,
      default: '제목',
    },
    BodyStyleProp: {
      type: String,
    },
    BodyClassProp: {
      type: String,
      default: '',
    },
    FooterProp: {
      type: Boolean,
      default: true,
    },
    ForceProp: {
      type: Boolean,
      default: true,
    },
    OpenPopProp: {
      type: Boolean,
      default: false,
    },
    OpenPopEvt: {
      type: Object,
    }
  },
  data: () => ({
  }),
  created() {
  },
  mounted() {
  },
  beforeDestroy() {
  },
  methods: {
  }
};
</script>

<style>

</style>