import { Box, Stack, Typography, Divider } from "@mui/material";
import type { ReconciliationRow,ReconciliationStatusKey } from "../types";


interface Props {
  row: ReconciliationRow;
  statusDictionary: Partial<Record<ReconciliationStatusKey, string>>;
}

function Field({
  label,
  value,
}: {
  label: string;
  value: string | null | undefined;
}) {
  return (
    <Stack spacing={0.25}>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body2">
        {value && value.trim() !== "" ? value : "—"}
      </Typography>
    </Stack>
  );
}

export function ReconciliationRowDetails({ row, statusDictionary}: Props) {
  return (
    <Box
      sx={{
        p: 2.5,
        bgcolor: "background.default",
        borderTop: 1,
        borderColor: "divider",
      }}
    >
      <Stack spacing={3}>
        {/* HEADER */}
        <Typography variant="subtitle2">
          Reconciliation details
        </Typography>

        {/* BASIC IDENTIFIERS */}
        <Stack
          direction="row"
          spacing={4}
          sx={{ flexWrap: "wrap" }}
        >
          <Field label="Job ID" value={row.jobId} />
          <Field label="Certification ID" value={row.certificationId} />
          <Field label="Request ID" value={row.requestId} />
          <Field label="Reconciliation Type" value={row.reconciliationType} />
        </Stack>

        <Divider />

        {/* STATUS & TIMING */}
        <Stack
          direction="row"
          spacing={4}
          sx={{ flexWrap: "wrap" }}
        >
          <Field label="Job Status" value={row.jobStatus} />
          <Field
            label="Certification Status"
            value={statusDictionary[row.statusKey] ?? row.statusKey}
          />
          <Field label="Start Time" value={row.startTime} />
          <Field label="End Time" value={row.endTime} />
          <Field label="Due Date" value={row.dueDate} />
        </Stack>

        <Divider />

        {/* ORGANIZATIONAL CONTEXT */}
        <Stack
          direction="row"
          spacing={4}
          sx={{ flexWrap: "wrap" }}
        >
          <Field label="Company Code" value={row.companyCode} />
          <Field label="Account" value={row.account} />
          <Field label="Account Group" value={row.accountGroup} />
          <Field label="Account Category" value={row.accountCategory} />
          <Field label="Currency" value={row.currency} />
        </Stack>

        <Divider />

        {/* RESPONSIBILITIES */}
        <Stack
          direction="row"
          spacing={4}
          sx={{ flexWrap: "wrap" }}
        >
          <Field label="Preparer" value={row.preparer} />
          <Field
            label="Preparer Responder"
            value={row.preparerResponder}
          />
          <Field label="Approver" value={row.approver} />
          <Field
            label="Approver Responder"
            value={row.approverResponder}
          />
          <Field label="Reviewer" value={row.reviewer} />
          <Field
            label="Reviewer Responder"
            value={row.reviewerResponder}
          />
        </Stack>

        <Divider />

        {/* TIMESTAMPS */}
        <Stack
          direction="row"
          spacing={4}
          sx={{ flexWrap: "wrap" }}
        >
          <Field
            label="Preparer Timestamp"
            value={row.preparerTimestamp}
          />
          <Field
            label="Approver Timestamp"
            value={row.approverTimestamp}
          />
          <Field
            label="Reviewer Timestamp"
            value={row.reviewerTimestamp}
          />
        </Stack>

        <Divider />

        {/* BALANCES */}
        <Stack
          direction="row"
          spacing={4}
          sx={{ flexWrap: "wrap" }}
        >
          <Field label="SAP Balance" value={row.sapBalance} />
          <Field
            label="Analyzed Balance"
            value={`${row.analyzedBalance} (${row.analyzedQuantity})`}
          />
          <Field
            label="Unanalyzed Balance"
            value={`${row.unanalyzedBalance} (${row.unanalyzedQuantity})`}
          />
        </Stack>

        <Divider />

        {/* AUTO CERTIFICATION */}
        <Stack
          direction="row"
          spacing={4}
          sx={{ flexWrap: "wrap" }}
        >
          <Field
            label="Auto Certification Rule"
            value={row.autoCertificationRule}
          />
          <Field
            label="Auto Certified"
            value={row.autoCertified}
          />
        </Stack>

        <Divider />

        {/* COMMENTS */}
        <Stack spacing={2}>
          <Field
            label="Preparer Comment"
            value={row.preparerComment}
          />
          <Field
            label="Approver Comment"
            value={row.approverComment}
          />
          <Field
            label="Reviewer Comment"
            value={row.reviewerComment}
          />
        </Stack>
      </Stack>
    </Box>
  );
}