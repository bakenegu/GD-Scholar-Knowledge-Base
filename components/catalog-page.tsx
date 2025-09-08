"use client"

import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { getDestinations, type Destination } from "@/lib/data"
import { Checkbox } from "@/components/ui/checkbox"

interface CatalogPageProps {
  isGuest: boolean
  onLogout: () => void
}

type Item = Destination

// Helper function to filter destinations
const getFilteredDestinations = (items: Item[], filters: {
  searchTerm: string;
  country: string;
  documents: string[];
  visas: string[];
  exams: string[];
}) => {
  const { searchTerm, country, documents, visas, exams } = filters
  return items.filter((d) => {
    const searchSpace = `${d.country} ${d.whyThisDestination} ${d.opportunitiesWhileStudying} ${d.opportunitiesAfterGraduation}`.toLowerCase()
    const matchesSearch = !searchTerm || searchSpace.includes(searchTerm.toLowerCase())
    const matchesCountry = country === 'All' || d.country === country
    const matchesDocs = documents.length === 0 || documents.every(val => d.documentsRequired.includes(val))
    const matchesVisa = visas.length === 0 || visas.every(val => d.visaRequirements.includes(val))
    const matchesExams = exams.length === 0 || exams.every(val => d.internationalExamRequirements.includes(val))
    return matchesSearch && matchesCountry && matchesDocs && matchesVisa && matchesExams
  })
}

// (removed legacy constants for product catalog filtering)

export function CatalogPage({ isGuest, onLogout }: CatalogPageProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [destinations, setDestinations] = useState<Item[]>([])

  // Filter states
  const [country, setCountry] = useState("All")
  const [docFilter, setDocFilter] = useState<string[]>([])
  const [visaFilter, setVisaFilter] = useState<string[]>([])
  const [examFilter, setExamFilter] = useState<string[]>([])
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<Item | null>(null)

  useEffect(() => {
    setDestinations(getDestinations())
  }, [])

  const allCountries = useMemo(() => {
    const set = new Set(destinations.map(d => d.country))
    return ['All', ...Array.from(set)]
  }, [destinations])

  const uniqueDocs = useMemo(() => Array.from(new Set(destinations.flatMap(d => d.documentsRequired))), [destinations])
  const uniqueVisas = useMemo(() => Array.from(new Set(destinations.flatMap(d => d.visaRequirements))), [destinations])
  const uniqueExams = useMemo(() => Array.from(new Set(destinations.flatMap(d => d.internationalExamRequirements))), [destinations])

  const filtered = getFilteredDestinations(destinations, {
    searchTerm,
    country,
    documents: docFilter,
    visas: visaFilter,
    exams: examFilter,
  })

  const groups = filtered.reduce<Record<string, Item[]>>((acc, d) => {
    const key = d.country
    if (!acc[key]) acc[key] = []
    acc[key].push(d)
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
            <h1 className="text-4xl font-bold tracking-tight text-foreground">Study Destinations</h1>
            <p className="text-muted-foreground mt-3 text-lg">Discover countries and their study opportunities</p>
          </div>

          {/* Filter Section */}
          <div className="mb-12 p-6 bg-muted/10 rounded-lg border border-border/30 shadow-sm">
            <h2 className="text-lg font-semibold mb-6">Filter Destinations</h2>

            {/* First Row of Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              {/* Search Input */}
              <div className="space-y-2">
                <Label htmlFor="search" className="text-sm font-medium">Search</Label>
                <Input
                  id="search"
                  placeholder="Search destinations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-background"
                />
              </div>

              {/* Country Filter */}
              <div className="space-y-2">
                <Label htmlFor="country" className="text-sm font-medium">Country</Label>
                <Select value={country} onValueChange={setCountry}>
                  <SelectTrigger className="w-full bg-background">
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    {allCountries.map(c => (
                      <SelectItem key={c} value={c}>{c === 'All' ? 'All Countries' : c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {/* Placeholder to keep grid even */}
              <div />
            </div>

            {/* Second Row of Filters: multi-select via checkboxes */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
              {/* Documents Required */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Documents required</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-44 overflow-auto pr-1">
                  {uniqueDocs.map((d) => (
                    <label key={d} className="flex items-center gap-2 text-sm">
                      <Checkbox
                        checked={docFilter.includes(d)}
                        onCheckedChange={(v) => {
                          const checked = v === true
                          setDocFilter(prev => checked ? [...prev, d] : prev.filter(x => x !== d))
                        }}
                      />
                      {d}
                    </label>
                  ))}
                </div>
              </div>

              {/* Visa Requirements */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Visa requirements</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-44 overflow-auto pr-1">
                  {uniqueVisas.map((v) => (
                    <label key={v} className="flex items-center gap-2 text-sm">
                      <Checkbox
                        checked={visaFilter.includes(v)}
                        onCheckedChange={(c) => {
                          const checked = c === true
                          setVisaFilter(prev => checked ? [...prev, v] : prev.filter(x => x !== v))
                        }}
                      />
                      {v}
                    </label>
                  ))}
                </div>
              </div>

              {/* International Exams */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">International exams</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-44 overflow-auto pr-1">
                  {uniqueExams.map((e) => (
                    <label key={e} className="flex items-center gap-2 text-sm">
                      <Checkbox
                        checked={examFilter.includes(e)}
                        onCheckedChange={(c) => {
                          const checked = c === true
                          setExamFilter(prev => checked ? [...prev, e] : prev.filter(x => x !== e))
                        }}
                      />
                      {e}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Clear Filters Button */}
            <div className="flex items-end mt-6">
              <Button
                variant="outline"
                className="w-full md:w-auto"
                onClick={() => {
                  setSearchTerm("")
                  setCountry("All")
                  setDocFilter([])
                  setVisaFilter([])
                  setExamFilter([])
                }}
              >
                Clear All Filters
              </Button>
            </div>
          </div>

          {/* Results grouped by Country */}
          <div className="mb-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-foreground">Available Destinations</h2>
              <p className="text-sm text-muted-foreground">
                Showing {filtered.length} {filtered.length === 1 ? 'destination' : 'destinations'}
              </p>
            </div>

            {filtered.length === 0 ? (
              <div className="text-center py-12 border rounded-lg">
                <p className="text-muted-foreground">No products match your filters</p>
                <Button
                  variant="ghost"
                  className="mt-4"
                  onClick={() => {
                    setSearchTerm('')
                    setCountry('All')
                    setDocFilter([])
                    setVisaFilter([])
                    setExamFilter([])
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
                      <span className="text-xs text-muted-foreground">{items.length} {items.length === 1 ? 'destination' : 'destinations'}</span>
                    </div>
                    <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                      {items.map((item) => (
                        <Card key={item.id} className="group overflow-hidden hover:shadow-md transition-shadow w-[260px] shrink-0 snap-start">
                          <div className="aspect-square overflow-hidden bg-muted/20">
                            <div className="w-full h-full flex items-center justify-center text-6xl">🌍</div>
                          </div>
                          <CardContent className="p-3 space-y-2">
                            <div className="flex justify-between items-start">
                              <h4 className="font-semibold text-base leading-snug line-clamp-2">{item.country}</h4>
                              <Badge variant="secondary" className="text-[10px] px-2 py-0">Destination</Badge>
                            </div>
                            <p className="text-muted-foreground text-xs line-clamp-2">
                              {item.whyThisDestination}
                            </p>
                            <div className="flex items-center justify-between mt-1">
                              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                                <span>{item.documentsRequired.length} docs</span>
                                <span>• {item.visaRequirements.length} visa</span>
                                <span>• {item.internationalExamRequirements.length} exams</span>
                              </div>
                            </div>
                            <Button
                              className="w-full mt-2"
                              variant="outline"
                              onClick={() => {
                                setSelectedItem(item)
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
              {selectedItem?.country}
            </DialogTitle>
            <DialogDescription>
              Why this destination
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Basic Info */}
            <section>
              <h3 className="text-sm font-semibold mb-2">Basic Info</h3>
              <div className="space-y-4 text-sm text-muted-foreground">
                <div>
                  <p className="font-medium text-foreground mb-1">Why this destination</p>
                  <p>{selectedItem?.whyThisDestination}</p>
                </div>
                <div>
                  <p className="font-medium text-foreground mb-1">Opportunities while studying</p>
                  <p>{selectedItem?.opportunitiesWhileStudying}</p>
                </div>
                <div>
                  <p className="font-medium text-foreground mb-1">Opportunities after graduation</p>
                  <p>{selectedItem?.opportunitiesAfterGraduation}</p>
                </div>
              </div>
            </section>

            {/* Admission Requirements */}
            <section>
              <h3 className="text-sm font-semibold mb-2">Admission Requirements</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="font-medium mb-2">Documents required</p>
                  <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                    {selectedItem?.documentsRequired.map((d, i) => (<li key={i}>{d}</li>))}
                  </ul>
                </div>
                <div>
                  <p className="font-medium mb-2">Visa requirements</p>
                  <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                    {selectedItem?.visaRequirements.map((v, i) => (<li key={i}>{v}</li>))}
                  </ul>
                </div>
                <div>
                  <p className="font-medium mb-2">International exams</p>
                  <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                    {selectedItem?.internationalExamRequirements.map((e, i) => (<li key={i}>{e}</li>))}
                  </ul>
                </div>
              </div>
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
          <p className="text-center text-sm text-muted-foreground">© {new Date().getFullYear()} Scholar Catalog. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

