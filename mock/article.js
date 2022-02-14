const Mock = require('mockjs')

const List = []
const count = 50

const baseContent = '<p>I am testing data, I am testing data.</p><p><img src="https://wpimg.wallstcn.com/4c69009c-0fd4-4153-b112-6cb53d1cf943"></p>'
const image_uri = 'https://wpimg.wallstcn.com/e4558086-631c-425c-9430-56ffb46e70b3'

const orginal = {
  id: '@increment',
  timestamp: +Mock.Random.date('T'),
  author: '@first',
  reviewer: '@first',
  title: '@title(5, 10)',
  content_short: 'mock data',
  content: baseContent,
  forecast: '@float(0, 100, 2, 2)',
  importance: '@integer(1, 3)',
  'type|1': ['CN', 'US', 'JP', 'EU'],
  'status|1': ['published', 'draft'],
  display_time: '@datetime',
  comment_disabled: true,
  pageviews: '@integer(300, 5000)',
  image_uri,
  platforms: ['a-platform']
}

const loudong = {
      'id|1-10': '@increment',
      floors: '@integer(1,10)',
      reviewer: '@first',
      unit: '@integer(1, 6)',
      'status|1': ['published', 'draft', 'deleted']
}

const fangwu = {
      'id|1-10': '@increment',
      unit: '@integer(1,6)',
      building: '@integer(1,10)',
      floors: '@integer(1,10)',
      house: '@./floors-@integer(1,10)',
      empID: '@integer(5)',
      reviewer: '@first',
      rtel: '@integer(11)',
      author: '@first',
      tel: '@integer(11)',
      'status|1': ['published', 'draft', 'deleted']
}

const chewei = {
      id: '@increment',
      'type|1': ['one', 'two'],
      author: '@first',
      tel: '@integer(11)',
      buy_timestamp: +Mock.Random.date('T'),
      lease_timestamp: +Mock.Random.date('T'),
      use_timestamp: +Mock.Random.date('T'),
      'status|1': ['published', 'draft', 'deleted']
}


const jiaofei = {
   id: '@integer(10)',
   author: '@first',
   tel: '@integer(11)',
   reviewer: '@first',
   wuye_charge: '@float(0, 500, 2, 2)',
   ranqi_charge: '@float(0, 500, 2, 2)',
   electric_charge: '@float(0, 500, 2, 2)',
   water_change: '@float(0, 500, 2, 2)',
   pay_charge:  image_uri,
   'status|1': ['published', 'draft', 'deleted']
}

const shequ = {
      id: '@integer(10)',
      'type|1': ['one', 'two'],
      timestamp: +Mock.Random.date('T'),
      author: '@first',
      reviewer: '@first',
      remark: '@title(1,20)',
      'status|1': ['published', 'draft', 'deleted']
}

const yonghu = {
      id: '@integer(10)',
      anme: '@middle',
      'type|1': ['one', 'two'],
      tel: '@integer(11)',
      'gender|1': ['1', '2'],
      IDcard: '@integer(18)',
      position: '@last'
}

const geren = {
  id: '@increment',
  anme: '@middle',
  'type|1': ['one', 'two'],
  tel: '@integer(11)',
  'gender|1': ['1', '2'],
  idCard: '@integer(18)',
  position: '@last'
}


const list_loudong = [],
      list_fangwu = [],
      list_chewei = [],
      list_jiaofei = [],
      list_shequ = [],
      list_yonghu = [],
      list_geren = []

// for (let i = 0; i < count; i++) {
//   List.push(Mock.mock(orginal))
//   list_loudong.push(Mock.mock(loudong))
//   list_fangwu.push(Mock.mock(fangwu))
//   list_chewei.push(Mock.mock(chewei))
//   list_jiaofei.push(Mock.mock(jiaofei))
//   list_shequ.push(Mock.mock(shequ))
//   list_yonghu.push(Mock.mock(yonghu))
// }

const list = []
const item = {
  id: '@increment',
  'type|1': ['one', 'two'],
  unit: '@integer(1,6)',
  building: '@integer(1,10)',
  floors: '@integer(1,10)',
  house: '@integer(1,50)',
  timestamp: +Mock.Random.date('T'),
  buy_timestamp: +Mock.Random.date('T'),
  lease_timestamp: +Mock.Random.date('T'),
  use_timestamp: +Mock.Random.date('T'),
  wuye_charge: '@float(0, 500, 2, 2)',
  ranqi_charge: '@float(0, 500, 2, 2)',
  electric_charge: '@float(0, 500, 2, 2)',
  water_change: '@float(0, 500, 2, 2)',
  pay_charge:  image_uri,
  uid: +Mock.Random.increment(1000),
  reviewer: '@first',
  createBy: '@first',
  rtel: /1\d{10}/,
  uid: '@increment(1000)',
  author: '@first',
  atel: /1\d{10}/,
  title: '@title(1,15)',
  remark: '@title(1,200)',
  'status|1': ['published', 'draft', 'deleted'],
  idCard: '@integer(18)',
  'gender|1': ['0', '1'],
  position: '@last'
}

for (let i = 0; i < count; i++) {
  list.push(Mock.mock(item))
}


const orginalRep = [
  {
    url: '/vue-element-admin/article/list',
    type: 'get',
    response: config => {
      const { importance, type, page = 1, limit = 20, sort } = config.query

      let mockList = List.filter(item => {
        if (importance && item.importance !== +importance) return false
        if (type && item.type !== type) return false
        if (title && item.title.indexOf(title) < 0) return false
        return true
      })

      if (sort === '-id') {
        mockList = mockList.reverse()
      }

      const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))

      return {
        code: 20000,
        data: {
          total: mockList.length,
          items: pageList
        }
      }
    }
  },

  {
    url: '/vue-element-admin/article/list',
    type: 'get',
    response: config => {
      const { importance, type, title, page = 1, limit = 20, sort } = config.query

      let mockList = List.filter(item => {
        if (importance && item.importance !== +importance) return false
        if (type && item.type !== type) return false
        if (title && item.title.indexOf(title) < 0) return false
        return true
      })

      if (sort === '-id') {
        mockList = mockList.reverse()
      }

      const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))

      return {
        code: 20000,
        data: {
          total: mockList.length,
          items: pageList
        }
      }
    }
  },

  {
    url: '/vue-element-admin/article/detail',
    type: 'get',
    response: config => {
      const { id } = config.query
      for (const article of List) {
        if (article.id === +id) {
          return {
            code: 20000,
            data: article
          }
        }
      }
    }
  },

  {
    url: '/vue-element-admin/article/pv',
    type: 'get',
    response: _ => {
      return {
        code: 20000,
        data: {
          pvData: [
            { key: 'PC', pv: 1024 },
            { key: 'mobile', pv: 1024 },
            { key: 'ios', pv: 1024 },
            { key: 'android', pv: 1024 }
          ]
        }
      }
    }
  },

  {
    url: '/vue-element-admin/article/create',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },

  {
    url: '/vue-element-admin/article/update',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  }
]

const selfRep = [
  {
    url: '/vue-element-admin/article//list',
    type: 'get',
    response: config => {
      const { unit, reviewer, building, type, status,
        page = 1, limit = 20, sort } = config.query

      let mockList = list.filter(item => {
        if (unit && item.unit !== +unit) return false
        if (reviewer && item.reviewer !== reviewer) return false
        if (building && item.building !== +building) return false
        if (type && item.reviewer !== type) return false
        if (status && item.unit !== status) return false
        return true
      })

      if (sort === '-id') {
        mockList = mockList.reverse()
      }

      const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))

      return {
        code: 20000,
        data: {
          total: mockList.length,
          items: pageList
        }
      }
    }
  },

  {
    url: '/vue-element-admin/article/list',
    type: 'get',
    response: config => {
      const { unit, reviewer, building, type, status, title,
        page = 1, limit = 20, sort } = config.query 

      let mockList = list.filter(item => {
        if (unit && item.unit !== +unit) return false
        if (reviewer && item.reviewer !== reviewer) return false
        if (building && item.building !== +building) return false
        if (type && item.reviewer !== type) return false
        if (status && item.unit !== status) return false
        if (title && item.title.indexOf(title) < 0) return false
        return true
      })

      if (sort === '-id') {
        mockList = mockList.reverse()
      }

      const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))

      return {
        code: 20000,
        data: {
          total: mockList.length,
          items: pageList
        }
      }
    }
  },

  {
    url: '/vue-element-admin/article/detail',
    type: 'get',
    response: config => {
      const { id } = config.query
      for (const article of list) {
        if (article.id === +id) {
          return {
            code: 20000,
            data: article
          }
        }
      }
    }
  },

  {
    url: '/vue-element-admin/article/pv',
    type: 'get',
    response: _ => {
      return {
        code: 20000,
        data: {
          pvData: [
            { key: 'PC', pv: 1024 },
            { key: 'mobile', pv: 1024 },
            { key: 'ios', pv: 1024 },
            { key: 'android', pv: 1024 }
          ]
        }
      }
    }
  },

  {
    url: '/vue-element-admin/article/create',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },

  {
    url: '/vue-element-admin/article/update',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },

  {
    url: '/vue-element-admin/article/update',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    } 
  }
]


module.exports = [
  ...selfRep
  // ...orginalRep
]

