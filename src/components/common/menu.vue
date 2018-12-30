<template>
    <div class="menu">
        <el-menu :default-active="activeItem" class="el-menu-vertical-demo" background-color="#484b61" text-color="#fff" active-text-color="#ffd04b" :collapse="isCollapse">
            <el-menu-item index="users">
                <router-link tag="div" to="/carnival/users">
                    <i class="icon-user-manage"></i>
                    用户管理
                </router-link>
            </el-menu-item>
            <el-submenu index="about">
                <template slot="title">
                    <i class="icon-about-meeting"></i>
                    <span slot="title">关于年会</span>
                </template>
                <el-menu-item-group>
                    <el-menu-item index="meeting">
                        <router-link tag="div" to="/carnival/about/meeting">
                            年会信息
                        </router-link>
                    </el-menu-item>
                    <el-menu-item index="seat">
                        <router-link tag="div" to="/carnival/about/seat">
                            座位信息
                        </router-link>
                    </el-menu-item>
                </el-menu-item-group>
            </el-submenu>
            <el-submenu index="program">
                <template slot="title">
                    <i class="icon-program-manage"></i>
                    <span slot="title">节目管理</span>
                </template>
                <el-menu-item-group>
                    <el-menu-item index="collection">
                        <router-link tag="div" to="/carnival/program/collection">
                            节目征集
                        </router-link>
                    </el-menu-item>
                    <el-menu-item index="selection">
                        <router-link tag="div" to="/carnival/program/selection">
                            节目评选
                        </router-link>
                    </el-menu-item>
                </el-menu-item-group>
            </el-submenu>
            <el-menu-item index="lottery">
                <router-link tag="div" to="/carnival/lottery">
                    <i class="icon-lottery"></i>
                    年会抽奖
                </router-link>
            </el-menu-item>
            <el-submenu index="red">
                <template slot="title">
                    <i class="icon-red-manage"></i>
                    <span slot="title">红包管理</span>
                </template>
                <el-menu-item-group>
                    <el-menu-item index="redEnvelope">
                        <router-link tag="div" to="/carnival/redEnvelope">
                            红包记录
                        </router-link>
                    </el-menu-item>
                    <el-menu-item index="group">
                        <router-link tag="div" to="/carnival/group">
                            自定义群组
                        </router-link>
                    </el-menu-item>
                </el-menu-item-group>
            </el-submenu>
            <el-submenu index="bowl">
                <template slot="title">
                    <i class="icon-bowl"></i>
                    <span slot="title">聚宝盆</span>
                </template>
                <el-menu-item-group>
                    <el-menu-item index="ticketset">
                        <router-link tag="div" to="/carnival/bowl/ticketset">
                            彩票设置
                        </router-link>
                    </el-menu-item>
                    <el-menu-item index="history">
                        <router-link tag="div" to="/carnival/bowl/history">
                            购买记录
                        </router-link>
                    </el-menu-item>
                    <el-menu-item index="ticket">
                        <router-link tag="div" to="/carnival/bowl/ticket">
                            彩票开奖
                        </router-link>
                    </el-menu-item>
                </el-menu-item-group>
            </el-submenu>
        </el-menu>
    </div>
</template>

<script>
export default {
  data() {
    return {
      isCollapse: false,
      activeItem: "users"
    };
  },
  created() {
    //定位路由
    let path = this.$route.path;
    let paths = path.split("/");
    this.activeItem = paths[paths.length - 1];
  }
};
</script>

<style lang="less">
.menu {
  height: 100%;
  .el-menu {
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    i {
      font-size: 16px;
      margin-right: 8px;
    }
  }
}
</style>