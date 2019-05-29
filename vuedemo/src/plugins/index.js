import MButton from '@/components/button/m-button.vue'
import ScrollView from '@/components/ScrollView/index.vue'

const baseComponents = {
  MButton,
  ScrollView
}

export default {
  install (Vue) {
    for (let key in baseComponents) {
      Vue.component(key, baseComponents[key])
    }
  }
}
