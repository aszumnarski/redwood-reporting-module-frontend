import {
    Dialog,
    DialogTitle,
    DialogContent,
    Typography,
    Stack,
  } from "@mui/material";
  import type { ApplicationInfo } from "../types";
  
  interface AboutDialogProps {
    open: boolean;
    onClose: () => void;
    info: ApplicationInfo;
  }
  
  export function AboutDialog({ open, onClose, info }: AboutDialogProps) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>About</DialogTitle>
  
        <DialogContent>
          <Stack spacing={1}>
            <Typography variant="subtitle1">
              {info.applicationName}
            </Typography>
  
            <Typography variant="body2">
              UI version: {info.uiVersion}
            </Typography>
  
            <Typography variant="body2">
              UI build time: {info.uiBuildTime}
            </Typography>
  
            <Typography variant="body2">
              Backend version: {info.backendVersion}
            </Typography>
  
            <Typography variant="body2">
              Backend build time: {info.backendBuildTime}
            </Typography>
  
            <Typography variant="body2">
              Environment: {info.environment}
            </Typography>
  
            <Typography variant="body2" sx={{ mt: 2 }}>
              Support: {info.supportContact}
            </Typography>
          </Stack>
        </DialogContent>
      </Dialog>
    );
  }
  