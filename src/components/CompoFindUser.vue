<template>
  <div>
    <!-- search form -->
    <div class="pl-grid-top">
      <div class="pl-form-inline-wrap">
        <div class="pl-form-inline">
          <span class="pl-label">
            그룹
          </span>
          <div class="pl-desc">
            <v-select
              class="pl-form type-middle"
              placeholder="전체"
            />
          </div>
        </div>
        <div class="pl-form-inline">
          <span class="pl-label">
            소속
          </span>
          <div class="pl-desc">
            <v-select
              class="pl-form type-middle"
              placeholder="전체"
            />
          </div>
        </div>
        <div class="pl-form-inline">
          <span class="pl-label">
            성명
          </span>
          <div class="pl-desc">
            <v-text-field
              class="pl-form type-middle is-sm"
              value=""
              placeholder="직원명 입력"
              >
            </v-text-field>

            <v-btn
              class="pl-btn is-icon flex-grow-0"
              @click=""
              >
              <span class="pl-icon20 search"></span>
              조회
            </v-btn>
            <!-- 툴팁 버튼 -->
            <compo-tooltip-btn
              TitleProp="초기화"
              ClassProp="pl-tooltip-btn flex-grow-0"
              IconProp="pl-icon20 refresh"
              TooltipPositionProp="bottom"
            ></compo-tooltip-btn>
          </div>
        </div>
      </div>
    </div>
    <!-- temp grid -->
    <v-data-table
      class="pl-grid is-mt-s has-control"
      :headers="headers"
      :items="reversedItems"
      show-select
      fixed-header
      item-key="index"
      height="360px"
      :items-per-page="-1"
      hide-default-footer
      no-data-text="등록된 데이터가 없습니다."
      >
      <template v-slot:item.type01="{ item }">
        <img :src="item.img" :alt="item.type01" class="pl-grid-portrait" style="width: 20px; height: 20px;" @error="function(e){e.target.src=require('@/assets/img/@profile_user.png')}">
        <strong class="ml-1">{{ item.type01 }}</strong>
      </template>
    </v-data-table>
  </div>
</template>

<script>
export default {
  name: 'CompoFindUser', //사용자 찾기
  components: {
  },
  data() {
    return {
      headers: [
        { text: '번호', value: 'index', align: 'center', width: '50px',sortable: false },
        { text: '성명', value: 'type01', align: '', width: '110px',sortable: false },
        { text: '그룹', value: 'type02', align: '', width: '20%',sortable: false },
        { text: '소속', value: 'type03', align: '', width: '20%', sortable: false },
        { text: '직무', value: 'type04', align: '', width: '', sortable: false },
      ],
      items: [
        {
          index: 1,
          img: require('@/assets/img/@manager_profile.png'),
          type01: '한소미',
          type02: '업무담당자그룹',
          type03: '인재개발팀',
          type04: '',
        },
        { index: 2, img: require('@/assets/img/@manager_profile2.png'), type01: '김경란', type02: '업무담당자그룹', type03: '인재개발팀', type04: '', },
        { index: 3, img: require('@/assets/img/@manager_profile3.png'), type01: '정선애', type02: '업무담당자그룹', type03: '인재개발팀', type04: '', },
        { index: 4, img: require('@/assets/img/@manager_profile4.png'), type01: '우성아', type02: '업무담당자그룹', type03: '인재개발팀', type04: '', },
        { index: 5, img: require('@/assets/img/@manager_profile5.png'), type01: '김미정', type02: '업무담당자그룹', type03: '인재개발팀', type04: '', },
        { index: 6, img: require('@/assets/img/@manager_profile6.png'), type01: '박지연', type02: '업무담당자그룹', type03: '인재개발팀', type04: '', },
        { index: 7, img: require('@/assets/img/@manager_profile.png'), type01: '한소미', type02: '업무담당자그룹', type03: '인재개발팀', type04: '', },
        { index: 8, img: require('@/assets/img/@manager_profile2.png'), type01: '김경란', type02: '업무담당자그룹', type03: '인재개발팀', type04: '', },
        { index: 9, img: require('@/assets/img/@manager_profile3.png'), type01: '정선애', type02: '업무담당자그룹', type03: '인재개발팀', type04: '', },
        { index: 10, img: require('@/assets/img/@manager_profile4.png'), type01: '우성아', type02: '업무담당자그룹', type03: '인재개발팀', type04: '', },
        { index: 11, img: require('@/assets/img/@manager_profile5.png'), type01: '김미정', type02: '업무담당자그룹', type03: '인재개발팀', type04: '', },
        { index: 12, img: require('@/assets/img/@manager_profile6.png'), type01: '박지연', type02: '업무담당자그룹', type03: '인재개발팀', type04: '', },
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
    reversedItems() {
      return this.items.slice().reverse();
    },
  },
  watch: {
  },
};
</script>

<style lang="scss" scoped>

</style>