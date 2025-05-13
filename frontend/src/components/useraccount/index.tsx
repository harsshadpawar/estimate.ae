import { Box, Container, Grid } from "@mui/material"
import { SupportCard } from "./components/SupportCard"
import { DeleteAccount } from "./components/DeleteAccount"
import { ActivePlan } from "./components/ActivePlan"
import { BillingAddress } from "./components/BillingAddress"

export default function AccountPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <ActivePlan />
        </Grid>
        <Grid item xs={12} md={6}>
          <BillingAddress />
        </Grid>
        <Grid item xs={12}>
          <Box sx={{ mb: 4 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <SupportCard
                  title="FAQs"
                  description="Need help configuring your settings? Check out our FAQ section for step-by-step guidance to meet your needs."
                  link="/faqs"
                  linkText="View FAQs"
                  icon="faq"
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <SupportCard
                  title="Support"
                  description="Need direct assistance? Contact our support team by phone, email, or chat. We're here to answer your questions."
                  link="/support"
                  linkText="View Support"
                  icon="support"
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <SupportCard
                  title="Help"
                  description="Need help? Our Customer Support team is here to assist you with any questions or issues."
                  link="/help"
                  linkText="Help Center"
                  icon="help"
                />
              </Grid>
            </Grid>
          </Box>
          <DeleteAccount />
        </Grid>
      </Grid>
    </Container>
  )
}

