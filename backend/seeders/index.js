import { seedSubscriptionPlans } from './subscriptionPlans.js'
import { createSuperAdmin } from './superAdmin.js'

export const runSeeders = async () => {
  try {
    console.log('🌱 Starting database seeders...')
    
    await createSuperAdmin()
    await seedSubscriptionPlans()
    
    console.log('✅ All seeders completed successfully!')
  } catch (error) {
    console.error('❌ Error running seeders:', error)
  }
}
