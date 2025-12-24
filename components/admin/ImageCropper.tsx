"use client"

import React, { useState, useCallback } from "react"
import Cropper, { Area } from "react-easy-crop"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { X, Check, RotateCcw } from "lucide-react"
import getCroppedImg from "@/lib/image"

interface ImageCropperProps {
    imageSrc: string | null
    aspect?: number
    onClose: () => void
    onCropComplete: (croppedImage: Blob) => void
}

export function ImageCropper({ imageSrc, aspect = 4 / 3, onClose, onCropComplete }: ImageCropperProps) {
    const [crop, setCrop] = useState({ x: 0, y: 0 })
    const [zoom, setZoom] = useState(1)
    const [rotation, setRotation] = useState(0)
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)
    const [loading, setLoading] = useState(false)

    const onCropChange = (crop: { x: number; y: number }) => {
        setCrop(crop)
    }

    const onZoomChange = (zoom: number) => {
        setZoom(zoom)
    }

    const onRotationChange = (rotation: number) => {
        setRotation(rotation)
    }

    const onCropCompleteHandler = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
        setCroppedAreaPixels(croppedAreaPixels)
    }, [])

    const handleSave = async () => {
        if (!imageSrc || !croppedAreaPixels) return

        try {
            setLoading(true)
            const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels, rotation)
            if (croppedImage) {
                onCropComplete(croppedImage)
            }
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
        }
    }

    if (!imageSrc) return null

    return (
        <Dialog open={!!imageSrc} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-3xl w-full h-[80vh] flex flex-col p-0 gap-0 overflow-hidden">
                <DialogHeader className="p-4 border-b">
                    <DialogTitle>Recadrer l'image</DialogTitle>
                </DialogHeader>

                <div className="relative flex-1 bg-black w-full min-h-0">
                    <Cropper
                        image={imageSrc}
                        crop={crop}
                        zoom={zoom}
                        rotation={rotation}
                        aspect={aspect}
                        onCropChange={onCropChange}
                        onCropComplete={onCropCompleteHandler}
                        onZoomChange={onZoomChange}
                        onRotationChange={onRotationChange}
                    />
                </div>

                <div className="p-4 bg-white border-t space-y-4">
                    <div className="grid grid-cols-[auto_1fr] gap-4 items-center">
                        <span className="text-sm font-medium w-16">Zoom</span>
                        <Slider
                            value={[zoom]}
                            min={1}
                            max={3}
                            step={0.1}
                            onValueChange={(val) => setZoom(val[0])}
                            className="w-full"
                        />
                    </div>

                    <div className="grid grid-cols-[auto_1fr] gap-4 items-center">
                        <span className="text-sm font-medium w-16">Rotation</span>
                        <Slider
                            value={[rotation]}
                            min={0}
                            max={360}
                            step={1}
                            onValueChange={(val) => setRotation(val[0])}
                            className="w-full"
                        />
                    </div>

                    <DialogFooter className="flex justify-between sm:justify-between items-center pt-2">
                        <Button variant="ghost" onClick={() => { setZoom(1); setRotation(0); setCrop({ x: 0, y: 0 }); }}>
                            <RotateCcw className="w-4 h-4 mr-2" />
                            Réinitialiser
                        </Button>
                        <div className="flex gap-2">
                            <Button variant="outline" onClick={onClose}>
                                <X className="w-4 h-4 mr-2" />
                                Annuler
                            </Button>
                            <Button onClick={handleSave} disabled={loading} className="bg-odillon-teal hover:bg-odillon-teal/90">
                                <Check className="w-4 h-4 mr-2" />
                                {loading ? "Traitement..." : "Valider le recadrage"}
                            </Button>
                        </div>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    )
}
