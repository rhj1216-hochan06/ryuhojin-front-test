import type { PortfolioGridRow } from '../../types/dashboard';
import type { CustomGridCopy, InfiniteTableCopy, SectionCopy } from '../../i18n/dictionary';
import { CustomDataGrid } from '../../features/dataGrid/CustomDataGrid';
import { InfiniteRenderTable } from '../../features/dataGrid/InfiniteRenderTable';
import { Card } from '../ui/Card';
import { Section } from '../ui/Section';

interface DataTableSectionProps {
  section: SectionCopy;
  dataGridCard: {
    title: string;
    description: string;
  };
  customGridCopy: CustomGridCopy;
  infiniteTableCopy: InfiniteTableCopy;
  gridRows: PortfolioGridRow[];
}

export const DataTableSection = ({
  section,
  dataGridCard,
  customGridCopy,
  infiniteTableCopy,
  gridRows,
}: DataTableSectionProps) => (
  <Section
    id="data-grid"
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
    <Card
      title={infiniteTableCopy.title}
      description={infiniteTableCopy.description}
    >
      <InfiniteRenderTable copy={infiniteTableCopy} />
    </Card>
  </Section>
);
