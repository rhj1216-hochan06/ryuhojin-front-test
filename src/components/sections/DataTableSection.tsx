import type { DeliveryRow, PortfolioGridRow } from '../../types/dashboard';
import type { CustomGridCopy, SectionCopy, TableHeaders } from '../../i18n/dictionary';
import { CustomDataGrid } from '../../features/dataGrid/CustomDataGrid';
import { Card } from '../ui/Card';
import { Section } from '../ui/Section';

interface DataTableSectionProps {
  section: SectionCopy;
  dataGridCard: {
    title: string;
    description: string;
  };
  customGridCopy: CustomGridCopy;
  headers: TableHeaders;
  rows: DeliveryRow[];
  gridRows: PortfolioGridRow[];
}

export const DataTableSection = ({
  section,
  dataGridCard,
  customGridCopy,
  headers,
  rows,
  gridRows,
}: DataTableSectionProps) => (
  <Section
    id="delivery"
    eyebrow={section.eyebrow}
    title={section.title}
    description={section.description}
  >
    <Card
      title={dataGridCard.title}
      description={dataGridCard.description}
    >
      <CustomDataGrid rows={gridRows} copy={customGridCopy} />
    </Card>
    <Card>
      <div className="table-scroll">
        <table className="data-table">
          <thead>
            <tr>
              <th scope="col">{headers.project}</th>
              <th scope="col">{headers.domain}</th>
              <th scope="col">{headers.status}</th>
              <th scope="col">{headers.leadTime}</th>
              <th scope="col">{headers.chartCoverage}</th>
              <th scope="col">{headers.apiContract}</th>
              <th scope="col">{headers.updatedAt}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td>
                  <strong>{row.project}</strong>
                  <small>{row.id}</small>
                </td>
                <td>{row.domain}</td>
                <td>
                  <span className={`status status--${row.status.toLowerCase()}`}>
                    {headers.statusLabels[row.status]}
                  </span>
                </td>
                <td>{`${row.leadTimeDays}${headers.leadTimeUnitLabel}`}</td>
                <td>{row.chartCoverage}%</td>
                <td>{row.apiContract}</td>
                <td>{row.updatedAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  </Section>
);
