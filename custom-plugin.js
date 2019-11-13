/*
 * @Author: HuMwing
 * @since: 2019-11-06 16:56:43
 * @lastTime: 2019-11-13 14:38:34
 * @LastAuthor: HuMwing
 * @message:
 */
const path = require("path");
const { uploadCDN, getTimePrefix } = require("./upload2cdn.js");
class Upload2cdnPlugin {
  constructor(options={}) {
    this.options = options;
  }
  apply(compiler) {
    let cndUrl = this.options.cdnUrl;
    compiler.hooks.done.tapPromise("upload2cdn", (stats)=> {
      let files = [];
      for (var f in stats.compilation.assets) {
        files.push(f);
      }
      console.info("assets files dirname: ");
      console.info(stats.compilation.outputOptions.path);
      return uploadCDN(
        cndUrl,
        files,
        path.resolve(stats.compilation.outputOptions.path)
      );
    });
  }
}


module.exports = {
  Upload2cdnPlugin,
  getTimePrefix,
  uploadCDN
};
