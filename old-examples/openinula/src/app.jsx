/*
 * Copyright (c) 2023 Huawei Technologies Co.,Ltd.
 *
 * openInula is licensed under Mulan PSL v2.
 * You can use this software according to the terms and conditions of the Mulan PSL v2.
 * You may obtain a copy of Mulan PSL v2 at:
 *
 *          http://license.coscl.org.cn/MulanPSL2
 *
 * THIS SOFTWARE IS PROVIDED ON AN "AS IS" BASIS, WITHOUT WARRANTIES OF ANY KIND,
 * EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO NON-INFRINGEMENT,
 * MERCHANTABILITY OR FIT FOR A PARTICULAR PURPOSE.
 * See the Mulan PSL v2 for more details.
 */

import './index.css';
import {useVoerkaI18n } from "@voerkai18n/openinula"
import LanguageConfigurator from "./LanguageConfigurator" 

export default function App() {
  const  { t }  = useVoerkaI18n()
  return (
    <div class="container">
      <div class="hero">
        <h1 class="hero-title animate__animated animate__bounceInDown">{t("欢迎来到 Inula 项目!")}</h1>
        <p class="hero-subtitle animate__animated animate__bounceInUp">{t("你已成功创建你的第一个Inula项目")}</p>
      </div>
      <div class="content">
        <div class="card animate__animated animate__zoomIn">
          <h2>{t("开始吧")}</h2>
          <p>
          {t("编辑{},并保存以重新加载。",'src/index.jsx')} 
          </p>
        </div>
        <div class="card animate__animated animate__zoomIn">
          <h2>{t("了解更多")}</h2>
          <p>
          {t("要了解 Inula,查看")}{' '}
            <a href="https://openinula.com/" target="_blank">{t("Inula 官网")}</a>
          </p>
        </div>
        <div>
            <LanguageConfigurator/>
        </div>
      </div>
    </div> 
  );
}
