<script setup>
  import { reactive, ref, onMounted } from 'vue'
  import { Avatar, Plus, Edit, Delete } from '@icon-park/vue-next'
  import { ServeGetGroupList, ServeGetGroupSave, ServeGetGroupDelete } from '@/api/group'
  import { NButton, NEmpty, NInput, NPopconfirm, NSpin } from 'naive-ui'
  import Member from './member.vue'
  
  const loading = ref(true)
  const groups = ref([])
  const activeGroupId = ref(0)
  const showAddForm = ref(false)
  const newGroupName = ref('')
  
  // 加载分组列表
  const loadGroups = async () => {
    loading.value = true
    try {
      const res = await ServeGetGroupList()
      if (res.code === 200) {
        groups.value = res.data.items || []
        
        // 自动选中第一个分组
        if (groups.value.length > 0 && !activeGroupId.value) {
          activeGroupId.value = groups.value[0].id
        }
      }
    } catch (error) {
      console.error('加载分组失败', error)
    } finally {
      loading.value = false
    }
  }
  
  // 添加新分组
  const addGroup = async () => {
    if (!newGroupName.value.trim()) return
    
    try {
      const res = await ServeGetGroupSave({
        name: newGroupName.value.trim()
      })
      
      if (res.code === 200) {
        // 重新加载分组
        await loadGroups()
        newGroupName.value = ''
        showAddForm.value = false
      }
    } catch (error) {
      console.error('添加分组失败', error)
    }
  }
  
  // 删除分组
  const deleteGroup = async (id) => {
    try {
      const res = await ServeGetGroupDelete({ keys: [id] })
      if (res.code === 200) {
        // 刷新列表
        await loadGroups()
        // 如果删除的是当前选中的分组，重置选中状态
        if (activeGroupId.value === id) {
          activeGroupId.value = groups.value.length > 0 ? groups.value[0].id : null
        }
      }
    } catch (error) {
      console.error('删除分组失败', error)
    }
  }
  
  // 选择分组
  const selectGroup = (id) => {
    activeGroupId.value = id
  }
  
  // 处理从成员组件发来的刷新请求
  const handleRefreshGroups = () => {
    loadGroups()
  }
  
  onMounted(() => {
    loadGroups()
    
    // 添加全局事件监听器，用于其他组件触发的刷新
    window.addEventListener('group-list-updated', loadGroups)
  })
</script>

<template>
  <!-- <SubViewLayout title="通讯录" :menus="menus" /> -->
    <section class="el-container is-vertical section">
      <header class="el-header bdr-b">{{ title }}</header>
      <section class="el-container o-hidden">
        <aside class="el-aside bdr-r">
            <section class="group-layout">
              <header class="header">
                <span class="title">分组管理</span>
              </header>
              <section class="content">
                <div class="group-list">
                  <NSpin :show="loading">
                    <template v-if="groups.length > 0">
                      <div 
                        v-for="group in groups" 
                        :key="group.id" 
                        class="group-item"
                        :class="{ active: activeGroupId === group.id }"
                        @click="selectGroup(group.id)"
                      >
                        <div class="group-info">
                          <Avatar class="group-icon" theme="outline" size="16" />
                          <span class="group-name">{{ group.name }}</span>
                          <span class="group-count">{{ group.count }}</span>
                        </div>
                        
                        <div class="group-actions">
                          <NPopconfirm 
                            @positive-click="deleteGroup(group.id)"
                            negative-text="取消"
                            positive-text="确定"
                          >
                            <template #trigger>
                              <Delete class="action-icon" theme="outline" size="16" />
                            </template>
                            确定要删除此分组吗？
                          </NPopconfirm>
                        </div>
                      </div>
                    </template>
                    
                    <NEmpty v-else description="暂无分组" />
                  </NSpin>
                </div>
                
                <!-- 添加分组表单 -->
                <div class="add-form" v-if="showAddForm">
                  <NInput 
                    v-model:value="newGroupName" 
                    placeholder="输入分组名称" 
                    size="small"
                    @keyup.enter="addGroup"
                  />
                  <div class="form-actions">
                    <NButton size="small" @click="showAddForm = false">取消</NButton>
                    <NButton size="small" type="primary" @click="addGroup" :disabled="!newGroupName.trim()">
                      确定
                    </NButton>
                  </div>
                </div>
              </section>
              
              <!-- 底部添加按钮 -->
              <footer class="footer">
                <NButton 
                  v-if="!showAddForm" 
                  block 
                  @click="showAddForm = true"
                  class="add-button"
                >
                  <template #icon>
                    <Plus />
                  </template>
                  添加分组
                </NButton>
              </footer>
            </section>
        </aside>
        <main class="el-main router-view">
          <div>
            <Member 
              :selectedGroupId="activeGroupId" 
              @refreshGroups="handleRefreshGroups"
            />
          </div>
        </main>
      </section>
    </section>
</template>

<style lang="less" scoped>
  .group-layout {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: var(--n-color-background, #fff);
}

.header {
  height: 50px;
  line-height: 50px;
  padding: 0 16px;
  font-size: 16px;
  font-weight: 500;
  border-bottom: 1px solid var(--n-border-color, #eaeaea);
  color: var(--n-text-color, #333);
}

.content {
  flex: 1;
  overflow-y: auto;
  padding: 8px;
}

.group-list {
  min-height: 100px;
}

.group-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  margin-bottom: 8px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
  
  &:hover {
    background-color: rgba(100, 108, 255, 0.05);
    
    .group-actions {
      opacity: 1;
    }
  }
  
  &.active {
    background-color: rgba(100, 108, 255, 0.1);
    border-left: 3px solid #646cff;
  }
}

.group-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.group-name {
  font-size: 14px;
  color: var(--im-text-color, #333);
  
}

.group-count {
  font-size: 12px;
  color: #999;
  background-color: #f5f5f5;
  border-radius: 10px;
  padding: 0 6px;
  min-width: 20px;
  text-align: center;
}

.group-actions {
  display: flex;
  gap: 8px;
  opacity: 0;
  transition: opacity 0.3s;
}

.action-icon {
  cursor: pointer;
  color: #999;
  
  &:hover {
    color: #646cff;
  }
}

.add-form {
  margin-top: 16px;
  padding: 12px;
  border-radius: 4px;
  background-color: rgba(100, 108, 255, 0.05);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 8px;
}

.footer {
  padding: 12px;
  border-top: 1px solid var(--n-border-color, #eaeaea);
}

.add-button {
  color: #646cff;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  
  &:hover {
    background-color: rgba(100, 108, 255, 0.1);
  }
}

.group-icon {
  color: var(--im-text-color, #333);
  fill: var(--im-text-color, #333);
}

.group-item.active .group-icon {
  color: #646cff;
  fill: #646cff;
}
</style>
