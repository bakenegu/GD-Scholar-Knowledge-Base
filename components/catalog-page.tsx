"use client"

import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { getDestinations, type Destination } from "@/lib/data"
import { MarkdownRenderer } from "@/components/markdown-renderer"

interface CatalogPageProps {
  isGuest: boolean
  onLogout: () => void
}

type Item = Destination

// Helper function to filter destinations by country and study level
const getFilteredDestinations = (
  items: Item[],
  filters: {
    country: string
    studyLevel: 'All' | 'Undergraduate' | 'Postgraduate'
  }
) => {
  const { country, studyLevel } = filters
  return items.filter((d) => {
    const matchesCountry = country === 'All' || d.country === country
    const matchesLevel = studyLevel === 'All' || d.studyLevel === studyLevel
    return matchesCountry && matchesLevel
  })
}

// (removed legacy constants for product catalog filtering)

export function CatalogPage({ isGuest, onLogout }: CatalogPageProps) {
  const [destinations, setDestinations] = useState<Item[]>([])

  // Filter states
  const [country, setCountry] = useState("All")
  const [studyLevel, setStudyLevel] = useState<'All' | 'Undergraduate' | 'Postgraduate'>("All")
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<Item | null>(null)

  useEffect(() => {
    setDestinations(getDestinations())
  }, [])

  const allCountries = useMemo(() => {
    const set = new Set(destinations.map(d => d.country))
    return ['All', ...Array.from(set)]
  }, [destinations])

  const filtered = getFilteredDestinations(destinations, {
    country,
    studyLevel,
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
        <div className="container mx-auto flex h-16 items-center justify-between px-6 lg:px-8 max-w-[1600px]">
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

      <main className="flex-1 w-full py-10">
        <div className="container mx-auto px-6 lg:px-10 max-w-[1600px]">
          <div className="text-center mb-12">
            <h1 className="text-4xl lg:text-5xl font-bold tracking-tight text-foreground leading-tight">Study Destinations</h1>
            <p className="text-muted-foreground mt-3 text-lg leading-relaxed">Discover countries and their study opportunities</p>
          </div>

          {/* Filter Section */}
          <div className="mb-12 p-6 bg-muted/10 rounded-lg border border-border/30 shadow-sm">
            <h2 className="text-2xl font-semibold mb-6 tracking-tight">Filter Destinations</h2>
            {/* Filters: Country and Study Level */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

              {/* Study Level Filter */}
              <div className="space-y-2">
                <Label htmlFor="level" className="text-sm font-medium">Study Level</Label>
                <Select value={studyLevel} onValueChange={(v) => setStudyLevel(v as 'All' | 'Undergraduate' | 'Postgraduate')}>
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
            </div>

            {/* Clear Filters Button */}
            <div className="flex items-end mt-6">
              <Button
                variant="outline"
                className="w-full md:w-auto"
                onClick={() => {
                  setCountry('All')
                  setStudyLevel('All')
                }}
              >
                Clear Filters
              </Button>
            </div>
          </div>

          {/* Results grouped by Country */}
          <div className="mb-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-semibold text-foreground tracking-tight">Available Destinations</h2>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                Showing {Object.values(groups).reduce((acc, items) => acc + items.length, 0)} destinations
              </p>
            </div>

            {filtered.length === 0 ? (
              <div className="text-center py-12 border rounded-lg">
                <p className="text-muted-foreground">No destinations match your filters</p>
                <Button
                  variant="ghost"
                  className="mt-4"
                  onClick={() => {
                    setCountry('All')
                    setStudyLevel('All')
                  }}
                >
                  Clear filters
                </Button>
              </div>
            ) : (
              <div className="space-y-10">
                {Object.entries(groups).map(([country, items]) => {
                  // pick at most one UG and one PG per country
                  const ug = items.find(i => i.studyLevel === 'Undergraduate')
                  const pg = items.find(i => i.studyLevel === 'Postgraduate')
                  let display: Item[] = []
                  if (studyLevel === 'All') {
                    display = [ug, pg].filter(Boolean) as Item[]
                  } else if (studyLevel === 'Undergraduate') {
                    display = ug ? [ug] : []
                  } else {
                    display = pg ? [pg] : []
                  }
                  if (display.length === 0) return null
                  return (
                  <section key={country} className="w-full">
                    <div className="flex items-baseline justify-between mb-2">
                      <h3 className="text-xl font-semibold tracking-tight">{country}</h3>
                      <span className="text-xs text-muted-foreground">{display.length} {display.length === 1 ? 'destination' : 'destinations'}</span>
                    </div>
                    <div className="flex gap-5 overflow-x-auto pb-2 snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                      {display.map((item) => (
                        <Card key={item.id} className="group overflow-hidden hover:shadow-md transition-shadow w-[220px] shrink-0 snap-start py-3 gap-3">
                          <div className="overflow-hidden bg-muted/20 h-24">
                            {item.imageUrl ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={item.imageUrl} alt={`${item.country} ${item.studyLevel}`} className="w-full h-full object-contain" loading="lazy" />
                            ) : (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src="/placeholder-logo.png" alt="Destination" className="w-full h-full object-contain" loading="lazy" />
                            )}
                          </div>
                          <CardContent className="p-1 space-y-1">
                            <div className="flex justify-between items-center gap-2">
                              <h4 className="font-semibold text-sm leading-tight line-clamp-1">{item.country}</h4>
                              <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-5">{item.studyLevel}</Badge>
                            </div>
                            <MarkdownRenderer
                              content={item.whyThisDestination}
                              className="text-muted-foreground text-xs max-h-10 overflow-hidden"
                            />
                            <div className="flex items-center justify-between mt-0.5">
                              <div className="flex items-center space-x-1.5 text-[11px] text-muted-foreground">
                                <span>{item.documentsRequired.length} docs</span>
                                <span>• {item.visaRequirements.length} visa</span>
                                <span>• {item.internationalExamRequirements.length} exams</span>
                              </div>
                            </div>
                            <Button
                              className="w-full mt-1 h-7 text-xs"
                              variant="ghost"
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
                )})}
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
        <DialogContent className="!w-[1000px] sm:!w-[1000px] !max-w-[1000px] sm:!max-w-[1000px] h-[90vh] max-h-[90vh] overflow-y-auto p-8">
          <DialogHeader className="gap-0 mb-0 pb-0">
            <DialogTitle>
              {selectedItem?.country} — {selectedItem?.studyLevel}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Basic Info */}
            <section className="mt-2 border rounded-lg p-4">
              <h3 className="text-sm font-semibold mb-3">Basic Info</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="space-y-1">
                  <p className="text-muted-foreground">Country</p>
                  <p className="font-medium">{selectedItem?.country}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground">Study Level</p>
                  <p className="font-medium">{selectedItem?.studyLevel}</p>
                </div>
              </div>
            </section>

            {/* Overview */}
            <section className="border rounded-lg p-4">
              <h3 className="text-sm font-semibold mb-3">Overview</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                <div>
                  <p className="font-medium text-foreground mb-1">Why this destination</p>
                  <MarkdownRenderer className="prose-p:my-1 [&_p]:my-1 [&_ul]:my-1" content={selectedItem?.whyThisDestination || ''} />
                </div>
                <div>
                  <p className="font-medium text-foreground mb-1">Top Schools</p>
                  <MarkdownRenderer className="prose-p:my-1 [&_p]:my-1 [&_ul]:my-1" content={selectedItem?.opportunitiesWhileStudying || ''} />
                </div>
                <div>
                  <p className="font-medium text-foreground mb-1">Payment</p>
                  <MarkdownRenderer className="prose-p:my-1 [&_p]:my-1 [&_ul]:my-1" content={selectedItem?.opportunitiesAfterGraduation || ''} />
                </div>
              </div>
            </section>

            {/* Admission Requirements */}
            <section className="border rounded-lg p-4">
              <h3 className="text-sm font-semibold mb-3">Admission Requirements</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
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
        <div className="container mx-auto px-6 max-w-screen-2xl">
          <p className="text-center text-sm text-muted-foreground">© {new Date().getFullYear()} Scholar Catalog. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

