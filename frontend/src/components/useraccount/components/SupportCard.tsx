import { Box, Link, Typography } from "@mui/material"
import { HelpCircle, MessageCircle, FileQuestion } from 'lucide-react'
import { ReactNode } from "react"

interface SupportCardProps {
  title: string
  description: string
  link: string
  linkText: string
  icon: "faq" | "support" | "help"
}

export function SupportCard({ title, description, link, linkText, icon }: SupportCardProps) {
  const Icon = (): ReactNode => {
    switch (icon) {
      case "faq":
        return <FileQuestion className="h-5 w-5 text-blue-500" />
      case "support":
        return <MessageCircle className="h-5 w-5 text-blue-500" />
      case "help":
        return <HelpCircle className="h-5 w-5 text-blue-500" />
    }
  }

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
        {Icon()}
        <Typography variant="subtitle2" fontWeight="medium">
          {title}
        </Typography>
      </Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
        {description}
      </Typography>
      <Link href={link} underline="hover" sx={{ typography: "body2" }}>
        {linkText}
      </Link>
    </Box>
  )
}

