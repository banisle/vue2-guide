<template>
  <div class="pl-container">
    <div class="pl-card-wrap">
      <!-- sub top -->
      <compo-sub-layout-top  NoBorderProp></compo-sub-layout-top>
      <!-- sub content -->
      <!-- tab -->
      <div class="is-border-bottom">
        <v-tabs v-model="tabs2" slider-size="2" class="pl-tabs px-5 is-noborder">
          <CompoTabItems :TabsList=tabsList2 >
          </CompoTabItems>
        </v-tabs>
      </div>
      <v-tabs-items v-model="tabs2">
        <div class="fill-height" style="height: calc(100vh - 191px)">
          <template v-for="(item, index) in tabsList2" >
            <v-tab-item :key="index">
              <div
                :class="`fill-height tab-contents`">
                <component :is="item.content"
                           :DataProp="dataProp"
                ></component>
              </div>
            </v-tab-item>
          </template>
        </div>
      </v-tabs-items>



    </div>



 </div>
</template>

<script>
import CompoTabItems from '@/components/CompoTabItems.vue';
import CSM_M0603_IA_TRANS from '@/views/page/CSM_M0603_IA_TRANS.vue'
import CSM_M0603_IA_TRANS_HST from '@/views/page/CSM_M0603_IA_TRANS_HST.vue'
import CSM_M0603_IA_DEL_HST from '@/views/page/CSM_M0603_IA_DEL.vue'

export default {
  name: "MENU_CSL_M0603", // SMS발송이력
  components: {
    CompoTabItems,
    CSM_M0603_IA_TRANS,
    CSM_M0603_IA_TRANS_HST,
    CSM_M0603_IA_DEL_HST,
  },
  data() {
    return {
      dataProp : {
        commonCode : [],
        centerList : [
          {text : '전체', value : ''},
          {text : '종합상담', value : '7111'},
          {text : '주거지원', value : '7112'},
          {text : '주거급여', value : 'CT30'},
          {text : '주거급여시스템', value : 'CTexc'},
          {text : '지역본부대면상담', value : '8000'},
          {text : '청약센터', value : 'CCT'},
          {text : '마이홈상담센터', value : 'DEP10'},
          {text : 'IVR', value : 'IVR'},
          {text : '콜봇', value : 'CALLBOT'},
        ],
        termTypeCd : [
          {text : '전체', value : ''},
          {text : '1년 초과', value : 'year'},
          {text : '1년 이하', value : 'year1'}
        ],
        msgTypeCd : [
          {text : '전체', value : ''},
          {text : 'SMS', value : '00'},
          {text : 'LMS', value : '10'}
        ],
        delUserType : [
          {text : '전체', value : ''},
          {text : '수동', value : 'M'},
          {text : '자동', value : 'A'}
        ],
        smsSenderNo : '',
      },
      // tab
      tabs2: null,
      tabsList2: [
        { title: '관심지역 발송', content: 'CSM_M0603_IA_TRANS', badge: false},
        { title: '발송 내역', content: 'CSM_M0603_IA_TRANS_HST', badge: false},
        { title: '삭제 내역', content: 'CSM_M0603_IA_DEL_HST', badge: false},
      ],




    }
  },
  mounted() {
  },

  async created() {
    let codeName = ['IAT']
    // this.dataProp.centerList = await this.mixin_getCenterCombo()
    this.dataProp.commonCode = await this.mixin_common_code_get_all(codeName);
    this.dataProp.smsSenderNo = await this.getSenderNo();
  },
  methods: {
    async getSenderNo(){
      let postParam = {
        IS_UNIQUE : 'Y',
        KEY : 'SMS_SENDER_NO'
      }
      let headParam = {
        head : {
          ns: 'lhcs.system.conf.dao.confMngMapper',
          sn: 'selectConf'
        }
      }
      const response = await this.common_postCall('/api/biz/common/select/selectConf', postParam, headParam)
      let senderNo = '';
      if( !response.HEADER.ERROR_FLAG){
        response.DATA.map(item=>{
          senderNo = String(item.VAL).slice(0, 4) + '-' + String(item.VAL).slice(4)
        })
      }
      return senderNo;
    }
  },
  computed: {

  },
  watch: {
  },
};
</script>

<style lang="scss" scoped>

</style>