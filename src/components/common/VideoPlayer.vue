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
  gap: 24px;
  width: 100%;
}

.video-container {
  width: 100%;
  max-width: 600px;
  aspect-ratio: 16 / 9;
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
  font-size: 1.6rem;
  font-weight: bold;
  color: #333;
  text-align: center;
  margin: 0;
  padding: 16px 24px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

@media (max-width: 768px) {
  .video-container {
    max-width: 100%;
  }

  .control-button {
    width: 50px;
    height: 50px;
    font-size: 1.5rem;
  }

  .video-caption {
    font-size: 1.3rem;
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
