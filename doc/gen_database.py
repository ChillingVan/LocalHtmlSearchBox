# coding: utf-8
from bs4 import BeautifulSoup
import bs4

import os
import sys


def read_one_file(url, inputContent, resultArr, filterArr):
    soup = BeautifulSoup(inputContent)
    level = 0
    anchorSet = set([])
    _iterate_nodes(soup, url, level, anchorSet, resultArr, filterArr)
    # print('anchorSet:', anchorSet)


def _iterate_nodes(soup, url, level, anchorSet, resultArr, filterArr):
    for item in soup.children:
        if isinstance(item, bs4.element.Tag):
            # Collect href
            if item.name == 'a' and item.attrs.__contains__('href'):
                attrHref = item.attrs['href']
                if '#' in attrHref:
                    anchorSet.add(attrHref[attrHref.index('#')+1:])
            # change url
            if item.attrs.__contains__('id'):
                itemId = item.attrs['id']
                if itemId in anchorSet:
                    url = _update_url(url, itemId)
            # change url
            if item.name == 'a' and item.attrs.__contains__('name'):
                url = _update_url(url, item.attrs['name'])

            # Continue iterate
            _iterate_nodes(item, url, level+1, anchorSet, resultArr, filterArr)
        if item is not None and isinstance(item, bs4.element.NavigableString):
            if not _is_match(filterArr, item):
                continue

            itemStr = item.strip()
            if itemStr != '' and len(itemStr) >= 3:
                resultArr.append(_create_item(url, item.string))


def _update_url(url, anchor):
    if '#' in url:
        url = url[:url.index('#')]
    url = url + '#' + anchor
    return url


def _is_match(filterArr, node):
    for nodefilter in filterArr:
        if not nodefilter(node):
            return False
    return True


def _create_item(url, content):
    makeJson = {}
    makeJson['url'] = url
    makeJson['content'] = content
    return makeJson


def remove_same(srcArr, dstArr):
    for item in srcArr:
        is_dup = False
        for dstItem in dstArr:
            if item['url'] == dstItem['url'] and item['content'] == dstItem['content']:
                is_dup = True
                break
        if not is_dup:
            dstArr.append(item)


def read_files(directory, on_read_file, *arg):
    _recursive_read_files(directory, on_read_file, *arg)


def _recursive_read_files(path, on_read_fl, *arg):
    if os.path.isdir(path):
        for file_in_dir in os.listdir(path):
            _recursive_read_files(os.path.join(
                path, file_in_dir), on_read_fl, *arg)

    else:
        on_read_fl(path, *arg)


def simple_read_one(path, url, custom_filter_arr=[]):
    """
    Args:
        path: the path of the file
        url: the url of the search item
        custom_filter_arr: an array that contains filter function function_name(node). The node is a node of bs4
    """
    arr = []
    read_one_file(url, open(path, 'r', encoding='utf-8'), arr,
                  [not_allow_tags_filter, not_allow_content_filter, not_allow_type_filter].extend(custom_filter_arr))
    return arr


def not_allow_content_filter(node):
    not_allow_prefix_arr = [
        '\n<div>JavaScript is disabled on your browser.</div>']
    content = node.string
    for not_allow_prefix in not_allow_prefix_arr:
        if content is not None and content.lower().startswith(not_allow_prefix.lower()):
            return False
    return True


def not_allow_type_filter(node):
    if isinstance(node, bs4.element.Comment) or isinstance(node, bs4.element.Doctype):
        return False
    return True


def not_allow_tags_filter(node):
    tagName = node.parent.name
    if tagName == 'meta' or tagName == 'style':
        print('not allow:', tagName)
        return False
    return True
