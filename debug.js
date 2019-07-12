const MESALVA_API = 'https://qa-apiv2.mesalva.com/'
const MESALVA_HMAC = 'f8c241eb39fb01d8901a726d1d95668078abafaa558efbaace41d5e243d4d3e5'
const MESALVA_CLIENT = 'CONCRETE'
const MESALVA_USER = 'concrete@mesalva.com'
const MESALVA_PASSWORD = '!GY2kip+a#,^'
const MeSalva = require('./index').default
var ms = new MeSalva({ MESALVA_HMAC, MESALVA_USER, MESALVA_PASSWORD, MESALVA_API, MESALVA_CLIENT })
var b = ms.getMedium('enem-e-vestibulares/materias/matematica-e-suas-tecnologias/matematica/revisao/revisao-enem-funcoes/rexp-funcoes-exponenciais-e-logaritmicas/rexp01-funcoes-exponenciais-como-cai-no-enem/rexp01v').then(a => console.log(a))
