<template>
  <section class="wrapper">
    <p class="title">召回（PV）</p>
    <div class="yaxis-wrapper">
      <p v-for="(item, index) in dataList" :key="index" class="yaxis" :style="{'marginTop: 24px': index>0}">
        {{ item.name }}
      </p>
    </div>
    <div class="message-list" v-for="(item, index) in getHintsList(dataList)" :key="index" :style="calcTop(index)">
      <a-alert v-for="(subItem, i) in item.hints" :key="i" type="warning" showIcon>
        <span slot="message">
          <span>{{ subItem.message }}</span>
          <a-button type="primary">查看原因</a-button>
        </span>
      </a-alert>
    </div>
    <div id="barContainer" class="chart-wrapper" ref="chartNodeRef" />
  </section>
</template>
<script>
import { Bar } from '@antv/g2plot'
export default {
  data () {
    return {
      dataList: [
        {
          name: '曝光',
          count: 120000000,
          hints: [
            {
              message: '曝光率过低'
            }
          ]
        },
        {
          name: '点击',
          count: 80000000
        },
        {
          name: '承接访问页',
          count: 60000000
        },
        {
          name: '承接点击页',
          count: 40000000,
          hints: [
            {
              message: '最终转化率过低，请关注表单提交成功率'
            }
          ]
        },
        {
          name: '最终转化量',
          count: 2000000
        }
      ],
      barMargin: 0,
      firstMargin: 0
    }
  },
  computed: {
    calcTop () {
      return function (index) {
        return `top: ${index * this.barMargin + 94}px`
      }
    },
    getHintsList () {
      return function (data) {
        return data.filter((item) => item.hints && item.hints.length)
      }
    }
  },
  mounted () {
    this.renderBar()
  },
  methods: {
    format (number) {
      if (number >= 1e8) {
        return `${(number / 1e8).toFixed(2)}亿`
      } else if (number >= 1e4 && number < 1e8) {
        return `${(number / 1e4).toFixed(2)}万`
      }
      return number
    },
    renderBar () {
      // Step 1: 声明数据源
      // G2Plot 对数据源格式的要求，仅仅是 JSON 数组，数组的每个元素是一个标准 JSON 对象。
      const data = this.dataList
      // Step 2: 创建图表
      const chartDom = document.getElementById('barContainer')
      const bar = new Bar(chartDom, {
        data: data,
        autoFit: true,
        xField: 'count',
        yField: 'name',
        yAxis: false,
        xAxis: false,
        conversionTag: {
          spacing: 8,
          text: {
            style: {
              fontSize: 12,
              fontWeight: 700
            },
            formatter: (prev, next) => {
              return data[0]?.count === 0 ? '0.00%' : `${((next / data[0]?.count) * 100)?.toFixed(2)}%`
            }
          },
          arrow: {
            style: {
              fill: '#F1F1FB'
            }
          }
        },
        tooltip: {
          showTitle: false,
          formatter: (item) => ({ name: item.name, value: this.format(item.count) })
        },
        label: {
          content: (item) => {
            return `${this.format(item?.count)}`
          },
          layout: [
            {
              type: 'adjust-color'
            }
          ]
        }
      })
      // Step 3: 渲染图表
      bar.render()

      const { chart } = bar
      const coord = chart.getCoordinate()
      const xScale = chart.getXScale()
      // 计算出每个bar左上角之间的间距
      this.firstMargin = coord.convert({ x: xScale?.scale(data[0]?.name), y: 0 })?.y
      this.barMargin = coord.convert({ x: xScale?.scale(data[1]?.name), y: 0 })?.y - coord.convert({ x: xScale?.scale(data[0]?.name), y: 0 })?.y
    }
  }
}
</script>
<style lang="less" scoped>
  .wrapper {
    position: relative;
    padding: 10px;
  }
  .wrapper .title {
    font-size: 20px;
  }
  .wrapper .yaxis-wrapper {
    width: 70px;
    font-size: 14px;
  }
  .wrapper .yaxis {
    position: relative;
    display: -webkit-box;
    width: 70px;
    height: 43px;
    overflow: hidden;
    font-weight: 500;
    line-height: 22px;
    text-overflow: ellipsis;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
  .wrapper .icon-question {
    position: absolute;
    top: 4px;
    right: -6px;
    color: #999;
  }
  .wrapper .chart-wrapper {
    height: 340px;
    position: absolute !important;
    top: 40px;
    right: 10px;
    left: 96px;
  }
  .wrapper .message-list {
    position: absolute;
    right: 10px;
    left: 186px;
    z-index: 1;
  }
  /deep/ .wrapper .message-list .ant-alert-icon {
    position: relative;
    top: 0;
    left: 0;
    margin-right: 8px;
  }
  /deep/ .wrapper .message-list .ant-alert-warning {
    height: 28px;
    padding: 0 8px;
    line-height: 28px;
    border: none;
    border-radius: 0;
  }
</style>
