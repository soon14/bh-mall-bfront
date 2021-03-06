import { formatDate, formatAmount, formatImg } from 'common/js/util';

export const commonMixin = {
  filters: {
    formatImg(img, suffix = '?imageMogr2/auto-orient') {
      return formatImg(img, suffix);
    },
    formatDate(date, format = 'yyyy-MM-dd') {
      if (!date) {
        return '--';
      }
      return formatDate(date, format);
    },
    formatAmount(price) {
      return formatAmount(price);
    },
    // 流水金额格式化
    formatFlowAmount(amount) {
      let prefix = +amount > 0 ? '+' : '';
      return prefix + formatAmount(amount);
    }
  }
};

export const directiveMixin = {
  directives: {
    focus: {
      inserted: function (el) {
        el.focus();
      }
    }
  }
};
