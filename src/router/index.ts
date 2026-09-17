import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/basic',
    component: () => import('@/views/Basic.vue'),
    meta: {
      title: 'Basic signature details',
    },
  },
  {
    path: '/social',
    component: () => import('@/views/Social.vue'),
    meta: {
      title: 'Social media links',
    },
  },
  {
    path: '/options',
    component: () => import('@/views/Options.vue'),
    meta: {
      title: 'Signature options',
    },
  },
  {
    path: '/addons',
    component: () => import('@/views/Addons.vue'),
    meta: {
      title: 'Signature addons',
    },
  },
  {
    path: '/templates',
    component: () => import('@/views/Templates.vue'),
    meta: {
      title: 'Templates',
    },
  },
  {
    path: '/login',
    component: () => import('@/views/Login.vue'),
    meta: {
      title: 'Login',
    },
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/basic',
  },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(async (to, _from, next) => {
  const requireAuth = import.meta.env.REQUIRE_AUTH === 'true'
  
  if (requireAuth && to.path !== '/login') {
    try {
      const res = await fetch('/api/auth/status')
      if (res.ok) {
        const data = await res.json()
        if (data.requireAuth && !data.isAuthenticated) {
          return next('/login')
        }
      }
    } catch (err) {
      console.error('Failed to check auth status', err)
      return next('/login')
    }
  }
  
  next()
})
