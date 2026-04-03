import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/shared/components/agrofy-ui/ui/alert-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/agrofy-ui/ui/dropdown-menu';
import { Tooltip } from '@mui/material';
import { MoreVertical } from 'lucide-react';
import { useState } from 'react';
import { AgrofyTableAction } from '../AgrofyTable.types';
import { Button } from '@/shared/components/agrofy-ui';

interface AgrofyTableActionsProps<TData = any> {
  row: TData;
  actions: AgrofyTableAction<TData>[];
  actionType?: 'button' | 'dropdown';
}

export function AgrofyTableActions<TData = any>({
  row,
  actions,
}: AgrofyTableActionsProps<TData>) {
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    action: AgrofyTableAction<TData> | null;
  }>({
    isOpen: false,
    action: null,
  });

  const handleActionClick = (action: AgrofyTableAction<TData>) => {
    if (action.needsConfirmation) {
      setConfirmDialog({
        isOpen: true,
        action,
      });
    } else {
      action.onClick(row);
    }
  };

  const handleConfirm = () => {
    if (confirmDialog.action) {
      confirmDialog.action.onClick(row);
    }
    setConfirmDialog({ isOpen: false, action: null });
  };

  const handleCancel = () => {
    setConfirmDialog({ isOpen: false, action: null });
  };

  const getActionDisabled = (action: AgrofyTableAction<TData>): boolean => {
    if (typeof action.disabled === 'function') {
      return action.disabled(row);
    }
    return action.disabled || false;
  };

  const getID = (id?: string) => {
    if (id) {
      return id;
    }
    return;
  }

  const getColorClass = (color?: string) => {
    switch (color) {
      case 'error':
        return 'text-red-600 focus:text-red-600';
      default:
        return ''; // No color class for default actions (black text)
    }
  };

  if (actions.length === 0) {
    return null;
  }

  // Separate actions into direct buttons and dropdown items
  const directActions = actions.filter(action => action.showAsButton);
  const dropdownActions = actions.filter(action => !action.showAsButton);

  // If only direct actions and no dropdown, render only buttons
  if (directActions.length > 0 && dropdownActions.length === 0) {
    return (
      <>
        <div className="flex items-center justify-end">
          {directActions.map((action, index) => {
            const isDisabled = getActionDisabled(action);
            return (
              <Tooltip key={index} title={action.label || ''}>
                <Button
                  id={getID(action.id)}
                  variant="ghost"
                  size="sm"
                  onClick={() => handleActionClick(action)}
                  disabled={isDisabled}
                  className={`h-8 w-8 p-0 ${getColorClass(action.color)}`}
                  color={action.color}
                >
                  {action.icon}
                </Button>
              </Tooltip>
            );
          })}
        </div>

        {confirmDialog.action && (
          <AlertDialog open={confirmDialog.isOpen} onOpenChange={handleCancel}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  {confirmDialog.action.confirmationTitle || 'Are you sure?'}
                </AlertDialogTitle>
                <AlertDialogDescription>
                  {confirmDialog.action.confirmationMessage
                    ? confirmDialog.action.confirmationMessage(row)
                    : 'This action cannot be undone.'}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className='' onClick={handleCancel}>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleConfirm}
                  className={confirmDialog.action?.confirmationType === 'danger' ? 'bg-red-600 hover:bg-red-700' : 'bg-primary/90 hover:bg-primary'}
                >
                  Confirm
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </>
    );
  }

  // If only dropdown actions and no buttons
  if (directActions.length === 0 && dropdownActions.length > 0) {
    return (
      <>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              id={(row as any).id ? `row-action-button-${(row as any).id}` : undefined}
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 focus:outline-none focus:ring-0 focus-visible:ring-0"
              color="gray"
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className='min-w-48'>
            {dropdownActions.map((action, index) => {
              const isDisabled = getActionDisabled(action);
              return (
                <DropdownMenuItem
                  id={getID(action.id)}
                  key={index}
                  onClick={() => !isDisabled && handleActionClick(action)}
                  disabled={isDisabled}
                  className={`${getColorClass(action.color)} hover:ring-0 hover:border-0 focus:outline-none focus:ring-0 focus-visible:ring-0 hover:outline-none ring-0`}
                >
                  {action.icon}
                  {action.label && <span className="ml-2">{action.label}</span>}
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>

        {confirmDialog.action && (
          <AlertDialog open={confirmDialog.isOpen} onOpenChange={handleCancel}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  {confirmDialog.action.confirmationTitle || 'Are you sure?'}
                </AlertDialogTitle>
                <AlertDialogDescription>
                  {confirmDialog.action.confirmationMessage
                    ? confirmDialog.action.confirmationMessage(row)
                    : 'This action cannot be undone.'}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel id='dialog-cancel-button' onClick={handleCancel}>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  id='dialog-confirm-button'
                  onClick={handleConfirm}
                  className={confirmDialog.action?.confirmationType === 'danger' ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'}
                >
                  Confirm
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </>
    );
  }

  // Mixed: both direct buttons and dropdown menu
  return (
    <>
      <div className="flex items-center justify-end gap-0">
        {/* Direct action buttons */}
        {directActions.map((action, index) => {
          const isDisabled = getActionDisabled(action);
          return (
            <Tooltip key={`direct-${index}`} title={action.label || ''}>
              <Button
                id={getID(action.id)}
                variant="ghost"
                size="sm"
                onClick={() => handleActionClick(action)}
                disabled={isDisabled}
                className={`h-8 w-8 p-0 ${getColorClass(action.color)}`}
                color={action.color}
              >
                {action.icon}
              </Button>
            </Tooltip>
          );
        })}

        {/* Dropdown for remaining actions */}
        {dropdownActions.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                id={(row as any).id ? `row-action-button-${(row as any).id}` : undefined}
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 focus:outline-none focus:ring-0 focus-visible:ring-0"
                color="gray"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className='min-w-48'>
              {dropdownActions.map((action, index) => {
                const isDisabled = getActionDisabled(action);
                return (
                  <DropdownMenuItem
                    id={getID(action.id)}
                    key={`dropdown-${index}`}
                    onClick={() => !isDisabled && handleActionClick(action)}
                    disabled={isDisabled}
                    className={`${getColorClass(action.color)} hover:ring-0 hover:border-0 focus:outline-none focus:ring-0 focus-visible:ring-0 hover:outline-none ring-0`}
                  >
                    {action.icon}
                    {action.label && <span className="ml-2">{action.label}</span>}
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {confirmDialog.action && (
        <AlertDialog open={confirmDialog.isOpen} onOpenChange={handleCancel}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {confirmDialog.action.confirmationTitle || 'Are you sure?'}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {confirmDialog.action.confirmationMessage
                  ? confirmDialog.action.confirmationMessage(row)
                  : 'This action cannot be undone.'}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel id='dialog-cancel-button' onClick={handleCancel}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                id='dialog-confirm-button'
                onClick={handleConfirm}
                className={confirmDialog.action?.confirmationType === 'danger' ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'}
              >
                Confirm
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
}