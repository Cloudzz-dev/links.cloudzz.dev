"use client"

import { useState } from "react"
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from "@dnd-kit/core"
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { GripVertical, Pencil, Trash2, ExternalLink, Github, Twitter, Instagram, Linkedin, Youtube, Twitch, Globe, Facebook } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface Link {
    id: string
    title: string
    url: string
    order: number
    platform?: string | null
}

interface SortableLinkListProps {
    items: Link[]
    onReorder: (newItems: Link[]) => void
    onEdit: (link: Link) => void
    onDelete: (id: string) => void
}

const PLATFORM_ICONS: Record<string, any> = {
    github: Github,
    twitter: Twitter,
    instagram: Instagram,
    linkedin: Linkedin,
    youtube: Youtube,
    twitch: Twitch,
    facebook: Facebook,
    other: Globe,
}

function SortableItem({ link, onEdit, onDelete }: { link: Link; onEdit: (l: Link) => void; onDelete: (id: string) => void }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: link.id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 10 : 1,
        opacity: isDragging ? 0.5 : 1,
    }

    const Icon = PLATFORM_ICONS[link.platform || "other"] || Globe

    return (
        <div ref={setNodeRef} style={style} className="mb-3">
            <Card className="bg-card/50 backdrop-blur-sm border-white/5 hover:border-white/10 transition-colors">
                <CardContent className="p-4 flex items-center gap-4">
                    <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground">
                        <GripVertical className="h-5 w-5" />
                    </div>

                    <div className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                        <Icon className="h-5 w-5" />
                    </div>

                    <div className="flex-1 min-w-0">
                        <h3 className="font-medium truncate">{link.title}</h3>
                        <p className="text-sm text-muted-foreground truncate">{link.url}</p>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" onClick={() => onEdit(link)}>
                            <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => onDelete(link.id)}>
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export function SortableLinkList({ items, onReorder, onEdit, onDelete }: SortableLinkListProps) {
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event

        if (active.id !== over?.id) {
            const oldIndex = items.findIndex((item) => item.id === active.id)
            const newIndex = items.findIndex((item) => item.id === over?.id)

            const newItems = arrayMove(items, oldIndex, newIndex)
            // Update order property
            const reorderedItems = newItems.map((item, index) => ({ ...item, order: index }))

            onReorder(reorderedItems)
        }
    }

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
        >
            <SortableContext items={items} strategy={verticalListSortingStrategy}>
                {items.map((link) => (
                    <SortableItem key={link.id} link={link} onEdit={onEdit} onDelete={onDelete} />
                ))}
            </SortableContext>
        </DndContext>
    )
}
