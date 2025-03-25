<template>
    <div>
      <div class="el-login-footer">
        <!-- <p>© 2025 Your Company. All rights reserved.</p> -->
        <span>Copyright © 2025-2025 zhic.site 
          <a href="http://beian.miit.gov.cn" target="_blank">豫ICP备2025116777号-1</a>
        </span>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'Footer'
  }
  </script>
  
  <style scoped>
  
  .el-login-footer {
  height: 40px;
  line-height: 40px;
  position: fixed;
  bottom: 0;
  width: 100%;
  text-align: center;
  background-color: grey;
  color: white;
  font-family: Arial;
  font-size: 12px;
  letter-spacing: 1px;
}
.el-login-footer a{
  color:white
}

.el-login-footer a:hover {
  color: orange; 
}
  </style>