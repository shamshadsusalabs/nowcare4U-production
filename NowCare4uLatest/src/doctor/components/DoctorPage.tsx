"use client"

import { useEffect } from "react"
import { useDoctorStore } from "../store/doctorStore"
import DoctorAuth from "./DoctorAuth"
import DoctorDashboard from "./DoctorDashboard"

const DoctorPage = () => {
  const { isAuthenticated, checkAuth } = useDoctorStore()

  useEffect(() => {
    checkAuth()
  }, [])

  return (
    <div>
      {isAuthenticated ? <DoctorDashboard /> : <DoctorAuth />}
    </div>
  )
}

export default DoctorPage
