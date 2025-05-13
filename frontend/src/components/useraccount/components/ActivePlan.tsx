import { Box, Button, Typography } from "@mui/material"
import { Plus } from 'lucide-react'
import { SectionHeader } from "./SectionHeader"
import { InfoRow } from "./InfoRow"

export function ActivePlan() {
  return (
    <Box sx={{ mb: 3 }}>
      <SectionHeader title="Active Plan" />
      <Box sx={{ bgcolor: "background.paper", p: 3, borderRadius: "0 0 8px 8px" }}>
        <Box sx={{ mb: 3 }}>
          <InfoRow label="Active plan" value="Free" />
          <InfoRow label="Plan ends on" value="11/23/2024 01:43:47 PM IST" />
        </Box>
        
        <Box sx={{ bgcolor: "grey.50", p: 2, textAlign: "center", borderRadius: 1, mb: 3 }}>
          <Typography variant="body2">
            REMAINING CALCULATIONS{" "}
            <Typography component="span" fontWeight="medium">
              200
            </Typography>
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<Plus className="h-4 w-4" />}
          sx={{ borderRadius: 28 }}
        >
          Upgrade Calculation Packages
        </Button>
      </Box>
    </Box>
  )
}

