<template>
  <!--  폼 구분 - 상담영역 -->
  <div class="spacing-wrap sp-4" v-if="FormSeProp === 'CUTT'">
    <v-autocomplete
        v-model="SCH_CUTT_TYPE[0]"
        style="flex: 0 0 120px"
        class="pl-form"
        :items="mixin_getChildItems(CUTT_ITEMS, 0, 'CUTT_TYPE', '','')"
        item-text="CUTT_TYPE_NM"
        item-value="CUTT_TYPE_ID"
        placeholder="선택"
        v-on:change="changeCuttTypeItems(0, true)"
        no-data-text="결과 없음"
        :disabled="DisabledProp"
        auto-select-first
        :rules="ValidRuleProp ? validateRules.SCH_CUTT_TYPE_1 : validateRules.NO_RULE"
    />
    <v-autocomplete
        v-model="SCH_CUTT_TYPE[1]"
        style="flex: 0 0 120px"
        class="pl-form"
        :items="mixin_getChildItems(CUTT_ITEMS, 1, 'CUTT_TYPE', SCH_CUTT_TYPE[0],'')"
        item-text="CUTT_TYPE_NM"
        item-value="CUTT_TYPE_ID"
        placeholder="선택"
        v-on:change="changeCuttTypeItems(1, true)"
        no-data-text="결과 없음"
        :disabled="DisabledProp"
        auto-select-first
        :rules="ValidRuleProp ? validateRules.SCH_CUTT_TYPE_2 : validateRules.NO_RULE"
    />
    <v-autocomplete
        v-model="SCH_CUTT_TYPE[2]"
        style="flex: 0 0 200px"
        class="pl-form "
        :items="mixin_getChildItems(CUTT_ITEMS, 2,'CUTT_TYPE',  SCH_CUTT_TYPE[1],'')"
        item-text="CUTT_TYPE_NM"
        item-value="CUTT_TYPE_ID"
        placeholder="선택"
        v-on:change="changeCuttTypeItems(2, true)"
        no-data-text="결과 없음"
        :disabled="DisabledProp"
        auto-select-first
        :rules="ValidRuleProp ? validateRules.SCH_CUTT_TYPE_3 : validateRules.NO_RULE"
    />
    <v-autocomplete
        v-model="SCH_ALL_CUTT_TYPE"
        class="pl-form is-auto"
        style="width: 190px"
        :items="computedTypeItem"
        v-on:change="changeCuttTypeSch(true)"
        placeholder="상담유형 검색"
        clearable
        no-data-text="결과 없음"
        :disabled="DisabledProp"
        auto-select-first
        @input="onClear"
        :key="componentKey"
    />
    
  </div>
  <!--  폼 구분 - 검색영역 -->
  <div class="pl-desc" v-else-if="FormSeProp ==='SRCH'">
    <v-autocomplete  v-if="userCustcoId > 0"
        v-model="SCH_CUTT_TYPE[0]"
        class="pl-form type-middle"
        :items="mixin_getChildItems(CUTT_ITEMS, 0, 'CUTT_TYPE','', '')"
        item-text="CUTT_TYPE_NM"
        item-value="CUTT_TYPE_ID"
        v-on:change="changeCuttTypeItems(0, true)"
        placeholder="선택"
        no-data-text="결과 없음"
        auto-select-first
    />
    <v-autocomplete
        v-model="SCH_CUTT_TYPE[1]"
        class="pl-form type-middle"
        :items="mixin_getChildItems(CUTT_ITEMS, 1, 'CUTT_TYPE', SCH_CUTT_TYPE[0],'')"
        item-text="CUTT_TYPE_NM"
        item-value="CUTT_TYPE_ID"
        placeholder="선택"
        no-data-text="결과 없음"
        auto-select-first
        v-on:change="changeCuttTypeItems(1, true)"
    />
    <v-autocomplete
        v-model="SCH_CUTT_TYPE[2]"
        class="pl-form type-middle"
        :items="mixin_getChildItems(CUTT_ITEMS, 2, 'CUTT_TYPE', SCH_CUTT_TYPE[1],'')"
        item-text="CUTT_TYPE_NM"
        item-value="CUTT_TYPE_ID"
        placeholder="선택"
        no-data-text="결과 없음"
        auto-select-first
        v-on:change="changeCuttTypeItems(2, true)"
    />
    <v-autocomplete v-if="userCustcoId < 0"
        v-model="SCH_CUTT_TYPE[3]"
        class="pl-form type-middle"
        :items="mixin_getChildItems(CUTT_ITEMS, 3, 'CUTT_TYPE', SCH_CUTT_TYPE[2],'')"
        item-text="CUTT_TYPE_NM"
        item-value="CUTT_TYPE_ID"
        placeholder="선택"
        no-data-text="결과 없음"
        auto-select-first
        v-on:change="changeCuttTypeItems(3, true)"
    />
    <v-autocomplete
        v-model="SCH_ALL_CUTT_TYPE"
        class="pl-form type-middle is-lg"
        :items="computedTypeItem"
        placeholder="상담유형 검색"
        v-on:change="changeCuttTypeSch(true)"
        clearable
        no-data-text="결과 없음"
        auto-select-first
        v-if="VisbleSearchProp"
    />
  </div>
  <div class="pl-form-inline-wrap vertical label-80 gap-8 is-mt-s" v-else-if="FormSeProp ==='REG'">
    <div class="pl-form-inline">
        <span class="pl-label">
          대분류
        </span>
      <div class="pl-desc">
        <v-autocomplete
            v-model="SCH_CUTT_TYPE[0]"
            class="pl-form type-middle"
            :items="mixin_getChildItems(CUTT_ITEMS, 0, 'CUTT_TYPE','','')"
            item-text="CUTT_TYPE_NM"
            item-value="CUTT_TYPE_ID"
            placeholder="선택"
            no-data-text="결과 없음"
            auto-select-first
            v-on:change="changeCuttTypeItems(0, true)"
        />
      </div>
    </div>
    <div class="pl-form-inline">
        <span class="pl-label">
          중분류
        </span>
      <div class="pl-desc">
        <v-autocomplete
            v-model="SCH_CUTT_TYPE[1]"
            class="pl-form type-middle"
            :items="mixin_getChildItems(CUTT_ITEMS, 1, 'CUTT_TYPE', SCH_CUTT_TYPE[0],'')"
            item-text="CUTT_TYPE_NM"
            item-value="CUTT_TYPE_ID"
            placeholder="선택"
            no-data-text="결과 없음"
            auto-select-first
            v-on:change="changeCuttTypeItems(1, true)"
        />
      </div>
    </div>
    <div class="pl-form-inline">
        <span class="pl-label">
          소분류
        </span>
      <div class="pl-desc">
        <v-autocomplete
            v-model="SCH_CUTT_TYPE[2]"
            class="pl-form type-middle"
            :items="mixin_getChildItems(CUTT_ITEMS, 2, 'CUTT_TYPE', SCH_CUTT_TYPE[1],'')"
            item-text="CUTT_TYPE_NM"
            item-value="CUTT_TYPE_ID"
            placeholder="선택"
            no-data-text="결과 없음"
            auto-select-first
            v-on:change="changeCuttTypeItems(2, true)"
        />
      </div>
    </div>
  </div>
  <div class="pl-desc" v-else-if="FormSeProp ==='SRCH_DEPTH_1'">
    <div class="pl-desc">
      <v-autocomplete  v-if="userCustcoId < 0"
          v-model="SCH_CUTT_TYPE[1]"
          class="pl-form type-middle"
          :items="mixin_getChildItems(CUTT_ITEMS, 1,'CUTT_TYPE', SCH_CUTT_TYPE[0] ,SRCH_DEPTH_1_HEADTEXT)"
          item-text="CUTT_TYPE_NM"
          item-value="CUTT_TYPE_ID"
          placeholder="선택"
          no-data-text="결과 없음"
          auto-select-first
          v-on:change="changeCuttTypeItems(1, true)"
      />
      <v-autocomplete  v-else
          v-model="SCH_CUTT_TYPE[0]"
          class="pl-form type-middle"
          :items="mixin_getChildItems(CUTT_ITEMS, 0,'CUTT_TYPE', '',SRCH_DEPTH_1_HEADTEXT)"
          item-text="CUTT_TYPE_NM"
          item-value="CUTT_TYPE_ID"
          placeholder="선택"
          no-data-text="결과 없음"
          auto-select-first
          v-on:change="changeCuttTypeItems(0, true)"
      />
    </div>
  </div>

</template>

<script>
import {eventBus} from "@/store/eventBus.js";
import store from "@/store";


export default {
  name: "CompoCuttTypeCombo", //name은 'MENU_' + 파일명 조합
  components: {
    
  },
  props: {
    DataProp: {
      type: Array,
    },
    FormSeProp: {
      type: String,
    },
    CustcoProp: {
      type: String,
      default : '',
    },
    DisabledProp: {
      type: Boolean,
    },
    HeadTextProp: {
      type: Array,
      default: () => {
        return new Array(4)
      }
    },
    SRCH_DEPTH_1_HEADTEXT: {
      type: String,
      default : '',
    },
    ValidRuleProp: {
      type: Boolean,
      default: false
    },
    VisbleSearchProp:{
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      userCustcoId : store.getters['userStore/GE_USER_ROLE'].company.CD,
      SCH_CUTT_TYPE: Number(this.userCustcoId) < 0 ? new Array(4) : new Array(3), //상담유형 model
      SCH_ALL_CUTT_TYPE: this.mixin_isEmpty(this.DataProp) ? '' : this.DataProp.join(','), // 상담유형(검색)

      CUTT_ITEMS: [], // 원본 상담유형 데이터
      CUTT_ITEMS_TREE: [], // 원본 상담유형 데이터 트리구조화
      CUTT_TYPE_ITEMS: [], // 가공된 상담유형 전체 데이터

      dataProp: this.DataProp,
      componentKey: 0,

      dupParam: {},


      validateRules: {
        SCH_CUTT_TYPE_1 : [
          v => !!v || '필수 입력 항목 입니다.',
        ],
        SCH_CUTT_TYPE_2 : [
          v => !!v || '필수 입력 항목 입니다.',
        ],
        SCH_CUTT_TYPE_3 : [
          v => !!v || '필수 입력 항목 입니다.',
        ],
        NO_RULE : [
          v => true,
        ],
      },
    }
  },
  beforeDestroy(){
    this.$eventBus.$off("setCuttTypeTxt"); //eventBus 중복방지를 위해 off
  },
  async created() {
    console.log("SCH_ALL_CUTT_TYPE", this.SCH_ALL_CUTT_TYPE)

    this.$eventBus.$on("setCuttTypeTxt", () => {
      this.makeTypeStr();
    });

    this.init();

    if(this.userCustcoId < 0 && !this.mixin_isEmpty(this.CustcoProp)) {
      this.SCH_CUTT_TYPE = new Array(4);
      this.SCH_CUTT_TYPE[0] = this.CustcoProp;
    }

  },
  async mounted() {
    this.setCuttType();
  },
  methods: {
    async init(){
      this.CUTT_ITEMS = await this.mixin_getCuttOrgItemList('cuttType',this.mixin_isEmpty(this.CustcoProp) ? this.userCustcoId : this.CustcoProp); // 가공 전 상담유형 트리
      this.CUTT_ITEMS_TREE = await this.mixin_makeOrgTreeData(this.CUTT_ITEMS); // 가공 후 트리
      this.CUTT_TYPE_ITEMS = await this.mixin_setIntgeSchData(this.CUTT_ITEMS_TREE, 'CUTT_TYPE', ''); // 모든 상담유형
    },
    //상담유형 변경 이벤트
    changeCuttTypeItems(idx, emit) {
      // console.log("ids, emit", idx + '  ' + emit)
      this.SCH_CUTT_TYPE.forEach((cutt, seq) => {
        if (seq > idx) this.SCH_CUTT_TYPE[seq] = ''; //초기화
      });

      let selCuttType = '';
      for (let k = 0; k < this.SCH_CUTT_TYPE.length; k++) {
        if (this.SCH_CUTT_TYPE[k]) selCuttType += (selCuttType ? ',' : '') + this.SCH_CUTT_TYPE[k];
      }

      this.SCH_ALL_CUTT_TYPE = selCuttType;

      const selectedItem = this.CUTT_TYPE_ITEMS.filter(item => item.value == this.SCH_ALL_CUTT_TYPE)

      if (emit) this.$emit('EMIT_CUTT_TYPE', this.SCH_CUTT_TYPE, selectedItem.length == 1 ? selectedItem[0] : {})
    },
    // 자동완성 영역
    changeCuttTypeSch(emit) {
      if (emit) {
        this.SCH_CUTT_TYPE.forEach((cutt, idx) => {
          this.SCH_CUTT_TYPE[idx] = ''; //초기화
        });
      }
      if (this.SCH_ALL_CUTT_TYPE) {
        this.SCH_ALL_CUTT_TYPE.split(',').forEach((cuttType, idx) => {
          for (let k = 0; k < this.SCH_CUTT_TYPE.length; k++) {
            if (k === idx) {
              this.SCH_CUTT_TYPE[k] = cuttType;
            }
          }
        });
      }else{
        this.$set(this, 'SCH_CUTT_TYPE', Number(this.userCustcoId) < 0 ? new Array(4) : new Array(3));
      }
      if (emit) {
        const selectedItem = this.CUTT_TYPE_ITEMS.filter(item => item.value == this.SCH_ALL_CUTT_TYPE);
        this.$emit('EMIT_CUTT_TYPE', this.SCH_CUTT_TYPE, selectedItem.length == 1 ? selectedItem[0] : {});
      }
    },

    setCuttType() {
      console.log("this.dataProp 1 🤣 >> ", this.dataProp)
      if (!this.mixin_isEmpty(this.dataProp)) {

        this.SCH_CUTT_TYPE = this.dataProp
        this.SCH_ALL_CUTT_TYPE = this.dataProp.join(',')

      } else {
        this.SCH_CUTT_TYPE.forEach((cuttType, idx) => {
          this.SCH_CUTT_TYPE[idx] = '';
        });
        this.SCH_ALL_CUTT_TYPE = ''
      }
    },
    //상담정보 컴포넌트에 상담유형 FULL 텍스트 전달용
    makeTypeStr() {
      const selectedItem = this.CUTT_TYPE_ITEMS.filter(item => item.value == this.SCH_ALL_CUTT_TYPE)
      this.$emit('EMIT_CUTT_TYPE', this.SCH_CUTT_TYPE, selectedItem.length == 1 ? selectedItem[0] : {})
    },
    onClear(val){
      if( val === null ){
        console.log("초기화")
        this.componentKey++;
      }
    }

  },
  computed: {
    computedTypeItem(){
      let orgData = _.cloneDeep(this.CUTT_TYPE_ITEMS)
      let cuttType = this.SCH_CUTT_TYPE
      let returnData = []
      if (this.FormSeProp === 'CUTT'){
        console.log("sdasdasdasdasads >>>>> ")
        if(!this.mixin_isEmpty(this.CustcoProp)) returnData = orgData.filter(item => Number(item.CUSTCO_ID) === Number(this.CustcoProp))
        returnData = orgData.filter(item => item.LVL > 3)

        if (!this.mixin_isEmpty(cuttType)) {
          returnData = returnData.filter(item => {
            // value를 쉼표(,)로 분할하여 배열로 변환
            const splitdValue = item.value.split(',');
            // SCH_CUTT_TYPE의 모든 요소가 splitdValue 안에 포함되어야 함
            return cuttType.every(type => type && splitdValue.includes(type));
          });
        }

      } else {
        if (!this.mixin_isEmpty(this.CustcoProp)) {
          returnData = orgData.filter(item => Number(item.CUSTCO_ID) === Number(this.CustcoProp))
        } else {
          returnData = orgData
        }
        if (!this.mixin_isEmpty(this.SCH_CUTT_TYPE)) {
          returnData = returnData.filter(item => {
            // value를 쉼표(,)로 분할하여 배열로 변환
            const splitdValue = item.value.split(',');

            // SCH_CUTT_TYPE의 모든 요소가 splitdValue 안에 포함되어야 함
            return this.SCH_CUTT_TYPE.every(type => type && splitdValue.includes(type));
          });
        }
      }
      return returnData;
    },
  },
  watch: {
    DataProp() {
      this.dataProp = this.DataProp;
    },
    dataProp() {
      this.setCuttType();
    },
    DisabledProp(){
      if(this.DisabledProp && this.mixin_isEmpty(this.dataProp)){
        this.SCH_ALL_CUTT_TYPE = ''
      }
    },
    CustcoProp(){
      this.init();

      if(this.userCustcoId < 0 && !this.mixin_isEmpty(this.CustcoProp)) {
        this.SCH_CUTT_TYPE = new Array(4);
        this.SCH_CUTT_TYPE[0] = this.CustcoProp;
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>