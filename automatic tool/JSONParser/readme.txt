注意：本工具只能在Linux环境下使用
使用方法：

步骤一：安装环境
Perl语言解析Excel表需要相应的工具包，这里安装的工具包只能限于office2007版本以上的excel程序解析，对于office2003的excel表需要安装另外的工具包，目前不清楚是不是可以向下兼容。
工具包的位置在本目录下，安装顺序从Archive-Zip-1.34.tar.gz到Unicode-Map-0.112.tar.gz，按照字母顺序安装，下面举个例子：
tar  xf  Archive-Zip-1.34.tar.gz   
cd  Archive-Zip-1.34         
perl Makefile.PL
make
make install
make test   (该命令检查是否安装正确，可以不执行)

注意：所有工具包都要执行一遍以上命令

步骤二：环境安装完后，我们只需要一个excel文件以及perl脚本
假设excel文件和perl脚本在/home/lg/目录下，那么接下去执行的命令是：
perl  perl脚本文件名  excel文件名 目标目录  源目录
即：
perl web_lang_gen_json.pl xxx.xlsx ./ ./
然后将会生成pl语言要求的json文件（具体目录需要根据当前的文件结构），
在该目录下会有对应语言包的文件夹。


