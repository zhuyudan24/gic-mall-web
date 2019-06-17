// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill';
import promise from 'es6-promise';
promise.polyfill();
import Vue from 'vue';
import App from './App';
import router from './router';
// import VueRouter from 'vue-router'
import axios from 'axios';
import VueAxios from 'vue-axios';
import ElementUI from 'element-ui';
import store from './store';
import 'element-ui/lib/theme-chalk/index.css';
import './assets/theme/index.css';
// import vueGicHeader from '@gic-test/vue-gic-header'
// import vueGicAsideMenu from '@gic-test/vue-gic-aside-menu'
// import vueGicFooter from '@gic-test/vue-gic-footer'
import filters from '../static/js/common.js';
// Vue.use(vueGicFooter)
// Vue.use(vueGicAsideMenu)
// Vue.use(vueGicHeader)
// Vue.use(VueRouter)
Vue.use(ElementUI);
Vue.use(VueAxios, axios);
// import vueAreaAb from '@gic-test/vue-area-ab'
// Vue.use(vueAreaAb)
//会员分组
// import vueGicMemberGroup from '@gic-test/vue-gic-member-group'
// Vue.use(vueGicMemberGroup)
// //图片空间上传文件夹
// import vueGicSpace from '@gic-test/vue-gic-space'
// Vue.use(vueGicSpace)

// import vueGicExportExcel from '@gic-test/vue-gic-export-excel'
// Vue.use(vueGicExportExcel)
// import packele from 'packele'
// Vue.use(packele)
Vue.axios.defaults.withCredentials = true; // 跨域cookie访问
Vue.config.productionTip = false;

// Vue.prototype.testHost = 'http://192.168.1.179:8081' //本地环境
Vue.prototype.testHost = window.location.origin; //测试环境
for (let key in filters) {
  Vue.filter(key, filters[key]);
}

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
});
