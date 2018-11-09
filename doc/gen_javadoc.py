import os
import sys
import gen_database as gendb
import json
from shutil import copyfile


def run_cmd(cmd):
    cmd_pipe = os.popen(cmd)
    cmd_print = cmd_pipe.read()
    print(cmd_print)


if __name__ == '__main__':
    print("")
    readRootDir = sys.argv[1]
    if readRootDir[-1] != r"/" or readRootDir[-1] != "\\":
        readRootDir = readRootDir + "/"
    # Generate java doc by javadoc command
    run_cmd(r"javadoc -locale en -encoding UTF-8 -charset UTF-8 -sourcepath "
            + r"../src ../src/main/java/com/chillingvan/docsearcher/Foooo.java ../src/main/java/com/chillingvan/docsearcher/foo/SubFoo.java"
            + r" -subpackages com  -overview ./overview.html -d ../build/doc_java")

    # copy js and css to target dir
    copyfile('search.html', readRootDir + 'search.html')
    copyfile('docsearcher.css', readRootDir + 'docsearcher.css')
    copyfile('searchlib.js', readRootDir + 'searchlib.js')

    # Read the html documents under /com to generate json data to a .js
    databaseDir = readRootDir

    def on_read_file(path, resultArr):
        if 'html' in path:
            url = path[path.index(readRootDir) + len(path):]
            url = url.replace('\\', '/')
            resultArr.extend(gendb.simpleReadOne(path, url))

    resultArr = []
    gendb.read_files(readRootDir + 'com/', on_read_file, resultArr)

    finalResultArr = []
    gendb.removeSame(resultArr, finalResultArr)
    with open(databaseDir + 'searchData.js', 'w') as fl:
        fl.write("var searchData = " + json.dumps(finalResultArr))
