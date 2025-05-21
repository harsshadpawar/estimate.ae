'use client'

import React, { useEffect, useRef, useState } from 'react'
import {
  Box,
  Button,
  Typography,
  Paper,
  CircularProgress,
  LinearProgress,
  Stack
} from '@mui/material'
import {
  GetApp as DownloadIcon,
  TableChart as ExcelIcon
} from '@mui/icons-material'
import { saveAs } from 'file-saver'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import ForgeViewerComponent from '../ForgeViewerComponent/forgeViewer'
import apiClient from '@/services/interceptor'
import CostingReport from './costData'
import CostingReportshow from './costingReportshow'
import error from '@/assets/images/error.jpg'

// Import dummy step images
import s1 from '@/assets/images/amico1.png'
import s2 from '@/assets/images/amico2.png'
import s3 from '@/assets/images/amico3.png'
import s4 from '@/assets/images/amico4.png'
import s5 from '@/assets/images/amico5.png'
import s6 from '@/assets/images/amico6.png'
import s7 from '@/assets/images/amico7.png'
import s8 from '@/assets/images/amico8.png'

const dummyImageUrls = [s1, s2, s3, s4, s5, s6, s7, s8]

const DUMMY_STEPS = [
  { label: "Analyzing Model" },
  { label: "Identify Machining Processes" },
  { label: "Identify Workspace Coordinates" },
  { label: "Raw Material stock selection" },
  { label: "Calculating Cutting Parameters" },
  { label: "Calculating Toolpath" },
  { label: "Calculating Machining Time" },
  { label: "Generaing report (from 90% to 100% )" }
]

export default function ManufacturingCalculator({
  setOpenModal,
  accessToken,
  uploadedFileName,
  selectedMaterial,
  selectedSurfaceTreatment,
  selectedMaterialGroupName,
  selectedSurfaceTreatmentName,
  selectedMaterialName,
  selectedMachines,
  cadFileId,
  getDimensions,
  rawMaterialGroup,
  density,
  quantities
}) {
  // State variables
  const [isCalculationDone, setIsCalculationDone] = useState(false)
  const [costData, setCostData] = useState([])
  const [quantity, setQuantity] = useState(1)
  const [steps, setSteps] = useState([])
  const [activeStep, setActiveStep] = useState(0)
  const [imageUrls, setImageUrls] = useState([])
  const [currentImage, setCurrentImage] = useState('')
  const [progress, setProgress] = useState(0)
  const [showPdfDiv, setShowPdfDiv] = useState(false)
  const [showPdfLoader, setShowPdfLoader] = useState(false)
  const [showTable, setShowTable] = useState(false)
  const [tableError, setTableError] = useState(false)
  const [showDummyData, setShowDummyData] = useState(false)

  // Refs
  const componentRef = useRef(null)
  const progressInterval = useRef(null)
  const initialCallMade = useRef(false)

  // Computed properties
  const progressPercentage = isCalculationDone ? 100 : (activeStep / steps.length) * 100

  // Effects
  useEffect(() => {
    // Initial API calls
    if (!initialCallMade.current && uploadedFileName) {
      getFilePaths()
      getEstimationLogic()
      initialCallMade.current = true
    }
  }, [uploadedFileName])

  useEffect(() => {
    // Update current image based on active step
    if (imageUrls.length > 0 && activeStep < imageUrls.length) {
      setCurrentImage(imageUrls[activeStep]?.img_path)
    }
  }, [activeStep, imageUrls])

  useEffect(() => {
    // Auto-increment step
    const stepInterval = setInterval(() => {
      if (activeStep < steps.length - 1) {
        setActiveStep(prev => prev + 1)
      } else {
        clearInterval(stepInterval)
        setIsCalculationDone(true)
      }
    }, 1000)

    return () => clearInterval(stepInterval)
  }, [activeStep, steps.length])

  useEffect(() => {
    // Progress animation within each step
    if (activeStep < steps.length && !isCalculationDone) {
      setProgress(0)
      progressInterval.current = setInterval(() => {
        setProgress(prev => (prev < 100 ? prev + 1 : prev))
      }, 100)

      return () => clearInterval(progressInterval.current)
    } else {
      clearInterval(progressInterval.current)
    }
  }, [activeStep, steps.length, isCalculationDone])

  // API functions
  const getFilePaths = async () => {
    try {
      const baseName = uploadedFileName.split('.')[0].trim()
      
      // Set up display data
      setSteps(DUMMY_STEPS)
      setImageUrls(dummyImageUrls.map((url, index) => ({ 
        img_path: url, 
        title: `Step ${index + 1}` 
      })))
      setShowDummyData(false)
    } catch (error) {
      console.error('Error fetching file paths:', error)
      setShowDummyData(true)
      setSteps(DUMMY_STEPS)
      setImageUrls(dummyImageUrls.map((url, index) => ({ 
        img_path: url, 
        title: `Step ${index + 1}` 
      })))
    }
  }

  const getEstimationLogic = async () => {
    try {
      const response = await apiClient.post('/freecad/estimation_logic', {
        foldername: uploadedFileName?.toLowerCase().split('.')[0],
        filename: uploadedFileName?.toLowerCase(),
        material_group_id: rawMaterialGroup?.id,
        material_density: density,
        material_price: rawMaterialGroup?.price,
        matirial_name: selectedMaterialName,
        machineId: selectedMachines?.id,
        surfaceTreatmentId: selectedSurfaceTreatment?.id,
        quantity: quantities
      })

      setCostData(response?.data.data)
      setShowTable(true)
      setTableError(false)
    } catch (error) {
      console.error('Error fetching estimation logic:', error)
      setShowTable(false)
      setTableError(true)
    }
  }

  // PDF generation
  const handleDownloadPDF = async () => {
    setShowPdfDiv(true)
    setShowPdfLoader(true)
    document.body.style.overflow = 'hidden'

    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      if (!componentRef.current) {
        console.error("Component reference is null!")
        return
      }

      const canvas = await html2canvas(componentRef.current, { scale: 2 })
      const imageData = canvas.toDataURL("image/png")

      // Initialize PDF
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "pt",
        format: "a4",
      })

      // Get dimensions
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = pdf.internal.pageSize.getHeight()
      const canvasWidth = canvas.width
      const canvasHeight = canvas.height
      const imgHeight = (canvasHeight * pdfWidth) / canvasWidth
      let heightLeft = imgHeight
      let position = 0

      // Add pages as needed
      while (heightLeft > 0) {
        pdf.addImage(
          imageData,
          "PNG",
          0,
          position,
          pdfWidth,
          imgHeight,
          undefined,
          "FAST"
        )
        heightLeft -= pdfHeight
        position -= pdfHeight

        if (heightLeft > 0) {
          pdf.addPage()
        }
      }

      const pdfBlob = pdf.output("blob")
      const pdfURL = URL.createObjectURL(pdfBlob)
      window.open(pdfURL, "_blank")
    } catch (error) {
      console.error("Error generating multi-page PDF:", error)
    } finally {
      setShowPdfDiv(false)
      setShowPdfLoader(false)
      document.body.style.overflow = 'auto'
    }
  }

  // Excel export
  const handleDownloadExcel = () => {
    const rows = [
      ["Content", "Parameter", "Value"],
      // Static fields
      ["Model Name", uploadedFileName || "N/A"],
      ["Material Group", selectedMaterialGroupName || "N/A"],
      ["Material Name", selectedMaterialName || "N/A"],
      ["Surface Finish", selectedSurfaceTreatmentName || "N/A"],
      ["Tolerance", "ISO 2768"],

      // Dynamic fields from costData
      ["Raw Material Cost", "Model Bounding Box Size",
        `${costData?.calculations?.raw_material?.model_dimensions_mm?.length?.toFixed(1) || 0} mm x 
         ${costData?.calculations?.raw_material?.model_dimensions_mm?.width?.toFixed(1) || 0} mm x 
         ${costData?.calculations?.raw_material?.model_dimensions_mm?.height?.toFixed(1) || 0} mm`],
      ["Raw Material Cost", "Raw Material Weight",
        `${costData?.calculations?.raw_material?.weight_kg?.toFixed(2) || "N/A"} kg`],
      ["Raw Material Cost", "Raw Material Price/kg",
        `${costData?.calculations?.raw_material?.price_per_kg?.toFixed(2) || "N/A"} AED`],

      // Setup Costs
      ["Setup Cost", "Number of Setups",
        `${costData?.calculations?.setup?.number_of_setups || "N/A"}`],
      ["Setup Cost", "Total Setup Time (min)",
        `${costData?.calculations?.setup?.total_time_minutes || "N/A"} Minutes`],
      ["Setup Cost", "Setup Cost per Hour",
        `${costData?.calculations?.setup?.hourly_rate?.toFixed(2) || "N/A"} AED`],
      ["Setup Cost", "Total Setup Cost",
        `${costData?.costs?.setup_cost?.toFixed(2) || "N/A"} AED`],

      // Machining Costs
      ["Machining Cost", "Number of Operations",
        `${costData?.calculations?.machining?.number_of_operations || "N/A"}`],
      ["Machining Cost", "Total Machining Cost",
        `${costData?.costs?.machining_cost?.toFixed(2) || "N/A"} AED`],

      // Surface Finish Costs
      ["Surface Finish Cost", "Surface Finish Type", `${selectedSurfaceTreatmentName}`],
      ["Surface Finish Cost", "Surface Finish Cost", `${costData?.costs?.surface_finish_cost?.toFixed(2) || 0} AED`],

      // Quality Control Cost
      ["Quality Control Cost", "Quality Control Cost", `${costData?.costs?.quality_control_cost || 0} AED`],

      // Total Amount
      ["Total Amount", "Total Cost Per Piece", `${costData?.costs?.total_cost?.toFixed(2) || 0} AED`],
    ]

    const csvContent = rows
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    saveAs(blob, "costing_report.csv")
  }

  // UI Components
  const Loader = () => (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 9999,
    }}>
      <div style={{ textAlign: 'center' }}>
        <CircularProgress style={{ color: '#fff' }} />
        <Typography variant="h6" style={{ color: '#fff', marginTop: '20px' }}>
          Generating PDF... Please wait.
        </Typography>
      </div>
    </div>
  )

  const ErrorMessage = () => (
    <Box
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          window.location.reload()
        }
      }}
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        bgcolor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          maxWidth: "600px",
          width: "90%",
          p: 4,
          borderRadius: 2,
          textAlign: "center",
        }}
      >
        <Typography
          variant="h3"
          component="h1"
          sx={{
            fontSize: { xs: "1rem", sm: "1.5rem" },
            fontWeight: 600,
            color: "red",
            mb: 2,
          }}
        >
          Something went wrong.
        </Typography>
        <Typography
          sx={{
            fontSize: { xs: "1rem", sm: "1.2rem" },
            color: "red",
            mb: 4,
          }}
        >
          We'll clean up and try again.
        </Typography>
        <Box
          component="img"
          src={error}
          sx={{
            width: "30%",
            height: "auto",
            mb: 4,
          }}
        />
      </Paper>
    </Box>
  )

  // Render progress section
  const renderProgressSection = () => (
    <>
      <Typography
        variant="body2"
        sx={{
          marginBottom: 2,
          fontSize: '14px',
          fontWeight: 600,
          textAlign: 'center',
          paddingX: 1,
        }}
      >
        {(showTable && parseInt(progressPercentage) === 100) ? 'Report Generated' : 'Report Generating'}
      </Typography>
    </>
  )

  // Render report generation status
  const renderGenerationStatus = () => (
    <div>
      <Typography variant="h6" sx={{ mb: 2, fontSize: '18px', fontWeight: 600, textAlign: 'center' }}>
        Report Generating
      </Typography>
      <Typography
        sx={{
          marginBottom: 3,
          fontSize: '14px',
          fontWeight: 600,
          textAlign: 'center',
          paddingX: 1,
        }}
      >
        {showDummyData 
          ? DUMMY_STEPS[activeStep]?.label 
          : imageUrls[activeStep]?.title.split('(').map((word, index) => (
              index === 0 ? (
                <span key={index}>
                  {word.replace(/^\d+\.\s*/, '')}
                </span>
              ) : null
            ))
        }
      </Typography>
    </div>
  )

  // Render progress bar
  const renderProgressBar = () => (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        width: '50%',
        paddingX: 2,
      }}
    >
      <Typography
        variant="body2"
        sx={{ minWidth: '40px', textAlign: 'center' }}
      >
        {parseInt(progressPercentage)}%
      </Typography>
      <LinearProgress
        variant="determinate"
        value={progressPercentage}
        sx={{
          flex: 1,
          height: '10px',
          borderRadius: '5px',
        }}
      />
    </Box>
  )

  // Render 3D preview
  const render3DPreview = () => (
    <div>
      <Typography variant="h6" sx={{ mb: 2, fontSize: '18px', fontWeight: 600, textAlign: 'center' }}>
        3D preview of the selected model
      </Typography>
      <div className='clickoff'>
        <Stack className="forge-container">
          <ForgeViewerComponent
            fileId={cadFileId}
            accessToken={accessToken}
            setDimensions={getDimensions}
          />
        </Stack>
      </div>
    </div>
  )

  // Render action buttons
  const renderActionButtons = () => (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 2,
        mt: 4,
        flexDirection: { xs: 'column', md: 'row' },
        alignItems: 'flex-start',
      }}
    >
      {/* Left Column */}
      <Box sx={{ flex: { xs: '1 1 100%', md: '7' } }}>
        <Typography
          sx={{
            fontSize: { xs: '16px', sm: '18px' },
            fontWeight: 600,
          }}
          color="text.secondary"
        >
          <span style={{ color: 'black' }}>
            Get detailed reports with a breakdown of manufacturing costs and process details.
          </span>
        </Typography>
      </Box>

      {/* Right Column */}
      <Box
        sx={{
          flex: { xs: '1 1 100%', md: '5' },
          display: 'flex',
          flexWrap: 'wrap',
          gap: 2,
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'flex-end',
          alignItems: { xs: 'stretch', sm: 'center' },
        }}
      >
        <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 50%' } }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleDownloadPDF}
            startIcon={<DownloadIcon />}
            sx={{
              backgroundColor: '#0591FC',
              color: '#fff',
              borderRadius: '14px',
              fontSize: '12px',
              '&:hover': {
                backgroundColor: '#0591FC',
              },
            }}
            fullWidth
          >
            Download PDF
          </Button>
        </Box>
        <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 50%' } }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleDownloadExcel}
            startIcon={<ExcelIcon />}
            sx={{
              backgroundColor: '#0591FC',
              color: '#fff',
              borderRadius: '14px',
              fontSize: '12px',
              '&:hover': {
                backgroundColor: '#0591FC',
              },
            }}
            fullWidth
          >
            Export Excel
          </Button>
        </Box>
      </Box>
    </Box>
  )

  // Main render
  return (
    <Box sx={{ p: { xs: 0, sm: 3 }, margin: '0 auto' }}>
      {showPdfLoader && <Loader />}
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 3,
          flexDirection: {
            xs: parseInt(progressPercentage) === 100 ? 'column-reverse' : 'column',
            md: parseInt(progressPercentage) === 100 ? 'column-reverse' : 'row',
          },
        }}
      >
        {/* Left column - Progress/Status */}
        <Box
          sx={{
            flex: { xs: '1 1 100%', md: parseInt(progressPercentage) === 100 ? '1 1 100%' : '1 1 50%' },
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 5,
          }}
        >
          {parseInt(progressPercentage) === 100 
            ? renderProgressSection() 
            : renderGenerationStatus()}

          {parseInt(progressPercentage) !== 100 && renderProgressBar()}

          <Button
            variant="contained"
            color="primary"
            onClick={() => setOpenModal(false)}
            sx={{
              marginBottom: 3,
              padding: '12px 24px',
              backgroundColor: '#0591FC',
              color: '#fff',
              borderRadius: '14px',
              mt: 3,
              textTransform: 'none',
              '&:hover': {
                backgroundColor: '#0573C1',
              },
            }}
          >
            Select New Model
          </Button>
        </Box>

        {/* Right Column - 3D Preview */}
        <Box 
          sx={{
            flex: { xs: '1 1 100%', md: parseInt(progressPercentage) === 100 ? '1 1 100%' : '1 1 50%' },
          }}
          className="model-container"
        >
          {parseInt(progressPercentage) === 100 && render3DPreview()}
        </Box>
      </Box>

      {/* Results Section */}
      {(showTable && parseInt(progressPercentage) === 100) ? (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
            justifyContent: 'center',
            alignItems: 'center',
            mt: 4,
          }}
        >
          <Box>
            <Typography variant="body2" sx={{ mt: 2, fontSize: '18px', fontWeight: 600 }}>
              Check the calculation result below!
            </Typography>
          </Box>
          
          {/* Hidden PDF report for download */}
          <Box sx={{ mt: 4 }}>
            <div style={{ display: showPdfDiv ? 'block' : 'none' }} ref={componentRef}>
              <CostingReport 
                costData={costData} 
                uploadedFileName={uploadedFileName} 
                selectedMaterialGroupName={selectedMaterialGroupName} 
                selectedMaterialName={selectedMaterialName} 
                selectedSurfaceTreatmentName={selectedSurfaceTreatmentName} 
                quantity={quantity} 
              />
            </div>
            
            {/* Visible Report */}
            <CostingReportshow 
              costData={costData} 
              uploadedFileName={uploadedFileName} 
              selectedMaterialGroupName={selectedMaterialGroupName} 
              selectedMaterialName={selectedMaterialName} 
              selectedSurfaceTreatmentName={selectedSurfaceTreatmentName} 
              quantity={quantity} 
            />
            
            {/* Modify Button */}
            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => setOpenModal(false)}
                sx={{
                  padding: "12px 12px",
                  textAlign: "center",
                  backgroundColor: "#0591FC",
                  color: "#fff",
                  borderRadius: "14px",
                  cursor: "pointer",
                  "&:hover": {
                    backgroundColor: "#0591FC",
                  },
                }}
              >
                Modify Processing Data
              </Button>
            </Box>
            
            {/* Action Buttons */}
            {renderActionButtons()}
          </Box>
        </Box>
      ) : (
        tableError && parseInt(progressPercentage) === 100 ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 15, color: 'red' }}>
            <ErrorMessage />
          </div>
        ) : (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 15 }}>
            <CircularProgress />
          </div>
        )
      )}
    </Box>
  )
}