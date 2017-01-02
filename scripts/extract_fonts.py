import sys
import re
import urllib
import os.path
from os import makedirs

if len(sys.argv) != 2:
    print 'Usage: %s <css_font>'%sys.argv[0]
    sys.exit()

font_css = sys.argv[1]

f = open(font_css)
content = f.read()
f.close()

urls = re.findall('url\(([^)]+)\)', content, re.M)

fonts_path = os.path.abspath(os.path.join(os.path.dirname(sys.argv[1]), '../fonts'))
if not os.path.exists(fonts_path):
    makedirs(fonts_path)

for url in urls:
    font_path = os.path.join(fonts_path, url.split('/')[-1])
    print font_path
    font = urllib.URLopener()
    font.retrieve(url, font_path)

