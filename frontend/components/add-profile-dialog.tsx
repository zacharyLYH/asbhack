'use client'

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ExternalLink, Plus, X } from "lucide-react"
import { useState } from "react"

interface AddProfileDialogProps {
  onAddProfiles: (urls: string[]) => void
  trigger?: React.ReactNode
}

export function AddProfileDialog({ onAddProfiles, trigger }: AddProfileDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [urls, setUrls] = useState<string[]>([''])
  const [isLoading, setIsLoading] = useState(false)

  const addUrlField = () => {
    setUrls([...urls, ''])
  }

  const removeUrlField = (index: number) => {
    if (urls.length > 1) {
      setUrls(urls.filter((_, i) => i !== index))
    }
  }

  const updateUrl = (index: number, value: string) => {
    const newUrls = [...urls]
    newUrls[index] = value
    setUrls(newUrls)
  }

  const isValidLinkedInUrl = (url: string) => {
    const linkedinRegex = /^https:\/\/(www\.)?linkedin\.com\/in\/[\w-]+\/?$/
    return linkedinRegex.test(url.trim())
  }

  const handleSubmit = async () => {
    const validUrls = urls
      .map(url => url.trim())
      .filter(url => url && isValidLinkedInUrl(url))

    if (validUrls.length === 0) {
      return
    }

    setIsLoading(true)
    try {
      await onAddProfiles(validUrls)
      setUrls([''])
      setIsOpen(false)
    } catch (error) {
      console.error('Error adding profiles:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    if (!isLoading) {
      setUrls([''])
      setIsOpen(false)
    }
  }

  const validUrlCount = urls.filter(url => url.trim() && isValidLinkedInUrl(url.trim())).length
  const hasInvalidUrls = urls.some(url => url.trim() && !isValidLinkedInUrl(url.trim()))

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Profile
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add LinkedIn Profiles</DialogTitle>
          <DialogDescription>
            Enter one or more LinkedIn profile URLs to analyze. Each URL should be in the format: 
            https://linkedin.com/in/username
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {urls.map((url, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="flex-1">
                  <Label htmlFor={`url-${index}`} className="sr-only">
                    LinkedIn URL {index + 1}
                  </Label>
                  <Input
                    id={`url-${index}`}
                    placeholder="https://linkedin.com/in/username"
                    value={url}
                    onChange={(e) => updateUrl(index, e.target.value)}
                    className={
                      url.trim() && !isValidLinkedInUrl(url.trim())
                        ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                        : ""
                    }
                  />
                </div>
                {urls.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeUrlField(index)}
                    disabled={isLoading}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              {url.trim() && !isValidLinkedInUrl(url.trim()) && (
                <p className="text-sm text-red-600">
                  Please enter a valid LinkedIn profile URL
                </p>
              )}
            </div>
          ))}
          
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addUrlField}
            disabled={isLoading}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Another URL
          </Button>
        </div>

        <DialogFooter className="flex justify-between sm:justify-between">
          <div className="flex items-center text-sm text-gray-500">
            {validUrlCount > 0 && (
              <span className="flex items-center">
                <ExternalLink className="h-3 w-3 mr-1" />
                {validUrlCount} valid URL{validUrlCount !== 1 ? 's' : ''}
              </span>
            )}
          </div>
          <div className="flex space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={validUrlCount === 0 || isLoading}
            >
              {isLoading ? 'Adding...' : `Add ${validUrlCount || ''} Profile${validUrlCount !== 1 ? 's' : ''}`}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 