var inputbox = document.getElementById('searchInput');
var searchListContainer = document.getElementById('searchListContainer')

inputbox.addEventListener('keyup', function (e) {
    debounce(doSearch, 300)({searchContent:inputbox.value, dataArr:searchData})
});

inputbox.onblur = function () {
    // wait until click
    setTimeout(function () {
      clearChildren(searchListContainer)
    }, 150)

};

inputbox.onfocus = function () {
    doSearch({searchContent:inputbox.value, dataArr:searchData})
};


// 防抖
function debounce(fun, delay) {
    return function (args) {
        let that = this
        let _args = args
        clearTimeout(fun.id)
        fun.id = setTimeout(function () {
            fun.call(that, _args)
        }, delay)
    }
}

//获取最小编辑距离
function getLevenshteinDistance(leftStr, rightStr) {
    if (leftStr == null || rightStr == null) {
        return 0;
    }

    leftLen = leftStr.length; 
    rightLen = rightStr.length;

    if (leftLen == 0) {
        return rightLen;
    } else if (rightLen == 0) {
        return leftLen;
    }

    if (leftLen > rightLen) {
        // swap the input strings to consume less memory
        tmp = leftStr;
        leftStr = rightStr;
        rightStr = tmp;
        leftLen = rightLen;
        rightLen = rightStr.length;
    }

    previousCostArr = []; //'previous' cost array, horizontally
    costArr = []; // cost array, horizontally
    placeholderForSwappingCostArr = []; //placeholder to assist in swapping previousCostArr and costArr

    rightStr_j = "";

    cost = 0; // cost

    for (i = 0; i <= leftLen; i++) {
        previousCostArr[i] = i;
    }

    for (j = 1; j <= rightLen; j++) {
        rightStr_j = rightStr.charAt(j - 1);
        costArr[0] = j;

        for (i = 1; i <= leftLen; i++) {
            cost = leftStr.charAt(i - 1) === rightStr_j ? 0 : 1;
            // minimum of cell to the left+1, to the top+1, diagonally left and up +cost
            costArr[i] = Math.min(Math.min(costArr[i - 1] + 1, previousCostArr[i] + 1), previousCostArr[i - 1] + cost);
        }

        // copy current distance counts to 'previous row' distance counts
        placeholderForSwappingCostArr = previousCostArr;
        previousCostArr = costArr;
        costArr = placeholderForSwappingCostArr;
    }

    // our last action in the above loop was to switch d and p, so p now 
    // actually has the most recent cost counts
    return previousCostArr[leftLen];
}

function doSearch(input) {
    if(input.searchContent.length < 1) {
        return;
    }
    var listContainer = searchListContainer;
    clearChildren(listContainer);
    var toSearchArr = []
    for(i =0 ; i < input.dataArr.length; i++) {
        if(input.dataArr[i].content.toLowerCase().indexOf(input.searchContent.toLowerCase()) > -1) {
            toSearchArr.push(input.dataArr[i])
        }
    }
    function bestMatchSortBy(left, right) {
        leftContent = left.content.toLowerCase()
        rightContent = right.content.toLowerCase()
        theSearchContent = input.searchContent.toLowerCase()

        // 先保证以搜索内容为开头的更容易被搜索到
        if (leftContent.startsWith(theSearchContent) && !rightContent.startsWith(theSearchContent)) {
            return -1;
        } else if (!leftContent.startsWith(theSearchContent) && rightContent.startsWith(theSearchContent)) {
            return 1;
        }

        leftDistance = getLevenshteinDistance(leftContent, theSearchContent);
        rightDistance = getLevenshteinDistance(rightContent, theSearchContent);
        if(leftDistance == undefined) {
            leftDistance = 0;
        }
        if(rightDistance == undefined) {
            rightDistance = 0;
        }
        return leftDistance - rightDistance;
    }
    toSearchArr.sort(bestMatchSortBy)
    for(i =0 ; i < toSearchArr.length; i++) {
        listContainer.appendChild(createSearchItem(input.searchContent, toSearchArr[i]))
    }
}

function createSearchItem(searchContent, jsonItem) {
    content = jsonItem.content;
    url = jsonItem.url;
    container = document.createElement('ul');
    container.setAttribute('class','searchContent');
    contentView = document.createElement('li');
    urlView = document.createElement('div');
    container.appendChild(contentView)
    container.appendChild(urlView)
    container.addEventListener('click', (function (clickUrl) {
        return function(element){
            window.open(clickUrl);
        }
    }(url)));
    contentView.innerHTML = highLightKeyWord(searchContent, content);
    urlView.textContent = url;
    urlView.setAttribute('class','searchUrl');
    return container;
}

function clearChildren(node) {
    while (node.firstChild) {
        node.removeChild(node.firstChild);
    }
}

function highLightKeyWord(keyword, targetContent) { 
    /* 获取需要处理的关键字 */ 
    var resultHtml = targetContent; 
    /* 关键字替换文本 该文本设置有高亮颜色 */ 
    var replaceText = "<font style='color:red;'>$1</font>"; 
    /* 关键字正则匹配规则 */ 
    var r = new RegExp("(" + keyword + ")", "ig"); 
    /* 将匹配到的关键字替换成我们预设的文本 */ 
    resultHtml = resultHtml.replace(r, replaceText); 
    /* 用于innerHTML */ 
    return resultHtml;
}
