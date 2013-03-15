function string_fill(char, len) {
    for (var s = '', i = len; i; s += char, i--) { ; }
    return s;
}

/***
 * s = source string
 * l = position to insert/replace
 * n = number of chars of source to remove
 * c = string to insert
 * example: string_replace('hello world', 5, 1, ' to the ') => 'hello to the world'
 */
function string_replace(s, l, n, c) {
    return s.substr(0, l) + c + s.substr(l + n);
}

function log(msg){
  if (window.console && console.log) {
    console.log(msg); //for firebug
  }
}
