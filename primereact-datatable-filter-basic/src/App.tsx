/* eslint-disable @typescript-eslint/no-explicit-any */
import { DataTable } from 'primereact/datatable'
import './App.css'
import { useEffect, useState } from 'react';
import { CustomerService } from './service/CustomerService';
import { Column } from 'primereact/column';
import { MultiSelect } from 'primereact/multiselect';
import { FilterMatchMode } from 'primereact/api';
import { InputText } from 'primereact/inputtext';
import { Tag } from 'primereact/tag';
import { Dropdown } from 'primereact/dropdown';
import { TriStateCheckbox } from 'primereact/tristatecheckbox';
import { classNames } from 'primereact/utils';

function App() {
  const [customers, setCustomers] = useState(null);
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    'country.name': { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    representative: { value: null, matchMode: FilterMatchMode.IN },
    status: { value: null, matchMode: FilterMatchMode.EQUALS },
    verified: { value: null, matchMode: FilterMatchMode.EQUALS }
  });
  const [loading, setLoading] = useState(false);
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [representatives] = useState([
    { name: 'Amy Elsner', image: 'amyelsner.png' },
    { name: 'Anna Fali', image: 'annafali.png' },
    { name: 'Asiya Javayant', image: 'asiyajavayant.png' },
    { name: 'Bernardo Dominic', image: 'bernardodominic.png' },
    { name: 'Elwin Sharvill', image: 'elwinsharvill.png' },
    { name: 'Ioni Bowcher', image: 'ionibowcher.png' },
    { name: 'Ivan Magalhaes', image: 'ivanmagalhaes.png' },
    { name: 'Onyama Limba', image: 'onyamalimba.png' },
    { name: 'Stephen Shaw', image: 'stephenshaw.png' },
    { name: 'XuXue Feng', image: 'xuxuefeng.png' }
  ]);
  const [statuses] = useState(['unqualified', 'qualified', 'new', 'negotiation', 'renewal']);

  const getSeverity = (status: string) => {
    switch (status) {
      case 'unqualified':
        return 'danger';

      case 'qualified':
        return 'success';

      case 'new':
        return 'info';

      case 'negotiation':
        return 'warning';

      case 'renewal':
        return null;
    }
  };

  useEffect(() => {
    CustomerService.getCustomers().then((data: any) => {
      setCustomers(getCustomers(data));
    });
  }, []);

  const getCustomers = (data: any) => {
    return [...(data || [])].map((d) => {
      d.date = new Date(d.date);

      return d;
    });
  };

  const onGlobalFilterChange = (e: any) => {
    const value = e.target.value;
    const _filters: any = { ...filters };

    _filters['global'].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const renderHeader = () => {
    return (
      <div className="flex justify-content-end">
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Keyword Search" />
        </span>
      </div>
    );
  };
  const header = renderHeader();

  const countryBodyTemplate = (rowData: any) => {
    return (
      <div className="flex align-items-center gap-2">
        <img alt="flag" src="flag_placeholder.png" className={`flag flag-${rowData.country.code}`} style={{ width: '24px' }} />
        <span>{rowData.country.name}</span>
      </div>
    );
  };

  const representativeBodyTemplate = (rowData: any) => {
    const representative = rowData.representative;

    return (
      <div className="flex align-items-center gap-2">
        <img alt={representative.name} src={`https://primefaces.org/cdn/primereact/images/avatar/${representative.image}`} width="32" />
        <span>{representative.name}</span>
      </div>
    );
  };

  const representativesItemTemplate = (option: any) => {
    return (
      <div className="flex align-items-center gap-2">
        <img alt={option.name} src={`https://primefaces.org/cdn/primereact/images/avatar/${option.image}`} width="32" />
        <span>{option.name}</span>
      </div>
    );
  };

  const representativeRowFilterTemplate = (options: any) => {
    return (
      <MultiSelect
        value={options.value}
        options={representatives}
        itemTemplate={representativesItemTemplate}
        onChange={(e) => options.filterApplyCallback(e.value)}
        optionLabel="name"
        placeholder="Any"
        className="p-column-filter"
        maxSelectedLabels={1}
        style={{ minWidth: '14rem' }}
      />
    );
  };

  const statusRowFilterTemplate = (options: any) => {
    return (
      <Dropdown value={options.value} options={statuses} onChange={(e) => options.filterApplyCallback(e.value)} itemTemplate={statusItemTemplate} placeholder="Select One" className="p-column-filter" showClear style={{ minWidth: '12rem' }} />
    );
  };

  const statusBodyTemplate = (rowData: any) => {
    return <Tag value={rowData.status} severity={getSeverity(rowData.status)} />;
  };

  const statusItemTemplate = (option: any) => {
    return <Tag value={option} severity={getSeverity(option)} />;
  };

  const verifiedBodyTemplate = (rowData: any) => {
    return <i className={classNames('pi', { 'true-icon pi-check-circle': rowData.verified, 'false-icon pi-times-circle': !rowData.verified })}></i>;
  };

  const verifiedRowFilterTemplate = (options: any) => {
    return <TriStateCheckbox value={options.value} onChange={(e) => options.filterApplyCallback(e.value)} />;
  };

  return (
    <>
      <h1>Datatable with Filter basic</h1>
      <DataTable value={customers} paginator rows={8} dataKey="id" filters={filters} filterDisplay="row" loading={loading} removableSort
        globalFilterFields={['name', 'country.name', 'representative.name', 'status']} header={header} emptyMessage="No customers found.">
        <Column field="name" header="Name" sortable filter filterPlaceholder="Search by name" style={{ minWidth: '12rem' }} />
        <Column field="country.name" body={countryBodyTemplate} header="Country" filterField="country.name" style={{ minWidth: '12rem' }} sortable filter filterPlaceholder="Search by country" />
        <Column field="representative.name" body={representativeBodyTemplate} header="Agent" filterField="representative" showFilterMenu={false} filterMenuStyle={{ width: '14rem' }} style={{ minWidth: '14rem' }}
          sortable filter filterElement={representativeRowFilterTemplate} />
        <Column field="status" body={statusBodyTemplate} header="Status" showFilterMenu={false} filterMenuStyle={{ width: '14rem' }} style={{ minWidth: '12rem' }}
          sortable filter filterElement={statusRowFilterTemplate} />
        <Column field="verified" body={verifiedBodyTemplate} header="Verified" dataType="boolean" style={{ minWidth: '6rem' }} sortable filter filterElement={verifiedRowFilterTemplate} />
      </DataTable>
    </>
  )
}

export default App
