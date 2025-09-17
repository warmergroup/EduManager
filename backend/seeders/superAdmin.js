import { User } from '../models/User.js'

export const createSuperAdmin = async () => {
  try {
    // Check if super admin already exists
    const existingSuperAdmin = await User.findOne({ role: 'super_admin' })
    if (existingSuperAdmin) {
      console.log('✅ Super admin already exists')
      return
    }

    // Create super admin
    const superAdmin = await User.create({
      fullName: 'Super Admin',
      email: 'admin@edumanager.com',
      password: 'admin123', // In production, use a strong password
      role: 'super_admin',
      isActive: true
    })

    console.log('✅ Super admin created successfully:')
    console.log('📧 Email: admin@edumanager.com')
    console.log('🔑 Password: admin123')
    console.log('⚠️  Please change the password after first login!')

  } catch (error) {
    console.error('❌ Error creating super admin:', error)
  }
}
