<template>
<div class="person-root">
  <div id="container"></div>
</div>
</template>

<script>
import { Line } from '@antv/g2plot';
export default {
  name: "Person",
  data(){
    return{
      data : [
        { year: '1991', value: 3 },
        { year: '1992', value: 4 },
        { year: '1993', value: 3.5 },
        { year: '1994', value: 5 },
        { year: '1995', value: 4.9 },
        { year: '1996', value: 6 },
        { year: '1997', value: 7 },
        { year: '1998', value: 9 },
        { year: '1999', value: 13 },
      ]
    }
  },
  mounted() {
    fetch('https://gw.alipayobjects.com/os/bmw-prod/55424a73-7cb8-4f79-b60d-3ab627ac5698.json')
        .then((res) => res.json())
        .then((data) => {
          const COLOR_PLATE_10 = [
            '#5B8FF9',
            '#5AD8A6',
            '#5D7092',
            '#F6BD16',
            '#E8684A',
            '#6DC8EC',
            '#9270CA',
            '#FF9D4D',
            '#269A99',
            '#FF99C3',
          ];

          const container = document.getElementById('container');

          const line = new Line(container, {
            data,
            xField: 'year',
            yField: 'value',
            seriesField: 'category',
            yAxis: {
              label: {
                // 数值格式化为千分位
                formatter: (v) => `${v}`.replace(/\d{1,3}(?=(\d{3})+$)/g, (s) => `${s},`),
              },
            },
            legend: {
              position: 'right-top',
            },
            color: COLOR_PLATE_10,
            point: {
              shape: ({ category }) => {
                return category === 'Gas fuel' ? 'square' : 'circle';
              },
              style: ({ year }) => {
                return {
                  r: Number(year) % 4 ? 0 : 3, // 4 个数据示一个点标记
                };
              },
            },
          });

          line.render();
        });

  }
}

</script>

<style lang="less" scoped>
.person-root{
  height: 100%;
  width: 100%;
  #container{
    height: 100%;
    width: 100%;
  }
}
</style>