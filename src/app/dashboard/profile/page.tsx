"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import { useSession } from "next-auth/react"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ImageUpload } from "@/components/image-upload"

const profileSchema = z.object({
    username: z.string().min(3).regex(/^[a-zA-Z0-9_-]+$/),
    bio: z.string().optional(),
    theme: z.enum(["minimal", "dark", "cyberpunk", "apple", "midnight", "sunset", "forest", "ocean", "glitch", "retro", "monochrome"]),
    avatarUrl: z.string().optional().or(z.literal("")),
    bannerUrl: z.string().optional().or(z.literal("")),
})

export default function ProfilePage() {
    const { data: session, update } = useSession()
    const [isLoading, setIsLoading] = useState(false)

    const form = useForm<z.infer<typeof profileSchema>>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            username: "",
            bio: "",
            theme: "minimal",
            avatarUrl: "",
            bannerUrl: "",
        },
    })

    useEffect(() => {
        if (session?.user) {
            fetch("/api/user").then(res => res.json()).then(data => {
                form.reset({
                    username: data.username || "",
                    bio: data.bio || "",
                    theme: data.theme || "minimal",
                    avatarUrl: data.avatarUrl || "",
                    bannerUrl: data.bannerUrl || "",
                })
            }).catch(() => {
                toast.error("Failed to load profile")
            })
        }
    }, [session, form])

    async function onSubmit(values: z.infer<typeof profileSchema>) {
        setIsLoading(true)
        try {
            const res = await fetch("/api/user", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
            })

            if (!res.ok) {
                const data = await res.json()
                toast.error(data.error || "Failed to update profile")
                return
            }

            toast.success("Profile updated")
            update()
        } catch (error) {
            toast.error("Something went wrong")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="space-y-6 p-8">
            <h2 className="text-3xl font-bold tracking-tight">Profile</h2>
            <Card>
                <CardHeader>
                    <CardTitle>Edit Profile</CardTitle>
                    <CardDescription>Update your public profile information</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <div className="grid gap-6 md:grid-cols-2">
                                <FormField
                                    control={form.control}
                                    name="avatarUrl"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <ImageUpload
                                                    label="Avatar"
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                    onRemove={() => field.onChange("")}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="bannerUrl"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <ImageUpload
                                                    label="Banner Image"
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                    onRemove={() => field.onChange("")}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="username"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Username</FormLabel>
                                        <FormControl>
                                            <Input placeholder="username" {...field} />
                                        </FormControl>
                                        <FormDescription>Your public profile URL: links.cloudzz.dev/{field.value}</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="bio"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Bio</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="Tell us about yourself" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="theme"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Theme</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a theme" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="minimal">Minimal</SelectItem>
                                                <SelectItem value="dark">Dark / Hacker</SelectItem>
                                                <SelectItem value="cyberpunk">Cyberpunk</SelectItem>
                                                <SelectItem value="apple">Apple Clean</SelectItem>
                                                <SelectItem value="midnight">Midnight</SelectItem>
                                                <SelectItem value="sunset">Sunset</SelectItem>
                                                <SelectItem value="forest">Forest</SelectItem>
                                                <SelectItem value="ocean">Ocean</SelectItem>
                                                <SelectItem value="glitch">Glitch</SelectItem>
                                                <SelectItem value="retro">Retro</SelectItem>
                                                <SelectItem value="monochrome">Monochrome</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? "Saving..." : "Save Changes"}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}
