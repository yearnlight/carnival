// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import axios from 'axios';
import router from './router';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import './assets/icon/style.css';
import '../static/public.css';

axios.interceptors.request.use(
  config => {
    if (config.data && config.data.name) {
      config.data.name = config.data.name.replace(/^\s+|\s+$/g, "");
    }
    return config;
  },
  err => {
    return Promise.reject(err);
  }
);

axios.interceptors.response.use(response => {
  return response.data;
});

axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'

axios.defaults.transformRequest = [data => {
  let ret = ''
  let resArr = []
  for (let it in data) {
    let value = '';
    if (Object.prototype.toString.call(data[it]) === '[object Array]') {
      value = `[${encodeURIComponent(data[it])}]`;
    } else if (Object.prototype.toString.call(data[it]) === '[object Object]') {
      let temp = [];
      value += '{'
      for (let key in data[it]) {
        temp.push(`"${key}":"${data[it][key]}"`)
      }
      value += temp.join(",")
      value += '}'
    } else {
      value = encodeURIComponent(data[it]);
    }
    resArr.push(encodeURIComponent(it) + '=' + value)
  }
  ret = resArr.join("&");
  return ret
}]

Vue.use(ElementUI);

import App from './App';

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: {
    App
  },
  template: '<App/>',
  filters: {
    date: function (input) {
      var d = new Date(input);
      var year = d.getFullYear();
      var month = d.getMonth() + 1;
      var day = d.getDate() < 10 ? '0' + d.getDate() : '' + d.getDate();
      var hour = d.getHours();
      var minutes = d.getMinutes();
      var seconds = d.getSeconds();
      return year + '-' + month + '-' + day + ' ' + hour + ':' + minutes + ':' + seconds;
    }
  }
});
