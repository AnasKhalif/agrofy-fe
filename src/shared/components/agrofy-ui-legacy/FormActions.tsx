import React from "react";
import { Box } from "./Box";
import { Button } from "./Button";
import { Card, CardContent } from "./Card";
import { Paper } from "./Paper";

interface FormActionsProps {
  id?: string;
  onCancel?: () => void;
  onSubmit?: (e: any) => void;
  onDraft?: (e: any) => void;
  cancelText?: string;
  submitText?: string;
  draftText?: string;
  prefixIcon?: React.ReactNode;
  disabled?: boolean;
}

export const FormActions: React.FC<FormActionsProps> = ({
  id,
  onCancel,
  onSubmit,
  onDraft,
  cancelText = 'Batalkan',
  submitText = 'Lanjutkan',
  draftText = 'Simpan Draft',
  prefixIcon,
  disabled = false,
}) => {
  return (
    <Paper
      sx={{
        position: 'sticky',
        bottom: 24,
        zIndex: 1,
        boxShadow: '0px 0px 20px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Card>
        <CardContent>
          <Box display="flex" gap={2}>
            {onCancel && (
              <Button id={`${id}-cancel-button`} variant="accent" onClick={onCancel} disabled={disabled}>
                {cancelText}
              </Button>
            )}
            {onDraft && (
              <Button id={`${id}-draft-button`} variant="outlined" color="primary" onClick={onDraft} disabled={disabled}>
                {draftText}
              </Button>
            )}
            {onSubmit && (
              <Button startIcon={prefixIcon} id={`${id}-submit-button`} variant="solid" color="primary" type="submit" onClick={onSubmit} disabled={disabled}>
                {submitText}
              </Button>
            )}
          </Box>
        </CardContent>
      </Card>
    </Paper>
  );
};
