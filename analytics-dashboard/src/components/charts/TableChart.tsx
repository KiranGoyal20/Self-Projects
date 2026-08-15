import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import type { TableColumn, TableRow as DataRow } from '../../types/dashboard'

interface Props {
  columns: TableColumn[]
  rows: DataRow[]
}

export function TableChart({ columns, rows }: Props) {
  return (
    <TableContainer
      component={Paper}
      elevation={0}
      sx={{ height: '100%', maxHeight: '100%', bgcolor: 'transparent' }}
    >
      <Table stickyHeader size="small">
        <TableHead>
          <TableRow>
            {columns.map((col) => (
              <TableCell
                key={col.field}
                align={col.align ?? 'left'}
                sx={{ fontWeight: 700, bgcolor: 'background.paper' }}
              >
                {col.headerName}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id} hover>
              {columns.map((col) => (
                <TableCell key={col.field} align={col.align ?? 'left'}>
                  {typeof row[col.field] === 'number'
                    ? (row[col.field] as number).toLocaleString()
                    : String(row[col.field] ?? '')}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
