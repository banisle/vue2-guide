<template>
  <div>
    <!-- tree -->
    <div class="pl-tree-header">
      <div class="is-left"></div>
      <div class="is-right">
        <!-- <v-btn class="pl-btn is-sub is-sm" @click="setOgnzData">선택</v-btn> -->
        <v-btn class="pl-btn is-sub is-sm" @click="expandAll('treeDefault')">전체 펼치기</v-btn>
        <v-btn class="pl-btn is-sub is-sm" @click="collapseAll('treeDefault')">전체 접기</v-btn>
      </div>
    </div>
    <div class="pl-tree-body" style="height: 500px;">
      <v-treeview
        ref="treeDefault"
        :items="treeItems"
        activatable
        return-object
        :open.sync="treeOpenSync"
        @update:active="srch_tree_act"
        color="secondary"
        class="pl-tree-view"
      >
        <template v-slot:prepend="{ item, open }">
          <v-icon v-if="item.children.length > 0">
              {{open ? 'pl-icon20 tree-folder-open' : 'pl-icon20 tree-folder'}}
          </v-icon>
          <v-icon v-else>
              {{ 'pl-icon20 tree-file' }}
          </v-icon>
        </template>
        <template v-slot:label="{ item}">
          <span>{{ item.name }}<template v-if="item.LVL > 1">(<font color="blue">{{ item.id }}</font>)</template></span>
        </template>
      </v-treeview>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    ExpandedProp: {
      type: Boolean,
      default: true
    },
    SRCH_DEPT_KEY: {
      type: String
    },


  },
  data() {
    return {
      treeOpenSync: [],
      treeItems : [],
      activeItem:[],
      selectedNode: null,
    }
  },
  computed :{
  },

  created() {
    console.log("created");
    if( !this.mixin_isEmpty(this.SRCH_DEPT_KEY) ) {
      this.selectedNode = {};
      this.selectedNode.id = this.SRCH_DEPT_KEY;
    }
  },
  mounted() {
    console.log("mounted");
    this.getTreeList();
  },
  methods: {
    //조직 Tree 목록 조회
    async getTreeList() {
      let sURL ='/api/external/iprview/getGroupMaster';
      let postParam = {}
      let headParam = {}
      let response  = await this.common_postCall(sURL, postParam, headParam);
      if (!response.HEADER.ERROR_FLAG){
        //조직 Tree 데이터
        this.treeItems = await this.makeAcdGroupTreeData(response.DATA);
        if( this.selectedNode ) {
          // 조회전에 선택된 노드가 있다면 다시 Open & 선택 ::
          // 아래 순서 지켜야 노드 오픈되고 선택되어짐.
          await this.treeNodeOpenSelect( this.selectedNode.id );
          await this.treeNodeSelect( this.selectedNode.id );
        }else {
          //조회전에 선택된 노드가 없으면 1depth만 Open
          this.treeNodeOpenRoot();
        }
        console.log( this.SRCH_DEPT_KEY );
      }
    },

    async makeAcdGroupTreeData(array) {
      var map = {};
      for(let i = 0; i < array.length; i++){
          let obj = array[i];
          obj.id = obj.GROUP_ID;
          obj.name = obj.GROUP_NAME//{"id" : array[i]['ID'], "value" : array[i]['TEXT'] , "LVL" : array[i]['LVL']};
          obj.children = [];
          map[obj.id] = obj;
          let parent = obj.PRIOR_GRP_ID || '-';
          if(!map[parent]){
              map[parent] = {
                  children: []
              };
          }
          map[parent].children.push(obj);
      }
      return map['-'].children;
    },

    srch_tree_act(node){
      this.activeItem = node;
      this.selectedNode = this.activeItem[0];
      if(this.selectedNode === null){
        this.selectedNode = {};
      }
    },


    //root Tree Open
    treeNodeOpenRoot() {
      if(!!this.treeItems && this.treeItems.length > 0 && Number(this.treeItems[0]?.CHILD_CNT) > 0) {
        this.treeOpenSync = [{'id':this.treeItems[0].id}]
      }
    },
    treeNodeOpenSelect( key ) {
      // 해당키의 부모찾아서 Open
      let _tmpSelectNode = this.findNodeById( this.treeItems , key);
      if( _tmpSelectNode !== null && _tmpSelectNode.UP_KEY !== null && _tmpSelectNode.UP_KEY !== undefined && _tmpSelectNode.UP_KEY !== "" ) {
        this.treeOpenSync.push({'id': _tmpSelectNode.UP_KEY});
        this.treeNodeOpenSelect( _tmpSelectNode.UP_KEY );
      }
    },
    treeNodeSelect(key) {
      // 외부에서 해당키 찾아서 Active상태로 (select)
      try {
        this.$refs['treeDefault'].updateActive(key, true);
        this.$refs['treeDefault'].emitActive();
      } catch (e) {}
    },
    //트리 클릭 시 해당 row정보 세팅
    findNodeById(nodes, id) {
      for (let node of nodes) {
        if (node.id === id) {
          return node;
        }
        if (node.children && node.children.length > 0) {
          const foundNode = this.findNodeById(node.children, id);
          if (foundNode) {
            return foundNode;
          }
        }
      }
      return null;
    },
    expandAll(id){
      this.expanded = true;
      this.$refs[id].updateAll(true);
    },
    collapseAll(id){
      this.expanded = false;
      this.$refs[id].updateAll(false);
    },

    setAcdGroupSubmitData(){
      if(!this.mixin_isEmpty(this.selectedNode)){
        if(this.selectedNode.LVL === '1' && this.selectedNode.id !== '2025009523'/*시스템개발팀*/){
          this.showAlertCaution({msg: '하위 그룹을 선택해 주세요.'});
        }else{
          this.$eventBus.$emit("setAcdGroupTreeInfo", this.selectedNode);
          this.close();
        }
      }else{
        this.showAlertCaution({msg: '그룹을 선택해 주세요.'});
      }
    },
    close(){
      this.$emit('Close')
    }
  },
  destroyed() {
  },
  beforeDestroy() {
  },
  watch: {
    SRCH_DEPT_KEY() {
      this.selectedNode = {};
      this.selectedNode.id = this.SRCH_DEPT_KEY;
      this.getTreeList();
    }
  },
}
</script>

<style lang="scss" scoped>

</style>