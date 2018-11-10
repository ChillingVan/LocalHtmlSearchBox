# Searchbox for Javadoc

### Dependancy

Java, I use Java8
python3
pip install bs4
This is used to parse html to python object

### Usage

python gen_javadoc.py directory
Example:
python gen_javadoc.py ..\build\doc_java\

### How it works

- Use python to generate the search data
  python uses bs4, the beautifulsoup, to parse the javadoc html. Then the text of html will be collected as json. And the json data will be saved to a js file.

- Use javascript to read the json data
  The json is in a js file, so you can read it to a var through javascript. And javascript generate search items with these data.

* The javadoc command
  I run the javadoc command in Python. The key parameter is the -overview. This parameter can apply the body part of a html to the main page of javadoc.
  And you can jump to the search.html in your overview.html. Then you can layout your own search.html and add a searchbox on it.
