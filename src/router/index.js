import Vue from 'vue'
import Router from 'vue-router'
//用户管理
import UserManage from '@/components/userManage/users'
import WealthDetail from '@/components/userManage/wealth'
//关于年会
import Meeting from '@/components/about/meeting'
import Seat from '@/components/about/seat'
//节目
import Collection from '@/components/program/collection'
import Selection from '@/components/program/selection'
import Projection from '@/components/program/projection'
//抽奖
import Lottery from '@/components/lottery/lottery'
//红包管理
import RedEnvelope from '@/components/redEnvelope/manage'
import Group from '@/components/redEnvelope/group'
//聚宝盆
import History from '@/components/bowl/history'
import Ticket from '@/components/bowl/ticket'
import Ticketset from '@/components/bowl/ticketset'
import HistoryDetail from '@/components/bowl/detail'
//登录
import Login from '@/components/login'

import Carnival from '@/components/common/carnival'

Vue.use(Router)

export default new Router({
  routes: [{
      path: '/',
      redirect: '/carnival',
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/carnival',
      component: Carnival,
      name: 'carnival',
      redirect: '/carnival/users',
      children: [{
          path: '/carnival/users',
          name: 'userManage',
          component: UserManage
        },
        {
          path: '/carnival/wealthDetail',
          name: 'wealthDetail',
          component: WealthDetail
        },
        {
          path: '/carnival/about/meeting',
          name: 'meeting',
          component: Meeting
        },
        {
          path: '/carnival/about/seat',
          name: 'seat',
          component: Seat
        },
        {
          path: '/carnival/program/collection',
          name: 'collection',
          component: Collection
        },
        {
          path: '/carnival/program/projection',
          name: 'projection',
          component: Projection
        },
        {
          path: '/carnival/program/selection',
          name: 'selection',
          component: Selection
        },
        {
          path: '/carnival/lottery',
          name: 'lottery',
          component: Lottery
        },
        {
          path: '/carnival/redEnvelope',
          name: 'redEnvelope',
          component: RedEnvelope
        },
        {
          path: '/carnival/group',
          name: 'group',
          component: Group
        },
        {
          path: '/carnival/bowl/history',
          name: 'history',
          component: History
        },
        {
          path: '/carnival/bowl/detail',
          name: 'historyDetail',
          component: HistoryDetail
        },
        {
          path: '/carnival/bowl/ticketset',
          name: 'ticketset',
          component: Ticketset
        },
        {
          path: '/carnival/bowl/ticket',
          name: 'ticket',
          component: Ticket
        }
      ]
    }
  ]
})
