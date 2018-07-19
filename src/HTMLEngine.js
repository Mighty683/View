function findKeys (string, callback) {
  return string.replace(/<\$(.*?)\/>/g, callback)
}

function replaceKeys (data, _, code) {
  let doEscape = _.substring(0, 3) === '<$_'
  let parsedCode = doEscape ? code.slice(1) : code
  let scoped = parsedCode.replace(/(["'.\w]+)/g, function (match) {
    return /["']/.test(match[0]) ? match : '_data.' + match
  })
  try {
    /* eslint-disable */
    let result = new Function('_data', 'return '+ scoped)(data)
    /* eslint-enable */
    return doEscape ? escape(result) : result
  } catch (e) { return parsedCode }
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
  return string
}

HTMLEngine.evalString = function (string, data) {
  if (Object.keys(data).length > 0) {
    return findKeys(string, replaceKeys.bind(this, data))
  } else {
    return string || ''
  }
}

function HTMLEngine () {

}

module.exports = HTMLEngine
