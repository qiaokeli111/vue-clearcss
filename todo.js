//  测试
1 筛选出来的元素是id class  tag
2 筛选的元素只有before 或者 after
//  vue的动态class id    delete   不支持动态computed
//  after的处理    delete
//  vue ui的集成    最后
//  todo 多个style的情况
//  搜索的元素是id或tag    delete
//  其他的css格式
//  只处理了' '的选择器  >  delete  [attr] delete  :lastchild等等
//  选择器做缓存  html查找元素的缓存  动态便利的不做缓存因为相同可能性很小
//  优化vue解析的ast type 目前为1才是，3不是，其他未知
//  多个页面同时调用