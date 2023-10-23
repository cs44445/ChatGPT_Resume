<template>
  <div class="floor-container">
    <div class="floor-title floor-green">
      <div class="floor-level floor-bt floor-ri">Level</div>
      <div class="floor-area floor-bt floor-ri">Lettable Floor Area</div>
      <div class="floor-unit floor-bt">Unit</div>
    </div>
    <div class="floor-info" v-for="(a, b) in data" :key="b">
      <div class="floor-green floor-level floor-bt floor-ri">{{ a.floorNo }}</div>
      <div class="floor-green floor-area floor-bt floor-ri">{{ a.floorArea }}</div>
      <div class="floor-detail">
        <div class="floor-bt floor-ri"
          v-for="(c, d) in a.floorCompanyList"
          :key="d"
          :style="{ background: c.companyColor, width: c.companyRatio,color:c.companyFontColor }"
        >
          <a-popover :title="c.companyName">
            <template slot="content">
                  <p>公司名称：{{ c.companyName }}</p>
                  <p>占地面积：{{ c.companyArea }}</p>
                  <p>日期：{{ c.companyToDate }}</p>
            </template>
            <div class="floor-con">
                  {{ c.companyName }} {{ c.companyArea }} {{ c.companyToDate }}
            </div>
        </a-popover>
         
        </div>
      </div>
    </div>
    <!-- <div class="floor-info">
      <div class="floor-green floor-level floor-bt floor-ri">1</div>
      <div class="floor-green floor-area floor-bt floor-ri">25800</div>
      <div class="floor-detail">
        <div class="floor-grey floor-width10 floor-bt floor-ri">dfjdhj</div>
        <div class="floor-pink floor-width40 floor-bt floor-ri">djfdjs djfh</div>
        <div class="floor-blue floor-width30 floor-bt floor-ri">324jsdhj</div>
        <div class="floor-yellow floor-width20 floor-bt">dsfd</div>
      </div>
    </div>
    <div class="floor-info">
      <div class="floor-green floor-level floor-bt floor-ri">1</div>
      <div class="floor-green floor-area floor-bt floor-ri">25800</div>
      <div class="floor-detail">
        <div class="floor-blue floor-width50 floor-bt floor-ri">dfjdhj</div>
        <div class="floor-pink floor-width10 floor-bt floor-ri">djfdjs djfh</div>
        <div class="floor-yellow floor-width10 floor-bt floor-ri">324jsdhj</div>
        <div class="floor-green2 floor-width10 floor-bt floor-ri">dsfd</div>
        <div class="floor-purple floor-width20 floor-bt floor-ri">dsfd</div>
        <div class="floor-grey-pink floor-width10 floor-bt">dsfd</div>
      </div>
    </div>
    <div class="floor-info">
      <div class="floor-green floor-level floor-bt floor-ri">1</div>
      <div class="floor-green floor-area floor-bt floor-ri">25800</div>
      <div class="floor-detail">
        <div class="floor-yellow floor-width5 floor-bt floor-ri">dfjdhj</div>
        <div class="floor-yellow floor-width15 floor-bt floor-ri">djfdjs djfh</div>
        <div class="floor-grey-pink floor-width10 floor-bt floor-ri">324jsdhj</div>
        <div class="floor-pink floor-width20 floor-bt floor-ri">dsfd</div>
        <div class="floor-yellow floor-width10 floor-bt floor-ri">dsfd</div>
        <div class="floor-blue floor-width10 floor-bt floor-ri">dsfd</div>
        <div class="floor-green2 floor-width10 floor-bt floor-ri">dsfd</div>
        <div class="floor-yellow floor-width10 floor-bt floor-ri">dsfd</div>
        <div class="floor-grey floor-width10 floor-bt">dsfd</div>
      </div>
    </div>
    <div class="floor-info">
      <div class="floor-green floor-level floor-bt floor-ri">1</div>
      <div class="floor-green floor-area floor-bt floor-ri">25800</div>
      <div class="floor-detail">
        <div class="floor-grey floor-width10 floor-bt floor-ri">dfjdhj</div>
        <div class="floor-pink floor-width40 floor-bt floor-ri">djfdjs djfh</div>
        <div class="floor-blue floor-width30 floor-bt floor-ri">324jsdhj</div>
        <div class="floor-yellow floor-width20 floor-bt">dsfd</div>
      </div>
    </div>
    <div class="floor-info">
      <div class="floor-green floor-level floor-bt floor-ri">1</div>
      <div class="floor-green floor-area floor-bt floor-ri">25800</div>
      <div class="floor-detail">
        <div class="floor-blue floor-width50 floor-bt floor-ri">dfjdhj</div>
        <div class="floor-pink floor-width10 floor-bt floor-ri">djfdjs djfh</div>
        <div class="floor-yellow floor-width10 floor-bt floor-ri">324jsdhj</div>
        <div class="floor-green2 floor-width10 floor-bt floor-ri">dsfd</div>
        <div class="floor-purple floor-width20 floor-bt floor-ri">dsfd</div>
        <div class="floor-grey-pink floor-width10 floor-bt">dsfd</div>
      </div>
    </div>
    <div class="floor-info">
      <div class="floor-green floor-level floor-bt floor-ri">1</div>
      <div class="floor-green floor-area floor-bt floor-ri">25800</div>
      <div class="floor-detail">
        <div class="floor-yellow floor-width5 floor-bt floor-ri">dfjdhj</div>
        <div class="floor-yellow floor-width15 floor-bt floor-ri">djfdjs djfh</div>
        <div class="floor-grey-pink floor-width10 floor-bt floor-ri">324jsdhj</div>
        <div class="floor-pink floor-width20 floor-bt floor-ri">dsfd</div>
        <div class="floor-yellow floor-width10 floor-bt floor-ri">dsfd</div>
        <div class="floor-blue floor-width10 floor-bt floor-ri">dsfd</div>
        <div class="floor-green2 floor-width10 floor-bt floor-ri">dsfd</div>
        <div class="floor-yellow floor-width10 floor-bt floor-ri">dsfd</div>
        <div class="floor-grey floor-width10 floor-bt">dsfd</div>
      </div>
    </div>
    <div class="floor-info">
      <div class="floor-green floor-level floor-bt floor-ri">1</div>
      <div class="floor-green floor-area floor-bt floor-ri">25800</div>
      <div class="floor-detail">
        <div class="floor-grey floor-width10 floor-bt floor-ri">dfjdhj</div>
        <div class="floor-pink floor-width40 floor-bt floor-ri">djfdjs djfh</div>
        <div class="floor-blue floor-width30 floor-bt floor-ri">324jsdhj</div>
        <div class="floor-yellow floor-width20 floor-bt">dsfd</div>
      </div>
    </div>
    <div class="floor-info">
      <div class="floor-green floor-level floor-bt floor-ri">1</div>
      <div class="floor-green floor-area floor-bt floor-ri">25800</div>
      <div class="floor-detail">
        <div class="floor-blue floor-width50 floor-bt floor-ri">dfjdhj</div>
        <div class="floor-pink floor-width10 floor-bt floor-ri">djfdjs djfh</div>
        <div class="floor-yellow floor-width10 floor-bt floor-ri">324jsdhj</div>
        <div class="floor-green2 floor-width10 floor-bt floor-ri">dsfd</div>
        <div class="floor-purple floor-width20 floor-bt floor-ri">dsfd</div>
        <div class="floor-grey-pink floor-width10 floor-bt">dsfd</div>
      </div>
    </div>
    <div class="floor-info">
      <div class="floor-green floor-level floor-bt floor-ri">1</div>
      <div class="floor-green floor-area floor-bt floor-ri">25800</div>
      <div class="floor-detail">
        <div class="floor-yellow floor-width5 floor-bt floor-ri">dfjdhj</div>
        <div class="floor-yellow floor-width15 floor-bt floor-ri">djfdjs djfh</div>
        <div class="floor-grey-pink floor-width10 floor-bt floor-ri">324jsdhj</div>
        <div class="floor-pink floor-width20 floor-bt floor-ri">dsfd</div>
        <div class="floor-yellow floor-width10 floor-bt floor-ri">dsfd</div>
        <div class="floor-blue floor-width10 floor-bt floor-ri">dsfd</div>
        <div class="floor-green2 floor-width10 floor-bt floor-ri">dsfd</div>
        <div class="floor-yellow floor-width10 floor-bt floor-ri">dsfd</div>
        <div class="floor-grey floor-width10 floor-bt">dsfd</div>
      </div>
    </div>
    <div class="floor-info">
      <div class="floor-green floor-level floor-bt floor-ri">1</div>
      <div class="floor-green floor-area floor-bt floor-ri">25800</div>
      <div class="floor-detail">
        <div class="floor-grey floor-width10 floor-bt floor-ri">dfjdhj</div>
        <div class="floor-pink floor-width40 floor-bt floor-ri">djfdjs djfh</div>
        <div class="floor-blue floor-width30 floor-bt floor-ri">324jsdhj</div>
        <div class="floor-yellow floor-width20 floor-bt">dsfd</div>
      </div>
    </div>
    <div class="floor-info">
      <div class="floor-green floor-level floor-bt floor-ri">1</div>
      <div class="floor-green floor-area floor-bt floor-ri">25800</div>
      <div class="floor-detail">
        <div class="floor-blue floor-width50 floor-bt floor-ri">dfjdhj</div>
        <div class="floor-pink floor-width10 floor-bt floor-ri">djfdjs djfh</div>
        <div class="floor-yellow floor-width10 floor-bt floor-ri">324jsdhj</div>
        <div class="floor-green2 floor-width10 floor-bt floor-ri">dsfd</div>
        <div class="floor-purple floor-width20 floor-bt floor-ri">dsfd</div>
        <div class="floor-grey-pink floor-width10 floor-bt">dsfd</div>
      </div>
    </div> -->
  </div>
</template>

<script>
export default {
  name: 'FloorContainer',
  data() {
    return {
      data: [
        {
          floorNo: 1, //楼层号
          floorArea: 1500, //楼层面积
          floorCompanyList: [
            //楼层具体情况
            {
              companyId: '11111', //公司id
              companyName: '文思海辉', //公司名称
              companyArea: 1500, //公司面积
              companyRatio: '50%', //百分比
              companyToDate: '2022-03-25', //租约到期时间
              companyColor: '#9cf', //颜色
              companyFontColor:'#000',//字体颜色
            },
            {
              companyId: '2222', //公司id
              companyName: '中电金信', //公司名称
              companyArea: 300, //公司面积
              companyRatio: '10%', //百分比
              companyToDate: '2022-03-25', //租约到期时间
              companyColor: '#ff00ff', //颜色
              companyFontColor:'#fff',//字体颜色
            },
            {
              companyId: '-1', //公司id
              companyName: '空置面积', //公司名称
              companyArea: 1200, //公司面积
              companyRatio: '10%', //百分比
              companyToDate: '2022-03-25', //租约到期时间
              companyColor: '#ff9', //颜色
              companyFontColor:'#000',//字体颜色
            },
            {
              companyId: '-1', //公司id
              companyName: '空置面积', //公司名称
              companyArea: 1200, //公司面积
              companyRatio: '10%', //百分比
              companyToDate: '2022-03-25', //租约到期时间
              companyColor: '#0f0', //颜色
              companyFontColor:'#000',//字体颜色
            },
            {
              companyId: '-1', //公司id
              companyName: '空置面积', //公司名称
              companyArea: 1200, //公司面积
              companyRatio: '20%', //百分比
              companyToDate: '2022-03-25', //租约到期时间
              companyColor: '#ff99cc', //颜色
              companyFontColor:'#000',//字体颜色
            },
          ],
        },
        {
          floorNo: 2, //楼层号
          floorArea: 3000, //楼层面积
          floorCompanyList: [
            //楼层具体情况
            {
              companyId: '11111', //公司id
              companyName: '文思海辉', //公司名称
              companyArea: 1500, //公司面积
              companyRatio: '30%', //百分比
              companyToDate: '2022-03-25', //租约到期时间
              companyColor: '#333', //背景颜色
              companyFontColor:'#fff',//字体颜色
            },
            {
              companyId: '2222', //公司id
              companyName: '中电金信', //公司名称
              companyArea: 300, //公司面积
              companyRatio: '40%', //百分比
              companyToDate: '2022-03-25', //租约到期时间
              companyColor: '#ff00ff', //颜色
              companyFontColor:'#fff',//字体颜色
            },
            {
              companyId: '-1', //公司id
              companyName: '空置面积', //公司名称
              companyArea: 1200, //公司面积
              companyRatio: '30%', //百分比
              companyToDate: '2022-03-25', //租约到期时间
              companyColor: '#ff9', //颜色
              companyFontColor:'#000',//字体颜色
            },
          ],
        },
      ],
    }
  },
  mounted() {},
  methods: {},
}
</script>
<style>
.floor-container {
  width: 1200px;
  height: 600px;
  color: #000;
  font-weight: bolder;
}
.floor-container .floor-title {
  height: 50px;
  line-height: 50px;
  display: flex;
  width: 100%;
  text-align: center;
}
.floor-level {
  width: 5%;
  color: #fff;
}
.floor-area {
  width: 15%;
  color: #fff;
}
.floor-unit {
  width: 80%;
  color: #fff;
}
.floor-info,
.floor-detail {
  height: 50px;
  line-height: 48px;
  display: flex;
  text-align: center;
}
.floor-detail {
  width: 80%;
}
.floor-bt {
  border-bottom: 2px solid #000;
}
.floor-ri {
  border-right: 2px solid #000;
}
.floor-width5 {
  width: 5%;
}
.floor-con{
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.floor-width10 {
  width: 10%;
}
.floor-width15 {
  width: 15%;
}
.floor-width20 {
  width: 20%;
}
.floor-width30 {
  width: 30%;
}
.floor-width40 {
  width: 40%;
}
.floor-width50 {
  width: 50%;
}
.floor-width610 {
  width: 60%;
}
.floor-green {
  background: green;
}
.floor-grey {
  background: #c0c0c0;
}
.floor-pink {
  background: #ff00ff;
  color: #fff;
}
.floor-blue {
  background: #9cf;
}
.floor-yellow {
  background: #ff9;
}
.floor-green2 {
  background: #0f0;
}
.floor-purple {
  background: #800180;
}
.floor-grey-pink {
  background: #ff99cc;
}
.font-white {
  color: #fff;
}
</style>