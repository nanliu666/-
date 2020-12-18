<template>
  <keep-alive :key="$route.fullPath">
    <router-view />
  </keep-alive>
</template>
