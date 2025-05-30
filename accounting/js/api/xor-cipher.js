const B64_TABLE = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

const b64_encode = (data) => {
  let o1, o2, o3, h1, h2, h3, h4, bits, r, i = 0, enc = "";
  if (!data) return data;
  do {
    o1 = data[i++];
    o2 = data[i++];
    o3 = data[i++];
    bits = o1 << 16 | o2 << 8 | o3;
    h1 = bits >> 18 & 0x3f;
    h2 = bits >> 12 & 0x3f;
    h3 = bits >> 6 & 0x3f;
    h4 = bits & 0x3f;
    enc += B64_TABLE.charAt(h1) + B64_TABLE.charAt(h2) + B64_TABLE.charAt(h3) + B64_TABLE.charAt(h4);
  } while (i < data.length);
  r = data.length % 3;
  return (r ? enc.slice(0, r - 3) : enc) + "===".slice(r || 3);
}

const b64_decode = (data) => {
  let o1, o2, o3, h1, h2, h3, h4, bits, i = 0, result = [];
  if (!data) return data;
  data += "";
  do {
    h1 = B64_TABLE.indexOf(data.charAt(i++));
    h2 = B64_TABLE.indexOf(data.charAt(i++));
    h3 = B64_TABLE.indexOf(data.charAt(i++));
    h4 = B64_TABLE.indexOf(data.charAt(i++));
    bits = h1 << 18 | h2 << 12 | h3 << 6 | h4;
    o1 = bits >> 16 & 0xff;
    o2 = bits >> 8 & 0xff;
    o3 = bits & 0xff;
    result.push(o1);
    if (h3 !== 64) {
      result.push(o2);
      if (h4 !== 64) {
        result.push(o3);
      }
    }
  } while (i < data.length);
  return result;
}

const keyCharAt = (key, i) => key.charCodeAt(Math.floor(i % key.length));

const xor_decrypt = (key, data) => {
  return [...data].map(function(c, i) {
    return String.fromCharCode( c ^ keyCharAt(key, i) );
  }).join("");
}

export default {
  encode(key, data) {
    return b64_encode([...data].map(function(c, i) {
      return c.charCodeAt(0) ^ keyCharAt(key, i);
    }));
  },
  decode(key, data) {
    return [...b64_decode(data)].map(function(c, i) {
      return String.fromCharCode( c ^ keyCharAt(key, i) );
    }).join("");
  }
};
