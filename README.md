# 给 javadoc 添加搜索框

# [ENGLISH README](https://github.com/ChillingVan/LocalHtmlSearchBox/blob/master/README_en.md)

### 依赖

安装 java 环境，本项目基于 java8
安装 python3
pip install bs4

bs4 是用于解析 HTML 用的

### 使用

先进入/doc 文件夹
只需 python gen_javadoc.py directory 就行。
例如
python gen_javadoc.py ..\build\doc_java\

### 原理

- python 生成搜索数据

  用 python 生成用于搜索的数据，以 json 的形式保存到一个 js 文件里。数据的来源于 javadoc 的 html 文件，所以需要解析 html 文件（类似爬虫），获取里面有用的数据。

具体就是利用 bs4，也就是 beautifulsoup 来解析 html，生成的 json 的格式大致如下:

```
[
  {"url":"target url", "content", "The search content"},
  {"url":"target url", "content", "The search content"},
  {"url":"target url", "content", "The search content"}
  ...
]
```

- 利用 javascript 读取搜索数据

  生成的数据保存到 js 里，这样打开 javadoc 的网页时，能够加载出来。同时 js 的代码能获取搜索用的数据。 最后在搜索时，js 可以利用搜索的数据，产生并显示搜索列表。
  所谓搜索，就是比对每一个 content 是否有你想搜索的 content. 这里用了寻找最近编辑距离的 getLevenshteinDistance 算法。

- 配合 javadoc 使用

javadoc 的命令我是在 Python 里直接运行的。这里的关键是-overview 参数，这个参数可以指定一个 html 文档的 body 部分显示在 javadoc 的首页。
然后 overview.html 里指定跳转到 search.html，就可以在 search.html 里任意布局网页，添加一个搜索框了。
