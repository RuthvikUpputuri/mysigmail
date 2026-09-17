<script setup lang="ts">
import { bottom, main } from './navigation'
</script>

<template>
  <div
    data-sidebar-nav
    class="flex flex-col justify-between h-full"
  >
    <div>
      <template
        v-for="i in main"
        :key="i.path"
      >
        <a
          v-if="i.path.startsWith('http')"
          :href="i.path"
        >
          <SidebarNavItem
            :icon="i.icon"
            :name="i.name"
          />
        </a>
        <RouterLink
          v-else
          v-slot="{ navigate, isActive }"
          :to="i.path"
        >
          <SidebarNavItem
            :icon="i.icon"
            :name="i.name"
            :is-active="isActive"
            @click="navigate"
          />
        </RouterLink>
      </template>
    </div>

    <div class="mb-4">
      <template
        v-for="i in bottom"
        :key="i.path"
      >
        <a
          v-if="i.path.startsWith('http')"
          :href="i.path"
        >
          <SidebarNavItem
            :icon="i.icon"
            :name="i.name"
          />
        </a>
        <RouterLink
          v-else
          v-slot="{ navigate, isActive }"
          :to="i.path"
        >
          <SidebarNavItem
            :icon="i.icon"
            :name="i.name"
            :is-active="isActive"
            @click="navigate"
          />
        </RouterLink>
      </template>
    </div>
  </div>
</template>
