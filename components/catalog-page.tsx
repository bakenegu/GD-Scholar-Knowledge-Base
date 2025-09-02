"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { getPrograms, type Program } from "@/lib/data"

interface CatalogPageProps {
  isGuest: boolean
  onLogout: () => void
}

type Product = Program

// Helper function to filter products
const getFilteredProducts = (products: Product[], filters: {
  searchTerm: string;
  selectedCategory: string;
  priceRange: [number, number];
  destination: string;
  studyLevel: string;
  fieldOfStudy: string;
  ieltsRequired: boolean | 'All';
}) => {
  const {
    searchTerm,
    selectedCategory,
    priceRange,
    destination,
    studyLevel,
    fieldOfStudy,
    ieltsRequired,
  } = filters;

  return products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" || product.category === selectedCategory;

    const productPrice = parseFloat(product.price.replace(/[^0-9.-]+/g, ""));
    const matchesPrice =
      productPrice >= priceRange[0] && productPrice <= priceRange[1];

    const matchesDestination =
      destination === "All" || product.destination === destination;
    const matchesStudyLevel =
      studyLevel === "All" || product.studyLevel === studyLevel;
    const matchesFieldOfStudy =
      fieldOfStudy === "All" || product.fieldOfStudy === fieldOfStudy;
    const matchesIelts =
      ieltsRequired === "All" ||
      (ieltsRequired === true && product.ieltsRequired) ||
      (ieltsRequired === false && !product.ieltsRequired);

    return (
      matchesSearch &&
      matchesCategory &&
      matchesPrice &&
      matchesDestination &&
      matchesStudyLevel &&
      matchesFieldOfStudy &&
      matchesIelts
    );
  });
};

// Categories for filtering
const categories = ["All", "Electronics", "Wearables", "Furniture", "Photography", "Lighting"]

// Price range for slider
const priceRanges = [
  { label: "Under $100", value: [0, 100] },
  { label: "$100 - $200", value: [100, 200] },
  { label: "$200 - $500", value: [200, 500] },
  { label: "Over $500", value: [500, 10000] },
]

export function CatalogPage({ isGuest, onLogout }: CatalogPageProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000])
  const [programs, setPrograms] = useState<Product[]>([])
  
  // Filter states
  const [destination, setDestination] = useState("All")
  const [studyLevel, setStudyLevel] = useState("All")
  const [fieldOfStudy, setFieldOfStudy] = useState("All")
  const [ieltsRequired, setIeltsRequired] = useState<boolean | "All">("All")
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  useEffect(() => {
    setPrograms(getPrograms())
  }, [])

  const filteredProducts = getFilteredProducts(programs, {
    searchTerm,
    selectedCategory,
    priceRange,
    destination,
    studyLevel,
    fieldOfStudy,
    ieltsRequired,
  });

  // Group by destination (country)
  const groups = filteredProducts.reduce<Record<string, Product[]>>((acc, p) => {
    const key = p.destination || 'Other'
    if (!acc[key]) acc[key] = []
    acc[key].push(p)
    return acc
  }, {})

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border/50 sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 w-full">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 max-w-7xl">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold">GD Scholar Knowledge Base</h1>
            {isGuest && (
              <Badge variant="outline" className="bg-secondary/50">Guest Mode</Badge>
            )}
          </div>
          <Button variant="outline" onClick={onLogout} size="sm">
            {isGuest ? "Exit Guest" : "Logout"}
          </Button>
        </div>
      </header>

      <main className="flex-1 w-full py-8">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold tracking-tight text-foreground">Education Programs</h1>
            <p className="text-muted-foreground mt-3 text-lg">Find your perfect study program abroad</p>
          </div>

          {/* Filter Section */}
          <div className="mb-12 p-6 bg-muted/10 rounded-lg border border-border/30 shadow-sm">
            <h2 className="text-lg font-semibold mb-6">Filter Programs</h2>

            {/* First Row of Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              {/* Search Input */}
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

              {/* Destination Filter */}
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

              {/* Study Level Filter */}
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
                    <SelectItem value="PhD">PhD</SelectItem>
                    <SelectItem value="Diploma">Diploma</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Field of Study */}
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
                    <SelectItem value="Engineering">Engineering</SelectItem>
                    <SelectItem value="Medicine">Medicine</SelectItem>
                    <SelectItem value="Arts">Arts & Humanities</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Second Row of Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-end">
              {/* IELTS Required */}
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

              {/* Price Range Filter */}
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

              {/* Clear Filters Button */}
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

          {/* Results grouped by Destination */}
          <div className="mb-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-foreground">Available Programs</h2>
              <p className="text-sm text-muted-foreground">
                Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'program' : 'programs'}
              </p>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="text-center py-12 border rounded-lg">
                <p className="text-muted-foreground">No products match your filters</p>
                <Button
                  variant="ghost"
                  className="mt-4"
                  onClick={() => {
                    setSearchTerm('')
                    setSelectedCategory('All')
                    setPriceRange([0, 1000])
                  }}
                >
                  Clear filters
                </Button>
              </div>
            ) : (
              <div className="space-y-10">
                {Object.entries(groups).map(([country, items]) => (
                  <section key={country} className="w-full">
                    <div className="flex items-baseline justify-between mb-3">
                      <h3 className="text-base font-semibold">{country}</h3>
                      <span className="text-xs text-muted-foreground">{items.length} {items.length === 1 ? 'program' : 'programs'}</span>
                    </div>
                    <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                      {items.map((product) => (
                        <Card key={product.id} className="group overflow-hidden hover:shadow-md transition-shadow w-[260px] shrink-0 snap-start">
                          <div className="aspect-square overflow-hidden bg-muted/20">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          </div>
                          <CardContent className="p-3 space-y-2">
                            <div className="flex justify-between items-start">
                              <h4 className="font-semibold text-base leading-snug line-clamp-2">{product.name}</h4>
                              <Badge variant="secondary" className="text-[10px] px-2 py-0">{product.category}</Badge>
                            </div>
                            <p className="text-muted-foreground text-xs line-clamp-2">
                              {product.description}
                            </p>
                            <div className="flex items-center justify-between mt-1">
                              <span className="font-bold text-sm">{product.price}</span>
                              <div className="flex items-center space-x-2">
                                <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                                  {product.destination}
                                </Badge>
                                <Badge variant={product.ieltsRequired ? 'default' : 'outline'} className="text-[10px] px-1.5 py-0">
                                  {product.ieltsRequired ? 'IELTS Req.' : 'No IELTS'}
                                </Badge>
                              </div>
                            </div>
                            <Button
                              className="w-full mt-2"
                              variant="outline"
                              onClick={() => {
                                setSelectedProduct(product)
                                setDetailsOpen(true)
                              }}
                            >
                              Read more
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            )}

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
        </div>
      </main>

      {/* Details Dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {(selectedProduct?.destination || 'Destination')} — {(selectedProduct?.studyLevel || selectedProduct?.category || 'Level')}
            </DialogTitle>
            <DialogDescription>
              {selectedProduct?.name}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Overview */}
            <section>
              <h3 className="text-sm font-semibold mb-2">Overview</h3>
              <p className="text-sm text-muted-foreground">
                {selectedProduct?.description}
              </p>
            </section>

            {/* Key Requirements */}
            <section>
              <h3 className="text-sm font-semibold mb-2">Key Requirements</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                <li>Study level: {selectedProduct?.studyLevel || selectedProduct?.category}</li>
                <li>Field of study: {selectedProduct?.fieldOfStudy || 'N/A'}</li>
                <li>IELTS: {selectedProduct?.ieltsRequired ? 'Required' : 'Not required'}</li>
                <li>Destination: {selectedProduct?.destination || 'Varies'}</li>
              </ul>
            </section>

            {/* Typical Intakes / Deadlines */}
            <section>
              <h3 className="text-sm font-semibold mb-2">Typical Intakes / Deadlines</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                <li>Fall (Sep) — Applications Jan–May</li>
                <li>Spring (Jan) — Applications Aug–Oct</li>
              </ul>
            </section>

            {/* Cost Snapshot */}
            <section>
              <h3 className="text-sm font-semibold mb-2">Cost Snapshot</h3>
              <p className="text-sm text-muted-foreground">Tuition: {selectedProduct?.price}</p>
            </section>

            {/* Notes / Tips */}
            <section>
              <h3 className="text-sm font-semibold mb-2">Notes / Tips</h3>
              <p className="text-sm text-muted-foreground">
                Check departmental pages for scholarship opportunities and program-specific prerequisites.
              </p>
            </section>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setDetailsOpen(false)
              }}
            >
              Back to results
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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

