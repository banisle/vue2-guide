<template>
  <div class="mt-0 spacing-wrap sp-8 flex-column">
    <template v-for="item, index in DRAG_LIST" >
      <div
        v-if="settingCsSupport[index] && settingCsSupport[index].switchValue"
        :key="item.id"
        class="pl-acco-box pa-0"
        style="display: block !important; height: auto !important;"
        >
        <div >
          <div
            :class="`pl-acco-box--title ${ item.link ? 'has-link' : ''} active-${ item.active }`"
            style="width: 100%;"
            @click="selectItem(item)"
            >
            <v-icon class="pl-icon20" :class="`pl-icon20 ${item.icon}`"></v-icon>
            <span class="ml-1">{{ item.title }}</span>
          </div>
          <template v-if="item.active">
            <!-- 임대주택 관리 현황 -->
            <div v-if="item.name === 'manageHouse'"
              class="pl-acco-box--content">
              <div class="pl-acco-box--content-box">
                <div class="pl-form-inline-wrap vertical label-80 gap-8">
                  <div class="pl-form-inline">
                    <span class="pl-label">
                      지구명
                    </span>
                    <div class="pl-desc">
                      <v-text-field
                        class="pl-form is-search type-middle is-auto"
                        placeholder="지구명 입력"
                        v-model="send_item.injectionObj.DSTRCT_NM"
                        @keydown.enter="mixin_openWindow( 'LayoutPopup', '1810', '853', send_item)"
                        >
                        <template v-slot:append>
                          <v-btn
                            @click.stop="mixin_openWindow( 'LayoutPopup', '1810', '853', send_item)"
                            class="pl-btn has-icon-only">
                            <span class="pl-icon20 in-search"></span>
                          </v-btn>
                        </template>
                      </v-text-field>
                    </div>
                  </div>
                  <div class="pl-form-inline">
                    <span class="pl-label">
                      단지명
                    </span>
                    <div class="pl-desc">
                      <v-text-field
                        class="pl-form type-middle"
                        placeholder="단지명 입력"
                        v-model="send_item.injectionObj.DANJI_NM"
                        @keydown.enter="mixin_openWindow( 'LayoutPopup', '1810', '853', send_item)"
                        >
                        <template v-slot:append>
                          <v-btn
                            @click.stop="mixin_openWindow( 'LayoutPopup', '1810', '853', send_item)"
                            class="pl-btn has-icon-only">
                            <span class="pl-icon20 in-search"></span>
                          </v-btn>
                        </template>
                      </v-text-field>
                    </div>
                  </div>
                  <!-- <div class="pl-form-inline">
                    <span class="pl-label">
                      주소
                    </span>
                    <div class="pl-desc">
                      <v-text-field
                        class="pl-form type-middle"
                        placeholder="주소 입력"
                      />
                    </div>
                  </div> -->
                </div>

              </div>
            </div>
            <!-- 음성봇 -->
            <div v-if="item.name === 'audioBot'"
              class="pl-acco-box--content">
              <div class="pl-acco-box--content-box">
                <ul class="flex-column ">
                  <li
                    class="d-flex aling-center py-2 px-2 hover-bold"
                    :class="index !== 0 && 'is-border-sub-top'"
                    v-for="link, index in item.link_list"
                    :key="link.id">
                    <span :to="item.link" class="is-txt-black" style="text-decoration: none" target="_blank">{{ link.title }}</span>
                    <v-icon class="pl-icon20 url-link ml-auto" @click="linkCallBot(link.menuId)"></v-icon>
                  </li>
                </ul>
              </div>
            </div>
            <!-- 만나이 계산기 -->
            <div v-if="item.name === 'ageCal'"
              class="pl-acco-box--content">
              <div class="pl-acco-box--content-box">
                <p>주민등록의 출생일을 직접입력하여 주십시오.</p>
                <div class="pl-form-inline-wrap is-mt-s">
                  <div class="pl-form-inline">
                    <span class="pl-label">
                      출생일
                    </span>
                    <div class="pl-desc">
                      <v-text-field
                        class="pl-form type-middle is-sm"
                        placeholder="예)19900527"
                        v-model="birthDate_"
                        oninput="this.value=this.value.replace(/[^0-9]/g,'')"
                      />
                    </div>
                  </div>
                  <div class="pl-form-inline">
                    <span class="pl-label">
                      기준일
                    </span>
                    <div class="pl-desc">
                      <v-text-field
                        class="pl-form type-middle is-sm"
                        placeholder="예)19900527"
                        v-model="toDate_"
                        oninput="this.value=this.value.replace(/[^0-9]/g,'')"
                      />
                    </div>
                    <v-btn class="pl-btn is-sub" @click="to_dateSet">오늘</v-btn>
                  </div>
                </div>
              </div>
              <!-- result -->
              <div
                v-if="toggleResultAge"
                class="d-flex align-center justify-center py-2 is-border-top"
                style="background: #EEE; font-size: 18px;" >
                만나이로&nbsp;<strong class="is-txt-blue">{{ REAL_AGE }}</strong>세입니다.
              </div>
              <!-- 버튼 -->
              <div class="pl-acco-box--content-footer spacing-wrap sp-4">
                <v-btn class="pl-btn is-trans " @click="resetCalRealAge">초기화</v-btn>
                <v-btn
                  class="pl-btn"
                  @click="CalRealAge()">
                  계산하기
                </v-btn>
              </div>
            </div>
            <div v-if="item.name === 'xiper'"
                 class="pl-acco-box--content">
              <div class="pl-acco-box--content-box">
                <div class="pl-form-inline-wrap vertical label-80 gap-8">
                  <div class="pl-form-inline">
                    <span class="pl-label">
                      키워드
                    </span>
                    <div class="pl-desc">
                      <v-text-field
                          class="pl-form is-search type-middle is-auto"
                          placeholder="검색어 입력"
                          v-model="xiper_item.keyword"
                          @keydown.enter="openPopXiper"
                      >
                        <template v-slot:append>
                          <v-btn
                              @click.stop="openPopXiper"
                              class="pl-btn has-icon-only">
                            <span class="pl-icon20 in-search"></span>
                          </v-btn>
                        </template>
                      </v-text-field>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </template>
        </div>
      </div>

    </template>

    <!-- dialog: 지역별 법무법인 안내 -->
    <v-dialog
      v-model="dialogLocalLawGuide"
      content-class="dialog-draggable is-lg"
      hide-overlay>
      <div class="draggable-area">drag area</div>
      <compo-dialog
        header-title="지역별 법무법인 안내"
        @hide="mixin_hideDialog('LocalLawGuide')"
      >
        <template slot="body">
          <!-- component -->
          <RightLocalLawGuide />
        </template>
        <template slot="footer">
          <v-btn class="pl-btn is-trans" @click="mixin_hideDialog('LocalLawGuide')">닫기</v-btn>
          <!-- v-btn class="pl-btn" @click="mixin_hideDialog('LocalLawGuide')">저장</!-->
        </template>
      </compo-dialog>
    </v-dialog>


  </div>
</template>

<script>
import RightLocalLawGuide from '@/views/page/RightLocalLawGuide'
import { mapGetters } from 'vuex';

export default {
  components: {
    RightLocalLawGuide,
  },
  data(){
    return{
      DRAG_LIST : [
        {
          name: 'manageHouse',
          title: '임대주택 관리 현황',
          icon: 'manage-house',
          active: true
        },
        {
          name: 'moneys',
          title: '소득자산 기준표',
          icon: 'moneys',
          link: this.openPopIncome
        },
        {
          name: 'calculate',
          title: '임대료 계산기',
          icon: 'calculate',
          link: this.openPopRentCalc
        },
        {
          name: 'rentHomeCal',
          title: '임대료인상률 계산기',
          icon: 'line-graph',
          link:  this.openPopRentHome
        },
        {
          name: 'rentHome',
          title: '지자체 임대사업 담장자 연락처',
          icon: 'calculate-num',
          link:  this.openPopRentHomeReg
        },
        {
          name: 'lawcenter',
          title: '지역본부별 법무법인 안내',
          icon: 'law-center',
          link: this.openDialog,
          dialogName: 'LocalLawGuide'
        },
        {
          name : 'personWorking',
          title: '공사 진행 현황',
          icon: 'person-working',
          link: this.openPopConPgrs
        },
        {
          name : 'xiper',
          title: '전자 매뉴얼 시스템 (Xiper)',
          icon: 'folder-plus',
          link: this.openPopXiper ,
          active : true
        },
        {
          name: 'audioBot',
          title: '음성봇 안내',
          icon: 'audio-bot',
          active: false,
          link_list: [
            { title: '관심지구 알리미 서비스', link: '', menuId:'LH_IN_1XXXX'},
            { title: '인증서 안내 서비스', link: '', menuId:'LH_IN_23XXX' },
            { title: '증명서 발급 안내 서비스', link: '', menuId:'LH_IN_33XXX' },
            { title: '자동이체 생성방법 안내 서비스', link: '', menuId:'LH_IN_32XXX' },
            { title: '임대료 청구서 고지방식 변경 서비스', link: '', menuId:'LH_IN_25XXX' },
            { title: '해약절차 안내 서비스', link: '', menuId:'LH_IN_24XXX' },
            { title: '대출추천서 신청 안내 서비스', link: '', menuId:'LH_IN_21XXX' },
            { title: '임대료 안내 서비스', link: '', menuId:'LH_IN_22XXX' },
            { title: '법무법인 안내 서비스', link: '', menuId:'LH_IN_26XXX' },
          ],
        },
        {
          name: 'ageCal',
          title: '만나이 계산',
          icon: 'calculate-num',
          active: false
        },
        // {
        //   title: '원격지원 애니서포트',
        //   icon: 'remote-support',
        //   link: this.openLinkAnysupport
        // },
      ],

      toggleResultAge: false,
      REAL_AGE: 45,

      birthDate_: '',
      toDate_: '',


      // 임대료 계산기
      tabs2: null,
      radioGroupSelected: "변경 후 임대료",
      radioGroup: [
        { text: "변경 후 임대료", },
        { text: "변경 후 인상률", },
      ],
      // 지역별 법무법인 안내
      dialogLocalLawGuide: false,

      // 임대주택 관리현황
      send_item: {
        title: '임대주택 관리현황',
        compo_name: 'RightRentalManage',
        callback : 'getPopData',
        injectionObj:{
          DSTRCT_NM:'',   //입력받은 지구명
          DANJI_NM:'',    //입력받은 단지명
        }
      },
      // 소득자산 기준표
      assets_item: {
        title: '소득자산 기준표',
        compo_name: 'RightAssetStat'
      },
      // 임대료 계산기
      rentcalc_item: {
        title: '임대료 계산기',
        compo_name: 'RightRentCalc'
      },

      xiper_item : {
        keyword : '',
      },


      setDate: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      int_todate: this.$moment(this.setDate).format('YYYYMMDD'), //


    }
  },
  computed: {
    ...mapGetters({
      settingCsSupport: 'commonStore/GE_COMMON_SETTING_CS_SUPPORT',
    }),
  },
  methods: {

    resetCalRealAge(){
      this.toDate_ = '';
      this.birthDate_ = '';
    },

    to_dateSet(){
      this.toDate_ = this.int_todate;
    },

    CalRealAge(){

      if(this.mixin_isEmpty(this.birthDate_) || (this.birthDate_.length < 8)){
        this.showAlert({
          alertDialogToggle: true,
          msg: '출생일을 입력 해주세요.',
          iconClass: 'is-caution',
          type: 'default'
        });
        return;
      }

      if(this.mixin_isEmpty(this.toDate_) || (this.toDate_.length < 8)){
        this.showAlert({
          alertDialogToggle: true,
          msg: '기준일을 입력 해주세요.',
          iconClass: 'is-caution',
          type: 'default'
        });
        return;
      }
      const birthYear = parseInt(this.birthDate_.substring(0, 4), 10);
      const birthMonth = parseInt(this.birthDate_.substring(4, 6), 10);
      const birthDay = parseInt(this.birthDate_.substring(6, 8), 10);
      const currentYear = parseInt(this.toDate_.substring(0, 4), 10);
      const currentMonth = parseInt(this.toDate_.substring(4, 6), 10);
      const currentDay = parseInt(this.toDate_.substring(6, 8), 10);

      let age = currentYear - birthYear;
      if (currentMonth < birthMonth) {
        age--;
      }else if (currentMonth === birthMonth && currentDay < birthDay) {
        age--;
      }
      this.REAL_AGE = age;
      this.toggleResultAge = true
    },
    // selected 효과
    selectItem(item) {
      if (typeof item.link === 'function') {
        item.link(item);
      }
      item.active = !item.active;
    },
    //임대료 인상률 계산기
    openPopRentHome(){
      let opt = 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=yes, resizable=no, copyhistory=no, width=600, height=900, top=0, left=500px, modal=yes'
      window.open('https://www.renthome.go.kr/webportal/minwon/common/rncrgAtmcCalc/rncrgAtmcCalcPopup.open', 'rentPop', opt);
    },
    //지자체 임대사업 담장자 연락처
    openPopRentHomeReg(){
      let opt = 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=yes, resizable=no, copyhistory=no, width=600, height=900, top=0, left=500px, modal=yes'
      window.open('https://www.renthome.go.kr/webportal/main/selectSfrndInqryPopup.open', 'rentRegPop', opt);
    },

    // 다이얼로그 호출
    openDialog(item){
      this.mixin_showDialog(item.dialogName)
    },

    // 소득자산 기준표
    openPopIncome(){
      this.mixin_openWindow( 'LayoutPopup', '1810', '900', this.assets_item)
    },
    // 임대료 계산기
    openPopRentCalc(){
      this.mixin_openWindow( 'LayoutPopup', '1200', '900', this.rentcalc_item)
    },

    openPopConPgrs() {
      this.mixin_openWindow( 'LayoutPopup', '1024', '800', {
        title: '공사 진행 현황',
        compo_name: 'CompoConPgrsSearch'
      })
    },
    //전자 매뉴얼 시스템
    openPopXiper(){
      let url = `http://172.30.115.122/xmms/webroot/main.do?userID=${this.user_id}`
      if(!this.mixin_isEmpty(this.xiper_item.keyword)){
        url += `&kwd=${encodeURIComponent(this.xiper_item.keyword)}`
      }
      let opt = 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=yes, resizable=no, copyhistory=no, width=600, height=900, top=0, left=500px, modal=yes'
      window.open(url, 'Xiper', opt);
    },
    // 원격지원 애니서포트
    openLinkAnysupport(){
      window.open('https://www.anysupport.net/home/')
    },

    //콜봇 안내
    linkCallBot(menuId){
      this.$eventBus.$emit('linkCallBot', menuId);
    }
  },

}
</script>

<style lang="scss" scoped>

</style>