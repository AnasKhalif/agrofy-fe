import React, { useState } from "react";
import { Dialog } from "../../Dialog";
import { Box } from "../../Box";
import { IconButton } from "../../IconButton";
import { Typography } from "../../Typography";
import { IconDotsVertical } from "@tabler/icons-react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Tooltip from "@mui/material/Tooltip";
import type { AgrofyTableAction } from "../AgrofyTable.types";

interface AgrofyTableActionsProps<TData> {
  row: TData;
  actions: AgrofyTableAction<TData>[];
}

export function AgrofyTableActions<TData>({
  row,
  actions,
}: AgrofyTableActionsProps<TData>) {
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    action: AgrofyTableAction<TData> | null;
  }>({
    open: false,
    action: null,
  });

  // More menu state
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const openMenu = (e: React.MouseEvent<HTMLElement>) =>
    setMenuAnchor(e.currentTarget);
  const closeMenu = () => setMenuAnchor(null);

  const handleActionClick = (action: AgrofyTableAction<TData>) => {
    if (action.needsConfirmation) {
      setConfirmDialog({ open: true, action });
    } else {
      action.onClick(row);
    }
  };

  const handleConfirm = () => {
    if (confirmDialog.action) {
      confirmDialog.action.onClick(row);
    }
    setConfirmDialog({ open: false, action: null });
  };

  const handleCancel = () => {
    setConfirmDialog({ open: false, action: null });
  };

  const getID = (id?: string) => {
    if (id) {
      return id;
    }
    return;
  };

  const isDisabled = (action: AgrofyTableAction<TData>): boolean => {
    if (typeof action.disabled === "function") {
      return action.disabled(row);
    }
    return action.disabled || false;
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          gap: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {actions.map((action, index) => {
          // If action provides menuItems, render a More button instead
          if (action.menuItems && action.menuItems.length > 0) {
            return (
              <Tooltip key={index} title={action.tooltip || ""} arrow>
                <IconButton
                  size="small"
                  color={action.color || "default"}
                  onClick={openMenu}
                >
                  <IconDotsVertical size={18} />
                </IconButton>
              </Tooltip>
            );
          }

          const button = (
            <IconButton
              key={index}
              size="small"
              id={getID(action.id)}
              color={action.color || "default"}
              onClick={() => handleActionClick(action)}
              disabled={isDisabled(action)}
            >
              {action.icon}
            </IconButton>
          );

          // Wrap with Tooltip if tooltip text is provided
          if (action.tooltip) {
            return (
              <Tooltip key={index} title={action.tooltip} arrow>
                <span>{button}</span>
              </Tooltip>
            );
          }

          return button;
        })}
      </Box>

      {/* More menu rendered via MUI Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={closeMenu}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        MenuListProps={{ onMouseDown: (e: any) => e.stopPropagation() }}
      >
        {actions.flatMap((action) =>
          (action.menuItems || []).map((item, idx) => (
            <MenuItem
              key={item.label + idx}
              id={getID(item.id)}
              onClick={() => {
                closeMenu();
                item.onClick(row);
              }}
              sx={item.destructive ? { color: "error.main" } : undefined}
              divider={!!item.divider}
            >
              {item.label}
            </MenuItem>
          )),
        )}
      </Menu>

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmDialog.open}
        onClose={handleCancel}
        className=""
        title={confirmDialog.action?.confirmationTitle || ""}
        maxWidth="xs"
        PaperProps={{ sx: { minHeight: "80px", p: 0 } }}
        actions={[
          {
            label: "Cancel",
            onClick: handleCancel,
            disabled: false,
            variant: "outlined",
            color: "gray",
          },
          {
            label: "Confirm",
            onClick: handleConfirm,
            color:
              confirmDialog.action?.confirmationType === "danger"
                ? "error"
                : "primary",
            variant: "solid",
          },
        ]}
      >
        <Typography
          sx={{
            alignContent: "center",
            alignItems: "center",
            pt: 2,
          }}
        >
          {confirmDialog.action?.confirmationMessage
            ? confirmDialog.action.confirmationMessage(row)
            : ""}
        </Typography>
      </Dialog>
    </>
  );
}
