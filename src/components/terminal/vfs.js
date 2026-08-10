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
    if (targetPath === '..') {
      if (this.currentPath === '/') return '/'
      const parts = this.currentPath.split('/').filter(Boolean)
      parts.pop()
      return parts.length === 0 ? '/' : '/' + parts.join('/')
    }
    if (targetPath.startsWith('/')) {
      return targetPath.replace(/\/$/, '') || '/'
    }
    return (this.currentPath === '/' ? '/' : this.currentPath + '/') + targetPath.replace(/\/$/, '')
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
