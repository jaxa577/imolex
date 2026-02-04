<template>
  <div class="side-menu" :style="{ backgroundColor: theme.backgroundColor }">
    <div class="menu-header">
      <Button
        icon="pi pi-arrow-left"
        class="back-button"
        rounded
        @click="$emit('back')"
        :aria-label="$t('theme.backButton')"
      />
      <h2 class="theme-title">{{ getThemeName(theme.id) }}</h2>
    </div>

    <div class="menu-items">
      <div
        v-for="item in theme.items"
        :key="item.id"
        class="menu-item"
        :class="{ active: item.id === activeItemId }"
        @click="$emit('select', item.id)"
      >
        <div class="menu-item-image">
          <img :src="item.image" :alt="item.name" />
        </div>
        <div class="menu-item-text">
          <span class="item-name">{{ getItemName(theme.id, item.id) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from "vue-i18n";
import Button from "primevue/button";

const { t } = useI18n();

const props = defineProps({
  theme: {
    type: Object,
    required: true,
  },
  activeItemId: {
    type: String,
    required: true,
  },
});

defineEmits(["select", "back"]);

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
  "alphabet-ru": "themes.alphabetRu",
};

const getThemeName = (themeId) => {
  return t(themeNameMap[themeId] || themeId);
};

// Mapping for theme IDs to their translation category names
const themeToItemCategory = {
  "action-words": "actionWords",
  "domestic-animals": "animals",
  "body-parts": "bodyParts",
  clothes: "clothes",
  colors: "colors",
  dishes: "dishes",
  family: "family",
  food: "food",
  fruits: "fruits",
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
  "alphabet-ru": "alphabetRu",
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
  const item = props.theme?.items?.find((i) => i.id === itemId);
  return item?.name || itemId;
};
</script>

<style scoped>
.side-menu {
  height: calc(100dvh - 40px);
  display: flex;
  flex-direction: column;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.menu-header {
  padding: 24px;
  background: rgba(255, 255, 255, 0.3);
  display: flex;
  align-items: center;
  gap: 16px;
  border-bottom: 3px solid rgba(255, 255, 255, 0.5);
}

.back-button {
  flex-shrink: 0;
  width: 50px;
  height: 50px;
  font-size: 1.5rem;
  background: white !important;
  color: #333 !important;
  border: 3px solid rgba(0, 0, 0, 0.1) !important;
}

.back-button:hover {
  background: #f0f0f0 !important;
  color: #333 !important;
  transform: scale(1.05);
}

.theme-title {
  margin: 0;
  font-size: 1.8rem;
  font-weight: bold;
  color: #333;
  flex: 1;
}

.menu-items {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 16px;
  min-height: 0;
  max-height: 100%;
  -webkit-overflow-scrolling: touch;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  margin-bottom: 12px;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 3px solid transparent;
}

.menu-item:hover {
  background: rgba(255, 255, 255, 0.8);
  transform: translateX(8px);
  border-color: white;
}

.menu-item:active {
  transform: translateX(4px) scale(0.98);
}

.menu-item.active {
  background: white;
  border-color: #333;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transform: translateX(8px);
}

.menu-item-image {
  width: 70px;
  height: 70px;
  border-radius: 12px;
  overflow: hidden;
  flex-shrink: 0;
  background: white;
  border: 2px solid rgba(0, 0, 0, 0.1);
}

.menu-item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.menu-item-text {
  flex: 1;
  min-width: 0;
}

.item-name {
  font-size: 1.4rem;
  font-weight: bold;
  color: #333;
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Custom scrollbar */
.menu-items::-webkit-scrollbar {
  width: 8px;
}

.menu-items::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 10px;
}

.menu-items::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 10px;
}

.menu-items::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.3);
}

/* Mobile styles - when used in mobile sidebar */
@media (max-width: 1024px) {
  .side-menu {
    height: 100dvh;
    border-radius: 0;
    border-top-right-radius: 20px;
    border-bottom-right-radius: 20px;
  }

  .menu-header {
    padding: 20px 16px;
  }

  .back-button {
    width: 44px;
    height: 44px;
    font-size: 1.3rem;
  }

  .theme-title {
    font-size: 1.5rem;
  }

  .menu-items {
    padding: 12px;
  }

  .menu-item {
    padding: 14px;
    margin-bottom: 10px;
    gap: 14px;
  }

  .menu-item:hover {
    transform: none;
  }

  .menu-item.active {
    transform: none;
  }

  .menu-item-image {
    width: 56px;
    height: 56px;
    border-radius: 10px;
  }

  .item-name {
    font-size: 1.2rem;
  }
}

@media (max-width: 480px) {
  .menu-header {
    padding: 16px 12px;
  }

  .back-button {
    width: 40px;
    height: 40px;
    font-size: 1.2rem;
  }

  .theme-title {
    font-size: 1.3rem;
  }

  .menu-items {
    padding: 10px;
  }

  .menu-item {
    padding: 12px;
    margin-bottom: 8px;
    gap: 12px;
    border-radius: 12px;
  }

  .menu-item-image {
    width: 50px;
    height: 50px;
    border-radius: 8px;
  }

  .item-name {
    font-size: 1.1rem;
  }
}
</style>
