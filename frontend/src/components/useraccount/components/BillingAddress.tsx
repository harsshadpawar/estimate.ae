import { Box, Button } from "@mui/material"
import { ArrowRight } from 'lucide-react'
import { SectionHeader } from "./SectionHeader"
import { InfoRow } from "./InfoRow"

export function BillingAddress() {
  return (
    <Box sx={{ mb: 3 }}>
      <SectionHeader title="Billing Address Management" showEdit />
      <Box sx={{ bgcolor: "background.paper", p: 3, borderRadius: "0 0 8px 8px" }}>
        <Box sx={{ mb: 3 }}>
          <InfoRow label="Company" value="Ratke, Simonis and Kertzmann" />
          <InfoRow label="Street Address" value="2109 N 4th St" />
          <InfoRow label="Zip Code" value="86004" />
          <InfoRow label="City" value="Flagstaff" />
          <InfoRow label="Country" value="USA" />
          <InfoRow label="Invoice email address" value="info@rsak.com" />
        </Box>

        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            variant="contained"
            endIcon={<ArrowRight className="h-4 w-4" />}
            sx={{ borderRadius: 28 }}
          >
            Show Invoices
          </Button>
        </Box>
      </Box>
    </Box>
  )
}

