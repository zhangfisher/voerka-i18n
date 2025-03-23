import { useLocation } from "@solidjs/router";
import { LanguageBar } from "./LanguageBar";
import { Translate } from "~/languages";

export default function Nav() {
  const location = useLocation();
  const active = (path: string) =>
    path == location.pathname ? "border-sky-600" : "border-transparent hover:border-sky-600";
  return (
    <nav class="bg-white flex flex-row align-center py-2">
      <ul class="container flex items-center p-3 text-gray-900">
        <li class={`border-b-2 ${active("/")} mx-1.5 sm:mx-6`}>
          <a href="/"><Translate message="首页"/></a>
        </li>
        <li class={`border-b-2 ${active("/repos")} mx-1.5 sm:mx-6`}>
          <a href="/"><Translate message="开源"/></a>
        </li>
        <li class={`border-b-2 ${active("/about")} mx-1.5 sm:mx-6`}>
          <a href="/about"><Translate message="关于"/></a>
        </li>
      </ul>
      <LanguageBar/>
    </nav>
  );
}
