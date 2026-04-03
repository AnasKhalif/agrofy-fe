// React import not required with new JSX transform; keep file lean
import Box, { BoxProps } from '@mui/material/Box';
import { useTheme, alpha } from '@mui/material/styles';

type Variant = 'blue' | 'green' | 'orange' | 'gray' | 'red' | 'primary';

// allow arbitrary string to accept legacy names like 'standard'
export interface BadgeProps extends BoxProps {
  variant?: Variant | string;
  badgeContent?: number;
  color?: string;
}

/**
 * Badge component with default theme-based styles.
 * You can override styles from caller by providing a `className` that sets CSS variables:
 * --badge-bg, --badge-color, --badge-border
 * Example:
 * .myBadge { --badge-bg: pink; --badge-color: white; --badge-border: 1px solid red }
 */
export default function Badge({ variant = 'blue', children, className = '', sx, ...rest }: BadgeProps) {
  const theme = useTheme();

  const getComputed = (v: string) => {
    switch (v) {
      case 'green': {
        const bg = alpha(theme.palette.success.main, 0);
        const color = theme.palette.success.main;
        const border = `1px solid ${alpha(theme.palette.success.main, 0.28)}`;
        return { bg, color, border };
      }
      case 'red': {
        const bg = alpha(theme.palette.error.main, 0);
        const color = theme.palette.error.main;
        const border = `1px solid ${alpha(theme.palette.error.main, 0.28)}`;
        return { bg, color, border };
      }
      case 'orange': {
        const bg = alpha(theme.palette.warning.main, 0);
        const color = '#FFAE1F';
        const border = `1px solid ${alpha(color, 0.28)}`;
        return { bg, color, border };
      }
      case 'gray': {
        const bg = alpha(theme.palette.grey[200], 0);
        const color = '#2A354799';
        const border = `1px solid ${alpha('#2A354799', 0.28)}`;
        return { bg, color, border };
      }
      case 'primary': {
        // fallback to CSS variables used elsewhere in the project when available
        const bg = 'rgba(var(--color-primary-rgb), 0)';
        const color = 'var(--color-primary)';
        const border = '1px solid rgba(var(--color-primary-rgb), 0.28)';
        return { bg, color, border };
      }
      case 'light-green': {
          const bg = alpha(theme.palette.grey[200], 0);
          const color = '#0BB193';
          const border = `1px solid ${alpha('#0BB193', 0.28)}`;
          return { bg, color, border };
      }
      case 'paid': {
          const bg = alpha(theme.palette.grey[200], 0);
          const color = '#0BB193';
          const border = `1px solid ${alpha('#0BB193', 0.28)}`;
          return { bg, color, border };
      }
      case 'arrived': {
          const bg = alpha(theme.palette.grey[200], 0);
          const color = '#B1920B';
          const border = `1px solid ${alpha('#B1920B', 0.28)}`;
          return { bg, color, border };
      }
      case 'scheduled': {
          const bg = alpha(theme.palette.grey[200], 0);
          const color = '#D6C90B';
          const border = `1px solid ${alpha('#D6C90B', 0.28)}`;
          return { bg, color, border };
      }
      case 'in_progress': {
          const bg = alpha(theme.palette.grey[200], 0);
          const color = '#539BFF';
          const border = `1px solid ${alpha('#539BFF', 0.28)}`;
          return { bg, color, border };
      }
      case 'rescheduled': {
          const bg = alpha(theme.palette.grey[200], 0);
          const color = '#881FFF';
          const border = `1px solid ${alpha('#881FFF', 0.28)}`;
          return { bg, color, border };
      }
      case 'blue':
      default: {
        const bg = alpha(theme.palette.primary.main, 0);
        const color = '#539BFF';
        const border = `1px solid ${alpha('#539BFF', 0.28)}`;
        return { bg, color, border };
      }
    }
  };

  const computed = getComputed(variant);

  const mergedSx = {
    display: 'inline-block',
    px: 1.5,
    py: '4px',
    fontSize: '0.75rem',
    borderRadius: '6px',
    fontWeight: 600,
    lineHeight: 1,
    textTransform: 'none',
    verticalAlign: 'middle',
    // Use CSS variables so a caller's classname can override these values
    backgroundColor: `var(--badge-bg, ${computed.bg})`,
    color: `var(--badge-color, ${computed.color})`,
    border: `var(--badge-border, ${computed.border})`,
    ...sx,
  } as const;

  return (
    <Box component="span" className={className} sx={mergedSx} {...rest}>
      {children}
    </Box>
  );
}
