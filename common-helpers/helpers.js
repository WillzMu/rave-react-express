const crypto = require('crypto')
const forge = require('node-forge')
const request = require('superagent')

// reference to encryption: https://developer.flutterwave.com/reference#rave-encryption
const getKey = () => {
  const secKey = process.env.RAVE_SECRET_KEY_TEST
  const keymd5 = crypto.createHash('md5').update(process.env.RAVE_SECRET_KEY_TEST).digest('hex')
  const keymd5last12 = keymd5.substr(-12)
  const seckeyadjusted = secKey.replace('FLWSECK-', '')
  const seckeyadjustedfirst12 = seckeyadjusted.substr(0, 12)
  return seckeyadjustedfirst12 + keymd5last12
}

const encrypt = (payload) => {
  payloadJSON = JSON.stringify(payload)
  const cipher = forge.cipher.createCipher('3DES-ECB', forge.util.createBuffer(getKey()))
  cipher.start({ iv: '' })
  cipher.update(forge.util.createBuffer(payloadJSON, 'utf-8'))
  cipher.finish()
  const encrypted = cipher.output
  return (forge.util.encode64(encrypted.getBytes()))
}

const raveResponse = async (payload) => {
  return request
    .post(process.env.RAVE_CHARGE_ENDPOINT_TEST)
    .set({ 'Content-Type': 'application/json', Accept: 'application/json' })
    .send({
      PBFPubKey: process.env.RAVE_PUBLIC_KEY_TEST,
      client: encrypt(payload),
      alg: '3DES-24'
    })
}

module.exports = {
  raveResponse
}
