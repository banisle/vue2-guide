<template>
  <div>
    <!-- pdf: PDF 파일 경로 -->
    <!-- config: 토글설정 -->
    <!-- pageScale: PDF 파일 기본 ZOOM 비율 -->
    <!-- pageNumber: PDF 파일 기본 페이지 -->
    <VuePdfApp :pdf="DataProp" :style="'height:'+vuePdfHeight" :config="config" :pageScale="100" :pageNumber="1"></VuePdfApp>
  </div>
</template>
<script>
import VuePdfApp from "vue-pdf-app";
import "vue-pdf-app/dist/icons/main.css";
export default {
  components: {
    VuePdfApp,
  },
  props: {
    DataProp: {
      type: String,
    },
    vuePdfHeight: {
      type: String,
      default:'700px'
    }
  },
  data() {
    return {
      config: {
        sidebar: {
          viewThumbnail: true,
          viewOutline: true,
          viewAttachments: true,
        },
        secondaryToolbar: {
          secondaryPresentationMode: true,
          secondaryOpenFile: true,
          secondaryPrint: true,
          secondaryDownload: true,
          secondaryViewBookmark: true,
          firstPage: true,
          lastPage: true,
          pageRotateCw: true,
          pageRotateCcw: true,
          cursorSelectTool: true,
          cursorHandTool: true,
          scrollVertical: true,
          scrollHorizontal: true,
          scrollWrapped: true,
          spreadNone: true,
          spreadOdd: true,
          spreadEven: true,
          documentProperties: true,
        },
        toolbar: {
          toolbarViewerLeft: {
            findbar: true,
            previous: true,
            next: true,
            pageNumber: true,
          },
          toolbarViewerRight: {
            presentationMode: true,
            openFile: true,
            print: true,
            download: true,
            viewBookmark: true,
          },
          toolbarViewerMiddle: {
            zoomOut: true,
            zoomIn: true,
            scaleSelectContainer: true,
          },
        },
        errorWrapper: true,
      },
    }
  },
  methods: {
  },
};
</script>
<style scoped>
</style>