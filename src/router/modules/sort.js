export default {
  path: '/sort',
  name: 'sort',
  redirect: '/sort/group',
  component: () => import('@/views/sort/layout.vue'),
  children: [
    {
      path: '/sort/group',
      meta: { auth: true },
      component: () => import('@/views/sort/group.vue')
    },
  ]
}
