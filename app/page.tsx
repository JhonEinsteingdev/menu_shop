"use client"

import { useState, useEffect } from "react"
import localforage from "localforage"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { ChefHat, ShoppingCart, Plus, Shuffle, Clock, Users, Trash2, Calendar, Check, Tag, AlertTriangle, RotateCcw, Edit, ArrowLeft, Eye, Package } from 'lucide-react'
import { toast, Toaster } from 'sonner'
import { PWARegister } from '@/components/pwa-register'

interface Recipe {
  id: string
  name: string
  description: string
  ingredients: string[]
  instructions: string
  cookTime: string
  servings: number
  category: string
}

interface ShoppingItem {
  id: string
  name: string
  completed: boolean
  category: string
  quantity?: string
  price?: string
}

interface IngredientSummary {
  name: string
  totalQuantity: string
  count: number
}

export default function RecipeApp() {
  const [recipes, setRecipes] = useState<Recipe[]>([
    {
      id: "1",
      name: "Pasta Carbonara",
      description: "Cremosa pasta italiana con huevo y panceta",
      ingredients: ["400g pasta", "200g panceta", "3 huevos", "100g queso parmesano", "Pimienta negra"],
      instructions: "1. Cocinar la pasta al dente\n2. Freír la panceta hasta dorar\n3. Mezclar huevos con queso\n4. Combinar todo fuera del fuego",
      cookTime: "20 min",
      servings: 1,
      category: "Cena"
    },
    {
      id: "2",
      name: "Ensalada César",
      description: "Fresca ensalada con aderezo cremoso",
      ingredients: ["Lechuga romana", "Crutones", "Queso parmesano", "Pollo a la plancha", "Aderezo césar"],
      instructions: "1. Lavar y cortar la lechuga\n2. Preparar el pollo a la plancha\n3. Mezclar con aderezo\n4. Agregar crutones y queso",
      cookTime: "15 min",
      servings: 1,
      category: "Almuerzo"
    }
  ])

  const [shoppingList, setShoppingList] = useState<ShoppingItem[]>([
    { id: "1", name: "Pasta", completed: false, category: "Pasta y Cereales", quantity: "400g" },
    { id: "2", name: "Huevos", completed: true, category: "Lácteos y Huevos", quantity: "12 unidades", price: "$15.000" },
    { id: "3", name: "Queso parmesano", completed: false, category: "Lácteos y Huevos", quantity: "200g", price: "$25.000" }
  ])

  const [newRecipe, setNewRecipe] = useState({
    name: "",
    description: "",
    ingredients: "",
    instructions: "",
    cookTime: "",
    servings: 1,
    category: "Desayuno"
  })

  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null)
  const [editRecipe, setEditRecipe] = useState({
    name: "",
    description: "",
    ingredients: "",
    instructions: "",
    cookTime: "",
    servings: 1,
    category: "Desayuno"
  })

  const [viewingRecipe, setViewingRecipe] = useState<Recipe | null>(null)
  const [selectedServings, setSelectedServings] = useState<Record<string, number>>({})

  const [newShoppingItem, setNewShoppingItem] = useState("")
  const [newShoppingCategory, setNewShoppingCategory] = useState("Frutas y Verduras")
  const [newShoppingQuantity, setNewShoppingQuantity] = useState("")
  const [newShoppingPrice, setNewShoppingPrice] = useState("")
  const [selectedDays, setSelectedDays] = useState(3)
  const [mealPlan, setMealPlan] = useState<Recipe[]>([])

  // Estados para el AlertDialog
  const [showDuplicateAlert, setShowDuplicateAlert] = useState(false)
  const [duplicateItemName, setDuplicateItemName] = useState("")

  // Categorías predefinidas para la lista de compras
  const shoppingCategories = [
    "Frutas y Verduras",
    "Carnes y Pescados", 
    "Lácteos y Huevos",
    "Pasta y Cereales",
    "Condimentos y Especias",
    "Bebidas",
    "Limpieza",
    "Otros"
  ]

  // Función para validar si un item ya existe usando regex
  const isItemDuplicate = (itemName: string): boolean => {
    const normalizedName = itemName.toLowerCase().trim()
    const regex = new RegExp(`^${normalizedName}$`, 'i')
    return shoppingList.some(item => regex.test(item.name.toLowerCase().trim()))
  }

  // Función para validar que el precio sea un número
  const isValidPrice = (price: string): boolean => {
    if (!price.trim()) return true // Precio opcional
    const priceRegex = /^\$?\d+(?:\.\d+)?(?:,\d{3})*$/
    return priceRegex.test(price.trim())
  }

  // Función para validar campos de receta
  const validateRecipe = (recipe: any): boolean => {
    if (!recipe.name.trim()) {
      toast.error("El nombre de la receta es obligatorio")
      return false
    }
    if (!recipe.ingredients.trim()) {
      toast.error("Los ingredientes son obligatorios")
      return false
    }
    if (!recipe.cookTime.trim()) {
      toast.error("El tiempo de cocción es obligatorio")
      return false
    }
    return true
  }

  // Función para validar campos de lista de compras
  const validateShoppingItem = (item: string, price: string): boolean => {
    if (!item.trim()) {
      toast.error("El nombre del producto es obligatorio")
      return false
    }
    if (!isValidPrice(price)) {
      toast.error("El precio debe ser un número válido (ej: $15.000)")
      return false
    }
    return true
  }

  // Función para calcular ingredientes según el número de personas
  const calculateIngredientsForServings = (ingredients: string[], servings: number): string[] => {
    return ingredients.map(ingredient => {
      // Buscar números en el ingrediente
      const match = ingredient.match(/(\d+(?:\.\d+)?)\s*([a-zA-Z]+)/)
      if (match) {
        const amount = parseFloat(match[1])
        const unit = match[2]
        const newAmount = amount * servings
        return ingredient.replace(match[0], `${newAmount} ${unit}`)
      }
      return ingredient
    })
  }

  // Función para calcular el resumen de ingredientes del plan de menú
  const calculateMealPlanIngredients = (): IngredientSummary[] => {
    const ingredientMap = new Map<string, { quantities: string[], count: number }>()

    mealPlan.forEach(recipe => {
      const servings = selectedServings[recipe.id] || 1
      const calculatedIngredients = calculateIngredientsForServings(recipe.ingredients, servings)
      
      calculatedIngredients.forEach(ingredient => {
        // Extraer el nombre del ingrediente (sin cantidad)
        const nameMatch = ingredient.match(/^(\d+(?:\.\d+)?\s*[a-zA-Z]+\s+)?(.+)$/)
        if (nameMatch) {
          const quantity = nameMatch[1] || ""
          const name = nameMatch[2].trim()
          
          if (ingredientMap.has(name)) {
            ingredientMap.get(name)!.quantities.push(quantity)
            ingredientMap.get(name)!.count++
          } else {
            ingredientMap.set(name, { quantities: [quantity], count: 1 })
          }
        }
      })
    })

    return Array.from(ingredientMap.entries()).map(([name, data]) => ({
      name,
      totalQuantity: data.quantities.filter(q => q).join(" + ") || "Cantidad variable",
      count: data.count
    }))
  }

    const addRecipe = () => {
    if (!validateRecipe(newRecipe)) return

    const recipe: Recipe = {
      id: Date.now().toString(),
      name: newRecipe.name,
      description: newRecipe.description,
      ingredients: newRecipe.ingredients.split(",").map(i => i.trim()),
      instructions: newRecipe.instructions,
      cookTime: newRecipe.cookTime,
      servings: newRecipe.servings,
      category: newRecipe.category
    }
    const updatedRecipes = [...recipes, recipe]
    setRecipes(updatedRecipes)
    saveRecipesToStorage(updatedRecipes)
    setNewRecipe({
      name: "",
      description: "",
      ingredients: "",
      instructions: "",
      cookTime: "",
      servings: 1,
      category: "Desayuno"
    })
    toast.success("¡Receta creada exitosamente!")
  }

  const startEditingRecipe = (recipe: Recipe) => {
    setEditingRecipe(recipe)
    setEditRecipe({
      name: recipe.name,
      description: recipe.description,
      ingredients: recipe.ingredients.join(", "),
      instructions: recipe.instructions,
      cookTime: recipe.cookTime,
      servings: recipe.servings,
      category: recipe.category
    })
  }

  const startViewingRecipe = (recipe: Recipe) => {
    setViewingRecipe(recipe)
    if (!selectedServings[recipe.id]) {
      updateSelectedServings({ ...selectedServings, [recipe.id]: 1 })
    }
  }

  const saveEditedRecipe = () => {
    if (!editingRecipe) return
    if (!validateRecipe(editRecipe)) return

    const updatedRecipe: Recipe = {
      ...editingRecipe,
      name: editRecipe.name,
      description: editRecipe.description,
      ingredients: editRecipe.ingredients.split(",").map(i => i.trim()),
      instructions: editRecipe.instructions,
      cookTime: editRecipe.cookTime,
      servings: editRecipe.servings,
      category: editRecipe.category
    }
    const updatedRecipes = recipes.map(recipe => 
      recipe.id === editingRecipe.id ? updatedRecipe : recipe
    )
    setRecipes(updatedRecipes)
    saveRecipesToStorage(updatedRecipes)
    setEditingRecipe(null)
    setEditRecipe({
      name: "",
      description: "",
      ingredients: "",
      instructions: "",
      cookTime: "",
      servings: 1,
      category: "Desayuno"
    })
    toast.success("¡Receta actualizada exitosamente!")
  }

  const cancelEditing = () => {
    setEditingRecipe(null)
    setEditRecipe({
      name: "",
      description: "",
      ingredients: "",
      instructions: "",
      cookTime: "",
      servings: 1,
      category: "Desayuno"
    })
  }

  const closeViewingRecipe = () => {
    setViewingRecipe(null)
  }

    const addShoppingItem = () => {
    if (!validateShoppingItem(newShoppingItem, newShoppingPrice)) return

    const trimmedItem = newShoppingItem.trim()
    
    // Validar si el item ya existe
    if (isItemDuplicate(trimmedItem)) {
      setDuplicateItemName(trimmedItem)
      setShowDuplicateAlert(true)
      return
    }

    const item: ShoppingItem = {
      id: Date.now().toString(),
      name: trimmedItem,
      completed: false,
      category: newShoppingCategory,
      quantity: newShoppingQuantity.trim() || undefined,
      price: newShoppingPrice.trim() || undefined
    }
    const updatedShoppingList = [...shoppingList, item]
    setShoppingList(updatedShoppingList)
    saveShoppingListToStorage(updatedShoppingList)
    setNewShoppingItem("")
    setNewShoppingQuantity("")
    setNewShoppingPrice("")
    toast.success("¡Producto agregado a la lista!")
  }

  const toggleShoppingItem = (id: string) => {
    const updatedShoppingList = shoppingList.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    )
    setShoppingList(updatedShoppingList)
    saveShoppingListToStorage(updatedShoppingList)
  }

  const removeShoppingItem = (id: string) => {
    const updatedShoppingList = shoppingList.filter(item => item.id !== id)
    setShoppingList(updatedShoppingList)
    saveShoppingListToStorage(updatedShoppingList)
  }

  const uncheckAllItems = () => {
    const updatedShoppingList = shoppingList.map(item => ({ ...item, completed: false }))
    setShoppingList(updatedShoppingList)
    saveShoppingListToStorage(updatedShoppingList)
  }

  const generateRandomMealPlan = () => {
    const shuffled = [...recipes].sort(() => 0.5 - Math.random())
    const newMealPlan = shuffled.slice(0, selectedDays)
    setMealPlan(newMealPlan)
    saveMealPlanToStorage(newMealPlan)
    
    // Inicializar porciones por defecto para las nuevas recetas
    const newServings = { ...selectedServings }
    newMealPlan.forEach(recipe => {
      if (!newServings[recipe.id]) {
        newServings[recipe.id] = 1
      }
    })
    updateSelectedServings(newServings)
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      "Desayuno": "bg-orange-100 text-orange-800",
      "Almuerzo": "bg-green-100 text-green-800",
      "Cena": "bg-blue-100 text-blue-800",
      "Postre": "bg-purple-100 text-purple-800",
      "Snack": "bg-yellow-100 text-yellow-800"
    }
    return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  const getShoppingCategoryColor = (category: string) => {
    const colors = {
      "Frutas y Verduras": "bg-green-100 text-green-800",
      "Carnes y Pescados": "bg-red-100 text-red-800",
      "Lácteos y Huevos": "bg-yellow-100 text-yellow-800",
      "Pasta y Cereales": "bg-orange-100 text-orange-800",
      "Condimentos y Especias": "bg-purple-100 text-purple-800",
      "Bebidas": "bg-blue-100 text-blue-800",
      "Limpieza": "bg-gray-100 text-gray-800",
      "Otros": "bg-pink-100 text-pink-800"
    }
    return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  // Agrupar items por categoría
  const groupedShoppingList = shoppingList.reduce((groups, item) => {
    const category = item.category
    if (!groups[category]) {
      groups[category] = []
    }
    groups[category].push(item)
    return groups
  }, {} as Record<string, ShoppingItem[]>)

  // Contar items completados
  const completedItemsCount = shoppingList.filter(item => item.completed).length

  // Función para cargar datos desde localforage
  const loadDataFromStorage = async () => {
    try {
      const storedRecipes = await localforage.getItem<Recipe[]>('recipes')
      const storedShoppingList = await localforage.getItem<ShoppingItem[]>('shoppingList')
      const storedMealPlan = await localforage.getItem<Recipe[]>('mealPlan')
      const storedSelectedServings = await localforage.getItem<Record<string, number>>('selectedServings')
      
      if (storedRecipes) setRecipes(storedRecipes)
      if (storedShoppingList) setShoppingList(storedShoppingList)
      if (storedMealPlan) setMealPlan(storedMealPlan)
      if (storedSelectedServings) setSelectedServings(storedSelectedServings)
    } catch (error) {
      console.error('Error loading data from storage:', error)
      toast.error('Error al cargar los datos guardados')
    }
  }

  // Función para guardar recetas en localforage
  const saveRecipesToStorage = async (recipes: Recipe[]) => {
    try {
      await localforage.setItem('recipes', recipes)
    } catch (error) {
      console.error('Error saving recipes to storage:', error)
      toast.error('Error al guardar las recetas')
    }
  }

  // Función para guardar lista de compras en localforage
  const saveShoppingListToStorage = async (shoppingList: ShoppingItem[]) => {
    try {
      await localforage.setItem('shoppingList', shoppingList)
    } catch (error) {
      console.error('Error saving shopping list to storage:', error)
      toast.error('Error al guardar la lista de compras')
    }
  }

  // Función para guardar plan de menú en localforage
  const saveMealPlanToStorage = async (mealPlan: Recipe[]) => {
    try {
      await localforage.setItem('mealPlan', mealPlan)
    } catch (error) {
      console.error('Error saving meal plan to storage:', error)
      toast.error('Error al guardar el plan de menú')
    }
  }

  // Función para guardar porciones seleccionadas en localforage
  const saveSelectedServingsToStorage = async (selectedServings: Record<string, number>) => {
    try {
      await localforage.setItem('selectedServings', selectedServings)
    } catch (error) {
      console.error('Error saving selected servings to storage:', error)
      toast.error('Error al guardar las porciones seleccionadas')
    }
  }

  // Función helper para actualizar selectedServings y guardarlo automáticamente
  const updateSelectedServings = (newServings: Record<string, number>) => {
    setSelectedServings(newServings)
    saveSelectedServingsToStorage(newServings)
  }

  // Cargar datos al montar el componente
  useEffect(() => {
    loadDataFromStorage()
  }, [])

  // Calcular ingredientes del plan de menú
  const mealPlanIngredients = calculateMealPlanIngredients()

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <div className="container mx-auto p-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <ChefHat className="w-8 h-8 text-orange-600" />
            <h1 className="text-4xl font-bold text-gray-800">Mi Cocina</h1>
          </div>
          <p className="text-gray-600 text-lg">Organiza tus recetas y lista de compras</p>
        </div>

        <Tabs defaultValue="recipes" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="recipes" className="flex flex-col items-center gap-1 py-3">
              <ChefHat className="w-5 h-5" />
              <span className="text-xs">Recetas</span>
            </TabsTrigger>
            <TabsTrigger value="create" className="flex flex-col items-center gap-1 py-3">
              <Plus className="w-5 h-5" />
              <span className="text-xs">Crear</span>
            </TabsTrigger>
            <TabsTrigger value="planner" className="flex flex-col items-center gap-1 py-3">
              <Calendar className="w-5 h-5" />
              <span className="text-xs">Planificar</span>
            </TabsTrigger>
            <TabsTrigger value="shopping" className="flex flex-col items-center gap-1 py-3">
              <ShoppingCart className="w-5 h-5" />
              <span className="text-xs">Compras</span>
            </TabsTrigger>
          </TabsList>

          {/* Recetas */}
          <TabsContent value="recipes">
            {editingRecipe ? (
              <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-4 mb-6">
                  <Button 
                    onClick={cancelEditing} 
                    variant="outline" 
                    className="flex items-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Volver
                  </Button>
                  <h2 className="text-2xl font-bold text-gray-800">Editando: {editingRecipe.name}</h2>
                </div>
                
                <Card className="border-0 shadow-md">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gray-800">
                      <Edit className="w-5 h-5" />
                      Editar Receta
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">Nombre</label>
                        <Input
                          placeholder="Nombre de la receta"
                          value={editRecipe.name}
                          onChange={(e) => setEditRecipe({...editRecipe, name: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">Categoría</label>
                        <Select value={editRecipe.category} onValueChange={(value) => setEditRecipe({...editRecipe, category: value})}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Desayuno">Desayuno</SelectItem>
                            <SelectItem value="Almuerzo">Almuerzo</SelectItem>
                            <SelectItem value="Cena">Cena</SelectItem>
                            <SelectItem value="Postre">Postre</SelectItem>
                            <SelectItem value="Snack">Snack</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Descripción</label>
                      <Input
                        placeholder="Breve descripción"
                        value={editRecipe.description}
                        onChange={(e) => setEditRecipe({...editRecipe, description: e.target.value})}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">Tiempo de cocción</label>
                        <Input
                          placeholder="ej: 30 min"
                          value={editRecipe.cookTime}
                          onChange={(e) => setEditRecipe({...editRecipe, cookTime: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">Porciones base</label>
                        <Input
                          type="number"
                          min="1"
                          value={editRecipe.servings}
                          onChange={(e) => setEditRecipe({...editRecipe, servings: parseInt(e.target.value)})}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Ingredientes</label>
                      <Textarea
                        placeholder="Separa cada ingrediente con coma (,)"
                        value={editRecipe.ingredients}
                        onChange={(e) => setEditRecipe({...editRecipe, ingredients: e.target.value})}
                        rows={3}
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Instrucciones</label>
                      <Textarea
                        placeholder="Pasos para preparar la receta"
                        value={editRecipe.instructions}
                        onChange={(e) => setEditRecipe({...editRecipe, instructions: e.target.value})}
                        rows={4}
                      />
                    </div>

                    <div className="flex gap-3">
                      <Button onClick={saveEditedRecipe} className="flex-1 bg-orange-600 hover:bg-orange-700">
                        <Edit className="w-4 h-4 mr-2" />
                        Guardar Cambios
                      </Button>
                      <Button onClick={cancelEditing} variant="outline" className="flex-1">
                        Cancelar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : viewingRecipe ? (
              <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-4 mb-6">
                  <Button 
                    onClick={closeViewingRecipe} 
                    variant="outline" 
                    className="flex items-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Volver
                  </Button>
                  <h2 className="text-2xl font-bold text-gray-800">{viewingRecipe.name}</h2>
                </div>
                
                <Card className="border-0 shadow-md">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-xl text-gray-800 mb-2">{viewingRecipe.name}</CardTitle>
                        <CardDescription className="text-gray-600">{viewingRecipe.description}</CardDescription>
                      </div>
                      <Badge className={getCategoryColor(viewingRecipe.category)}>
                        {viewingRecipe.category}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {viewingRecipe.cookTime}
                      </div>
                      <div className="flex items-center gap-2">
                        <label className="text-sm font-medium text-gray-700">Para:</label>
                        <Select 
                          value={(selectedServings[viewingRecipe.id] || 1).toString()} 
                          onValueChange={(value) => updateSelectedServings({ 
                            ...selectedServings, 
                            [viewingRecipe.id]: parseInt(value) 
                          })}
                        >
                          <SelectTrigger className="w-24 h-7 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1 persona</SelectItem>
                            <SelectItem value="2">2 personas</SelectItem>
                            <SelectItem value="3">3 personas</SelectItem>
                            <SelectItem value="4">4 personas</SelectItem>
                            <SelectItem value="6">6 personas</SelectItem>
                            <SelectItem value="8">8 personas</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <Separator className="mb-4" />
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-semibold text-gray-700 mb-2">Ingredientes:</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {calculateIngredientsForServings(
                            viewingRecipe.ingredients, 
                            selectedServings[viewingRecipe.id] || 1
                          ).map((ingredient, index) => (
                            <li key={index} className="flex items-center gap-2">
                              <div className="w-1.5 h-1.5 bg-orange-400 rounded-full" />
                              {ingredient}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-700 mb-2">Preparación:</h4>
                        <p className="text-sm text-gray-600 whitespace-pre-line">{viewingRecipe.instructions}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {recipes.map((recipe) => (
                  <Card key={recipe.id} className="hover:shadow-lg transition-shadow border-0 shadow-md">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-xl text-gray-800 mb-2">{recipe.name}</CardTitle>
                          <CardDescription className="text-gray-600">{recipe.description}</CardDescription>
                        </div>
                        <Badge className={getCategoryColor(recipe.category)}>
                          {recipe.category}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {recipe.cookTime}
                        </div>
                        <div className="flex items-center gap-2">
                          <label className="text-sm font-medium text-gray-700">Para:</label>
                                                      <Select 
                              value={(selectedServings[recipe.id] || 1).toString()} 
                              onValueChange={(value) => updateSelectedServings({ 
                                ...selectedServings, 
                                [recipe.id]: parseInt(value) 
                              })}
                            >
                            <SelectTrigger className="w-24 h-7 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">1 persona</SelectItem>
                              <SelectItem value="2">2 personas</SelectItem>
                              <SelectItem value="3">3 personas</SelectItem>
                              <SelectItem value="4">4 personas</SelectItem>
                              <SelectItem value="6">6 personas</SelectItem>
                              <SelectItem value="8">8 personas</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          onClick={() => startViewingRecipe(recipe)} 
                          variant="outline" 
                          size="sm"
                          className="flex-1"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Ver Receta
                        </Button>
                        <Button 
                          onClick={() => startEditingRecipe(recipe)} 
                          variant="outline" 
                          size="sm"
                          className="flex-1"
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Editar
                        </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            )}
          </TabsContent>

          {/* Crear Receta */}
          <TabsContent value="create">
            <Card className="max-w-2xl mx-auto border-0 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-800">
                  <Plus className="w-5 h-5" />
                  Nueva Receta
                </CardTitle>
                <CardDescription>Agrega una nueva receta a tu colección</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Nombre</label>
                    <Input
                      placeholder="Nombre de la receta"
                      value={newRecipe.name}
                      onChange={(e) => setNewRecipe({...newRecipe, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Categoría</label>
                    <Select value={newRecipe.category} onValueChange={(value) => setNewRecipe({...newRecipe, category: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Desayuno">Desayuno</SelectItem>
                        <SelectItem value="Almuerzo">Almuerzo</SelectItem>
                        <SelectItem value="Cena">Cena</SelectItem>
                        <SelectItem value="Postre">Postre</SelectItem>
                        <SelectItem value="Snack">Snack</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Descripción</label>
                  <Input
                    placeholder="Breve descripción"
                    value={newRecipe.description}
                    onChange={(e) => setNewRecipe({...newRecipe, description: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Tiempo de cocción</label>
                    <Input
                      placeholder="ej: 30 min"
                      value={newRecipe.cookTime}
                      onChange={(e) => setNewRecipe({...newRecipe, cookTime: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Porciones base</label>
                    <Input
                      type="number"
                      min="1"
                      value={newRecipe.servings}
                      onChange={(e) => setNewRecipe({...newRecipe, servings: parseInt(e.target.value)})}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Ingredientes</label>
                  <Textarea
                    placeholder="Separa cada ingrediente con coma (,)"
                    value={newRecipe.ingredients}
                    onChange={(e) => setNewRecipe({...newRecipe, ingredients: e.target.value})}
                    rows={3}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Instrucciones</label>
                  <Textarea
                    placeholder="Pasos para preparar la receta"
                    value={newRecipe.instructions}
                    onChange={(e) => setNewRecipe({...newRecipe, instructions: e.target.value})}
                    rows={4}
                  />
                </div>

                <Button onClick={addRecipe} className="w-full bg-orange-600 hover:bg-orange-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Agregar Receta
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Planificador */}
          <TabsContent value="planner">
            <div className="max-w-4xl mx-auto space-y-6">
              <Card className="border-0 shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-800">
                    <Shuffle className="w-5 h-5" />
                    Planificador de Menús
                  </CardTitle>
                  <CardDescription>Genera un plan de comidas aleatorio</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 mb-4">
                    <label className="text-sm font-medium text-gray-700">Planificar para:</label>
                    <Select value={selectedDays.toString()} onValueChange={(value) => setSelectedDays(parseInt(value))}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3">3 días</SelectItem>
                        <SelectItem value="5">5 días</SelectItem>
                        <SelectItem value="7">1 semana</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button onClick={generateRandomMealPlan} className="bg-orange-600 hover:bg-orange-700">
                      <Shuffle className="w-4 h-4 mr-2" />
                      Generar Plan
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {mealPlan.length > 0 && (
                <>
                <div className="grid gap-4">
                  <h3 className="text-xl font-semibold text-gray-800">Tu Plan de Menú</h3>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {mealPlan.map((recipe, index) => (
                      <Card key={recipe.id} className="border-0 shadow-md">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <Badge variant="outline" className="text-orange-600 border-orange-600">
                              Día {index + 1}
                            </Badge>
                            <Badge className={getCategoryColor(recipe.category)}>
                              {recipe.category}
                            </Badge>
                          </div>
                          <CardTitle className="text-lg">{recipe.name}</CardTitle>
                          <CardDescription>{recipe.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {recipe.cookTime}
                            </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <label className="text-sm font-medium text-gray-700">Para:</label>
                              <Select 
                                value={(selectedServings[recipe.id] || 1).toString()} 
                                onValueChange={(value) => updateSelectedServings({ 
                                  ...selectedServings, 
                                  [recipe.id]: parseInt(value) 
                                })}
                              >
                                <SelectTrigger className="w-24 h-7 text-xs">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="1">1 persona</SelectItem>
                                  <SelectItem value="2">2 personas</SelectItem>
                                  <SelectItem value="3">3 personas</SelectItem>
                                  <SelectItem value="4">4 personas</SelectItem>
                                  <SelectItem value="6">6 personas</SelectItem>
                                  <SelectItem value="8">8 personas</SelectItem>
                                </SelectContent>
                              </Select>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                  {/* Resumen de ingredientes */}
                  <Card className="border-0 shadow-md">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-gray-800">
                        <Package className="w-5 h-5" />
                        Resumen de Productos Estimados
                      </CardTitle>
                      <CardDescription>
                        Cantidad total de ingredientes necesarios para tu plan de menú
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {mealPlanIngredients.length > 0 ? (
                        <Accordion type="single" collapsible className="w-full">
                          <AccordionItem value="ingredients">
                            <AccordionTrigger className="text-left">
                              <div className="flex items-center gap-2">
                                <Package className="w-4 h-4" />
                                <span>Ver {mealPlanIngredients.length} productos necesarios</span>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent>
                              <div className="space-y-3">
                                {mealPlanIngredients.map((ingredient, index) => (
                                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                      <div className="w-2 h-2 bg-orange-400 rounded-full" />
                                      <span className="font-medium text-gray-800">{ingredient.name}</span>
                                      {ingredient.count > 1 && (
                                        <Badge variant="outline" className="text-xs">
                                          {ingredient.count} recetas
                                        </Badge>
                                      )}
                                    </div>
                                    <span className="text-sm text-gray-600 font-medium">
                                      {ingredient.totalQuantity}
                                    </span>
                                  </div>
                                ))}
                                <div className="mt-4 p-3 bg-orange-50 rounded-lg">
                                  <p className="text-sm text-orange-800">
                                    <strong>Total:</strong> {mealPlanIngredients.length} productos diferentes
                                  </p>
                                </div>
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      ) : (
                        <div className="text-center py-4 text-gray-500">
                          <Package className="w-8 h-8 mx-auto mb-2 opacity-50" />
                          <p>No hay ingredientes para mostrar</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </>
              )}
            </div>
          </TabsContent>

          {/* Lista de Compras */}
          <TabsContent value="shopping">
            <Card className="max-w-4xl mx-auto border-0 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-800">
                  <ShoppingCart className="w-5 h-5" />
                  Lista de Compras
                </CardTitle>
                <CardDescription>Organiza lo que necesitas comprar por categorías</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Formulario para agregar items */}
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Producto</label>
                  <Input
                    placeholder="Agregar producto..."
                    value={newShoppingItem}
                    onChange={(e) => setNewShoppingItem(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addShoppingItem()}
                  />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Categoría</label>
                      <Select value={newShoppingCategory} onValueChange={(value) => setNewShoppingCategory(value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {shoppingCategories.map(category => (
                            <SelectItem key={category} value={category}>{category}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Cantidad (opcional)</label>
                      <Input
                        placeholder="ej: 2 kg, 500g, 1 docena..."
                        value={newShoppingQuantity}
                        onChange={(e) => setNewShoppingQuantity(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Precio estimado (opcional)</label>
                      <Input
                        placeholder="ej: $15.000, $25.500..."
                        value={newShoppingPrice}
                        onChange={(e) => setNewShoppingPrice(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <Button onClick={addShoppingItem} className="w-full bg-orange-600 hover:bg-orange-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Agregar a la Lista
                  </Button>
                </div>

                {/* Lista organizada por categorías */}
                {Object.keys(groupedShoppingList).length > 0 ? (
                  <div className="space-y-6">
                    {/* Botón para desmarcar todos */}
                    {completedItemsCount > 0 && (
                      <div className="flex justify-end">
                        <Button 
                          onClick={uncheckAllItems} 
                          variant="outline" 
                          size="sm"
                          className="text-gray-600 hover:text-gray-800"
                        >
                          <RotateCcw className="w-4 h-4 mr-2" />
                          Desmarcar Todos ({completedItemsCount})
                        </Button>
                      </div>
                    )}
                    
                    {Object.entries(groupedShoppingList).map(([category, items]) => (
                      <div key={category} className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Tag className="w-4 h-4 text-gray-600" />
                          <h3 className="font-semibold text-gray-800">{category}</h3>
                          <Badge className={getShoppingCategoryColor(category)}>
                            {items.length} {items.length === 1 ? 'item' : 'items'}
                          </Badge>
                        </div>
                <div className="space-y-2">
                          {items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <button
                        onClick={() => toggleShoppingItem(item.id)}
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                          item.completed 
                            ? "bg-green-500 border-green-500 text-white" 
                            : "border-gray-300 hover:border-green-400"
                        }`}
                      >
                        {item.completed && <Check className="w-3 h-3" />}
                      </button>
                              <div className="flex-1">
                                <span className={`block ${item.completed ? "line-through text-gray-500" : "text-gray-800"}`}>
                        {item.name}
                      </span>
                                {(item.quantity || item.price) && (
                                  <div className="flex gap-2 mt-1 text-xs text-gray-500">
                                    {item.quantity && (
                                      <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">
                                        {item.quantity}
                                      </span>
                                    )}
                                    {item.price && (
                                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded">
                                        {item.price}
                                      </span>
                                    )}
                                  </div>
                                )}
                              </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeShoppingItem(item.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <ShoppingCart className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Tu lista de compras está vacía</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* AlertDialog para duplicados */}
        <AlertDialog open={showDuplicateAlert} onOpenChange={setShowDuplicateAlert}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-500" />
                Producto Duplicado
              </AlertDialogTitle>
              <AlertDialogDescription>
                El producto <strong>"{duplicateItemName}"</strong> ya está en tu lista de compras. 
                No se pueden agregar productos duplicados.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Entendido</AlertDialogCancel>
              <AlertDialogAction onClick={() => setShowDuplicateAlert(false)}>
                Aceptar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        
        {/* Toaster para notificaciones */}
        <Toaster />
        
        {/* Registrar PWA */}
        <PWARegister />
      </div>
    </div>
  )
}
