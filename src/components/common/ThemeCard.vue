<template>
  <Card
    class="theme-card"
    :style="{ backgroundColor: theme.backgroundColor }"
    @click="$emit('select', theme.id)"
  >
    <template #header>
      <div class="theme-card-image">
        <img :src="theme.coverImage" :alt="theme.name" />
      </div>
    </template>
    <template #title>
      <div class="theme-card-title">
        <i :class="theme.icon" class="theme-icon"></i>
        <span>{{ getThemeName(theme.id) }}</span>
      </div>
    </template>
    <template #content>
      <div class="theme-card-content">
        <p class="item-count">
          {{ $t("home.itemsCount", { count: theme.items.length }) }}
        </p>
      </div>
    </template>
  </Card>
</template>

<script setup>
import { useI18n } from "vue-i18n";
import Card from "primevue/card";

const { t } = useI18n();

defineProps({
  theme: {
    type: Object,
    required: true,
  },
});

defineEmits(["select"]);

const themeNameMap = {
  "action-words": "themes.actionWords",
  "domestic-animals": "themes.animals",
  "body-parts": "themes.bodyParts",
  clothes: "themes.clothes",
  colors: "themes.colors",
  dishes: "themes.dishes",
  food: "themes.food",
  family: "themes.family",
  furniture: "themes.furniture",
  "household-appliances": "themes.householdAppliances",
  insects: "themes.insects",
  fruits: "themes.fruits",
  "natural-phenomena": "themes.naturalPhenomena",
  occupations: "themes.occupations",
  places: "themes.places",
  "school-supplies": "themes.schoolSupplies",
  transports: "themes.transport",
  vegetables: "themes.vegetables",
  "wild-animals": "themes.wildAnimals",
};

const getThemeName = (themeId) => {
  return t(themeNameMap[themeId] || "themes.animals");
};
</script>

<style scoped>
.theme-card {
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  height: 100%;
  border: 4px solid transparent;
}

.theme-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  border-color: #fff;
}

.theme-card:active {
  transform: translateY(-4px) scale(0.98);
}

.theme-card-image {
  width: 100%;
  height: 180px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.3);
}

.theme-card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.theme-card-title {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  font-size: 1.6rem;
  font-weight: bold;
  color: #333;
  padding: 14px 12px;
  text-align: center;
}

.theme-icon {
  font-size: 1.8rem;
  flex-shrink: 0;
}

.theme-card-content {
  text-align: center;
  padding: 0;
}

.item-count {
  font-size: 1.1rem;
  color: #555;
  margin: 0;
  font-weight: 600;
}

/* Tablet breakpoint */
@media (max-width: 1024px) {
  .theme-card-image {
    height: 160px;
  }

  .theme-card-title {
    font-size: 1.4rem;
    padding: 12px 10px;
    gap: 10px;
  }

  .theme-icon {
    font-size: 1.6rem;
  }

  .item-count {
    font-size: 1rem;
  }
}

/* Phone breakpoint */
@media (max-width: 768px) {
  .theme-card {
    border-radius: 16px;
    border-width: 3px;
  }

  .theme-card-image {
    height: 140px;
  }

  .theme-card-title {
    font-size: 1.3rem;
    padding: 10px 8px;
    gap: 8px;
  }

  .theme-icon {
    font-size: 1.4rem;
  }

  .item-count {
    font-size: 0.95rem;
  }
}

/* Small phone breakpoint */
@media (max-width: 480px) {
  .theme-card {
    border-radius: 14px;
  }

  .theme-card-image {
    height: 120px;
  }

  .theme-card-title {
    font-size: 1.2rem;
    padding: 8px 6px;
  }

  .theme-icon {
    font-size: 1.3rem;
  }

  .item-count {
    font-size: 0.9rem;
  }
}

/* Make cards more child-friendly on touch devices */
@media (hover: none) {
  .theme-card {
    border: 3px solid #fff;
  }

  .theme-card:hover {
    transform: none;
  }

  .theme-card:active {
    transform: scale(0.97);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  }
}
</style>
