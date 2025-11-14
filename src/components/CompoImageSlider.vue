<template>
  <div>
    <!-- 캐러셀 -->
    <div
      ref="carousel"
      :class="`image-carousel ${showHint ? 'is-hint' : ''}`"
      @wheel="onMouseWheel"
    >
      <div class="image-carousel-track">
        <template v-if="ImagesProp.length > 0">
          <div
            class="text-center"
            v-for="(image, index) in ImagesProp"
            :key="index">
            <v-img

              :src="image.src"
              class="image-carousel-item"
              @click="expand_img(image.src)"
            ></v-img>
            <div class="py-2"><strong>{{ image.title }}</strong></div>
          </div>
        </template>
        <template v-else>
          <div class="text-center"><span>등록된 데이터가 없습니다.</span></div>
        </template>
      </div>
    </div>
    <!-- 이미지 확대 다이얼로그 -->
    <v-dialog
      v-model="dialogImgExpand"
      content-class="dialog-draggable is-scroll"
      width="1000px"
      hide-overlay>
      <div class="draggable-area">drag area</div>
      <compo-dialog
        header-title="이미지"
        @hide="mixin_hideDialog('ImgExpand')"
      >
        <template slot="body">
          <!-- component -->
          <div>
            <div class="d-flex flex-column align-center" >
              <div class="d-flex align-center" style="width: 50%">
                <v-icon class="pl-icon20 zoom mr-4 "></v-icon>
                <vue-slider
                  v-model="imgWidth"
                  :min=0.1
                  :max=1
                  :interval=0.1
                  tooltip="none"
                  width="calc(100% - 46px)"
                  height="2px"
                  dragOnClick
                  @drag-start="toggleZoom = false"
                  :duration=0
                  adsorb
                />
                <compo-tooltip-btn
                  TitleProp="원본 보기"
                  ClassProp="pl-tooltip-btn ml-4"
                  IconProp="pl-icon20 zoom-fit"
                  TooltipPositionProp="bottom"
                  @btnClick="imgWidth = 1"
                ></compo-tooltip-btn>
              </div>
            </div>
            <div class="d-flex align-center">
              <img
                :src="expandImgUrl"
                :style="`transform: scale(${imgWidth}); transform-origin: center top;`"
                class="is-mt-m"
                >

            </div>
          </div>
        </template>
      </compo-dialog>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: 'CompoImageSlider',
  props: {
    ImagesProp: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      isDragging: false,
      startX: 0,
      scrollLeft: 0,

      expandImgUrl: '',
      imgWidth: 1,
      dialogImgExpand: false,

      showHint: false,
    };
  },
  methods: {
    onMouseDown(e) {
      this.isDragging = true;
      this.startX = e.pageX - this.$refs.carousel.offsetLeft;
      this.scrollLeft = this.$refs.carousel.scrollLeft;
    },
    onMouseMove(e) {
      if (!this.isDragging) return;
      e.preventDefault();
      const x = e.pageX - this.$refs.carousel.offsetLeft;
      const walk = (x - this.startX) * 2; // 스크롤 속도 조절
      this.$refs.carousel.scrollLeft = this.scrollLeft - walk;
    },
    onMouseUp() {
      this.isDragging = false;
    },
    onMouseWheel(e) {
      // if (this.showHint) {
      //   this.showHint = false;
      // }

      e.preventDefault();
      this.$refs.carousel.scrollLeft += e.deltaY; // 마우스 휠 스크롤에 따라 가로 스크롤
    },
    expand_img(img) {
      this.expandImgUrl = img;
      this.mixin_showDialog('ImgExpand')
    },
  },
};
</script>

<style scoped lang="scss">
.image-carousel {
  position: relative;
  display: flex;
  overflow-x: scroll;
  cursor: grab;
  user-select: none;
  &.is-hint{
    &:after{
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-image: url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTg0IiBoZWlnaHQ9IjcxNyIgdmlld0JveD0iMCAwIDU4NCA3MTciIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0wIDI5MS42NjdWNDI1SDUwVjI5MS42NjdIMFpNNTgzLjMzMyA0MjVWMjkxLjY2N0g1MzMuMzMzVjQyNUg1ODMuMzMzWk01ODMuMzMzIDI5MS42NjdDNTgzLjMzMyAxMzAuNTg0IDQ1Mi43NSAwIDI5MS42NjcgMFY1MEM0MjUuMTM3IDUwIDUzMy4zMzMgMTU4LjE5OCA1MzMuMzMzIDI5MS42NjdINTgzLjMzM1pNMjkxLjY2NyA3MTYuNjY3QzQ1Mi43NSA3MTYuNjY3IDU4My4zMzMgNTg2LjA4MyA1ODMuMzMzIDQyNUg1MzMuMzMzQzUzMy4zMzMgNTU4LjQ3IDQyNS4xMzcgNjY2LjY2NyAyOTEuNjY3IDY2Ni42NjdWNzE2LjY2N1pNMCA0MjVDMCA1ODYuMDgzIDEzMC41ODQgNzE2LjY2NyAyOTEuNjY3IDcxNi42NjdWNjY2LjY2N0MxNTguMTk4IDY2Ni42NjcgNTAgNTU4LjQ3IDUwIDQyNUgwWk01MCAyOTEuNjY3QzUwIDE1OC4xOTggMTU4LjE5OCA1MCAyOTEuNjY3IDUwVjBDMTMwLjU4NCAwIDAgMTMwLjU4NCAwIDI5MS42NjdINTBaIiBmaWxsPSIjRkZGIi8+CjxwYXRoIGQ9Ik0xNTguNjY3IDM1OC4zMzJMMTQwLjk4OSAzNDAuNjU2QzEzMS4yMjYgMzUwLjQxOSAxMzEuMjI2IDM2Ni4yNDYgMTQwLjk4OSAzNzYuMDA5TDE1OC42NjcgMzU4LjMzMlpNNDI1LjMzMyAzNTguMzMyTDQ0My4wMSAzNzYuMDA5QzQ1Mi43NzMgMzY2LjI0NiA0NTIuNzczIDM1MC40MTkgNDQzLjAxIDM0MC42NTZMNDI1LjMzMyAzNTguMzMyWk0yMDcuNjU2IDQ0Mi42NzdDMjE3LjQxOSA0NTIuNDQgMjMzLjI0OCA0NTIuNDQgMjQzLjAxMSA0NDIuNjc3QzI1Mi43NzQgNDMyLjkxNCAyNTIuNzc0IDQxNy4wODYgMjQzLjAxMSA0MDcuMzIyTDIwNy42NTYgNDQyLjY3N1pNMjQzLjAxMSAzMDkuMzQyQzI1Mi43NzQgMjk5LjU3OSAyNTIuNzc0IDI4My43NTIgMjQzLjAxMSAyNzMuOTg5QzIzMy4yNDggMjY0LjIyNiAyMTcuNDE5IDI2NC4yMjYgMjA3LjY1NiAyNzMuOTg5TDI0My4wMTEgMzA5LjM0MlpNMzQwLjk5IDQwNy4zMjJDMzMxLjIyNyA0MTcuMDg2IDMzMS4yMjcgNDMyLjkxNCAzNDAuOTkgNDQyLjY3N0MzNTAuNzUzIDQ1Mi40NCAzNjYuNTggNDUyLjQ0IDM3Ni4zNDMgNDQyLjY3N0wzNDAuOTkgNDA3LjMyMlpNMzc2LjM0MyAyNzMuOTg5QzM2Ni41OCAyNjQuMjI2IDM1MC43NTMgMjY0LjIyNiAzNDAuOTkgMjczLjk4OUMzMzEuMjI3IDI4My43NTIgMzMxLjIyNyAyOTkuNTc5IDM0MC45OSAzMDkuMzQyTDM3Ni4zNDMgMjczLjk4OVpNMTU4LjY2NyAzODMuMzMyTDQyNS4zMzMgMzgzLjMzMkw0MjUuMzMzIDMzMy4zMzJMMTU4LjY2NyAzMzMuMzMyTDE1OC42NjcgMzgzLjMzMlpNMTQwLjk4OSAzNzYuMDA5TDIwNy42NTYgNDQyLjY3N0wyNDMuMDExIDQwNy4zMjJMMTc2LjM0NCAzNDAuNjU2TDE0MC45ODkgMzc2LjAwOVpNMTc2LjM0NCAzNzYuMDA5TDI0My4wMTEgMzA5LjM0MkwyMDcuNjU2IDI3My45ODlMMTQwLjk4OSAzNDAuNjU2TDE3Ni4zNDQgMzc2LjAwOVpNNDA3LjY1NyAzNDAuNjU2TDM0MC45OSA0MDcuMzIyTDM3Ni4zNDMgNDQyLjY3N0w0NDMuMDEgMzc2LjAwOUw0MDcuNjU3IDM0MC42NTZaTTQ0My4wMSAzNDAuNjU2TDM3Ni4zNDMgMjczLjk4OUwzNDAuOTkgMzA5LjM0Mkw0MDcuNjU3IDM3Ni4wMDlMNDQzLjAxIDM0MC42NTZaIiBmaWxsPSIjRkZGIi8+Cjwvc3ZnPgo=");
      background-size: 50px;
      background-position: 50% 50%;
      transition: all ease $easing-time;
      background-color: rgba($color: #000000, $alpha: .3);
      animation: fadeIn 1s ease-in-out;
    }
    &:before{
      content: '마우스 휠로 스크롤 할 수 있습니다';
      position: absolute;
      top: 67%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: #fff;
      z-index: 1;
    }
  }
}

.image-carousel-track {
  display: flex;
  gap: 16px;
}

.image-carousel-item {
  width: 340px;
  height: 240px;
}

.image-carousel:active {
  cursor: grabbing;
}


@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
