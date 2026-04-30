import { DataTableSection } from '../components/sections/DataTableSection';
import type { DashboardDictionary } from '../i18n/dictionary';
import type { DashboardPayload } from '../types/dashboard';
import { PageIntro } from './PageIntro';

interface DataGridPageProps {
  copy: DashboardDictionary;
  payload?: DashboardPayload;
}

export const DataGridPage = ({ copy, payload }: DataGridPageProps) => (
  <>
    <PageIntro id="data-grid-page" copy={copy.pages.dataGrid} />
    {payload && (
      <DataTableSection
        section={copy.sections.table}
        dataGridCard={copy.dataGridCard}
        customGridCopy={copy.customGrid}
        headers={copy.tableHeaders}
        rows={payload.deliveryRows}
        gridRows={payload.portfolioGridRows}
      />
    )}
  </>
);
