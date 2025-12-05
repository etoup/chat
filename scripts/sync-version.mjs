import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const pkgPath = path.join(root, 'package.json')
const tauriConfPath = path.join(root, 'src-tauri', 'tauri.conf.json')
const cargoPath = path.join(root, 'src-tauri', 'Cargo.toml')

const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'))
const version = pkg.version

const tauriConf = JSON.parse(fs.readFileSync(tauriConfPath, 'utf8'))
tauriConf.version = version
fs.writeFileSync(tauriConfPath, JSON.stringify(tauriConf, null, 2) + '\n')

const cargo = fs.readFileSync(cargoPath, 'utf8')
const updatedCargo = cargo.replace(/(^\s*version\s*=\s*")[^"]+("\s*$)/m, `$1${version}$2`)
fs.writeFileSync(cargoPath, updatedCargo)
