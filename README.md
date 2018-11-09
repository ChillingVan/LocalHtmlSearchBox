# 给javadoc添加搜索框

### 依赖
  安装java环境
  安装python
  pip install bs4
    
  bs4是用于解析HTML用的

### 原理

* python 生成搜索数据
用python生成用于搜索的数据，以json的形式保存到一个js文件里。数据的来源于javadoc的html文件，所以需要解析html文件（类似爬虫），获取里面有用的数据。
生成的数据保存到js里，这样打开javadoc的网页时，能够加载出来。同时js的代码能获取搜索用的数据。
最后在搜索时，js可以利用搜索的数据，产生并显示搜索列表

* 配合javadoc使用

javadoc的命令我是在Python里直接运行的。这里的关键是-overview参数，这个参数可以指定一个html文档的body部分显示在javadoc的首页。
然后overview.html里指定跳转到search.html，就可以在search.html里任意布局网页，添加一个搜索框了。

### 使用
先进入/doc文件夹
只需 python gen_javadoc.py directory就行。
例如
python gen_javadoc.py ..\build\doc_java\