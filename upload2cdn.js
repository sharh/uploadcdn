/*
 * @Author: HuMwing
 * @since: 2019-09-16 15:53:57
 * @lastTime: 2019-11-13 11:49:47
 * @LastAuthor: HuMwing
 * @message:
 */
const request = require("request-promise");
const fs = require("fs");
const path = require("path");
let uploadURL = "";

let count = 0;
let prefix = createTimePrefix();

function createTimePrefix() {
  const now = new Date();
  const timePrefix =
    now.getFullYear() +
    "/" +
    (now.getMonth() + 1) +
    "/" +
    now.getDate() +
    "/" +
    now.getHours() +
    "/" +
    now.getMinutes() +
    "/" +
    now.getSeconds() +
    "/" +
    now.getMilliseconds() +
    "/";
  return timePrefix;
}

function uploadFile(data) {
  return request
    .post(uploadURL, {
      formData: data,
      json: true
    })
    .then(({ data: { successList } }) => {
      return successList;
    });
}

function uploadCDN(cdnURL, fileList, outDir) {
  uploadURL = cdnURL;
  let prefix = getTimePrefix();
  // formData使用批量格式的时候会报错，这里一个个文件上传
  let files = fileList.map(item => {
    let filepath = path.resolve(outDir, item);
    // 取posix，不然windows系统返回的反斜杠，会导致路径不正确
    let basename = path.posix.basename(item);
    let dirname = path.posix.dirname(item);
    // 前缀拼接
    let filePrefix =
      prefix + path.posix.join(dirname, "/").replace(/\.(\/*)?/gim, "");
    let formData = {
      files: [
        {
          value: fs.createReadStream(filepath),
          options: {
            filename: basename
          }
        }
      ],
      prefix: filePrefix
    };
    return formData;
  });
  console.info("upload cdn begin...");
  return Promise.all(
    files.map(item => {
      return uploadFile(item);
    })
  )
    .then(res => {
      const cndLinks = [];
      for (let cdnUrl of res) {
        let [{ url }] = cdnUrl;
        cndLinks.push(url);
      }
      console.info("upload cdn complete: ");
      console.info(cndLinks);
      return res;
    })
    .catch(e => {
      throw e;
    });
}

function getTimePrefix() {
  if (count % 2 === 0) {
    prefix = createTimePrefix();
  }
  count++;
  return prefix;
}
module.exports = {
  uploadCDN,
  getTimePrefix
};
