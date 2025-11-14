<template>
  <div>
    <!-- search form -->
    <div class="pl-grid-top">
      <div class="pl-form-inline-wrap">
        <div class="pl-form-inline">
          <span class="pl-label">
            지구명
          </span>
          <div class="pl-desc">
            <v-text-field
              class="pl-form type-middle is-lg"
              value=""
              placeholder="지구명 입력" >
            </v-text-field>

            <v-btn
              class="pl-btn is-icon flex-grow-0">
              <span class="pl-icon20 search"></span>
              조회
            </v-btn>
          </div>
        </div>
      </div>
    </div>
    <!-- grid -->
    <v-data-table
      class="pl-grid is-hover is-mt-s"
      :headers="headers"
      :items="items"
      fixed-header
      item-key="index"
      height="560px"
      :items-per-page="ROW_PER_PAGE"
      hide-default-footer
      no-data-text="등록된 데이터가 없습니다."
    />

  </div>
</template>

<script>
  export default {
    name: 'CompoFindArea',
    data(){
      return{
        page: 1,
        pageCount: 0,
        perPage: [15,30,50,100],
        ROW_PER_PAGE: 15,
        headers: [
          { text: '번호', value: 'index', align: 'center', width: '80px' },
          { text: '시도', value: 'type01', align: 'center', width: '120px' },
          { text: '시군구', value: 'type02', width: '120px'},
          { text: '지구', value: 'type03', align: 'center',  },
        ],
        items: [
          { index: 110, type01: '강원', type02: '선택안함', type03: '선택안함', },
          { index: 111, type01: '강원', type02: '강릉시', type03: '선택안함', },
          { index: 112, type01: '강원', type02: '강릉시', type03: '강릉교동', },
          { index: 113, type01: '강원', type02: '강릉시', type03: '강릉교동', },
          { index: 114, type01: '강원', type02: '강릉시', type03: '강릉교동', },
          { index: 115, type01: '강원', type02: '강릉시', type03: '강릉교동', },
          { index: 116, type01: '강원', type02: '강릉시', type03: '선택안함', },
          { index: 117, type01: '강원', type02: '강릉시', type03: '강릉포남', },
          { index: 118, type01: '강원', type02: '강릉시', type03: '강릉송정', },
          { index: 119, type01: '강원', type02: '고성군', type03: '선택안함', },
          { index: 120, type01: '강원', type02: '고성군', type03: '선택안함', },
          { index: 121, type01: '강원', type02: '고성군', type03: '강릉유천', },
          { index: 122, type01: '강원', type02: '고성군', type03: '강원고성', },
          { index: 123, type01: '강원', type02: '고성군', type03: '선택안함', },
          { index: 124, type01: '강원', type02: '고성군', type03: '선택안함', },
          { index: 125, type01: '강원', type02: '고성군', type03: '선택안함', },
          { index: 126, type01: '강원', type02: '동해시', type03: '선택안함', },
          { index: 127, type01: '강원', type02: '동해시', type03: '선택안함', },
          { index: 128, type01: '강원', type02: '동해시', type03: '선택안함', },
          { index: 129, type01: '강원', type02: '동해시', type03: '선택안함', },
        ],
      }
    }

  }
</script>

<style lang="scss" scoped>

</style>