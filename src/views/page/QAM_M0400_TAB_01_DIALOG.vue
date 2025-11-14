<template>
  <div>
    <div class="pl-card">
      <div class="pl-form-inline-wrap vertical label-80 gap-8">
        <div class="pl-form-inline">
          <span class="pl-label">
            총원
          </span>
          <div class="pl-desc ">
            <strong>{{ TOTAL_DATA.total }} 명</strong>
            <span class="spacing-wrap sp-4">
              (<span v-for="item in TOTAL_DATA.LIST" :key="item.id" class="pl-value-txt">
                {{ item.title }} <strong>{{ item.value }}</strong>,
              </span>)
            </span>
          </div>
        </div>
        <div class="pl-form-inline">
          <span class="pl-label">
            평가 제외
          </span>
          <div class="pl-desc d-block">
            <div class="d-flex">
              <strong class="is-txt-cyan">{{ EX_OUT.total }} 명</strong>
              <span class="spacing-wrap sp-4 ml-2">
                (<span v-for="item in EX_OUT.LIST" :key="item.id" class="pl-value-txt">
                  {{ item.title }} <strong>{{ item.value }}</strong>,
                </span>)
              </span>
            </div>
            <div class="d-flex">
              <strong class="is-txt-cyan">{{ EX_OUT.total2 }} 명</strong>
              <span class="spacing-wrap sp-4 ml-2">
                (<span v-for="item in EX_OUT.LIST2" :key="item.id" class="pl-value-txt">
                  {{ item.title }} <strong>{{ item.value }}</strong>,
                </span>)
              </span>
            </div>
          </div>
        </div>
        <div class="pl-form-inline">
          <span class="pl-label">
            평가 대상
          </span>
          <div class="pl-desc ">
            <strong class="is-txt-green">{{ EX_TARGET.total }} 명</strong>
            <span class="spacing-wrap sp-4">
              (<span v-for="item in EX_TARGET.LIST" :key="item.id" class="pl-value-txt">
                {{ item.title }} <strong>{{ item.value }}</strong>,
              </span>)
            </span>
          </div>
        </div>
      </div>
    </div>
    <!-- tab -->
    <v-tabs class="pl-tabs" >
      <v-tab>휴직/휴가</v-tab>
      <v-tab>근무일수 부족</v-tab>
      <v-tab>기타</v-tab>
      <v-tab-item >
        <div
          style="height: 300px;"
          class="pl-notice-list no-link pl-scroll-body">
          <div
            class="pl-notice-list--unit "
            v-for="item in REST_LIST"
            :key="item.id">
            <div class="d-flex align-center">
              <img :src="item.img" :alt="item.name" style="max-width: 35px; max-height: 35px" @error="function(e){e.target.src=require('@/assets/img/@profile_user.png')}">
              <div class="ml-3">
                <div>
                  <strong style="font-size: 14px">{{ item.name }}</strong>
                  <span class="ml-2 is-txt-sub">{{ item.center }}</span>
                </div>
                <div >
                  <span>{{ item.stat }}</span>
                  <span class="is-txt-bull px-1">&bull;</span>
                  <span>{{ item.date }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </v-tab-item>
      <v-tab-item >
        <div
          style="height: 300px;"
          class="pl-notice-list no-link pl-scroll-body">
          <div
            class="pl-notice-list--unit "
            v-for="item in REST_LIST2"
            :key="item.id">
            <div class="d-flex align-center">
              <img :src="item.img" :alt="item.name" style="max-width: 35px; max-height: 35px" @error="function(e){e.target.src=require('@/assets/img/@profile_user.png')}">
              <div class="ml-3">
                <div>
                  <strong style="font-size: 14px">{{ item.name }}</strong>
                  <span class="ml-2 is-txt-sub">{{ item.center }}</span>
                </div>
                <div >
                  <span>근무일수 {{ item.stat }}일</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </v-tab-item>
      <v-tab-item >
        <div
          style="height: 300px;"
          class="pl-notice-list no-link pl-scroll-body">
          <div
            class="pl-notice-list--unit "
            v-for="item in REST_LIST3"
            :key="item.id">
            <div class="d-flex align-center">
              <img :src="item.img" :alt="item.name" style="max-width: 35px; max-height: 35px" @error="function(e){e.target.src=require('@/assets/img/@profile_user.png')}">
              <div class="ml-3">
                <div>
                  <strong style="font-size: 14px">{{ item.name }}</strong>
                  <span class="ml-2 is-txt-sub">{{ item.center }}</span>
                </div>
                <div >
                  <span>{{ item.stat }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </v-tab-item>

    </v-tabs>
  </div>
</template>

<script>
export default {
  name: 'QAM_M0400_TAB_01_DIALOG', //평가 제외 대상자
  components: {
  },
  data() {
    return {
      // 총원
      TOTAL_DATA: {
        total: 184,
        LIST: [
          { title: '센터장', value: 1 },
          { title: '팀장', value: 11 },
          { title: '부팀장', value: 11 },
          { title: '인바운드', value: 170 },
          { title: '토지', value: 11 },
          { title: '문자', value: 2 },
          { title: '체납', value: 1 },
        ]
      },
      EX_OUT: {
        total: 23,
        LIST: [
          { title: '센터장', value: 1 },
          { title: '팀장', value: 11 },
          { title: '부팀장', value: 11 },
        ],
        total2: 6,
        LIST2: [
          { title: '휴직/휴가', value: 1 },
          { title: '근무일수 50% 미만', value: 11 },
          { title: '기타', value: 11 },
        ],
      },
      EX_TARGET: {
        total: 178,
        LIST: [
          { title: '인바운드', value: 164 },
          { title: '토지', value: 11 },
          { title: '문자', value: 2 },
          { title: '체납', value: 1 },
        ],
      },

      // 휴직/휴가
      REST_LIST: [
        {
          img: require('@/assets/img/@manager_profile4.png'),
          name: '김한나',
          center: '마이홈센터 - 마이홈1팀',
          date: '23-10-26 ~ 24-10-25',
          stat: '육아휴직',
        },
        { img: require('@/assets/img/@manager_profile.png'), name: '한소미', center: '마이홈센터 - 마이홈2팀', date: '23-10-26 ~ 24-10-25', stat: '질병휴직', },
        { img: require('@/assets/img/@manager_profile2.png'), name: '김경란', center: '마이홈센터 - 마이홈3팀', date: '23-10-26 ~ 24-10-25', stat: '육아휴직', },
        { img: require('@/assets/img/@manager_profile3.png'), name: '정선애', center: '마이홈센터 - 마이홈4팀', date: '23-10-26 ~ 24-10-25', stat: '출산휴가', },
      ],
      // 근무일수 부족
      REST_LIST2: [
        {
          img: require('@/assets/img/@manager_profile2.png'),
          name: '김경란',
          stat: 9,
        },
      ],
      // 기타
      REST_LIST3: [
        {
          img: require('@/assets/img/@manager_profile3.png'),
          name: '정선애',
          stat: '노조활동',
        },
      ],
    }
  },
  methods: {
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