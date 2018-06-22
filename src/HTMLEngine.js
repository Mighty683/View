function findKeys (string, callback) {
  return string.replace(/<\$(.*?)\/>/g, callback)
}

function replaceKeys (data, _, code) {
  let newCode = code
  let variables = Object.keys(data).map(function (key) {
    let dataString = typeof data[key] === 'function' ? data[key] : JSON.stringify(data[key])
    return key + ' = ' + dataString
  }).join(',\n')
  if (/^.*if|^.*while|^.*for|^.*let|^.*var/g.test(code)) {
    newCode = '(function () {' + code + '})()'
  }
  try {
    /* eslint-disable */
    return new Function('', 'let ' + variables + '\nreturn ' + newCode)()
    /* eslint-enable */
  } catch (e) { return code }
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
