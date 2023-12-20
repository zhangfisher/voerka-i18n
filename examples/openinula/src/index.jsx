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

import Inula from 'openinula';
import './index.css';
import App from "./app"
import { i18nScope } from "./languages";
import { VoerkaI18nProvider } from "@voerkai18n/openinula"

function Main() {
  return (
    <VoerkaI18nProvider  fallback={<div>正在加载语言包...</div>} scope={i18nScope }>
        <App/>
    </VoerkaI18nProvider>
  )
}


Inula.render(<Main/>, document.getElementById('root'));
