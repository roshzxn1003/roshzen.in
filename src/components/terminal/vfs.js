// Virtual File System (VFS) with LocalStorage persistence

const INITIAL_VFS = {
  '/': {
    type: 'dir',
    children: ['home'],
  },
  '/home': {
    type: 'dir',
    children: ['arun'],
  },
  '/home/arun': {
    type: 'dir',
    children: ['about.txt', 'skills.json', 'README.md', 'projects', 'docs'],
  },
  '/home/arun/about.txt': {
    type: 'file',
    content: 'I am Arun Roshan, a Computer Science Engineering student focused on React, JavaScript, Python, clean UI, and practical software projects.',
  },
  '/home/arun/skills.json': {
    type: 'file',
    content: JSON.stringify({
      skills: ['React', 'JavaScript', 'Python', 'HTML5', 'CSS3', 'TailwindCSS', 'MongoDB', 'Git', 'Flutter']
    }, null, 2),
  },
  '/home/arun/README.md': {
    type: 'file',
    content: '# RoshZen Terminal Portfolio\n\nWelcome to my interactive developer terminal.\n\nType `help` to list commands or `skills`, `projects`, `status`, `neofetch`.',
  },
  '/home/arun/projects': {
    type: 'dir',
    children: ['zensave.md', 'portfolio.md', 'taskmaster.md'],
  },
  '/home/arun/projects/zensave.md': {
    type: 'file',
    content: '# ZenSave - Finance Tracker\n\nA modern personal expense tracking application built with React, Vite, and TailwindCSS.',
  },
  '/home/arun/projects/portfolio.md': {
    type: 'file',
    content: '# RoshZen Portfolio\n\nInteractive high-tech developer portfolio featuring dynamic animations and built-in CLI terminal.',
  },
  '/home/arun/projects/taskmaster.md': {
    type: 'file',
    content: '# TaskMaster Pro\n\nFullstack productivity dashboard with task scheduling and priority queue management.',
  },
  '/home/arun/docs': {
    type: 'dir',
    children: ['resume.pdf.txt'],
  },
  '/home/arun/docs/resume.pdf.txt': {
    type: 'file',
    content: 'Arun Roshan - Computer Science Engineer & Frontend Developer. Contact: arunroshan1003@gmail.com',
  },
}

class VirtualFileSystem {
  constructor() {
    this.currentPath = '/home/arun'
    this.fs = this.loadFS()
  }

  loadFS() {
    if (typeof window === 'undefined') return INITIAL_VFS
    try {
      const stored = localStorage.getItem('roshzen_vfs')
      return stored ? JSON.parse(stored) : INITIAL_VFS
    } catch {
      return INITIAL_VFS
    }
  }

  saveFS() {
    if (typeof window === 'undefined') return
    try {
      localStorage.setItem('roshzen_vfs', JSON.stringify(this.fs))
    } catch {
      // Ignore
    }
  }

  resolvePath(targetPath) {
    if (!targetPath || targetPath === '.') return this.currentPath
    if (targetPath === '~') return '/home/arun'

    let absolute = targetPath.startsWith('/')
      ? targetPath
      : (this.currentPath === '/' ? '/' : this.currentPath + '/') + targetPath

    const parts = absolute.split('/').filter(Boolean)
    const stack = []
    for (const p of parts) {
      if (p === '.') continue
      if (p === '..') {
        if (stack.length > 0) stack.pop()
      } else {
        stack.push(p)
      }
    }
    return '/' + stack.join('/')
  }

  getPwd() {
    return this.currentPath
  }

  cd(targetPath) {
    if (!targetPath || targetPath === '~') {
      this.currentPath = '/home/arun'
      return { success: true, message: '/home/arun' }
    }
    const resolved = this.resolvePath(targetPath)
    const node = this.fs[resolved]
    if (!node) return { success: false, error: `cd: ${targetPath}: No such file or directory` }
    if (node.type !== 'dir') return { success: false, error: `cd: ${targetPath}: Not a directory` }

    this.currentPath = resolved
    return { success: true, message: resolved }
  }

  ls(targetPath) {
    const resolved = targetPath ? this.resolvePath(targetPath) : this.currentPath
    const node = this.fs[resolved]
    if (!node) return { success: false, error: `ls: ${targetPath}: No such file or directory` }
    if (node.type === 'file') return { success: true, files: [targetPath] }

    const children = (node.children || []).map((name) => {
      const childPath = (resolved === '/' ? '/' : resolved + '/') + name
      const childNode = this.fs[childPath]
      return childNode && childNode.type === 'dir' ? `${name}/` : name
    })

    return { success: true, files: children }
  }

  mkdir(dirName) {
    if (!dirName) return { success: false, error: 'mkdir: missing operand' }
    const resolved = this.resolvePath(dirName)
    if (this.fs[resolved]) return { success: false, error: `mkdir: cannot create directory '${dirName}': File exists` }

    const parentPath = this.resolvePath(dirName + '/..')
    const parentNode = this.fs[parentPath]
    if (!parentNode || parentNode.type !== 'dir') {
      return { success: false, error: `mkdir: cannot create directory '${dirName}': No such file or directory` }
    }

    const baseName = resolved.split('/').pop()
    this.fs[resolved] = { type: 'dir', children: [] }
    if (!parentNode.children.includes(baseName)) {
      parentNode.children.push(baseName)
    }

    this.saveFS()
    return { success: true, message: `Directory created: ${dirName}` }
  }

  touch(fileName) {
    if (!fileName) return { success: false, error: 'touch: missing file operand' }
    const resolved = this.resolvePath(fileName)

    if (this.fs[resolved]) {
      return { success: true, message: `Updated timestamp for ${fileName}` }
    }

    const parentPath = this.resolvePath(fileName + '/..')
    const parentNode = this.fs[parentPath]
    if (!parentNode || parentNode.type !== 'dir') {
      return { success: false, error: `touch: cannot touch '${fileName}': No such file or directory` }
    }

    const baseName = resolved.split('/').pop()
    this.fs[resolved] = { type: 'file', content: '' }
    if (!parentNode.children.includes(baseName)) {
      parentNode.children.push(baseName)
    }

    this.saveFS()
    return { success: true, message: `Created file: ${fileName}` }
  }

  cat(fileName) {
    if (!fileName) return { success: false, error: 'cat: missing file operand' }
    const resolved = this.resolvePath(fileName)
    const node = this.fs[resolved]
    if (!node) return { success: false, error: `cat: ${fileName}: No such file or directory` }
    if (node.type === 'dir') return { success: false, error: `cat: ${fileName}: Is a directory` }

    return { success: true, content: node.content }
  }

  rm(targetName) {
    if (!targetName) return { success: false, error: 'rm: missing operand' }
    const resolved = this.resolvePath(targetName)
    const node = this.fs[resolved]
    if (!node) return { success: false, error: `rm: cannot remove '${targetName}': No such file or directory` }

    const parentPath = this.resolvePath(targetName + '/..')
    const parentNode = this.fs[parentPath]
    const baseName = resolved.split('/').pop()

    if (parentNode && parentNode.children) {
      parentNode.children = parentNode.children.filter((c) => c !== baseName)
    }

    delete this.fs[resolved]
    this.saveFS()
    return { success: true, message: `Removed: ${targetName}` }
  }

  cp(srcPath, dstPath) {
    if (!srcPath || !dstPath) return { success: false, error: 'cp: missing file operand' }
    const resolvedSrc = this.resolvePath(srcPath)
    const srcNode = this.fs[resolvedSrc]
    if (!srcNode) return { success: false, error: `cp: cannot stat '${srcPath}': No such file or directory` }

    let resolvedDst = this.resolvePath(dstPath)
    const dstNode = this.fs[resolvedDst]
    if (dstNode && dstNode.type === 'dir') {
      const srcBase = resolvedSrc.split('/').pop()
      resolvedDst = (resolvedDst === '/' ? '/' : resolvedDst + '/') + srcBase
    }

    if (srcNode.type === 'dir') {
      const copyDir = (fromPath, toPath) => {
        const sourceDirNode = this.fs[fromPath]
        this.fs[toPath] = { type: 'dir', children: [...(sourceDirNode.children || [])] }
        ;(sourceDirNode.children || []).forEach((child) => {
          const cFrom = (fromPath === '/' ? '/' : fromPath + '/') + child
          const cTo = (toPath === '/' ? '/' : toPath + '/') + child
          if (this.fs[cFrom]?.type === 'dir') {
            copyDir(cFrom, cTo)
          } else if (this.fs[cFrom]) {
            this.fs[cTo] = { ...this.fs[cFrom] }
          }
        })
      }
      copyDir(resolvedSrc, resolvedDst)
    } else {
      this.fs[resolvedDst] = { ...srcNode }
    }

    const parentPath = this.resolvePath(resolvedDst + '/..')
    const parentNode = this.fs[parentPath]
    const dstBase = resolvedDst.split('/').pop()
    if (parentNode && parentNode.children && !parentNode.children.includes(dstBase)) {
      parentNode.children.push(dstBase)
    }

    this.saveFS()
    return { success: true, message: `Copied '${srcPath}' to '${dstPath}'` }
  }

  mv(srcPath, dstPath) {
    if (!srcPath || !dstPath) return { success: false, error: 'mv: missing file operand' }
    const copyRes = this.cp(srcPath, dstPath)
    if (!copyRes.success) return copyRes
    this.rm(srcPath)
    return { success: true, message: `'${srcPath}' -> '${dstPath}'` }
  }

  rmdir(dirName) {
    if (!dirName) return { success: false, error: 'rmdir: missing operand' }
    const resolved = this.resolvePath(dirName)
    const node = this.fs[resolved]
    if (!node) return { success: false, error: `rmdir: failed to remove '${dirName}': No such file or directory` }
    if (node.type !== 'dir') return { success: false, error: `rmdir: failed to remove '${dirName}': Not a directory` }
    if (node.children && node.children.length > 0) return { success: false, error: `rmdir: failed to remove '${dirName}': Directory not empty` }

    return this.rm(dirName)
  }

  chmod(mode, targetPath) {
    if (!mode || !targetPath) return { success: false, error: 'chmod: missing operand' }
    const resolved = this.resolvePath(targetPath)
    const node = this.fs[resolved]
    if (!node) return { success: false, error: `chmod: cannot access '${targetPath}': No such file or directory` }
    node.mode = mode
    this.saveFS()
    return { success: true, message: `mode of '${targetPath}' changed to ${mode}` }
  }

  chown(owner, targetPath) {
    if (!owner || !targetPath) return { success: false, error: 'chown: missing operand' }
    const resolved = this.resolvePath(targetPath)
    const node = this.fs[resolved]
    if (!node) return { success: false, error: `chown: cannot access '${targetPath}': No such file or directory` }
    node.owner = owner
    this.saveFS()
    return { success: true, message: `changed ownership of '${targetPath}' to ${owner}` }
  }

  writeFile(fileName, content) {
    if (!fileName) return { success: false, error: 'writeFile: missing file operand' }
    const resolved = this.resolvePath(fileName)
    const parentPath = this.resolvePath(fileName + '/..')
    const parentNode = this.fs[parentPath]
    if (!parentNode || parentNode.type !== 'dir') {
      return { success: false, error: `writeFile: cannot create '${fileName}': No such file or directory` }
    }

    const baseName = resolved.split('/').pop()
    this.fs[resolved] = { type: 'file', content }
    if (!parentNode.children.includes(baseName)) {
      parentNode.children.push(baseName)
    }

    this.saveFS()
    return { success: true, message: `Wrote to '${fileName}'` }
  }

  grep(pattern, targetPath, options = {}) {
    if (!pattern) return { success: false, error: 'grep: missing pattern' }
    const caseInsensitive = options.i || false
    const searchPath = targetPath ? this.resolvePath(targetPath) : this.currentPath
    const node = this.fs[searchPath]
    if (!node) return { success: false, error: `grep: ${targetPath}: No such file or directory` }

    const results = []
    const flags = caseInsensitive ? 'gi' : 'g'
    let regex
    try {
      regex = new RegExp(pattern, flags)
    } catch {
      regex = new RegExp(pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), flags)
    }

    const searchFile = (filePath, displayPath) => {
      const fileNode = this.fs[filePath]
      if (fileNode && fileNode.type === 'file' && typeof fileNode.content === 'string') {
        const lines = fileNode.content.split('\n')
        lines.forEach((line, idx) => {
          regex.lastIndex = 0
          if (regex.test(line)) {
            results.push(`${displayPath}:${idx + 1}:${line}`)
          }
        })
      }
    }

    if (node.type === 'file') {
      searchFile(searchPath, targetPath || searchPath.split('/').pop())
    } else {
      const walk = (dirPath, prefixPath) => {
        const dirNode = this.fs[dirPath]
        if (!dirNode || !dirNode.children) return
        dirNode.children.forEach((child) => {
          const childFullPath = (dirPath === '/' ? '/' : dirPath + '/') + child
          const childDisplay = (prefixPath ? prefixPath + '/' : '') + child
          const childNode = this.fs[childFullPath]
          if (childNode?.type === 'dir') {
            walk(childFullPath, childDisplay)
          } else if (childNode?.type === 'file') {
            searchFile(childFullPath, childDisplay)
          }
        })
      }
      walk(searchPath, searchPath.split('/').pop())
    }

    return { success: true, results }
  }

  find(startPath = this.currentPath, namePattern = '*') {
    const resolvedStart = this.resolvePath(startPath)
    const startNode = this.fs[resolvedStart]
    if (!startNode) return { success: false, error: `find: '${startPath}': No such file or directory` }

    const results = [resolvedStart]
    const globToRegex = (pat) => new RegExp('^' + pat.replace(/\./g, '\\.').replace(/\*/g, '.*').replace(/\?/g, '.') + '$', 'i')
    const regex = namePattern === '*' ? null : globToRegex(namePattern)

    const walk = (dirPath) => {
      const node = this.fs[dirPath]
      if (!node || !node.children) return
      node.children.forEach((child) => {
        const childPath = (dirPath === '/' ? '/' : dirPath + '/') + child
        if (!regex || regex.test(child)) {
          results.push(childPath)
        }
        if (this.fs[childPath]?.type === 'dir') {
          walk(childPath)
        }
      })
    }

    if (startNode.type === 'dir') {
      walk(resolvedStart)
    }

    return { success: true, results }
  }

  tree(startPath = this.currentPath, depth = 0, prefix = '') {
    const node = this.fs[startPath]
    if (!node || node.type !== 'dir') return []

    let lines = []
    if (depth === 0) {
      lines.push(startPath)
    }

    const children = node.children || []
    children.forEach((childName, index) => {
      const isLast = index === children.length - 1
      const connector = isLast ? '└── ' : '├── '
      const childPath = (startPath === '/' ? '/' : startPath + '/') + childName
      const childNode = this.fs[childPath]

      if (childNode && childNode.type === 'dir') {
        lines.push(`${prefix}${connector}${childName}/`)
        const newPrefix = prefix + (isLast ? '    ' : '│   ')
        lines = lines.concat(this.tree(childPath, depth + 1, newPrefix))
      } else {
        lines.push(`${prefix}${connector}${childName}`)
      }
    })

    return lines
  }
}

export const vfs = new VirtualFileSystem()
