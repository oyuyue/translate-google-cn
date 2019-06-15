/**
 * Last update: 2016/06/26
 * https://translate.google.com/translate/releases/twsfe_w_20160620_RC00/r/js/desktop_module_main.js
 *
 * Everything between 'BEGIN' and 'END' was copied from the url above.
 */

const got = require('got');
const Configstore = require('configstore');

/* eslint-disable */
// BEGIN

function sM(a) {
  var b;
  if (null !== yr) b = yr;
  else {
    b = wr(String.fromCharCode(84));
    var c = wr(String.fromCharCode(75));
    b = [b(), b()];
    b[1] = c();
    b = (yr = window[b.join(c())] || '') || '';
  }
  var d = wr(String.fromCharCode(116)),
    c = wr(String.fromCharCode(107)),
    d = [d(), d()];
  d[1] = c();
  c = '&' + d.join('') + '=';
  d = b.split('.');
  b = Number(d[0]) || 0;
  for (var e = [], f = 0, g = 0; g < a.length; g++) {
    var l = a.charCodeAt(g);
    128 > l
      ? (e[f++] = l)
      : (2048 > l
          ? (e[f++] = (l >> 6) | 192)
          : (55296 == (l & 64512) &&
            g + 1 < a.length &&
            56320 == (a.charCodeAt(g + 1) & 64512)
              ? ((l = 65536 + ((l & 1023) << 10) + (a.charCodeAt(++g) & 1023)),
                (e[f++] = (l >> 18) | 240),
                (e[f++] = ((l >> 12) & 63) | 128))
              : (e[f++] = (l >> 12) | 224),
            (e[f++] = ((l >> 6) & 63) | 128)),
        (e[f++] = (l & 63) | 128));
  }
  a = b;
  for (f = 0; f < e.length; f++) (a += e[f]), (a = xr(a, '+-a^+6'));
  a = xr(a, '+-3^+b+-f');
  a ^= Number(d[1]) || 0;
  0 > a && (a = (a & 2147483647) + 2147483648);
  a %= 1e6;
  return c + (a.toString() + '.' + (a ^ b));
}

var yr = null;
var wr = function(a) {
    return function() {
      return a;
    };
  },
  xr = function(a, b) {
    for (var c = 0; c < b.length - 2; c += 3) {
      var d = b.charAt(c + 2),
        d = 'a' <= d ? d.charCodeAt(0) - 87 : Number(d),
        d = '+' == b.charAt(c + 1) ? a >>> d : a << d;
      a = '+' == b.charAt(c) ? (a + d) & 4294967295 : a ^ d;
    }
    return a;
  };

// END
/* eslint-enable */

function parseCookies(cookie = '') {
  const res = {};
  const items = cookie.split('; ');
  items.forEach(item => {
    const v = item.split('=');
    res[v[0]] = v.slice(1).join('=');
  });
  return res;
}

const config = new Configstore('google-translate-api');

const window = {
  TKK: config.get('TKK') || '0',
  COOKIE: config.get('COOKIE') || ''
};

function updateTKK() {
  return new Promise(function(resolve, reject) {
    const now = Math.floor(Date.now() / 3600000);

    if (Number(window.TKK.split('.')[0]) === now) {
      resolve();
    } else {
      got('https://translate.google.cn', {
        headers: {
          'user-agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.80 Safari/537.36'
        }
      })
        .then(function(res) {
          const code = res.body.match(/tkk:'(\d+\.\d+)'/);
          const TKK = code[1];
          if (!TKK) return reject(new Error('can not get token'));
          window.TKK = TKK;
          config.set('TKK', TKK);

          const cookies = res.headers['set-cookie'];
          if (cookies && Array.isArray(cookies)) {
            window.COOKIE = 'NID=' + parseCookies(cookies[0])['NID'];
            config.set('COOKIE', window.COOKIE);
          }

          resolve(TKK);
        })
        .catch(reject);
    }
  });
}

function get(text) {
  return updateTKK().then(function() {
    return {
      name: 'tk',
      value: sM(text).replace('&tk=', ''),
      cookie: window.COOKIE
    };
  });
}

module.exports.get = get;
