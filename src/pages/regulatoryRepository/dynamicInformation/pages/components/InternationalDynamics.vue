<!-- 标准法规库 - 动态&资料 - 国外动态更多-->
<template>
  <div id="internationalDynamics">
    <table-tools-bar>
      <div slot="left">
        <div class="back" title="返回" @click="back">
          <i class="el-icon-back"></i>
        </div>
        <span style="font-size: 18px;font-weight: bold">国外动态</span>
      </div>
      <div slot="right">
        <el-form :model="dynamics" inline class="label-input-form">
          <el-form-item label="国外动态搜索" prop="internationalName" class="serch-form-item">
            <el-input v-model="dynamics.internationalName" clearable placeholder="请输入搜索内容"/>
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
              <span class="international-dynamic-title">{{ item.title }}</span>
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

<script src="../js/InternationalDynamics.js"></script>

<style lang="less">
  @import '~@/assets/styles/style';
  @import '~@/assets/styles/mixins';
  #internationalDynamics{
    padding: 0.2rem 0.3rem;
    height: 100%;
    .content{
      width: 100%;
      height: calc(100% - 20px);
      overflow-x:hidden !important;
      overflow-y: auto !important;
    }
    .content .content-detail {
      width: 100%;
      height: calc(100% - 8px);
      overflow-y: auto;
      padding: 0.1rem;
      background-color: white;
    }
    ul li .time{
      float: right;

    }
    ul li.title{
      line-height: 35px;
      padding-left: 50px;
      padding-right: 100px;
      cursor:pointer;
      position: relative;
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
      .title{
        .flex();
        i{
          width: 15px;
          .flex();
          justify-content: center;
          align-items: center;
        }
        .international-dynamic-title{
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
    }
  }
</style>
