"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Calendar, MapPin, Users, Gamepad2, X, FileText, Award } from "lucide-react"

const AddTournamentForm = ({ onSubmit, tournamentToEdit, onCancel, isEdit = false }) => {
    const [formData, setFormData] = useState({
        gameTitle: tournamentToEdit?.gameTitle || "",
        date: tournamentToEdit?.date || "",
        location: tournamentToEdit?.location || "",
        spots: tournamentToEdit?.spots || "",
        prizePool: tournamentToEdit?.prizePool || "",
        details: tournamentToEdit?.details || "",
        // Note: usedSpots is not included here as it's managed separately
    })
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.gameTitle || !formData.date || !formData.location || !formData.spots) {
            alert("Please fill in all required fields.");
            return;
        }

        setIsSubmitting(true);

        try {
            await onSubmit({
                ...formData,
                spots: Number(formData.spots),
                prizePool: formData.prizePool || "0", // Default to 0 if empty
                ...(isEdit && tournamentToEdit?.id && { id: tournamentToEdit.id }),
                ...(isEdit && tournamentToEdit?.createdAt && { createdAt: tournamentToEdit.createdAt }),
                ...(isEdit && tournamentToEdit?.usedSpots && { usedSpots: tournamentToEdit.usedSpots }),
            });

            if (!isEdit) {
                setFormData({
                    gameTitle: "",
                    date: "",
                    location: "",
                    spots: "",
                    prizePool: "",
                    details: "",
                });
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="relative">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold">
                    {isEdit ? "Edit Tournament" : "Add New Tournament"}
                </h3>
                {onCancel && (
                    <motion.button
                        whileHover={{ rotate: 90, scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={onCancel}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </motion.button>
                )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
                <div className="grid grid-cols-1 gap-3">
                    <div>
                        <label className="block text-sm font-medium mb-1">Game Title*</label>
                        <div className="relative">
                            <Gamepad2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <input
                                type="text"
                                name="gameTitle"
                                value={formData.gameTitle}
                                onChange={handleChange}
                                placeholder="Game title"
                                className="w-full p-2 pl-9 text-sm bg-background/50 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-medium mb-1">Date*</label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <input
                                    type="date"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleChange}
                                    className="w-full p-2 pl-9 text-sm bg-background/50 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Location*</label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    placeholder="Location"
                                    className="w-full p-2 pl-9 text-sm bg-background/50 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-medium mb-1">Spots*</label>
                            <div className="relative">
                                <Users className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <input
                                    type="number"
                                    name="spots"
                                    value={formData.spots}
                                    onChange={handleChange}
                                    placeholder="Total spots"
                                    min="1"
                                    className="w-full p-2 pl-9 text-sm bg-background/50 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Prize Pool ($)</label>
                            <div className="relative">
                                <Award className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <input
                                    type="text"
                                    name="prizePool"
                                    value={formData.prizePool}
                                    onChange={handleChange}
                                    placeholder="Prize amount"
                                    className="w-full p-2 pl-9 text-sm bg-background/50 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                                />
                            </div>
                        </div>
                    </div>

                    {isEdit && (
                        <div>
                            <label className="block text-sm font-medium mb-1">Used Spots</label>
                            <div className="relative">
                                <Users className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <input
                                    type="number"
                                    name="usedSpots"
                                    value={tournamentToEdit?.usedSpots || 0}
                                    readOnly
                                    className="w-full p-2 pl-9 text-sm bg-background/20 border border-border rounded-md cursor-not-allowed"
                                />
                            </div>
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium mb-1">Details</label>
                        <div className="relative">
                            <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <textarea
                                name="details"
                                value={formData.details}
                                onChange={handleChange}
                                placeholder="Tournament details"
                                rows="2"
                                className="w-full p-2 pl-9 text-sm bg-background/50 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                    {onCancel && (
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="button"
                            onClick={onCancel}
                            className="px-3 py-1.5 text-sm border border-border rounded-md hover:bg-background/50 transition-colors"
                        >
                            Cancel
                        </motion.button>
                    )}
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={isSubmitting}
                        className="px-4 py-1.5 text-sm bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-md hover:shadow-lg transition-all disabled:opacity-70"
                    >
                        {isSubmitting ? (
                            <span className="flex items-center">
                                <svg
                                    className="animate-spin -ml-1 mr-2 h-3 w-3 text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    ></path>
                                </svg>
                                {isEdit ? "Updating..." : "Adding..."}
                            </span>
                        ) : (
                            isEdit ? "Update" : "Add"
                        )}
                    </motion.button>
                </div>
            </form>
        </div>
    )
}

export default AddTournamentForm