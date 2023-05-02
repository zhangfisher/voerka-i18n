import { useState } from "react";
import { useVoerkaI18n } from "@voerkai18n/react"

function LanguageConfigurator(props) {
	const { activeLanguage, changeLanguage, languages,t } = useVoerkaI18n();
    return (
		<div>
			<div>{t("当前语言")}：{ activeLanguage }</div>
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