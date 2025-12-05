"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, X } from "lucide-react"
import Image from "next/image"
import { toast } from "sonner"

interface ImageUploadProps {
    label: string
    value?: string | null
    onChange: (url: string) => void
    onRemove: () => void
    className?: string
}

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Check } from "lucide-react"

// ... (keep interface)

export function ImageUpload({ label, value, onChange, onRemove, className }: ImageUploadProps) {
    const [isUploading, setIsUploading] = useState(false)
    const [libraryImages, setLibraryImages] = useState<string[]>([])
    const [activeTab, setActiveTab] = useState("upload")

    useEffect(() => {
        if (activeTab === "library") {
            fetch("/api/uploads")
                .then(res => res.json())
                .then(data => {
                    if (data.images) setLibraryImages(data.images)
                })
                .catch(err => console.error("Failed to load library", err))
        }
    }, [activeTab])

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        if (file.size > 5 * 1024 * 1024) {
            toast.error("File size too large (max 5MB)")
            return
        }

        setIsUploading(true)
        const formData = new FormData()
        formData.append("file", file)

        try {
            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            })

            if (!res.ok) {
                const errorData = await res.text()
                console.error("Upload failed:", errorData)
                throw new Error(errorData || "Upload failed")
            }

            const data = await res.json()
            onChange(data.url)
            toast.success("Image uploaded successfully")
        } catch (error) {
            console.error("Upload error:", error)
            toast.error("Failed to upload image")
        } finally {
            setIsUploading(false)
            e.target.value = ""
        }
    }

    return (
        <div className={className}>
            <Label className="mb-2 block">{label}</Label>

            {value ? (
                <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-white/10 bg-black/20 group">
                    <Image
                        src={value}
                        alt="Upload"
                        fill
                        className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={onRemove}
                        >
                            Remove Image
                        </Button>
                    </div>
                </div>
            ) : (
                <Tabs defaultValue="upload" value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-2">
                        <TabsTrigger value="upload">Upload New</TabsTrigger>
                        <TabsTrigger value="library">My Library</TabsTrigger>
                    </TabsList>

                    <TabsContent value="upload" className="mt-0">
                        <div className="flex items-center justify-center w-full">
                            <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-white/10 rounded-lg cursor-pointer hover:bg-white/5 transition-colors">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <Upload className="w-8 h-8 mb-2 text-gray-400" />
                                    <p className="text-sm text-gray-400">
                                        {isUploading ? "Uploading..." : "Click to upload"}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">Max 5MB</p>
                                </div>
                                <Input
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleUpload}
                                    disabled={isUploading}
                                />
                            </label>
                        </div>
                    </TabsContent>

                    <TabsContent value="library" className="mt-0">
                        <ScrollArea className="h-40 w-full rounded-md border border-white/10 bg-black/20 p-2">
                            {libraryImages.length > 0 ? (
                                <div className="grid grid-cols-3 gap-2">
                                    {libraryImages.map((img) => (
                                        <button
                                            key={img}
                                            type="button"
                                            onClick={() => onChange(img)}
                                            className="relative aspect-square rounded-md overflow-hidden border border-white/5 hover:border-green-500 transition-colors group"
                                        >
                                            <Image
                                                src={img}
                                                alt="Library image"
                                                fill
                                                className="object-cover"
                                            />
                                            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-gray-400 text-sm">
                                    <p>No images found</p>
                                </div>
                            )}
                        </ScrollArea>
                    </TabsContent>
                </Tabs>
            )}
        </div>
    )
}
