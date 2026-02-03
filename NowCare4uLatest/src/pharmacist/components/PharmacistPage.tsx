"use client"

import { useEffect } from "react"
import { usePharmacistStore } from "../store/pharmacistStore"
import PharmacistAuth from "./PharmacistAuth"
import PharmacistDashboard from "./PharmacistDashboard"

const PharmacistPage = () => {
    const { isAuthenticated, checkAuth } = usePharmacistStore()

    useEffect(() => {
        checkAuth()
    }, [])

    return (
        <div>
            {isAuthenticated ? <PharmacistDashboard /> : <PharmacistAuth />}
        </div>
    )
}

export default PharmacistPage
