<template>
  <div style="display: contents;">
    <template v-for="(item, index) in TabsList" >
      <v-tab
        v-if="item.title"
        :key="index"
        @click="activateTab(index, item)"
        @dblclick="item.dblclick ? dblclick() : ''"
        >
        <v-badge
          :value="item.badge"
          color="#0073ce"
          bordered
          offset-x="-1"
          offset-y="9"
          dot
          
        >
          {{ item.title }}
        </v-badge>
      </v-tab>
    </template>
    <slot name="search">

    </slot>
  </div>
</template>


<script>
export default {
  name: 'CompoTabItems',
  props: {
    TabsList: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      tabIndex: 0,
    }
  },
  create() {
    console.log("CompoTabItems created")
  },
  methods: {
    activateTab(index, item) {
      // console.log("🚀 ~ activateTab ~ index:", index)
      if(this.tabIndex == index && item.tabClickRefresh) {
        console.log("refreshTab", "refresh" + item.content)
        this.$eventBus.$emit("refresh" + item.content);
      }
      this.tabIndex = index
      this.$emit('update:leader_home_tab_index', index);
    },

    dblclick() {
      console.log("dblClickdblClickdblClickdblClick")
      this.$emit("layoutPopup", this.tabIndex);
    },
  }
};
</script>
