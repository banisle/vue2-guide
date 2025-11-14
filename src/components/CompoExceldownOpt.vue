<template>
  <v-tooltip content-class="pl-tooltip bottom" bottom>
    <template v-slot:activator="{ on, attrs }">
      <v-menu
        v-model="dropExcelOpt"
        absolute
        offset-y
        :close-on-content-click=false
        :offset-x=true
        :nudge-right=22
        >
        <template v-slot:activator="{ on: menuOn, attrs: menuAttrs }">
          <v-btn
            v-bind="menuAttrs"
            v-on="menuOn"
            class="pl-tooltip-btn"
            min-width="22"
            height="22"
            plain
            >
            <v-icon
              v-bind="attrs"
              v-on="on"
              class="pl-icon20 exceldown"></v-icon>
          </v-btn>
        </template>

        <div class="pl-menu-drop pa-2">
          <div class="d-flex">
            <h3 style="font-size: 16px">다운로드 옵션 선택</h3>
            <v-btn
              @click="dropExcelOpt = false"
              plain
              min-width="22"
              height="22"
              class="pl-tooltip-btn ml-auto "
              >
              <v-icon
                small
                class="pl-icon20 dialog-close-black">
              </v-icon>
            </v-btn>

          </div>
          <div class="is-mt-l">
            <div class="pl-subdesc">
              <p>다운로드할 옵션을 선택 후 [다운로드] 버튼을 클릭하십시오</p>
            </div>
            <v-radio-group v-model="radioGroupSelected" class="is-mt-m">
              <v-radio
                v-for="(rad01, index) in radioGroup"
                :key="radioGroup[index].text"
                :label="rad01.text"
                :value="rad01.value"
                class="pl-radio type-box"
              >
              </v-radio>
            </v-radio-group>
          </div>
          <div class="pl-btn-wrap is-mt-l">
            <v-btn class="pl-btn is-trans ml-auto" @click="dropExcelOpt = false">닫기</v-btn>
            <v-btn class="pl-btn" @click="selectDown">다운로드</v-btn>
          </div>
        </div>
      </v-menu>
    </template>
    <span>엑셀 다운로드</span>
  </v-tooltip>
</template>

<script>
export default {
  name: 'CompoExceldownOpt', //엑셀 다운로드 옵션
  components: {
  },
  props:{
    RadioGroupProp:{
      type: Array
      , default: ()=>[]
    },
    DownReason: {
      type: Boolean,
      default: false
    },

  },
  data() {
    return {
      // 엑셀 다운로드 옵션
      dropExcelOpt: false,
      radioGroupSelected: "C",
      radioGroup: [
        { text: "현재 기준 다운로드", value: "C" },
        { text: "상세 기준 다운로드", value: "D" },
      ],

      downReason:'',
      headerColor: "EFF5FC",
    }
  },
  methods: {
    selectDown() {
      this.$emit('downloadSelected', this.radioGroupSelected);
      this.dropExcelOpt = false;
    },

    DownloadExcel_All_reasonChk(table_h, table_b, file_name, sheet_name, HeaderColorProp, DataNumProp, isMulti){
      if(this.DownReason && table_b.length > 0){
        this.showAlert({
            alertDialogToggle: true
            , downloadable: true
            , msg: '선택하신 정보를 다운로드 하시겠습니까?<br>다운로드 시 데이터 양에 따라 다소 시간이 소요 됩니다.'
            , iconClass: 'is-info'
            , type: 'confirm'
            , callYes: () => {
              let downReason = this.$store.getters['alertStore/GE_ALERT'].downReason;
              if(downReason) downReason = downReason.replace(/\s/g, '');

              if(this.mixin_isEmpty(downReason)){
                this.$store.getters['alertStore/GE_ALERT'].downReasonChk = true;
              }else{
                this.DownloadExcel_All(table_h, table_b, file_name, sheet_name, HeaderColorProp, DataNumProp, isMulti);
              }
            }
            , callNo: () => {
              this.$store.commit("alertStore/hideAlert");
            }
        });
      }else{
        this.$store.getters['alertStore/GE_ALERT'].downReason = '';
        this.DownloadExcel_All(table_h, table_b, file_name, sheet_name, HeaderColorProp, DataNumProp, isMulti);
      }
    },

    //엑셀 다운로드
    DownloadExcel_All(table_h, table_b, file_name, sheet_name, HeaderColorProp, DataNumProp, isMulti) {
      this.table_head = table_h;
      this.file_name = file_name;
      this.sheet_name = sheet_name;
      this.header_color = this.mixin_nvl(HeaderColorProp, this.headerColor);

      // 헤더에 없는 body filter
      let tempBodyObj = [];
      tempBodyObj = table_b.map(row=>{
        let tempBodyJson = {};
        if(isMulti){
          let headerKey = table_h[table_h.length-1].map(el=> {return el.value});
          for(let i in headerKey){
            tempBodyJson[headerKey[i]] = this.mixin_nvl(row[headerKey[i]], "");
          }
        }else{
         let headerKey = table_h.map(el=> {return el.value});
          for(let i in headerKey){
            tempBodyJson[headerKey[i]] = this.mixin_nvl(row[headerKey[i]], "");
          }
        }
        return tempBodyJson
      });

      this.table_body = DataNumProp ? table_b.slice(0,(parseInt(DataNumProp))) : tempBodyObj;

      if(table_b.length > 0){
        if(isMulti) this.mixin_common_exportExcel_all_multiHeader(this.table_head, this.table_body, this.file_name, this.sheet_name, this.header_color);
        else this.mixin_common_exportExcel_all(this.table_head, this.table_body, this.file_name, this.sheet_name, this.header_color);
      } 
    },
  },
  mounted() {
    
  },
  created() {
  },
  computed: {
  },
  watch: {
    dropExcelOpt(){
      if(this.dropExcelOpt){
        if(this.RadioGroupProp.length > 0) this.radioGroup = [...this.RadioGroupProp];
      }
    }
  },
};
</script>

<style lang="scss" scoped>

</style>