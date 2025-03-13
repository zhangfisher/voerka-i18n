<!--
 * @name: 系统软件信息
 * @description: Do not edit
-->

<template>
  <div>
    <div class="font-bold text-base mb-6">{{ t('系统信息') }}</div>
    <div class="mb-10 ml-10 w-full space-y-2">
      <div class="flex gap-x-4">
        <div class="font-light text-sm">{{ t('系统名称') }}:</div>
        <div class="text-sm">
          {{ SETTINGS.HTML_TITLE || SETTINGS.title || systemInfo.system_name }}
        </div>
      </div>
      <div v-if="systemInfo.version" class="flex gap-x-4">
        <div class="font-light text-sm">{{ t('系统版本') }}:</div>
        <div class="text-sm">
          {{ systemInfo.version }}
        </div>
      </div>
      <div class="flex gap-x-4">
        <div class="font-light text-sm">{{ t('系统型号') }}:</div>
        <div class="text-sm">
          {{ SETTINGS.HTML_MODEL || SETTINGS.model || systemInfo.model }}
        </div>
      </div>
      <div v-if="systemInfo.hardwareVersion" class="flex gap-x-4">
        <div class="font-light text-sm">{{ t('硬件版本') }}:</div>
        <div class="text-sm">{{ systemInfo.hardwareVersion }}</div>
      </div>
      <div v-if="systemInfo.sn" class="flex gap-x-4">
        <div class="font-light text-sm">{{ t('序列号') }}:</div>
        <div class="text-sm">{{ systemInfo.sn }}</div>
      </div>
      <div v-if="systemInfo.machineCode" class="flex gap-x-4">
        <div class="font-light text-sm">{{ t('设备授权号') }}:</div>
        <div class="text-sm">{{ systemInfo.machineCode }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { type SystemDeviceInfo, getSystemDeviceInfoApi } from '../model/info'
import { t } from '@/entry/languages'

const SETTINGS = ref(window.OEM_SETTINGS || {})

const systemInfo = ref<SystemDeviceInfo>({
  series: '',
  model: '',
  version: '',
  hardwareVersion: '',
  sn: '',
  runTime: '',
  machineCode: '',
  system_name: '',
  iftrust: ''
})

// 获取系统信息
async function getSystemInfo() {
  systemInfo.value = await getSystemDeviceInfoApi()
}

// 页面加载时
onMounted(() => {
  getSystemInfo()
})
</script>
