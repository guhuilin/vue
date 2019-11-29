import { mapState } from "vuex";

const mixin = {
  computed: {
    ...mapState({
      layoutMode: state => state.app.layout,
      navTheme: state => state.app.theme,
      primaryColor: state => state.app.color,
      colorWeak: state => state.app.weak,
      multipage: state => state.app.multipage,//多页签设置
      fixedHeader: state => state.app.fixedHeader,
      fixSiderbar: state => state.app.fixSiderbar,
      contentWidth: state => state.app.contentWidth,
      autoHideHeader: state => state.app.autoHideHeader,
      sidebarOpened: state => state.app.sidebar.opened
    })
  }
}

const mixinDevice = {
  computed: {
    ...mapState({
      device: state => state.app.device,
    })
  },
};

export { mixin, mixinDevice }