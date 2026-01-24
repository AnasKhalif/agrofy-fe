import MuiDialog, { DialogProps as MuiDialogProps } from "@mui/material/Dialog";
import MuiDialogTitle, {
  DialogTitleProps as MuiDialogTitleProps,
} from "@mui/material/DialogTitle";
import MuiDialogContent, {
  DialogContentProps as MuiDialogContentProps,
} from "@mui/material/DialogContent";
import MuiDialogActions, {
  DialogActionsProps as MuiDialogActionsProps,
} from "@mui/material/DialogActions";
import React from "react";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  IconButton,
} from "@/shared/components/agrofy-ui-legacy";
import { IconX } from "@tabler/icons-react";
import ThemeText from "@/shared/theme/themeText";

export type DialogProps = MuiDialogProps;
export type DialogTitleProps = MuiDialogTitleProps;
export type DialogContentProps = MuiDialogContentProps;
export type DialogActionsProps = MuiDialogActionsProps;

// Base dialog wrapper
export const BaseDialog = React.forwardRef<HTMLDivElement, DialogProps>(
  (props, ref) => {
    return <MuiDialog ref={ref} {...props} />;
  },
);

export const DialogTitle = React.forwardRef<HTMLDivElement, DialogTitleProps>(
  (props, ref) => {
    return <MuiDialogTitle ref={ref} {...props} />;
  },
);

export const DialogContent = React.forwardRef<
  HTMLDivElement,
  DialogContentProps
>((props, ref) => {
  return <MuiDialogContent ref={ref} {...props} />;
});

export const DialogActions = React.forwardRef<
  HTMLDivElement,
  DialogActionsProps
>((props, ref) => {
  return <MuiDialogActions ref={ref} {...props} />;
});

BaseDialog.displayName = "BaseDialog";
DialogTitle.displayName = "DialogTitle";
DialogContent.displayName = "DialogContent";
DialogActions.displayName = "DialogActions";

/**
 * StandardDialog - standardized dialog with header/body/footer
 */
export interface DialogAction {
  label: string;
  onClick: () => void;
  variant?: "solid" | "outlined" | "ghost" | "link";
  color?:
    | "primary"
    | "secondary"
    | "error"
    | "warning"
    | "info"
    | "success"
    | "gray";
  disabled?: boolean;
  loading?: boolean;
  startIcon?: React.ReactNode;
  id?: string;
}

export interface StandardDialogProps extends Omit<DialogProps, "title"> {
  title: string;
  description?: string;
  children: React.ReactNode;
  actions?: DialogAction[];
  loading?: boolean;
  footer?: React.ReactNode;
  maxWidth?: "xs" | "sm" | "md" | "lg" | "xl" | false;
  fullWidth?: boolean;
}

export const StandardDialog: React.FC<StandardDialogProps> = ({
  title,
  description,
  children,
  actions,
  loading = false,
  footer,
  maxWidth = "md",
  fullWidth = true,
  open,
  onClose,
  ...dialogProps
}) => {
  return (
    <BaseDialog
      open={open}
      onClose={onClose}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      PaperProps={{
        sx: {
          p: 0,
          minHeight: 100,
          maxHeight: "90vh",
          ...dialogProps.PaperProps?.sx,
        },
        ...dialogProps.PaperProps,
      }}
      {...dialogProps}
    >
      {/* Header */}
      <DialogTitle
        sx={{
          px: "24px",
          py: "16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          "&.MuiTypography-root": {
            paddingBottom: description ? 2 : 2,
            borderBottom: "1px solid",
            borderColor: "divider",
          },
        }}
      >
        <Box>
          <Typography
            variant="h5"
            component="div"
            sx={{ ...ThemeText.HeadingH5, fontWeight: 700 }}
          >
            {title}
          </Typography>
        </Box>

        {/* Close button */}
        <IconButton
          id="dialog-close-button"
          sx={{ width: "24px", height: "24px" }}
          onClick={() => onClose?.({}, "escapeKeyDown")}
          aria-label="close"
          size="small"
        >
          <IconX size={"24px"} />
        </IconButton>
      </DialogTitle>

      {/* Body */}
      <DialogContent sx={{ my: 0, py: 0, px: 3 }}>
        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              py: 4,
              height: "300px",
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <Box sx={{ py: 1 }}>{children}</Box>
        )}
      </DialogContent>

      {/* Footer */}
      {(footer || actions) && (!loading || !!footer) && (
        <DialogActions
          sx={{
            px: 3,
            pb: 3,
            pt: 3,
            height: "72px",
            bgcolor: "#FAFBFB",
            display: "flex",
          }}
        >
          {footer ? (
            footer
          ) : (
            <>
              {actions?.map((action, index) => (
                <Button
                  className="w-fit"
                  key={action.id || `action-${index}`}
                  onClick={action.onClick}
                  variant={action.variant || "solid"}
                  color={action.color}
                  disabled={action.disabled || action.loading}
                  startIcon={
                    action.loading ? (
                      <CircularProgress size={16} />
                    ) : (
                      action.startIcon
                    )
                  }
                  id={action.id}
                  fullWidth
                >
                  {action.label}
                </Button>
              ))}
            </>
          )}
        </DialogActions>
      )}
    </BaseDialog>
  );
};

StandardDialog.displayName = "Dialog";

// Export StandardDialog as the main Dialog component
export { StandardDialog as Dialog };
