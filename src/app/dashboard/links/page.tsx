"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { toast } from "sonner"
import { SortableLinkList } from "@/components/sortable-link-list"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Github, Twitter, Instagram, Linkedin, Youtube, Twitch, Globe, Facebook } from "lucide-react"

const PLATFORMS = [
    { id: "github", name: "GitHub", icon: Github, urlTemplate: "https://github.com/{username}" },
    { id: "twitter", name: "Twitter / X", icon: Twitter, urlTemplate: "https://x.com/{username}" },
    { id: "instagram", name: "Instagram", icon: Instagram, urlTemplate: "https://instagram.com/{username}" },
    { id: "linkedin", name: "LinkedIn", icon: Linkedin, urlTemplate: "https://linkedin.com/in/{username}" },
    { id: "youtube", name: "YouTube", icon: Youtube, urlTemplate: "https://youtube.com/@{username}" },
    { id: "twitch", name: "Twitch", icon: Twitch, urlTemplate: "https://twitch.tv/{username}" },
    { id: "facebook", name: "Facebook", icon: Facebook, urlTemplate: "https://facebook.com/{username}" },
    { id: "tiktok", name: "TikTok", icon: Globe, urlTemplate: "https://tiktok.com/@{username}" },
    { id: "discord", name: "Discord Server", icon: Globe, urlTemplate: "" },
    { id: "spotify", name: "Spotify", icon: Globe, urlTemplate: "https://open.spotify.com/user/{username}" },
    { id: "other", name: "Custom Link", icon: Globe, urlTemplate: "" },
]

interface Link {
    id: string
    title: string
    url: string
    platform?: string | null
    order: number
}

const linkSchema = z.object({
    title: z.string().min(1, "Title is required"),
    url: z.string().optional(),
    platform: z.string().optional(),
    platformUsername: z.string().optional(),
})

export default function LinksPage() {
    const [links, setLinks] = useState<Link[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)

    const form = useForm<z.infer<typeof linkSchema>>({
        resolver: zodResolver(linkSchema),
        defaultValues: {
            title: "",
            url: "",
            platform: "other",
        },
    })

    useEffect(() => {
        fetchLinks()
    }, [])

    async function fetchLinks() {
        try {
            const res = await fetch("/api/links")
            if (res.ok) {
                const data = await res.json()
                setLinks(data.sort((a: Link, b: Link) => a.order - b.order))
            }
        } catch (error) {
            toast.error("Failed to load links")
        } finally {
            setIsLoading(false)
        }
    }

    async function handleReorder(newLinks: Link[]) {
        setLinks(newLinks)
        try {
            const res = await fetch("/api/links/reorder", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(
                    newLinks.map((link) => ({ id: link.id, order: link.order }))
                ),
            })
            if (!res.ok) throw new Error("Failed to reorder")
        } catch (error) {
            toast.error("Failed to save order")
            fetchLinks()
        }
    }

    async function onSubmit(values: z.infer<typeof linkSchema>) {
        try {
            // Generate URL from platform username if applicable
            const platform = PLATFORMS.find(p => p.id === values.platform)
            let finalUrl = values.url || ""

            if (platform?.urlTemplate && values.platformUsername) {
                finalUrl = platform.urlTemplate.replace("{username}", values.platformUsername)
            }

            const payload = {
                title: values.title,
                url: finalUrl,
                platform: values.platform,
            }

            if (editingId) {
                // Update
                const res = await fetch(`/api/links/${editingId}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                })
                if (!res.ok) throw new Error("Failed to update")

                setLinks(links.map(l => l.id === editingId ? { ...l, ...payload } : l))
                toast.success("Link updated")
            } else {
                // Create
                const res = await fetch("/api/links", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                })
                if (!res.ok) throw new Error("Failed to create")

                const newLink = await res.json()
                setLinks([...links, newLink])
                toast.success("Link added")
            }
            setIsDialogOpen(false)
            form.reset()
            setEditingId(null)
        } catch (error) {
            toast.error(editingId ? "Failed to update link" : "Failed to add link")
        }
    }

    async function handleDelete(id: string) {
        setLinks(links.filter(l => l.id !== id))
        try {
            const res = await fetch(`/api/links/${id}`, { method: "DELETE" })
            if (!res.ok) throw new Error("Failed to delete")
            toast.success("Link deleted")
        } catch (error) {
            toast.error("Failed to delete link")
            fetchLinks()
        }
    }

    function openAddDialog() {
        setEditingId(null)
        form.reset({ title: "", url: "", platform: "other" })
        setIsDialogOpen(true)
    }

    function openEditDialog(link: Link) {
        setEditingId(link.id)
        form.reset({ title: link.title, url: link.url, platform: link.platform || "other" })
        setIsDialogOpen(true)
    }

    return (
        <div className="space-y-6 p-8">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Links</h2>
                <Button onClick={openAddDialog}>
                    <Plus className="mr-2 h-4 w-4" /> Add Link
                </Button>
            </div>

            <div className="space-y-4">
                {isLoading ? (
                    <div className="text-center py-10 text-muted-foreground">Loading links...</div>
                ) : links.length === 0 ? (
                    <div className="text-center py-10 text-muted-foreground border border-dashed rounded-lg">
                        No links yet. Click "Add Link" to get started.
                    </div>
                ) : (
                    <SortableLinkList
                        items={links}
                        onReorder={handleReorder}
                        onEdit={openEditDialog}
                        onDelete={handleDelete}
                    />
                )}
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingId ? "Edit Link" : "Add New Link"}</DialogTitle>
                        <DialogDescription>
                            {editingId ? "Update your link details below." : "Enter the details for your new link."}
                        </DialogDescription>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="platform"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Platform</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a platform" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {PLATFORMS.map((platform) => (
                                                    <SelectItem key={platform.id} value={platform.id}>
                                                        <div className="flex items-center gap-2">
                                                            <platform.icon className="h-4 w-4" />
                                                            <span>{platform.name}</span>
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Display Title</FormLabel>
                                        <FormControl>
                                            <Input placeholder="My GitHub" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Show username input for platforms with URL templates */}
                            {PLATFORMS.find(p => p.id === form.watch("platform"))?.urlTemplate ? (
                                <FormField
                                    control={form.control}
                                    name="platformUsername"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Username</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder={`Your ${PLATFORMS.find(p => p.id === form.watch("platform"))?.name} username`}
                                                    {...field}
                                                />
                                            </FormControl>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                URL will be: {PLATFORMS.find(p => p.id === form.watch("platform"))?.urlTemplate.replace("{username}", field.value || "username")}
                                            </p>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            ) : (
                                <FormField
                                    control={form.control}
                                    name="url"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>URL</FormLabel>
                                            <FormControl>
                                                <Input placeholder="https://example.com" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}
                            <DialogFooter>
                                <Button type="submit">
                                    {editingId ? "Save Changes" : "Add Link"}
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </div>
    )
}
