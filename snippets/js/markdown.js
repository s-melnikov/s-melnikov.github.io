function marked(str) {
  return str.replace(/!\[(.*?)\]\((.*?)\)/gis, '<img src=\'$2\' alt=\'$1\'</img>') //images
    .replace(/\[(.*?)\]\((.*?)\)/gis, '<a href=\'$2\'>$1</a>') // links
    .replace(/\*\*(.*?)\*\*/gis, '<strong>$1</strong>') // bold
    .replace(/__(.*?)__/gis, "<strong>$1</strong>") //bold
    .replace(/\*(.*?)\*/gis, '<em>$1</em>') // italics
    .replace(/_(.*?)_/gis, "<em>$1</em>") // italics
    .replace(/`(.*?)`/gis, '<code>$1</code>') //code
    .replace(/~~(.*?)~~/gis, '<del>$1</del>') //strikeThrough
    .replace(/^\s*#\s+(.*?$)/gis, "<h1>$1</h1>") // h1
    .replace(/^\s*##\s+(.*?$)/gis, "<h2>$1</h2>") // h2
    .replace(/^\s*###\s+(.*?$)/gis, "<h3>$1</h3>") // h3
    .replace(/^\s*####\s+(.*?$)/gis, "<h4>$1</h4>") // h4
    .replace(/^\s*#####\s+(.*?$)/gis, "<h5>$1</h5>") // h5
    .replace(/^\s*######\s+(.*?$)/gis, "<h6>$1</h6>"); // h6
}