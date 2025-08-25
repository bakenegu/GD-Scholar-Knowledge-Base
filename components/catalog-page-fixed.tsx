"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

interface CatalogPageProps {
  isGuest: boolean
  onLogout: () => void
}

interface Product {
  id: number
  name: string
  price: string
  image: string
  description: string
  category: string
  rating: number
  destination?: string
  studyLevel?: string
  fieldOfStudy?: string
  ieltsRequired?: boolean
}

// Sample product data
const products: Product[] = [
  {
    id: 1,
    name: "Computer Science BSc - USA",
    price: "$25,000",
    image: "/placeholder-logo.png",
    description: "Bachelor's degree in Computer Science with focus on software engineering",
    category: "Undergraduate",
    rating: 4.8,
    destination: "USA",
    studyLevel: "Undergraduate",
    fieldOfStudy: "Computer Science",
    ieltsRequired: true
  },
  {
    id: 2,
    name: "MBA Program - UK",
    price: "$35,000",
    image: "/placeholder-logo.png",
    description: "Master of Business Administration at a top UK university",
    category: "Postgraduate",
    rating: 4.7,
    destination: "UK",
    studyLevel: "Postgraduate",
    fieldOfStudy: "Business",
    ieltsRequired: true
  }
]

export function CatalogPage({ isGuest, onLogout }: CatalogPageProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000])
  const [destination, setDestination] = useState("All")
  const [studyLevel, setStudyLevel] = useState("All")
  const [fieldOfStudy, setFieldOfStudy] = useState("All")
  const [ieltsRequired, setIeltsRequired] = useState<boolean | "All">("All")

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory
    const productPrice = parseFloat(product.price.replace(/[^0-9.-]+/g, ""))
    const matchesPrice = productPrice >= priceRange[0] && productPrice <= priceRange[1]
    const matchesDestination = destination === "All" || product.destination === destination
    const matchesStudyLevel = studyLevel === "All" || product.studyLevel === studyLevel
    const matchesFieldOfStudy = fieldOfStudy === "All" || product.fieldOfStudy === fieldOfStudy
    const matchesIelts = ieltsRequired === "All" || 
                        (ieltsRequired === true && product.ieltsRequired) ||
                        (ieltsRequired === false && !product.ieltsRequired)
    
    return matchesSearch && matchesCategory && matchesPrice && 
           matchesDestination && matchesStudyLevel && 
           matchesFieldOfStudy && matchesIelts
  })

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border/50 sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 w-full">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 max-w-7xl">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold">Scholar Catalog</h1>
            {isGuest && (
              <Badge variant="outline" className="bg-secondary/50">
                Guest Mode
              </Badge>
            )}
          </div>
          <Button variant="outline" onClick={onLogout} size="sm">
            {isGuest ? "Exit Guest" : "Logout"}
          </Button>
        </div>
      </header>

      <main className="flex-1">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold tracking-tight">Education Programs</h1>
            <p className="text-muted-foreground mt-3 text-lg">Find your perfect study program abroad</p>
          </div>

          <div className="mb-12 p-6 bg-muted/10 rounded-lg border border-border/30 shadow-sm">
            <h2 className="text-lg font-semibold mb-6">Filter Programs</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <div className="space-y-2">
                <Label htmlFor="search" className="text-sm font-medium">Search</Label>
                <Input
                  id="search"
                  placeholder="Search programs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-background"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="destination" className="text-sm font-medium">Destination</Label>
                <Select value={destination} onValueChange={setDestination}>
                  <SelectTrigger className="w-full bg-background">
                    <SelectValue placeholder="Select destination" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Destinations</SelectItem>
                    <SelectItem value="USA">United States</SelectItem>
                    <SelectItem value="UK">United Kingdom</SelectItem>
                    <SelectItem value="Canada">Canada</SelectItem>
                    <SelectItem value="Australia">Australia</SelectItem>
                    <SelectItem value="Germany">Germany</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="study-level" className="text-sm font-medium">Study Level</Label>
                <Select value={studyLevel} onValueChange={setStudyLevel}>
                  <SelectTrigger className="w-full bg-background">
                    <SelectValue placeholder="Select study level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Levels</SelectItem>
                    <SelectItem value="Undergraduate">Undergraduate</SelectItem>
                    <SelectItem value="Postgraduate">Postgraduate</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="field-of-study" className="text-sm font-medium">Field of Study</Label>
                <Select value={fieldOfStudy} onValueChange={setFieldOfStudy}>
                  <SelectTrigger className="w-full bg-background">
                    <SelectValue placeholder="Select field" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Fields</SelectItem>
                    <SelectItem value="Computer Science">Computer Science</SelectItem>
                    <SelectItem value="Business">Business</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-end">
              <div className="space-y-2">
                <Label htmlFor="ielts-required" className="text-sm font-medium">IELTS Required</Label>
                <Select 
                  value={ieltsRequired === "All" ? "All" : ieltsRequired ? "Yes" : "No"}
                  onValueChange={(value) => {
                    if (value === "All") setIeltsRequired("All")
                    else setIeltsRequired(value === "Yes")
                  }}
                >
                  <SelectTrigger className="w-full bg-background">
                    <SelectValue placeholder="IELTS requirement" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">Any</SelectItem>
                    <SelectItem value="Yes">Yes</SelectItem>
                    <SelectItem value="No">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Max Tuition Fee (USD)</Label>
                <div className="px-2">
                  <Slider
                    value={[priceRange[1]]}
                    onValueChange={(value) => setPriceRange([0, value[0]])}
                    min={0}
                    max={50000}
                    step={1000}
                    className="py-4"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>${priceRange[0].toLocaleString()}</span>
                    <span>${priceRange[1].toLocaleString()}+</span>
                  </div>
                </div>
              </div>

              <div className="flex items-end">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => {
                    setSearchTerm("")
                    setSelectedCategory("All")
                    setDestination("All")
                    setStudyLevel("All")
                    setFieldOfStudy("All")
                    setIeltsRequired("All")
                    setPriceRange([0, 50000])
                  }}
                >
                  Clear All Filters
                </Button>
              </div>
            </div>
          </div>

          <div className="mb-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Available Programs</h2>
              <p className="text-sm text-muted-foreground">
                Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'program' : 'programs'}
              </p>
            </div>
            
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12 border rounded-lg">
                <p className="text-muted-foreground">No programs match your filters</p>
                <Button 
                  variant="ghost" 
                  className="mt-4"
                  onClick={() => {
                    setSearchTerm('')
                    setSelectedCategory('All')
                    setDestination('All')
                    setStudyLevel('All')
                    setFieldOfStudy('All')
                    setIeltsRequired('All')
                    setPriceRange([0, 50000])
                  }}
                >
                  Clear filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <Card key={product.id} className="group overflow-hidden hover:shadow-md transition-shadow">
                    <div className="aspect-square overflow-hidden bg-muted/20">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-lg">{product.name}</h3>
                        <Badge variant="secondary">{product.category}</Badge>
                      </div>
                      <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
                        {product.description}
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="font-bold">{product.price}</span>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="text-xs">
                            {product.destination}
                          </Badge>
                          <Badge variant={product.ieltsRequired ? 'default' : 'outline'} className="text-xs">
                            {product.ieltsRequired ? 'IELTS Req.' : 'No IELTS'}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
          
          {isGuest && (
            <div className="mt-12 border-t pt-8 w-full">
              <div className="max-w-2xl mx-auto text-center bg-muted/50 p-6 rounded-lg">
                <h3 className="text-lg font-medium mb-2">Want full access to all features?</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Create an account to save your favorites, track orders, and enjoy exclusive member benefits.
                </p>
                <Button className="w-full sm:w-auto">
                  Create Account
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
      
      <footer className="border-t py-6 mt-auto w-full">
        <div className="container mx-auto px-4 max-w-7xl">
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} Scholar Catalog. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
