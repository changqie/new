<!-- 标准法规库 - 动态&资料 - 国内动态更多 -->
<template>
  <div id="domesticDynamics" class="v-class">
    <table-tools-bar>
      <div slot="left">
        <div class="back" title="返回" @click="back">
          <i class="el-icon-back"></i>
        </div>
        <span style="font-size: 18px;font-weight: bold">国内动态</span>
      </div>
      <div slot="right">
        <el-form :model="dynamics" inline class="label-input-form">
          <el-form-item label="国内动态搜索" prop="dynamicsName" class="serch-form-item">
            <el-input v-model="dynamics.dynamicsName" clearable placeholder="请输入搜索内容"/>
          </el-form-item>
          <el-form-item class="serch-form-item">
            <el-button
              class="searchAngNewBtn"
              type="primary"
              @click="queryMsgByPageBtn"
              icon="el-icon-search"
              title="搜索"
            ></el-button>
          </el-form-item>
        </el-form>
      </div>
    </table-tools-bar>
    <div class="content">
      <div class="dynamicsContent-container" v-if="inlandMsgList.length > 0">
        <div v-for="(item, index) in inlandMsgList" :key="index" @click="showMsgDetails(item.id)">
          <ul>
              <li class="title">
                <div v-show="isNew(item.pubTime)" class="new">new</div>
                <i class="el-icon-caret-right" />
                <span class="domestic-dynamic-title">{{ item.title }}</span>
                <span class="time">{{ getDate(item.pubTime) }}</span>
              </li>
          </ul>
        </div>
      </div>
      <has-no-data pClass="content-detail" v-if="inlandMsgList.length === 0"></has-no-data>
    </div>
    <loading :loading="loading">数据获取中</loading>
    <pagination :total="total" @pageChange="pageChange" @pageSizeChange="pageSizeChange"></pagination>
  </div>
</template>

<script src="../js/DomesticDynamics.js"></script>

<style lang="less">
  @import '~@/assets/styles/style';
  @import '~@/assets/styles/mixins';
  #domesticDynamics{
    padding: 0.2rem 0.3rem;
    .content{
      width: 100%;
      height: calc(~'100% - 120px');
      overflow-x: hidden !important;
      overflow-y: auto !important;
    }
    .content .content-detail {
      width: 100%;
      height: calc(~'100% - 8px');
      overflow-y: auto;
      padding: 0.1rem;
      background-color: white;
    }
    .i{
      font-style: italic;
      color: #E4393C;
      font-weight: bold;
      margin-right: 5px;
    }
    .ivu-form-item{
      margin-right: 0;
    }
    .dynamicsContent-container{
      height: 100%;
      font-size: 12px;
      .title{
        line-height: 35px;
        padding-left: 50px;
        padding-right: 100px;
        cursor: pointer;
        position: relative;
        .flex();
        i{
          width: 15px;
          .flex();
          justify-content: center;
          align-items: center;
        }
        .domestic-dynamic-title{
          flex: 1;
          .ellipsis();
          &:hover{
            color:@baseColor;
            text-decoration:underline;
            font-weight:bold;
          }
        }
        .time{
          width: 150px;
          .flex();
          justify-content: flex-end;
        }
      }
      .new{
        position: absolute;
        top: 50%;
        left: 20px;
        color: #FF0000;
        font-style: italic;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        font-size: 12px;
        .flex();
        justify-content: center;
        align-items: center;
        margin-top: -10px;
      }
    }
  }
</style>
