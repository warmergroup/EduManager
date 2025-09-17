import { SubscriptionPlan } from '../models/SubscriptionPlan.js'

export const seedSubscriptionPlans = async () => {
  try {
    // Mavjud rejalarni o'chirish
    await SubscriptionPlan.deleteMany({})
    
    const plans = [
      {
        name: "Individual Teacher",
        type: "individual",
        maxGroups: 3,
        maxStudents: 45,
        price: 0,
        currency: "UZS",
        features: [
          "3 ta guruh yaratish",
          "45 tagacha talaba",
          "Asosiy hisobotlar",
          "Vazifa yaratish va baholash",
          "Fayl yuklash"
        ],
        isActive: true
      },
      {
        name: "Small Center",
        type: "center",
        maxGroups: 10,
        maxStudents: 150,
        maxTeachers: 5,
        price: 50000,
        currency: "UZS",
        features: [
          "10 ta guruh yaratish",
          "150 tagacha talaba",
          "5 tagacha o'qituvchi",
          "Barcha hisobotlar",
          "Markaz boshqaruvi",
          "Guruh boshqaruvi",
          "O'qituvchi qo'shish"
        ],
        isActive: true
      },
      {
        name: "Medium Center",
        type: "center",
        maxGroups: 25,
        maxStudents: 400,
        maxTeachers: 15,
        price: 100000,
        currency: "UZS",
        features: [
          "25 ta guruh yaratish",
          "400 tagacha talaba",
          "15 tagacha o'qituvchi",
          "Barcha hisobotlar",
          "Markaz boshqaruvi",
          "Guruh boshqaruvi",
          "O'qituvchi qo'shish",
          "Davomat tizimi",
          "Xabar tizimi"
        ],
        isActive: true
      },
      {
        name: "Large Center",
        type: "center",
        maxGroups: 50,
        maxStudents: 800,
        maxTeachers: 30,
        price: 200000,
        currency: "UZS",
        features: [
          "50 ta guruh yaratish",
          "800 tagacha talaba",
          "30 tagacha o'qituvchi",
          "Barcha hisobotlar",
          "Markaz boshqaruvi",
          "Guruh boshqaruvi",
          "O'qituvchi qo'shish",
          "Davomat tizimi",
          "Xabar tizimi",
          "API integratsiyasi",
          "24/7 qo'llab-quvvatlash"
        ],
        isActive: true
      }
    ]

    await SubscriptionPlan.insertMany(plans)
    console.log('✅ Subscription plans seeded successfully')
  } catch (error) {
    console.error('❌ Error seeding subscription plans:', error)
  }
}
