import { useState } from "react";
import { useVoerkaI18n } from "@voerkai18n/react"

function LanguageConfigurator(props) {
	const { language, changeLanguage, languages,t } = useVoerkaI18n();
    return (
		<div>
			<div>{t("当前语言")}：{ language }</div>
			<div>
				{languages.map((lang) => {
					return (
						<button
							type="button"
                            key={lang.name}
							onClick={() => changeLanguage(lang.name)}
						>
							{lang.title}
						</button>
					);
				})}
			</div>
		</div>
	);
}

export default LanguageConfigurator; 