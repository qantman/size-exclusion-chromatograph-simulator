const fs = require('fs')
const path = require('path')
const readline = require('readline')
const _get = require('lodash/get')
const _isEmpty = require('lodash/isEmpty')
// const _merge = require('lodash/merge')

module.exports = class FsElement {
  static defaultShortLinesCount = 20
  static defaultShortLinesSlice = 3
  static defaultStringSliceCount = 60

  constructor (obj, recursive) {
    // check if argument is a path string
    if (typeof obj === 'string' ||
      obj instanceof String) {
      // make obj.path
      obj = { path: obj }
    }
    obj = obj || {}

    let propConf = {
      value: {},
      writable: true,
      enumerable: false,
      configurable: false
    }
    Object.defineProperty(this, '_content', propConf)
    Object.defineProperty(this, '_stats', propConf)
    Object.defineProperty(this, '_parse', propConf)

    Object.assign(this, obj)

    this.clsName = obj.clsName || 'FsElement'
    this.shortLinesCount = this.shortLinesCount ||
      FsElement.defaultShortLinesCount
    this.shortLinesSlice = this.shortLinesSlice ||
      FsElement.defaultShortLinesSlice
    this.stringSliceCount = this.stringSliceCount ||
      FsElement.defaultStringSliceCount

    this.refresh(recursive, this.path) // update file/dir data
  }

  _throwNotFoundError (fullPath) {
    this.exists = false
    this.errorPath = fullPath
    throw Error(path.parse(this.errorPath).base + ' not found')
  }

  runConstructors (fullPath) {
    fullPath = fullPath || this.path
    this.path = path.normalize(fullPath)
    this.parse = path.parse(fullPath)
    let ex = fs.existsSync(this.path)
    if (ex) {
      this.exists = true
      this.id = this.id ||
        'id' + new Date().getTime() + '@' + this.path
      this.name = this.parse.base

      // save modification time
      let mtimeMs = this.mtimeMs
        ? JSON.parse(JSON.stringify(this.mtimeMs))
        : 0

      this.stats = fs.lstatSync(fullPath)
      this.mtimeMs = this.stats.mtimeMs

      // if this is newer
      if (this.mtimeMs > mtimeMs) {
        this.needRefresh = true // update file/dir data
      } else {
        this.needRefresh = false
      }
    } else {
      this._throwNotFoundError(fullPath)
    }
  }

  refresh (recursive, fullPath, shortLinesCount) {
    // console.log('scanning', fullPath || this.path)
    this.runConstructors(fullPath)

    if (!this.exists) {
      return this._throwNotFoundError(fullPath || this.path)
    }

    if (fs.lstatSync(this.path).isDirectory()) {
      // console.log('DIRECTORY', this.path)
      this.dir = true
      this.currentDir = this.path
      this.parentDir = path.join(this.path, '..')

      // dir entities list
      let dirEnts = fs.readdirSync(
        this.path, { withFileTypes: true })
      this.size = dirEnts.length

      // short description
      this.shortLines = dirEnts
        // .slice(0, this.shortLinesCount)
        .map(x => x.isDirectory()
          ? 'Directory: ' + x.name
          : 'File: ' + x.name)

      if (recursive) {
        let i = new Date().getTime()
        dirEnts.forEach(dirEnt => {
          i++
          let id = 'id' + i
          if (this.content[dirEnt.name] &&
            this.content[dirEnt.name].refresh) {
            this.content[dirEnt.name].refresh(
              recursive,
              path.join(this.path, dirEnt.name))
          } else {
            this.content[dirEnt.name] = new FsElement({
              id: id + '@' + this.path + '/' + dirEnt.name,
              path: path.join(this.path, dirEnt.name)
            }, recursive)
          }
        })
      }
    } else {
      // console.log('FILE', this.path)
      this.dir = false
      this.parentDir = this.parse.dir
      this.size = this.stats.size

      if (this.needRefresh) {
        this.readFirstLinesOfFile().then(res => {
          this.shortLines = res
        }).catch(e => { throw e })
      }
    }
  }

  readFirstLinesOfFile (count, slice) {
    // console.log('!!!!! readFirstLinesOfFile', this.path)
    count = count || this.shortLinesCount
    slice = slice || this.stringSliceCount
    return new Promise((resolve, reject) => {
      if (this.dir) {
        return reject(Error(
          'Short lines: ' + this.name + 'is directory'))
      }
      var lineCounter = 0
      var wantedLines = []
      try {
        var lineReader = readline.createInterface({
          input: fs.createReadStream(this.path),
        })
        lineReader.on('line', function (line) {
          // console.log('lineCounter', lineCounter)
          if (/\ufffd/.test(line)) {
            // console.log('(binary file)')
            wantedLines = ['(binary file)']
            lineReader.close()
            return
          }
          lineCounter++
          if (line.length > slice) {
            line = line.slice(0, slice) + '...'
          }
          wantedLines.push(line)
          if (lineCounter === count) {
            lineReader.close()
          }
        })
        lineReader.on('close', function() {
          // console.log('wantedLines', wantedLines)
          return resolve(JSON.parse(JSON.stringify(wantedLines)))
        })
      } catch (e) {
        console.log('readFirstLinesOfFile', e)
        return reject(e)
      }
    })
  }

  relativeToThis (fullPath) {
    return path.relative(fullPath, this.path)
  }

  thisRelativeTo (fullPath) {
    return path.relative(this.path, fullPath)
  }

  contentRelativeUrl (relPath) {
    relPath = relPath || ''
    var p = path.normalize(relPath).split('/').filter(Boolean)
    var res = this
    p.forEach(s => { res = res.content[String(s)] })
    return res
  }

  deleteRelativeUrl (relPath) {
    relPath = relPath || ''
    var p = path.normalize(relPath).split('/').filter(Boolean)
    var childName = p.pop(p)
    var parent = this
    p.forEach(s => { parent = parent.content[String(s)] })
    var child = parent.content[String(childName)]

    let ex = fs.existsSync(child.path)
    if (ex) {
      if (child.dir) {
        fs.rmdirSync(child.path, { recursive: true })
      } else {
        fs.unlinkSync(child.path)
      }
    }
    delete parent.content[String(childName)]
  }

  mkdir (dirRelPath) {
    dirRelPath = dirRelPath || 'New'
    var dirpath = path.join(
      this.path,
      dirRelPath)
    let ex = fs.existsSync(dirpath)
    // console.log('mkdir: ex', ex)
    if (ex) {
      throw '\"' + dirRelPath + '\" already exists'
      return
    }
    fs.mkdirSync(dirpath, { recursive: true })
    this.refresh(true)
    return true
  }

  renameRelativeUrl (relPath, newName) {
    if (!relPath) { throw 'Not found' }
    if (!newName) { throw 'New name is empty' }

    var p = path.normalize(relPath).split('/').filter(Boolean)
    var childName = p.pop(p)
    var parent = this
    p.forEach(s => { parent = parent.content[String(s)] })
    var child = parent.content[String(childName)]

    let ex = fs.existsSync(child.path)
    if (ex) {
      let newPath = path.join(child.parentDir, newName)
      fs.renameSync(child.path, newPath)
      delete parent.content[String(childName)]
    } else {
      this.exists = false
      throw '\"' + this.name + '\" not found'
    }
    parent.refresh(true)
    return newName
  }

  moveSubDirent (oldPathRelUrls, newPathRelUrl) {
    if (!oldPathRelUrls) {
      throw 'Not found'
    }
    if (!Array.isArray(oldPathRelUrls)) {
      oldPathRelUrls = [oldPathRelUrls]
    }
    try {
      this.mkdir(newPathRelUrl)
    } catch (e) {}

    var newDirent = this.contentRelativeUrl(newPathRelUrl)

    oldPathRelUrls.forEach(old => {
      let oldDirent = this.contentRelativeUrl(old)
      let ex = fs.existsSync(oldDirent.path)
      if (ex) {
        fs.renameSync(
          oldDirent.path,
          path.join(newDirent.path, oldDirent.name))
        this.deleteRelativeUrl(old)
      } else {
        console.log('moveSubDirent:', old, 'not found')
      }
    })
    this.refresh(true)
    return true
  }

  get content () {
    return this._content
  }

  set content (v) {
    this._content = v
  }

  get stats () {
    return this._stats
  }

  set stats (v) {
    this._stats = v
  }

  get parse () {
    return this._parse
  }

  set parse (v) {
    this._parse = v
  }

  get firstLevelArray () {
    return Object.values(this.content)
  }

  get firstLevelArraySend () {
    return this.firstLevelArray.map(x => x.send)
  }

  get structure () {
    var res = {}
    for (let c in this._content) {
      let s = this._content[c].structure
      res[this._content[c].name] = (s && !_isEmpty(s))
        ? s
        : this._content[c]
    }
    return res
  }

  get sendLongShortLines () {
    return {
      dir: this.dir,
      name: this.name,
      mtimeMs: this.mtimeMs,
      size: this.size,
      shortLines: this.shortLines
    }
  }

  get send () {
    return {
      dir: this.dir,
      name: this.name,
      mtimeMs: this.mtimeMs,
      size: this.size,
      shortLines: this.shortLines.slice(0, this.shortLinesSlice)
    }
  }

  set send (v) {
    this.dir = v.dir || this.dir || false
    this.name = v.name || this.name
    this.mtimeMs = v.mtimeMs || this.mtimeMs
    this.size = v.size || this.size || 0
    this.shortLines = v.shortLines || this.shortLines || []
  }
}
