const routes = [
  { path: '/', component: () => import('pages/login.vue') },
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '/dashboard', component: () => import('pages/dashboard.vue') },
      { path: '/customer_management', component: () => import('pages/customer_management.vue') },
      { path: '/quotes', component: () => import('pages/quotes.vue') },
      { path: '/employee_salary_list', component: () => import('pages/employee_salary_list.vue') },
    ]
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
