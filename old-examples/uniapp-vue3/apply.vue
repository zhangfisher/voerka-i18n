<!--访客预约申请-填写信息--->
<template>
    <div class="px-5 pt-10">
        <div class="bg-white rounded-lg shadow-lg">
            <van-form class="px-2 pt-2 pb-1" @submit="onSubmit">
                <h3 class="text-base ml-1 my-2">接访人信息</h3>
                <text>{{t('你好')}}</text>
                <div>
                    <van-field v-model="username" name="phone" label="接访人手机号" placeholder="请输入接访人手机号" :rules="telRules"
                        :label-width="100">
                    </van-field>
                    <van-field v-model="password" type="password" name="name" label="接访人姓名" placeholder="请输入接访人姓名"
                        :rules="[{ required: true, message: '请输入接访人姓名' }]" :label-width="100">
                    </van-field>
                </div>
                <h3 class="text-base ml-1 my-2">访客信息</h3>
                <div>
                    <van-field v-model="password" type="password" name="name" label="访客姓名" placeholder="请输入访客姓名"
                        :rules="[{ required: true, message: '请输入访客姓名' }]" :label-width="100">
                    </van-field>
                    <van-field v-model="password" type="password" name="name" label="来访单位" placeholder="请输入来访单位名称"
                        :rules="[{ required: true, message: '请输入来访单位名称' }]" :label-width="100">
                    </van-field>
                    <van-field v-model="username" name="phone" label="手机号" placeholder="请输入手机号" :rules="telRules"
                        :label-width="100">
                    </van-field>
                    <van-field v-model="password" type="password" name="name" label="邮箱地址" placeholder="请输入邮箱地址"
                        :label-width="100">
                    </van-field>
                    <!-- 是否驾车 -->
                    <van-field name="radio" label="是否驾车">
                        <template #input>
                            <van-radio-group v-model="radio" direction="horizontal">
                                <div class="flex items-center">
                                    <van-radio name="2">否</van-radio>
                                    <van-radio name="1">是</van-radio>
                                </div>
                            </van-radio-group>
                        </template>
                    </van-field>
                    <!-- 车牌号 -->
                    <div class="flex items-center">
                        <van-field readonly clickable label="车牌号" :value="plateNumber" placeholder="请选择"
                            @click="showPicker = true" />
                        <van-popup v-model="showPicker" round position="bottom">
                            <van-picker show-toolbar :columns="chineseList" @cancel="showPicker = false" @confirm="onCarConfirm" />
                        </van-popup>
                        <van-field v-model="carNumber" type="text" name="carnumber" placeholder="请输入车牌号">
                        </van-field>
                    </div>
                    <div>
                        <van-cell title="拜访时间" :value="date" @click="showDate = true" />
                        <van-calendar v-model="showDate" type="range" @confirm="onDateConfirm" />
                    </div>
                    <!-- 拜访时间 -->
                    <div class="flex items-center">
                        <van-field
                            readonly
                            clickable
                            :value="beginTime"
                            placeholder="请选择开始时间"
                            @click="showBeginTimePicker = true"
                        />
                        <van-popup v-model="showBeginTimePicker" round position="bottom">
                            <van-datetime-picker
                                v-model="beginTime"
                                type="time"
                                title="选择时间"
                                :min-hour="10"
                                :max-hour="20"
                                @confirm="showBeginTimePicker = false"
                            />
                        </van-popup>
                        至
                        <van-field
                            readonly
                            clickable
                            :value="endTime"
                            placeholder="请选择结束时间"
                            @click="showEndTimePicker = true"
                        />
                        <van-popup v-model="showEndTimePicker" round position="bottom">
                            <van-datetime-picker
                                v-model="endTime"
                                type="time"
                                title="选择时间"
                                :min-hour="10"
                                :max-hour="20"
                                @confirm="showBeginTimePicker = false"
                            />
                        </van-popup>
                    </div>
                    <!-- 拜访园区 -->
                    <div class="flex items-center">
                        <van-field readonly clickable label="拜访园区" :value="park" placeholder="请选择园区"
                            @click="showPark = true" class="flex-auto w-64"/>
                        <van-popup v-model="showPark" round position="bottom">
                            <van-picker show-toolbar :columns="parkList" @cancel="showPark = false" @confirm="onParkConfirm" />
                        </van-popup>
                        <van-field readonly clickable :value="floor" placeholder="请选择楼层"
                            @click="showFloor = true" class="flex-auto w-28"/>
                        <van-popup v-model="showFloor" round position="bottom">
                            <van-picker show-toolbar :columns="floorList" @cancel="showFloor = false" @confirm="onFloorConfirm" />
                        </van-popup>
                        <div class="flex-1">楼</div>
                    </div>
                    <!-- 有无随行人员 -->
                    <van-field name="retinue" label="有无随行人员">
                        <template #input>
                            <van-radio-group v-model="retinue" direction="horizontal">
                                <div class="flex items-center">
                                    <van-radio name="2">无</van-radio>
                                    <van-radio name="1">有</van-radio>
                                </div>
                            </van-radio-group>
                        </template>
                    </van-field>
                    <div v-if="retinue == '1'">
                        <van-button round block type="info" @click="showQrCode">邀请随行人员添加个人信息</van-button>
                        <van-popup v-model="qrCode">
                            <div class="flex items-center justify-center w-60 h-60">
                                二维码图片
                            </div>
                        </van-popup>
                        <van-button round block type="info" @click="showQrCode">点击添加随行人员添加个人信息</van-button>
                    </div>
                </div>
                <div class="m-4">
                    <van-button round block type="info" native-type="submit">登录</van-button>
                </div>
            </van-form>
        </div>
    </div>
</template>
  
<script>
export default {
    name: '访客申请预约',
    data() {
        return {
            value: '',
            value1: '',
            value2: '',
            value3: '',
            pattern: /\d{6}/,
            username: '',
            password: '',
            checked: false,
            radio: '1',
            plateNumber: '',
            showPicker: false,
            chineseList: [
                '京','沪','浙','苏','粤','鲁','晋','冀','豫','川','渝',
                '辽','吉','黑','皖','鄂','津','贵','云','桂','琼','青',
                '新','藏','蒙','宁','甘','陕','闽','赣','湘',
            ],
            telRules: [
                { required: true, message: '手机号不能为空', trigger: true },
                {
                    validator: value => {
                        return /^1[3-9]\d{9}$/.test(value)
                    },
                    message: '请输入正确的手机号',
                    trigger: 'blur'
                },
            ],
            date: '',
            showDate: false,
            beginTime: '',
            endTime: '',
            showBeginTimePicker: false,
            showEndTimePicker: false,
            carNumber: '', // 车牌号
            showPark: false,
            park: '',
            parkList: ['集团总部园区', '胶州产业园', '新大楼园区'],
            showFloor: false,
            floorList: ['1','2','3','4','5'],
            floor: '',
            retinue: '1', // 1有随行人员 2无
            qrCode: false,

        };
    },
    methods: {
        // 校验函数返回 true 表示校验通过，false 表示不通过
        validator(val) {
            return /1\d{10}/.test(val);
        },
        // 异步校验函数返回 Promise
        asyncValidator(val) {
            return new Promise((resolve) => {
                // Toast.loading('验证中...');

                setTimeout(() => {
                    //   Toast.clear();
                    resolve(/\d{6}/.test(val));
                }, 1000);
            });
        },
        onFailed(errorInfo) {
            console.log('failed', errorInfo);
        },
        onSubmit() {
            console.log('submit');
            this.$router.push('/travel/mauthenticat')

        },
        onCarConfirm(value) {
            this.plateNumber = value;
            this.showPicker = false;
        },
        formatDate(date) {
            return `${date.getMonth() + 1}/${date.getDate()}`;
        },
        onDateConfirm(date) {
            const [start, end] = date;
            this.showDate = false;
            this.date = `${this.formatDate(start)} - ${this.formatDate(end)}`;
        },
        onParkConfirm(value) {
            this.park = value;
            this.showPark = false;
        },
        onFloorConfirm(value) {
            this.floor = value;
            this.showFloor = false;
        },
        showQrCode() {
            this.qrCode = true;
        }
    },
};
</script>
