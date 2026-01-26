// Script to auto-generate themes.js from folder structure
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const themesDir = path.join(__dirname, 'public/assets/images/themes')
const outputFile = path.join(__dirname, 'src/data/themes.js')

// Theme configurations
const themeConfigs = {
  'animals': {
    name: 'Animals',
    nameSign: 'Животные',
    backgroundColor: '#98FB98',
    icon: 'pi pi-heart'
  },
  'vegetables': {
    name: 'Vegetables',
    nameSign: 'Овощи',
    backgroundColor: '#90EE90',
    icon: 'pi pi-sun'
  },
  'wild-animals': {
    name: 'Wild Animals',
    nameSign: 'Дикие животные',
    backgroundColor: '#F4A460',
    icon: 'pi pi-globe'
  },
  'insects': {
    name: 'Insects',
    nameSign: 'Насекомые',
    backgroundColor: '#FFB6C1',
    icon: 'pi pi-star'
  },
  'clothes': {
    name: 'Clothes',
    nameSign: 'Одежда',
    backgroundColor: '#87CEEB',
    icon: 'pi pi-shopping-bag'
  },
  'colors': {
    name: 'Colors',
    nameSign: 'Цвета',
    backgroundColor: '#DDA0DD',
    icon: 'pi pi-palette'
  },
  'food': {
    name: 'Food',
    nameSign: 'Еда',
    backgroundColor: '#FFD700',
    icon: 'pi pi-apple'
  },
  'dishes': {
    name: 'Dishes',
    nameSign: 'Посуда',
    backgroundColor: '#E6E6FA',
    icon: 'pi pi-circle'
  },
  'furniture': {
    name: 'Furniture',
    nameSign: 'Мебель',
    backgroundColor: '#D2B48C',
    icon: 'pi pi-home'
  },
  'household-appliances': {
    name: 'Household Appliances',
    nameSign: 'Бытовая техника',
    backgroundColor: '#C0C0C0',
    icon: 'pi pi-bolt'
  },
  'transports': {
    name: 'Transport',
    nameSign: 'Транспорт',
    backgroundColor: '#4682B4',
    icon: 'pi pi-car'
  },
  'natural-phenomena': {
    name: 'Natural Phenomena',
    nameSign: 'Природные явления',
    backgroundColor: '#87CEEB',
    icon: 'pi pi-cloud'
  },
  'school-supplies': {
    name: 'School Supplies',
    nameSign: 'Школьные принадлежности',
    backgroundColor: '#FFA07A',
    icon: 'pi pi-pencil'
  },
  'body-parts': {
    name: 'Body Parts',
    nameSign: 'Части тела',
    backgroundColor: '#FFDAB9',
    icon: 'pi pi-user'
  },
  'action-words': {
    name: 'Action Words',
    nameSign: 'Действия',
    backgroundColor: '#FF6347',
    icon: 'pi pi-directions'
  }
}

// Get all theme folders
const themeFolders = fs.readdirSync(themesDir).filter(folder => {
  return fs.statSync(path.join(themesDir, folder)).isDirectory()
})

// Generate themes array
const themes = themeFolders.map(folder => {
  const config = themeConfigs[folder] || {
    name: folder.charAt(0).toUpperCase() + folder.slice(1).replace(/-/g, ' '),
    nameSign: '',
    backgroundColor: '#CCCCCC',
    icon: 'pi pi-circle'
  }

  // Get all image files in the folder
  const imagesPath = path.join(themesDir, folder)
  const imageFiles = fs.readdirSync(imagesPath).filter(file => {
    return /\.(jpg|jpeg|png|gif)$/i.test(file)
  }).sort()

  // Generate items from images
  const items = imageFiles.map(file => {
    const fileName = path.parse(file).name
    const itemId = fileName.toLowerCase().replace(/\s+/g, '-')
    const itemName = fileName.charAt(0).toUpperCase() + fileName.slice(1).replace(/-/g, ' ')

    return {
      id: itemId,
      name: itemName,
      image: `/assets/images/themes/${folder}/${file}`,
      signVideo: `/assets/videos/sign-language/${folder}/${fileName}.MP4`,
      signGif: `/assets/videos/sign-language/${folder}/${fileName}.gif`,
      description: `Learn about ${itemName.toLowerCase()}`
    }
  })

  // Use first image as cover
  const coverImage = imageFiles[0]
    ? `/assets/images/themes/${folder}/${imageFiles[0]}`
    : `/assets/images/theme-covers/${folder}.jpg`

  return {
    id: folder,
    name: config.name,
    nameSign: config.nameSign,
    coverImage,
    backgroundColor: config.backgroundColor,
    icon: config.icon,
    items
  }
})

// Generate the file content
const fileContent = `// Auto-generated from folder structure
// Run 'node generate-themes.js' to regenerate

export const themes = ${JSON.stringify(themes, null, 2)}

// Helper function to get theme by ID
export function getThemeById(id) {
  return themes.find(theme => theme.id === id)
}

// Helper function to get item by theme and item ID
export function getItemById(themeId, itemId) {
  const theme = getThemeById(themeId)
  return theme?.items.find(item => item.id === itemId)
}
`

// Write the file
fs.writeFileSync(outputFile, fileContent, 'utf8')

console.log('✅ themes.js generated successfully!')
console.log(`📁 Found ${themeFolders.length} themes`)
console.log(`📷 Total items: ${themes.reduce((sum, theme) => sum + theme.items.length, 0)}`)
console.log('\nThemes:')
themes.forEach(theme => {
  console.log(`  - ${theme.name}: ${theme.items.length} items`)
})
