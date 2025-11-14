<template>
  <div class="py-4 px-6">
    <div class="pl-form-inline-wrap vertical gap-8">
      <div
        class="pl-form-inline">
        <span class="pl-label">
          <v-icon class="pl-icon20 div-chk mr-2"></v-icon>
          받는 사람
        </span>
        <div class="pl-desc">
          <v-text-field
            class="pl-form type-middle"
          />
        </div>
      </div>
      <div class="pl-form-inline">
        <span class="pl-label">
          <v-icon class="pl-icon20 document mr-2"></v-icon>
          제목
        </span>
        <div class="pl-desc">
          <v-text-field
            class="pl-form type-middle"
          />
        </div>
      </div>
    </div>
    <compo-file-grid
      SmallTitleProp
      :HeadersProp="filelist_header"
    ></compo-file-grid>
    <div class="is-mt-m">
      <crosseditor
        v-model="crosseditor_initial_value"
        id="ne-crosseditor-001"
        ref="crossEditor"
        editorWidth="750"
        editorHeight="400"
      ></crosseditor>
    </div>

  </div>
</template>

<script>

  export default {
    name: 'CompoSendEmailWrite',
    props:{
      DataProp: {
        type: Object,
      }
    },
    data() {
      return {

        filelist_header: [
          { text: '파일명', value: 'filename', align: 'left',sortable: false },
          { text: '크기', value: 'filesize', align: 'left',sortable: false , width: '100px'},
        ],

        crosseditor_initial_value: '<div>&ZeroWidthSpace;<br/><br/><br/></div><div><font color="#4C5CBB"><b>---------- Original Message ----------</b></font></div>' + this.extractBodyFromHTML(this.DataProp.CN)

      }
    },

    methods: {
      extractBodyFromHTML(htmlString) {
        // 정규 표현식을 사용하여 body 태그 및 내용 추출
        const bodyRegex = /<body[^>]*>((.|[\n\r])*)<\/body>/im;
        const match = bodyRegex.exec(htmlString);

        if (match && match.length > 1) {
          return match[1]; // body 내용 반환
        } else {
          return htmlString; // body 태그가 없을 경우 htmlString 반환
        }
      },

    },
    updated() {

    },
    created() {
    },
    mounted() {

    },
    computed: {
    },
    watch: {

    },
  }
</script>
<style lang="scss" scoped>
</style>