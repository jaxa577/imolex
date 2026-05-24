<template>
  <div v-if="theme" class="theme-detail-page">
    <!-- Mobile Header -->
    <div class="mobile-header">
      <Button
        icon="pi pi-arrow-left"
        class="mobile-back-button"
        rounded
        @click="goBack"
        :aria-label="$t('theme.backButton')"
      />
      <h2 class="mobile-theme-title">{{ getThemeName(theme.id) }}</h2>
      <Button
        icon="pi pi-bars"
        class="burger-button"
        rounded
        @click="toggleMobileMenu"
        :aria-label="$t('theme.menu')"
      />
    </div>

    <!-- Mobile Menu Overlay -->
    <Transition name="fade">
      <div
        v-if="isMobileMenuOpen"
        class="mobile-menu-overlay"
        @click="closeMobileMenu"
      ></div>
    </Transition>

    <!-- Mobile Slide Menu -->
    <Transition name="slide-menu">
      <aside v-if="isMobileMenuOpen" class="mobile-sidebar">
        <SideMenu
          :theme="theme"
          :active-item-id="activeItemId"
          @select="handleMobileSelect"
          @back="goBack"
        />
      </aside>
    </Transition>

    <div class="language-switcher-container">
      <LanguageSwitcher />
    </div>

    <div class="content-wrapper">
      <!-- Left Menu (Desktop Only) -->
      <aside class="sidebar desktop-only">
        <SideMenu
          :theme="theme"
          :active-item-id="activeItemId"
          @select="selectItem"
          @back="goBack"
        />
      </aside>

      <!-- Main Content -->
      <main class="main-content">
        <div v-if="activeItem" class="item-display">
          <!-- Item Name -->
          <Transition name="fade" mode="out-in">
            <div class="item-header" :key="activeItem.id">
              <div class="title-container">
                <h1 class="item-name">
                  {{ getItemName(theme.id, activeItem.id) }}
                </h1>
                <Button
                  v-if="activeItem.audio"
                  icon="pi pi-volume-up"
                  class="audio-button"
                  rounded
                  text
                  @click="playAudio(activeItem.audio)"
                  aria-label="Play audio"
                />
              </div>
              <p class="item-description">
                {{ getItemDescription(theme.id, activeItem.id) }}
              </p>
            </div>
          </Transition>

          <!-- Item Image -->
          <div class="item-image-video-wrapper">
            <div class="item-image-container">
              <Transition name="fade">
                <div v-if="imageLoading" class="media-loading">
                  <ProgressSpinner strokeWidth="4" />
                </div>
              </Transition>
              <Transition name="fade" mode="out-in">
                <img
                  :src="activeItem.image"
                  :alt="activeItem.name"
                  class="item-image"
                  :class="{ 'image-hidden': imageLoading }"
                  :key="activeItem.id"
                  @load="onImageLoad"
                  @error="onImageLoad"
                />
              </Transition>
            </div>

            <!-- Sign Language Video (hidden for image-only themes like alphabet) -->
            <VideoPlayer
              v-if="!theme.isImageOnly"
              :video-src="activeItem.signVideo"
              :gif-src="activeItem.signGif"
              :alt="`Sign language for ${getItemName(theme.id, activeItem.id)}`"
              :caption="getSignCaption(theme.id, activeItem.id)"
              :key="activeItem.id"
            />
          </div>

          <!-- Progress Indicator (Mobile) -->
          <div class="progress-indicator mobile-only">
            <span class="progress-text"
              >{{ currentIndex + 1 }} / {{ theme.items.length }}</span
            >
          </div>

          <!-- Navigation Buttons -->
          <div class="navigation-buttons">
            <Button
              icon="pi pi-arrow-left"
              :label="$t('theme.previous')"
              class="nav-button prev-button"
              :disabled="!hasPrevious"
              @click="goToPrevious"
              size="large"
            />
            <Button
              icon="pi pi-arrow-right"
              iconPos="right"
              :label="$t('theme.next')"
              class="nav-button next-button"
              :disabled="!hasNext"
              @click="goToNext"
              size="large"
            />
          </div>
        </div>

        <div v-else class="no-item">
          <i class="pi pi-info-circle"></i>
          <p>{{ $t("theme.selectItem") }}</p>
        </div>
      </main>
    </div>
  </div>

  <div v-else class="loading">
    <ProgressSpinner />
    <p>Loading theme...</p>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import Button from "primevue/button";
import ProgressSpinner from "primevue/progressspinner";
import SideMenu from "@/components/common/SideMenu.vue";
import VideoPlayer from "@/components/common/VideoPlayer.vue";
import LanguageSwitcher from "@/components/common/LanguageSwitcher.vue";
import { getThemeById } from "@/data/themes";

const route = useRoute();
const router = useRouter();
const { t } = useI18n();

const theme = ref(null);
const activeItemId = ref("");
const imageLoading = ref(true);
const isMobileMenuOpen = ref(false);

// Load theme data
const loadTheme = () => {
  const themeId = route.params.themeId;
  theme.value = getThemeById(themeId);

  if (theme.value && theme.value.items.length > 0) {
    // Set first item as active by default, or use query param
    activeItemId.value = route.query.itemId || theme.value.items[0].id;
  }
};

onMounted(() => {
  loadTheme();
});

onUnmounted(() => {
  document.body.style.overflow = "";
});

watch(
  () => route.params.themeId,
  () => {
    loadTheme();
  },
);

// Active item
const activeItem = computed(() => {
  return theme.value?.items.find((item) => item.id === activeItemId.value);
});

// Current index
const currentIndex = computed(() => {
  return (
    theme.value?.items.findIndex((item) => item.id === activeItemId.value) ?? -1
  );
});

// Navigation
const hasPrevious = computed(() => currentIndex.value > 0);
const hasNext = computed(() => {
  return theme.value && currentIndex.value < theme.value.items.length - 1;
});

// Mobile menu functions
const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
  document.body.style.overflow = isMobileMenuOpen.value ? "hidden" : "";
};

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false;
  document.body.style.overflow = "";
};

const handleMobileSelect = (itemId) => {
  selectItem(itemId);
  closeMobileMenu();
};

const selectItem = (itemId) => {
  imageLoading.value = true;
  activeItemId.value = itemId;
  router.replace({ query: { itemId } });
};

const onImageLoad = () => {
  imageLoading.value = false;
};

const playAudio = (audioSrc) => {
  if (audioSrc) {
    const audio = new Audio(audioSrc);
    audio.play().catch(e => console.error("Error playing audio:", e));
  }
};

const goToPrevious = () => {
  if (hasPrevious.value) {
    const prevItem = theme.value.items[currentIndex.value - 1];
    selectItem(prevItem.id);
  }
};

const goToNext = () => {
  if (hasNext.value) {
    const nextItem = theme.value.items[currentIndex.value + 1];
    selectItem(nextItem.id);
  }
};

const goBack = () => {
  router.push({ name: "home" });
};

// Mapping for theme IDs to their translation category names
const themeToItemCategory = {
  "action-words": "actionWords",
  "domestic-animals": "animals",
  "body-parts": "bodyParts",
  clothes: "clothes",
  colors: "colors",
  dishes: "dishes",
  fruits: "fruits",
  family: "family",
  food: "food",
  furniture: "furniture",
  "household-appliances": "householdAppliances",
  insects: "insects",
  "natural-phenomena": "naturalPhenomena",
  occupations: "occupations",
  places: "places",
  "school-supplies": "schoolSupplies",
  transports: "transports",
  vegetables: "vegetables",
  "wild-animals": "wildAnimals",
  "alphabet-uzb": "alphabetUzb",
};

// Theme name mapping
const themeNameMap = {
  "action-words": "themes.actionWords",
  "domestic-animals": "themes.animals",
  "body-parts": "themes.bodyParts",
  clothes: "themes.clothes",
  colors: "themes.colors",
  dishes: "themes.dishes",
  family: "themes.family",
  food: "themes.food",
  fruits: "themes.fruits",
  furniture: "themes.furniture",
  "household-appliances": "themes.householdAppliances",
  insects: "themes.insects",
  "natural-phenomena": "themes.naturalPhenomena",
  occupations: "themes.occupations",
  places: "themes.places",
  "school-supplies": "themes.schoolSupplies",
  transports: "themes.transport",
  vegetables: "themes.vegetables",
  "wild-animals": "themes.wildAnimals",
  "alphabet-uzb": "themes.alphabetUzb",
};

const getThemeName = (themeId) => {
  return t(themeNameMap[themeId] || themeId);
};

const getItemName = (themeId, itemId) => {
  const category = themeToItemCategory[themeId];
  if (category) {
    const translationKey = `items.${category}.${itemId}`;
    const translated = t(translationKey);
    // If translation exists and is different from the key, return it
    if (translated !== translationKey) {
      return translated;
    }
  }
  // Fallback: find the item in theme.items and return its default name
  const item = theme.value?.items?.find((i) => i.id === itemId);
  return item?.name || itemId;
};

const getItemDescription = (themeId, itemId) => {
  const itemName = getItemName(themeId, itemId);
  return t("theme.learnAbout", { name: itemName });
};

const getSignCaption = (themeId, itemId) => {
  const itemName = getItemName(themeId, itemId);
  return t("theme.signCaption", { name: itemName });
};
</script>

<style scoped>
.theme-detail-page {
  min-height: 100vh;
  min-height: 100dvh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
  position: relative;
  overflow-y: auto;
  overflow-x: hidden;
}

/* Mobile Header */
.mobile-header {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  z-index: 1001;
  padding: 8px 16px;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.mobile-back-button,
.burger-button {
  width: 44px;
  height: 44px;
  font-size: 1.2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
  color: white !important;
  border: none !important;
  flex-shrink: 0;
}

.mobile-back-button:hover,
.burger-button:hover {
  transform: scale(1.05);
}

.mobile-theme-title {
  margin: 0;
  font-size: 1.2rem;
  font-weight: bold;
  color: #333;
  text-align: center;
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 0 12px;
}

/* Mobile Menu Overlay */
.mobile-menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1002;
}

/* Mobile Sidebar */
.mobile-sidebar {
  position: fixed;
  top: 0;
  left: 0;
  width: 85%;
  max-width: 320px;
  height: 100vh;
  height: 100dvh;
  z-index: 1003;
  overflow: hidden;
}

/* Slide menu transition */
.slide-menu-enter-active,
.slide-menu-leave-active {
  transition: transform 0.3s ease;
}

.slide-menu-enter-from,
.slide-menu-leave-to {
  transform: translateX(-100%);
}

.slide-menu-enter-to,
.slide-menu-leave-from {
  transform: translateX(0);
}

.language-switcher-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  animation: fadeIn 0.6s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.content-wrapper {
  max-width: 1600px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 24px;
  min-height: calc(100vh - 40px);
  min-height: calc(100dvh - 40px);
}

.sidebar {
  position: sticky;
  top: 20px;
  height: fit-content;
  max-height: calc(100vh - 40px);
  max-height: calc(100dvh - 40px);
}

.desktop-only {
  display: block;
}

.mobile-only {
  display: none;
}

.main-content {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.item-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;
  animation: fadeIn 0.5s ease-out;
}

.item-header {
  text-align: center;
  width: 100%;
}

.title-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-bottom: 16px;
}

.item-name {
  font-size: 3.5rem;
  font-weight: bold;
  color: #333;
  margin: 0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
}

.audio-button {
  font-size: 1.5rem !important;
  width: 52px !important;
  height: 52px !important;
  color: #667eea !important;
}

.audio-button:hover {
  background: rgba(102, 126, 234, 0.1) !important;
}

.item-description {
  font-size: 1.4rem;
  color: #666;
  margin: 0;
  line-height: 1.6;
  font-style: italic;
}

.item-image-video-wrapper {
  display: flex;
  gap: 32px;
  justify-content: center;
  width: 100%;
}

.item-image-container {
  width: 100%;
  max-width: 500px;
  aspect-ratio: 1;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
  border: 6px solid white;
  position: relative;
  background: #f5f5f5;
}

.media-loading {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
  z-index: 2;
}

.item-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  transition: opacity 0.3s ease;
}

.item-image.image-hidden {
  opacity: 0;
}

/* Progress Indicator */
.progress-indicator {
  background: rgba(102, 126, 234, 0.1);
  padding: 8px 20px;
  border-radius: 20px;
  text-align: center;
}

.progress-text {
  font-size: 1rem;
  font-weight: 600;
  color: #667eea;
}

.navigation-buttons {
  display: flex;
  gap: 24px;
  margin-top: 24px;
  width: 100%;
  max-width: 600px;
}

.nav-button {
  font-size: 1.4rem;
  padding: 16px 32px;
  border-radius: 16px;
  border: none;
  transition: all 0.3s ease;
  flex: 1;
}

.prev-button {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.next-button {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.nav-button:hover:not(:disabled) {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
}

.nav-button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.no-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 400px;
  color: #999;
  font-size: 1.5rem;
}

.no-item i {
  font-size: 4rem;
  margin-bottom: 16px;
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  min-height: 100dvh;
  color: white;
  font-size: 1.5rem;
}

/* Fade transition for item changes */
.fade-enter-active,
.fade-leave-active {
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: scale(0.95);
}

.fade-leave-to {
  opacity: 0;
  transform: scale(1.02);
}

.fade-enter-to,
.fade-leave-from {
  opacity: 1;
  transform: scale(1);
}

/* Tablet breakpoint */
@media (max-width: 1024px) {
  .content-wrapper {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .sidebar.desktop-only {
    display: none;
  }

  .mobile-header {
    display: flex;
  }

  .mobile-only {
    display: block;
  }

  .theme-detail-page {
    padding: 76px 16px 16px;
  }

  .language-switcher-container {
    top: 70px;
    right: 16px;
  }

  .main-content {
    padding: 24px;
  }

  .item-name {
    font-size: 2.5rem;
  }

  .item-image-video-wrapper {
    flex-direction: column-reverse;
    align-items: center;
  }

  .item-image-container {
    max-width: 400px;
  }
}

/* Phone breakpoint */
@media (max-width: 768px) {
  .theme-detail-page {
    padding: 70px 12px 12px;
  }

  .mobile-header {
    height: 56px;
    padding: 6px 12px;
  }

  .mobile-theme-title {
    font-size: 1.1rem;
  }

  .language-switcher-container {
    top: 64px;
    right: 12px;
  }

  .main-content {
    padding: 16px;
    border-radius: 16px;
  }

  .item-display {
    gap: 20px;
  }

  .title-container {
    margin-bottom: 8px;
  }

  .item-name {
    font-size: 1.8rem;
  }

  .item-description {
    font-size: 1rem;
  }

  .item-image-container {
    max-width: 280px;
    border-width: 4px;
    border-radius: 16px;
  }

  .navigation-buttons {
    gap: 12px;
    margin-top: 16px;
  }

  .nav-button {
    font-size: 1.1rem;
    padding: 14px 20px;
    border-radius: 12px;
  }

  .nav-button :deep(.p-button-label) {
    display: none;
  }

  .nav-button :deep(.p-button-icon) {
    margin: 0;
    font-size: 1.5rem;
  }
}

/* Small phone breakpoint */
@media (max-width: 480px) {
  .theme-detail-page {
    padding: 66px 8px 8px;
  }

  .mobile-header {
    padding: 6px 8px;
  }

  .mobile-back-button,
  .burger-button {
    width: 40px;
    height: 40px;
    font-size: 1.1rem;
  }

  .mobile-theme-title {
    font-size: 1rem;
  }

  .language-switcher-container {
    top: 62px;
    right: 8px;
  }

  .main-content {
    padding: 12px;
  }

  .item-name {
    font-size: 1.5rem;
  }

  .item-description {
    font-size: 0.9rem;
  }

  .item-image-container {
    max-width: 240px;
  }

  .navigation-buttons {
    gap: 8px;
  }

  .nav-button {
    padding: 12px 16px;
  }
}

/* Landscape phone */
@media (max-height: 500px) and (orientation: landscape) {
  .theme-detail-page {
    padding: 66px 16px 16px;
  }

  .item-display {
    gap: 16px;
  }

  .item-image-video-wrapper {
    flex-direction: row;
    flex-wrap: wrap;
  }

  .item-image-container {
    max-width: 200px;
  }

  .navigation-buttons {
    margin-top: 12px;
  }
}
</style>
