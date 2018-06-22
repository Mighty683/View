function findKeys (string, callback) {
  return string.replace(/<\$(.*?)\/>/g, callback)
}

function replaceKeys (data, _, code) {
  let doEscape = _.substring(0, 3) === '<$_'
  code = doEscape ? code.slice(1) : code
  let variables = Object.keys(data).map(function (key) {
    let dataString = typeof data[key] === 'function' ? data[key] : JSON.stringify(data[key])
    return key + ' = ' + dataString
  }).join(',\n')
  if (/^.*if|^.*while|^.*for|^.*let|^.*var/g.test(code)) {
    code = '(function () {' + code + '})()'
  }
  try {
    /* eslint-disable */
    let fun = new Function('', 'let ' + variables + '\nreturn ' + code)()
    /* eslint-enable */
    return doEscape ? escape(fun) : fun
  } catch (e) { return code }
}

function escape (string) {
  let escapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '`': '&#x60;'
  }
  Object.keys(escapeMap).forEach(function (key) {
    let testRegx = new RegExp(key, 'g')
    string = string.replace(testRegx, function () {
      return escapeMap[key]
    })
  })
  console.log(string)
  return string
}

HTMLEngine.evalString = function (string, data) {
  if (Object.keys(data).length > 0) {
    return findKeys(string, replaceKeys.bind(this, data))
  } else {
    return string
  }
}

function HTMLEngine () {

}

module.exports = HTMLEngine
