<template>
  <div class="no-result full-screen-wrapper">
    <div class="content">
      <div class="no-result-icon" :style="getImg()"></div>
      <p class="no-result-text">{{title}}</p>
    </div>
    <slot></slot>
  </div>
</template>

<script type="text/ecmascript-6">
  import noImg from './no-result@2x.png';

  export default {
    props: {
      title: {
        type: String,
        default: ''
      },
      icon: {
        type: String,
        default: ''
      }
    },
    methods: {
      getImg() {
        return {
          backgroundImage: `url('${this.icon || noImg}')`
        };
      }
    }
  };
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import "~common/scss/variable";

  .no-result {
    text-align: center;
    .content {
      margin-top: 4rem;
      .no-result-icon {
        width: 2.4rem;
        height: 2.4rem;
        background-repeat: no-repeat;
        margin: 0 auto;
        background-size: contain;
        background-position: center;
      }
      .no-result-text {
        margin-top: 0.3rem;
        font-size: $font-size-medium-x;
        color: $color-text-d;
      }
    }
  }
</style>
