<template>
  <div style="display: contents">
    <div class="pl-quick-layer-header "><h1>직원 찾기</h1>
      <compo-tooltip-btn
        TitleProp="윈도우 팝업 열기"
        ClassProp="pl-tooltip-btn ml-1"
        IconProp="pl-icon20 openPop"
        TooltipPositionProp="bottom"
      ></compo-tooltip-btn>
      <compo-tooltip-btn
        TitleProp="닫기"
        ClassProp="pl-tooltip-btn"
        IconProp="pl-icon20 dialog-close"
        TooltipPositionProp="bottom"
        @btnClick="closeModal"
      ></compo-tooltip-btn>
    </div>
    <div
      style="flex: 0 0 calc(100% - 209px)"
      class="pl-quick-layer-body pa-0">
      <!-- search -->
      <div class="px-5 pt-3">
        <div class="pl-rounded-box ">
          <div class="pl-form-inline-wrap px-5 py-3 align-center">
            <v-select
              v-model="selectModel01"
              class="pl-form type-middle is-sm"
              :items="['전체']"
              placeholder="선택"
            ></v-select>
            <v-text-field
              class="pl-form type-middle"
              placeholder="부서명 입력" />
            <v-text-field
              class="pl-form type-middle is-sm"
              placeholder="이름 입력" />
            <v-checkbox
              class="pl-check"
              label="재직중"
              input-value="true"
            ></v-checkbox>
          </div>
          <div class=" px-5 py-3 is-border-top">
            <div class="pl-form-inline-wrap">
              <v-text-field
                class="pl-form type-middle flex-grow-1"
                placeholder="담당업무명 입력" />
              <v-text-field
                class="pl-form type-middle"
                placeholder="전화번호 입력" />
              <v-btn class="pl-btn">조회</v-btn>
            </div>
          </div>
        </div>
      </div>
      <!-- list top -->
      <div class="d-flex align-center is-mt-s px-5">
        <span class="pl-label">전체 (<span class="is-txt-blue">{{ MANAGER_LIST.length }}</span>)건</span>
        <!-- 정렬?? -->
        <compo-tooltip-btn
          TitleProp="정렬"
          ClassProp="pl-tooltip-btn ml-auto"
          IconProp="pl-icon20 sort-expand"
          TooltipPositionProp="bottom"
        ></compo-tooltip-btn>
        <compo-tooltip-btn
          TitleProp="새로고침"
          ClassProp="pl-tooltip-btn ml-1"
          IconProp="pl-icon20 refresh"
          TooltipPositionProp="bottom"
          ></compo-tooltip-btn>
      </div>
      <!-- list -->
      <div
        style="height: calc(100% - 171px);"
        class="is-mt-s pl-notice-list no-link is-border-top pl-scroll-body">
        <div
          :class="`pl-notice-list--unit ${ item.active ? 'selected' : ''}`"
          v-for="item in MANAGER_LIST"
          :key="item.id">
          <div class="d-flex">
            <img :src="item.img" :alt="item.name" style="max-width: 40px; max-height: 40px; border-radius: 50%;" @error="function(e){e.target.src=require('@/assets/img/@profile_user.png')}">
            <div class="ml-3" style="width: 100%;">
              <div class="d-flex align-center">
                <strong class="ml-1" style="font-size: 14px">{{ item.name }}</strong>
                <span class="ml-1 is-txt-sub">{{ item.job_type }}</span>
                <span class="ml-1">{{ item.phone }}</span>
                <!-- 전화 버튼 -->
                <compo-tooltip-btn
                  TitleProp="전화 걸기"
                  ClassProp="pl-tooltip-btn ml-1"
                  IconProp="pl-icon20 td-in-call-sm"
                  TooltipPositionProp="bottom"
                  :MinWidthProp=22
                  :HeightProp=22
                  @btnClick="mixin_showDialog('OutCall')"
                ></compo-tooltip-btn>

              </div>
              <div class="d-flex align-center">
                <v-icon class="pl-icon20 building"></v-icon>
                <span class="ml-1">{{ item.center }}</span>
              </div>
              <div class="d-flex align-center">
                <v-icon class="pl-icon20 selectTool-sm"></v-icon>
                <span class="ml-1">{{ item.part }}</span>
              </div>
              <div class="d-flex align-center">
                <v-icon class="pl-icon20 place-sm"></v-icon>
                <span
                  @click="mixin_showDialog('ViewMap')"
                  class="ml-1 hover-bg">{{ item.address }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>


    </div>
    <!-- footer -->
    <div class="pl-quick-layer-footer">
      <div class="pl-form-inline-wrap">
        <div class="pl-form-inline">
          <span class="pl-label">
            <v-icon class="pl-icon20 swap"></v-icon>
            <strong class="ml-1">전환</strong>
          </span>
          <div class="pl-desc">
            <v-text-field
              class="pl-form type-middle ml-1"
              value="031-3416-3766"
              :readonly="true"
            ></v-text-field>
          </div>
        </div>
      </div>
      <div class="pl-btn-wrap ml-auto">
        <v-btn class="pl-btn">전환시도</v-btn>
        <v-btn class="pl-btn is-trans">전환</v-btn>
        <v-btn class="pl-btn is-trans" @click="closeModal">전환 취소</v-btn>
      </div>
    </div>
     <!-- mark:// dialog: 전화걸기 -->
     <v-dialog
      v-model="dialogOutCall"
      content-class="dialog-draggable is-call"
      persistent
      no-click-animation
      hide-overlay>
      <div class="draggable-area">drag area</div>
      <compo-dialog
        header-title="전화 걸기"
        @hide="mixin_hideDialog('OutCall')"
      >
        <template slot="body">
          <!-- component -->
          <compo-out-call
            :DataProp="OUT_CALL_DATA"
          />
        </template>
        <template slot="footer">
          <ul class="pl-list-info mt-0">
            <li>고객 조회 후 연락처가 있는 경우 수신번호는 변경할 수 없습니다.</li>
          </ul>
        </template>
      </compo-dialog>
    </v-dialog>
     <!-- mark:// dialog: 지도 보기 -->
     <v-dialog
      v-model="dialogViewMap"
      content-class="dialog-draggable"
      persistent
      width="415"
      no-click-animation
      hide-overlay>
      <div class="draggable-area">drag area</div>
      <compo-dialog
        header-title="지도 보기"
        :FooterProp="false"
        @hide="mixin_hideDialog('ViewMap')"
      >
        <template slot="body">
          <!-- component -->
           <CompoViewMap :DataProp="map_data"/>

        </template>
        <template slot="footer">

        </template>
      </compo-dialog>
    </v-dialog>
  </div>
</template>

<script>
import CompoViewMap from '@/components/CompoViewMap'

export default {
  name: "SideFindManager", //name은 'MENU_' + 파일명 조합
  components: {
    CompoViewMap,
  },
  data() {
    return {
      // dialog 지도보기
      dialogViewMap: false,
      map_data: {
        PROFILE: {
          name: '김진아',
          grade: '주임',
          phone: '02-2169-8814',
          img: require('@/assets/img/@manager_profile_default.png'),
          part: '지사/경기남부본부/주거복지사업처/서울서북권주거복지사',
        },
        place: '(13637)경기도 성남시 분당구 성남대로 54번길 3 804호',
        desc: `★ 전화상담 조기 마감 업무담당자(17시 이후 전화연결 불가)
- 건설/매매임대, 집주인임대, 상가:갱신(재계약), 명의변경
- 담당단지: 구로구, 금천구
- [서울서부권지사(매입임대) 위착관리소 번호] 02-3666-0071(강서, 구로)`,
      },

      selectModel01: '전체',
      MANAGER_LIST: [
        {
          img: require('@/assets/img/@manager_profile2.png'),
          name: '최혜미',
          job_type: '기간직',
          phone: '031-3416-3766',
          center: '지사/경기남부본부/주거복지사업처/주거서비스팀',
          part: '서울전세사기 피해자 지원 업무(공공임대 우성공급 및 긴급주거지원 문의',
          address: '(13637)경기도 성남시 분당구 성남대로 54번길 3 804호',
        },
        {
          img: require('@/assets/img/@manager_profile_default.png'),
          name: '김진아',
          job_type: '기간직',
          phone: '031-3416-3766',
          center: '지사/경기남부본부/주거복지사업처/주거서비스팀',
          part: '경기전세사기 피해자 지원 업무(공공임대 우성공급 및 긴급주거지원 문의',
          address: '(13637)경기도 성남시 분당구 성남대로 54번길 3 804호',
        },
        {
          img: require('@/assets/img/@manager_profile_default.png'),
          name: '이한솔',
          job_type: '기간직',
          phone: '031-3416-3766',
          center: '지사/경기남부본부/주거복지사업처/주거서비스팀',
          part: '경기전세사기 피해자 지원 업무(공공임대 우성공급 및 긴급주거지원 문의',
          address: '(13637)경기도 성남시 분당구 성남대로 54번길 3 804호',
        },
        {
          img: require('@/assets/img/@manager_profile_default.png'),
          name: '서유람',
          job_type: '기간직',
          phone: '031-3416-3766',
          center: '지사/경기남부본부/주거복지사업처/주거서비스팀',
          part: '경기전세사기 피해자 지원 업무(공공임대 우성공급 및 긴급주거지원 문의',
          address: '(13637)경기도 성남시 분당구 성남대로 54번길 3 804호',
        },
        {
          img: require('@/assets/img/@manager_profile_default.png'),
          name: '백민주',
          job_type: '기간직',
          phone: '031-3416-3766',
          center: '지사/경기남부본부/주거복지사업처/주거서비스팀',
          part: '경기전세사기 피해자 지원 업무(공공임대 우성공급 및 긴급주거지원 문의',
          address: '(13637)경기도 성남시 분당구 성남대로 54번길 3 804호',
        },
        {
          img: require('@/assets/img/@manager_profile_default.png'),
          name: '이세연',
          job_type: '기간직',
          phone: '031-3416-3766',
          center: '지사/경기남부본부/주거복지사업처/주거서비스팀',
          part: '경기전세사기 피해자 지원 업무(공공임대 우성공급 및 긴급주거지원 문의',
          address: '(13637)경기도 성남시 분당구 성남대로 54번길 3 804호',
        },
      ],
      // 전화 걸기
      dialogOutCall: false,
      OUT_CALL_DATA: {
        dropItems: ['마이홈센터'],
        dropItems2: [],
        CUST_PHN_NO: '010-5303-0000',
      },
    }
  },
  methods: {
    closeModal(){
      this.$emit('Close')
    }
  },
  mounted() {
  },
  created() {
  },
  computed: {
  },
  watch: {
  },
};
</script>

<style lang="scss" scoped>

</style>