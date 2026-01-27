<template>
  <div class="video-player">
    <div class="video-container">
      <Transition name="fade">
        <div v-if="isLoading" class="video-loading">
          <ProgressSpinner strokeWidth="4" />
        </div>
      </Transition>
      <video
        v-if="useVideo && videoSrc && !videoError"
        ref="videoElement"
        :src="videoSrc"
        class="sign-video"
        :class="{ 'media-hidden': isLoading }"
        autoplay
        loop
        muted
        playsinline
        @loadeddata="handleMediaLoaded"
        @error="handleVideoError"
      />
      <img
        v-else-if="gifSrc && !gifError"
        :src="gifSrc"
        :alt="alt"
        class="sign-gif"
        :class="{ 'media-hidden': isLoading }"
        @load="handleMediaLoaded"
        @error="handleGifError"
      />
      <div v-else-if="!isLoading" class="video-placeholder">
        <i class="pi pi-play-circle"></i>
        <p>Video not available</p>
      </div>
    </div>

    <Transition name="fade" mode="out-in">
      <p v-if="caption" class="video-caption" :key="caption">{{ caption }}</p>
    </Transition>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import ProgressSpinner from 'primevue/progressspinner'

const props = defineProps({
  videoSrc: {
    type: String,
    default: ''
  },
  gifSrc: {
    type: String,
    default: ''
  },
  alt: {
    type: String,
    default: 'Sign language'
  },
  caption: {
    type: String,
    default: ''
  },
  useVideo: {
    type: Boolean,
    default: true
  }
})

const videoElement = ref(null)
const videoError = ref(false)
const gifError = ref(false)
const isLoading = ref(true)

const handleVideoError = () => {
  videoError.value = true
  isLoading.value = false
}

const handleGifError = () => {
  gifError.value = true
  isLoading.value = false
}

const handleMediaLoaded = () => {
  isLoading.value = false
}

watch(() => props.videoSrc, () => {
  videoError.value = false
  isLoading.value = true
})

watch(() => props.gifSrc, () => {
  gifError.value = false
  isLoading.value = true
})

onMounted(() => {
  if (videoElement.value) {
    videoElement.value.play().catch(() => {
      // Silently handle autoplay failures
    })
  }
})
</script>

<style scoped>
.video-player {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  width: 100%;
  max-width: 500px;
}

.video-container {
  width: 100%;
  aspect-ratio: 4 / 3;
  background: #f0f0f0;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  border: 4px solid white;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.video-loading {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f0f0f0;
  z-index: 2;
}

.sign-video,
.sign-gif {
  width: 100%;
  height: 100%;
  object-fit: contain;
  background: #000;
  transition: opacity 0.3s ease;
}

.sign-video.media-hidden,
.sign-gif.media-hidden {
  opacity: 0;
}

.video-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 1.2rem;
}

.video-placeholder i {
  font-size: 4rem;
  margin-bottom: 16px;
}

.video-caption {
  font-size: 1.4rem;
  font-weight: bold;
  color: #333;
  text-align: center;
  margin: 0;
  padding: 12px 20px;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
  border-radius: 12px;
  border: 2px solid rgba(102, 126, 234, 0.2);
}

/* Tablet breakpoint */
@media (max-width: 1024px) {
  .video-player {
    max-width: 400px;
  }

  .video-container {
    border-radius: 16px;
  }

  .video-caption {
    font-size: 1.2rem;
    padding: 10px 16px;
  }
}

/* Phone breakpoint */
@media (max-width: 768px) {
  .video-player {
    max-width: 280px;
    gap: 12px;
  }

  .video-container {
    border-width: 3px;
    border-radius: 14px;
  }

  .video-caption {
    font-size: 1.1rem;
    padding: 8px 14px;
    border-radius: 10px;
  }
}

/* Small phone breakpoint */
@media (max-width: 480px) {
  .video-player {
    max-width: 240px;
    gap: 10px;
  }

  .video-container {
    border-radius: 12px;
  }

  .video-caption {
    font-size: 1rem;
    padding: 6px 12px;
    border-radius: 8px;
  }

  .video-placeholder i {
    font-size: 3rem;
    margin-bottom: 12px;
  }

  .video-placeholder {
    font-size: 1rem;
  }
}

/* Fade transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
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
</style>
