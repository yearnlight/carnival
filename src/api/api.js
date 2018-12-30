import axios from 'axios'

const GET_PARAM = param => {
  let resArr = [],
    res = ""
  for (let key in param) {
    resArr.push(`${key}=${param[key]}`);
  }
  if (resArr.length) {
    res += "?";
    res += resArr.join("&");
  }
  return res;
}

const Axios_To_Json = (url, param) => {
  return axios({
    url: url,
    data: param,
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    transformRequest: [data => {
      data = JSON.stringify(data);
      return data;
    }]
  })
}

const Axios_To_file = (url, param) => {
  return axios.post(url, param, {
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    transformRequest: [data => {
      return data;
    }]
  })
}

export default {
  loginIn: param => axios.post(`/user/login`, param), //登录
  userList: param => axios.post(`/user/list`, param),
  depts: param => axios.post(`/user/dept/list`),
  addUser: param => axios.post(`/user/add`, param),
//   importUser: param => Axios_To_file(`/user/import`, param),
  delUser: param => axios.post(`/user/delete`, param),
  resetPass: param => axios.post(`/user/reset-password`, param),
  recharge: param => axios.post(`/user/recharge`, param),
  seatList: param => axios.post(`/seat/list`, param),
  addSeat: param => axios.post(`/seat/add`, param),
  lotteryList: param => axios.get(`/web/hb/luckDraw/query`), //奖项列表
  addOrUpdateLottery: param => axios.post(`/web/hb/luckDraw/addOrUpdate`, param), //新增或者修改奖项
  linkedUser: param => axios.post(`/web/hb/luckDraw/luck-users`, param), //关联中奖人
  payList: param => axios.post(`/pay/list`, param), //购买记录列表
  payDetail: param => axios.post(`/pay/detail`, param), //购买详情
  payInfo: param => axios.post(`/pay/info`, param), //奖池信息
  payAddOrEdit: param => axios.post(`/pay/insertOrUpdate`, param), //新增or修改
  paySet: param => axios.post(`/pay/select`, param), //获取购买设置
  getIntroduce: param => axios.post(`/introduce/select`, param), //年会介绍
  delWinning: param => axios.get(`/web/hb/luckDraw/delete${GET_PARAM(param)}`), //删除奖项
  addOrUpdateIntroduce: param => axios.post(`/introduce/addOrUpdate`, param), //新增或修改年会信息
  flowList: param => axios.post(`/flow/list`, param), //查询节目流程
  delflow: param => axios.post(`/flow/delete`, param), //删除节目流程
  addOrUpdateFlow: param => axios.post(`/flow/addOrUpdate`, param), //查询节目流程
  setRealtimeDynamic: param => axios.post(`/dictionary/add`, param), //设置实时动态
  getRealtimeDynamic: () => axios.get(`/dictionary/select?dictionaryCode=DYNAMIC`), //查询实时动态
  programList: param => axios.get(`/web/hb/act/query`), //节目列表
  setScoreDate: param => axios.get(`/web/hb/actConfig/score-date${GET_PARAM(param)}`), //设置评选开始时间
  addselection: param => axios.post(`/web/hb/act/addOrUpdate`, param), //新增或修改节目
  voteselection: param => axios.get(`/web/hb/act/vote${GET_PARAM(param)}`), //节目投票
  selectionHome: param => axios.get(`/web/hb/actConfig/get`), //节目评选首页
  delProgram: param => axios.get(`/web/hb/act/delete${GET_PARAM(param)}`), //删除节目
//   uploadposter: param => Axios_To_file(`/web/hb/actConfig/addOrUpdate`, param), //上传海报
  saveposter: param => axios.post(`/web/hb/actConfig/addOrUpdate`,param), //保存评选配置
  tLotteryList: param => axios.post(`/bonus/list`, param), //彩票开奖列表
  addticket: param => axios.post(`/bonus/add`, param), //创建奖项
  updateticket: param => axios.post(`/bonus/update`, param), //修改奖项
  delticket: param => axios.post(`/bonus/delete`, param), //删除奖项
  getLotteryinfo: param => axios.post(`/bonusIntroduce/list`, param), //获取彩券信息
  saveLotteryinfo: param => axios.post(`/bonusIntroduce/saveOrUpdate`, param), //修改彩券信息
  getUsersByNumber: param => axios.post(`/pay/listByTicketNumber`, param), //按照彩票号获取用户信息
  linkWinning: param => axios.post(`/bonusLog/add`, param), //关联中奖信息
  groupList: param => axios.get(`/web/group/queryList`, param), //自定义组列表
  addgroup: param => axios.post(`/web/group/add`, param), //添加自定义组
  delgroup: param => axios.get(`/web/group/delete${GET_PARAM(param)}`), //删除自定义组
  redconfig: param => axios.get(`/web/packet/config`), //查询红包配置
  saveconfig: param => axios.get(`/web/packet/add${GET_PARAM(param)}`), //保存红包配置
  getRedDetail: param => axios.get(`/web/packet/user-detail${GET_PARAM(param)}`), //获取红包详情
  updateSeatLevel:param => axios.post(`/seat/updateLevel`,param)//修改座位序号
}
