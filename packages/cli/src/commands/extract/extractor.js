const { t } = require("../../i18n");
const glob = require("fast-glob");
const { extractMessages, extractParagraphs } = require("@voerkai18n/utils/extract");
const logsets = require("logsets");
const path = require("path"); 
const { readFile } = require("flex-tools/fs/nodefs");
const { getProjectContext } = require("@voerkai18n/utils");
const { updateMessages, formatMessages, getMessageIds } = require("./messages");
const { updateParagraphs } = require("./paragraphs")

/**
 *
 * @param {*} settings
 * @returns
 */
/**
 * 异步函数 `extractTexts` 用于从指定文件中提取需要翻译的文本。
 *
 * @param {Object} ctx - 设置对象，包含提取文本的相关配置。
 * @param {string} ctx.langDir - 语言目录的路径。
 * @param {string} ctx.langRelDir - 相对于项目根目录的语言目录路径。
 * @param {Array<string>} [ctx.patterns] - 可选的文件匹配模式数组，用于扩展默认的匹配规则。
 * @returns {Promise<{ text,rang,args,options,file }>} 返回一个包含提取出的翻译文本的数组。
 *
 * 该函数首先定义了一组默认的文件匹配模式，然后合并了用户自定义的模式。
 * 使用 fastGlob 函数查找匹配的文件，并逐个读取文件内容。
 * 对每个文件的内容调用 extractMessages 函数来提取翻译文本。
 * 提取过程中会记录任务进度和结果。
 * 最终返回所有提取出的翻译文本的数组。
 */
async function scanSourceFiles(ctx) {
  const { langRelDir, patterns, tasks } = ctx;

  tasks.addGroup(t("提取参数："));
  tasks.create(t("更新模式: {}"), ctx.mode);
  tasks.create(t("提取方式: {}"), ctx.regex ? "regex" : "ast");
  tasks.create(t("提取范围: {}"), patterns.join(", "));
  tasks.create(t("通过{}参数增加文件匹配规则"), "--patterns");
  tasks.create(
    t("您可以通过修改{}文件的{}参数来调整提取范围"),
    `${langRelDir}/settings.json`,
    "patterns"
  );

  const files =  await glob(patterns, {
    cwd: process.cwd(),
    absolute: true,
  });

  const messages = [];
  const paragraphs = [];

  let msgCount = 0, paragraphCount = 0;

  tasks.addGroup(t("开始提取："));

  for (let file of files) {
    try {
      const relFile = path.relative(process.cwd(), file);
      const codeLang = path.extname(file).slice(1);
      tasks.add(t("提取 {}"), relFile);
      
      const code = await readFile(file, { encoding: "utf-8" });


      // 提取文本
      const msgs = await extractMessages(code, {
        namespaces: ctx.namespaces,
        file      : file,
        language  : codeLang || "ts",
        extractor : ctx.ast ? "ast" : "regex",
      });
      if (msgs && msgs.length > 0)  messages.push(...msgs);

      // 提取段落

      const pghs = await extractParagraphs(code, {
        file      : file 
      }) 
      if (pghs && pghs.length > 0)  paragraphs.push(...pghs);

      if (msgs.length === 0 && pghs.length === 0) {
        tasks.skip();
      } else {
        tasks.complete([ t("发现{}文本, {}段落"), msgs.length, pghs.length ]);
      }

      msgCount += msgs.length;
      paragraphCount += pghs.length;
    } catch (e) {
      tasks.error(e);
    }
  }
  tasks.addGroup(t("提取结果:"));
  tasks.addMemo(t("名称空间：{}"),[
        "default", 
        ...Object.keys(ctx.namespaces || [])].join(",")
  );
  tasks.addMemo(t("共提取{}个文本"), msgCount);
  tasks.addMemo(t("共提取{}个段落"), paragraphCount);
  return [ messages, paragraphs ]
}



async function extractor(options) {
  const ctx = await getProjectContext(options);

  const tasks = logsets.tasklist({ width: 88, grouped: true });
  ctx.tasks = tasks;
  await getMessageIds(ctx);

  // 1. 提取文本
  const [ messages, paragraphs ] = await scanSourceFiles(ctx);
  // 2. 将提取到的文本进行预处理：按名称空间分组
  const formattedMessages = formatMessages(messages, ctx);
  // 3. 保存文本
  await updateMessages(formattedMessages, ctx);

  // 4. 保存段落
  await updateParagraphs(paragraphs, ctx);

  tasks.addGroup(t("下一步："));
  tasks.addMemo(t("翻译{}文件"), "translates/messages/*.json");
  tasks.addMemo(t("翻译段落{}文件"), "translates/paragraphs/*.json");
  tasks.addMemo(t("运行<{}>编译语言包"), "voerkai18n compile");
  tasks.addMemo(t("在源码中从<{}>导入编译后的语言包"), ctx.langRelDir);
  tasks.done();
}

module.exports = extractor;
