<template>
  <div>
    <v-data-table
      class="pl-grid"
      :headers="headers"
      :items="items"
      fixed-header
      item-key="index"
      height="242px"
      :items-per-page="ROW_PER_PAGE"
      hide-default-footer
      no-data-text="등록된 데이터가 없습니다."
      :loading="isLoading"
      loading-text="조회중입니다."
      :page.sync="page"
      @page-count="pageCount = $event">
    </v-data-table>
  </div>
</template>

<script>
  export default {
    name: 'CompoTabHistComplaint', //상담 - 이력 정보 - 대 내/외 민원 탭
    data(){
      return{
        isLoading: false,
        page: 1,
        pageCount: 0,
        perPage: [15,30,50,100],
        ROW_PER_PAGE: 15,
        headers: [
          { text: '번호', value: 'index', align: 'center', width: '50px', sortable: false },
          { text: '요청일자', value: 'type1', align: '', width: '140px', sortable: false },
          { text: '주의 메모', value: 'type2', align: '', width: '', sortable: false },
          { text: '상태', value: 'type3', align: '', width: '100px', sortable: false },
          { text: '차단 시작일', value: 'type4', align: '', width: '10%', sortable: false },
          { text: '차단 시작일', value: 'type5', align: '', width: '10%', sortable: false },
        ],
        items: [
          {
            index: 2,
            type1: '2023-12-19 13:24:23',
            type2: '1차 블랙컨슈머 인입 차단(욕설 폭언)',
            type3: '15일 차단',
            type4: '2024-06-20 09:30:45',
            type5: '2024-07-05 09:30:45',
          },
          {
            index: 1,
            type1: '2023-12-19 13:24:23',
            type2: '1차 블랙컨슈머 인입 차단(욕설 폭언)',
            type3: '임시차단',
            type4: '2024-06-20 09:30:45',
            type5: '',
          },

        ],
      }
    }

  }
</script>

<style lang="scss" scoped>

</style>