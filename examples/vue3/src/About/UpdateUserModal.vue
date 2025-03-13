<!--
 * @name: 新增/修改账号 弹窗
 * @description: Do not edit
-->

<template>
  <Modal v-model:open="dialogVisible" :title="title">
    <Form ref="formRef" :model="dataForm" :rules="rules" layout="vertical">
      <FormItem name="user_name" :label="t('账号名称')">
        <Input
          v-model:value="dataForm.user_name"
          :maxlength="20"
          :disabled="mode === 'modify'"
          :placeholder="t('请输入账号名称')"
        />
      </FormItem>
      <template v-if="mode === 'create'">
        <FormItem name="password" :label="t('密码')">
          <Password v-model:value="dataForm.password" :placeholder="t('请输入密码')" />
        </FormItem>
        <FormItem name="dbPassword" :label="t('确认密码')">
          <Password
            v-model:value="dataForm.dbPassword"
            :placeholder="t('请再次输入密码')"
            @blur="checkDoubleHandle"
          />
        </FormItem>
        <FormItem name="name" :label="t('姓名')">
          <Input
            v-model:value="dataForm.name"
            :placeholder="t('请输入姓名')"
            :max-length="20"
            allow-clear
          />
        </FormItem>
        <FormItem prop="role_name" :label="`${t('角色名称')}:`">
          <Select v-model:value="dataForm.role_name" :placeholder="t('请选择权限')" allow-clear>
            <SelectOption v-for="item in roleList" :key="item.value" :value="item.label">
              {{ item.label }}
            </SelectOption>
          </Select>
        </FormItem>
      </template>

      <FormItem name="phone" :label="t('手机')">
        <Input v-model:value="dataForm.phone" :placeholder="t('请输入手机号')" allow-clear />
      </FormItem>
    </Form>

    <template #footer>
      <div>
        <Button :disabled="confrimButtonLoading" @click="closeModal">{{ t('取消') }}</Button>
        <Button
          type="primary"
          :disabled="confrimButtonLoading"
          :loading="confrimButtonLoading"
          @click="handleSubmit"
        >
          {{ t('确认') }}
        </Button>
      </div>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import type { FormInstance } from 'ant-design-vue'
import type { Rule } from 'ant-design-vue/es/form'
import type { User } from '../types/user'
import type { PropType } from 'vue'
import { computed, ref, watch } from 'vue'
import { message } from '@guolisec/toast'
import { Button, Form, FormItem, Input, Modal, Select, SelectOption } from 'ant-design-vue'
import {
  encrypt,
  passwordValidate,
  phoneValidate,
  startCase,
  useVModel,
  usernameValidate
} from '@guolisec/utils'
import { t } from '@/entry/languages/useLanguage'
import { getPublicKeyApi } from '@/domains/login/model/login'
import { createUserApi, modifyUserApi } from '../model/user'

const Password = Input.Password

// 父组件传值
const props = defineProps({
  visible: {
    type: Boolean,
    required: true
  },
  current: {
    type: Object
  },
  mode: {
    type: String as PropType<'create' | 'modify'>,
    default: 'create'
  }
})

const emit = defineEmits(['update:visible', 'refresh'])
const dialogVisible = useVModel(props, 'visible', emit)

const formRef = ref<FormInstance>()

const roleList = [
  { label: startCase(t('配置管理员')), value: 2, disabled: false },
  { label: startCase(t('策略管理员')), value: 4, disabled: false },
  { label: startCase(t('日志审计员')), value: 8, disabled: false }
]

const title = computed(() => (props.mode === 'create' ? t('新增账号') : t('编辑账号')))

function userFactory() {
  return {
    ID: undefined,
    user_name: '',
    password: '',
    dbPassword: '',
    name: '',
    phone: '',
    role_name: undefined
  }
}

const dataForm = ref<User>(userFactory())

const rules = ref<Record<string, Rule[]>>({
  user_name: [
    {
      required: true,
      validator: usernameValidate(),
      trigger: 'blur'
    },
    { min: 2, max: 20, message: t('长度在2-20个字符'), trigger: 'blur' }
  ],
  password: [
    {
      required: true,
      validator: passwordValidate(),
      trigger: 'blur'
    }
  ],
  dbPassword: [
    {
      required: true,
      validator: passwordValidate(),
      trigger: 'blur'
    }
  ],
  name: [
    {
      required: true,
      message: t('请输入姓名'),
      trigger: 'blur'
    },
    { min: 2, max: 20, message: t('长度在2-20个字符'), trigger: 'blur' }
  ],
  phone: [
    {
      required: true,
      validator: phoneValidate(),
      trigger: 'blur'
    }
  ],
  role_name: [{ required: true, message: t('请选择角色'), trigger: 'change' }]
})
// 密码二重校验
const checkDoubleHandle = () => {
  const password = dataForm.value.password
  const dbPassword = dataForm.value.dbPassword
  if (password && dbPassword && password !== dbPassword) {
    message.warning(t('两次密码不一致，请仔细校验'))
    return false
  } else {
    return true
  }
}

async function createUser() {
  const isDouble = checkDoubleHandle()
  if (isDouble) {
    const publicKey = await getPublicKeyApi()
    const encodePwByCryptoJS = encrypt(publicKey, dataForm.value.password ?? '')
    await createUserApi({
      ...dataForm.value,
      password: encodePwByCryptoJS
    })
    emit('refresh')
    closeModal()
  }
}

async function modifyUser() {
  await modifyUserApi(dataForm.value)
  emit('refresh')
  closeModal()
}

function closeModal() {
  dialogVisible.value = false
  emit('refresh')
}

watch(
  () => props.visible,
  (val) => {
    if (val) {
      dataForm.value = userFactory()
      formRef.value?.resetFields()
      if (props.mode === 'modify') {
        Object.assign(dataForm.value, props.current)
      }
    }
  }
)

// 保存
const confrimButtonLoading = ref(false)
async function handleSubmit() {
  await formRef.value?.validate()
  confrimButtonLoading.value = true
  try {
    props.mode === 'create' ? await createUser() : await modifyUser()
  } finally {
    confrimButtonLoading.value = false
  }
}
</script>
