import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import Login from '@/views/auth/Login.vue'
import Register from '@/views/auth/Register.vue'
import StudentLayout from '@/components/layout/StudentLayout.vue'
import TeacherLayout from '@/components/layout/TeacherLayout.vue'
import StudentDashboard from '@/views/student/Dashboard.vue'
import StudentVideos from '@/views/student/Videos.vue'
import StudentAI from '@/views/student/AIChat.vue'
import StudentProfile from '@/views/student/Profile.vue'
import StudentTasks from '@/views/student/Tasks.vue'
import StudentSubmissions from '@/views/student/Submissions.vue'
import TeacherDashboard from '@/views/teacher/Dashboard.vue'
import TeacherVideos from '@/views/teacher/Videos.vue'
import TeacherAI from '@/views/teacher/AIGenerator.vue'
import TeacherProfile from '@/views/teacher/Profile.vue'
import TeacherStudents from '@/views/teacher/Students.vue'
import TeacherTasks from '@/views/teacher/Tasks.vue'
import NotFound from '../views/NotFound.vue'

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { requiresGuest: true }
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: { requiresGuest: true }
  },
  {
    path: '/student',
    component: StudentLayout,
    meta: { requiresAuth: true, role: 'student' },
    children: [
      {
        path: '',
        redirect: { name: 'StudentDashboard' }
      },
      {
        path: 'dashboard',
        name: 'StudentDashboard',
        component: StudentDashboard
      },
      {
        path: 'tasks',
        name: 'StudentTasks',
        component: StudentTasks
      },
      {
        path: 'submissions',
        name: 'StudentSubmissions',
        component: StudentSubmissions
      },
      {
        path: 'videos',
        name: 'StudentVideos',
        component: StudentVideos
      },
      {
        path: 'ai',
        name: 'StudentAI',
        component: StudentAI
      },
      {
        path: 'profile',
        name: 'StudentProfile',
        component: StudentProfile
      }
    ]
  },
  {
    path: '/teacher',
    component: TeacherLayout,
    meta: { requiresAuth: true, role: 'teacher' },
    children: [
      {
        path: '',
        redirect: { name: 'TeacherDashboard' }
      },
      {
        path: 'dashboard',
        name: 'TeacherDashboard',
        component: TeacherDashboard
      },
      {
        path: 'tasks',
        name: 'TeacherTasks',
        component: TeacherTasks
      },
      {
        path: 'videos',
        name: 'TeacherVideos',
        component: TeacherVideos
      },
      {
        path: 'students',
        name: 'TeacherStudents',
        component: TeacherStudents
      },
      {
        path: 'ai',
        name: 'TeacherAI',
        component: TeacherAI
      },
      {
        path: 'profile',
        name: 'TeacherProfile',
        component: TeacherProfile
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach(async (to) => {
  const authStore = useAuthStore()
  
  if (to.meta.requiresAuth) {
    if (!authStore.token) {
      return { path: '/login' }
    }
    
    if (!authStore.user) {
      try {
        await authStore.fetchCurrentUser()
      } catch (error) {
        console.error('Failed to fetch current user:', error)
        return { path: '/login' }
      }
    }
    
    // Check if user role is valid
    if (!authStore.user?.role) {
      console.error('User role is undefined')
      authStore.logout()
      return { path: '/login' }
    }
    
    // Check role-based access
    if (to.meta.role && authStore.user.role !== to.meta.role) {
      console.log(`Role mismatch: user role is ${authStore.user.role}, required role is ${to.meta.role}`)
      return { path: `/${authStore.user.role}/dashboard` }
    }
  }
  
  if (to.meta.requiresGuest && authStore.token) {
    // Ensure user role exists before redirecting
    if (authStore.user?.role) {
      return { path: `/${authStore.user.role}/dashboard` }
    } else {
      // If role is undefined, logout and redirect to login
      authStore.logout()
      return { path: '/login' }
    }
  }
})

export default router