function render(tpl) {
  var code = ''
  while (tpl != '') {
    var begin = tpl.search(/{%/)
    code += '_b_+=("' + tpl.substring(0, begin != -1 ? begin : tpl.length)
      .replace(/"/g, '\\"')
      .replace(/\n/g, '\\n') + '").toString();' + (begin ? '\n' : '')
    tpl = tpl.substring(begin != -1 ? begin + 2 : tpl.length)
    var end = tpl.search(/%}/)
    if (end === -1) continue
    if (tpl.charAt(0) !== '=') code += tpl.substring(0, end) + '\n';
    else code += '_b_+=(' + tpl.substring(1, end) + ').toString();\n'
    tpl = tpl.substring(end + 2)
  }
  return (new Function("var _b_='';"+code+";return _b_"))()
}
var tpl = `
<ul>
  {% [1,2,3,4,5].forEach(function(i) { %}
    <li><a href="#">Link #{%= i %}</a></li>
  {% }) %}
</ul>
`
render(tpl)
