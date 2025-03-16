 
 

import React from 'react'; 
import { useVoerkaI18n } from '@voerkai18n/react';
import classNames from 'classnames'

const LanguageBar: React.FC = () => {
  const { activeLanguage, changeLanguage, languages } = useVoerkaI18n();
  return (
    <div className="flex md:order-2 flex-row justify-items-center align-middle">
      {languages.map((lang) => (
        <button 
          key={lang.name} 
          onClick={() => changeLanguage(lang.name)} 
          className={classNames(
            "cursor-pointer border border-gray-300 focus:outline-none focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700",
            lang.name === activeLanguage  ? "bg-blue-700 text-white border-gray-300" :"text-gray-900"
          )}
        >{lang.name}</button>
      ))}
    </div>
  );
};

export default LanguageBar;