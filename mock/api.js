const loudou = [
    {
        ID: 'string',
        floors: 'string 楼层数',
        reviewer: 'string 楼栋负责人',
        unit: 'string 所属单元',
        status: 'string published 已销空 draft 待售空 deleted 禁用'
    }
]

const fangwu = [
    {
        ID: 'string',
        house: 'string 门牌号',
        unit: 'string 单元',
        building: 'string 楼栋号',
        empID: '负责人ID',
        reviewer: 'string 所属区域负责人',
        rtel: 'string 负责人联系',
        author: 'string 所属业主',
        tel: 'string 联系电话',
        status: 'string published 已销售, draft 待销售 deleted 禁用'
    }
]

const chewei = [
    {
        ID: 'string',
        type: 'string one 购买, two 出租',
        author: 'string 车为主',
        tel: 'string  车主联系方式',
        buy_timestamp: 'timestamp 购买时间',
        lease_timestamp: 'timestamp 出租时间',
        use_timestamp: 'timestamp 使用期限',
        status: 'string published draft deleted',
    }
]


const jiaofei = [
    {
     ID: 'string 缴费记录单号',
     author: 'string 缴费人',
     tel: 'string  车主联系方式',
     reviewer: 'string 负责人',
     wuye_charge: 'number 物业费',
     ranqi_charge: 'number 燃气费',
     electric_charge: 'number 电费',
     water_change: 'number 水费',
     pay_charge: 'image 缴费情况 截图',
     status: 'string published deleted'
    }
]

const  shequ = [
    {
        ID: 'string',
        type: 'string one 投诉, tow 维修',
        timestamp: 'string 投书时间',
        author: 'string 投诉人',
        reviewer: 'string 负责人',
        remark: 'string 具体内容',
        status: 'string published 已处理 deleted 待处理',
    }
]

const yonghu = [
    {
        ID: 'string',
        type: 'string one 员工 tow业主',
        tel: 'string 联系方式',
        gender: 'string 性别',
        IDcard: 'string 身份证',
        position: 'string 职位'
    }
]

const geren = {
    ID: 'string',
    type: 'string one 员工 tow业主',
    tel: 'string 联系方式',
    gender: 'string 性别',
    IDcard: 'string 身份证',
    position: 'string 职位'
}