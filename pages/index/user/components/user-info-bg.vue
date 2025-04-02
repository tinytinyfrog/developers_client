<template>
  <div class="user-info-bg">
    <div class="bom" />
    <div class="bom" />
    <div class="bom" />
    <div class="bom" />
    <div class="bom" />
    <div class="bom" />
  </div>
</template>
<style lang="less" scoped>
@keyframes move {
  0% {
    filter: unset;
  }

  100% {
    filter: hue-rotate(360deg);
  }
}
.user-info-bg {
  position: relative;
  height: 200px;
  display: flex;
  opacity: 0.8;
  .bom {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    border-top-left-radius: @g-radius;
    border-top-right-radius: @g-radius;
    &:nth-child(1) {
      background: linear-gradient(
          238deg,
          rgb(130, 255, 0) 0%,
          rgb(0, 84, 166) 100%
      );
      animation: move 12s infinite linear;
    }
    &:nth-child(2) {
      background: linear-gradient(238deg, rgb(33, 200, 69) 0%, rgb(0, 0, 100) 100%);
      mix-blend-mode: overlay;
      animation: move 60s infinite linear;
    }

    &:nth-child(3) {
      background: linear-gradient(238deg, rgb(200, 255, 255) 48%, rgb(3, 0, 151) 100%);
      mix-blend-mode: multiply;
      animation: move 60s infinite linear;
    }

    &:nth-child(4) {
      background: radial-gradient(
          100% 85% at 0% 100%,
          rgb(0, 0, 0) 0%,
          rgb(0, 131, 255) 50%,
          rgb(255, 0, 0) 100%
      );
      mix-blend-mode: difference;
      animation: move 60s infinite linear;
    }

    &:nth-child(5) {
      background: radial-gradient(
          100% 225% at 0% 100%,
          rgb(255, 0, 0) 0%,
          rgb(66, 255, 0) 100%
      );
      mix-blend-mode: difference;
      animation: move 60s infinite linear;
    }

    &:nth-child(6) {
      background: radial-gradient(
          100% 140% at 100% 0%,
          rgb(0, 134, 62) 0%,
          rgb(0, 239, 255) 50%,
          rgb(0, 113, 186) 100%
      );
      mix-blend-mode: overlay;
      animation: move 60s infinite linear;
    }
  }
}
@media screen and (max-width: 1000px) {
  .user-info-bg {
    height: 150px;
  }
}
</style>
