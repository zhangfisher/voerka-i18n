import { useVoerkaI18n } from "@voerkai18n/openinula"

function LanguageConfigurator() {
	const { activeLanguage, changeLanguage, languages,t } = useVoerkaI18n();
    return (
		<div>
			<div>{t("当前语言")}：{ activeLanguage }</div>
			<div>
				{languages.map((lang) => {
					return (
						<button
							style={{
								padding:"12px",
								cursor:"pointer"
							}}
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