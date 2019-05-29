<template>
  <div class="pro">
    <router-link tag="dl" :to="`/indexDetail/${contentid}`">
      <dt>
        <img :src="pic">
      </dt>
      <dd>
        <p>{{proTitle}}}</p>
        <p>{{describe}}</p>
        <p>{{times}}</p>
      </dd>
    </router-link>
  </div>
</template>

<script>
export default {
  props: {
    proTitle: {
      type: String,
      default: ''
    },
    describe: {
      type: String,
      default: ''
    },
    pic: {
      type: String,
      default: ''
    },
    contentid: {
      type: String,
      default: ''
    },
    times: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang='scss' scoped>
.pro {
  @include wh(100%, auto);
  background: #fff;
  padding: 0.1rem;
  box-sizing: border-box;
  // margin-bottom: -.5rem;
  dl {
    @include wh(100%, auto);
    display: flex;
    dt {
      @include wh(34%, auto);
      img {
        @include wh(90%, auto);
      }
    }
    dd {
      @include wh(66%, auto);
      p:first-child {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        font-size: 0.14rem;
        line-height: 0.25rem;
        color: #000;
      }
      p:nth-child(2) {
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 3;
        overflow: hidden;
      }
      p:last-child {
        color: #ccc;
        line-height: 0.4rem;
      }
    }
  }
}
</style>
