<template>
   <div class="pl-setting-slide">
    <v-tabs
      hide-slider
      class="pl-tabs type-fill tab-grow is-mt-m"
      v-model="tab">
      <v-tab>UI 설정</v-tab>
      <!-- <v-tab v-if="$store.getters['userStore/GE_USER_ROLE'].atrtGroupId === '1' || $store.getters['userStore/GE_USER_ROLE'].atrtGroupId === '2'">기능 설정</v-tab> -->
      <v-tab>상담도구 설정</v-tab>
      <v-tab v-if="computedUserDetailType === 'CENTER_LEADER' || computedUserDetailType === 'SUPER_ADMIN' || computedUserDetailType === 'ETC_ADMIN'">센터 관리</v-tab>
      <!-- //mark: UI설정 -->
      <v-tab-item>
        <div>
          <h2 class="pl-subtit is-mt-l">테마 변경</h2>
          <p class="is-txt-sub mt-1">컬러 테마를 변경할 수 있습니다</p>

          <!-- mark: 컬러변경  -->
          <div class="pl-swatch-board is-mt-m pb-4">
            <span
              v-for="item in swatchThemes"
              :key="item.id"
              :style="`background-color: ${ item.color }; cursor: pointer; height: 40px; width: 40px; border-radius: 25px;`"
              :class="{ 'swatch-active': primaryColor === item.color }"
              @click="themeChange(item)"
            ></span>
            <div class="d-flex">
              <v-menu v-model="dropChgClr" bottom nudge-bottom="30" nudge-left="16" :close-on-content-click="false">
                <template v-slot:activator="{ on }">
                  <div class="pl-swatch-eyedropper">
                    <div :style="swatchStyle" v-on="on" />
                    <v-icon class="pl-icon20 color-picker"></v-icon>
                  </div>
                </template>
                <div>
                  <v-color-picker
                    v-model="chgClr"
                    flat
                    hide-inputs
                    mode="hexa" />
                </div>
              </v-menu>
            </div>
          </div>
          <!-- mark: 채팅창 글자 설정 -->
          <!-- <h2 class="pl-subtit is-mt-l">채팅창 글자 설정</h2>
          <p class="is-txt-sub mt-1">채팅창의 글자 크기를 변경할 수 있습니다</p>
          <div class="d-flex align-center col-12 pa-0 is-mt-l pb-2 pr-2">
            <v-icon class="pl-icon20 is-drag-icon-text mr-4 "></v-icon>
            <vue-slider
              v-model="chatFontSize"
              :min=10
              :max=18
              :interval=1
              width="calc(100% - 46px)"
              height="2px"
            />
          </div> -->
          <!-- mark: 전화상담 form 설정 -->
          <!-- <h2 class="pl-subtit is-mt-l d-flex">
            고객정보 유지
            <v-switch v-model="saveAftrCustMaintainYn" class="ml-auto">
            </v-switch>
          </h2>
          <p class="is-txt-sub mt-1">전화 상담내용 저장 후 고객 정보 유지 여부를 설정할 수 있습니다.</p> -->
          <!-- mark: 단축키 설정 -->
          <template v-if="settingKeyEnable">
            <h2 class="pl-subtit is-mt-l">단축키 설정</h2>
            <p class="is-txt-sub mt-1">자주쓰는 메뉴를 단축키에 할당 할 수 있습니다</p>
            <div class="is-mt-m">
              <div class="pl-form-inline-wrap" style="flex-wrap: wrap;">
                <div
                  class="pl-form-inline"
                  style="width: calc(50% - 12px); gap: 12px"
                  v-for="keybox in settingKey"
                  :key="keybox.id">
                  <span class="pl-label pt-0 d-flex align-center" style="flex: 0; width: 75px;">
                    <span class="pl-boxkey">ALT</span> +
                    <v-text-field
                      :value="keybox.keycode"
                      :disabled="keybox.lock === true"
                      class="pl-form"
                      style="flex: 0 0 30px"
                      maxlength="1"
                      @input="updateKeycode(keybox, $event)"
                      @focus="$event.target.select()"
                    />
                  </span>
                  <div class="pl-desc">
                    <div class="d-flex">
                      <v-select
                        :value="shortcutSettingArr[keybox.id]"
                        :disabled="keybox.disabled"
                        class="pl-form flex-grow-1"
                        :items="shortcutSettingArr"
                        item-text="title"
                        item-value="path"
                        placeholder="선택하세요"
                        @input="updatePath(keybox, $event)"
                      ></v-select>
                      <!-- <v-text-field
                        :disabled="item.model === '/home'"
                        :value="item.model"
                        class="pl-form flex-grow-1"
                        :rules="[rules.required, rules.path]"
                        @input="updateModel(item, $event)"
                      /> -->
                      <!-- <v-btn
                        :disabled="keybox.lock === true"
                        class="pl-btn is-sub ml-2"
                        @click="setAssignKeycode(settingKey)"
                        >할당</v-btn> -->
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>

          <!-- mark: 전광판 설정 -->
          <template v-if="computedUserType !== 'ETC_ADMIN'">
            <h2 class="pl-subtit is-mt-l d-flex">
              미니 전광판 위치
            </h2>
            <p class="is-txt-sub mt-1">미니전광판의 위치와 색상을 변경할 수 있습니다.</p>
            <div class="pl-status-layoutbox is-mt-s">
              <div
                v-for="(item, index) in StatuseBoardList"
                :key="index"
                @click="SetPositonStatuseBoard(item)"
                :class="`type-${item.title} ${item.active ? 'selected' : ''}`"
                >
                <span class="pl-status-layoutbox--title">{{ item.text }}</span>
              </div>
            </div>
          </template>

          <!-- mark: 관심지역 표시  -->
          <template v-if="computedUserCenter !== '4'">
            <h2 class="pl-subtit is-mt-m d-flex is-border-sub-top pt-3">
              관심지역 표시
              <v-switch
                v-model="cuttFavoritHideShow"
                input-value="true"
                class="ml-auto">
              </v-switch>
            </h2>
            <p class="is-txt-sub mt-1">상담 메인 화면에 고객 관심지역 영역을 항상 표시합니다.</p>
          </template>

          <!-- mark: CTI 인입 전화 자동 받기 설정(TopArea.vue CTI 노출 조건과 동일)  -->
          <template v-if="computedUserCenter !== '-1' && SOFT_PHN_USE_YN === 'Y' && $store.getters['userStore/GE_USER_ROLE'].EXT_NO">
            <h2 class="pl-subtit is-mt-m d-flex is-border-sub-top pt-3">
              CTI 인입 전화 자동 받기
              <v-switch
                v-model="ctiAutoDrwiYnHideShow"
                input-value="true"
                class="ml-auto">
              </v-switch>
            </h2>
            <p class="is-txt-sub mt-1">CTI 인입 전화 자동받기 설정을 할 수 있습니다.</p>
          </template>

          <!-- mark: 바로처리 상담업무 전환 표시  -->
          <template v-if="computedUserCenter === '4'">
            <!-- <div class="pl-cti-btns-move"  @click="dropCuttTaskMove = !dropCuttTaskMove">
              <span class="ml-2">{{dropCuttTaskMove}}{{ SELECTED_CUTT_TASK.text }}</span>
              <v-slide-y-transition>
                <div class="pl-drop-layer is-cti-move" v-if="dropCuttTaskMove === true" v-click-outside="closeDropCuttTaskMove">
                  <div class="pl-drop-layer-body">
                    <ul class="pl-drop-layer-list">
                      <li
                        v-for="item in CUTT_TASK_LIST"
                        :key="item.value"
                        @click="selectCuttTaskList(item)"
                        >
                        <span class="ml-2">{{ item.text }}</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </v-slide-y-transition>
            </div> -->
            <h2 class="pl-subtit is-mt-m d-flex pt-3">
              상담업무 전환
            </h2>
            <p class="is-txt-sub mt-1">클릭시 해당 상담 업무로 전환됩니다.</p>
            <div class="spacing-wrap sp-8 is-mt-s">
              <template v-for="item in CUTT_TASK_LIST">
                <span
                  :class="`pl-badge px-4 ${ item.active ? '': 'type-light hover-bold' } is-lg is-blue`"
                  @click="item.value !== computedUserDefaultCuttTask ? selectCuttTaskList(item) : ''"
                  :key="item.id"
                  >{{ item.text }}</span>
              </template>
            </div>
          </template>

          <!-- mark: 실시간 대화록(STT)  -->
          <!-- <h2 class="pl-subtit is-mt-m d-flex is-border-sub-top pt-3">
            실시간 대화록(STT)
            <v-switch
              input-value="true"
              class="ml-auto">
            </v-switch>
          </h2>
          <p class="is-txt-sub mt-1">전화 상담 시 고객의 음성을 텍스트로 실시간 표시합니다.</p> -->

          <!-- mark: 상담저장 후 CTI 상태  -->
          <!-- <h2 class="pl-subtit is-mt-m d-flex is-border-sub-top pt-3">
            상담저장 후 CTI 상태
            <v-select
              v-model="modelSaveCti"
              class="pl-form type-middle ml-auto flex-grow-0"
              :items="['저장 후 대기']"
              placeholder="선택"
            ></v-select>
          </h2>
          <p class="is-txt-sub mt-1">상담 저장 후 CTI의 기본 상태를 설정합니다.</p> -->


        </div>
      </v-tab-item>
      <!-- //mark: 기능 설정 -->
      <!-- <v-tab-item>
        <div>
          <template v-for="(setData, idx) in Object.keys($store.getters['commonStore/GE_CUSTCO_SETTING'])">
            <template v-if="$store.getters['userStore/GE_USER_ROLE'].atrtGroupId === '1' || $store.getters['userStore/GE_USER_ROLE'].atrtGroupId === '2'">
              <template v-if="$store.getters['userStore/GE_USER_ROLE'].userId === '1'"><!== 슈퍼 관리자인 경우==>
                <template v-if="setData === 'ENV_TMPL_TP'"><!==템플릿 변경==>
                  <h2 class="pl-subtit is-mt-l" :key="`${idx}_tmpl_h2`">{{ $store.getters['commonStore/GE_CUSTCO_SETTING'][setData].EXPSN_ATTR_NM }}</h2>
                  <p class="is-txt-sub mt-1" :key="`${idx}_tmpl_p`">{{ $store.getters['commonStore/GE_CUSTCO_SETTING'][setData].EXPSN_ATTR_EXPLN }}</p>
                  <div :key="`${idx}_tmpl_div`">
                    <v-select
                      v-model="$store.getters['commonStore/GE_CUSTCO_SETTING'][setData].ATTR_VL"
                      class="pl-form is-auto is-mt-s"
                      :items="itemsTemplateLayout"
                      placeholder="선택하세요"
                      @change="changeSetting($store.getters['commonStore/GE_CUSTCO_SETTING'][setData].EXPSN_ATTR_COL_ID, $store.getters['commonStore/GE_CUSTCO_SETTING'][setData].ATTR_VL.toString())"
                    ></v-select>
                  </div>
                  <div class="pl-template-layout-view is-mt-s" :key="`${idx}_tmpl_img`">
                    <img
                      :src="itemsTemplateLayout[($store.getters['commonStore/GE_CUSTCO_SETTING'][setData].ATTR_VL === 'DEFAULT'? 1 : 2) - 1].img"
                      :alt="itemsTemplateLayout[($store.getters['commonStore/GE_CUSTCO_SETTING'][setData].ATTR_VL === 'DEFAULT'? 1 : 2) - 1].text">
                  </div>
                </template>
                <template v-else-if="$store.getters['commonStore/GE_CUSTCO_SETTING'][setData].DATA_TYPE_CD === 'TXT'"><!==문자형==>
                  <h2 class="pl-subtit is-mt-l" :key="`${idx}_txt_h2`">{{ $store.getters['commonStore/GE_CUSTCO_SETTING'][setData].EXPSN_ATTR_NM }}</h2>
                  <div :key="`${idx}_txt_div`">
                    <v-text-field
                      v-model="$store.getters['commonStore/GE_CUSTCO_SETTING'][setData].ATTR_VL"
                      class="pl-form is-auto is-mt-s"
                      placeholder="입력하세요."
                      @change="changeSetting($store.getters['commonStore/GE_CUSTCO_SETTING'][setData].EXPSN_ATTR_COL_ID, $store.getters['commonStore/GE_CUSTCO_SETTING'][setData].ATTR_VL.toString())"
                    ></v-text-field>
                  </div>
                  <p class="is-txt-sub mt-1" :key="`${idx}_txt_p`" v-html="mixin_encodeEnter(mixin_replaceDoubleBackslashNewLine($store.getters['commonStore/GE_CUSTCO_SETTING'][setData].EXPSN_ATTR_EXPLN))"></p>
                </template>
                <template v-else><!==스위치형==>
                  <template v-if="setData === 'ENV_CUST_SIMPLE_CERT_USE_YN'"><!==본인인증(간편인증)==>
                    <template v-if="mixin_getCustcoSrvcStat('OMNIONE')">
                      <h2 class="pl-subtit is-mt-l d-flex" :key="`${idx}_switch_h2`">
                        {{ $store.getters['commonStore/GE_CUSTCO_SETTING'][setData].EXPSN_ATTR_NM }}
                        <v-switch
                          v-model="$store.getters['commonStore/GE_CUSTCO_SETTING'][setData].ATTR_VL"
                          class="ml-auto"
                          :ref="`${$store.getters['commonStore/GE_CUSTCO_SETTING'][setData].EXPSN_ATTR_COL_ID}`"
                          false-value="N"
                          true-value="Y"
                          @click="changeSetting($store.getters['commonStore/GE_CUSTCO_SETTING'][setData].EXPSN_ATTR_COL_ID, $store.getters['commonStore/GE_CUSTCO_SETTING'][setData].ATTR_VL.toString())"
                        >
                        </v-switch>
                      </h2>
                      <p class="is-txt-sub mt-1" :key="`${idx}_switch_p`">{{ $store.getters['commonStore/GE_CUSTCO_SETTING'][setData].EXPSN_ATTR_EXPLN }}</p>
                    </template>
                  </template>
                  <template v-else>
                    <h2 class="pl-subtit is-mt-l d-flex" :key="`${idx}_switch_h2`">
                      {{ $store.getters['commonStore/GE_CUSTCO_SETTING'][setData].EXPSN_ATTR_NM }}
                      <v-switch
                        v-model="$store.getters['commonStore/GE_CUSTCO_SETTING'][setData].ATTR_VL"
                        class="ml-auto"
                        :ref="`${$store.getters['commonStore/GE_CUSTCO_SETTING'][setData].EXPSN_ATTR_COL_ID}`"
                        false-value="N"
                        true-value="Y"
                        @click="changeSetting($store.getters['commonStore/GE_CUSTCO_SETTING'][setData].EXPSN_ATTR_COL_ID, $store.getters['commonStore/GE_CUSTCO_SETTING'][setData].ATTR_VL.toString())"
                      >
                      </v-switch>
                    </h2>
                    <p class="is-txt-sub mt-1" :key="`${idx}_switch_p`">{{ $store.getters['commonStore/GE_CUSTCO_SETTING'][setData].EXPSN_ATTR_EXPLN }}</p>
                  </template>
                </template>
              </template>
              <template v-else><!== 시스템 관리자인 경우(고객사 시스템 관리자 권한 사용자는 설정 가능) ==>
                <template v-if="setData === 'ENV_CLBK_YN' || setData === 'ENV_RESERVECALL_YN'"><!==콜백, 예약콜==>
                  <h2 class="pl-subtit is-mt-l d-flex" :key="`${idx}_h2`">
                    {{ $store.getters['commonStore/GE_CUSTCO_SETTING'][setData].EXPSN_ATTR_NM }}
                    <v-switch
                      v-model="$store.getters['commonStore/GE_CUSTCO_SETTING'][setData].ATTR_VL"
                      class="ml-auto"
                      :ref="`${$store.getters['commonStore/GE_CUSTCO_SETTING'][setData].EXPSN_ATTR_COL_ID}`"
                      false-value="N"
                      true-value="Y"
                      @click="changeSetting($store.getters['commonStore/GE_CUSTCO_SETTING'][setData].EXPSN_ATTR_COL_ID, $store.getters['commonStore/GE_CUSTCO_SETTING'][setData].ATTR_VL.toString())"
                    >
                    </v-switch>
                  </h2>
                  <p class="is-txt-sub mt-1" :key="`${idx}_p`">{{ $store.getters['commonStore/GE_CUSTCO_SETTING'][setData].EXPSN_ATTR_EXPLN }}</p>
                </template>
              </template>
            </template>
          </template>
        </div>
      </v-tab-item> -->
      <!-- 상담도구 설정 -->
      <v-tab-item>
        <div>
          <div v-for="(item, index) in settingCsSupport" :key="index" class="d-flex flex-column">
            <h2 class="pl-subtit is-mt-m d-flex is-border-sub-top pt-3">
              <v-icon :class="'pl-icon20 ' + item.icon"></v-icon>
              <span class="ml-1">{{ item.title }}</span>
              <v-switch
                v-model="item.switchValue"
                class="ml-auto"
                @change="() => csSupportChange(item, index)"
              ></v-switch>
            </h2>
            <div class="d-flex ml-6">
              <p class="is-txt-sub mt-1">{{ item.description }}</p>
            </div>
          </div>
        </div>
      </v-tab-item>

      <!-- 센터설정 -->
      <v-tab-item v-if="computedUserDetailType === 'CENTER_LEADER' || computedUserDetailType === 'SUPER_ADMIN' || computedUserDetailType === 'ETC_ADMIN'">
        <SettingSlideTabCenter />
      </v-tab-item>
    </v-tabs>
   </div>
</template>
<script>
import { mapGetters, mapState } from 'vuex';
import SettingSlideTabCenter from '@/views/page/SettingSlideTabCenter'

export default {
  name: 'SettingSlide',
  components: {
    tab : {type: Number , default: 0},
    SettingSlideTabCenter,
  },
  mixins: [],
  props: {

  },
  data() {
    return {
      list_common_code : [],
      // 컬러 변경 test
      dropChgClr: false,
      swatchThemes: [
        { color: '#1E6FDA' },
        { color: '#6A5493' },
        { color: '#003668' },
        { color: '#0CAA22' },
        { color: '#035C58' },

        { color: '#108195' },
      ],
      itemsTemplateLayout: [
        { text: '기본', value: 'DEFAULT', img: require('@/assets/img/layout01.png') },
        { text: '기타', value: 'ETC', img: require('@/assets/img/layout02.png') },
      ],
      // 단축키
      settingKeyEnable: false,
      shortcutSettingArr: [],
      // rules: {
      //   required: value => !!value || 'Required.',
      //   path: value => {
      //     const pattern = /\/[A-Z]{3}_[A-Z]\d{4}/g;
      //     return pattern.test(value) || '잘못된 형식입니다'
      //   },
      // },

      tab : 0,

      CUSTO_SETTING_LIST : [],

      // 상담저장 후 CTI 상태
      modelSaveCti: '저장 후 대기',

      CUTT_TASK_LIST : [], //바로처리 업무 구분
      SELECTED_CUTT_TASK : {}, //선택된 바로처리 업무
      switchFavoritValue : false, //관심지역 표시
    }
  },
  watch:{
    tab(){
      this.$nextTick(()=>{
        if(this.tab === 1){
          this.$eventBus.$emit('initSettingEnv');
        }
      });
    },

    computedUserCuttTaskList(){
      this.setCuttTaskList(); //바로처리 상담업무 목록
    }
  },
  beforeDestroy(){
  },

  async created() {
    if(this.computedUserCenter === '4'){
      this.setCuttTaskList(); //바로처리 상담업무 목록
    }
  },
  mounted() {
    this.formattedSettingKey();

  },
  computed: {
    ...mapGetters({
      primaryColor: 'commonStore/GE_COMMON_PRIMARYCOLOR',
      settingCuslForm: 'statStore/GE_SETTING_CUSL_FORM',
      StatuseBoardList: 'commonStore/GE_COMMON_SETTING_STATUSBOARD_LIST',
      settingCsSupport: 'commonStore/GE_COMMON_SETTING_CS_SUPPORT',
    }),
    swatchStyle() {
      const { chgClr, dropChgClr } = this;
      return {
        backgroundColor: chgClr,
        cursor: 'pointer',
        height: '40px',
        width: '40px',
        borderRadius: dropChgClr ? '4px' : '50%',
        transition: 'border-radius 200ms ease-in-out'
      }
    },
    chgClr: {
      get() {
        return this.$store.getters['commonStore/GE_COMMON_PRIMARYCOLOR'];
      },
      set(newColor) {
        this.$store.dispatch('commonStore/AC_CHANGE_PRIMARYCOLOR', newColor);
      },
    },
    chatFontSize: {
      get() {
        return this.$store.getters['commonStore/GE_COMMON_SETTING_FONTSIZE'];
      },
      set(size) {
        this.$store.dispatch('commonStore/AC_COMMON_SETTING_FONTSIZE', size);
      },
    },
    settingKey: {
      get() {
        return this.$store.getters['commonStore/GE_COMMON_SETTING_SHORTCUT'];
      },
      set(data) {
        // this.$store.dispatch('commonStore/AC_COMMON_SETTING_SHORTCUT', data);
      },
    },
    saveAftrCustMaintainYn: {
      get() {
        return this.$store.getters['userConfigStore/GE_SAVE_AFTR_CUST_MAINTAIN'];
      },
      set(val) {
        this.$store.dispatch('userConfigStore/AC_SAVE_AFTR_CUST_MAINTAIN', val);
      },
    },
    showStatusBoard: {
      get() {
        return this.$store.getters['commonStore/GE_COMMON_SETTING_STATUSBOARD'];
      },
      set(val) {
        this.$store.dispatch('commonStore/AC_COMMON_SETTING_IS_STATUSBOARD', val);
      },
    },
    showStatusMyBoard: {
      get() {
        return this.$store.getters['commonStore/GE_COMMON_SETTING_STATUSMYBOARD'];
      },
      set(val) {
        this.$store.dispatch('commonStore/AC_COMMON_SETTING_IS_STATUSMYBOARD', val);
      },
    },
    cuttFavoritHideShow: {
      get() {
        return this.$store.getters['commonStore/GE_COMMON_CUTT_FAVORIT_HIDE_SHOW'];
      },
      set(val) {
        this.$store.dispatch('commonStore/AC_COMMON_CUTT_FAVORIT_HIDE_SHOW', val);
      },
    },
    ctiAutoDrwiYnHideShow: {
      get() {
        return this.$store.getters['userStore/GE_AUTO_DRWI_YN'];
      },
      set(val) {
        this.$store.dispatch('userStore/AC_AUTO_DRWI_YN', {AUTO_DRWI_YN:val?'Y':'N'});
      },
    },
  },
  methods: {
    // 컬러 테마 변경
    themeChange(theme) {
      this.$store.dispatch('commonStore/AC_CHANGE_PRIMARYCOLOR', theme.color);
    },
    // 상담 도구 설정
    csSupportChange(item, index) {
      let csCnt = this.settingCsSupport.length;
      let oldCnt = 0;
      
      this.settingCsSupport.forEach((item, idx) => {
        if(item.name) oldCnt++;
      });

      console.log(csCnt, oldCnt)
      let updatedSupport = [];
      if(csCnt != oldCnt){
        updatedSupport = [
          {
            name: 'manageHouse',
            icon: "manage-house",
            title: "임대주택 관리 현황",
            description: "임대주택 관리 현황 조회를 사용합니다.",
            switchValue: true,
          },
          {
            name: 'moneys',
            icon: "moneys",
            title: "소득자산 기준표",
            description: "소득자산 기준표 조회를 사용합니다.",
            switchValue: true,
          },
          {
            name: 'calculate',
            icon: "calculate",
            title: "임대료 계산기",
            description: "임대료 계산기를 사용합니다.",
            switchValue: true,
          },
          {
            name: 'rentHomeCal',
            icon: "line-graph",
            title: "임대료인상률 계산기",
            description: "전국 지역본부별 관할지역 검색 기능을 사용합니다.",
            switchValue: true,
          },
          {
            name: 'rentHome',
            icon: "calculate-num",
            title: "지자체 임대사업 담장자 연락처",
            description: "지자체 임대사업 담장자 연락처 기능을 사용합니다.",
            switchValue: true,
          },
          {
            name: 'lawcenter',
            icon: "law-center",
            title: "지역본부별 법무법인 안내",
            description: "지역별 법무법인 안내 검색 기능을 사용합니다.",
            switchValue: true,
          },
          {
            name: 'personWorking',
            icon: "person-working",
            title: "공사 진행 현황",
            description: "LH청약플러스 부동산맵의 공사진행현황 정보를 조회합니다.",
            switchValue: true,
          },
          {
            name : 'xiper',
            icon: "folder-plus",
            title: "전자 메뉴얼 시스템(Xiper)",
            description: "전자 메뉴얼 시스템(Xiper) 기능을 사용합니다.",
            switchValue: true,
          },
          {
            name: 'audioBot',
            icon: "audio-bot",
            title: "음성봇 안내",
            description: "음성봇 안내 기능을 사용합니다.",
            switchValue: true,
          },
          {
            name: 'ageCal',
            icon: "calculate-num",
            title: "만나이 계산",
            description: "만나이 계산기 기능을 사용합니다.",
            switchValue: true,
          },
          // {
          //   icon: "remote-support",
          //   title: "원격지원 애니서포트",
          //   description: "",
          //   switchValue: true,
          // },
        ];
      }else{
        updatedSupport = [...this.settingCsSupport];
      }

      updatedSupport[index] = { ...item };

      this.$store.dispatch('commonStore/AC_COMMON_SETTING_CS_SUPPORT', updatedSupport);
    },
    // 단축키 설정
    updateKeycode(item, value) {
      item.keycode = value;
      // this.setAssignKeycode(this.settingKey);
    },
    updatePath(item, value) {
      item.path = value;
      // this.setAssignKeycode(this.settingKey);
    },
    /* setAssignKeycode(val){
      this.$store.dispatch('commonStore/AC_COMMON_SETTING_SHORTCUT', val);
    }, */
    formattedSettingKey() {
      const filteredSettingShortcut = this.$store.getters['commonStore/GE_COMMON_SETTING_SHORTCUT'];

      const mappedSettings = filteredSettingShortcut.map(item => {
        return {
          id: item.id,
          keycode: item.keycode,
          path: item.path,
          title: item.title,
          disabled: item.disabled,
        };
      });
      return this.shortcutSettingArr = mappedSettings;
    },

    //환경설정 셋팅 변경
    changeSetting(target, val){
      let response = this.common_postCall('/api/setting/env/updateSettingEnv', {EXPSN_ATTR_COL_ID: target, ATTR_VL: val}, {head: {}});
      this.mixin_push_custco_env(); //환경설정 정보 해당 스키마 사용자에게 PUSH
    },

    //전광판 표시 위치
    SetPositonStatuseBoard(panel){
      const panel_list = this.StatuseBoardList;

      for (let i = 0; i < panel_list.length; i++) {
        panel_list[i].active = false;
      }
      panel.active = true;

      return this.showStatusBoard = panel.title
    },

    //바로처리 상담업무 목록
    async setCuttTaskList(){
      //공통코드설정
      let codeName = ['CUTT_TASK_TP']; //바로처리 업무구분
      this.list_common_code = await this.mixin_common_code_get_all_global(codeName);

      //바로처리 업무 구분 목록
      let CUTT_TASK_LIST = this.mixin_common_code_get(this.list_common_code, 'CUTT_TASK_TP', '');

      this.CUTT_TASK_LIST = [];
      if(CUTT_TASK_LIST){
        console.log('this.computedUserCuttTaskList : ', this.computedUserCuttTaskList);
        CUTT_TASK_LIST.forEach((task, idx) => {
          Object.keys(this.computedUserCuttTaskList).forEach((userTask, seq) => {
            if(task.value === userTask && this.computedUserCuttTaskList[task.value] === 'Y'){
              task.active = task.value === this.computedUserDefaultCuttTask ? true : false;
              this.CUTT_TASK_LIST.push(task);
            }
          });
        });
      }
    },
    
    //바로처리 업무 구분 선택
    selectCuttTaskList(item){
      let sMsg = '<font color="blue"><b>'+item.text+'</b></font> 업무로 변경 하시겠습니까?';

      console.log('this.$store.getters["commonStore/GE_COMMON_TAB"].length : ', this.$store.getters["commonStore/GE_COMMON_TAB"], this.$store.getters["commonStore/GE_COMMON_TAB"].length);
      if(this.$store.getters["commonStore/GE_COMMON_TAB"].length > 1) sMsg = sMsg+'<br>열려있는 모든 탭이 닫힙니다.';

      this.showConfirmInfo({
        msg : sMsg
        , callYes : () => {
          this.$store.commit("userStore/MU_DEFAULT_CUTT_TASK", item.value);
          this.setCuttTaskList();
          this.$store.dispatch("commonStore/AC_COMMON_DELETE_ALL_TAB", ""); //모든 탭 닫기
          this.mixin_reloadCuttStat('CUTT_MONITOR_STAT'); //상담 모니터링 카운트 리로드
          window.location.reload(true);
          this.closeAlert();
        }
        , callNo : this.closeAlert
      });
      
    },
  },

};
</script>
<style scoped>

</style>