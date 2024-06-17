let date = new Date();
let today = [date.getFullYear(), date.getMonth() + 1, date.getDate()];

export const getAge = (birthday) => {
    if(birthday){
      birthday=birthday.split('-');
      // 新建日期对象
      // 今天日期，数组，同 birthday
      // 分别计算年月日差值
      let age = today.map((val, index) => {
        return val - birthday[index]
      })
      // 当天数为负数时，月减 1，天数加上月总天数
      // if (age[2] < 0) {
      //   // 简单获取上个月总天数的方法，不会错
      //   let lastMonth = new Date(today[0], today[1], 0)
      //   age[1]--
      //   age[2] += lastMonth.getDate()
      // }
      // 当月数为负数时，年减 1，月数加上 12
      if (age[1] < 0) {
        age[0]--
        age[1] += 12
      }
      // console.log(age[0]+'岁'+age[1]+'月'+age[2]+'天');
      // console.log(age[0]+'岁'+age[1]+'月');
      return age[0]+'岁'+age[1]+'个月'
    }
}