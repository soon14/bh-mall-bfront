<template>
  <div class="intentionalAgent">
      <div class="header clearfix">
          <div @click="changeIndex(4)" :class="[index == 4 ? 'active' : '']">
              <i>待确认</i>
          </div>
          <div @click="changeIndex(6)" :class="[index == 6 ? 'active' : '']">
              <i>已确认</i>
          </div>
          <div @click="changeIndex(5)" :class="[index == 5 ? 'active' : '']">
              <i>已否决</i>
          </div>
      </div>
      <div class="item" v-for="item in list" v-if="item.level"  @click="$router.push('/shenhechongzhi/chongzhichuli?code=' + item.code + '&index=' + index);">
          <p>订单编号：{{item.code}}<i class="tip">{{tips[item.status]}}</i></p>
          <p>申请人姓名：{{item.accountName}}  </p>
          <p>等级：{{item.level}}</p>
          <p>充值金额：<span>￥{{formatAmount(item.amount)}}</span><img src="../../assets/imgs/more@2x.png" alt=""></p>
          <p>申请时间：{{item.applyDatetime}}</p>
      </div>
    <full-loading :title="title" v-show="loading"></full-loading>
  </div>
</template>
<script>
import { intentional, queryIndent, getLevel } from "api/baohuo";
import { formatDate, formatAmount } from "common/js/util";
import FullLoading from 'base/full-loading/full-loading';
export default {
  name: "IntentionalAgent",
  data() {
    return {
      loading: false,
      title: '正在加载...',
      index: 4,
      list: [],
      tips: [
        "",
        "待支付",
        "支付失败",
        "支付成功",
        "待审核",
        "审核未通过",
        "审核通过"
      ]
    };
  },
  methods: {
    formatAmount(amount) {
      return formatAmount(amount);
    },
    changeIndex(index) {
      this.index = index;
      this.loading = true;
      queryIndent(this.index).then(res => {
        this.loading = false;
        res.list.map(function(item) {
          //格式化时间
          item.applyDatetime = formatDate(item.applyDatetime);
        });
        res.list.map(function(item) {
          getLevel(item.level).then(res => {
            item.level = res[0].name;
          });
        });
        this.list = res.list;
      });
    }
  },
  mounted() {
    this.loading = true;
    this.changeIndex(this.index);
  },
  components: {
    FullLoading
  }
};
</script>
<style lang="scss" scoped>
@import "../../common/scss/variable.scss";
@import "../../common/scss/base.scss";
.intentionalAgent {
  background-color: #f7f7f7;
  .fl {
    float: left;
  }
  .header {
    background-color: #fff;
    > div {
      float: left;
      width: 33.3%;
      height: 0.9rem;
      // background-color: rgba($color: #000000, $alpha: 0.1);
      position: relative;
      i {
        font-size: $font-size-medium;
        color: #333;
        height: 0.9rem;
        line-height: 0.9rem;
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
      }
      &.active {
        i {
          color: $primary-color;
          border-bottom: 0.06rem solid $primary-color;
        }
      }
    }
  }
  .item {
    margin-top: 0.2rem;
    padding: 0.3rem;
    font-size: $font-size-small;
    background-color: #fff;
    p + p {
      margin-top: 0.36rem;
    }
    .tip {
      float: right;
      color: #fa5440;
    }
    .tel {
      margin-left: 1.1rem;
    }
    img {
      width: 0.2rem;
      float: right;
    }
  }
}
</style>
