# ImportDataToDb
----

将文件数据导入数据库框架。

### 一些方法

1. 一次导入设置就是一个字符串 + 文件

```
    importDataToDb --lineAction '{id:int(11)},{field1:varchar(255)},{field2:float}' -d database -u root -p password data.filename
```

2. 关于字串处理学习awk模式，默认\n换行空格分字段

3. 提供行遍历和字段遍历

```
    importDataToDb --fieldAction '{id:int(11)},{field1:varchar(255)},{field2:float}' ... data.filename
```

### feature

1. 提供一个配置版本，最好是写个配置就可以包含导入匹配方法和数据结构。
