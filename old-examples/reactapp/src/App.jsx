import { useState, useRef, useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";
import "./main";
import Banner from "./components/Banner";
import LanguageConfigurator from "./components/LanguageConfigurator.jsx";
import { VoerkaI18nProvider, useVoerkaI18n } from "@voerkai18n/react";
import { i18nScope } from "./languages";

function RootLayout() {
	const { t } = useVoerkaI18n();
	return (
		<div className="App">
			<header className="App-header">
				<div>
					{t("Voerkai1n是一个功能强大设计精良的国际化解决方案")}
				</div>
				<LanguageConfigurator />
				<div>
					<Banner memo={t("这是一个测试")} />
					<a
						className="App-link"
						href="https://zhangfisher.github.io/voerka-i18n"
						target="_blank"
						rel="noopener noreferrer"
					>
						学习VoerkaI18n
					</a>
				</div> 
			</header>
		</div>
	);
}

function App() {
	return (
		<VoerkaI18nProvider fallback={<div>正在加载语言包...</div>} scope={i18nScope}>
			<RootLayout />
		</VoerkaI18nProvider>
	);
}

export default App;
