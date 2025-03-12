import {
  Fragment,
  computed,
  createBaseVNode,
  createBlock,
  createCommentVNode,
  createElementBlock,
  createVNode,
  defineComponent,
  h,
  inject,
  normalizeClass,
  normalizeStyle,
  openBlock,
  provide,
  reactive,
  ref,
  renderList,
  resolveComponent,
  unref,
  useSlots,
  withCtx
} from "./chunk-IA4MHOT7.js";

// node_modules/.pnpm/@lite-tree+vue@1.1.4_vue@3.5.13_typescript@5.8.2_/node_modules/@lite-tree/vue/dist/index.mjs
var N = Symbol("LiteTreeContext");
var E = {
  "+": "diff-add",
  "-": "diff-delete",
  "*": "diff-modify",
  "!": ["important", "[important]"],
  x: ["error", "[no]"],
  v: ["correct", "[yes]"]
};
var U = "data-lite-tree";
var $ = new RegExp("(?<!(\\s*\\,\\s*)|([\\[\\{\\}]\\s*))\\n(?!\\s*\\}\\s*)", "gm");
var J = new RegExp(`((?<!\\\\)\\"|\\')(.*?)((?<!\\\\)\\1)`, "gm");
var F = new RegExp('([\\s\\[\\,\\{\\b]{1})(?<!\\"])(\\w+)(?!\\")(\\s*\\:)', "gm");
function X(t, r) {
  try {
    return JSON.parse(t, (s, i) => r ? r(s, i) : i);
  } catch {
  }
  let e = t.replaceAll($, `,
`);
  return e = e.replaceAll(J, (s, i, n, l) => `"${encodeURI(n)}"`), e = e.replaceAll(F, (s, i, n, l) => `${i}"${n}"${l}`), e = e.replaceAll("，", ",").replaceAll("“", '"').replaceAll("”", '"'), JSON.parse(e, (s, i) => (typeof i == "string" && (i = decodeURI(i)), r ? r(s, i) : i));
}
function q(t, r) {
  let e = X(t.trim(), (s, i) => (typeof i == "object" && !Array.isArray(i) && (i.open = i.open == null ? true : i.open, i.diff && (i.flag = i.diff == "add" ? "+" : i.diff == "delete" ? "-" : i.diff == "modify" ? "*" : i.diff, delete i.diff), i.flag || (i.flag = ""), i.classs || (i.classs = []), i.tags || (i.tags = []), i.style || (i.style = ""), i.icon || (i.icon = ""), i.comment || (i.comment = ""), typeof r == "function" && Object.assign(i, r(s, i))), i));
  return e = Array.isArray(e) ? e : [e], e;
}
function H(t, r) {
  let e = t;
  if (!e || e.trim().length == 0)
    return { style: "", classs: [] };
  const s = [], i = new RegExp("(?<!:)(([#\\.]{1}\\w+))\\s*;(?!:)", "g");
  return e.startsWith("{") && (e = e.substring(1)), e.endsWith("}") && (e = e.substring(0, e.length - 1)), e.trim().endsWith(";") || (e = e.trim() + ";"), e = e.replace(i, (n, l) => {
    if (l in r) {
      let a = r[l];
      return a.endsWith(";") || (a = a + ";"), a;
    } else {
      if (l.startsWith("#"))
        return "";
      if (n.startsWith("."))
        return s.push(l.substring(1)), "";
    }
    return n;
  }), { style: e, classs: s };
}
function P(t, r) {
  if (typeof t != "string")
    return { style: "", value: t || "" };
  const e = /^\{(.*?)\}/g;
  let s = "", i = [], n = t.replace(e, (a, o) => {
    const d = H(o, r);
    return s = d.style, i.push(...d.classs), "";
  });
  const l = /\[([\w\.\-\_]+)\]/g;
  return n = n.replace(l, (a, o) => `<span data-lite-tree class="icon ${o}"></span>`), { value: n, style: s, classs: i };
}
function K(t, r = 4) {
  const e = t.reduce((s, i, n) => {
    var a;
    i = i.replace(/\t/g, " ".repeat(r)), t[n] = i;
    const l = ((a = i.match(/^\s+/)) == null ? void 0 : a[0].length) || 0;
    return s == -1 || l < s ? l : s;
  }, -1);
  t.forEach((s, i) => {
    t[i] = s.substring(e);
  });
}
var z = /(\+|\-)?\s*(\[([^\[\]]+?)\])?\s*(\/?[^\(\/\\]+\/?)(\((.*?)\))?\s*(\/\/(\S+)?\s*(.*?))?$/gm;
var T = /([^,]+)\,?/g;
function ee(t, r, e) {
  const s = Object.assign({ indent: 4 }, e.ltfOptions), i = t.split(`
`);
  function n(I) {
    if (!I)
      return [];
    let m, g = [];
    for (; (m = T.exec(I)) !== null; ) {
      m.index === T.lastIndex && T.lastIndex++;
      let c = m[1];
      (c.startsWith("'") || c.startsWith('"')) && (c = c.substring(1)), (c.endsWith("'") || c.endsWith('"')) && (c = c.substring(0, c.length - 1)), g.push(c);
    }
    return g;
  }
  function l(I) {
    let m = { id: void 0, open: false, title: "", tags: [], comment: "", style: "", icon: "", level: 0, flag: "", classs: [] };
    z.lastIndex = 0;
    const g = z.exec(I.trim());
    if (g) {
      m.open = g[1] != "+", m.icon = g[3] || "", m.title = g[4] || "", m.tags = n(g[6]), m.comment = g[9] || "";
      const c = /([\[\]\w\!\+\*\&\-\=\$\%\@\~\.]+)?(\{[\s\S]*?\})?/g.exec(g[8] || "");
      if (c) {
        const h2 = (c[1] || "").split(".");
        m.flag = h2[0];
        const C = H(c[2] || "", r.styles);
        m.style = C.style, m.classs = [...C.classs, ...h2.slice(1)];
      }
    }
    return m;
  }
  const a = (i[0].match(/^\s+/) || [""])[0];
  let o, d, u = { level: 0, children: [] };
  const M = [u];
  K(i, s.indent);
  for (let I of i) {
    const m = I.trim();
    if (m == "" || m.startsWith("//"))
      continue;
    I = I.substring(a.length);
    const g = l(I);
    if (g.level = Math.ceil((I.match(/^\s+/) || [""])[0].length / s.indent) + 1, !o)
      d = u;
    else if (g.level != o.level) {
      if (g.level > o.level)
        M.push(o), d = o;
      else if (g.level < o.level)
        for (let c = M.length - 1; c >= 0; c--)
          if (M[c].level >= g.level)
            M.pop();
          else {
            d = M[c];
            break;
          }
    }
    d && !d.children && (d.children = []), d == null || d.children.push(g), o = g, typeof e.forEach == "function" && e.forEach(g);
  }
  return u.children;
}
function te(t, r) {
  typeof r != "object" || typeof t != "object" || Object.entries(r).forEach(([e, s]) => {
    (!(e in t) || t[e] == null) && (t[e] = s);
  });
}
function ie(t) {
  return t.startsWith("[") && t.endsWith("]") || t.startsWith("{") && t.endsWith("}") ? "json" : "lite";
}
var ne = /^\s*[-]{3,}\s*$/gm;
function re(t) {
  const r = t.split(ne), [e, s] = r.length == 1 ? ["", r[0]] : r;
  return [
    e.trim(),
    s.trim()
  ];
}
function se(t) {
  const r = {}, e = {}, s = {}, i = /^\s*([\w\#\.]+)\s*\=\s*((\{([\w\n\S\s]*?)\})|(\<svg[\w\n\S\s]*?<\/svg\>)|(.*$))/gm;
  let n;
  for (; (n = i.exec(t)) !== null; ) {
    n.index === i.lastIndex && i.lastIndex++;
    const l = n[1].trim();
    let a = n[4] || n[5] || n[6];
    a.startsWith("<svg") || a.startsWith("data:image/svg+xml;") ? s[l] = a : (a = a.trim(), a.startsWith("{") && (a = a.substring(1)), a.endsWith("}") && (a = a.substring(0, a.length - 1)), l.startsWith(".") ? e[l] = a.replaceAll(`
`, ";") : l.startsWith("#") && (r[l] = a.replaceAll(`
`, ";")));
  }
  return { styles: r, classs: e, icons: s };
}
function le(t, r, e) {
  let s = [];
  try {
    e.format == "json" ? s = q(t, (i, n) => {
      if (typeof n == "object" && !Array.isArray(n) && typeof e.forEach == "function")
        return e.forEach(n);
    }) : s = ee(t, r, e);
  } catch (i) {
    console.error(i), s = [{ id: "", title: `解析错误:${i.message}`, icon: "error", open: true, level: 0, flag: "", classs: [""], comment: i.message, style: "", tags: [] }];
  }
  return s;
}
function ae(t) {
  return t.replace(/^\s*<!--/, "").replace(/-->\s*$/, "");
}
var oe = 0;
function ce(t, r) {
  const e = Object.assign({}, r), [s, i] = re(ae(t));
  e.format || (e.format = ie(i));
  const n = se(s);
  let l = false;
  try {
    const a = le(i, n, {
      ...e,
      forEach: (o) => {
        const d = o.flag;
        if (d && d.length > 0 && (l = true, d in E)) {
          const u = E[d];
          typeof u == "string" ? o.classs.push(u) : Array.isArray(u) && (o.classs.push(u[0]), o.flag = u[1]);
        }
        te(o, {
          id: String(++oe),
          title: "Node",
          icon: "",
          open: true,
          level: 0,
          flag: "",
          comment: "",
          style: "",
          classs: [],
          tags: []
        }), typeof e.forEach == "function" && e.forEach(o);
      }
    });
    return {
      ...n,
      hasFlag: l,
      nodes: a
    };
  } catch (a) {
    console.error(a), nodes = [{
      title: "Invalid data provided to LiteTree",
      style: "color:red",
      // @ts-ignore
      children: [{ title: a.message, style: "color:red" }]
    }];
  }
}
function de(t) {
  const r = /\[([^\[\]]*?)(\:(\w+))?\]\((([^\(\\\s)]+)(\s+[\w\u4e00-\u9fa5\w]+)?)\)/g;
  return t.replace(r, (s, i, n, l, a, o, d) => `<a style='display:inline-flex;align-items:center;' ${d ? "title=" + d : ""} class='action' target='_blank' href='${o}'>${l ? `<span class='icon ${l}'></span>` : ""}${i}</a>`);
}
var ge = ["innerHTML"];
var x = defineComponent({
  __name: "RichLabel",
  props: {
    value: {
      type: String,
      default: ""
    }
  },
  setup(t) {
    const r = t, e = inject(N), s = P(r.value, e.styles);
    return (i, n) => (openBlock(), createElementBlock("span", {
      class: normalizeClass(["richlabel", unref(s).classs]),
      "data-lite-tree": "",
      style: normalizeStyle(unref(s).style),
      innerHTML: unref(de)(unref(s).value)
    }, null, 14, ge));
  }
});
var me = {};
var ue = defineComponent({
  ...me,
  __name: "RichIcon",
  props: {
    value: {
      type: String,
      default: ""
    }
  },
  setup(t) {
    const r = inject(N), e = t, s = computed(() => P(e.value, r.styles));
    return (i, n) => (openBlock(), createElementBlock("span", {
      "data-lite-tree": "",
      class: normalizeClass(["icon", s.value.value]),
      style: normalizeStyle(s.value.style)
    }, null, 6));
  }
});
var Ie = {
  name: "SlideUpDown",
  props: {
    active: Boolean,
    duration: {
      type: Number,
      default: 500
    },
    tag: {
      type: String,
      default: "div"
    },
    useHidden: {
      type: Boolean,
      default: true
    }
  },
  data: () => ({
    style: {},
    initial: false,
    hidden: false
  }),
  watch: {
    active() {
      this.layout();
    }
  },
  render() {
    return h(
      this.tag,
      {
        ...this.attrs,
        style: this.style,
        ref: "container",
        onTransitionend: this.onTransitionEnd
      },
      this.$slots.default()
    );
  },
  mounted() {
    this.layout(), this.initial = true;
  },
  created() {
    this.hidden = !this.active;
  },
  computed: {
    el() {
      return this.$refs.container;
    },
    attrs() {
      const t = {
        "aria-hidden": !this.active,
        "aria-expanded": this.active
      };
      return this.useHidden && (t.hidden = this.hidden), t;
    }
  },
  methods: {
    layout() {
      this.active ? (this.hidden = false, this.$emit("open-start"), this.initial && this.setHeight("0px", () => this.el.scrollHeight + "px")) : (this.$emit("close-start"), this.setHeight(this.el.scrollHeight + "px", () => "0px"));
    },
    asap(t) {
      this.initial ? this.$nextTick(t) : t();
    },
    setHeight(t, r) {
      this.style = { height: t }, this.asap(() => {
        this.__ = this.el.scrollHeight, this.style = {
          height: r(),
          overflow: "hidden",
          "transition-property": "height",
          "transition-duration": this.duration + "ms"
        };
      });
    },
    onTransitionEnd(t) {
      t.target === this.el && (this.active ? (this.style = {}, this.$emit("open-end")) : (this.style = {
        height: "0",
        overflow: "hidden"
      }, this.hidden = true, this.$emit("close-end")));
    }
  }
};
var pe = {
  "data-lite-tree": "",
  class: normalizeClass(["lite-tree-nodes"])
};
var fe = ["data-node-id", "onClick"];
var Me = {
  key: 0,
  "data-lite-tree": "",
  class: "flag"
};
var he = {
  "data-lite-tree": "",
  class: "title"
};
var ye = {};
var De = defineComponent({
  ...ye,
  __name: "LiteTreeNodes",
  props: {
    indent: { default: 0 },
    nodes: { default: () => [] }
  },
  setup(t) {
    const r = inject(N), e = (n, l) => {
      s(n) && (n.open = n.open == null ? false : !n.open, n.open ? r.emit("expand", n, l) : r.emit("collapse", n, l));
    }, s = (n) => Array.isArray(n.children) && n.children.length > 0, i = (n) => n.open == null ? true : n.open;
    return (n, l) => {
      const a = resolveComponent("LiteTreeNodes", true);
      return openBlock(), createElementBlock("ul", pe, [
        (openBlock(true), createElementBlock(Fragment, null, renderList(n.nodes, (o, d) => (openBlock(), createElementBlock("li", {
          "data-lite-tree": "",
          key: d
        }, [
          createBaseVNode("span", {
            "data-lite-tree": "",
            class: normalizeClass(["lite-tree-node", o.classs]),
            "data-node-id": o.id,
            onClick: (u) => e(o, u),
            style: normalizeStyle(o.style)
          }, [
            unref(r).hasFlag ? (openBlock(), createElementBlock("span", Me, [
              createVNode(x, {
                value: o.flag
              }, null, 8, ["value"])
            ])) : createCommentVNode("", true),
            createBaseVNode("span", {
              "data-lite-tree": "",
              class: "indent",
              style: normalizeStyle({ width: n.indent + "em" })
            }, null, 4),
            s(o) ? (openBlock(), createElementBlock("span", {
              key: 1,
              "data-lite-tree": "",
              class: normalizeClass([
                "opener",
                "icon",
                "arrow",
                { open: i(o) }
              ])
            }, null, 2)) : createCommentVNode("", true),
            createVNode(ue, {
              value: unref(r).getIcon(o)
            }, null, 8, ["value"]),
            createBaseVNode("span", he, [
              createVNode(x, {
                value: o.title
              }, null, 8, ["value"]),
              (openBlock(true), createElementBlock(Fragment, null, renderList(o.tags, (u) => (openBlock(), createBlock(x, {
                class: "tag",
                key: u,
                value: u
              }, null, 8, ["value"]))), 128))
            ]),
            createVNode(x, {
              class: "comment",
              value: o.comment
            }, null, 8, ["value"])
          ], 14, fe),
          createVNode(unref(Ie), {
            active: i(o),
            duration: 200
          }, {
            default: withCtx(() => [
              s(o) && i(o) ? (openBlock(), createBlock(a, {
                key: 0,
                indent: n.indent + 1.4,
                class: normalizeClass(i(o) ? "open" : "close"),
                nodes: o.children
              }, null, 8, ["indent", "class", "nodes"])) : createCommentVNode("", true)
            ]),
            _: 2
          }, 1032, ["active"])
        ]))), 128))
      ]);
    };
  }
});
function be(t = 10) {
  return Math.random().toString(36).substring(2, t + 2);
}
function xe(t, r) {
  const e = new RegExp("(?<=\\}|^)([^\\{\\}]+)(?=\\{)", "gm");
  return t.replace(e, (s, i) => i.split(",").map((n) => {
    if (n = n.trim(), n.startsWith("@"))
      return n;
    const l = n.indexOf(":");
    return l == -1 ? `
` + n + `[${r}]` : `
` + n.slice(0, l) + `[${r}]` + n.slice(l);
  }).join(","));
}
function A(t, r) {
  if (globalThis.document == null)
    return;
  const { id: e, mode: s, scoped: i = true, location: n = "head" } = Object.assign({ mode: "default" }, r);
  let l = document.head.querySelector(`#${e}`), a;
  return l ? (s == "replace" ? l.innerHTML = t : s == "append" && (l.innerHTML += t), a) : (i && (a = i == true ? be() : i, t = xe(t, a)), l = document.createElement("style"), l.innerHTML = t, l.id = e, r != null && r.el ? r.el.appendChild(l) : n == "head" ? document.head.appendChild(l) : document.body.appendChild(l), l);
}
function Ae(t) {
  return t.replace(/(.*?)(\s*;)/g, (r, e, s) => e.trim().endsWith("!important") ? r : e.trim() + "!important;");
}
function we(t) {
  if (globalThis.document == null)
    return;
  let r = (t || document).querySelector("#lite_tree_icons");
  return r || (r = document.createElement("style"), r.id = "lite_tree_icons", r.innerHTML = `.lite-tree .icon{
            display:inline-block;
            width:1em;
            height:1em;
            margin:0.2em;
        }`, t ? t.appendChild(r) : document.head.appendChild(r)), r;
}
var ve = /(\<\?xml(.*)?\?\>)|(\<\!DOCTYPE.*?\>)|(width\=\"\d+\"\s?)|(height\=\"\d+\"\s?)|(\bxmlns(\:\w+)?\=\".*?\"\s?)|(p\-id\=\"\d+\"\s?)|(t\=\"\d+\"\s?)|(version\=\".*?\"\s?)|(class\=\"\w+\"\s?)/gm;
function Ne(t) {
  return t.replace(ve, "");
}
function je(t, r) {
  if (globalThis.document == null)
    return;
  const e = we(r);
  for (let [s, i] of Object.entries(t)) {
    const n = `.icon.${s}`, l = i.startsWith("<svg"), a = l ? Ne(i).replaceAll("<", "%3C").replaceAll(">", "%3E").replaceAll('"', "'") : i, o = `.lite-tree ${n}{
            mask-image: url("${l ? `data:image/svg+xml,${a}` : a}");            
            -webkit-mask-image: url("${l ? `data:image/svg+xml,${a}` : a}");
            -moz-mask-image: url("${l ? `data:image/svg+xml,${a}` : a}");
        }`;
    e.innerHTML.includes(`.lite-tree ${n}`) || (e.innerHTML = e.innerHTML + `
` + o);
  }
}
function ke(t, r) {
  A(`        
        ${Object.keys(t).map((e) => `.lite-tree ${e} { ${Ae(t[e])} }`).join(`
`)} 
    `, { id: "lite-tree-custom-styles", mode: "replace", el: r });
}
function Te(t) {
  if (String(t.icon).trim().length > 0)
    return t.icon;
  if (t.children && t.children.length > 0)
    return (t.open == null ? true : t.open) ? "folder-open" : "folder";
  const e = t.title.trim();
  return e.endsWith("/") ? (t.icon = "folder", t.title = e.slice(0, -1), "folder") : "file";
}
function Se(t, r) {
  const e = t.target, s = e.closest(".lite-tree-node");
  if (s) {
    const n = {
      position: "node",
      node: s.getAttribute("data-node-id"),
      element: e
    };
    e.classList.contains("tag") ? n.position = "tag" : e.classList.contains("flag") ? n.position = "flag" : e.classList.contains("comment") ? n.position = "comment" : e.classList.contains("action") ? n.position = "action" : e.closest("span.title") ? n.position = "title" : e.closest("span.flag") && (n.position = "flag"), r(n), t.stopPropagation();
  }
}
var Ce = `.lite-tree {\r
  position: relative;\r
  padding: 8px;\r
  border: 1px solid #eee;\r
  text-align: left;\r
  width: 100%;\r
  box-sizing: border-box;\r
  overflow-y: auto;\r
  overflow-x: hidden;\r
}\r
.lite-tree .richlabel {\r
  display: inline-flex;\r
}\r
.lite-tree .icon {\r
  display: inline-block;\r
  width: 1em;\r
  height: 1em;\r
  margin: 0.2em;\r
}\r
.lite-tree::-webkit-scrollbar {\r
  width: 4px;\r
  height: 1px;\r
}\r
.lite-tree::-webkit-scrollbar-thumb {\r
  border-radius: 10px;\r
  background-color: #b1b1b1;\r
}\r
.lite-tree::-webkit-scrollbar-track {\r
  background: #ededed;\r
  border-radius: 10px;\r
}\r
.lite-tree .lite-tree-nodes {\r
  color: #555;\r
  display: flex;\r
  flex-direction: column;\r
  list-style: none !important;\r
  padding: 0px;\r
  margin: 0px;\r
}\r
.lite-tree .lite-tree-nodes > li {\r
  margin: 0px;\r
}\r
.lite-tree .lite-tree-nodes > li > span.lite-tree-node {\r
  cursor: pointer;\r
  display: flex;\r
  width: 100%;\r
  box-sizing: border-box;\r
  padding: 4px;\r
  margin: 0px;\r
  align-items: center;\r
  position: relative;\r
}\r
.lite-tree .lite-tree-nodes > li > span.lite-tree-node.diff-add {\r
  background-color: #f3ffec;\r
  color: green;\r
}\r
.lite-tree .lite-tree-nodes > li > span.lite-tree-node.diff-modify {\r
  background-color: #fff6e9;\r
  color: orange;\r
}\r
.lite-tree .lite-tree-nodes > li > span.lite-tree-node.diff-delete {\r
  background-color: #ffeaea;\r
  color: red!important;\r
}\r
.lite-tree .lite-tree-nodes > li > span.lite-tree-node.important {\r
  background-color: #d7f0ff;\r
  color: #037be5 !important;\r
  font-weight: bold;\r
}\r
.lite-tree .lite-tree-nodes > li > span.lite-tree-node.correct {\r
  background-color: #f3ffec;\r
  color: green!important;\r
}\r
.lite-tree .lite-tree-nodes > li > span.lite-tree-node.error {\r
  background-color: #ffeaea;\r
  color: red!important;\r
}\r
.lite-tree .lite-tree-nodes > li > span.lite-tree-node > span.flag {\r
  width: 1.2em;\r
  text-align: center;\r
}\r
.lite-tree .lite-tree-nodes > li > span.lite-tree-node > span.title {\r
  flex-grow: 1;\r
  padding-right: 4px;\r
  display: inline-flex;\r
  align-items: center;\r
}\r
.lite-tree .lite-tree-nodes > li > span.lite-tree-node > span.title > span.tag {\r
  background-color: #eee;\r
  box-sizing: border-box;\r
  color: #333;\r
  padding: 2px 4px;\r
  border-radius: 4px;\r
  border: 1px solid #ddd;\r
  margin-left: 2px;\r
  margin-right: 2px;\r
  font-size: 1em;\r
  height: 1.5em;\r
  align-items: center;\r
}\r
.lite-tree .lite-tree-nodes > li > span.lite-tree-node > span.title > span.tag span.icon {\r
  font-size: 1em;\r
}\r
.lite-tree .lite-tree-nodes > li > span.lite-tree-node > span.comment {\r
  color: #bbb;\r
  display: inline-flex;\r
}\r
@media screen and (max-width: 480px) {\r
  .lite-tree .lite-tree-nodes > li > span.lite-tree-node > span.comment {\r
    display: none;\r
  }\r
}\r
.lite-tree .lite-tree-nodes > li > span.lite-tree-node > span.opener {\r
  width: 1em;\r
  height: 1em;\r
  transform-origin: 0.5em center;\r
  transform: rotate(0deg);\r
  transition: all 0.2s;\r
}\r
.lite-tree .lite-tree-nodes > li > span.lite-tree-node > span.opener.open {\r
  transform-origin: 0.5em center;\r
  transform: rotate(90deg);\r
  transition: all 0.2s;\r
}\r
.lite-tree .lite-tree-nodes > li > span.lite-tree-node:hover {\r
  background-color: #f8f8f8;\r
  border-radius: 4px;\r
}\r
.dark .lite-tree {\r
  border: 1px solid #1a1a1a;\r
}\r
.dark .lite-tree::-webkit-scrollbar-thumb {\r
  background-color: #555;\r
}\r
.dark .lite-tree::-webkit-scrollbar-track {\r
  background: black;\r
}\r
.dark .lite-tree .lite-tree-nodes {\r
  color: #999;\r
}\r
.dark .lite-tree .lite-tree-nodes > li {\r
  margin: 0px;\r
}\r
.dark .lite-tree .lite-tree-nodes > li > span.lite-tree-node.diff-add {\r
  background-color: #212121;\r
  color: #00d500 !important;\r
}\r
.dark .lite-tree .lite-tree-nodes > li > span.lite-tree-node.diff-modify {\r
  background-color: #212121;\r
}\r
.dark .lite-tree .lite-tree-nodes > li > span.lite-tree-node.diff-delete {\r
  background-color: #212121;\r
}\r
.dark .lite-tree .lite-tree-nodes > li > span.lite-tree-node.important {\r
  background-color: #212121;\r
}\r
.dark .lite-tree .lite-tree-nodes > li > span.lite-tree-node.correct {\r
  background-color: #212121;\r
  color: #00d500 !important;\r
}\r
.dark .lite-tree .lite-tree-nodes > li > span.lite-tree-node.error {\r
  background-color: #212121;\r
}\r
.dark .lite-tree .lite-tree-nodes > li > span.lite-tree-node > span.title > span.tag {\r
  background-color: #212121;\r
  color: #aaa;\r
  border: 1px solid #333;\r
}\r
.dark .lite-tree .lite-tree-nodes > li > span.lite-tree-node > span.comment {\r
  color: #bbb;\r
}\r
.dark .lite-tree .lite-tree-nodes > li > span.lite-tree-node:hover {\r
  background-color: #333;\r
}\r
`;
var Le = `:root {
  --lite-tree-icon-file: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxZW0iIGhlaWdodD0iMWVtIiB2aWV3Qm94PSIwIDAgMjU2IDI1NiI+PHBhdGggZmlsbD0iY3VycmVudENvbG9yIiBkPSJtMjEzLjY2IDgyLjM0bC01Ni01NkE4IDggMCAwIDAgMTUyIDI0SDU2YTE2IDE2IDAgMCAwLTE2IDE2djE3NmExNiAxNiAwIDAgMCAxNiAxNmgxNDRhMTYgMTYgMCAwIDAgMTYtMTZWODhhOCA4IDAgMCAwLTIuMzQtNS42Nk0xNjAgNTEuMzFMMTg4LjY5IDgwSDE2MFpNMjAwIDIxNkg1NlY0MGg4OHY0OGE4IDggMCAwIDAgOCA4aDQ4eiIvPjwvc3ZnPg==");
  --lite-tree-icon-folder: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxZW0iIGhlaWdodD0iMWVtIiB2aWV3Qm94PSIwIDAgMjQgMjQiPjxwYXRoIGZpbGw9Im5vbmUiIHN0cm9rZT0iY3VycmVudENvbG9yIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIHN0cm9rZS13aWR0aD0iMiIgZD0iTTUgNGg0bDMgM2g3YTIgMiAwIDAgMSAyIDJ2OGEyIDIgMCAwIDEtMiAySDVhMiAyIDAgMCAxLTItMlY2YTIgMiAwIDAgMSAyLTIiLz48L3N2Zz4=");
  --lite-tree-icon-folder-open: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxZW0iIGhlaWdodD0iMWVtIiB2aWV3Qm94PSIwIDAgMjQgMjQiPjxwYXRoIGZpbGw9Im5vbmUiIHN0cm9rZT0iY3VycmVudENvbG9yIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIHN0cm9rZS13aWR0aD0iMiIgZD0ibTUgMTlsMi43NTctNy4zNTFBMSAxIDAgMCAxIDguNjkzIDExSDIxYTEgMSAwIDAgMSAuOTg2IDEuMTY0bC0uOTk2IDUuMjExQTIgMiAwIDAgMSAxOS4wMjYgMTl6YTIgMiAwIDAgMS0yLTJWNmEyIDIgMCAwIDEgMi0yaDRsMyAzaDdhMiAyIDAgMCAxIDIgMnYyIi8+PC9zdmc+");
  --lite-tree-icon-arrow: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxZW0iIGhlaWdodD0iMWVtIiB2aWV3Qm94PSIwIDAgMzIgMzIiPjxwYXRoIGZpbGw9IiNhYmFiYWIiIGQ9Im0xMiA4bDEwIDhsLTEwIDh6Ii8+PC9zdmc+");
  --lite-tree-icon-tag: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxZW0iIGhlaWdodD0iMWVtIiB2aWV3Qm94PSIwIDAgMzIgMzIiPjxwYXRoIGZpbGw9ImN1cnJlbnRDb2xvciIgZD0iTTEwIDE0YTQgNCAwIDEgMSA0LTRhNC4wMDUgNC4wMDUgMCAwIDEtNCA0Wm0wLTZhMiAyIDAgMSAwIDEuOTk4IDIuMDA0QTIuMDAyIDIuMDAyIDAgMCAwIDEwIDhaIi8+PHBhdGggZmlsbD0iY3VycmVudENvbG9yIiBkPSJNMTYuNjQ0IDI5LjQxNUwyLjU4NiAxNS4zNTRBMiAyIDAgMCAxIDIgMTMuOTQxVjRhMiAyIDAgMCAxIDItMmg5Ljk0MWEyIDIgMCAwIDEgMS40MTQuNTg2bDE0LjA2IDE0LjA1OGEyIDIgMCAwIDEgMCAyLjgyOGwtOS45NDMgOS45NDNhMiAyIDAgMCAxLTIuODI5IDBaTTQgNHY5Ljk0MkwxOC4wNTggMjhMMjggMTguMDU4TDEzLjk0MiA0WiIvPjwvc3ZnPg==");
  --lite-tree-icon-checked: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxZW0iIGhlaWdodD0iMWVtIiB2aWV3Qm94PSIwIDAgMjEgMjEiPjxnIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PHBhdGggZD0iTTUuNSAzLjVoMTBhMiAyIDAgMCAxIDIgMnYxMGEyIDIgMCAwIDEtMiAyaC0xMGEyIDIgMCAwIDEtMi0ydi0xMGEyIDIgMCAwIDEgMi0yIi8+PHBhdGggZD0ibTcuNSAxMC41bDIgMmw0LTQiLz48L2c+PC9zdmc+");
  --lite-tree-icon-unchecked: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxZW0iIGhlaWdodD0iMWVtIiB2aWV3Qm94PSIwIDAgMjEgMjEiPjxwYXRoIGZpbGw9Im5vbmUiIHN0cm9rZT0iY3VycmVudENvbG9yIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGQ9Ik01LjUgMy41aDEwYTIgMiAwIDAgMSAyIDJ2MTBhMiAyIDAgMCAxLTIgMmgtMTBhMiAyIDAgMCAxLTItMnYtMTBhMiAyIDAgMCAxIDItMiIvPjwvc3ZnPg==");
  --lite-tree-icon-star: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxZW0iIGhlaWdodD0iMWVtIiB2aWV3Qm94PSIwIDAgMjQgMjQiPjxwYXRoIGZpbGw9ImN1cnJlbnRDb2xvciIgZD0ibTIyIDkuMjRsLTcuMTktLjYyTDEyIDJMOS4xOSA4LjYzTDIgOS4yNGw1LjQ2IDQuNzNMNS44MiAyMUwxMiAxNy4yN0wxOC4xOCAyMWwtMS42My03LjAzek0xMiAxNS40bC0zLjc2IDIuMjdsMS00LjI4bC0zLjMyLTIuODhsNC4zOC0uMzhMMTIgNi4xbDEuNzEgNC4wNGw0LjM4LjM4bC0zLjMyIDIuODhsMSA0LjI4eiIvPjwvc3ZnPg==");
  --lite-tree-icon-yes: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxZW0iIGhlaWdodD0iMWVtIiB2aWV3Qm94PSIwIDAgNDggNDgiPjxwYXRoIGZpbGw9Im5vbmUiIHN0cm9rZT0iY3VycmVudENvbG9yIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIHN0cm9rZS13aWR0aD0iNCIgZD0ibTQgMjRsNS01bDEwIDEwTDM5IDlsNSA1bC0yNSAyNXoiIGNsaXAtcnVsZT0iZXZlbm9kZCIvPjwvc3ZnPg==");
  --lite-tree-icon-no: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxZW0iIGhlaWdodD0iMWVtIiB2aWV3Qm94PSIwIDAgMjQgMjQiPjxnIGZpbGw9Im5vbmUiIHN0cm9rZT0iY3VycmVudENvbG9yIiBzdHJva2UtZGFzaGFycmF5PSIyMiIgc3Ryb2tlLWRhc2hvZmZzZXQ9IjIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS13aWR0aD0iMiI+PHBhdGggZD0iTTE5IDVMNSAxOSI+PGFuaW1hdGUgZmlsbD0iZnJlZXplIiBhdHRyaWJ1dGVOYW1lPSJzdHJva2UtZGFzaG9mZnNldCIgYmVnaW49IjAuM3MiIGR1cj0iMC4zcyIgdmFsdWVzPSIyMjswIi8+PC9wYXRoPjxwYXRoIGQ9Ik01IDVMMTkgMTkiPjxhbmltYXRlIGZpbGw9ImZyZWV6ZSIgYXR0cmlidXRlTmFtZT0ic3Ryb2tlLWRhc2hvZmZzZXQiIGR1cj0iMC4zcyIgdmFsdWVzPSIyMjswIi8+PC9wYXRoPjwvZz48L3N2Zz4=");
  --lite-tree-icon-important: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxZW0iIGhlaWdodD0iMWVtIiB2aWV3Qm94PSIwIDAgMjQgMjQiPjxwYXRoIGZpbGw9ImN1cnJlbnRDb2xvciIgZD0iTTEyIDIuMDAyYTMuODc1IDMuODc1IDAgMCAwLTMuODc1IDMuODc1YzAgMi45MiAxLjIwNyA2LjU1MiAxLjgxMyA4LjE5OWEyLjE4NyAyLjE4NyAwIDAgMCAyLjA2NCAxLjQyM2MuOTA0IDAgMS43MzktLjU0MiAyLjA2My0xLjQxOGMuNjA2LTEuNjQgMS44MS01LjI1NCAxLjgxLTguMjA0QTMuODc1IDMuODc1IDAgMCAwIDEyIDIuMDAyTTkuNjI1IDUuODc3YTIuMzc1IDIuMzc1IDAgMCAxIDQuNzUgMGMwIDIuNjU1LTEuMTExIDYuMDQzLTEuNzE3IDcuNjg0YS42ODYuNjg2IDAgMCAxLS42NTUuNDM4YS42ODcuNjg3IDAgMCAxLS42NTctLjQ0Yy0uNjA3LTEuNjUyLTEuNzIxLTUuMDU4LTEuNzIxLTcuNjgybTIuMzc2IDExLjEyNGEyLjUwMSAyLjUwMSAwIDEgMCAwIDUuMDAyYTIuNTAxIDIuNTAxIDAgMCAwIDAtNS4wMDJNMTEgMTkuNTAyYTEuMDAxIDEuMDAxIDAgMSAxIDIuMDAyIDBhMS4wMDEgMS4wMDEgMCAwIDEtMi4wMDIgMCIvPjwvc3ZnPg==");
}
.lite-tree .icon {
  background-color: currentColor;
  mask-size: cover;
  -webkit-mask-size: cover;
}
.lite-tree .icon.file {
  mask-image: var(--lite-tree-icon-file);
  -webkit-mask-image: var(--lite-tree-icon-file);
  -moz-mask-image: var(--lite-tree-icon-file);
}
.lite-tree .icon.folder {
  mask-image: var(--lite-tree-icon-folder);
  -webkit-mask-image: var(--lite-tree-icon-folder);
  -moz-mask-image: var(--lite-tree-icon-folder);
}
.lite-tree .icon.folder-open {
  mask-image: var(--lite-tree-icon-folder-open);
  -webkit-mask-image: var(--lite-tree-icon-folder-open);
  -moz-mask-image: var(--lite-tree-icon-folder-open);
}
.lite-tree .icon.arrow {
  mask-image: var(--lite-tree-icon-arrow);
  -webkit-mask-image: var(--lite-tree-icon-arrow);
  -moz-mask-image: var(--lite-tree-icon-arrow);
}
.lite-tree .icon.tag {
  mask-image: var(--lite-tree-icon-tag);
  -webkit-mask-image: var(--lite-tree-icon-tag);
  -moz-mask-image: var(--lite-tree-icon-tag);
}
.lite-tree .icon.checked {
  mask-image: var(--lite-tree-icon-checked);
  -webkit-mask-image: var(--lite-tree-icon-checked);
  -moz-mask-image: var(--lite-tree-icon-checked);
}
.lite-tree .icon.unchecked {
  mask-image: var(--lite-tree-icon-unchecked);
  -webkit-mask-image: var(--lite-tree-icon-unchecked);
  -moz-mask-image: var(--lite-tree-icon-unchecked);
}
.lite-tree .icon.star {
  mask-image: var(--lite-tree-icon-star);
  -webkit-mask-image: var(--lite-tree-icon-star);
  -moz-mask-image: var(--lite-tree-icon-star);
}
.lite-tree .icon.yes {
  mask-image: var(--lite-tree-icon-yes);
  -webkit-mask-image: var(--lite-tree-icon-yes);
  -moz-mask-image: var(--lite-tree-icon-yes);
}
.lite-tree .icon.no {
  mask-image: var(--lite-tree-icon-no);
  -webkit-mask-image: var(--lite-tree-icon-no);
  -moz-mask-image: var(--lite-tree-icon-no);
}
.lite-tree .icon.important {
  mask-image: var(--lite-tree-icon-important);
  -webkit-mask-image: var(--lite-tree-icon-important);
  -moz-mask-image: var(--lite-tree-icon-important);
}
`;
function We() {
  let t = A(Ce, {
    id: "lite-tree-styles",
    scoped: U
  });
  return A(Le, {
    id: "lite-tree-icons",
    scoped: false
  }), A(`.react-slidedown {
        overflow: hidden;
        position: relative;
        display: flex; 
        flex-direction: column;
        width: 100%; 
        height:0;
        transition-property: none;
        transition-duration: .3s;
        transition-timing-function: ease-in-out;
    }
    .react-slidedown.transitioning {
        overflow-y: hidden;
    }
    .react-slidedown.closed {
        display: none;
    }`, { id: "lite-tree-react-slidedown", scoped: false }), t;
}
We();
var Ee = defineComponent({
  __name: "index",
  props: {
    format: {},
    json: { type: Boolean },
    lite: { type: Boolean },
    data: {},
    indent: { default: 4 },
    getIcon: { type: Function, default: Te }
  },
  emits: ["click", "expand", "collapse"],
  setup(t, { emit: r }) {
    const e = t, s = r;
    let i = ref(e.format);
    e.json && (i.value = "json"), e.lite && (i.value = "lite");
    const n = useSlots(), l = (c) => {
      Se(c, (h2) => {
        s("click", h2, c);
      });
    }, a = () => {
      var h2;
      const c = (h2 = n.default) == null ? void 0 : h2.call(n)[0];
      if (c && typeof c.children == "string")
        return c.children;
    }, o = () => {
      const c = e.data || a();
      return c ? ce(c, { format: i.value }) : { classs: {}, styles: {}, icons: {}, nodes: [], hasFlag: false };
    }, { nodes: d, styles: u, classs: M, icons: I, hasFlag: m } = o();
    ke(M), je(I);
    let g = reactive(d);
    return provide(N, {
      hasFlag: m,
      indent: e.indent,
      styles: u,
      classs: M,
      icons: I,
      getIcon: e.getIcon,
      emit: s
    }), (c, h2) => (openBlock(), createElementBlock("div", {
      "data-lite-tree": "",
      class: "lite-tree",
      onClick: l
    }, [
      createVNode(De, { nodes: unref(g) }, null, 8, ["nodes"])
    ]));
  }
});
export {
  Ee as LiteTree
};
//# sourceMappingURL=@lite-tree_vue.js.map
