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

import react from '@vitejs/plugin-react';
import Voerkai18nPlugin from "@voerkai18n/vite"

let alias = {
  react: 'openinula', // 新增
  'react-dom': 'openinula', // 新增
  'react/jsx-dev-runtime': 'openinula/jsx-dev-runtime',
};

export default {
  plugins: [
    react() 
  ],
  resolve: {
    alias,
  },
};
