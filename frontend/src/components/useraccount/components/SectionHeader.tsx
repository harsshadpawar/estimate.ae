import { Box, Typography, IconButton } from "@mui/material"
import { Pencil } from 'lucide-react'

interface SectionHeaderProps {
  title: string
  showEdit?: boolean
  onEdit?: () => void
}

export function SectionHeader({ title, showEdit = false, onEdit }: SectionHeaderProps) {
  return (
    <Box
      sx={{
        bgcolor: "rgb(219, 238, 254)",
        p: 2,
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Typography variant="subtitle1" fontWeight="medium">
        {title}
      </Typography>
      {showEdit && (
        <IconButton size="small" onClick={onEdit}>
          <Pencil className="h-4 w-4" />
        </IconButton>
      )}
    </Box>
  )
}

