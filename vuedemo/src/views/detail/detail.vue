<template>
    <div class="wrap">
        <div class="head">
            <div class="left"></div>
            <div class="right">
                <p>{{listdata.common_name}}</p>
                <p>{{listdata.indication}}</p>
                <p :class="listdata.is_otc=='是'?'bordercolor':''">{{listdata.is_otc=='是'?'OTC':''}}</p>
            </div>
        </div>
        <tabs v-on:tabChange="tabChange" class="tab">
            <tab-pane label="基本信息">
                <div v-if="active==0" class="jbxx">
                    <p>通用名:{{listdata.product_name}}</p>
                    <p>商品名称:{{listdata.product_name}}</p>
                    <p>分类名称:{{listdata.category_name}}</p>
                    <p>药物分类:{{listdata.drug_category}}</p>
                    <p>是否OTC:{{listdata.is_otc}}</p>
                    <p>规格:{{listdata.specification}}</p>
                    <p>药品成分:{{listdata.good_category}}</p>
                    <p>生产企业:{{listdata.manufacturer}}</p>
                    <p>批准文号:{{listdata.approval_number}}</p>
                </div>
            </tab-pane>
            <tab-pane label="注意事项">
                <div v-if="active==1" class="zysx">
                    <p>注意事项:{{listdata.precautions}}</p>
                    <p>禁忌:{{listdata.taboo}}</p>
                    <p>不良反应:{{listdata.adverse_reaction}}</p>
                    <p>药物相互作用:{{listdata.interactions}}</p>
                </div>
            </tab-pane>
            <tab-pane label="用法用量">
                <div v-if="active==2" class="yfyl">
                    <p>{{listdata.dosage}}</p>
                </div>
            </tab-pane>
        </tabs>
    </div>
</template>

<script>
import Tabs from '@/components/tabbar/tabs.vue'
import TabPane from '@/components/tabbar/tab-pane.vue'
export default {
  data () {
    return {
      listdata: [],
      active: 0
    }
  },
  components: {
    Tabs,
    TabPane
  },
  created () {
    this.api.api.medicinedetail(this.$route.params.id).then(res => {
      console.log(res.data, 'res')
      this.listdata = res.data
    })
  },
  methods: {
    tabChange (ind) {
      this.active = ind
    }
  }
}
</script>
<style lang="scss" scoped>
.wrap {
  @include wh(100%, auto);
  background: #fff;
}
.head {
  @include wh(100%, auto);
  background: #fff;
  display: flex;
  padding-bottom: 0.05rem;
  .left {
    @include wh(35%, 100%);
  }
  .right {
    @include wh(65%, 100%);
    line-height: 0.2rem;
    p:first-child {
      font-size: 0.14rem;
      line-height: 0.3rem;
    }
  }
  .bordercolor {
    @include cen(0.3rem, 0.2rem);
    border: 0.01rem solid lightcoral;
    color: lightcoral;
    border-radius: 0.2rem;
    margin-top: 0.06rem;
  }
}
.tab {
  @include wh(100%, auto);
  background: #fff;
  p {
    // @include cen(33.3%, 0.4rem);
    background: #fff;
  }
}
.jbxx,
.zysx,
.yfyl {
  @include wh(100%, 100%);
  background: #fff;
  p {
    @include wh(90%, auto);
    margin: 0 auto;
    line-height: 0.24rem;
    margin-bottom: 0.2rem;
  }
}
</style>
