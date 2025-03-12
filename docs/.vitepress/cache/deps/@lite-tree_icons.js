// node_modules/.pnpm/@lite-tree+icons@1.0.6/node_modules/@lite-tree/icons/index.js
var SupportedIcons = [
  "ts",
  "tsx",
  "js",
  "jsx",
  "json",
  "vue",
  "md",
  "gif",
  "jpg",
  "jpeg",
  "png",
  "bmp",
  "webp",
  "ico",
  "tiff",
  "img",
  "txt",
  "svg",
  "java",
  "go",
  "less",
  "sass",
  "scss",
  "css",
  "htm",
  "yml",
  "com",
  "yaml",
  "py",
  "pyc",
  "dat",
  "db",
  "astro",
  "html",
  "yaml",
  "pdf",
  "doc",
  "docx",
  "mp4",
  "avi",
  "mov",
  "wmv",
  "mpeg",
  "mpg",
  "rm",
  "ram",
  "swf",
  "flv",
  "video",
  "xls",
  "xlsx",
  "ppt",
  "pptx",
  "exe",
  "xml",
  "svelte",
  "cpp",
  "zip",
  "tar",
  "c",
  "gz",
  "bz2",
  "rar",
  "mp3",
  "ogg",
  "flac",
  "wav",
  "csv",
  "php",
  "vb",
  "cs",
  "kt",
  "h",
  "hpp",
  "hxx",
  "bat"
];
function getFileTypeIcon(node) {
  const icon = String(node.icon).trim();
  if (icon.length > 0) return node.icon;
  if (node.children && node.children.length > 0) {
    const isOpen = node.open == void 0 ? true : node.open;
    return isOpen ? "folder-open" : "folder";
  }
  const title = node.title.trim();
  if (title.endsWith("/")) {
    node.icon = "folder";
    node.title = title.slice(0, -1);
    return "folder";
  }
  if (title.indexOf(".") < 0) return "file";
  const index = SupportedIcons.findIndex((ext) => ext == title.endsWith(`.${ext}`));
  if (index >= 0) {
    return SupportedIcons[index];
  }
  return "file";
}
export {
  SupportedIcons,
  getFileTypeIcon
};
//# sourceMappingURL=@lite-tree_icons.js.map
