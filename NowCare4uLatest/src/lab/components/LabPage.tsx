"use client"

import { useEffect } from "react"
import { useLabStore } from "../store/labStore"
import LabAuth from "./LabAuth"
import LabDashboard from "./LabDashboard"

const LabPage = () => {
    const { isAuthenticated, checkAuth } = useLabStore()

    useEffect(() => {
        checkAuth()
    }, [])

    return (
        <div>
            {isAuthenticated ? <LabDashboard /> : <LabAuth />}
        </div>
    )
}

export default LabPage
