<template>
    <div class="detail">
        <div class="detail-top">
            <p>姓名：{{userinfo.realName}}
                <i class="tip" @click="$router.push('/journal?id=' + options.userId + '&name=' + userinfo.realName);">流转日志</i>
            </p>
            <p>
                <span>微信号：{{userinfo.wxId}}</span>
            </p>
            <p>
                <span>手机号：{{userinfo.mobile}}</span>
            </p>
            <p>区域：
                <i>{{userinfo.province}}</i>
                <i>{{userinfo.city}}</i>
                <i>{{userinfo.area}}</i>
            </p>
        </div>
        <div class="detail-bottom">
          <p>意向等级：<i>{{userinfo.applyLevel}}</i></p>
          <p>该等级政策：</p>
          <p>1.授权单金额：{{formatAmount(levelInfo.amount)}}</p>
          <p>2.门槛费：{{formatAmount(levelInfo.minCharge)}}</p>
          <p>3.红线金额：{{formatAmount(levelInfo.redAmount)}}</p>
          <p>4.门槛可有余额：{{formatAmount(levelInfo.minSurplus)}}</p>
          <p>5.是否启用云仓：{{getBool(levelInfo.isWare)}}</p>
        </div>
        <div :class="['choose']" v-show="index === '0'">
            <span class="item"  @click="changSubShow">
                <img src="../../assets/imgs/xiangxiafenpei@2x.png" alt="">
                向下分配
            </span>
            <span class="item" @click="accept">
                <img src="../../assets/imgs/jieshou@2x.png" alt="">
                接受
            </span>
            <span class="item" @click="ignore">
                <img src="../../assets/imgs/hulve@2x.png" alt="">
                忽略
            </span>
        </div>
        <div :class="[maskShow ? 'show' : '','mask']" @click="changSubShow"></div>
        <div :class="[panelLevelShow ? 'show' : '','panel']">
            <i v-for="item in list" :id="item.userId" v-show="list.length" @click="chooseUser(item.userId)">{{item.realName}}</i>
            <i v-show="!list.length" @click="chooseUser('')">无内容</i>
        </div>
        <toast ref="mytoast" :text="text"></toast>
    </div>
</template>
<script>
import {
  allotAgent,
  acceptAgent,
  ignoreAgent,
  getLevel,
  getMySub,
  getYixiangDetail
} from "api/baohuo";
import { formatAmount } from "../../common/js/util";
import toast from "base/toast/toast";
export default {
  name: "detail",
  data() {
    return {
      text: "",
      userinfo: "",
      index: "",
      manager: "",
      options: {
        userId: "",
        toUserId: "",
        // manager: ""
      },
      maskShow: false,
      panelLevelShow: false,
      list: [],
      levelInfo: {}
    };
  },
  methods: {
    formatAmount(amount) {
      return formatAmount(amount);
    },
    // downward(){
    //     changSubShow() {
    //     this.maskShow = !this.maskShow
    //     this.panelLevelShow = !this.panelLevelShow
    //     }
    //     allotAgent(this.options).then(res => {
    //             if(res.isSuccess){
    //                 this.text = '向下分配成功'
    //                 this.$refs.mytoast.show()
    //             }else{
    //                 this.text = '向下分配失败'
    //                 this.$refs.mytoast.show()
    //             }
    //     })
    // },
    getBool(val) {
      const dict = {
        0: '否',
        1: '是'
      };
      return dict[val];
    },
    accept() {
      acceptAgent(this.options.userId).then(res => {
        if (res.isSuccess) {
          this.text = "接受成功";
          this.$refs.mytoast.show();
          setTimeout(() => {
            this.$router.back();
          }, 300)
        } else {
          this.text = "接受失败";
          this.$refs.mytoast.show();
        }
      });
    },
    ignore() {
      ignoreAgent(this.options.userId).then(res => {
        if (res.isSuccess) {
          this.text = "忽略成功";
          this.$refs.mytoast.show();
        } else {
          this.text = "忽略失败";
          this.$refs.mytoast.show();
        }
      });
    },
    changSubShow() {
      if(this.list.length) {
        this.maskShow = !this.maskShow;
        this.panelLevelShow = !this.panelLevelShow;
      } else {
        this.text = "您暂无下级代理，无法向下分配";
        this.$refs.mytoast.show();
      }
    },
    chooseUser(userId) {
      console.log(userId);
      // this.changLevelShow()
      // this.options.toUserId = event.target.getAttribute("id");
      if(userId) {
        this.options.toUserId = userId;
        allotAgent(this.options).then(res => {
          if (res.isSuccess) {
            this.text = "向下分配成功";
            this.$refs.mytoast.show();
            setTimeout(() => {
              this.$router.back();
            }, 500)
          } else {
            this.text = "向下分配失败";
            this.$refs.mytoast.show();
          }
        });
      } else {
        this.text = "您暂无下级代理，无法向下分配";
        this.$refs.mytoast.show();
      }
    }
  },
  mounted() {
    //从地址栏获取用户userId
    this.options.userId = this.$route.query.id;
    this.index = this.$route.query.index;
    Promise.all([
      getYixiangDetail(this.options.userId),
      getMySub(this.options.userId)
    ]).then(([res1, res2]) => {
      getLevel(res1.applyLevel).then(info => {
        res1.applyLevel = info[0].name;
        res1.minCharge = info[0].minCharge;
        res1.redAmount = info[0].redAmount;
        this.levelInfo = info[0];
        this.userinfo = res1;
      });
      this.list = res2.list;
    })
    // getLevel('')
  },
  components: {
    toast
  }
};
</script>
<style lang="scss" scoped>
@import "../../common/scss/variable.scss";
.detail {
  background-color: #f7f7f7;
  font-size: $font-size-small;
  .detail-top {
    margin-top: 0.2rem;
    padding: 0.3rem;
    background-color: #fff;
    p + p {
      margin-top: 0.36rem;
    }
    .tip {
      width: 1.4rem;
      height: 0.54rem;
      line-height: 0.54rem;
      float: right;
      background-color: $primary-color;
      border-radius: 0.2rem;
      color: #fff;
      text-align: center;
    }
    .tel {
      margin-left: 1.1rem;
    }
    img {
      float: right;
    }
  }
  .detail-bottom {
    padding: 0.3rem;
    margin-top: 0.2rem;
    background-color: #fff;
    p + p {
      margin-top: 0.36rem;
    }
  }
  .choose {
    overflow: hidden;
    padding: 0.26rem 0;
    background-color: #fff;
    border-top: 1px solid #eee;
    &.hide {
      display: none;
    }
    .item {
      width: 33.3%;
      float: left;
      line-height: 0.36rem;
      text-align: center;
      img {
        width: 0.3rem;
        vertical-align: text-bottom;
        margin-right: 0.12rem;
      }
    }
    .item + .item {
      border-left: 1px solid #eee;
    }
  }
  .mask {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    background-color: $color-background-m;
    display: none;
    &.show {
      display: block;
    }
  }
  .panel {
    width: 50%;
    max-height: 5rem;
    overflow: hidden;
    overflow-y: auto;
    position: fixed;
    top: 4rem;
    left: 50%;
    transform: translateX(-50%);
    background-color: #fff;
    display: none;
    &.show {
      display: block;
    }
    i {
      padding: 0.2rem 0.3rem;
      display: block;
      line-height: 0.2rem;
      width: 100%;
      border-bottom: 1px dashed #dedede;
    }
  }
}
</style>
