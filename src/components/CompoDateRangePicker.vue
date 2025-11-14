<template>
  <div class="pl-calendar-range-form" :style="ParentStyleProp">
    <compo-date-picker
      DateType="dateInput"
      :DateProp.sync="computedStartDateProp"
      :DisabledProp="DisabledProp"
      :StyleProp="styleProp"
      :ClassProp="ClassProp"
      />
    <span class="pl-unit">~</span>
    <compo-date-picker
      DateType="dateInput"
      :DateProp.sync="computedEndDateProp"
      :MinProp="dateMin()"
      :DisabledProp="DisabledProp"
      :StyleProp="styleProp"
      :ClassProp="ClassProp"
      />
    <compo-drop-picker
      v-if="IsViewDropPickerProp"
      :StartDateProp.sync="computedStartDateProp"
      :EndDateProp.sync="computedEndDateProp"
      :DisabledProp="DisabledProp"
      :RangeDropPicker="PickerRangeProp"
      :WidthProp="WidthProp"
      :HeightProp="HeightProp"
      :BbsDateProp="BbsDateProp"
    />
    <v-select
        v-if="selectTermProp"
        v-model="modelPickerDate"
        :items="itemsPickerDate"
        @change="()=>{
              let dt = mixin_getTermRange(modelPickerDate)
              this.$emit('update:StartDayProp', dt.startDt);
              this.$emit('update:EndDayProp', dt.endDt);
            }"
        class="pl-form type-middle is-sm ml-1"
    ></v-select>

    <v-select
        v-if="selectTermProp2"
        v-model="modelPickerDate"
        :items="itemsPickerDate2"
        @change="()=>{
              let dt = mixin_getTermRange(modelPickerDate)
              this.$emit('update:StartDayProp', dt.startDt);
              this.$emit('update:EndDayProp', dt.endDt);
            }"
        class="pl-form type-middle is-sm ml-1"
    ></v-select>
  </div>
</template>

<script>
  export default {
    name: 'CompoDateRangePicker',
    props: {
      StartDayProp: {
        type: String,
      },
      ClassProp: {
        type: String,
      },
      EndDayProp: {
        type: String,
      },
      DisabledProp: {
        type: Boolean
      },
      IsViewDropPickerProp: {
        type: Boolean,
        default: true
      },
      styleProp: {
        type: String,
      },
      ParentStyleProp: {
        type: String,
      },
      PickerRangeProp: {
        type: Array
      },
      HeightProp: {
        type: Number,
        default: 30
      },
      WidthProp: {
        type: Number,
        default: 30
      },
      selectTermProp: {
        type: Boolean,
        default: false
      },
      selectTermProp2: {
        type: Boolean,
        default: false
      },
      BbsDateProp:{
        type: Boolean,
        default: false
      }
    },
    data(){
      return{
        modelPickerDate: 'CUR_DAY',
        itemsPickerDate: [
          {text : '지정일', value : ''},
          {text : '당일', value : 'CUR_DAY'},
          {text : '전일', value : 'PREV_DAY'},
          {text : '일주일전', value : 'ONE_WEEK_AGO'},
          {text : '전월', value : 'PREV_MONTH'},
          {text : '전분기', value : 'PREV_QTR'},
          {text : '전년', value : 'PREV_YEAR'},
        ],
        itemsPickerDate2: [
          {text : '지정일', value : ''},
          {text : '당일', value : 'CUR_DAY'},
          {text : '1일전', value : 'PREV_DAY'},
          {text : '1주일전', value : 'ONE_WEEK_AGO'},
          {text : '1달전', value : 'PREV_MONTH'},
        ],
      }
    },
    methods: {
      // date input change 이벤트
      // dateChange(e){
      //   this.$emit('dateChange', e);
      // },
      startDayChange(e){
        this.$emit('startDayChange', e);
      },
      endDayChange(e){
        this.$emit('endDayChange',e);
      },
      dateMin() {
        // if(!this.StartDayProp) return '';
        // else{
        // }
        const minDate = new Date(
          new Date(this.StartDayProp).setDate(new Date(this.StartDayProp).getDate()) -
            new Date().getTimezoneOffset() * 60000
        )
          .toISOString().substr(0, 10);

        return minDate;
      },
    },
    computed: {
      computedStartDateProp: {
        get(){
          return this.StartDayProp;
        },
        set(newDate){
          console.log(" start ::: ", newDate)
          this.$emit("update:StartDayProp", newDate);
          this.startDayChange(newDate);
          if(this.selectTermProp || this.selectTermProp2) this.modelPickerDate = ''
        },
      },
      computedEndDateProp: {
        get(){
          return this.EndDayProp;
        },
        set(newDate){
          console.log(" end ::: ", newDate)
          this.$emit("update:EndDayProp", newDate);
          this.endDayChange(newDate);
          if(this.selectTermProp || this.selectTermProp2) this.modelPickerDate = ''
        },
      },
    },
  }
</script>

<style lang="scss" scoped>

</style>