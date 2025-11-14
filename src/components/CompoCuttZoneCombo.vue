<template>
  <!--  폼 구분 - 상담영역 CUTT -->
  <div class="spacing-wrap sp-4" v-if="FormSeProp === 'CUTT'">
    <v-autocomplete
        v-model="SCH_CUTT_ZONE[0]"
        style="flex: 0 0 100px"
        class="pl-form"
        :items="mixin_getChildItems(ZONE_ORG_ITEMS, 0, 'ZONE', '','')"
        item-text="ZONE_NM"
        item-value="ZONE_ID"
        placeholder="선택"
        v-on:change="changeCuttZoneItems(0, true)"
        no-data-text="결과 없음"
        :disabled="DisabledProp"
    />
    <v-autocomplete
        v-model="SCH_CUTT_ZONE[1]"
        style="flex: 0 0 100px"
        class="pl-form"
        :items="mixin_getChildItems(ZONE_ORG_ITEMS, 1, 'ZONE', SCH_CUTT_ZONE[0],'')"
        item-text="ZONE_NM"
        item-value="ZONE_ID"
        placeholder="선택"
        v-on:change="changeCuttZoneItems(1, true)"
        no-data-text="결과 없음"
        :disabled="DisabledProp"
    />
    <v-autocomplete
        v-model="SCH_CUTT_ZONE[2]"
        style="flex: 0 0 160px"
        class="pl-form "
        :items="mixin_getChildItems(ZONE_ORG_ITEMS, 2, 'ZONE', SCH_CUTT_ZONE[1],'')"
        item-text="ZONE_NM"
        item-value="ZONE_ID"
        placeholder="선택"
        v-on:change="changeCuttZoneItems(2, true)"
        no-data-text="결과 없음"
        :disabled="DisabledProp"
    />
    <v-autocomplete
        v-model="SCH_ALL_CUTT_ZONE"
        class="pl-form is-auto"
        style="width: 250px"
        :items="computedZoneItem"
        v-on:change="changeCuttTypeSch(true)"
        placeholder="상담지역 검색"
        clearable
        no-data-text="결과 없음"
        :disabled="DisabledProp"
    />
    <compo-tooltip-btn
        TitleProp="상담메모에 적용"
        ClassProp="pl-tooltip-btn"
        IconProp="pl-icon20 edit-square"
        TooltipPositionProp="bottom"
        @btnClick="makeZoneStr"
        :MinWidthProp=22
        :HeightProp=22
        :DisabledProp="DisabledProp"
    ></compo-tooltip-btn>
  </div>
  <!--  폼 구분 - 검색영역 세로 SRCH_V-->
  <div class="pl-desc" v-else-if="FormSeProp ==='SRCH_V'">
    <div class="flex-column spacing-wrap sp-8">
      <v-autocomplete
          v-model="SCH_ALL_CUTT_ZONE"
          class="pl-form type-middle is-auto"
          :items="computedZoneItem"
          placeholder="지구명 검색"
          clearable
          v-on:change="changeCuttTypeSch(true)"
          no-data-text="결과 없음"
      />
      <v-autocomplete
          v-model="SCH_CUTT_ZONE[0]"
          class="pl-form type-middle is-auto"
          :items="mixin_getChildItems(ZONE_ORG_ITEMS, 0, 'ZONE', '','')"
          item-text="ZONE_NM"
          item-value="ZONE_ID"
          placeholder="선택"
          v-on:change="changeCuttZoneItems(0, true)"
          no-data-text="결과 없음"
      />
      <v-autocomplete
          v-model="SCH_CUTT_ZONE[1]"
          class="pl-form type-middle is-auto"
          :items="mixin_getChildItems(ZONE_ORG_ITEMS, 1, 'ZONE', SCH_CUTT_ZONE[0],'')"
          item-text="ZONE_NM"
          item-value="ZONE_ID"
          placeholder="선택"
          v-on:change="changeCuttZoneItems(1, true)"
          no-data-text="결과 없음"
      />
      <v-autocomplete
          v-model="SCH_CUTT_ZONE[2]"
          class="pl-form type-middle is-auto"
          :items="mixin_getChildItems(ZONE_ORG_ITEMS, 2, 'ZONE', SCH_CUTT_ZONE[1],'')"
          item-text="ZONE_NM"
          item-value="ZONE_ID"
          placeholder="선택"
          v-on:change="changeCuttZoneItems(2, true)"
          no-data-text="결과 없음"
      />
    </div>
  </div>
  <!--  폼 구분 - 검색영역 가로 SRCH-->
  <div class="pl-form-inline" v-else-if="FormSeProp ==='SRCH'">
    <div class="pl-desc">
      <v-autocomplete
          v-model="SCH_CUTT_ZONE[0]"
          class="pl-form type-middle"
          :items="mixin_getChildItems(ZONE_ORG_ITEMS, 0, 'ZONE', '','')"
          item-text="ZONE_NM"
          item-value="ZONE_ID"
          v-on:change="changeCuttZoneItems(0, true)"
          placeholder="선택"
          clearable
          no-data-text="결과 없음"
      />
      <v-autocomplete
          v-model="SCH_CUTT_ZONE[1]"
          class="pl-form type-middle"
          :items="mixin_getChildItems(ZONE_ORG_ITEMS, 1, 'ZONE', SCH_CUTT_ZONE[0],'')"
          item-text="ZONE_NM"
          item-value="ZONE_ID"
          placeholder="선택"
          clearable
          no-data-text="결과 없음"
          v-on:change="changeCuttZoneItems(1, true)"
      />
      <v-autocomplete
          v-model="SCH_CUTT_ZONE[2]"
          class="pl-form type-middle"
          :items="mixin_getChildItems(ZONE_ORG_ITEMS, 2, 'ZONE', SCH_CUTT_ZONE[1],'')"
          item-text="ZONE_NM"
          item-value="ZONE_ID"
          clearable
          placeholder="선택"
          no-data-text="결과 없음"
          v-on:change="changeCuttZoneItems(2, true)"
      />
      <v-autocomplete
          v-show="FormSeProp !=='SRCH'"
          v-model="SCH_ALL_CUTT_ZONE"
          class="pl-form type-middle is-lg"
          :items="computedZoneItem"
          placeholder="상담지역 검색"
          v-on:change="changeCuttTypeSch(true)"
          clearable
          no-data-text="결과 없음"
      />
    </div>
  </div>
  <div class="pl-form-inline-wrap vertical label-80 gap-8 is-mt-s" v-else-if="FormSeProp ==='REG'">
    <div class="pl-form-inline">
        <span class="pl-label">
          대분류
        </span>
      <div class="pl-desc">
        <v-autocomplete
            v-model="SCH_CUTT_ZONE[0]"
            class="pl-form type-middle"
            :items="mixin_getChildItems(ZONE_ORG_ITEMS, 0, 'ZONE', '','')"
            item-text="ZONE_NM"
            item-value="ZONE_ID"
            placeholder="선택"
            no-data-text="결과 없음"
            v-on:change="changeCuttZoneItems(0, true)"
        />
      </div>
    </div>
    <div class="pl-form-inline">
        <span class="pl-label">
          중분류
        </span>
      <div class="pl-desc">
        <v-autocomplete
            v-model="SCH_CUTT_ZONE[1]"
            class="pl-form type-middle"
            :items="mixin_getChildItems(ZONE_ORG_ITEMS, 1, 'ZONE', SCH_CUTT_ZONE[0],'')"
            item-text="ZONE_NM"
            item-value="ZONE_ID"
            placeholder="선택"
            no-data-text="결과 없음"
            v-on:change="changeCuttZoneItems(1, true)"
        />
      </div>
    </div>
    <div class="pl-form-inline">
        <span class="pl-label">
          소분류
        </span>
      <div class="pl-desc">
        <v-autocomplete
            v-model="SCH_CUTT_ZONE[2]"
            class="pl-form type-middle"
            :items="mixin_getChildItems(ZONE_ORG_ITEMS, 2, 'ZONE', SCH_CUTT_ZONE[1],'')"
            item-text="ZONE_NM"
            item-value="ZONE_ID"
            placeholder="선택"
            no-data-text="결과 없음"
            v-on:change="changeCuttZoneItems(2, true)"
        />
      </div>
    </div>
  </div>
</template>

<script>
import {eventBus} from "@/store/eventBus.js";

export default {
  name: "CompoCuttZoneCombo", //name은 'MENU_' + 파일명 조합
  components: {},
  props: {
    DataProp: {
      type: Array,
    },
    FormSeProp: {
      type: String,
    },
    DisabledProp: {
      type: Boolean,
    },
    ClearProp: {
      type: Boolean,
    },
    ValidRulProp: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      SCH_CUTT_ZONE: new Array(3), //상담지역 model
      SCH_ALL_CUTT_ZONE: this.mixin_isEmpty(this.DataProp) ? this.FormSeProp.startsWith("SRCH") ? ['', '', ''] : ['99999', '', ''] : this.DataProp.join(','), // 상담지역(검색)

      ZONE_ORG_ITEMS: [], // 원본 상담지역 데이터
      CUTT_ZONE_TREE: [], // 원본 상담지역 데이터 트리구조화
      CUTT_ZONE_ITEMS: [], // 가공된 상담지역 전체 데이터

      dataProp: this.DataProp,

      dupParam: {},

    }
  },
  beforeDestroy(){
    this.$eventBus.$off("setCuttZoneTxt"); //eventBus 중복방지를 위해 off
  },
  async created() {

    this.ZONE_ORG_ITEMS = await this.mixin_getCuttOrgItemList('cuttZone'); // 가공 전 상담지역 트리
    this.CUTT_ZONE_TREE = await this.mixin_makeOrgTreeData(this.ZONE_ORG_ITEMS, 'ZONE'); // 가공 후 트리
    this.CUTT_ZONE_ITEMS = await this.mixin_setIntgeSchData(this.CUTT_ZONE_TREE, 'ZONE', ''); // 모든 상담지역

    // this.SCH_ALL_CUTT_ZONE = this.SCH_CUTT_ZONE.join(',')

    this.$eventBus.$on("setCuttZoneTxt", () => {
      this.makeZoneStr();
    });

  },
  async mounted() {
    this.setCuttZone();
  },
  methods: {

    //상담지역 변경 이벤트
    changeCuttZoneItems(idx, emit) {
      this.SCH_CUTT_ZONE.forEach((cutt, seq) => {
        if (seq > idx) this.SCH_CUTT_ZONE[seq] = ''; //초기화
      });

      let selCuttZone = '';
      for (let k = 0; k < this.SCH_CUTT_ZONE.length; k++) {
        if (this.SCH_CUTT_ZONE[k]) selCuttZone += (selCuttZone ? ',' : '') + this.SCH_CUTT_ZONE[k];
      }

      // console.log("SCH_ALselCuttTypeselCuttTypeL_CUTT_ZONE .. > " + selCuttZone)

      this.SCH_ALL_CUTT_ZONE = selCuttZone;

      if (emit) this.$emit('EMIT_CUTT_ZONE', this.SCH_CUTT_ZONE)
    },
    changeCuttTypeSch(emit) {
      if (this.mixin_isEmpty(this.SCH_ALL_CUTT_ZONE)) {
        this.SCH_CUTT_ZONE.forEach((cutt, idx) => {
          this.SCH_CUTT_ZONE[idx] = ''; //초기화
        });
      }
      if (this.SCH_ALL_CUTT_ZONE) {
        this.SCH_ALL_CUTT_ZONE.split(',').forEach((cuttType, idx) => {
          for (let k = 0; k < this.SCH_CUTT_ZONE.length; k++) {
            if (k === idx) {
              this.SCH_CUTT_ZONE[k] = cuttType;
            } else if (k > idx) {
              this.SCH_CUTT_ZONE[k] = '';
            }
          }
        });
      }
      if (emit) this.$emit('EMIT_CUTT_ZONE', this.SCH_CUTT_ZONE)
    },
    setCuttZone() {

      if (!this.mixin_isEmpty(this.dataProp)) {

        this.SCH_CUTT_ZONE = this.dataProp
        this.SCH_ALL_CUTT_ZONE = this.dataProp.join(',')

      } else {
        if( this.FormSeProp.startsWith("SRCH") ){
          this.SCH_CUTT_ZONE = ['', '', ''];
          this.SCH_ALL_CUTT_ZONE = ''
        }else{
          this.SCH_CUTT_ZONE = ['99999', '99996', '-99996'];
          this.SCH_ALL_CUTT_ZONE = '99999,99996,-99996'
        }
      }
    },
    makeZoneStr() {
      if (!this.SCH_ALL_CUTT_ZONE) {
        this.showAlert({alertDialogToggle: true, msg: '상담지역을 선택하여 주십시오.', iconClass: 'is-info', type: 'default'});
        return;
      } else {
        let insertZone = '';
        if (this.SCH_ALL_CUTT_ZONE.split(',')[0] === '99999') {
          insertZone = '지역없음-';
        } else {
          this.CUTT_ZONE_ITEMS.forEach((zone, idx) => {
            if (zone.value === this.SCH_ALL_CUTT_ZONE) insertZone = (zone.text.replace(/선택안함/g, '').replace(/없음/g, '').replace(/>>/g, '').replace(/>/g, '/') + '-').replace(/\/-/g, '-');
          });
        }
        // console.log("만든 슽릥", insertZone)
        this.$emit('EMIT_ADD_CUTT_CN', insertZone)
      }
    },

  },
  computed: {
    computedZoneItem() {
      let returnData = []
      if (this.FormSeProp === 'CUTT') {
        returnData = this.CUTT_ZONE_ITEMS.filter(item => item.LVL > 3)
      } else {
        returnData = this.CUTT_ZONE_ITEMS
      }
      return returnData;
    },
  },
  watch: {
    DataProp() {
      this.dataProp = this.DataProp;
    },
    dataProp() {
      this.setCuttZone();
    },
    SCH_CUTT_ZONE() {
      // console.log("SCH_CUTT_ZONE", this.SCH_CUTT_ZONE)
    },
    DisabledProp() {
      if (this.DisabledProp && this.mixin_isEmpty(this.dataProp)) {
        this.SCH_ALL_CUTT_ZONE = ''
      }
    },
    ClearProp(){
      this.SCH_ALL_CUTT_ZONE = ''
      this.changeCuttTypeSch(true);
    }
  },
};
</script>

<style lang="scss" scoped></style>