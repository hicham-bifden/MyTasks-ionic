<template>
  <div class="tabs-menu">
    <button 
      @click="$router.push('/actives')" 
      :class="{active: $route.path === '/actives'}"
      class="tab-button"
    >
      <ion-icon name="checkmark-circle" />
      <span>Actives</span>
    </button>
    
    <button 
      @click="$router.push('/fermees')" 
      :class="{active: $route.path === '/fermees'}"
      class="tab-button"
    >
      <ion-icon name="close-circle" />
      <span>Fermées</span>
    </button>
    
    <button 
      @click="$router.push('/archivees')" 
      :class="{active: $route.path === '/archivees'}"
      class="tab-button"
    >
      <ion-icon name="archive" />
      <span>Archivées</span>
    </button>
  </div>
</template>

<script setup>
import { IonIcon } from '@ionic/vue';
</script>

<style scoped>
.tabs-menu {
  display: flex;
  background: var(--ion-color-light);
  border-top: 1px solid var(--ion-color-medium);
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  box-shadow: var(--mobile-shadow);
}

.tab-button {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--mobile-padding);
  background: transparent;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  min-height: var(--mobile-button-height);
  position: relative;
  overflow: hidden;
}

.tab-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: var(--ion-color-primary);
  transform: scaleX(0);
  transition: transform 0.2s ease;
}

.tab-button.active::before {
  transform: scaleX(1);
}

.tab-button ion-icon {
  font-size: 24px;
  margin-bottom: 4px;
  transition: all 0.2s ease;
}

.tab-button span {
  font-size: var(--mobile-font-size-small);
  font-weight: 500;
  transition: all 0.2s ease;
}

.tab-button.active {
  background: rgba(var(--ion-color-primary-rgb), 0.1);
  color: var(--ion-color-primary);
}

.tab-button.active ion-icon {
  color: var(--ion-color-primary);
  transform: scale(1.1);
}

.tab-button.active span {
  color: var(--ion-color-primary);
  font-weight: 600;
}

/* Effet de pression tactile */
.tab-button:active {
  transform: scale(0.95);
  background: rgba(var(--ion-color-primary-rgb), 0.2);
}

/* Hover pour desktop */
@media (hover: hover) {
  .tab-button:hover:not(.active) {
    background: rgba(var(--ion-color-medium-rgb), 0.1);
  }
}

/* Optimisations pour petits écrans */
@media (max-width: 576px) {
  .tabs-menu {
    padding: 0;
  }
  
  .tab-button {
    padding: 8px 4px;
    min-height: 56px;
  }
  
  .tab-button ion-icon {
    font-size: 20px;
    margin-bottom: 2px;
  }
  
  .tab-button span {
    font-size: 12px;
  }
}

/* Optimisations pour écrans moyens */
@media (min-width: 577px) and (max-width: 768px) {
  .tab-button {
    padding: 12px 8px;
    min-height: 52px;
  }
  
  .tab-button ion-icon {
    font-size: 22px;
  }
  
  .tab-button span {
    font-size: 13px;
  }
}

/* Optimisations pour grands écrans */
@media (min-width: 769px) {
  .tabs-menu {
    max-width: 600px;
    margin: 0 auto;
    border-radius: var(--mobile-border-radius) var(--mobile-border-radius) 0 0;
  }
  
  .tab-button {
    padding: 16px 12px;
    min-height: 60px;
  }
  
  .tab-button ion-icon {
    font-size: 26px;
  }
  
  .tab-button span {
    font-size: 14px;
  }
}

/* Support du mode sombre */
@media (prefers-color-scheme: dark) {
  .tabs-menu {
    background: var(--ion-color-dark);
    border-top-color: var(--ion-color-medium);
  }
  
  .tab-button:not(.active) {
    color: var(--ion-color-light);
  }
}

/* Animation d'entrée */
.tabs-menu {
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}

/* Ripple effect pour Android */
.tab-button {
  position: relative;
  overflow: hidden;
}

.tab-button::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(var(--ion-color-primary-rgb), 0.3);
  transform: translate(-50%, -50%);
  transition: width 0.3s, height 0.3s;
}

.tab-button:active::after {
  width: 100px;
  height: 100px;
}
</style> 