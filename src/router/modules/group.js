export default {
  path: '/group',
  name: 'group',
  redirect: '/group/member',
  component: () => import('@/views/group/layout.vue'),
  children: [
    {
      path: '/group/organize',
      meta: { auth: true },
      component: () => import('@/views/group/organize.vue')
    },
    {
      path: '/group/member',
      meta: { auth: true },
      component: () => import('@/views/group/member.vue')
    },
    {
      path: '/group/apply',
      meta: { auth: true },
      component: () => import('@/views/group/apply.vue')
    },
    {
      path: '/group/group',
      meta: { auth: true },
      component: () => import('@/views/group/groups.vue')
    },
    {
      path: '/group/group/open',
      meta: { auth: true },
      component: () => import('@/views/group/open-group.vue')
    }
  ]
}
