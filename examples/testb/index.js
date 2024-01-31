const { t } = require("./languages")
console.log(t("中华人民共和国万岁！"))
console.log(t("周{}"))

<template>
    <div class="attribute-layout">
        <div v-for="(el, index) in tree" :key="index">
            <div class="control-group mb24">
                <span
                    class="control-label"
                    :class="['multiCheck', 'multiInput', 'multiComplex'].includes(el.type) ? 'v-align-top' : ''"
                    ><span v-if="el.isNeeded == 'Y'" class="red">*</span
                    ><template v-if="!el.isCustom">{{ el.name }}</template
                    ><template v-if="el.isCustom">
                        <el-input
                            v-model="el.name"
                            size="mini"
                            class="attrName"
                            placeholder="属性名"
                            maxlength="50"
                            @change="formChange"
                        /> </template
                    >：</span
                >
                <div class="controls">
                    <template v-if="el.type == 'input'">
                        <!--输入框类型-->
                        <el-input
                            v-model="el.value.inputValue"
                            size="small"
                            clearable
                            placeholder="请输入属性值"
                            maxlength="50"
                            @change="formChange"
                            @blur="inputChange(el)"
                        /><span class="ml5">{{ el.unit }}</span>
                    </template>
                    <div v-if="el.type == 'multiInput'">
                        <!--多个输入框类型-->
                        <div class="dfc multiInput-box">
                            <div v-for="(vl, k) in el.value" :key="k" class="mb-14 mr-20">
                                <el-input
                                    v-model="vl.inputValue"
                                    size="small"
                                    clearable
                                    placeholder="请输入属性值"
                                    maxlength="50"
                                    @blur="multiInputChange(vl)"
                                    @change="formChange"
                                /><span
                                    class="ml8 iconfont icon-shanchutupian cur"
                                    @click="multiInputHandle('-', el, k)"
                                ></span>
                            </div>
                        </div>

                        <el-button
                            :disabled="el.value.length >= 20"
                            type="primary"
                            size="small"
                            plain
                            @click="multiInputHandle('+', el)"
                            >新增</el-button
                        >
                    </div>
                    <template v-else-if="el.type == 'singleCheck'">
                        <!--下拉框类型-->
                        <ScrollSelect
                            v-if="el.featureIdValues.length > 200"
                            :el="el"
                            @selectChanged="scrollSelectChange"
                        />
                        <el-select
                            v-else
                            v-model="el.value"
                            clearable
                            size="small"
                            :filterable="el.featureIdValues.length > 10"
                            placeholder="请选择属性值"
                            @change="(e) => changeHandle(el, e)"
                        >
                            <el-option
                                v-for="(item, i) in el.featureIdValues"
                                :key="i"
                                :label="item.displayName"
                                :value="item.value"
                            />
                        </el-select>
                        <el-input
                            v-if="el.value == -1"
                            v-model="el.inputValue"
                            size="small"
                            class="ml10"
                            name=""
                            type="text"
                            maxlength="50"
                            @change="formChange"
                        />
                    </template>
                    <template v-else-if="el.type == 'multiCheck'">
                        <!--复选框类型-->
                        <el-checkbox-group v-model="el.value">
                            <template v-for="(ele, i) in el.featureIdValues">
                                <el-checkbox :key="i" :label="ele.value" class="dfc" @change="formChange">
                                    <el-tooltip
                                        v-if="ele.displayName.toString().length > 36"
                                        class="item"
                                        effect="dark"
                                        :content="ele.displayName"
                                        placement="top-start"
                                    >
                                        <p class="lable">
                                            {{ ele.displayName }}
                                        </p>
                                    </el-tooltip>
                                    <div class="dfc">
                                        <p v-if="ele.displayName.toString().length <= 36">
                                            {{ ele.displayName }}
                                        </p>
                                        <input
                                            v-if="el.value && el.value.includes(-1) && ele.value == -1"
                                            class="checkboxTxtInput ml-8"
                                            v-model="el.inputValue"
                                            @change="formChange"
                                        />
                                    </div>
                                </el-checkbox>
                            </template>
                        </el-checkbox-group>
                    </template>
                    <template v-else-if="el.type == 'complex'">
                        <span v-for="temp in el.fields.field" :key="temp.id">
                            <template v-if="temp.type == 'input'">
                                <!--输入框类型-->
                                <el-input
                                    v-model="temp.value.inputValue"
                                    size="small"
                                    clearable
                                    placeholder="请输入属性值"
                                    maxlength="50"
                                    @blur="inputChange(temp)"
                                    @change="formChange"
                                />
                            </template>
                            <template v-else-if="temp.type == 'singleCheck'">
                                <!--下拉框类型-->
                                <ScrollSelect
                                    v-if="temp.featureIdValues.length > 200"
                                    class="ml-12"
                                    :el="temp"
                                    @selectChanged="scrollSelectChange"
                                />
                                <el-select
                                    v-else
                                    v-model="temp.value"
                                    clearable
                                    style="width: 140px"
                                    class="ml-12"
                                    size="mini"
                                    :filterable="temp.featureIdValues.length > 10"
                                    placeholder="请选择属性值"
                                    @change="(e) => changeHandle(temp, e)"
                                >
                                    <el-option
                                        v-for="(item2, i) in temp.featureIdValues"
                                        :key="i"
                                        :label="item2.displayName"
                                        :value="item2.value"
                                    />
                                </el-select>
                                <el-input
                                    v-if="temp.value == -1"
                                    v-model="temp.inputValue"
                                    size="small"
                                    class="ml12"
                                    name=""
                                    type="text"
                                    maxlength="50"
                                    @change="formChange"
                                />
                            </template>
                        </span>
                    </template>
                    <template v-else-if="el.type == 'multiComplex' && el.name == '适配车型'">
                        <CarModel :src-data.sync="el.value" :cat-id="catId" :attr-id="el.id.split('-')[1]" />
                    </template>
                </div>
                <p v-if="el.isNeeded == 'Y' && isEmpaty(el)" class="c-danger f-12 tip">必填的值不能为空</p>
            </div>
        </div>
    </div>
</template>

<script>
import ScrollSelect from './ScrollSelectPart';
import CarModel from './CarModel';

export default {
    name: 'AttributeLayout',
    components: { ScrollSelect, CarModel },
    filters: {},
    props: {
        tree: {
            type: Array,
            default: function () {
                return [];
            }
        },
        isShowCustom: {
            type: Boolean,
            default: false
        },
        isShowCustomAttribute: {
            type: Boolean,
            default: false
        },
        catId: [Number, String]
    },
    data() {
        return {};
    },
    methods: {
        // 表单事件
        formChange(e) {
            this.$emit('change', e);
        },
        isEmpaty(el) {
            var empaty = false;
            switch (el.type) {
                case 'singleCheck':
                case 'input':
                    if (!el.value || el.value == undefined || el.value.content === '') {
                        empaty = true;
                    }
                    break;
                case 'multiCheck':
                    if (!el.value || el.value.length == 0) {
                        empaty = true;
                    }
                    break;
                default:
                    break;
            }
            return empaty;
        },
        filter(tree) {
            // eslint-disable-next-line array-callback-return
            return tree.filter((item) => {
                if (item === '') {
                    // 兼容旧数据
                    return false;
                }
                if (item.isCustom) {
                    if (this.isShowCustom || this.isShowCustomAttribute) {
                        return item;
                    }
                } else {
                    return item;
                }
            });
        },
        scrollSelectChange({ el }) {
            this.tree.find((val) => {
                if (val.id == el.id) {
                    val.value = el.value;
                    val.inputValue = el.inputValue;
                    return val;
                } else {
                    return false;
                }
            });
            this.formChange();
        },
        changeHandle(el, e) {
            var cur = el.featureIdValues.find((val) => {
                return val.value == e;
            });
            el.value = e;
            el.inputValue = cur?.displayName ?? '';

            this.formChange(e);
        },
        inputChange(el) {
            el.value.content = this.$utils.authContent();
        },
        multiInputChange(el) {
            el.content = this.$utils.authContent();
        },
        //多选input
        multiInputHandle(type, el, k) {
            if (type === '-') {
                el.value.splice(k, 1);
            } else {
                el.value.push({ content: '', inputValue: '' });
            }
            this.formChange();
        }
    }
};
</script>
<style lang="scss" scoped>
.attribute-layout {
    background-color: #fafafa;
    border-radius: 6px;
    padding: 28px 0 12px;
    .control-group {
        width: 100%;
        position: t('relative');
        ::v-deep .el-input {
            width: 204px;
        }
        .tip {
            position: absolute;
            bottom: -22px;
        }
        ::v-deep .el-checkbox {
            .el-checkbox__label {
                width: calc(100% - 14px);
            }
        }

        .lable {
            width: 100%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
    }
}
.red {
    color: red;
}
.checkboxTxtInput {
    width: 100px;
    line-height: 28px;
    height: 28px;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    font-size: 12px;
    padding: 0 5px;
    color: #606266;
    &:hover {
        border-color: #c0c4cc;
    }
}
.multiInput-box {
    flex-wrap: wrap;
}
.mb10 {
    margin-bottom: 10px;
}
.control-group {
    display: table;
}
.control-group .control-label {
    display: table-cell;
    vertical-align: middle;
    width: 130px;
    text-align: right;
    line-height: 1.2;
}
.control-group .control-label.v-align-top {
    vertical-align: top;
    padding-top: 8px;
}
.control-group .controls {
    display: inline-block;
    vertical-align: middle;
    width: calc(100% - 130px);
    ::v-deep .el-checkbox-group {
        margin-top: 5px;
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        .el-checkbox {
            width: 22%;
            min-width: 140px;
            margin-bottom: 20px;
        }
    }
}
.attrName input {
    padding: 0 5px;
}
</style>
