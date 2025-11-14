<template>
  <div style="display: contents;">
    <div class="pl-card pl-scroll-body" style="height: calc(100vh - 120px);">
      <!-- 전년도 도시근로자 가구당 평균 소득 -->
      <div>
        <!-- title -->
        <div class="pl-grid-top">
          <div class="pl-grid-top-left spacing-wrap sp-16">
            <strong class="pl-bullet-txt is-blue">전년도 도시근로자 가구당 평균 소득<span class="font-weight-regular">(*4~8인 아래 가구원수별 월 평균 소득 기준과 동일)</span></strong>
          </div>
        </div>
        <!-- table -->
        <table class="pl-tbl-detail is-mt-s">
          <colgroup>
            <col width="127px" />
            <col width="" span="12"/>
          </colgroup>
          <thead>
            <tr>
              <th scope="col">가구 원수</th>
              <th scope="col">50%</th>
              <th scope="col">60%</th>
              <th scope="col">70%</th>
              <th scope="col">80%</th>
              <th scope="col">90%</th>
              <th scope="col">100%</th>
              <th scope="col">110%</th>
              <th scope="col">120%</th>
              <th scope="col">130%</th>
              <th scope="col">140%</th>
              <th scope="col">150%</th>
              <th scope="col">200%</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row" class="text-center is-bg-light">
                <span class="is-txt-blue is-bold">3인 이하</span>
              </th>
              <td class="text-center"><v-text-field @input="setCurrency(5, 'STD_VAL1')" v-model="assetList[5].STD_VAL1" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(5, 'STD_VAL2')" v-model="assetList[5].STD_VAL2" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(5, 'STD_VAL3')" v-model="assetList[5].STD_VAL3" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(5, 'STD_VAL4')" v-model="assetList[5].STD_VAL4" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(5, 'STD_VAL5')" v-model="assetList[5].STD_VAL5" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(5, 'STD_VAL6', 'A')" v-model="assetList[5].STD_VAL6" class="pl-form text-center is-border-red"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(5, 'STD_VAL7')" v-model="assetList[5].STD_VAL7" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(5, 'STD_VAL8')" v-model="assetList[5].STD_VAL8" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(5, 'STD_VAL9')" v-model="assetList[5].STD_VAL9" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(5, 'STD_VAL10')" v-model="assetList[5].STD_VAL10" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(5, 'STD_VAL11')" v-model="assetList[5].STD_VAL11" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(5, 'STD_VAL12')" v-model="assetList[5].STD_VAL12" class="pl-form text-center"/></td>
            </tr>
            <tr>
              <th
                scope="row"
                class="text-center is-bg-light is-bold">비고</th>
              <td class="has-textarea" colspan="12">
                <v-textarea
                  class="pl-form is-noresize"
                  :spellcheck="false"
                  v-model="assetList[0].BIGO"
                  v-byte-counter="2000"
                  height="80"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 전년도 도시근로자 가구원수별 월평균 소득 -->
      <div class="is-mt-l">
        <!-- title -->
        <div class="pl-grid-top">
          <div class="pl-grid-top-left spacing-wrap sp-16">
            <strong class="pl-bullet-txt is-blue">전년도 도시근로자 가구원수별 월평균 소득</strong>
          </div>
        </div>
        <!-- table -->
        <table class="pl-tbl-detail is-mt-s">
          <colgroup>
            <col width="127px" />
            <col width="" span="12"/>
          </colgroup>
          <thead>
            <tr>
              <th scope="col">가구 원수</th>
              <th scope="col">50%</th>
              <th scope="col">60%</th>
              <th scope="col">70%</th>
              <th scope="col">80%</th>
              <th scope="col">90%</th>
              <th scope="col">100%</th>
              <th scope="col">110%</th>
              <th scope="col">120%</th>
              <th scope="col">130%</th>
              <th scope="col">140%</th>
              <th scope="col">150%</th>
              <th scope="col">200%</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row" class="text-center is-bg-light is-bold">1인 (20%p 가산)</th>
              <td class="text-center"><v-text-field @input="setCurrency(6, 'STD_VAL1')" v-model="assetList[6].STD_VAL1" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(6, 'STD_VAL2')" v-model="assetList[6].STD_VAL2" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(6, 'STD_VAL3')" v-model="assetList[6].STD_VAL3" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(6, 'STD_VAL4')" v-model="assetList[6].STD_VAL4" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(6, 'STD_VAL5')" v-model="assetList[6].STD_VAL5" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(6, 'STD_VAL6', 'B')" v-model="assetList[6].STD_VAL6" class="pl-form text-center is-border-red"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(6, 'STD_VAL7')" v-model="assetList[6].STD_VAL7" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(6, 'STD_VAL8')" v-model="assetList[6].STD_VAL8" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(6, 'STD_VAL9')" v-model="assetList[6].STD_VAL9" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(6, 'STD_VAL10')" v-model="assetList[6].STD_VAL10" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(6, 'STD_VAL11')" v-model="assetList[6].STD_VAL11" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(6, 'STD_VAL12')" v-model="assetList[6].STD_VAL12" class="pl-form text-center"/></td>
            </tr>
            <tr>
              <th scope="row" class="text-center is-bg-light is-bold">2인 (10%p 가산)</th>
              <td class="text-center"><v-text-field @input="setCurrency(7, 'STD_VAL1')" v-model="assetList[7].STD_VAL1" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(7, 'STD_VAL2')" v-model="assetList[7].STD_VAL2" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(7, 'STD_VAL3')" v-model="assetList[7].STD_VAL3" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(7, 'STD_VAL4')" v-model="assetList[7].STD_VAL4" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(7, 'STD_VAL5')" v-model="assetList[7].STD_VAL5" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(7, 'STD_VAL6', 'B')" v-model="assetList[7].STD_VAL6" class="pl-form text-center is-border-red"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(7, 'STD_VAL7')" v-model="assetList[7].STD_VAL7" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(7, 'STD_VAL8')" v-model="assetList[7].STD_VAL8" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(7, 'STD_VAL9')" v-model="assetList[7].STD_VAL9" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(7, 'STD_VAL10')" v-model="assetList[7].STD_VAL10" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(7, 'STD_VAL11')" v-model="assetList[7].STD_VAL11" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(7, 'STD_VAL12')" v-model="assetList[7].STD_VAL12" class="pl-form text-center"/></td>
            </tr>
            <tr>
              <th scope="row" class="text-center is-bg-light is-bold">3인</th>
              <td class="text-center"><v-text-field @input="setCurrency(8, 'STD_VAL1')" v-model="assetList[8].STD_VAL1" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(8, 'STD_VAL2')" v-model="assetList[8].STD_VAL2" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(8, 'STD_VAL3')" v-model="assetList[8].STD_VAL3" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(8, 'STD_VAL4')" v-model="assetList[8].STD_VAL4" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(8, 'STD_VAL5')" v-model="assetList[8].STD_VAL5" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(8, 'STD_VAL6', 'B')" v-model="assetList[8].STD_VAL6" class="pl-form text-center is-border-red"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(8, 'STD_VAL7')" v-model="assetList[8].STD_VAL7" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(8, 'STD_VAL8')" v-model="assetList[8].STD_VAL8" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(8, 'STD_VAL9')" v-model="assetList[8].STD_VAL9" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(8, 'STD_VAL10')" v-model="assetList[8].STD_VAL10" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(8, 'STD_VAL11')" v-model="assetList[8].STD_VAL11" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(8, 'STD_VAL12')" v-model="assetList[8].STD_VAL12" class="pl-form text-center"/></td>
            </tr>
            <tr>
              <th scope="row" class="text-center is-bg-light is-bold">4인</th>
              <td class="text-center"><v-text-field @input="setCurrency(9, 'STD_VAL1')" v-model="assetList[9].STD_VAL1" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(9, 'STD_VAL2')" v-model="assetList[9].STD_VAL2" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(9, 'STD_VAL3')" v-model="assetList[9].STD_VAL3" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(9, 'STD_VAL4')" v-model="assetList[9].STD_VAL4" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(9, 'STD_VAL5')" v-model="assetList[9].STD_VAL5" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(9, 'STD_VAL6', 'B')" v-model="assetList[9].STD_VAL6" class="pl-form text-center is-border-red"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(9, 'STD_VAL7')" v-model="assetList[9].STD_VAL7" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(9, 'STD_VAL8')" v-model="assetList[9].STD_VAL8" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(9, 'STD_VAL9')" v-model="assetList[9].STD_VAL9" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(9, 'STD_VAL10')" v-model="assetList[9].STD_VAL10" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(9, 'STD_VAL11')" v-model="assetList[9].STD_VAL11" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(9, 'STD_VAL12')" v-model="assetList[9].STD_VAL12" class="pl-form text-center"/></td>
            </tr>
            <tr>
              <th scope="row" class="text-center is-bg-light is-bold">5인</th>
              <td class="text-center"><v-text-field @input="setCurrency(10, 'STD_VAL1')" v-model="assetList[10].STD_VAL1" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(10, 'STD_VAL2')" v-model="assetList[10].STD_VAL2" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(10, 'STD_VAL3')" v-model="assetList[10].STD_VAL3" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(10, 'STD_VAL4')" v-model="assetList[10].STD_VAL4" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(10, 'STD_VAL5')" v-model="assetList[10].STD_VAL5" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(10, 'STD_VAL6', 'B')" v-model="assetList[10].STD_VAL6" class="pl-form text-center is-border-red"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(10, 'STD_VAL7')" v-model="assetList[10].STD_VAL7" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(10, 'STD_VAL8')" v-model="assetList[10].STD_VAL8" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(10, 'STD_VAL9')" v-model="assetList[10].STD_VAL9" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(10, 'STD_VAL10')" v-model="assetList[10].STD_VAL10" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(10, 'STD_VAL11')" v-model="assetList[10].STD_VAL11" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(10, 'STD_VAL12')" v-model="assetList[10].STD_VAL12" class="pl-form text-center"/></td>
            </tr>
            <tr>
              <th scope="row" class="text-center is-bg-light is-bold">6인</th>
              <td class="text-center"><v-text-field @input="setCurrency(11, 'STD_VAL1')" v-model="assetList[11].STD_VAL1" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(11, 'STD_VAL2')" v-model="assetList[11].STD_VAL2" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(11, 'STD_VAL3')" v-model="assetList[11].STD_VAL3" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(11, 'STD_VAL4')" v-model="assetList[11].STD_VAL4" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(11, 'STD_VAL5')" v-model="assetList[11].STD_VAL5" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(11, 'STD_VAL6', 'B')" v-model="assetList[11].STD_VAL6" class="pl-form text-center is-border-red"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(11, 'STD_VAL7')" v-model="assetList[11].STD_VAL7" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(11, 'STD_VAL8')" v-model="assetList[11].STD_VAL8" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(11, 'STD_VAL9')" v-model="assetList[11].STD_VAL9" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(11, 'STD_VAL10')" v-model="assetList[11].STD_VAL10" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(11, 'STD_VAL11')" v-model="assetList[11].STD_VAL11" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(11, 'STD_VAL12')" v-model="assetList[11].STD_VAL12" class="pl-form text-center"/></td>
            </tr>
            <tr>
              <th scope="row" class="text-center is-bg-light is-bold">7인</th>
              <td class="text-center"><v-text-field @input="setCurrency(12, 'STD_VAL1')" v-model="assetList[12].STD_VAL1" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(12, 'STD_VAL2')" v-model="assetList[12].STD_VAL2" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(12, 'STD_VAL3')" v-model="assetList[12].STD_VAL3" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(12, 'STD_VAL4')" v-model="assetList[12].STD_VAL4" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(12, 'STD_VAL5')" v-model="assetList[12].STD_VAL5" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(12, 'STD_VAL6', 'B')" v-model="assetList[12].STD_VAL6" class="pl-form text-center is-border-red"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(12, 'STD_VAL7')" v-model="assetList[12].STD_VAL7" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(12, 'STD_VAL8')" v-model="assetList[12].STD_VAL8" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(12, 'STD_VAL9')" v-model="assetList[12].STD_VAL9" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(12, 'STD_VAL10')" v-model="assetList[12].STD_VAL10" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(12, 'STD_VAL11')" v-model="assetList[12].STD_VAL11" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(12, 'STD_VAL12')" v-model="assetList[12].STD_VAL12" class="pl-form text-center"/></td>
            </tr>
            <tr>
              <th scope="row" class="text-center is-bg-light is-bold">8인</th>
              <td class="text-center"><v-text-field @input="setCurrency(13, 'STD_VAL1')" v-model="assetList[13].STD_VAL1" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(13, 'STD_VAL2')" v-model="assetList[13].STD_VAL2" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(13, 'STD_VAL3')" v-model="assetList[13].STD_VAL3" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(13, 'STD_VAL4')" v-model="assetList[13].STD_VAL4" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(13, 'STD_VAL5')" v-model="assetList[13].STD_VAL5" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(13, 'STD_VAL6', 'B')" v-model="assetList[13].STD_VAL6" class="pl-form text-center is-border-red"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(13, 'STD_VAL7')" v-model="assetList[13].STD_VAL7" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(13, 'STD_VAL8')" v-model="assetList[13].STD_VAL8" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(13, 'STD_VAL9')" v-model="assetList[13].STD_VAL9" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(13, 'STD_VAL10')" v-model="assetList[13].STD_VAL10" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(13, 'STD_VAL11')" v-model="assetList[13].STD_VAL11" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(13, 'STD_VAL12')" v-model="assetList[13].STD_VAL12" class="pl-form text-center"/></td>
            </tr>
            <tr>
              <th
                scope="row"
                class="text-center is-bg-light is-bold">비고</th>
              <td class="has-textarea" colspan="12">
                <v-textarea
                  class="pl-form is-noresize"
                  :spellcheck="false"
                  v-model="assetList[1].BIGO"
                  v-byte-counter="2000"
                  height="80"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 가구원수별 기준 중위 소득 -->
      <div class="is-mt-l">
        <!-- title -->
        <div class="pl-grid-top">
          <div class="pl-grid-top-left spacing-wrap sp-16">
            <strong class="pl-bullet-txt is-blue">가구원수별 기준 중위 소득</strong>
          </div>
        </div>
        <!-- table -->
        <table class="pl-tbl-detail is-mt-s">
          <colgroup>
            <col width="127px" />
            <col width="" span="12"/>
          </colgroup>
          <thead>
            <tr>
              <th scope="col"></th>
              <th scope="col">1구간</th>
              <th scope="col">2구간</th>
              <th scope="col">3구간</th>
              <th scope="col">4구간</th>
              <th scope="col" colspan="3">5구간</th>
              <th scope="col">6구간</th>
              <th scope="col" colspan="5">기타 소득 구간</th>
            </tr>
            <tr>
              <th scope="col">가구 원수</th>
              <th scope="col">30%</th>
              <th scope="col">50%</th>
              <th scope="col">70%</th>
              <th scope="col">100%</th>
              <th scope="col">110%</th>
              <th scope="col">120%</th>
              <th scope="col">130%</th>
              <th scope="col">150%</th>
              <th scope="col">160%</th>
              <th scope="col">170%</th>
              <th scope="col">180%</th>
              <th scope="col">190%</th>
              <th scope="col">200%</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row" class="text-center is-bg-light is-bold">1인</th>
              <td class="text-center"><v-text-field @input="setCurrency(41, 'STD_VAL1')" v-model="assetList[41].STD_VAL1" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(41, 'STD_VAL2')" v-model="assetList[41].STD_VAL2" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(41, 'STD_VAL3')" v-model="assetList[41].STD_VAL3" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(41, 'STD_VAL4', 'C')" v-model="assetList[41].STD_VAL4" class="pl-form text-center is-border-red"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(41, 'STD_VAL5')" v-model="assetList[41].STD_VAL5" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(41, 'STD_VAL6')" v-model="assetList[41].STD_VAL6" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(41, 'STD_VAL7')" v-model="assetList[41].STD_VAL7" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(41, 'STD_VAL8')" v-model="assetList[41].STD_VAL8" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(41, 'STD_VAL9')" v-model="assetList[41].STD_VAL9" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(41, 'STD_VAL10')" v-model="assetList[41].STD_VAL10" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(41, 'STD_VAL11')" v-model="assetList[41].STD_VAL11" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(41, 'STD_VAL12')" v-model="assetList[41].STD_VAL12" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(41, 'STD_VAL13')" v-model="assetList[41].STD_VAL13" class="pl-form text-center"/></td>
            </tr>
            <tr>
              <th scope="row" class="text-center is-bg-light is-bold">2인</th>
              <td class="text-center"><v-text-field @input="setCurrency(42, 'STD_VAL1')" v-model="assetList[42].STD_VAL1" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(42, 'STD_VAL2')" v-model="assetList[42].STD_VAL2" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(42, 'STD_VAL3')" v-model="assetList[42].STD_VAL3" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(42, 'STD_VAL4', 'C')" v-model="assetList[42].STD_VAL4" class="pl-form text-center is-border-red"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(42, 'STD_VAL5')" v-model="assetList[42].STD_VAL5" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(42, 'STD_VAL6')" v-model="assetList[42].STD_VAL6" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(42, 'STD_VAL7')" v-model="assetList[42].STD_VAL7" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(42, 'STD_VAL8')" v-model="assetList[42].STD_VAL8" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(42, 'STD_VAL9')" v-model="assetList[42].STD_VAL9" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(42, 'STD_VAL10')" v-model="assetList[42].STD_VAL10" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(42, 'STD_VAL11')" v-model="assetList[42].STD_VAL11" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(42, 'STD_VAL12')" v-model="assetList[42].STD_VAL12" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(42, 'STD_VAL13')" v-model="assetList[42].STD_VAL13" class="pl-form text-center"/></td>
            </tr>
            <tr>
              <th scope="row" class="text-center is-bg-light is-bold">3인</th>
              <td class="text-center"><v-text-field @input="setCurrency(43, 'STD_VAL1')" v-model="assetList[43].STD_VAL1" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(43, 'STD_VAL2')" v-model="assetList[43].STD_VAL2" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(43, 'STD_VAL3')" v-model="assetList[43].STD_VAL3" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(43, 'STD_VAL4', 'C')" v-model="assetList[43].STD_VAL4" class="pl-form text-center is-border-red"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(43, 'STD_VAL5')" v-model="assetList[43].STD_VAL5" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(43, 'STD_VAL6')" v-model="assetList[43].STD_VAL6" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(43, 'STD_VAL7')" v-model="assetList[43].STD_VAL7" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(43, 'STD_VAL8')" v-model="assetList[43].STD_VAL8" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(43, 'STD_VAL9')" v-model="assetList[43].STD_VAL9" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(43, 'STD_VAL10')" v-model="assetList[43].STD_VAL10" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(43, 'STD_VAL11')" v-model="assetList[43].STD_VAL11" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(43, 'STD_VAL12')" v-model="assetList[43].STD_VAL12" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(43, 'STD_VAL13')" v-model="assetList[43].STD_VAL13" class="pl-form text-center"/></td>
            </tr>
            <tr>
              <th scope="row" class="text-center is-bg-light is-bold">4인</th>
              <td class="text-center"><v-text-field @input="setCurrency(44, 'STD_VAL1')" v-model="assetList[44].STD_VAL1" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(44, 'STD_VAL2')" v-model="assetList[44].STD_VAL2" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(44, 'STD_VAL3')" v-model="assetList[44].STD_VAL3" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(44, 'STD_VAL4', 'C')" v-model="assetList[44].STD_VAL4" class="pl-form text-center is-border-red"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(44, 'STD_VAL5')" v-model="assetList[44].STD_VAL5" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(44, 'STD_VAL6')" v-model="assetList[44].STD_VAL6" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(44, 'STD_VAL7')" v-model="assetList[44].STD_VAL7" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(44, 'STD_VAL8')" v-model="assetList[44].STD_VAL8" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(44, 'STD_VAL9')" v-model="assetList[44].STD_VAL9" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(44, 'STD_VAL10')" v-model="assetList[44].STD_VAL10" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(44, 'STD_VAL11')" v-model="assetList[44].STD_VAL11" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(44, 'STD_VAL12')" v-model="assetList[44].STD_VAL12" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(44, 'STD_VAL13')" v-model="assetList[44].STD_VAL13" class="pl-form text-center"/></td>
            </tr>
            <tr>
              <th scope="row" class="text-center is-bg-light is-bold">5인</th>
              <td class="text-center"><v-text-field @input="setCurrency(45, 'STD_VAL1')" v-model="assetList[45].STD_VAL1" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(45, 'STD_VAL2')" v-model="assetList[45].STD_VAL2" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(45, 'STD_VAL3')" v-model="assetList[45].STD_VAL3" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(45, 'STD_VAL4', 'C')" v-model="assetList[45].STD_VAL4" class="pl-form text-center is-border-red"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(45, 'STD_VAL5')" v-model="assetList[45].STD_VAL5" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(45, 'STD_VAL6')" v-model="assetList[45].STD_VAL6" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(45, 'STD_VAL7')" v-model="assetList[45].STD_VAL7" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(45, 'STD_VAL8')" v-model="assetList[45].STD_VAL8" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(45, 'STD_VAL9')" v-model="assetList[45].STD_VAL9" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(45, 'STD_VAL10')" v-model="assetList[45].STD_VAL10" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(45, 'STD_VAL11')" v-model="assetList[45].STD_VAL11" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(45, 'STD_VAL12')" v-model="assetList[45].STD_VAL12" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(45, 'STD_VAL13')" v-model="assetList[45].STD_VAL13" class="pl-form text-center"/></td>
            </tr>
            <tr>
              <th scope="row" class="text-center is-bg-light is-bold">6인</th>
              <td class="text-center"><v-text-field @input="setCurrency(46, 'STD_VAL1')" v-model="assetList[46].STD_VAL1" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(46, 'STD_VAL2')" v-model="assetList[46].STD_VAL2" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(46, 'STD_VAL3')" v-model="assetList[46].STD_VAL3" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(46, 'STD_VAL4', 'C')" v-model="assetList[46].STD_VAL4" class="pl-form text-center is-border-red"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(46, 'STD_VAL5')" v-model="assetList[46].STD_VAL5" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(46, 'STD_VAL6')" v-model="assetList[46].STD_VAL6" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(46, 'STD_VAL7')" v-model="assetList[46].STD_VAL7" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(46, 'STD_VAL8')" v-model="assetList[46].STD_VAL8" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(46, 'STD_VAL9')" v-model="assetList[46].STD_VAL9" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(46, 'STD_VAL10')" v-model="assetList[46].STD_VAL10" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(46, 'STD_VAL11')" v-model="assetList[46].STD_VAL11" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(46, 'STD_VAL12')" v-model="assetList[46].STD_VAL12" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(46, 'STD_VAL13')" v-model="assetList[46].STD_VAL13" class="pl-form text-center"/></td>
            </tr>
            <tr>
              <th scope="row" class="text-center is-bg-light is-bold">7인</th>
              <td class="text-center"><v-text-field @input="setCurrency(47, 'STD_VAL1')" v-model="assetList[47].STD_VAL1" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(47, 'STD_VAL2')" v-model="assetList[47].STD_VAL2" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(47, 'STD_VAL3')" v-model="assetList[47].STD_VAL3" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(47, 'STD_VAL4', 'C')" v-model="assetList[47].STD_VAL4" class="pl-form text-center is-border-red"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(47, 'STD_VAL5')" v-model="assetList[47].STD_VAL5" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(47, 'STD_VAL6')" v-model="assetList[47].STD_VAL6" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(47, 'STD_VAL7')" v-model="assetList[47].STD_VAL7" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(47, 'STD_VAL8')" v-model="assetList[47].STD_VAL8" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(47, 'STD_VAL9')" v-model="assetList[47].STD_VAL9" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(47, 'STD_VAL10')" v-model="assetList[47].STD_VAL10" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(47, 'STD_VAL11')" v-model="assetList[47].STD_VAL11" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(47, 'STD_VAL12')" v-model="assetList[47].STD_VAL12" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(47, 'STD_VAL13')" v-model="assetList[47].STD_VAL13" class="pl-form text-center"/></td>
            </tr>
            <tr>
              <th scope="row" class="text-center is-bg-light is-bold">8인</th>
              <td class="text-center"><v-text-field @input="setCurrency(48, 'STD_VAL1')" v-model="assetList[48].STD_VAL1" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(48, 'STD_VAL2')" v-model="assetList[48].STD_VAL2" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(48, 'STD_VAL3')" v-model="assetList[48].STD_VAL3" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(48, 'STD_VAL4', 'C')" v-model="assetList[48].STD_VAL4" class="pl-form text-center is-border-red"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(48, 'STD_VAL5')" v-model="assetList[48].STD_VAL5" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(48, 'STD_VAL6')" v-model="assetList[48].STD_VAL6" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(48, 'STD_VAL7')" v-model="assetList[48].STD_VAL7" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(48, 'STD_VAL8')" v-model="assetList[48].STD_VAL8" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(48, 'STD_VAL9')" v-model="assetList[48].STD_VAL9" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(48, 'STD_VAL10')" v-model="assetList[48].STD_VAL10" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(48, 'STD_VAL11')" v-model="assetList[48].STD_VAL11" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(48, 'STD_VAL12')" v-model="assetList[48].STD_VAL12" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(48, 'STD_VAL13')" v-model="assetList[48].STD_VAL13" class="pl-form text-center"/></td>
            </tr>
            <tr>
              <th
                scope="row"
                class="text-center is-bg-light is-bold">비고</th>
              <td class="has-textarea" colspan="13">
                <v-textarea
                  class="pl-form is-noresize"
                  :spellcheck="false"
                  v-model="assetList[4].BIGO"
                  v-byte-counter="2000"
                  height="80"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="spacing-wrap sp-24 is-mt-l">
        <!-- 주택유형별 자산 기준 -->
        <div style="width: 50%;">
          <!-- title -->
          <div class="pl-grid-top">
            <div class="pl-grid-top-left spacing-wrap sp-16">
              <strong class="pl-bullet-txt is-blue">주택유형별 자산 기준</strong>
            </div>
          </div>
          <table class="pl-tbl-detail is-mt-s">
            <colgroup>
              <col width="127px" />
              <col width="" span="4"/>
            </colgroup>
            <thead>
              <tr>
                <th scope="col">구분</th>
                <th scope="col">1구간</th>
                <th scope="col">2구간</th>
                <th scope="col">총자산</th>
                <th scope="col">자동차</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row" colspan="3" class="text-center is-bg-light py-1 is-bold">
                  국민 / 통합공공임대 / 다자년 매입임대 / 다나녀 전세임대<br>신혼 &bull; 신생아 매입임대 I &bull; II(1~4순위) / 신혼 &bull; 신생아 전세임대 I &bull; II
                </th>
                <td>
                  <v-text-field @input="setCurrency(23, 'STD_VAL1')" v-model="assetList[23].STD_VAL1" class="pl-form is-auto text-center is-border-red"/>
                </td>
                <td>
                  <v-text-field @input="setCurrency(23, 'STD_VAL2')" v-model="assetList[23].STD_VAL2" class="pl-form is-auto text-center is-border-red"/>
                </td>
              </tr>
              <tr>
                <th scope="row" colspan="3" class="text-center is-bg-light py-1 is-bold">
                  영구임대 / 일반 매입임대 / 고령자 매입임대 / 기존주택 전세임대
                </th>
                <td>
                  <v-text-field @input="setCurrency(24, 'STD_VAL1')" v-model="assetList[24].STD_VAL1" class="pl-form is-auto text-center is-border-red"/>
                </td>
                <td>
                  <v-text-field @input="setCurrency(24, 'STD_VAL2')" v-model="assetList[24].STD_VAL2" class="pl-form is-auto text-center is-border-red"/>
                </td>
              </tr>
              <tr>
                <th scope="row" class="text-center is-bg-light is-bold" rowspan="3">
                  행복주택
                </th>
                <td colspan="2" class="text-center is-bold">대학생</td>
                <td >
                  <v-text-field @input="setCurrency(26, 'STD_VAL1')" v-model="assetList[26].STD_VAL1" class="pl-form is-auto text-center is-border-red"/>
                </td>
                <td >
                  <v-text-field @input="setCurrency(26, 'STD_VAL2')" v-model="assetList[26].STD_VAL2" class="pl-form is-auto text-center is-border-red"/>
                </td>
              </tr>
              <tr>
                <td colspan="2" class="text-center is-bold">청년</td>
                <td>
                  <v-text-field @input="setCurrency(27, 'STD_VAL1')" v-model="assetList[27].STD_VAL1" class="pl-form is-auto text-center is-border-red"/>
                </td>
                <td>
                  <v-text-field @input="setCurrency(27, 'STD_VAL2')" v-model="assetList[27].STD_VAL2" class="pl-form is-auto text-center is-border-red"/>
                </td>
              </tr>
              <tr>
                <td colspan="2" class="text-center is-bold">신혼부부 / 산단 근로자 / 고령자</td>
                <td>
                  <v-text-field @input="setCurrency(28, 'STD_VAL1')" v-model="assetList[28].STD_VAL1" class="pl-form is-auto text-center is-border-red"/>
                </td>
                <td>
                  <v-text-field @input="setCurrency(28, 'STD_VAL2')" v-model="assetList[28].STD_VAL2" class="pl-form is-auto text-center is-border-red"/>
                </td>
              </tr>
              <tr>
                <th scope="row" class="text-center is-bg-light is-bold" rowspan="2">
                  청년 매입임대 / 청년 전세임대
                </th>
                <td colspan="2" class="text-center is-bold">2순위 (본인과 부모)</td>
                <td>
                  <v-text-field @input="setCurrency(29, 'STD_VAL1')" v-model="assetList[29].STD_VAL1" class="pl-form is-auto text-center is-border-red"/>
                </td>
                <td>
                  <v-text-field @input="setCurrency(29, 'STD_VAL2')" v-model="assetList[29].STD_VAL2" class="pl-form is-auto text-center is-border-red"/>
                </td>
              </tr>
              <tr>
                <td colspan="2" class="text-center is-bold">3순위(본인) </td>
                <td>
                  <v-text-field @input="setCurrency(30, 'STD_VAL1')" v-model="assetList[30].STD_VAL1" class="pl-form is-auto text-center is-border-red"/>
                </td>
                <td>
                  <v-text-field @input="setCurrency(30, 'STD_VAL2')" v-model="assetList[30].STD_VAL2" class="pl-form is-auto text-center is-border-red"/>
                </td>
              </tr>
              <tr>
                <th scope="row" colspan="3" class="text-center is-bg-light py-1 is-bold">
                  신혼 희망타운(공공분양형) / 신혼 &bull; 신생아 매입임대 II(5순위)
                </th>
                <td>
                  <v-text-field @input="setCurrency(25, 'STD_VAL1')" v-model="assetList[25].STD_VAL1" class="pl-form is-auto text-center is-border-red"/>
                </td>
                <td>
                  <v-text-field @input="setCurrency(25, 'STD_VAL2')" v-model="assetList[25].STD_VAL2" class="pl-form is-auto text-center is-border-red"/>
                </td>
              </tr>
              <tr>
                <th scope="row" rowspan="3" class="text-center is-bg-light is-bold">
                  공공분양<br><span class="is-txt-blue">(나눔형)</span>
                </th>
                <td colspan="2" class="text-center is-bold">
                  생애최초 / 신혼부부 / 신생아 / 일반공급
                </td>
                <td>
                  <v-text-field @input="setCurrency(49, 'STD_VAL1')" v-model="assetList[49].STD_VAL1" class="pl-form is-auto text-center is-border-red"/>
                </td>
                <td>
                  <v-text-field @input="setCurrency(49, 'STD_VAL2')" v-model="assetList[49].STD_VAL2" class="pl-form is-auto text-center is-border-red"/>
                </td>
              </tr>
              <tr>
                <td rowspan="2" class="text-center is-bold">
                  청년
                </td>
                <td class="text-center is-bold">본인</td>
                <td>
                  <v-text-field @input="setCurrency(50, 'STD_VAL1')" v-model="assetList[50].STD_VAL1" class="pl-form is-auto text-center is-border-red"/>
                </td>
                <td>
                  <v-text-field @input="setCurrency(50, 'STD_VAL2')" v-model="assetList[50].STD_VAL2" class="pl-form is-auto text-center is-border-red"/>
                </td>
              </tr>
              <tr>
                <td class="text-center is-bold">부모</td>
                <td>
                  <v-text-field @input="setCurrency(51, 'STD_VAL1')" v-model="assetList[51].STD_VAL1" class="pl-form is-auto text-center is-border-red"/>
                </td>
                <td>
                  <v-text-field @input="setCurrency(51, 'STD_VAL2')" v-model="assetList[51].STD_VAL2" class="pl-form is-auto text-center is-border-red"/>
                </td>
              </tr>
              <tr>
                <th scope="row" rowspan="3" class="text-center is-bg-light is-bold">
                  분양전환 공공임대<br><span class="is-txt-red">(선택형_6년)</span>
                </th>
                <td colspan="2" class="text-center is-bold">
                  생애최초 / 신혼부부 / 다자녀 / 노부모 부양 / 신생아 / 일반공급
                </td>
                <td>
                  <v-text-field @input="setCurrency(52, 'STD_VAL1')" v-model="assetList[52].STD_VAL1" class="pl-form is-auto text-center is-border-red"/>
                </td>
                <td>
                  <v-text-field @input="setCurrency(52, 'STD_VAL2')" v-model="assetList[52].STD_VAL2" class="pl-form is-auto text-center is-border-red"/>
                </td>
              </tr>
              <tr>
                <td rowspan="2" class="text-center is-bold">
                  청년
                </td>
                <td class="text-center is-bold">본인</td>
                <td>
                  <v-text-field @input="setCurrency(53, 'STD_VAL1')" v-model="assetList[53].STD_VAL1" class="pl-form is-auto text-center is-border-red"/>
                </td>
                <td>
                  <v-text-field @input="setCurrency(53, 'STD_VAL2')" v-model="assetList[53].STD_VAL2" class="pl-form is-auto text-center is-border-red"/>
                </td>
              </tr>
              <tr>
                <td class="text-center is-bold">부모</td>
                <td>
                  <v-text-field @input="setCurrency(54, 'STD_VAL1')" v-model="assetList[54].STD_VAL1" class="pl-form is-auto text-center is-border-red"/>
                </td>
                <td>
                  <v-text-field @input="setCurrency(54, 'STD_VAL2')" v-model="assetList[54].STD_VAL2" class="pl-form is-auto text-center is-border-red"/>
                </td>
              </tr>
            </tbody>
          </table>

          <table class="pl-tbl-detail is-mt-s">
            <colgroup>
              <col width="50%" />
              <col width="" span="2"/>
            </colgroup>
            <thead>
              <tr>
                <th scope="col">구분</th>
                <th scope="col">부동산(토지 &bull; 건물)</th>
                <th scope="col">자동차</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row" class="text-center is-bg-light py-1 is-bold">
                  공공분양(일반형) / 분양전환 공공임대(5 &bull; 10년, 분납임대) /<br> 장기전세 / 신축다세대 / 청년 &bull; 신혼부부 매입임대리츠
                </th>
                <td >
                  <v-text-field @input="setCurrency(31, 'STD_VAL1')" v-model="assetList[31].STD_VAL1" class="pl-form is-auto text-center is-border-red"/>
                </td>
                <td >
                  <v-text-field @input="setCurrency(31, 'STD_VAL2')" v-model="assetList[31].STD_VAL2" class="pl-form is-auto text-center is-border-red"/>
                </td>
              </tr>
            </tbody>
          </table>

        </div>
        <!-- 공공분양(일반형/나눔형) 신혼 희망타운(공공분양형) 분양전환 공공임대(5 10년/분납임대/선택형(6년)) -->
        <div style="width: 50%;">
          <!-- title -->
          <div class="pl-grid-top">
            <div class="pl-grid-top-left spacing-wrap sp-16">
              <strong class="pl-bullet-txt is-blue">공공분양(일반형/나눔형) 신혼 희망타운(공공분양형) 분양전환 공공임대(5 10년/분납임대/선택형(6년))</strong>
            </div>
          </div>
          <table class="pl-tbl-detail is-mt-s">
            <colgroup>
              <col width="100px" />
              <col width="150px" />
              <col width="100px" />
              <col width="16%" span="3"/>
            </colgroup>
            <thead>
              <tr>
                <th scope="col" colspan="2" rowspan="2">유형</th>
                <th scope="col" rowspan="2">직계존속 주택소유</th>
                <th scope="col" rowspan="2">소득</th>
                <th scope="col" colspan="2">자산</th>
              </tr>
              <tr>
                <th scope="col">부동산 &bull; 자동차</th>
                <th scope="col">총자산<br>(별도 자동차 기준X)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scoep="row" colspan="2" class="is-bg-light text-center is-bold">신혼 희망타운(공공분양형)</th>
                <td class="text-center">X</td>
                <td class="text-center">○</td>
                <td class="text-center">-</td>
                <td class="text-center">○</td>
              </tr>
              <tr>
                <th scoep="row" rowspan="4" class="is-bg-light text-center is-bold">공공분양(일반형)</th>
                <td class="text-center is-bold">생애최초/신혼부부/다자녀/신생아</td>
                <td class="text-center">X</td>
                <td class="text-center">○</td>
                <td class="text-center">○</td>
                <td class="text-center">-</td>
              </tr>
              <tr>
                <td class="text-center is-bold">노부모 부양</td>
                <td class="text-center">○</td>
                <td class="text-center">○</td>
                <td class="text-center">○</td>
                <td class="text-center">-</td>
              </tr>
              <tr>
                <td class="text-center is-bold">기관추천/유공자</td>
                <td class="text-center">X</td>
                <td class="text-center">X</td>
                <td class="text-center">X</td>
                <td class="text-center">-</td>
              </tr>
              <tr>
                <td class="text-center is-bold">일반공급</td>
                <td class="text-center">X</td>
                <td class="text-center">○(60㎡ 이하)</td>
                <td class="text-center">○(60㎡ 이하)</td>
                <td class="text-center">-</td>
              </tr>
              <tr>
                <th scoep="row" rowspan="3" class="is-bg-light text-center is-bold">공공분양 <span class="is-txt-blue">(나눔형)</span></th>
                <td class="text-center is-bold">생애최초/신혼부부/다자녀/신생아</td>
                <td class="text-center">X</td>
                <td class="text-center">○</td>
                <td class="text-center">-</td>
                <td class="text-center">○(본인 &bull; 부모)</td>
              </tr>
              <tr>
                <td class="text-center is-bold">청년</td>
                <td class="text-center">X</td>
                <td class="text-center">○(본인)</td>
                <td class="text-center">-</td>
                <td class="text-center">○(85㎡ 이하)</td>
              </tr>
              <tr>
                <td class="text-center is-bold">일반공급</td>
                <td class="text-center">X</td>
                <td class="text-center">○(60㎡ 이하)</td>
                <td class="text-center">-</td>
                <td class="text-center">○</td>
              </tr>

              <tr>
                <th scoep="row" rowspan="4" class="is-bg-light text-center is-bold">분양전환/<br> 공공임대<br> (5 10년/분납임대)</th>
                <td class="text-center is-bold">생애최초/신혼부부/다자녀/신생아</td>
                <td class="text-center">○</td>
                <td class="text-center">○</td>
                <td class="text-center">○</td>
                <td class="text-center">-</td>
              </tr>
              <tr>
                <td class="text-center is-bold">노부모 부양</td>
                <td class="text-center">○</td>
                <td class="text-center">○</td>
                <td class="text-center">○</td>
                <td class="text-center">-</td>
              </tr>
              <tr>
                <td class="text-center is-bold">기관추천/유공자</td>
                <td class="text-center">○</td>
                <td class="text-center">X</td>
                <td class="text-center">X</td>
                <td class="text-center">-</td>
              </tr>
              <tr>
                <td class="text-center is-bold">일반공급</td>
                <td class="text-center">○</td>
                <td class="text-center">○(60㎡ 이하)</td>
                <td class="text-center">○(85㎡ 이하)</td>
                <td class="text-center">-</td>
              </tr>

              <tr>
                <th scoep="row" rowspan="5" class="is-bg-light text-center is-bold">분양임대<br> 공공임대<br><span class="is-txt-red">(선택형_6년)</span></th>
                <td class="text-center is-bold">생애최초/신혼부부/다자녀/신생아</td>
                <td class="text-center">○</td>
                <td class="text-center">○</td>
                <td class="text-center">-</td>
                <td class="text-center">○</td>
              </tr>
              <tr>
                <td class="text-center is-bold">노부모 부양</td>
                <td class="text-center">○</td>
                <td class="text-center">○</td>
                <td class="text-center">-</td>
                <td class="text-center">○</td>
              </tr>
              <tr>
                <td class="text-center is-bold">청년</td>
                <td class="text-center">X</td>
                <td class="text-center">○(본인)</td>
                <td class="text-center">-</td>
                <td class="text-center">○(본인 &bull; 부모)</td>
              </tr>
              <tr>
                <td class="text-center is-bold">기관추천/유공자</td>
                <td class="text-center">○</td>
                <td class="text-center">X</td>
                <td class="text-center">-</td>
                <td class="text-center">X</td>
              </tr>
              <tr>
                <td class="text-center is-bold">일반공급</td>
                <td class="text-center">○</td>
                <td class="text-center">○(85㎡ 이하)</td>
                <td class="text-center">-</td>
                <td class="text-center">○(85㎡ 이하)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="spacing-wrap sp-24 is-mt-l">
        <!-- 국민임대 소득 초과 비율 -->
        <div style="width: 50%;">
          <!-- title -->
          <div class="pl-grid-top">
            <div class="pl-grid-top-left spacing-wrap sp-16">
              <strong class="pl-bullet-txt is-blue">국민임대 소득 초과 비율</strong>
            </div>
          </div>
          <!-- table -->
          <table class="pl-tbl-detail is-mt-s">
            <colgroup>
              <col width="127px" />
              <col width="" span="4"/>
            </colgroup>
            <thead>
              <tr>
                <th scope="col">구분</th>
                <th scope="col">70%</th>
                <th scope="col">110%</th>
                <th scope="col">130%</th>
                <th scope="col">150%</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row" class="text-center is-bg-light is-bold">3인 이하</th>
                <td class="text-center"><v-text-field @input="setCurrency(14, 'STD_VAL1', 'D')" v-model="assetList[14].STD_VAL1" class="pl-form is-auto text-center is-border-red"/></td>
                <td class="text-center"><v-text-field @input="setCurrency(14, 'STD_VAL2')" v-model="assetList[14].STD_VAL2" class="pl-form is-auto text-center"/></td>
                <td class="text-center"><v-text-field @input="setCurrency(14, 'STD_VAL3')" v-model="assetList[14].STD_VAL3" class="pl-form is-auto text-center "/></td>
                <td class="text-center"><v-text-field @input="setCurrency(14, 'STD_VAL4')" v-model="assetList[14].STD_VAL4" class="pl-form is-auto text-center "/></td>
              </tr>
              <tr>
                <th scope="row" class="text-center is-bg-light is-bold">1인 (90%)</th>
                <td class="text-center"><v-text-field @input="setCurrency(15, 'STD_VAL1', 'D')" v-model="assetList[15].STD_VAL1" class="pl-form is-auto text-center is-border-red"/></td>
                <td class="text-center"><v-text-field @input="setCurrency(15, 'STD_VAL2')" v-model="assetList[15].STD_VAL2" class="pl-form is-auto text-center "/></td>
                <td class="text-center"><v-text-field @input="setCurrency(15, 'STD_VAL3')" v-model="assetList[15].STD_VAL3" class="pl-form is-auto text-center "/></td>
                <td class="text-center"><v-text-field @input="setCurrency(15, 'STD_VAL4')" v-model="assetList[15].STD_VAL4" class="pl-form is-auto text-center "/></td>
              </tr>
              <tr>
                <th scope="row" class="text-center is-bg-light is-bold is-bold">2인 (80%)</th>
                <td class="text-center"><v-text-field @input="setCurrency(16, 'STD_VAL1', 'D')" v-model="assetList[16].STD_VAL1" class="pl-form is-auto text-center is-border-red"/></td>
                <td class="text-center"><v-text-field @input="setCurrency(16, 'STD_VAL2')" v-model="assetList[16].STD_VAL2" class="pl-form is-auto text-center "/></td>
                <td class="text-center"><v-text-field @input="setCurrency(16, 'STD_VAL3')" v-model="assetList[16].STD_VAL3" class="pl-form is-auto text-center "/></td>
                <td class="text-center"><v-text-field @input="setCurrency(16, 'STD_VAL4')" v-model="assetList[16].STD_VAL4" class="pl-form is-auto text-center "/></td>
              </tr>
              <tr>
                <th scope="row" class="text-center is-bg-light is-bold">3인</th>
                <td class="text-center"><v-text-field @input="setCurrency(17, 'STD_VAL1', 'D')" v-model="assetList[17].STD_VAL1" class="pl-form is-auto text-center is-border-red"/></td>
                <td class="text-center"><v-text-field @input="setCurrency(17, 'STD_VAL2')" v-model="assetList[17].STD_VAL2" class="pl-form is-auto text-center "/></td>
                <td class="text-center"><v-text-field @input="setCurrency(17, 'STD_VAL3')" v-model="assetList[17].STD_VAL3" class="pl-form is-auto text-center "/></td>
                <td class="text-center"><v-text-field @input="setCurrency(17, 'STD_VAL4')" v-model="assetList[17].STD_VAL4" class="pl-form is-auto text-center "/></td>
              </tr>
              <tr>
                <th scope="row" class="text-center is-bg-light is-bold">4인</th>
                <td class="text-center"><v-text-field @input="setCurrency(18, 'STD_VAL1', 'D')" v-model="assetList[18].STD_VAL1" class="pl-form is-auto text-center is-border-red"/></td>
                <td class="text-center"><v-text-field @input="setCurrency(18, 'STD_VAL2')" v-model="assetList[18].STD_VAL2" class="pl-form is-auto text-center"/></td>
                <td class="text-center"><v-text-field @input="setCurrency(18, 'STD_VAL3')" v-model="assetList[18].STD_VAL3" class="pl-form is-auto text-center"/></td>
                <td class="text-center"><v-text-field @input="setCurrency(18, 'STD_VAL4')" v-model="assetList[18].STD_VAL4" class="pl-form is-auto text-center"/></td>
              </tr>
              <tr>
                <th scope="row" class="text-center is-bg-light is-bold">5인</th>
                <td class="text-center"><v-text-field @input="setCurrency(19, 'STD_VAL1', 'D')" v-model="assetList[19].STD_VAL1" class="pl-form is-auto text-center is-border-red"/></td>
                <td class="text-center"><v-text-field @input="setCurrency(19, 'STD_VAL2')" v-model="assetList[19].STD_VAL2" class="pl-form is-auto text-center "/></td>
                <td class="text-center"><v-text-field @input="setCurrency(19, 'STD_VAL3')" v-model="assetList[19].STD_VAL3" class="pl-form is-auto text-center "/></td>
                <td class="text-center"><v-text-field @input="setCurrency(19, 'STD_VAL4')" v-model="assetList[19].STD_VAL4" class="pl-form is-auto text-center "/></td>
              </tr>
              <tr>
                <th scope="row" class="text-center is-bg-light is-bold">6인</th>
                <td class="text-center"><v-text-field @input="setCurrency(20, 'STD_VAL1', 'D')" v-model="assetList[20].STD_VAL1" class="pl-form is-auto text-center is-border-red"/></td>
                <td class="text-center"><v-text-field @input="setCurrency(20, 'STD_VAL2')" v-model="assetList[20].STD_VAL2" class="pl-form is-auto text-center "/></td>
                <td class="text-center"><v-text-field @input="setCurrency(20, 'STD_VAL3')" v-model="assetList[20].STD_VAL3" class="pl-form is-auto text-center "/></td>
                <td class="text-center"><v-text-field @input="setCurrency(20, 'STD_VAL4')" v-model="assetList[20].STD_VAL4" class="pl-form is-auto text-center "/></td>
              </tr>
              <tr>
                <th scope="row" class="text-center is-bg-light is-bold">7인</th>
                <td class="text-center"><v-text-field @input="setCurrency(21, 'STD_VAL1', 'D')" v-model="assetList[21].STD_VAL1" class="pl-form is-auto text-center is-border-red"/></td>
                <td class="text-center"><v-text-field @input="setCurrency(21, 'STD_VAL2')" v-model="assetList[21].STD_VAL2" class="pl-form is-auto text-center "/></td>
                <td class="text-center"><v-text-field @input="setCurrency(21, 'STD_VAL3')" v-model="assetList[21].STD_VAL3" class="pl-form is-auto text-center "/></td>
                <td class="text-center"><v-text-field @input="setCurrency(21, 'STD_VAL4')" v-model="assetList[21].STD_VAL4" class="pl-form is-auto text-center "/></td>
              </tr>
              <tr>
                <th scope="row" class="text-center is-bg-light is-bold">8인</th>
                <td class="text-center"><v-text-field @input="setCurrency(22, 'STD_VAL1', 'D')" v-model="assetList[22].STD_VAL1" class="pl-form is-auto text-center is-border-red"/></td>
                <td class="text-center"><v-text-field @input="setCurrency(22, 'STD_VAL2')" v-model="assetList[22].STD_VAL2" class="pl-form is-auto text-center "/></td>
                <td class="text-center"><v-text-field @input="setCurrency(22, 'STD_VAL3')" v-model="assetList[22].STD_VAL3" class="pl-form is-auto text-center "/></td>
                <td class="text-center"><v-text-field @input="setCurrency(22, 'STD_VAL4')" v-model="assetList[22].STD_VAL4" class="pl-form is-auto text-center "/></td>
              </tr>
              <tr>
                <th
                  scope="row"
                  class="text-center is-bg-light is-bold">비고</th>
                <td class="has-textarea" colspan="4">
                  <v-textarea
                    class="pl-form is-noresize"
                    :spellcheck="false"
                    v-model="assetList[2].BIGO"
                    v-byte-counter="2000"
                    height="80"
                  />
                </td>
              </tr>
            </tbody>
          </table>

        </div>
        <!-- 자산기준 – 공공분양(나눔형/신혼희망타운) 공공임대주택 [분양전환 공공임대(510년)/장기전세/신축다세대/청년신혼부부 매입임대리츠 제외 -->
        <div style="width: 50%;">
          <!-- title -->
          <div class="pl-grid-top">
            <div class="pl-grid-top-left spacing-wrap sp-16">
              <strong class="pl-bullet-txt is-blue">자산기준 - 공공분양(나눔형/신혼희망타운) &bull; 공공임대주택 [분양전환 공공임대(5 &bull; 10년)/장기전세/신축다세대/청년 &bull; 신혼부부 매입임대리츠 제외</strong>
            </div>
          </div>
          <!-- table -->
          <table class="pl-tbl-detail is-mt-s" style="height: calc(100% - 38px)">
            <colgroup>
              <col width="127px" />
              <col width="" />
            </colgroup>
            <thead>
              <tr>
                <th scope="col">구분</th>
                <th scope="col">상세</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row" class="text-center is-bg-light is-bold">총자산</th>
                <td class="has-textarea">
                  1. 부동산<br>
                  2. 자동차 - 해당 세대가 보유한 <strong>모든 자동차</strong>의 가액을 합산<br>
                   (장애인용 자동차 국가유공자로서 보철용 차량 제외 및 국가나 지자체의 보조를 받고 구입한 저공해 자동차의 경우<br>
                   정부와 지자체의 보조금 제외한 금액만 합산)<br>
                  3. 금융자산<br>
                  4. 기타 자산<br>
                  5. 부채 - 총자산 상정 시 자산합계 금액에서 차감 
                </td>
              </tr>
              <tr>
                <th scope="row" class="text-center is-bg-light is-bold">자동차</th>
                <td class="has-textarea">
                  ※  총 자산가액으로 포함된 자동차는 자동차액과 별도로 [자동차 관리법] 시행규칙 제2조에서 정한 <strong>비영업용 승용 자동차에 한하여</strong> 산출하고, <strong>해당 세대가 2대 이상의 자동차를 소유한 경우에는 각각의 자동차 가액</strong> 중 높은 차량 가액을 기준으로 하야 아래의 경우를 제외함.<br>
                  <br>
                  - [장애인 복지법] 제39조에 따른 장애인 사용 자동차<br>
                  - [국가유공자 등 예우와 지원에 관한 법률]에 따른 국가유공자로서 상이 등급 1급 내지 7급에 해당하는 자의 보철용 차량<br>
                  <br>
                  ※  자동차 가액 산출 시 [대기환경보전법] 제59조 제 3항에 따른 국가나 지방자치 단체의 보조를 받고 구입한 저공해 자동차의 경우 자동차 가액에서 정부와 지방자치단체의 보조금을 제외한 금액으로 함
                </td>
              </tr>
            </tbody>
          </table>
         </div>
      </div>

      <!-- 전세임대  매입임대 갱신계약 소득 기준 -->
      <div class="is-mt-l">
        <!-- title -->
        <div class="pl-grid-top">
          <div class="pl-grid-top-left spacing-wrap sp-16">
            <strong class="pl-bullet-txt is-blue">전세임대 - 매입임대 갱신계약 소득 기준</strong>
          </div>
        </div>
        <!-- table -->
        <table class="pl-tbl-detail is-mt-s">
          <colgroup>
            <col width="127px" />
            <col width="" span="12"/>
          </colgroup>
          <thead>
            <tr>
              <th scope="col">가구 원수</th>
              <th scope="col">50%</th>
              <th scope="col">52.5%</th>
              <th scope="col">55%</th>
              <th scope="col">65%</th>
              <th scope="col">70%</th>
              <th scope="col">73.5%</th>
              <th scope="col">75%</th>
              <th scope="col">77%</th>
              <th scope="col">80%</th>
              <th scope="col">90%</th>
              <th scope="col">91%</th>
              <th scope="col">100%</th>
              <th scope="col">105%</th>
              <th scope="col">110%</th>
              <th scope="col">120%</th>
              <th scope="col">130%</th>
              <th scope="col">132%</th>
              <th scope="col">156%</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row" class="text-center is-bg-light is-bold">3인 이하</th>
              <td class="text-center"><v-text-field @input="setCurrency(32, 'STD_VAL1')" v-model="assetList[32].STD_VAL1" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(32, 'STD_VAL2')" v-model="assetList[32].STD_VAL2" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(32, 'STD_VAL3')" v-model="assetList[32].STD_VAL3" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(32, 'STD_VAL4')" v-model="assetList[32].STD_VAL4" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(32, 'STD_VAL5')" v-model="assetList[32].STD_VAL5" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(32, 'STD_VAL6')" v-model="assetList[32].STD_VAL6" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(32, 'STD_VAL7')" v-model="assetList[32].STD_VAL7" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(32, 'STD_VAL8')" v-model="assetList[32].STD_VAL8" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(32, 'STD_VAL9')" v-model="assetList[32].STD_VAL9" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(32, 'STD_VAL10')" v-model="assetList[32].STD_VAL10" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(32, 'STD_VAL11')" v-model="assetList[32].STD_VAL11" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(32, 'STD_VAL12', 'E')" v-model="assetList[32].STD_VAL12" class="pl-form text-center is-border-red"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(32, 'STD_VAL13')" v-model="assetList[32].STD_VAL13" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(32, 'STD_VAL14')" v-model="assetList[32].STD_VAL14" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(32, 'STD_VAL15')" v-model="assetList[32].STD_VAL15" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(32, 'STD_VAL16')" v-model="assetList[32].STD_VAL16" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(32, 'STD_VAL17')" v-model="assetList[32].STD_VAL17" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(32, 'STD_VAL18')" v-model="assetList[32].STD_VAL18" class="pl-form text-center"/></td>
            </tr>
            <tr>
              <th scope="row" class="text-center is-bg-light is-bold">1인 (20%p 가산)</th>
              <td class="text-center"><v-text-field @input="setCurrency(33, 'STD_VAL1')" v-model="assetList[33].STD_VAL1" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(33, 'STD_VAL2')" v-model="assetList[33].STD_VAL2" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(33, 'STD_VAL3')" v-model="assetList[33].STD_VAL3" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(33, 'STD_VAL4')" v-model="assetList[33].STD_VAL4" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(33, 'STD_VAL5')" v-model="assetList[33].STD_VAL5" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(33, 'STD_VAL6')" v-model="assetList[33].STD_VAL6" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(33, 'STD_VAL7')" v-model="assetList[33].STD_VAL7" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(33, 'STD_VAL8')" v-model="assetList[33].STD_VAL8" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(33, 'STD_VAL9')" v-model="assetList[33].STD_VAL9" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(33, 'STD_VAL10')" v-model="assetList[33].STD_VAL10" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(33, 'STD_VAL11')" v-model="assetList[33].STD_VAL11" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(33, 'STD_VAL12', 'E')" v-model="assetList[33].STD_VAL12" class="pl-form text-center is-border-red"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(33, 'STD_VAL13')" v-model="assetList[33].STD_VAL13" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(33, 'STD_VAL14')" v-model="assetList[33].STD_VAL14" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(33, 'STD_VAL15')" v-model="assetList[33].STD_VAL15" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(33, 'STD_VAL16')" v-model="assetList[33].STD_VAL16" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(33, 'STD_VAL17')" v-model="assetList[33].STD_VAL17" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(33, 'STD_VAL18')" v-model="assetList[33].STD_VAL18" class="pl-form text-center"/></td>
            </tr>
            <tr>
              <th scope="row" class="text-center is-bg-light is-bold">2인 (10%p 가산)</th>
              <td class="text-center"><v-text-field @input="setCurrency(34, 'STD_VAL1')" v-model="assetList[34].STD_VAL1" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(34, 'STD_VAL2')" v-model="assetList[34].STD_VAL2" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(34, 'STD_VAL3')" v-model="assetList[34].STD_VAL3" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(34, 'STD_VAL4')" v-model="assetList[34].STD_VAL4" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(34, 'STD_VAL5')" v-model="assetList[34].STD_VAL5" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(34, 'STD_VAL6')" v-model="assetList[34].STD_VAL6" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(34, 'STD_VAL7')" v-model="assetList[34].STD_VAL7" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(34, 'STD_VAL8')" v-model="assetList[34].STD_VAL8" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(34, 'STD_VAL9')" v-model="assetList[34].STD_VAL9" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(34, 'STD_VAL10')" v-model="assetList[34].STD_VAL10" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(34, 'STD_VAL11')" v-model="assetList[34].STD_VAL11" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(34, 'STD_VAL12', 'E')" v-model="assetList[34].STD_VAL12" class="pl-form text-center is-border-red"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(34, 'STD_VAL13')" v-model="assetList[34].STD_VAL13" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(34, 'STD_VAL14')" v-model="assetList[34].STD_VAL14" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(34, 'STD_VAL15')" v-model="assetList[34].STD_VAL15" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(34, 'STD_VAL16')" v-model="assetList[34].STD_VAL16" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(34, 'STD_VAL17')" v-model="assetList[34].STD_VAL17" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(34, 'STD_VAL18')" v-model="assetList[34].STD_VAL18" class="pl-form text-center"/></td>
            </tr>
            <tr>
              <th scope="row" class="text-center is-bg-light is-bold">3인</th>
              <td class="text-center"><v-text-field @input="setCurrency(35, 'STD_VAL1')" v-model="assetList[35].STD_VAL1" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(35, 'STD_VAL2')" v-model="assetList[35].STD_VAL2" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(35, 'STD_VAL3')" v-model="assetList[35].STD_VAL3" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(35, 'STD_VAL4')" v-model="assetList[35].STD_VAL4" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(35, 'STD_VAL5')" v-model="assetList[35].STD_VAL5" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(35, 'STD_VAL6')" v-model="assetList[35].STD_VAL6" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(35, 'STD_VAL7')" v-model="assetList[35].STD_VAL7" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(35, 'STD_VAL8')" v-model="assetList[35].STD_VAL8" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(35, 'STD_VAL9')" v-model="assetList[35].STD_VAL9" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(35, 'STD_VAL10')" v-model="assetList[35].STD_VAL10" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(35, 'STD_VAL11')" v-model="assetList[35].STD_VAL11" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(35, 'STD_VAL12', 'E')" v-model="assetList[35].STD_VAL12" class="pl-form text-center is-border-red"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(35, 'STD_VAL13')" v-model="assetList[35].STD_VAL13" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(35, 'STD_VAL14')" v-model="assetList[35].STD_VAL14" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(35, 'STD_VAL15')" v-model="assetList[35].STD_VAL15" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(35, 'STD_VAL16')" v-model="assetList[35].STD_VAL16" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(35, 'STD_VAL17')" v-model="assetList[35].STD_VAL17" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(35, 'STD_VAL18')" v-model="assetList[35].STD_VAL18" class="pl-form text-center"/></td>
            </tr>
            <tr>
              <th scope="row" class="text-center is-bg-light is-bold">4인</th>
              <td class="text-center"><v-text-field @input="setCurrency(36, 'STD_VAL1')" v-model="assetList[36].STD_VAL1" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(36, 'STD_VAL2')" v-model="assetList[36].STD_VAL2" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(36, 'STD_VAL3')" v-model="assetList[36].STD_VAL3" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(36, 'STD_VAL4')" v-model="assetList[36].STD_VAL4" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(36, 'STD_VAL5')" v-model="assetList[36].STD_VAL5" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(36, 'STD_VAL6')" v-model="assetList[36].STD_VAL6" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(36, 'STD_VAL7')" v-model="assetList[36].STD_VAL7" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(36, 'STD_VAL8')" v-model="assetList[36].STD_VAL8" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(36, 'STD_VAL9')" v-model="assetList[36].STD_VAL9" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(36, 'STD_VAL10')" v-model="assetList[36].STD_VAL10" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(36, 'STD_VAL11')" v-model="assetList[36].STD_VAL11" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(36, 'STD_VAL12', 'E')" v-model="assetList[36].STD_VAL12" class="pl-form text-center is-border-red"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(36, 'STD_VAL13')" v-model="assetList[36].STD_VAL13" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(36, 'STD_VAL14')" v-model="assetList[36].STD_VAL14" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(36, 'STD_VAL15')" v-model="assetList[36].STD_VAL15" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(36, 'STD_VAL16')" v-model="assetList[36].STD_VAL16" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(36, 'STD_VAL17')" v-model="assetList[36].STD_VAL17" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(36, 'STD_VAL18')" v-model="assetList[36].STD_VAL18" class="pl-form text-center"/></td>
            </tr>
            <tr>
              <th scope="row" class="text-center is-bg-light is-bold">5인</th>
              <td class="text-center"><v-text-field @input="setCurrency(37, 'STD_VAL1')" v-model="assetList[37].STD_VAL1" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(37, 'STD_VAL2')" v-model="assetList[37].STD_VAL2" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(37, 'STD_VAL3')" v-model="assetList[37].STD_VAL3" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(37, 'STD_VAL4')" v-model="assetList[37].STD_VAL4" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(37, 'STD_VAL5')" v-model="assetList[37].STD_VAL5" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(37, 'STD_VAL6')" v-model="assetList[37].STD_VAL6" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(37, 'STD_VAL7')" v-model="assetList[37].STD_VAL7" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(37, 'STD_VAL8')" v-model="assetList[37].STD_VAL8" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(37, 'STD_VAL9')" v-model="assetList[37].STD_VAL9" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(37, 'STD_VAL10')" v-model="assetList[37].STD_VAL10" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(37, 'STD_VAL11')" v-model="assetList[37].STD_VAL11" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(37, 'STD_VAL12', 'E')" v-model="assetList[37].STD_VAL12" class="pl-form text-center is-border-red"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(37, 'STD_VAL13')" v-model="assetList[37].STD_VAL13" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(37, 'STD_VAL14')" v-model="assetList[37].STD_VAL14" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(37, 'STD_VAL15')" v-model="assetList[37].STD_VAL15" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(37, 'STD_VAL16')" v-model="assetList[37].STD_VAL16" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(37, 'STD_VAL17')" v-model="assetList[37].STD_VAL17" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(37, 'STD_VAL18')" v-model="assetList[37].STD_VAL18" class="pl-form text-center"/></td>
            </tr>
            <tr>
              <th scope="row" class="text-center is-bg-light is-bold">6인</th>
              <td class="text-center"><v-text-field @input="setCurrency(38, 'STD_VAL1')" v-model="assetList[38].STD_VAL1" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(38, 'STD_VAL2')" v-model="assetList[38].STD_VAL2" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(38, 'STD_VAL3')" v-model="assetList[38].STD_VAL3" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(38, 'STD_VAL4')" v-model="assetList[38].STD_VAL4" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(38, 'STD_VAL5')" v-model="assetList[38].STD_VAL5" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(38, 'STD_VAL6')" v-model="assetList[38].STD_VAL6" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(38, 'STD_VAL7')" v-model="assetList[38].STD_VAL7" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(38, 'STD_VAL8')" v-model="assetList[38].STD_VAL8" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(38, 'STD_VAL9')" v-model="assetList[38].STD_VAL9" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(38, 'STD_VAL10')" v-model="assetList[38].STD_VAL10" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(38, 'STD_VAL11')" v-model="assetList[38].STD_VAL11" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(38, 'STD_VAL12', 'E')" v-model="assetList[38].STD_VAL12" class="pl-form text-center is-border-red"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(38, 'STD_VAL13')" v-model="assetList[38].STD_VAL13" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(38, 'STD_VAL14')" v-model="assetList[38].STD_VAL14" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(38, 'STD_VAL15')" v-model="assetList[38].STD_VAL15" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(38, 'STD_VAL16')" v-model="assetList[38].STD_VAL16" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(38, 'STD_VAL17')" v-model="assetList[38].STD_VAL17" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(38, 'STD_VAL18')" v-model="assetList[38].STD_VAL18" class="pl-form text-center"/></td>
            </tr>
            <tr>
              <th scope="row" class="text-center is-bg-light is-bold">7인</th>
              <td class="text-center"><v-text-field @input="setCurrency(39, 'STD_VAL1')" v-model="assetList[39].STD_VAL1" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(39, 'STD_VAL2')" v-model="assetList[39].STD_VAL2" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(39, 'STD_VAL3')" v-model="assetList[39].STD_VAL3" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(39, 'STD_VAL4')" v-model="assetList[39].STD_VAL4" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(39, 'STD_VAL5')" v-model="assetList[39].STD_VAL5" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(39, 'STD_VAL6')" v-model="assetList[39].STD_VAL6" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(39, 'STD_VAL7')" v-model="assetList[39].STD_VAL7" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(39, 'STD_VAL8')" v-model="assetList[39].STD_VAL8" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(39, 'STD_VAL9')" v-model="assetList[39].STD_VAL9" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(39, 'STD_VAL10')" v-model="assetList[39].STD_VAL10" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(39, 'STD_VAL11')" v-model="assetList[39].STD_VAL11" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(39, 'STD_VAL12', 'E')" v-model="assetList[39].STD_VAL12" class="pl-form text-center is-border-red"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(39, 'STD_VAL13')" v-model="assetList[39].STD_VAL13" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(39, 'STD_VAL14')" v-model="assetList[39].STD_VAL14" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(39, 'STD_VAL15')" v-model="assetList[39].STD_VAL15" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(39, 'STD_VAL16')" v-model="assetList[39].STD_VAL16" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(39, 'STD_VAL17')" v-model="assetList[39].STD_VAL17" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(39, 'STD_VAL18')" v-model="assetList[39].STD_VAL18" class="pl-form text-center"/></td>
            </tr>
            <tr>
              <th scope="row" class="text-center is-bg-light is-bold">8인</th>
              <td class="text-center"><v-text-field @input="setCurrency(40, 'STD_VAL1')" v-model="assetList[40].STD_VAL1" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(40, 'STD_VAL2')" v-model="assetList[40].STD_VAL2" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(40, 'STD_VAL3')" v-model="assetList[40].STD_VAL3" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(40, 'STD_VAL4')" v-model="assetList[40].STD_VAL4" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(40, 'STD_VAL5')" v-model="assetList[40].STD_VAL5" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(40, 'STD_VAL6')" v-model="assetList[40].STD_VAL6" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(40, 'STD_VAL7')" v-model="assetList[40].STD_VAL7" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(40, 'STD_VAL8')" v-model="assetList[40].STD_VAL8" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(40, 'STD_VAL9')" v-model="assetList[40].STD_VAL9" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(40, 'STD_VAL10')" v-model="assetList[40].STD_VAL10" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(40, 'STD_VAL11')" v-model="assetList[40].STD_VAL11" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(40, 'STD_VAL12', 'E')" v-model="assetList[40].STD_VAL12" class="pl-form text-center is-border-red"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(40, 'STD_VAL13')" v-model="assetList[40].STD_VAL13" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(40, 'STD_VAL14')" v-model="assetList[40].STD_VAL14" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(40, 'STD_VAL15')" v-model="assetList[40].STD_VAL15" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(40, 'STD_VAL16')" v-model="assetList[40].STD_VAL16" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(40, 'STD_VAL17')" v-model="assetList[40].STD_VAL17" class="pl-form text-center"/></td>
              <td class="text-center"><v-text-field @input="setCurrency(40, 'STD_VAL18')" v-model="assetList[40].STD_VAL18" class="pl-form text-center"/></td>
            </tr>
            <tr>
              <th
                scope="row"
                class="text-center is-bg-light is-bold">비고</th>
              <td class="has-textarea" colspan="18">
                <v-textarea
                  class="pl-form is-noresize"
                  :spellcheck="false"
                  v-model="assetList[3].BIGO"
                  v-byte-counter="2000"
                  height="80"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>

    <!-- footer -->
     <div class="pl-quick-layer-footer pl-btn-wrap" >
       <v-btn class="pl-btn is-trans ml-auto" @click="close">닫기</v-btn>
      <v-btn class="pl-btn" @click="clickSaveBtn">저장</v-btn>
     </div>

  </div>
</template>

<script>
export default {
  name: 'RightAssetStat', //소득자산 기준표
  components: {
  },
  data() {
    return {
      // 소득자산 기준표 항목 초기화
      assetList: new Array(55).fill().map(item=>{
        item = { 
          STD_CODE: ""
          , STD_VAL: ""
          , BIGO: ""
          , STD_VAL1: ""
          , STD_VAL2: ""
          , STD_VAL3: ""
          , STD_VAL4: ""
          , STD_VAL5: ""
          , STD_VAL6: ""
          , STD_VAL7: ""
          , STD_VAL8: ""
          , STD_VAL9: ""
          , STD_VAL10: ""
          , STD_VAL11: ""
          , STD_VAL12: ""
          , STD_VAL13: ""
          , STD_VAL14: ""
          , STD_VAL15: ""
          , STD_VAL16: ""
          , STD_VAL17: ""
          , STD_VAL18: ""
          , STD_VAL19: ""
          , STD_VAL20: ""
        }
        return item
      })
    }
  },
  methods:
  {
    // 소득자산 기준표 조회
    async selectIncomeAsset(){

      // let sUrl = '/phone-api/cuttSupp/selectIncomeAsset';
      let sUrl = '/api/biz/common/select/selectIncomeAsset';

      let postParam = {};

      let headParam = { head : {
        ns : 'lhcs.phone.cuttSupp.dao.xml.PhoneCuttSupportMapper'
        , sn : 'selectIncomeAsset'
      }};

      let response  = await this.common_postCall(sUrl, postParam, headParam);

      if(!response.HEADER.ERROR_FLAG) {
        this.assetList = response.DATA;
        if(this.computedUserType != "LEADER"){
          this.assetList[26].STD_VAL2 = this.assetList[26].STD_VAL2 == "0" ? "미소유": this.assetList[26].STD_VAL2;
          this.assetList[25].STD_VAL2 = "-";
        }
      }else{
        this.showAlertCaution({msg:"일시적인 장애이거나 네크워크 문제일 수 있습니다.잠시 후 다시 이용해주세요.<br><br>계속하여 동일 메시지가 발생하면 시스템관리자에게 문의해 주십시오."});
      }
    },

    // 통화 처리
    setCurrency(index, col, type){
      // this.assetList[index][col] = this.assetList[index][col].replace(/[^0-9]/g,"").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      // this.assetList[index][col] = this.mixin_nvl(this.assetList[index][col], 0);

      let num = parseInt(this.assetList[index][col].replace(/[^0-9]/g,""));
      if(isNaN(num)) {
          this.assetList[index][col] = 0;
      }else {
        if(type == "A" || type == "B") {
          // 전년도 도시근로자 가구당 평균 소득
          // 전년도 도시근로자 가구원수별 월평균 소득
          this.assetList[index].STD_VAL1 = Math.round((num*0.5)).toLocaleString('ko-KR');
          this.assetList[index].STD_VAL2 = Math.round((num*0.6)).toLocaleString('ko-KR');
          this.assetList[index].STD_VAL3 = Math.round((num*0.7)).toLocaleString('ko-KR');
          this.assetList[index].STD_VAL4 = Math.round((num*0.8)).toLocaleString('ko-KR');
          this.assetList[index].STD_VAL5 = Math.round((num*0.9)).toLocaleString('ko-KR');
          this.assetList[index].STD_VAL6 = Math.round((num*1.0)).toLocaleString('ko-KR');
          this.assetList[index].STD_VAL7 = Math.round((num*1.1)).toLocaleString('ko-KR');
          this.assetList[index].STD_VAL8 = Math.round((num*1.2)).toLocaleString('ko-KR');
          this.assetList[index].STD_VAL9 = Math.round((num*1.3)).toLocaleString('ko-KR');
          this.assetList[index].STD_VAL10 = Math.round((num*1.4)).toLocaleString('ko-KR');
          this.assetList[index].STD_VAL11 = Math.round((num*1.5)).toLocaleString('ko-KR');
          this.assetList[index].STD_VAL12= Math.round((num*2.0)).toLocaleString('ko-KR');
        }else if(type == "C"){
          // 가구원수별 기준 중위 소득
          this.assetList[index].STD_VAL1 = Math.round((num*0.3)).toLocaleString('ko-KR');
          this.assetList[index].STD_VAL2 = Math.round((num*0.5)).toLocaleString('ko-KR');
          this.assetList[index].STD_VAL3 = Math.round((num*0.7)).toLocaleString('ko-KR');
          this.assetList[index].STD_VAL4 = Math.round((num*1.0)).toLocaleString('ko-KR');
          this.assetList[index].STD_VAL5 = Math.round((num*1.1)).toLocaleString('ko-KR');
          this.assetList[index].STD_VAL6 = Math.round((num*1.2)).toLocaleString('ko-KR');
          this.assetList[index].STD_VAL7 = Math.round((num*1.3)).toLocaleString('ko-KR');
          this.assetList[index].STD_VAL8 = Math.round((num*1.5)).toLocaleString('ko-KR');
          this.assetList[index].STD_VAL9 = Math.round((num*1.6)).toLocaleString('ko-KR');
          this.assetList[index].STD_VAL10 = Math.round((num*1.7)).toLocaleString('ko-KR');
          this.assetList[index].STD_VAL11 = Math.round((num*1.8)).toLocaleString('ko-KR');
          this.assetList[index].STD_VAL12= Math.round((num*1.9)).toLocaleString('ko-KR');
          this.assetList[index].STD_VAL13= Math.round((num*2.0)).toLocaleString('ko-KR');
        }else if(type == "D"){
          // 국민임대 소득 초과 비율
          this.assetList[index].STD_VAL1 = Math.round((num*1.0)).toLocaleString('ko-KR');
          this.assetList[index].STD_VAL2 = Math.round((num*1.1)).toLocaleString('ko-KR');
          this.assetList[index].STD_VAL3 = Math.round((num*1.3)).toLocaleString('ko-KR');
          this.assetList[index].STD_VAL4 = Math.round((num*1.5)).toLocaleString('ko-KR');
        }else if(type == "E"){
          // 가구원수별 기준 중위 소득
          this.assetList[index].STD_VAL1 = Math.round((num*0.5)).toLocaleString('ko-KR');
          this.assetList[index].STD_VAL2 = Math.round((num*0.525)).toLocaleString('ko-KR');
          this.assetList[index].STD_VAL3 = Math.round((num*0.55)).toLocaleString('ko-KR');
          this.assetList[index].STD_VAL4 = Math.round((num*0.65)).toLocaleString('ko-KR');
          this.assetList[index].STD_VAL5 = Math.round((num*0.70)).toLocaleString('ko-KR');
          this.assetList[index].STD_VAL6 = Math.round((num*0.735)).toLocaleString('ko-KR');
          this.assetList[index].STD_VAL7 = Math.round((num*0.75)).toLocaleString('ko-KR');
          this.assetList[index].STD_VAL8 = Math.round((num*0.77)).toLocaleString('ko-KR');
          this.assetList[index].STD_VAL9 = Math.round((num*0.8)).toLocaleString('ko-KR');
          this.assetList[index].STD_VAL10 = Math.round((num*0.9)).toLocaleString('ko-KR');
          this.assetList[index].STD_VAL11 = Math.round((num*0.91)).toLocaleString('ko-KR');
          this.assetList[index].STD_VAL12= Math.round((num*1.0)).toLocaleString('ko-KR');
          this.assetList[index].STD_VAL13= Math.round((num*1.05)).toLocaleString('ko-KR');
          this.assetList[index].STD_VAL14= Math.round((num*1.1)).toLocaleString('ko-KR');
          this.assetList[index].STD_VAL15= Math.round((num*1.2)).toLocaleString('ko-KR');
          this.assetList[index].STD_VAL16= Math.round((num*1.3)).toLocaleString('ko-KR');
          this.assetList[index].STD_VAL17= Math.round((num*1.32)).toLocaleString('ko-KR');
          this.assetList[index].STD_VAL18= Math.round((num*1.56)).toLocaleString('ko-KR');
        }
      }  
    },

    // 저장
    clickSaveBtn(){
      if(this.computedUserType != "LEADER") return;

      this.showConfirmInfo({
        msg:'저장하시겠습니까?'
        , callYes: () => {
          this.saveIncomeAsset();
          this.closeAlert();
        }
        , callNo: this.closeAlert
      });
    },

    // 소득자산 기준표 저장
    async saveIncomeAsset(){
      let sUrl = '/phone-api/cuttSupp/saveIncomeAsset';
      // let sUrl = '/api/biz/common/update/saveIncomeAsset';

      let postParam = {
        assetList: this.assetList
      };

      let headParam = { head : {
        DATA_OBJECT: "assetList"
      }};

      let response  = await this.common_postCall(sUrl, postParam, headParam);

      if(!response.HEADER.ERROR_FLAG) {
        this.showToastSuccess({msg : '저장되었습니다.'});
      }else{
        this.showAlertCaution({msg:"일시적인 장애이거나 네크워크 문제일 수 있습니다.잠시 후 다시 이용해주세요.<br><br>계속하여 동일 메시지가 발생하면 시스템관리자에게 문의해 주십시오."});
      }
    },

    // 닫기
    close(){
      this.$emit("Close");
    }
  },
  mounted() {
    // 소득자산 기준표 조회
    this.selectIncomeAsset();
  },
  created() {
  },
  computed: {
  },
  watch:{
  },
};
</script>

<style lang="scss" scoped>

</style>