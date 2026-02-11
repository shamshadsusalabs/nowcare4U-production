import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { lazy, Suspense } from 'react'

import ScrollToTop from './ScrollToTop'
import Navbar from './_component/navbar'
import Hero from './_component/hero'
import Expert from './_component/expert'
import Calculator from './_component/calculator'
import Career from './_component/career'
import ContactUs from './_component/ContactUs'
import Footer from './_component/footer'

// Lazy load
const Rnatherapy = lazy(() => import('./_component/rnatherapy'))
const Neurology = lazy(() => import('./_component/neurology'))
const Ourservice = lazy(() => import('./_component/ourservice'))
const Mentalheath = lazy(() => import('./_component/_mentalHealthprogram/mentalheath'))
const Sickreason = lazy(() => import('./_component/_mentalHealthprogram/sickreason'))
const Mentallwellness = lazy(() => import('./_component/_mentalHealthprogram/mentallwellness'))
const Systemmatic = lazy(() => import('./_component/_mentalHealthprogram/systemmatic-procedure'))
const Blog = lazy(() => import('./blog/blog'))
const Blogdetails = lazy(() => import('./blog/blog-details'))
const AdhdTest = lazy(() => import('./_component/_calculator/adhdTest'))
const Bedwetting = lazy(() => import('./_component/_calculator/bedwettingTest'))
const ChildgrowthTest = lazy(() => import('./_component/_calculator/childgrowthTest'))
const HeightPrediction = lazy(() => import('./_component/_calculator/heightPredictionTest'))
const PersonalityTest = lazy(() => import('./_component/_calculator/personalityTest'))
const Cognitivetest = lazy(() => import('./_component/_calculator/congnitiveTest/CognitiveTestApp'))
const CognitiveRecords = lazy(() => import('./_component/_calculator/congnitiveTest/CognitiveRecords'))
const KickCounterApp = lazy(() => import('./_component/_calculator/KickCounterApp'))
const DiabetesCalcApp = lazy(() => import('./_component/_calculator/diabetes/DiabetesCalcApp'))
const DiabetesRecords = lazy(() => import('./_component/_calculator/diabetes/DiabetesRecords'))
const PregnancyWeightApp = lazy(() => import('./_component/_calculator/pregnancyWeight/PregnancyWeightApp'))
const PregnancyWeightRecords = lazy(() => import('./_component/_calculator/pregnancyWeight/PregnancyWeightRecords'))
const BMICalcApp = lazy(() => import('./_component/_calculator/bmi/BMICalcApp'))
const AdminLogin = lazy(() => import('./_admin/AdminLogin'))
const AdminLayout = lazy(() => import('./_admin/AdminLayout'))
const AdminDashboard = lazy(() => import('./_admin/AdminDashboard'))
const DoctorManagement = lazy(() => import('./_admin/DoctorManagement'))
const BlogManagement = lazy(() => import('./_admin/BlogManagement'))
const PharmacistManagement = lazy(() => import('./_admin/PharmacistManagement'))
const ProductManagement = lazy(() => import('./_admin/product/ProductManagement'))
const LabManagement = lazy(() => import('./_admin/LabManagement'))
const Doctor = lazy(() => import('./pages/doctor'))
const Pharmacist = lazy(() => import('./pages/pharmacist'))
const Lab = lazy(() => import('./pages/lab'))
const OvulationCalculator = lazy(() => import('./_component/_calculator/ovulation/OvulationCalculator'))
const OvulationRecord = lazy(() => import('./_component/_calculator/ovulation/OvulationRecord'))
const KickRecords = lazy(() => import('./_component/_calculator/kick/KickRecords'))
const PhoneLogin = lazy(() => import('./auth/PhoneLogin'))

const Addblog = lazy(() => import('./_admin/addblog'))
const ProtectedAdminRoute = lazy(() => import('./_admin/ProtectedAdminRoute'))

// Unified Program Management
const ProgramManagement = lazy(() => import('./_admin/program/ProgramManagement'))
const ProgramPage = lazy(() => import('./_component/ProgramPage'))

function App() {
  const location = useLocation()
  const isDoctorRoute = location.pathname === '/doctor'
  const isAdminRoute = location.pathname.startsWith('/admin')

  return (
    <div className="min-h-screen bg-white text-gray-800">
      <ScrollToTop />
      {!isDoctorRoute && !isAdminRoute && <Navbar />}

      <Routes>
        <Route
          path="/"
          element={
            <>
              <Hero />
              <Expert />
              <Calculator />
              <Career />
            </>
          }
        />
        <Route
          path="/mental-health"
          element={
            <>
              <Mentalheath />
              <Sickreason />
              <Mentallwellness />
              <Systemmatic />
            </>
          }
        />
        <Route
          path="/experts"
          element={
            <Suspense fallback={<div className="text-center p-10">Loading...</div>}>
              <Expert />
            </Suspense>
          }
        />
        <Route
          path="/career"
          element={
            <Suspense fallback={<div className="text-center p-10">Loading...</div>}>
              <Career />
            </Suspense>
          }
        />
        <Route
          path="/contact"
          element={<ContactUs />}
        />
        <Route
          path="/programs"
          element={
            <Suspense fallback={<div className="text-center p-10">Loading...</div>}>
              <ProgramPage />
            </Suspense>
          }
        />
        <Route
          path="/calculators"
          element={
            <Suspense fallback={<div className="text-center p-10">Loading...</div>}>
              <Calculator />
            </Suspense>
          }
        />
        <Route
          path="/rnatherapy"
          element={
            <Suspense fallback={<div className="text-center p-10">Loading...</div>}>
              <Rnatherapy />
            </Suspense>
          }
        />
        <Route
          path="/neurology"
          element={
            <Suspense fallback={<div className="text-center p-10">Loading...</div>}>
              <Neurology />
            </Suspense>
          }
        />
        <Route
          path="/ourservice"
          element={
            <Suspense fallback={<div className="text-center p-10">Loading...</div>}>
              <Ourservice />
            </Suspense>
          }
        />
        <Route
          path="/blog"
          element={
            <Suspense fallback={<div className="text-center p-10">Loading...</div>}>
              <Blog />
            </Suspense>
          }
        />
        <Route
          path="/blog-details/:_id"
          element={
            <Suspense fallback={<div className="text-center p-10">Loading...</div>}>
              <Blogdetails />
            </Suspense>
          }
        />
        <Route
          path="/adhdTest"
          element={
            <Suspense fallback={<div className="text-center p-10">Loading...</div>}>
              <AdhdTest />
            </Suspense>
          }
        />
        <Route
          path="/bedwettingTest"
          element={
            <Suspense fallback={<div className="text-center p-10">Loading...</div>}>
              <Bedwetting />
            </Suspense>
          }
        />
        <Route
          path="/childgrowthTest"
          element={
            <Suspense fallback={<div className="text-center p-10">Loading...</div>}>
              <ChildgrowthTest />
            </Suspense>
          }
        />
        <Route
          path="/heightPredictionTest"
          element={
            <Suspense fallback={<div className="text-center p-10">Loading...</div>}>
              <HeightPrediction />
            </Suspense>
          }
        />
        <Route
          path="/personalityTest"
          element={
            <Suspense fallback={<div className="text-center p-10">Loading...</div>}>
              <PersonalityTest />
            </Suspense>
          }
        />
        <Route
          path="/congnitiveTest"
          element={
            <Suspense fallback={<div className="text-center p-10">Loading...</div>}>
              < Cognitivetest />
            </Suspense>
          }
        />
        <Route
          path="/cognitive-records"
          element={
            <Suspense fallback={<div className="text-center p-10">Loading...</div>}>
              <CognitiveRecords />
            </Suspense>
          }
        />
        <Route
          path="/kickCounter"
          element={
            <Suspense fallback={<div className="text-center p-10">Loading...</div>}>
              <KickCounterApp />
            </Suspense>
          }
        />
        <Route
          path="/diabetes"
          element={
            <Suspense fallback={<div className="text-center p-10">Loading...</div>}>
              <DiabetesCalcApp />
            </Suspense>
          }
        />
        <Route
          path="/diabetes-records"
          element={
            <Suspense fallback={<div className="text-center p-10">Loading...</div>}>
              <DiabetesRecords />
            </Suspense>
          }
        />
        <Route
          path="/pregnancy-weight"
          element={
            <Suspense fallback={<div className="text-center p-10">Loading...</div>}>
              <PregnancyWeightApp />
            </Suspense>
          }
        />
        <Route
          path="/pregnancy-weight-records"
          element={
            <Suspense fallback={<div className="text-center p-10">Loading...</div>}>
              <PregnancyWeightRecords />
            </Suspense>
          }
        />
        <Route
          path="/bmi"
          element={
            <Suspense fallback={<div className="text-center p-10">Loading...</div>}>
              <BMICalcApp />
            </Suspense>
          }
        />
        <Route
          path="/ovulation"
          element={
            <Suspense fallback={<div className="text-center p-10">Loading...</div>}>
              <OvulationCalculator />
            </Suspense>
          }
        />
        <Route
          path="/ovulation-records"
          element={
            <Suspense fallback={<div className="text-center p-10">Loading...</div>}>
              <OvulationRecord />
            </Suspense>
          }
        />
        <Route
          path="/kick-records"
          element={
            <Suspense fallback={<div className="text-center p-10">Loading...</div>}>
              <KickRecords />
            </Suspense>
          }
        />
        <Route
          path="/login"
          element={
            <Suspense fallback={<div className="text-center p-10">Loading...</div>}>
              <PhoneLogin />
            </Suspense>
          }
        />
        <Route
          path="/doctor"
          element={
            <Suspense fallback={<div className="text-center p-10">Loading...</div>}>
              <Doctor />
            </Suspense>
          }
        />
        <Route
          path="/pharmacist"
          element={
            <Suspense fallback={<div className="text-center p-10">Loading...</div>}>
              <Pharmacist />
            </Suspense>
          }
        />
        <Route
          path="/lab"
          element={
            <Suspense fallback={<div className="text-center p-10">Loading...</div>}>
              <Lab />
            </Suspense>
          }
        />
        <Route
          path="/admin/login"
          element={
            <Suspense fallback={<div className="text-center p-10">Loading...</div>}>
              <AdminLogin />
            </Suspense>
          }
        />
        <Route
          path="/admin"
          element={
            <Suspense fallback={<div className="text-center p-10">Loading...</div>}>
              <ProtectedAdminRoute>
                <AdminLayout />
              </ProtectedAdminRoute>
            </Suspense>
          }
        >
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="doctors" element={<DoctorManagement />} />
          <Route path="pharmacists" element={<PharmacistManagement />} />
          <Route path="products" element={<ProductManagement />} />
          <Route path="labs" element={<LabManagement />} />
          <Route path="blogs" element={<BlogManagement />} />
          <Route path="addblog" element={<Addblog />} />

          {/* Unified Program Management */}
          <Route path="programs" element={<ProgramManagement />} />
        </Route>
        <Route
          path="/addblog"
          element={
            <Suspense fallback={<div className="text-center p-10">Loading...</div>}>
              < Addblog />
            </Suspense>
          }
        />
      </Routes>

      {!isDoctorRoute && !isAdminRoute && <Footer />}
    </div>
  )
}

export default App
