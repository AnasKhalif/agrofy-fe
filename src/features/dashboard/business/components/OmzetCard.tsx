import { Card, CardContent, Typography, Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";

interface OmzetCardProps {
  label: string;
  value: string | number;
  description?: string;
  className?: string;
}

export default function OmzetCard({
  label,
  value,
  description = "",
  className = "",
}: OmzetCardProps) {
  const theme = useTheme();

  return (
    <Card
      elevation={0}
      className={className}
      sx={{
        borderRadius: "8px",
        height: 132,
        bgcolor: theme.palette.background.paper,
        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.04)",
      }}
    >
      <CardContent
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          textAlign: "left",
          gap: 1.5,
        }}
      >
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 700,
            fontSize: "18px",
            color: "#2A3547CC",
            opacity: 0.8,
          }}
        >
          {label}
        </Typography>

        <Box>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              fontSize: "24px",
              color: theme.palette.primary.main,
            }}
          >
            {value}
          </Typography>

          {description && (
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: "12px",
                mt: 0.5,
                color: theme.palette.primary.main,
                opacity: 0.4,
              }}
            >
              {description}
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}
